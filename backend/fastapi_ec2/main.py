import os
import uvicorn
from fastapi import FastAPI, Request
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
from router.revision_router import revision_router

from utils.magazine_update_daemon import MagazineUpdateDaemon
from utils.law_update_daemon import LawUpdateDaemon

import logging

# Create a logger

logger = logging.getLogger("fastapi_logger")
logger.setLevel(logging.DEBUG)  # Set log level to DEBUG

# Create a file handler to write logs to a file
file_handler = logging.FileHandler("fastapi_debug.log")
file_handler.setLevel(logging.DEBUG)

# Create a logging format
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)

# Add the handlers to the logger
logger.addHandler(file_handler)

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
    allow_origins=origins,  # Specify allowed origins explicitly
    allow_credentials=True,  # This allows Authorization headers or cookies
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers including Authorization
)

@app.middleware("http")
async def log_request_origin(request: Request, call_next):
    origin = request.headers.get("origin")
    print(f"Request Origin: {origin}")
    response = await call_next(request)
    return response

app.include_router(chat_router, prefix="/fastapi_ec2/chat")
app.include_router(clause_analysis_router, prefix="/fastapi_ec2/clause")
app.include_router(case_router, prefix="/fastapi_ec2/case")
app.include_router(magazine_router, prefix="/fastapi_ec2/magazine")
app.include_router(bill_router, prefix='/fastapi_ec2/bill')
app.include_router(new_bill_router, prefix='/fastapi_ec2/new_bill')
app.include_router(news_router, prefix='/fastapi_ec2/news')
app.include_router(sojang_router, prefix='/fastapi_ec2/sojang')
app.include_router(revision_router, prefix='/fastapi_ec2/revision')

#Daemon 실행
UPDATE_INTERVAL = 3600*12 #TODO: Envlize this
law_daemon = LawUpdateDaemon(law_api_key="ngho1202")
magazine_daemon = MagazineUpdateDaemon(openai_api_key=os.environ["API_KEY"])

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
