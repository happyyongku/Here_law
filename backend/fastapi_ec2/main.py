import os
import uvicorn
from fastapi import FastAPI
from router.chat_router import chat_router

import logging

FASTAPI_SERVER_PORT = int(os.environ.get("FASTAPI_SERVER_PORT"))

app = FastAPI()
app.include_router(chat_router, prefix="/chat")

if __name__ == "__main__":
  uvicorn.run(app, host="0.0.0.0", port=FASTAPI_SERVER_PORT)