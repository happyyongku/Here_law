import os
import PyPDF2
import psycopg2
import json
from openai import OpenAI

# OpenAI API 설정
OPENAI_API_KEY = "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"
openai_client = OpenAI(api_key=OPENAI_API_KEY)

# PostgreSQL 연결 설정
def connect_db():
    conn = psycopg2.connect(
        dbname="here_law",
        user="here_law_admin",
        password="1234",
        host="3.36.85.129",
        port="5434"
    )
    return conn

# 데이터베이스에 데이터를 삽입하는 함수
def insert_bill_data(cur, bill_info, content, reason, analysis):
    insert_query = """
        INSERT INTO bills (
            bill_id, bill_no, bill_name, committee, propose_dt, proc_result, age, detail_link, 
            proposer, proposer_list_link, committee_dt, committee_id, co_proposers, lead_proposer, 
            content, reason, analysis
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    
    cur.execute(insert_query, (
        bill_info['의안 ID'], bill_info['의안 번호'], bill_info['법률안 명'], 
        bill_info['소관 위원회'], bill_info['제안일'], bill_info['처리 결과'], 
        bill_info['대수'], bill_info['세부 링크'], bill_info['제안자'], 
        bill_info['제안자 목록 링크'], bill_info['위원회 상정일'], bill_info['위원회 ID'], 
        bill_info['공동 제안자'], bill_info['대표 제안자'], content, reason, analysis
    ))

# PDF에서 텍스트를 추출하는 함수
def extract_text_from_pdf(pdf_path):
    print(f"Extracting text from: {pdf_path}")
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
    print(f"Extracted text length: {len(text)}")
    return text

# GPT-4로 분석하는 함수
def analyze_clause(pdf_text, example_format):
    print(f"Analyzing text with GPT-4, text length: {len(pdf_text)}")
    prompt = f"""
      다음 법률 정보가 바뀌는 내용, 바뀌는 이유, 분석 근거를 요약해 주세요. 
      반드시 아래 형식에 따라 답변을 작성해 주세요. 모든 답변은 일관된 문장 구조와 존댓말을 사용해 작성해 주세요:
      
      {example_format}

      요약할 내용:
      {pdf_text[:4000]}
      
      모든 답변은 동일한 형식과 존댓말을 사용해 주세요.
    """

    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "당신은 한국의 법률 문서 작성 전문가입니다."},
                {"role": "user", "content": prompt}
            ]
        )
        print("Analysis complete")
        result = response.choices[0].message.content
        print(result)
        return result
    except Exception as e:
        print(f"GPT-4 분석 중 오류 발생: {e}")
        return "분석 중 오류가 발생했습니다."

# 분석된 텍스트를 각각 content, reason, analysis로 분리하는 함수
def split_analysis(analysis_text):
    print(f"Splitting analysis text, text length: {len(analysis_text)}")
    parts = analysis_text.split("-")
    
    content = parts[1].replace("- 상정된 내용:", "").strip() if len(parts) > 1 else ""
    reason = parts[2].replace("- 상정된 이유:", "").strip() if len(parts) > 2 else ""
    analysis = parts[3].replace("- 분석 근거:", "").strip() if len(parts) > 3 else ""
    
    print("정제된 컨텐츠는 : ", content)
    
    return content, reason, analysis


# JSON 파일에서 법률 정보를 읽어오는 함수
def load_bill_data(json_file_path):
    with open(json_file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

# PDF 파일을 처리하고 분석한 후 DB에 적재하는 함수
def process_pdfs_and_analyze(pdf_directory, example_format, conn, bill_data):
    cur = conn.cursor()

    for bill_info in bill_data:
        bill_name = bill_info['법률안 명']  # 법률안 명으로 변경
        # PDF 파일 이름에 법률안 명이 포함된 파일을 찾기
        pdf_found = False
        for file_name in os.listdir(pdf_directory):
            if bill_name in file_name:  # 파일 이름에 법률안 명이 포함된 경우
                pdf_found = True
                pdf_file_name = file_name
                pdf_path = os.path.join(pdf_directory, pdf_file_name)
                print(f"Processing {pdf_path}...")

                try:
                    # PDF에서 텍스트 추출
                    pdf_text = extract_text_from_pdf(pdf_path)
                    
                    # GPT-4로 법안 분석
                    analysis_text = analyze_clause(pdf_text, example_format)
                    
                    # 분석된 텍스트에서 각각 content, reason, analysis 추출
                    content, reason, analysis = split_analysis(analysis_text)

                    # DB에 데이터 적재
                    insert_bill_data(cur, bill_info, content, reason, analysis)
                    print(f"Successfully inserted data for {pdf_file_name}")
                except Exception as e:
                    print(f"파일 처리 중 오류 발생 {pdf_file_name}: {e}")
                break  # 해당 법률안에 맞는 PDF 파일을 찾으면 처리하고 종료

        if not pdf_found:
            print(f"PDF 파일을 찾을 수 없습니다: {bill_name}")

    conn.commit()
    cur.close()

# JSON 파일 경로 및 PDF 디렉토리 경로 설정
json_file_path = "/home/ubuntu/kbg_workspace/S11P21B109/datas/bills_data.json"
pdf_directory = "/home/ubuntu/kbg_workspace/S11P21B109/pdf_files"
example_format = """
[상정 내용]
- 상정된 내용:
- 상정된 이유:
- 분석 근거:
"""

# 실행부
if __name__ == "__main__":
    conn = connect_db()
    try:
        # 법률안 정보 불러오기
        bill_data = load_bill_data(json_file_path)
        
        # PDF 파일 처리 및 분석 후 DB에 적재
        process_pdfs_and_analyze(pdf_directory, example_format, conn, bill_data)
    finally:
        conn.close()
