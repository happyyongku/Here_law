import pandas as pd
import xml.etree.ElementTree as ET
from urllib.request import urlopen
from tqdm import trange
import ssl
ssl._create_default_https_context = ssl._create_unverified_context
ID = 'ngho1202'
url = f"https://www.law.go.kr/DRF/lawSearch.do?OC={ID}&target=prec&type=XML"
response = urlopen(url).read()
print(url)
xml_data = ET.fromstring(response)

totalCnt = int(xml_data.find('totalCnt').text)
print(totalCnt)

page = 1
rows = []
for i in trange(int(totalCnt / 20)):
    try:
        prec_info = xml_data[5:]
    except:
        break

    for info in prec_info:
        judicPrecNum = info.find('판례일련번호').text
        case = info.find('사건명').text
        caseNum = info.find('사건번호').text
        sentence_date = info.find('선고일자').text
        court = info.find('법원명').text
        caseInfo = info.find('사건종류명').text
        caseCode = info.find('사건종류코드').text
        judgment = info.find('판결유형').text
        sentence = info.find('선고').text
        judicPrecLink = info.find('판례상세링크').text

        rows.append({'판례일련번호': judicPrecNum,
                    '사건명': case,
                    '사건번호': caseNum,
                    '선고일자': sentence_date,
                    '법원명': court,
                    '사건종류명': caseInfo,
                    '사건종류코드': caseCode,
                    '판결유형': judgment,
                    '선고': sentence,
                    '판례상세링크': judicPrecLink})
    page += 1
    response = urlopen(url + '&page=' + str(page)).read()
    xml_data = ET.fromstring(response)
judicPrecList = pd.DataFrame(rows)
judicPrecList.to_csv('/home/qudrb0107/S11P21B109/datas/code/judicial_precedent_list.csv', index=False)