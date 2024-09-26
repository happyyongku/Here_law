from openai import OpenAI
from fpdf import FPDF

# OpenAI API 키 설정
client = OpenAI()

def gather_user_info():
    print("안녕하세요! 소장 작성을 위해 몇 가지 질문을 드리겠습니다.\n")

    plaintiff = input("원고의 이름을 입력해주세요: ")
    defendant = input("피고의 이름을 입력해주세요: ")
    case_details = input("사건의 상세 내용을 입력해주세요: ")
    damages = input("청구하고자 하는 손해 배상 금액을 입력해주세요 (숫자만 입력): ")

    return {
        "plaintiff": plaintiff,
        "defendant": defendant,
        "case_details": case_details,
        "damages": damages
    }

def generate_complaint(user_info):
    prompt = f"""
    다음 정보를 바탕으로 한국어 소장을 작성해주세요:

    원고: {user_info['plaintiff']}
    피고: {user_info['defendant']}
    사건 내용: {user_info['case_details']}
    청구 금액: {user_info['damages']}원

    소장은 정식 법률 문서 형식으로 작성되어야 하며, 필요한 모든 법적 요소를 포함해야 합니다.
    """

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "당신은 한국의 법률 문서 작성 전문가입니다."},
            {"role": "user", "content": prompt}
        ]
    )

    complaint_text = response.choices[0].message.content
    return complaint_text

def save_to_pdf(text, filename="소장.pdf"):
    pdf = FPDF()
    pdf.add_page()
    pdf.add_font('NanumGothic', '', '/home/qudrb0107/S11P21B109/datas/code/NanumGothic.ttf', uni=True)  # 폰트 파일 필요
    pdf.set_font('NanumGothic', size=12)

    # 한글 처리를 위해 utf-8로 디코딩된 텍스트 사용
    lines = text.split('\n')
    for line in lines:
        pdf.multi_cell(0, 10, txt=line, align='L')

    pdf.output(filename, 'F')
    print(f"\n'{filename}' 파일로 저장되었습니다.")

def main():
    user_info = gather_user_info()
    complaint_text = generate_complaint(user_info)
    print("\n생성된 소장:\n")
    print(complaint_text)
    save_to_pdf(complaint_text)

if __name__ == "__main__":
    main()


