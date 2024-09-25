from typing import Any, List, Optional, Union
from typing_extensions import Annotated
from pydantic import BaseModel, Field
from llama_cpp.llama_types import (
    ChatCompletionRequestMessage,
    ChatCompletionTool,
    ChatCompletionToolChoiceOption,
    ChatCompletionRequestResponseFormat,
    ChatCompletionFunction,
    ChatCompletionRequestFunctionCall
)

class Llama31KorChatRequest(BaseModel):
    '''
    JSON <-> Function Argument
    fields were cherry-picked from method llama_cpp.llama.Llama.create_chat_completion
    '''
    messages: List[ChatCompletionRequestMessage]
    temperature: Optional[float] = None
    functions: Optional[List[ChatCompletionFunction]] = None
    function_call: Optional[ChatCompletionRequestFunctionCall] = None
    stream: Optional[bool] = None
    presence_penalty: Optional[float] = None
    frequency_penalty: Optional[float] = None
    repeat_penalty: Optional[float] = None
    tools: Optional[List[ChatCompletionTool]] = None
    tool_choice: Optional[ChatCompletionToolChoiceOption] = None
    stop: Optional[Union[str, List[str]]] = None
    seed: Optional[int] = None
    response_format: Optional[ChatCompletionRequestResponseFormat] = None
    max_tokens: Optional[int] = None #all n_ctx