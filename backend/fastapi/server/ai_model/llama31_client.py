from llama_cpp.llama_types import CreateChatCompletionResponse, CreateChatCompletionStreamResponse
from shared import (CreateChatCompletionStreamResponseModel,
                    Llama31KorChatRequest,
                    CreateChatCompletionResponseModel,
                    )
from typing import Iterator, Union
import requests

class Llama31ConnectionError(Exception):
    pass

class Llama31Client:
    def __init__(self, url: str):
        self.url = url
        self._check_connection()

    def _check_connection(self):
        try:
            # Minimal chat request for connection check
            
            test_request = Llama31KorChatRequest(
                messages=[{"role": "user", "content": "Hello"}],
                max_tokens=10,
            )
            print("checking connection using: ", test_request.model_dump_json())
            response = requests.post(f"{self.url}/chat", 
                                     json=test_request.model_dump(), 
                                     timeout=20)
            if response.status_code != 200:
                raise Llama31ConnectionError(f"Server returned status code {response.status_code}")
            # Try to parse the response to ensure it's valid
            CreateChatCompletionResponseModel.model_validate_json(response.text)
        except requests.RequestException as e:
            raise Llama31ConnectionError(f"Failed to connect to {self.url}: {str(e)}")
        except ValueError as e:
            raise Llama31ConnectionError(f"Server returned invalid response: {str(e)}")

    def create_chat_completion(self, messages, **kwargs) -> Union[
        CreateChatCompletionResponse,
        Iterator[CreateChatCompletionStreamResponse]
    ]:
        '''
        Disguised Wrapper
        '''
        kwargs["messages"] = messages
        print(kwargs)
        print("-----------------------------------------------")
        arg_model = Llama31KorChatRequest(**kwargs)
        print(arg_model.model_dump_json())
        if arg_model.stream:
            return self._stream_chat_responses(arg_model)
        return self._chat_responses(arg_model)

    def _process_sse_stream(self, response: requests.Response) -> Iterator[CreateChatCompletionStreamResponse]:
        for line in response.iter_lines():
            if line:
                line = line.decode('utf-8')
                if line.startswith("data: "):
                    data = line[6:]
                    if data.strip() == "[DONE]":
                        break
                    try:
                        chat_response = CreateChatCompletionStreamResponseModel.model_validate_json(data).root
                        yield chat_response
                    except ValueError as e:
                        print(f"Error parsing JSON: {e}")

    def _stream_chat_responses(self, request: Llama31KorChatRequest) -> Iterator[CreateChatCompletionStreamResponse]:
        response = requests.post(f"{self.url}/chat", json=request.model_dump(), stream=True, timeout=None)
        return self._process_sse_stream(response)

    def _chat_responses(self, request: Llama31KorChatRequest) -> CreateChatCompletionResponse:
        response = requests.post(f"{self.url}/chat", json=request.model_dump(), timeout=None)
        return CreateChatCompletionResponseModel.model_validate_json(response.text).root