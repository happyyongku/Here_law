import requests
import os
import json

def fetch_bills(api_key, age, p_index=1, p_size=100):
    # API 요청 URL
    url = "https://open.assembly.go.kr/portal/openapi/nzmimeepazxkubdpn"
    
    # API 요청에 필요한 파라미터 (기본 값 포함)
    params = {
        'KEY': api_key,
        'Type': 'json',
        'pIndex': p_index,
        'pSize': p_size,
        'AGE': age
    }

    # GET 요청을 보냄
    response = requests.get(url, params=params)

    # 응답 결과를 파싱
    if response.status_code == 200:
        data = response.json()

        if 'row' in data['nzmimeepazxkubdpn'][1]:
            bills = []
            for bill_info in data['nzmimeepazxkubdpn'][1]['row']:
                # 필요한 데이터를 정제해서 저장
                formatted_data = {
                "의안 ID": bill_info['BILL_ID'],
                "의안 번호": bill_info['BILL_NO'],
                "법률안 명": bill_info['BILL_NAME'],
                "소관 위원회": bill_info['COMMITTEE'],
                "제안일": bill_info['PROPOSE_DT'],
                "처리 결과": bill_info['PROC_RESULT'],
                "대수": bill_info['AGE'],
                "세부 링크": bill_info['DETAIL_LINK'],
                "제안자": bill_info['PROPOSER'],
                "제안자 목록 링크": bill_info['MEMBER_LIST'],
                "위원회 상정일": bill_info['CMT_PRESENT_DT'],
                "위원회 ID": bill_info['COMMITTEE_ID'],
                "공동 제안자": bill_info['PUBL_PROPOSER'],
                "대표 제안자": bill_info['RST_PROPOSER']
                }
                bills.append(formatted_data)
            save_json_data(bills)
            return bills
        else:
            print("No bill information found.")
    else:
        print(f"Error: {response.status_code}")
    return None

# JSON 데이터를 저장하는 함수
def save_json_data(data):
    # 저장할 디렉토리 경로
    save_directory = "/home/ubuntu/kbg_workspace/S11P21B109/datas"
    
    # 디렉토리가 존재하지 않으면 생성
    if not os.path.exists(save_directory):
        os.makedirs(save_directory)

    # 파일 경로 설정 (파일명은 날짜나 특정 식별자 등을 사용하여 만듭니다)
    file_path = os.path.join(save_directory, "bills_data.json")
    
    # JSON 데이터를 파일로 저장
    with open(file_path, "w", encoding="utf-8") as json_file:
        json.dump(data, json_file, ensure_ascii=False, indent=4)  # ensure_ascii=False는 한글 깨짐 방지

    print(f"Data saved successfully to {file_path}")