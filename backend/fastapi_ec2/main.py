import os
import uvicorn
from fastapi import FastAPI
from router.chat_router import chat_router
from router.clause_router import clause_analysis_router
from router.search_router import case_router
from router.magazine_router import router as magazine_router
from router.bill_router import bill_router
from utils.law_update_daemon import LawUpdateDaemon
from utils.magazine_update_daemon import MagazineUpdateDaemon
import logging

app = FastAPI()

app.include_router(chat_router, prefix="/fastapi_ec2/chat")
app.include_router(clause_analysis_router, prefix="/fastapi_ec2/clause")
app.include_router(case_router, prefix="/fastapi_ec2/case")
app.include_router(magazine_router, prefix="/fastapi_ec2/magazine")
app.include_router(bill_router, prefix='/fastapi_ec2/bill')

#Daemon 실행
UPDATE_INTERVAL = 3600*12 #TODO: Envlize this
law_daemon = LawUpdateDaemon(law_api_key="ngho1202")
magazine_daemon = MagazineUpdateDaemon(openai_api_key=os.environ["API_KEY"])

if __name__ == "__main__":
  uvicorn.run(app, host="0.0.0.0", port=8000)
