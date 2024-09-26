#     언어모델. 및 Embedding.
#     기반 모델은
#         meetkai 의 functionary-small-v3.2 8b 또는
#         functionary-medium-v3.2 70b 를 사용한다.
#     이를 법률 데이터에 맞춰 Unsloth로 fine-tuning한 모델을 최종적으로 load하여 사용한다.
import sys
import os

from llama_cpp import Llama, ChatCompletionResponseMessage
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi_shared import (CreateChatCompletionStreamResponseModel,
                    Llama31KorChatRequest,
                    CreateChatCompletionResponseModel,
                    EmbedRequestModel,
                    EmbedResponseModel
                    )

import time
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from typing import Iterator, AsyncIterator
from transformers import AutoTokenizer
import uvicorn
import torch
import asyncio

from models.bge_m3_embeddings import BGEM3Embeddings



from llama_cpp.llama_types import CreateChatCompletionStreamResponse, ChatCompletionResponseChoice, CreateCompletionResponse
from functionary.prompt_template import get_prompt_template_from_tokenizer

#

# Initialize models and tokenizers
bge_m3 = BGEM3Embeddings(device=torch.device('cpu'))
llm = Llama(model_path=os.environ["LLM_MODEL_PATH"], n_ctx=int(os.environ["LLM_N_CTX"]), n_batch = int(os.environ["LLM_BATCH"]), n_gpu_layers =-1)
llm_tokenizer = AutoTokenizer.from_pretrained(os.environ["LLM_MODEL_BASE_REPO_ID"], legacy=True)

prompt_template = get_prompt_template_from_tokenizer(llm_tokenizer)

app = FastAPI()

async def _async_stream_generator(stream: Iterator[CreateChatCompletionStreamResponse]) -> AsyncIterator[str]:
    """
    Steaming 모드에서 llm이 실시간으로 생성하는 토큰 하나하나를 전송하기 위한 SSE-compatible response generator.
    """
    for chunk in stream:
        yield f"data: {CreateChatCompletionStreamResponseModel(chunk).model_dump_json()}\n\n"
        await asyncio.sleep(0)  # 코루틴의 다른 작업이 실행될 수 있도록 함
    yield "data: [DONE]\n\n"

@app.post("/v1/chat/completions")
async def chat_endpoint(request: Llama31KorChatRequest):
    try:
        request.messages.append({"role": "assistant"}) #Makes Output as Chat

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


        #what a stupid design
        crude_params = [
            "repeat_penalty", "frequency_penalty", "presence_penalty"
        ]
        inputargs = {}
        inputargs["repeat_penalty"] = float(os.environ["LLM_DEFAULT_REPEAT_PENALY"]) #should be 1.1

        for param in crude_params:
            value = getattr(request, param)
            if value is not None:
                inputargs[param] = value
        tempppp = getattr(request, "temperature")
        if tempppp is not None:
            inputargs["temp"] = tempppp

        prompt_str = prompt_template.get_prompt_from_messages(request.messages, request.tools)
        token_ids = llm_tokenizer.encode(prompt_str)

        gen_tokens = []
        # Get list of stop_tokens
        stop_token_ids = [
            llm_tokenizer.encode(token)[-1] # 마지막 <|eot_id|> 를 제거해서 생성을 유도
            for token in prompt_template.get_stop_tokens_for_generation()
        ]

        start = time.time()
        finish_reason = None #TODO: 이거 숫자가 아니라 str로 바꾸기
        # We use function generate (instead of __call__) so we can pass in list of token_ids
        for token_id in llm.generate(tokens = token_ids, **inputargs):
            if token_id in stop_token_ids:
                finish_reason = token_id
                break
            gen_tokens.append(token_id)
            # print(llm_tokenizer.decode(token_id))
        end = time.time()
        print(f"{end - start:.5f} sec for creating" + str(len(gen_tokens)))
        llm_output = llm_tokenizer.decode(gen_tokens)
        parsed = prompt_template.parse_assistant_response(llm_output)
        choice = ChatCompletionResponseChoice(index=0, message=ChatCompletionResponseMessage(**parsed), finish_reason=finish_reason)
        return CreateCompletionResponse(id="to_be_implemented", object="text_completion", created=0000, model="functionary3.2", choices =[choice])
        # 비동기 Response는 일단 중지
        # if kwargs.get("stream", False):  # 비동기. Use .get() with a default value
        #     return StreamingResponse(_async_stream_generator(response), media_type="text/event-stream")
        # else:
        #     return CreateChatCompletionResponseModel(response).root
    except Exception as e:
        print(f"Error in chat_endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/v1/embed", response_model=EmbedResponseModel)
async def embed_endpoint(request: EmbedRequestModel):
    try:
        embedding = bge_m3.embed_documents(request.root)
        return EmbedResponseModel(embedding).root
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ["LLM_SERVER_PORT"]))