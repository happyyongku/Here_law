import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from router.bill_router import bill_router
from router.search_router import case_router
from router.chat_router import chat_router
from router.clause_router import clause_analysis_router
from router.sojang_router import sojang_router
from router.magazine_router import magazine_router
from router.get_newbill_router import new_bill_router
from router.news_router import news_router

from utils.magazine_update_daemon import MagazineUpdateDaemon
from utils.law_update_daemon import LawUpdateDaemon

import logging

app = FastAPI()

origins = [
  # "*"
  "https://j11b109.p.ssafy.io",
  "http://3.36.85.129",
  "http://localhost:5173",
  "http://192.168.31.217:5173"
]

app.add_middleware(
  CORSMiddleware,
  allow_origins = origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"]
)

app.include_router(chat_router, prefix="/fastapi_ec2/chat")
app.include_router(clause_analysis_router, prefix="/fastapi_ec2/clause")
app.include_router(case_router, prefix="/fastapi_ec2/case")
app.include_router(magazine_router, prefix="/fastapi_ec2/magazine")
app.include_router(bill_router, prefix='/fastapi_ec2/bill')
app.include_router(new_bill_router, prefix='/fastapi_ec2/new_bill')
app.include_router(news_router, prefix='/fastapi_ec2/news')
app.include_router(sojang_router, prefix='/fastapi_ec2/sojang')

#Daemon 실행
UPDATE_INTERVAL = 3600*12 #TODO: Envlize this
law_daemon = LawUpdateDaemon(law_api_key="ngho1202")
magazine_daemon = MagazineUpdateDaemon(openai_api_key=os.environ["API_KEY"])

