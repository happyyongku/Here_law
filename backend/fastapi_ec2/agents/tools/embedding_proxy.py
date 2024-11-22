from typing import List
from pydantic import RootModel
from langchain_core.embeddings import Embeddings
import requests
import logging

EmbedRequestModel = RootModel[List[str]]
EmbedResponseModel = RootModel[List[List[float]]]

class EmbeddingProxy(Embeddings):

    def __init__(self, url):
        self.url = url
        logging.debug(f"EmbeddingProxy: url {url} 로 EmbeddingProxy를 생성했습니다.")

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """
        Embed a list of documents.

        Args:
            texts (List[str]): A list of texts to embed.

        Returns:
            List[List[float]]: A list of embeddings.
        """
        request = EmbedRequestModel(texts)
        response = requests.post(f"{self.url}/embed", json=request.model_dump(), timeout=None)
        return EmbedResponseModel.model_validate_json(response.text).root

    def embed_query(self, text: str) -> List[float]:
        """
        Embed a single query text.

        Args:
            text (str): The text to embed.

        Returns:
            List[float]: The embedding of the input text.
        """
        return self.embed_documents([text])[0]

    # Async methods
    async def aembed_documents(self, texts: List[str]) -> List[List[float]]:
        """
        Asynchronously embed a list of documents.

        임시로 일단 synchronous version을 그냥 Call 하게 해 놓음.

        Args:
            texts (List[str]): A list of texts to embed.

        Returns:
            List[List[float]]: A list of embeddings.
        """
        return self.embed_documents(texts)

    async def aembed_query(self, text: str) -> List[float]:
        """
        Asynchronously embed a single query text.

        임시로 일단 synchronous version을 그냥 Call 하게 해 놓음.

        Args:
            text (str): The text to embed.

        Returns:
            List[float]: The embedding of the input text.
        """
        return self.embed_query(text)