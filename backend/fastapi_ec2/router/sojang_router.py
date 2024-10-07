from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from docx import Document
from docx.shared import Pt
from datetime import datetime
import os
from openai import OpenAI

from docx.oxml.ns import qn
from docx.oxml import OxmlElement
from docx.enum.text import WD_PARAGRAPH_ALIGNMENT

# 라우터 생성
sojang_router = APIRouter()

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.abspath(os.path.join(CURRENT_DIR, ".."))

# OpenAI 클라이언트 생성 (API 키 필요 시 추가)
OPENAI_API_KEY = os.environ["API_KEY"]
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
        # return generated_content

        # Word 파일로 저장
        doc_filename = f"{user_info.plaintiff}_{user_info.case_title}.docx"
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
    반드시 [청구 취지], [청구 원인], [첨부 서류] 이런식으로 작성해 주세요.
    이때 청구 취지는 반드시 '1. 피고는 원고에게 100만원을 지급하라' 와 같이 번호를 붙혀서 요구사항별로 제공해야하며, 마지막에는 '라는 판결을 구합니다'를 붙혀서 제공해야 합니다.
    청구 원인 역시 반드시 '1. 피고는 원고에게 2021.03.23 사기를 쳤습니다'와 같이 단계별로 분리하여 번호를 붙혀서 제공해야합니다.
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
    SAVE_DIR = os.path.abspath(os.path.join(BASE_DIR, "docs", filename))
    doc = Document()
    # return generated_content
    print(f"Generated Content \n {generated_content}")
    
    try:
    # -------------------------------------------------------------
        style = doc.styles['Normal']
        style.font.size = Pt(12)
        
        title = doc.add_heading('소      장', level=1)
        title_run = title.runs[0]
        title_run.font.size = Pt(14)
        title_run.bold = True
        title.alignment = WD_PARAGRAPH_ALIGNMENT.CENTER
        title.paragraph_format.space_after = Pt(24)
        
        plaintiff_block = doc.add_paragraph()
        plaintiff_block_run = plaintiff_block.add_run(f"원    고 : {user_info['plaintiff']}\n")
        plaintiff_block_run = plaintiff_block.add_run(f"           {user_info['plaintiff_address']}\n")
        plaintiff_block_run = plaintiff_block.add_run(f"           {user_info['plaintiff_phone']}")
        plaintiff_block_run.font.size = Pt(12)
        
        defendant_block = doc.add_paragraph()
        defendant_block_run = defendant_block.add_run(f"피    고 : {user_info['defendant']}\n")
        defendant_block_run = defendant_block.add_run(f"           {user_info['defendant_address']}\n")
        defendant_block_run = defendant_block.add_run(f"           {user_info['defendant_phone']}")
        defendant_block_run.font.size = Pt(12)
        
        case_title = doc.add_paragraph(f"\n사건명: {user_info['case_title']}")
        case_title.alignment = WD_PARAGRAPH_ALIGNMENT.LEFT
        
        doc.add_paragraph("\n청 구  취 지").alignment = WD_PARAGRAPH_ALIGNMENT.CENTER
        doc.add_paragraph(generated_content['청구 취지'])
        
        doc.add_paragraph("\n청 구  원 인").alignment = WD_PARAGRAPH_ALIGNMENT.CENTER
        doc.add_paragraph(generated_content['청구 원인'])
        
        doc.add_paragraph("\n 첨 부  서 류").alignment = WD_PARAGRAPH_ALIGNMENT.CENTER
        for attachment in generated_content['첨부 서류'].split('\n'):
            if attachment.strip():
                doc.add_paragraph(f"- {attachment.strip()}")
        
        today = datetime.today().strftime('%Y    .   %m    .   %d    .')
        date_paragraph = doc.add_paragraph(today)
        date_paragraph.alignment = WD_PARAGRAPH_ALIGNMENT.RIGHT
        
        signature_paragraph = doc.add_paragraph("원고           (인)")
        signature_paragraph.alignment = WD_PARAGRAPH_ALIGNMENT.RIGHT
        
        plaintiff_name_paragraph = doc.add_paragraph(user_info['plaintiff'])
        plaintiff_name_paragraph.alignment = WD_PARAGRAPH_ALIGNMENT.RIGHT
        
        court_name_paragraph = doc.add_paragraph(f"\n{user_info['court_name']} 귀중")
        court_name_paragraph.alignment = WD_PARAGRAPH_ALIGNMENT.RIGHT
        # ---------------------------------------------------------------------------

        # 제목 추가
        # doc.add_heading('소      장', level=1).alignment = 1  # 가운데 정렬

        # # 원고 정보
        # doc.add_paragraph(f"원    고 : {user_info['plaintiff']} (전화번호: {user_info['plaintiff_phone']})")
        # doc.add_paragraph(f"주    소 : {user_info['plaintiff_address']}")

        # # 피고 정보
        # doc.add_paragraph(f"피    고 : {user_info['defendant']} (전화번호: {user_info['defendant_phone']})")
        # doc.add_paragraph(f"주    소 : {user_info['defendant_address']}")

        # # 사건명
        # doc.add_paragraph(f"\n사건명: {user_info['case_title']}")

        # # 청구 취지
        # doc.add_heading('청 구  취 지', level=2).alignment = 1
        # doc.add_paragraph(generated_content['청구 취지'])

        # # 청구 원인
        # doc.add_heading('청 구  원 인', level=2).alignment = 1
        # doc.add_paragraph(generated_content['청구 원인'])

        # # 첨부 서류
        # doc.add_heading('첨 부  서 류', level=2).alignment = 1
        # for attachment in generated_content['첨부 서류'].split('\n'):
        #     if attachment.strip() != '':
        #         doc.add_paragraph(f"- {attachment.strip()}")

        # # 날짜 및 서명
        # today = datetime.today().strftime('%Y    .   %m    .   %d    .')
        # doc.add_paragraph(today, style='Normal').alignment = 2  # 오른쪽 정렬
        # doc.add_paragraph("원고           (인)", style='Normal').alignment = 2
        # doc.add_paragraph(user_info['plaintiff'], style='Normal').alignment = 2

        # # 법원 이름
        # doc.add_paragraph(f"\n{user_info['court_name']} 귀중", style='Normal').alignment = 2

        # Word 파일 저장
        doc.save(SAVE_DIR)
    except Exception as e:
        print(f"Error Occured in saving phase \n {e}")
        raise HTTPException(status_code=500, detail=str(e))