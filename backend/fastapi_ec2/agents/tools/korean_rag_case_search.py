from langchain_postgres import PGVector
from langchain.tools.retriever import create_retriever_tool

from .embedding_proxy import EmbeddingProxy

def korean_rag_case_search(db_url, gpu_url, **retriever_kwargs):
    embedder = EmbeddingProxy(url=gpu_url)
    vector_store = PGVector(
        embeddings=embedder,
        collection_name="case_vector",
        connection="postgresql+psycopg://" + db_url,
        use_jsonb=True,
    )        
    tool = create_retriever_tool(
        vector_store.as_retriever(**retriever_kwargs),
        "korean_rag_case_search",
        "판례 RAG 검색기입니다. user의 상황을 설명하는 한국어 query를 제공하면 비슷한 상황의 판례를 검색하여 제공합니다.",
    )
    return tool