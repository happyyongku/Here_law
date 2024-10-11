import os
from fastapi import APIRouter, HTTPException, UploadFile, File
import requests
import uuid
import time
import json
from openai import OpenAI


# FastAPI Router 생성
clause_analysis_router = APIRouter()

# NAVER CLOVA OCR API 설정
api_url = os.environ.get("CLOVA_URL")
secret_key = os.environ.get("CLOVA_KEY")

# OpenAI API 설정
OPENAI_API_KEY = os.environ["API_KEY"]
client = OpenAI(api_key=OPENAI_API_KEY)

# OCR 요청 함수
def ocr_request(image_file):
    request_json = {
        'images': [
            {
                'format': 'jpg',
                'name': 'demo'
            }
        ],
        'requestId': str(uuid.uuid4()),
        'version': 'V2',
        'timestamp': int(round(time.time() * 1000))
    }

    payload = {'message': json.dumps(request_json).encode('UTF-8')}
    files = [('file', image_file)]
    headers = {'X-OCR-SECRET': secret_key}

    response = requests.post(api_url, headers=headers, data=payload, files=files)
    
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="OCR 요청 실패")
    
    return response.json()

# 텍스트 정렬 함수
def wrap_text(text, max_len=50):
    lines = []
    while len(text) > max_len:
        split_index = text[:max_len].rfind(' ')
        if split_index == -1:
            split_index = max_len
        lines.append(text[:split_index])
        text = text[split_index:].strip()
    lines.append(text)
    return "\n".join(lines)

# OpenAI API로 계약서 조항 분석 함수
def analyze_clause(ocr_text, example_format):
    prompt = f"""
    
    다음 약관 조항에 사용자에게 불리한 조항이 포함되어 있는지 근거를 들어서 분석해. 예시 내용과 Query 를 혼동하는 등의 환각에 주의할 것.
    
    약관:
    {ocr_text}

    대답 형식 예시:
    {example_format}"""
    
    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "당신은 한국의 법률 문서 분석 및 작성의 전문가입니다."},
            {"role": "user", "content": prompt}
        ]
    )
    
    return completion.choices[0].message.content

# 계약서 OCR 및 분석 API 엔드포인트 (이미지 파일 받기)
@clause_analysis_router.post("/analyze-clause")
async def analyze_contract_clause(file: UploadFile = File(...)):
    # 이미지 파일을 읽어서 OCR 처리
    print(f"Uploaded file : {file.filename}")
    ocr_response = ocr_request(file.file)
    
    # OCR 결과에서 텍스트 추출 및 정렬
    ocr_text = " ".join([i['inferText'] for i in ocr_response['images'][0]['fields']])
    formatted_text = wrap_text(ocr_text)

    # 예시 텍스트 형식
    example_format = """
    
    1. 불리한 조항:
        - 
        - 
    
    2. 결론:
        -
        
    형식의 마크다운 형식으로 작성해 주세요 숫자와 - 말고 다른 마크다운을 사용하면 안됩니다.
    불리한 조항은 불리한 조항과 불리한 이유를 항상 같이 설명해야합니다.
    """

    # OpenAI API로 조항 분석
    analysis_result = analyze_clause(formatted_text, example_format)

    return {"analysis": analysis_result}