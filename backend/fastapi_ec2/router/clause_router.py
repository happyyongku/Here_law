<<<<<<< HEAD
=======
import os
>>>>>>> c8874eb04376198de72995b39d1ef6f6446fe1cc
from fastapi import APIRouter, HTTPException, UploadFile, File
import requests
import uuid
import time
import json
from openai import OpenAI

# FastAPI Router 생성
clause_analysis_router = APIRouter()

# NAVER CLOVA OCR API 설정
api_url = 'https://t0gyxh4s0b.apigw.ntruss.com/custom/v1/34682/a4ab6ce628c7d82809103dff358791d5362577461f5388a14dd88825641bc382/general'
<<<<<<< HEAD
secret_key = 'UHlQc0lTSHFDelpXc2JmbFBMVkZKaFVKTGhXZlpVU24='

# OpenAI API 설정
OPENAI_API_KEY = "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"
=======
secret_key = 'UHlQc0lTSHFDelpXc2JmbFBMVkZKaFVKTGhXZlpVU24=' #TODO env-lize

# OpenAI API 설정
OPENAI_API_KEY = os.environ["API_KEY"]
>>>>>>> c8874eb04376198de72995b39d1ef6f6446fe1cc
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
    prompt = f""""다음 정보를 바탕으로 약관 조항이 사용자에게 유리한 조항인지 불리한 조항인지 근거를 들어서 분석해 주세요\n{ocr_text}\n이 형식을 참고해 주세요\n{example_format}"""
    
    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "당신은 한국의 법률 문서 작성 전문가입니다."},
            {"role": "user", "content": prompt}
        ]
    )
    
    return completion.choices[0].message.content

# 계약서 OCR 및 분석 API 엔드포인트 (이미지 파일 받기)
@clause_analysis_router.post("/analyze-clause")
async def analyze_contract_clause(file: UploadFile = File(...)):
    # 이미지 파일을 읽어서 OCR 처리
    ocr_response = ocr_request(file.file)
    
    # OCR 결과에서 텍스트 추출 및 정렬
    ocr_text = " ".join([i['inferText'] for i in ocr_response['images'][0]['fields']])
    formatted_text = wrap_text(ocr_text)

    # 예시 텍스트 형식
    example_format = """
    1. 제1조 (총칙): 본 계약서는 한국e스포츠협회의 공식 규정을 준수하며 '회사' 내규에 따라 팀과 '선수'의 관계를 규율하고 e스포츠의 발전을 도모하는데 목적이 있으며, 아래와 같이 그 내용을 정한다.
    2. 제2조 (신의성실): "회사"는 "선수"에게 합의된 후원금 등을 지급할 의무가 있고 "선수"는 "회사"를 위하여 그의 능력과 기능을 최대한 발휘하여 신의와 성실로 선수활동(이하 "활동"이라 한다)을 수행할 의무가 있다. 선수활동은 팀(회사)의 훈련, 공식/비공식 경기 및 팀(회사)이 지정한 경기와 팀(회사)이 지정한 각종 행사에 참여하는 것을 포함한다.
    
    **분석:**
    
    **1. 제1조 (총칙)**
    
    이 조항은 계약의 기본 틀을 설명하며, e스포츠 발전을 도모하겠다는 목적이 명시되어 있습니다. 여기에서는 특별히 사용자(선수)에게 유리하거나 불리한 요소가 드러나지 않습니다. 이는 표준적으로 양측의 관계와 의무를 규정하는 조항입니다.
    
    **2. 제2조 (신의성실)**
    
    **유리한 조항:**
    - "회사"가 "선수"에게 합의된 후원금 등을 지급할 의무가 있다는 점이 명시되어 있습니다. 이는 "회사"가 후원금 지급을 책임져야 한다는 내용을 포함하여, 선수에게 경제적인 안정성을 보장할 수 있습니다.
    
    **불리한 조항:**
    - "선수"는 "회사"를 위하여 그의 능력과 기능을 최대한 발휘하여 활동을 수행할 의무가 있습니다. 이 문구는 선수에게 상당히 높은 성과 요구를 명시하며, 선수가 자신의 능력을 최대한 발휘하지 못할 시 계약 위반이 될 여지가 있습니다.
    - 선수활동의 범위가 넓고 포괄적입니다. 훈련, 공식/비공식 경기뿐만 아니라 '팀(회사)이 지정한 각종 행사'도 포함된다고 명시되어 있어, 선수의 활동 시간이 과도하게 늘어날 가능성이 있습니다. 이는 선수의 개인 생활과 휴식 시간을 침해할 수 있습니다.
    
    **결론:**
    
    해당 조항들은 전반적으로 양측의 의무를 규정하지만, 선수에게 불리한 요소들이 존재합니다. 특히 '신의성실' 조항에서 선수의 성과와 활동 범위에 대한 큰 책임이 강조되고 있기 때문에, 이는 선수가 과중한 부담을 느낄 수 있는 조항입니다. 따라서 선수가 계약을 체결하기 전에 이러한 조항에 대한 명확한 이해와 협상이 필요합니다.
    """

    # OpenAI API로 조항 분석
    analysis_result = analyze_clause(formatted_text, example_format)

    return {"analysis": analysis_result}
