import pandas as pd
import psycopg2
import os

# PostgreSQL 데이터베이스 연결 설정
conn = psycopg2.connect(
    dbname="here_law",
    user="here_law_admin",
    password="1234",
    host="3.36.85.129",
    port="5434"
)
cur = conn.cursor()

# 테이블 생성 (이미 생성되어 있으면 생략 가능)
cur.execute("""
    CREATE TABLE IF NOT EXISTS legal_cases (
        case_info_id VARCHAR,
        case_name VARCHAR,
        case_number VARCHAR,
        judgment_date VARCHAR,
        judgment VARCHAR,
        court_name VARCHAR,
        case_type VARCHAR,
        judgment_type VARCHAR,
        issues VARCHAR,
        judgment_summary VARCHAR,
        reference_clause VARCHAR,
        reference_cases VARCHAR,
        full_text TEXT
    );
""")
conn.commit()

# CSV 파일들의 경로가 있는 디렉토리 설정 (train_0.csv ~ train_5.csv가 있는 경로)
csv_dir = "/home/ubuntu/kbg_workspace/S11P21B109/datas/case_datas"  # 여기에 CSV 파일들이 있는 디렉토리 경로를 입력하세요

# train_0부터 train_5까지 데이터를 데이터베이스에 삽입
for i in range(6):
    file_path = os.path.join(csv_dir, f"train_{i}.csv")
    if os.path.exists(file_path):
        # CSV 파일 읽기
        df_raw = pd.read_csv(file_path)

        # 데이터베이스에 데이터 삽입
        for index, row in df_raw.iterrows():
            cur.execute("""
                INSERT INTO legal_cases (case_info_id, case_name, case_number, judgment_date, judgment, court_name, case_type, judgment_type, issues, judgment_summary, reference_clause, reference_cases, full_text)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
            """, (
                str(row['판례정보일련번호']),
                str(row['사건명']),
                str(row['사건번호']),
                str(row['선고일자']),
                str(row['선고']),
                str(row['법원명']),
                str(row['사건종류명']),
                str(row['판결유형']),
                str(row['판시사항']),
                str(row['판결요지']),
                str(row['참조조문']),
                str(row['참조판례']),
                str(row['전문'])
            ))

        # 변경사항 저장
        conn.commit()
        print(f"Data from {file_path} inserted successfully.")
    else:
        print(f"File {file_path} does not exist.")

# 연결 종료
cur.close()
conn.close()
