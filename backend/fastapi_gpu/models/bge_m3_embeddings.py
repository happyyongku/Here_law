from typing import List
import torch
from torch import Tensor
from transformers import AutoTokenizer, AutoModel
from langchain_core.embeddings import Embeddings

class BGEM3Embeddings(Embeddings):
    """
    RAG용 BGE-M3 임베딩 모델.
    """
    
    def __init__(self, device: torch.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu'), chunk_size: int = 128):
        """
        생성자.

        Args:
            device (Union[str, torch.device], optional): The device to run the model on. 
                If None, it will use CUDA if available, else CPU. Defaults to None.
            chunk_size (int, optional): 한번에 처리할 batch 크기. 메모리 상황에 따라 유동적으로 조절.
        """
        self.model = AutoModel.from_pretrained("upskyy/bge-m3-korean")
        self.tokenizer = AutoTokenizer.from_pretrained("upskyy/bge-m3-korean")    
        self.device = torch.device(device)
        self.model = self.model.to(self.device)
        self.chunk_size = chunk_size

    def mean_pooling(self, model_output: Tensor, attention_mask: Tensor) -> Tensor:
        token_embeddings = model_output[0]
        input_mask_expanded = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
        return torch.sum(token_embeddings * input_mask_expanded, 1) / torch.clamp(input_mask_expanded.sum(1), min=1e-9)

    def embed_chunk(self, texts: List[str]) -> List[List[float]]:
        """
        Embed a chunk of texts.

        Args:
            texts (List[str]): A list of texts to embed.

        Returns:
            List[List[float]]: A list of embeddings.
        """
        encoded_input = self.tokenizer(texts, padding=True, truncation=True, return_tensors="pt").to(self.device)
        with torch.no_grad():
            model_output = self.model(**encoded_input)
        sentence_embeddings = self.mean_pooling(model_output, encoded_input["attention_mask"])
        return [tensor.tolist() for tensor in sentence_embeddings]

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """
        Embed a list of documents.

        Args:
            texts (List[str]): A list of texts to embed.

        Returns:
            List[List[float]]: A list of embeddings.
        """
        embeddings = []
        for i in range(0, len(texts), self.chunk_size):
            chunk = texts[i:i + self.chunk_size]
            chunk_embeddings = self.embed_chunk(chunk)
            embeddings.extend(chunk_embeddings)
            
            if self.device.type == 'cuda':
                torch.cuda.empty_cache()
             
        return embeddings

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