@app.post('/fastapi_ec2')
def ai_chat_test(request:dict):
    # {
    #   input_data: inputValue,
    #   session_id: sessionId,
    # }
    if request["input_data"] == "1번":
        result = {
          "session_id": "66057f64-2c81-4097-9390-5a0282b64a9b",
          "ai_message": {
            "content": "안녕하세요, 경민님! 무엇을 도와드릴까요?",
            "additional_kwargs": {
              "refusal": None
            },
            "response_metadata": {
              "token_usage": {
                "completion_tokens": 16,
                "prompt_tokens": 1199,
                "total_tokens": 1215,
                "completion_tokens_details": {
                  "reasoning_tokens": 0
                },
                "prompt_tokens_details": {
                  "cached_tokens": 1024
                }
              },
              "model_name": "gpt-4o-2024-08-06",
              "system_fingerprint": "fp_e5e4913e83",
              "finish_reason": "stop",
              "logprobs": None
            },
            "type": "ai",
            "name": None,
            "id": "run-41ec90bd-7a58-4171-bdb1-9e7e88b201ef-0",
            "example": False,
            "tool_calls": [],
            "invalid_tool_calls": [],
            "usage_metadata": {
              "input_tokens": 1199,
              "output_tokens": 16,
              "total_tokens": 1215
            }
          }
        }
    elif request["input_data"]=="2번":
      result = {
          "session_id": "66057f64-2c81-4097-9390-5a0282b64a9b",
          "tool_message": {
            "content": "이 사건은 물건의 소유권과 관련된 법률 문제로, 특히 동산의 소유권 취득에 대한 이야기를 다루고 있다. 먼저, 동산의 소유권을 취득하기 위해서는 기본적으로 점유인도가 필요하다는 점을 설명하고 있다. 그리고 저당권과 관련된 경우에는 이러한 규칙이 적용되지 않는다는 점도 언급된다. \n\n또한, 만약 어떤 물건이 부동산과 분리될 수 없을 정도로 밀접하게 연결되어 있다면, 그 물건의 소유권은 그 부동산의 소유자에게 귀속된다는 내용이 있다. 이는 타인이 권리를 가지고 해당 물건을 부동산에 결합시켰더라도 변하지 않는 원칙이다.\n\n결국 배심원들은 이러한 점들을 고려한 후, 사건의 결론을 내렸다.\n\n이 사건에서 피고는 자신이 부동산을 소유하겠다는 의사로 평온하게 점유하고 있었고, 이로 인해 소유권을 취득했다고 주장했습니다. 원고는 현재 피고가 해당 부동산을 점유하고 있는 사실을 인정하고 있습니다. 따라서 재판부는 피고가 언제부터 부동산을 점유했는지에 대한 정보를 요청하고, 그에 대한 입증을 요구해야 했습니다. 결국 배심원은 피고의 주장을 인정하며 그가 소유권을 가질 수 있도록 판단했습니다.\n\n이 사건은 명의신탁된 부동산의 소유권에 관한 것으로, 수탁자 명의로 등록된 부동산의 소유권이 대외적으로 수탁자에게 귀속된다는 점이 주요 쟁점이었다. 수탁자는 부동산의 실제 소유자인 명의신탁자로부터 해당 부동산을 구매했지만, 이는 내부적으로 소유권을 취득한 것일 뿐 외부적으로 소유권이나 등록된 명의에 변화가 없었다. 이로 인해 부동산을 점유한 사람이 시효에 따라 소유권을 주장할 수 있는 상황이 발생하였다. 결국 배심원은 이러한 상황을 고려하여, 시효취득자가 기존 소유자를 상대로 소유권 이전 절차를 요구할 수 있다는 결정을 내렸다.\n\n부동산에 대해 일정 기간 점유한 사람은 소유권을 주장할 수 있게 되지만, 이 소유권을 공식적으로 등록하지 않는 동안 제3자로 통해 소유권이 이전되면 점유자는 그 제3자에게는 소유권을 주장할 수 없습니다. 그러나 점유자가 이전 소유자에게 가지는 소유권 청구권은 여전히 유지됩니다. 이후에 소유권이 다시 회복되면, 점유자는 그 소유자에게 본인의 소유권을 주장할 수 있게 됩니다. 사건에 대한 배심원의 결정은 점유자가 이전 소유자에게 소유권을 주장할 수 있는 권리가 있다고 판단했습니다.",
            "additional_kwargs": {},
            "response_metadata": {},
            "type": "tool",
            "name": "korean_rag_case_search",
            "id": "2eef3722-13f0-4fbb-9a26-3eaa24636c68",
            "tool_call_id": "call_MKfvBmPEuZlsgvcrDWodrDfp",
            "artifact": [
              "206064",
              "86474",
              "105786",
              "205227"
            ],
            "status": "success"
          },
          "ai_message": {
            "content": "소유권과 관련된 판례를 요약해 드리겠습니다.\n\n1. **동산의 소유권 취득**: 동산의 소유권을 취득하기 위해서는 기본적으로 점유인도가 필요합니다. 그러나 저당권과 관련된 경우에는 이러한 규칙이 적용되지 않습니다. 또한, 어떤 물건이 부동산과 밀접하게 연결되어 있다면 그 물건의 소유권은 부동산의 소유자에게 귀속됩니다.\n\n2. **부동산의 점유와 소유권**: 피고가 부동산을 소유하겠다는 의사로 평온하게 점유하고 있었고, 이로 인해 소유권을 취득했다고 주장한 사건입니다. 재판부는 피고의 점유 기간에 대한 입증을 요구했고, 배심원은 피고의 주장을 인정하여 소유권을 인정했습니다.\n\n3. **명의신탁된 부동산의 소유권**: 수탁자 명의로 등록된 부동산의 소유권이 대외적으로 수탁자에게 귀속된다는 점이 쟁점이었습니다. 시효취득자가 기존 소유자를 상대로 소유권 이전 절차를 요구할 수 있다는 결정이 내려졌습니다.\n\n4. **부동산 점유자의 소유권 주장**: 일정 기간 부동산을 점유한 사람은 소유권을 주장할 수 있지만, 공식적으로 등록하지 않는 동안 제3자에게 소유권이 이전되면 그 제3자에게는 소유권을 주장할 수 없습니다. 그러나 점유자가 이전 소유자에게 가지는 소유권 청구권은 유지됩니다.\n\n이러한 판례들은 소유권과 관련된 다양한 상황에서의 법적 판단을 보여줍니다. 추가적인 정보나 다른 주제에 대한 판례가 필요하시면 말씀해 주세요!",
            "additional_kwargs": {
              "refusal": None
            },
            "response_metadata": {
              "token_usage": {
                "completion_tokens": 405,
                "prompt_tokens": 1903,
                "total_tokens": 2308,
                "completion_tokens_details": {
                  "reasoning_tokens": 0
                },
                "prompt_tokens_details": {
                  "cached_tokens": 1152
                }
              },
              "model_name": "gpt-4o-2024-08-06",
              "system_fingerprint": "fp_e5e4913e83",
              "finish_reason": "stop",
              "logprobs": None
            },
            "type": "ai",
            "name": None,
            "id": "run-f7e57886-cdbb-4de6-86e7-9b607bfae7b9-0",
            "example": None,
            "tool_calls": [],
            "invalid_tool_calls": [],
            "usage_metadata": {
              "input_tokens": 1903,
              "output_tokens": 405,
              "total_tokens": 2308
            }
          }
        }
    else:
      result = {
        "message":"result",
        "content":"ok"
      }
    return JSONResponse(result)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
