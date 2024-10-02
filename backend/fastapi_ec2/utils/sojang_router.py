from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from fpdf import FPDF
from datetime import datetime
import os
from openai import OpenAI

# 라우터 생성
router = APIRouter()

# OpenAI 클라이언트 생성 (API 키 필요 시 추가)
client = OpenAI()  # 여기에 자신의 OpenAI API 키를 입력하세요.

# 폰트 파일 경로 설정 (서버에 맞게 조정 필요)
FONT_PATH = '/path/to/NanumGothic.ttf'

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

@router.post("/generate")
async def generate_legal_document(user_info: UserInfo):
    try:
        # 청구 취지 및 내용 생성
        generated_content = generate_content(user_info.dict())

        # PDF 저장
        pdf_filename = "소장.pdf"
        save_to_pdf(user_info.dict(), generated_content, filename=pdf_filename)

        return {"message": f"'{pdf_filename}' 파일로 저장되었습니다."}
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

# PDF로 저장하는 함수
def save_to_pdf(user_info: Dict[str, str], generated_content: Dict[str, str], filename="소장.pdf"):
    pdf = FPDF()
    pdf.add_page()
    pdf.add_font('NanumGothic', '', FONT_PATH, uni=True)
    pdf.set_font('NanumGothic', size=12)

    pdf.set_font_size(16)
    pdf.cell(0, 10, txt="소      장", ln=True, align='C')

    pdf.ln(10)

    pdf.cell(30, 10, txt="원    고 :", ln=False)
    pdf.cell(0, 10, txt=f"{user_info['plaintiff']} (전화번호: {user_info['plaintiff_phone']})", ln=True)
    pdf.cell(30, 10, txt="주    소 :", ln=False)
    pdf.cell(0, 10, txt=user_info['plaintiff_address'], ln=True)

    pdf.cell(30, 10, txt="피    고 :", ln=False)
    pdf.cell(0, 10, txt=f"{user_info['defendant']} (전화번호: {user_info['defendant_phone']})", ln=True)
    pdf.cell(30, 10, txt="주    소 :", ln=False)
    pdf.cell(0, 10, txt=user_info['defendant_address'], ln=True)
    
    pdf.ln(20)

    pdf.set_font_size(12)
    pdf.cell(0, 10, txt=user_info['case_title'], ln=True)

    pdf.ln(20)

    pdf.set_font_size(14)
    pdf.cell(0, 10, txt="청 구  취 지", ln=True, align='C')
    pdf.set_font_size(12)
    pdf.multi_cell(0, 10, txt=generated_content['청구 취지'], align='J')

    pdf.ln(10)

    pdf.set_font_size(14)
    pdf.cell(0, 10, txt="청 구  원 인", ln=True, align='C')
    pdf.set_font_size(12)
    pdf.multi_cell(0, 10, txt=generated_content['청구 원인'], align='J')

    pdf.ln(10)

    pdf.set_font_size(14)
    pdf.cell(0, 10, txt="첨 부  서 류", ln=True, align='C')
    pdf.set_font_size(12)
    attachments = generated_content['첨부 서류'].split('\n')
    for attachment in attachments:
        if attachment.strip() != '':
            pdf.cell(0, 10, txt=f"- {attachment.strip()}", ln=True)

    pdf.ln(20)

    today = datetime.today().strftime('%Y    .   %m    .   %d    .')
    pdf.cell(0, 10, txt=today, ln=True, align='R')
    pdf.cell(0, 10, txt="원고           (인)", ln=True, align='R')
    pdf.cell(0, 10, txt=user_info['plaintiff'], ln=True, align='R')

    pdf.ln(10)

    pdf.cell(0, 10, txt=f"{user_info['court_name']} 귀중", ln=True, align='R')

    pdf.output(filename, 'F')
