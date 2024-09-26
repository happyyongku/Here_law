from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import requests

chat_router = APIRouter()

# GPU 서버 설정
GPU_SERVER_URL = os.environ.get("GPU_SERVER_URL")

class ChatRequest(BaseModel):
  input_data : str
  

@chat_router.post("/predict")
def get_prediction(request: ChatRequest):
  try:
      response = requests.post(f'{GPU_SERVER_URL}/v1/chat/completions', json={"messages": [{"role": "user", "content": request.input_data}]})
      response.raise_for_status() #응답에러 발생시 예외처리
      return response.json()
  except requests.exceptions.RequestException as e:
    raise HTTPException(status_code=500, detail=str(e))