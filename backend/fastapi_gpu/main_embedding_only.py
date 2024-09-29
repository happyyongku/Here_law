import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from typing import List
from pydantic import RootModel



from fastapi import FastAPI, HTTPException
import uvicorn
import torch


from models.bge_m3_embeddings import BGEM3Embeddings

EmbedRequestModel = RootModel[List[str]]
EmbedResponseModel = RootModel[List[List[float]]]

bge_m3 = BGEM3Embeddings(device=torch.device('cpu'))


app = FastAPI()

@app.post("/v1/embed", response_model=EmbedResponseModel)
async def embed_endpoint(request: EmbedRequestModel):
    try:
        embedding = bge_m3.embed_documents(request.root)
        return EmbedResponseModel(embedding).root
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ["LLM_SERVER_PORT"]))