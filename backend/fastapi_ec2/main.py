import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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

# origins = [
#   # "*"
#   "https://j11b109.p.ssafy.io",
#   "http://3.36.85.129",
#   "http://localhost"
# ]

# app.add_middleware(
#   CORSMiddleware,
#   allow_origins = origins,
#   allow_credentials=True,
#   allow_method=["*"],
#   allow_headers=["*"]
# )

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

if __name__ == "__main__":
  uvicorn.run(app, host="0.0.0.0", port=8000)
