import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from shared import (CreateChatCompletionStreamResponseModel,
                    Llama31KorChatRequest,
                    CreateChatCompletionResponseModel,
                    EmbedRequestModel,
                    EmbedResponseModel
                    )
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from typing import Iterator, AsyncIterator
import uvicorn
import torch
import asyncio

from bge_m3_embeddings import BGEM3Embeddings
from llama31kor_chatbot import Llama31KorChatbot


from llama_cpp.llama_types import CreateChatCompletionStreamResponse

# Initialize models
bge_m3 = BGEM3Embeddings(device=torch.device('cpu'))
llm = Llama31KorChatbot(n_ctx=8192, n_batch = 512)

app = FastAPI()

async def async_stream_generator(stream: Iterator[CreateChatCompletionStreamResponse]) -> AsyncIterator[str]:
    """
    Steaming 모드에서 llm이 실시간으로 생성하는 토큰 하나하나를 전송하기 위한 SSE-compatible response generator.
    """
    for chunk in stream:
        yield f"data: {CreateChatCompletionStreamResponseModel(chunk).model_dump_json()}\n\n"
        await asyncio.sleep(0)  # 코루틴의 다른 작업이 실행될 수 있도록 함
    yield "data: [DONE]\n\n"

@app.post("/chat")
async def chat_endpoint(request: Llama31KorChatRequest):
    try:
        # Start with only the required parameter
        kwargs = {"messages": request.messages}

        # Add optional parameters only if they are not None
        optional_params = [
            "temperature", "stream", "presence_penalty", "frequency_penalty",
            "repeat_penalty", "tools", "tool_choice", "stop", "seed",
            "response_format", "max_tokens"
        ]

        for param in optional_params:
            value = getattr(request, param)
            if value is not None:
                kwargs[param] = value

        response = llm.model.create_chat_completion(**kwargs)
        
        if kwargs.get("stream", False):  # 비동기. Use .get() with a default value
            return StreamingResponse(async_stream_generator(response), media_type="text/event-stream")
        else:
            return CreateChatCompletionResponseModel(response).root
    except Exception as e:
        print(f"Error in chat_endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/embed", response_model=EmbedResponseModel)
async def embed_endpoint(request: EmbedRequestModel):
    try:
        embedding = bge_m3.embed_documents(request.root)
        return EmbedResponseModel(embedding).root
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)