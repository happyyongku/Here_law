import uvicorn
from fastapi import FastAPI
from router.chat_router import chat_router
from router.clause_router import clause_analysis_router
from router.sojang_router import sojang_router
from router.shearch_router import case_router

app = FastAPI()

app.include_router(chat_router, prefix="/fastapi_ec2/chat")
app.include_router(clause_analysis_router, prefix="/fastapi_ec2/clause")
app.include_router(sojang_router, prefix="/fastapi_ec2/sojang")
app.include_router(case_router, prefix="/fastapi_ec2/case")

@app.get('/fastapi_ec2/')
def test():
    return {'messages':'Connected'}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8100)

