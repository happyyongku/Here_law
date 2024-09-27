import uvicorn
from fastapi import FastAPI
from router.chat_router import chat_router
from router.embed_router import embed_router

app = FastAPI()

app.include_router(chat_router, prefix="/fastapi_ec2/chat")
app.include_router(embed_router, prefix="/fastapi_ec2/embedding")

@app.get('/fastapi_ec2/')
def test():
    return {'messages':'Connected'}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8100)

