from .base_agent import BaseAgent
from .tools.korean_rag_case_search import korean_rag_case_search_factory
import logging

class CaseRagAgent(BaseAgent):
    def __init__(self, db_url, embedder_url, gpu_url=None, api_key=None, temperature=None):
        logging.debug(f"CaseRagAgent: preparing rag tool with db url={db_url} and gpu_url={embedder_url}")
        tools = [
            korean_rag_case_search_factory(db_url=db_url, gpu_url=embedder_url),
        ]
        super().__init__(gpu_url=gpu_url, api_key=api_key, temperature=temperature, tools=tools)