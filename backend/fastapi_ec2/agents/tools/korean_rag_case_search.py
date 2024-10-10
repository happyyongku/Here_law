from langchain_postgres import PGVector
# from langchain.tools.retriever import create_retriever_tool
from langchain_core.tools import tool
from typing import List, Tuple

from .embedding_proxy import EmbeddingProxy

def korean_rag_case_search_factory(db_url, gpu_url, **retriever_kwargs):
    embedder = EmbeddingProxy(url=gpu_url)
    vector_store = PGVector(
        embeddings=embedder,
        collection_name="case_vector",
        connection="postgresql+psycopg://" + db_url,
        use_jsonb=True,
    )
    retriever = vector_store.as_retriever(**retriever_kwargs)

    @tool(response_format="content_and_artifact")
    def korean_rag_case_search(query: str) -> Tuple[str, List[int]]:
        """판례 RAG 검색기입니다. user의 상황을 설명하는 한국어 query를 제공하면 비슷한 상황의 판례를 검색하여 제공합니다."""
        results = retriever.invoke(query)
        doc_separater = "[doc_separater]"
        result_str = doc_separater
        result_ints = []
        for doc in results:
            result_str = result_str + doc.page_content + doc_separater
            result_ints.append(doc.metadata["id"])
        result_str = result_str.strip(doc_separater)
        return result_str, result_ints

    return korean_rag_case_search