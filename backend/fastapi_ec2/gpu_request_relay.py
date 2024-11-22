#로컬에서 테스트 할 때는 GPU서버를 사용할 수 없다.
# GPU 서버는 특정 IP 에서의 요청만 받기 때문이다.
# 따라서 해당 IP 서버에서 이 Script FastAPI를 실행해 요청을 중계해줘야 함.
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import os
import httpx

app = FastAPI()

TARGET_SERVER_URL = os.environ["EMBEDDER_URL"]

@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy(request: Request, path: str):
    # Prepare the full URL for the target server
    target_url = f"{TARGET_SERVER_URL}/{path}"

    # Extract method and headers
    method = request.method
    headers = dict(request.headers)

    # Get the request body if applicable
    body = await request.body()

    async with httpx.AsyncClient() as client:
        # Forward the request to the target server
        response = await client.request(
            method=method,
            url=target_url,
            headers=headers,
            content=body
        )

    # Check if the response is in JSON format
    try:
        json_response = response.json()
        return JSONResponse(content=json_response, status_code=response.status_code, headers=dict(response.headers))
    except ValueError:
        # Return plain text if the response is not JSON
        return response.text, response.status_code, response.headers.items()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ["PORT"]))