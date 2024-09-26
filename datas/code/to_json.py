import json
import re
from bs4 import BeautifulSoup

# 파일에서 JSON 데이터 로드
with open('judicial_precedent.json', 'r', encoding='utf-8') as json_file:
    data = json.load(json_file)

# HTML 태그 제거 및 번호 형식 변환 함수
def clean_text(text):
    # HTML 태그 제거 (br 태그 포함)
    text = BeautifulSoup(text, "html.parser").get_text()
    
    # [숫자] 형식을 숫자. 형식으로 변경
    text = re.sub(r'\[(\d+)\]', r'\1.', text)
    
    # 공백 정리
    text = text.strip()
    
    return text

# JSON 데이터를 재귀적으로 탐색하여 텍스트 정제
def clean_json(data):
    if isinstance(data, dict):
        return {key: clean_json(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [clean_json(item) for item in data]
    elif isinstance(data, str):
        return clean_text(data)
    else:
        return data

# JSON 데이터 정제
cleaned_data = clean_json(data)

# 정제된 결과를 파일로 저장
with open('cleaned_judicial_precedent.json', 'w', encoding='utf-8') as json_file:
    json.dump(cleaned_data, json_file, ensure_ascii=False, indent=4)

print("Data cleaned and saved to cleaned_judicial_precedent.json")
