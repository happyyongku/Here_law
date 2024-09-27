import uvicorn
from fastapi import FastAPI
from router.chat_router import chat_router
from router.embed_router import embed_router

app = FastAPI()

app.include_router(chat_router, prefix="/chat")
app.include_router(embed_router, prefix="/embedding")

@app.get('/')
def test():
    return {'messages':'Connected'}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8100)

