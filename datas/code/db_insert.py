import os
import json
import psycopg2

# PostgreSQL 연결 설정
conn = psycopg2.connect(
    dbname="here_law",
    user="here_law_admin",
    password="1234",
    host="3.36.85.129",
    port="5434"
)
cur = conn.cursor()

# JSONL 파일들이 있는 디렉토리 경로
jsonl_directory_path = '/home/ubuntu/kbg_workspace/S11P21B109/datas/law_datas'

# 조항 데이터 삽입 함수
def insert_rule_section(data):
    cur.execute("""
        INSERT INTO law_sections (law_id, part, chapter, section, article, clause, content)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (data['법령ID'], data.get('편'), data.get('장'), data.get('절'), data['조'], data.get('항'), data['항내용']))

# 기본 정보 데이터 삽입 함수
def insert_rule_info(data):
    cur.execute("""
        INSERT INTO law_info (law_id, proclamation_date, proclamation_number, language, law_type, law_name_kr, law_name_ch, law_short_name, is_title_changed, is_korean_law, part_code, related_department, phone_number, enforcement_date, revision_type, is_annex_included, is_proclaimed, contact_department)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        data['법령ID'], data['공포일자'], data['공포번호'], data['언어'], data['법종구분'], 
        data['법령명_한글'], data['법령명_한자'], data.get('법령명약칭'), data['제명변경여부'], data['한글법령여부'], 
        data['편장절관'], data.get('소관부처'), data.get('전화번호'), data['시행일자'], data['제개정구분'], 
        data['별표편집여부'], data['공포법령여부'], json.dumps(data.get('연락부서'))
    ))

# 디렉토리 내 모든 JSONL 파일 처리 
for filename in os.listdir(jsonl_directory_path):
    if filename.endswith(".jsonl"):
        file_path = os.path.join(jsonl_directory_path, filename)
        with open(file_path, 'r', encoding='utf-8') as file:
            for line in file:
                data = json.loads(line)
                
                # 파일이 "조항" 데이터인지, "기본 정보" 데이터인지 판단 (구조에 따라)
                if '조' in data:  # 조항 데이터일 경우
                    insert_rule_section(data)
                else:  # 기본 정보 데이터일 경우
                    insert_rule_info(data)

# 커밋 후 종료
conn.commit()
cur.close()
conn.close()