from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from docx import Document
from docx.shared import Pt
from datetime import datetime
import os
from openai import OpenAI

# 라우터 생성
sojang_router = APIRouter()

# OpenAI 클라이언트 생성 (API 키 필요 시 추가)
OPENAI_API_KEY = "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"
client = OpenAI(api_key=OPENAI_API_KEY)  # 여기에 자신의 OpenAI API 키를 입력하세요.

# 사용자로부터 입력받는 데이터 모델 정의
class UserInfo(BaseModel):
    case_title: str
    plaintiff: str
    plaintiff_address: str
    plaintiff_phone: str
    defendant: str
    defendant_address: str
    defendant_phone: str
    court_name: str
    case_details: str

@sojang_router.post("/generate")
async def generate_legal_document(user_info: UserInfo):
    try:
        # 청구 취지 및 내용 생성
        generated_content = generate_content(user_info.dict())

        # Word 파일로 저장
        doc_filename = "소장.docx"
        save_to_word(user_info.dict(), generated_content, filename=doc_filename)

        return {"message": f"'{doc_filename}' 파일로 저장되었습니다."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# OpenAI를 사용해 문서 생성
def generate_content(user_info: Dict[str, str]) -> Dict[str, str]:
    prompt = f"""
    다음 정보를 바탕으로 한국어 소장에 필요한 청구 취지, 청구 원인, 첨부 서류를 작성해주세요.

    사건명: {user_info['case_title']}
    원고: {user_info['plaintiff']} (주소: {user_info['plaintiff_address']}, 전화번호: {user_info['plaintiff_phone']})
    피고: {user_info['defendant']} (주소: {user_info['defendant_address']}, 전화번호: {user_info['defendant_phone']})
    사건 내용: {user_info['case_details']}
    소장은 정식 법률 문서 형식으로 작성되어야 하며, 필요한 모든 법적 요소를 포함해야 합니다.
    [청구 취지], [청구 원인], [첨부 서류] 이런식으로 작성해 주세요.
    """

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "당신은 한국의 법률 문서 작성 전문가입니다."},
            {"role": "user", "content": prompt}
        ]
    )

    generated_text = response.choices[0].message.content

    sections = {"청구 취지": "", "청구 원인": "", "첨부 서류": ""}
    current_section = None
    for line in generated_text.split('\n'):
        line = line.strip()
        if line.startswith("[청구 취지]"):
            current_section = "청구 취지"
        elif line.startswith("[청구 원인]"):
            current_section = "청구 원인"
        elif line.startswith("[첨부 서류]"):
            current_section = "첨부 서류"
        elif current_section:
            sections[current_section] += line + '\n'

    return sections

# Word로 저장하는 함수
def save_to_word(user_info: Dict[str, str], generated_content: Dict[str, str], filename="소장.docx"):
    doc = Document()

    # 제목 추가
    doc.add_heading('소      장', level=1).alignment = 1  # 가운데 정렬

    # 원고 정보
    doc.add_paragraph(f"원    고 : {user_info['plaintiff']} (전화번호: {user_info['plaintiff_phone']})")
    doc.add_paragraph(f"주    소 : {user_info['plaintiff_address']}")

    # 피고 정보
    doc.add_paragraph(f"피    고 : {user_info['defendant']} (전화번호: {user_info['defendant_phone']})")
    doc.add_paragraph(f"주    소 : {user_info['defendant_address']}")

    # 사건명
    doc.add_paragraph(f"\n사건명: {user_info['case_title']}")

    # 청구 취지
    doc.add_heading('청 구  취 지', level=2).alignment = 1
    doc.add_paragraph(generated_content['청구 취지'])

    # 청구 원인
    doc.add_heading('청 구  원 인', level=2).alignment = 1
    doc.add_paragraph(generated_content['청구 원인'])

    # 첨부 서류
    doc.add_heading('첨 부  서 류', level=2).alignment = 1
    for attachment in generated_content['첨부 서류'].split('\n'):
        if attachment.strip() != '':
            doc.add_paragraph(f"- {attachment.strip()}")

    # 날짜 및 서명
    today = datetime.today().strftime('%Y    .   %m    .   %d    .')
    doc.add_paragraph(today, style='Normal').alignment = 2  # 오른쪽 정렬
    doc.add_paragraph("원고           (인)", style='Normal').alignment = 2
    doc.add_paragraph(user_info['plaintiff'], style='Normal').alignment = 2

    # 법원 이름
    doc.add_paragraph(f"\n{user_info['court_name']} 귀중", style='Normal').alignment = 2

    # Word 파일 저장
    doc.save(filename)
