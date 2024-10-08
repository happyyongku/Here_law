from token import OP
from langchain_postgres import PGVector
from typing import List, Any, Optional
import os

from agents.tools.embedding_proxy import EmbeddingProxy

from utils.singleton_meta import SingletonMeta
from utils.db_connection import DBConnection
from langchain_core.documents import Document
from langchain_core.vectorstores import VectorStoreRetriever

import logging
from psycopg.rows import dict_row

#이 전역 변수들은 routers.chat_router 에서도 정확히 똑같이 선언되어 있음. 동일한 값 선언에 대한 문제는 잘 모르겠다. 정확히 똑같은 값이기 때문에 문제는 없을 것 같긴 하다.
EMBEDDER_URL = os.environ.get("EMBEDDER_URL", None)
DB_URL = os.environ["DB_USERNAME"]\
    +":"\
    +os.environ["DB_PASSWORD"]\
    +"@"\
    +os.environ["DB_DOMAIN"]\
    +":"\
    +os.environ["DB_PORT_FASTAPI"]\
    +"/"\
    +os.environ["DB_NAME"]

class MagazineVectorDatabase(metaclass=SingletonMeta):
    """
    Singleton class managing magazine-related RAG (Retrieval-Augmented Generation).
    PGVector requires SQLAlchemy objects when creating a vector store, but due to time constraints,
    we are using psycopg3-based connections here.
    """
    COLLECTION_NAME = "magazine"
    ID_PREFIX = COLLECTION_NAME + "_"
    _initialized = False  # Ensure initialization happens only once

    def __init__(self,
                 db_url=DB_URL,
                 gpu_url=EMBEDDER_URL
                 ):
        if not self._initialized:
            self.embedder = EmbeddingProxy(url=gpu_url)
            self.vector_store = PGVector(
                embeddings=self.embedder,
                collection_name=self.COLLECTION_NAME,
                connection="postgresql+psycopg://" + db_url,
                use_jsonb=True,
            )
            self.db_pool = DBConnection()  # psycopg3-based
            self._initialized = True

    def insert_magazine_vector(self, law_id: str, summary_content: Optional[str] = None) -> List[str]:
        """Inserts a vector for a magazine article if it exists and the vector does not already exist."""
        if not self.check_magazine_exists(law_id):
            logging.debug(f"insert_magazine_vector: Article with law_id {law_id} does not exist!")
            return []
        if self.check_vector_exists(law_id):
            logging.debug(f"insert_magazine_vector: Vector for law_id {law_id} already exists.")
            return []
        if summary_content is None:
            logging.debug("insert_magazine_vector: 주어진 요약이 없어 본문 내용을 그대로 사용해 임베딩을 생성합니다.....")
            sql = """
            SELECT content FROM magazines WHERE law_id = %(law_id)s;
            """
            with self.db_pool.get_connection() as conn:
                with conn.cursor(row_factory=dict_row) as cursor:
                    cursor.execute(sql, {'law_id': law_id})
                    summary_content = cursor.fetchone()["content"]
        document = Document(
            page_content=summary_content,
            metadata={"id": law_id}
        )
        return self.vector_store.add_documents([document], ids=[self._get_vector_id(law_id)])

    def get_retriever(self, **retriever_kwargs: Any) -> VectorStoreRetriever:
        """
        Returns a VectorStoreRetriever initialized from this VectorStore.
        """
        return self.vector_store.as_retriever(**retriever_kwargs)
    
    def update_magazine_vector(self, law_id: str, summary_content: Optional[str] = None) -> List[str]:
        """Updates the vector and summary_content for a given law_id if both the article and vector exist."""
        if not self.check_magazine_exists(law_id):
            logging.debug(f"update_magazine_vector: Article with law_id {law_id} does not exist!")
            return []
        if not self.check_vector_exists(law_id):
            logging.debug(f"update_magazine_vector: Vector for law_id {law_id} does not exist!")
            return []
        self.vector_store.delete([self._get_vector_id(law_id)])
        logging.debug(f"update_magazine_vector: Vector for law_id {law_id} 를 업데이트하기 위해 삭제 완료")
        return self.insert_magazine_vector(law_id, summary_content=summary_content)
        
    def delete_magazine_vector(self, law_id: str):
        """Deletes the vector for a given law_id if the article does not exist and the vector exists."""
        if self.check_magazine_exists(law_id):
            logging.debug(f"delete_magazine_vector: Article with law_id {law_id} exists; cannot delete vector.")
            return []
        if not self.check_vector_exists(law_id):
            logging.debug(f"delete_magazine_vector: Vector for law_id {law_id} does not exist!")
            return []
        self.vector_store.delete([self._get_vector_id(law_id)])
    
    def check_magazine_exists(self, law_id: str) -> bool:
        """
        Checks if an article with the given law_id exists in the magazines table.
        """
        sql = """
        SELECT 1 FROM magazines WHERE law_id = %(law_id)s LIMIT 1;
        """
        with self.db_pool.get_connection() as conn:
            with conn.cursor(row_factory=dict_row) as cursor:
                cursor.execute(sql, {'law_id': law_id})
                result = cursor.fetchone()
                exists = result is not None
        logging.debug(f"check_magazine_exists: Article with law_id {law_id} {'exists' if exists else 'does not exist'}.")
        return exists

    def check_vector_exists(self, law_id: str) -> bool:
        """
        Checks if a vector exists for the given law_id.
        """
        vector_id = self._get_vector_id(law_id)
        vectors = self.vector_store.get_by_ids([vector_id])
        exists = len(vectors) > 0
        logging.debug(f"check_vector_exists: Vector for law_id {law_id} {'exists' if exists else 'does not exist'}.")
        return exists
    
    @classmethod
    def _get_vector_id(cls, law_id: str):
        return cls.ID_PREFIX + law_id
