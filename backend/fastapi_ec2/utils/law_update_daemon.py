import time
import logging
import threading
import pandas as pd
import json

from time import localtime, strftime
import requests
from typing import List, Dict

from utils.law_xml_parser import get_law_dict, get_law_clauses
from utils.db_connection import DBConnection

class LawUpdateDaemon:
    # Singleton 패턴을 구현하기 위한 클래스 변수
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            logging.debug("LawUpdateDaemon: 새로운 인스턴스를 생성합니다.")
            cls._instance = super(LawUpdateDaemon, cls).__new__(cls)
        else:
            logging.debug("LawUpdateDaemon: 이미 존재하는 인스턴스를 반환합니다.")
        return cls._instance

    def __init__(self,
                 law_api_key,
                 fetch_retries=3,
                 fetch_retry_interval=2,
                 fetch_timeout=10,
                 fetch_tolerance_failure=500,
                 routine_interval_seconds=3600*24,
                 ):

        if not hasattr(self, 'initialized'):
            
            # 초기 설정 변수들
            self._FETCH_RETRIES = fetch_retries
            self._FETCH_RETRY_INTERVAL = fetch_retry_interval
            self._FETCH_TIMEOUT = fetch_timeout
            self._ROUTINE_INTERVAL_SECONDS = routine_interval_seconds
            self._LAW_API_KEY = law_api_key

            # DB
            self.pool = DBConnection()
            # 스레드 관련 변수 초기화
            self.api_routine = threading.Thread(target=self._daemon_thread, daemon=True)
            self.routine_running = False  # 루틴 실행 여부 플래그
            self.should_stop = False  # 루틴 중지 플래그
            self.initialized = True  # 초기화 완료 플래그

    def __call__(self):
        if not self.routine_running:
            logging.debug("루틴을 시작합니다.")
            self.should_stop = False
            self.routine_running = True
            self.api_routine.start()
        else:
            logging.warning("루틴이 이미 실행 중입니다.")

    def _daemon_thread(self):
        try:
            self.update_laws()
            if self.should_stop is True:
                logging.debug("데몬 스레드를 중지합니다.")
                self.routine_running = False
                return
            time.sleep(self._ROUTINE_INTERVAL_SECONDS)
        except Exception as e:
            self.routine_running = False
            # 오류 발생 시 루틴 중지 및 로그 출력
            logging.error(f"_daemon_thread: 오류가 발생했습니다: {e}", exc_info=True)

    def stop(self) -> str:
        if not self.routine_running:
            return "스레드가 실행 중이 아닙니다."
        else:
            self.should_stop = True
            return "중지를 예약했습니다. 곧 중지됩니다..."

    def _fetch_verbose(self, url, timeout, name_invoker = "_fetch_verbose"):
        for _ in range(self._FETCH_RETRIES):
            try:
                return requests.get(url, timeout=self._FETCH_TIMEOUT)
            except requests.exceptions.RequestException as e:
                logging.error(f"_fetch_verbose: 오류가 발생했습니다: {e}", exc_info=True)
                time.sleep(self._FETCH_RETRY_INTERVAL)  # 재시도 전에 잠시 대기
        response = requests.get(url, timeout=timeout)
        if response.status_code == 200:
            logging.debug(f"{name_invoker}: 데이터 요청 성공")
            return response
        else:
            logging.debug(
                f"{name_invoker}: 데이터 요청 실패 - 상태 코드: %s, 이유: %s, 헤더: %s, 응답 내용: %s",
                response.status_code,
                response.reason,
                response.headers,
                response.text[:500] # 첫 500자만 기록
            )

    def fetch_new_laws(self, target_date:str) -> List[Dict]:
        DISPLAY_COUNT = 100 # 1~100
        """
        법제처의 법령 변경이력 목록 조회 API 에서 특정 날짜에 DB에 업데이트된 법령 목록을 가져온다.
            - 요청 URL : http://www.law.go.kr/DRF/lawSearch.do?target=lsHstInf
        """
        result = []
        page = 1
        while True:
            url = f"https://www.law.go.kr/DRF/lawSearch.do?target=lsHstInf&refAdr=law.go.kr&OC={self._LAW_API_KEY}\
                &display={DISPLAY_COUNT}&page={page}\
                &regDt={target_date}\
                &type=json"
            response = self._fetch_verbose(url,self._FETCH_TIMEOUT,name_invoker="fetch_new_laws").json()
            result += response["LawSearch"]["law"]
            if(len(result) >= int(response["LawSearch"]["totalCnt"])):
                break
            page += 1
        return result
    
    def update_laws(self):
        # 1. 오늘 날짜의 모든 데이터를 가져옴. 이때 가져와진 데이터에는 개정된 법률에 관련된 법률이 다 있다.
        # 2. 그중 오늘 이후에 시행되는 법과 그 법의 이전 법만 DB에 집어넣는다.

        today = strftime("%Y%m%d", localtime())
        law_list = self.fetch_new_laws(today)
        df = pd.DataFrame(law_list)
        df= df.sort_values(["법령명한글", "시행일자"], ascending=False)

        # Initialize variables
        target_row = None

        for index, current_row in df.iterrows():
            current_date = current_row['시행일자']

            if current_date >= today: # 시행일자가 오늘 이후임.
                if target_row is not None: # 현재 대상 row 있음
                    if current_row['법령명한글'] != target_row['법령명한글']:
                        # target_row is a new law. Insert into DB using '법령일련번호' as pk
                        self.insert_law(target_row)
                        target_row = None
                    else:
                        # current row becomes the target_row
                        target_row = current_row
                else:
                    target_row = current_row
            else: #시행일자가 오늘 이전임!
                if target_row is not None and current_row['법령명한글'] == target_row['법령명한글']:
                    # current_row is the law currently in effect
                    # Insert current_row into the DB
                    current_law_id = self.insert_law(current_row)
                    # Insert target_row and set previous_law_id to current_law_id
                    self.insert_law(target_row, previous_law_id=current_law_id)
                else:
                    # target_row is a new law. Insert into DB using '법령일련번호' as pk
                    if target_row is not None:
                        self.insert_law(target_row)
                target_row = None

    def insert_law(self,row, previous_law_id=None):
        law_url = "https://www.law.go.kr" + row['법령상세링크'].replace("HTML", "XML")
        law_str = self._fetch_verbose(law_url, timeout=self._FETCH_TIMEOUT, name_invoker="insert_law").text
        law_dict = get_law_dict(law_str)
        law_info = law_dict["기본정보"]
        law_clauses = get_law_clauses(law_dict)

        sql = """
        INSERT INTO law_info (
            law_id,
            proclamation_date,
            proclamation_number,
            language,
            law_type,
            law_name_kr,
            law_name_ch,
            law_short_name,
            is_title_changed,
            is_korean_law,
            part_code,
            related_department,
            phone_number,
            enforcement_date,
            revision_type,
            is_annex_included,
            is_proclaimed,
            contact_department,
            previous_law_id
        ) VALUES (
            %(law_id)s,
            %(proclamation_date)s,
            %(proclamation_number)s,
            %(language)s,
            %(law_type)s,
            %(law_name_kr)s,
            %(law_name_ch)s,
            %(law_short_name)s,
            %(is_title_changed)s,
            %(is_korean_law)s,
            %(part_code)s,
            %(related_department)s,
            %(phone_number)s,
            %(enforcement_date)s,
            %(revision_type)s,
            %(is_annex_included)s,
            %(is_proclaimed)s,
            %(contact_department)s,
            %(previous_law_id)s
        )
        ON CONFLICT (law_id) DO NOTHING;  -- To avoid duplicate key errors
        """

        data = {
            'law_id': law_info['법령ID'],
            'proclamation_date': law_info['공포일자'],
            'proclamation_number': law_info['공포번호'],
            'language': law_info['언어'],
            'law_type': law_info['법종구분'],
            'law_name_kr': law_info['법령명_한글'],
            'law_name_ch': law_info['법령명_한자'],
            'law_short_name': law_info['법령명약칭'],
            'is_title_changed': law_info['제명변경여부'],
            'is_korean_law': law_info['한글법령여부'],
            'part_code': law_info['편장절관'],
            'related_department': law_info['소관부처'],
            'phone_number': law_info['전화번호'],
            'enforcement_date': law_info['시행일자'],
            'revision_type': law_info['제개정구분'],
            'is_annex_included': law_info['별표편집여부'],
            'is_proclaimed': law_info['공포법령여부'],
            'contact_department': json.dumps(law_info['연락부서']),
            'previous_law_id': previous_law_id,
        }
        with self.pool.get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(sql, data)
                logging.debug(f"insert_law: law_info 넣기 성공: {data}")
                sql_clause = """
                INSERT INTO law_sections (
                    law_id,
                    part,
                    chapter,
                    section,
                    article,
                    clause,
                    content
                ) VALUES (
                    %(law_id)s,
                    %(part)s,
                    %(chapter)s,
                    %(section)s,
                    %(article)s,
                    %(clause)s,
                    %(content)s
                );
                """
                for clause in law_clauses:
                    data = {
                        "law_id" : clause["법령ID"],
                        "part" : clause["편"],
                        "chapter" : clause["장"],
                        "section" : clause["절"],
                        "article" : clause["조"],
                        "clause" : clause["항"],
                        "content" : clause["항내용"],
                    }
                    cursor.execute(sql_clause, data)
                    logging.debug(f"insert_law: law_clause 넣기 성공: {data}")
                # cursor.commit()