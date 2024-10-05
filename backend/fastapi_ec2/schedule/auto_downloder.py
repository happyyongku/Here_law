import requests
from bs4 import BeautifulSoup
import os
import urllib.parse
from fpdf import FPDF
from initiative import fetch_bills  # API에서 법률안 데이터를 가져오는 함수

# Google에서 법률안 명을 검색하고 'moleg.go.kr' 또는 'pal.assembly.go.kr' URL을 찾는 함수
def search_law_in_google(bill_name):
    search_url = f"https://www.google.com/search?q={bill_name}"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
    }
    
    response = requests.get(search_url, headers=headers)
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Google 검색 결과에서 'moleg.go.kr' 또는 'pal.assembly.go.kr'이 포함된 URL을 추출
        links = soup.find_all('a', href=True)
        for link in links:
            href = link['href']
            # Google 리디렉션 URL 처리
            if "/url?" in href:
                parsed_url = urllib.parse.parse_qs(urllib.parse.urlparse(href).query)
                actual_url = parsed_url.get('url', [None])[0]  # 'url' 파라미터에서 실제 URL 추출
                if actual_url and ("moleg.go.kr" in actual_url or "pal.assembly.go.kr" in actual_url):
                    return actual_url  # 실제 URL 반환

    return None

# PDF 파일 링크를 찾고 다운로드하거나 본문을 PDF로 변환하여 저장하는 함수
def download_pdf_from_page(law_page_url, bill_name, download_folder="pdf_files"):
    response = requests.get(law_page_url)

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')

        if not os.path.exists(download_folder):
            os.makedirs(download_folder)

        links = soup.find_all('a', href=True)
        pdf_found = False
        for link in links:
            href = link['href']
            text = link.get_text(strip=True)
            if href.endswith(".pdf") or "file/download" in href:
                pdf_found = True
                pdf_name = text if text.endswith(".pdf") else f"{bill_name}.pdf"
                pdf_url = href if href.startswith("http") else f"https://{law_page_url.split('/')[2]}{href}"
                
                pdf_path = os.path.join(download_folder, pdf_name)
                
                pdf_response = requests.get(pdf_url)
                if pdf_response.status_code == 200:
                    with open(pdf_path, 'wb') as f:
                        f.write(pdf_response.content)
                    print(f"Downloaded: {pdf_path}")
                else:
                    print(f"Failed to download PDF: {pdf_url}")
                return
        
        if not pdf_found:
            print(f"No PDF found for {bill_name}, generating PDF from the page body...")
            content_div = soup.find('div', class_='tb_contents')
            if content_div:
                body_content = content_div.get_text(separator="\n").strip()
                save_body_as_pdf(body_content, bill_name, download_folder)

# 본문을 PDF로 저장하는 함수 (FPDF 사용)
def save_body_as_pdf(body_content, bill_name, download_folder):
    pdf_name = f"{bill_name}_parshing.pdf"
    pdf_path = os.path.join(download_folder, pdf_name)

    if not os.path.exists(download_folder):
        os.makedirs(download_folder)

    # FPDF 인스턴스 생성
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    # 유니코드 폰트 설정
    pdf.add_font('NanumGothic', '', '/usr/share/fonts/truetype/nanum/NanumGothic.ttf', uni=True)
    pdf.set_font('NanumGothic', size=12)

    # HTML 본문 텍스트를 PDF에 추가
    for line in body_content.split("\n"):
        pdf.multi_cell(0, 10, line)

    pdf.output(pdf_path)
    print(f"Generated PDF from body content: {pdf_path}")

# 1. API에서 법률안 데이터를 가져오기
api_key = "ca7090a834d1418fa3a7989d790caa66"
age = 21  # 21대 국회
bills = fetch_bills(api_key, age)

# 2. 법률안 명을 검색하여 PDF 다운로드하기 또는 본문을 PDF로 변환하기
if bills:
    for bill in bills:
        bill_name = bill["법률안 명"]
        print(f"Processing bill: {bill_name}")
        
        # Google에서 해당 법률안의 'moleg.go.kr' 또는 'pal.assembly.go.kr' URL을 찾기
        found_url = search_law_in_google(bill_name)
        
        # URL을 찾은 경우 PDF 파일 다운로드 또는 본문 PDF 생성
        if found_url:
            download_pdf_from_page(found_url, bill_name)
        else:
            print(f"No matching 'moleg.go.kr' or 'pal.assembly.go.kr' URL found for {bill_name}")
