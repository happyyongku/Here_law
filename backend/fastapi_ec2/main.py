import os
import uvicorn
from fastapi import FastAPI
from router.chat_router import chat_router

import logging

app = FastAPI()
app.include_router(chat_router, prefix="/fastapi_ec2/chat")

if __name__ == "__main__":
  uvicorn.run(app, host="0.0.0.0", port=8000)