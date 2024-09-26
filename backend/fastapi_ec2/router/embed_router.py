from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import RootModel
import os
import requests

embed_router = APIRouter()

GPU_SERVER_URL = os.environ.get("GPU_SERVER_URL")

EmbedRequestModel = RootModel[List[str]]

@embed_router.post("/embed")
def get_embedding(request: EmbedRequestModel):
  try:
      response = requests.post(f"{GPU_SERVER_URL}/v1/embed", json=request.root)
      response.raise_for_status()
      return response.json()
  except requests.exceptions.RequestException as e:
    raise HTTPException(status_code=500, detail=str(e))