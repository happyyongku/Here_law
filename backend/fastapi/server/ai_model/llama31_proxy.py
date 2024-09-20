from typing import Dict
from langchain_community.chat_models.llamacpp import ChatLlamaCpp
from langchain_core.pydantic_v1 import root_validator

from .llama31_client import Llama31Client

class Llama31Proxy(ChatLlamaCpp):
    """
    Llama모델 (from llama_cpp import Llama) 를 원격 서버에서 실행하는 Override.
    LangChain에서 제공하는 llamacpp chatbot(langchain_community.chat_models.llamacpp.ChatLlamaCpp) 을 따르되, llm call만 원격 통신으로 바꾼다.
    """
    model_path: str = "Dummy" #ChatLlamaCpp 가 이걸 요구해서 어쩔 수 없이 더미 값 집어넣음
    url: str

    @root_validator(pre=False, skip_on_failure=True)
    def validate_environment(cls, values: Dict) -> Dict:
        """Validate that llama-cpp-python library is installed."""
        try:
            from llama_cpp import LlamaGrammar
        except ImportError:
            raise ImportError(
                "Could not import llama-cpp-python library. "
                "Please install the llama-cpp-python library to "
                "use this embedding model: pip install llama-cpp-python"
            )
        the_url = values["url"]
        # For backwards compatibility, only include if non-null.
        try:
            values["client"] = Llama31Client(the_url)
        except Exception as e:
            raise ValueError(
                f"연결 실패: {the_url}. "
                f"Received error {e}"
            )

        # duplicated code from the original class
        if values["grammar"] and values["grammar_path"]:
            grammar = values["grammar"]
            grammar_path = values["grammar_path"]
            raise ValueError(
                "Can only pass in one of grammar and grammar_path. Received "
                f"{grammar=} and {grammar_path=}."
            )
        elif isinstance(values["grammar"], str):
            values["grammar"] = LlamaGrammar.from_string(values["grammar"])
        elif values["grammar_path"]:
            values["grammar"] = LlamaGrammar.from_file(values["grammar_path"])
        else:
            pass
        return values