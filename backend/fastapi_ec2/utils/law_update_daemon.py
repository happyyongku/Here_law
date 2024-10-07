import time
import logging
import threading
import pandas as pd
import json
import requests
from time import localtime, strftime
from typing import List, Dict
from psycopg.rows import dict_row
from utils.law_xml_parser import get_law_dict, get_law_clauses
from utils.db_connection import DBConnection

class LawUpdateDaemon:
    # Singleton 패턴 구현을 위한 클래스 변수
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            logging.debug("LawUpdateDaemon: 새로운 인스턴스를 생성합니다.")
            cls._instance = super(LawUpdateDaemon, cls).__new__(cls)
        else:
            logging.debug("LawUpdateDaemon: 기존 인스턴스를 반환합니다.")
        return cls._instance

    def __init__(self,
                 law_api_key: str,
                 fetch_retries: int = 3,
                 fetch_retry_interval: int = 2,
                 fetch_timeout: int = 10,
                 routine_interval_seconds: int = 3600*24):
        if not hasattr(self, 'initialized'):
            # 설정 변수 초기화
            self._FETCH_RETRIES = fetch_retries
            self._FETCH_RETRY_INTERVAL = fetch_retry_interval
            self._FETCH_TIMEOUT = fetch_timeout
            self._ROUTINE_INTERVAL_SECONDS = routine_interval_seconds
            self._LAW_API_KEY = law_api_key

            # 데이터베이스 연결 설정
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
        while not self.should_stop:
            try:
                self.update_laws()
                time.sleep(self._ROUTINE_INTERVAL_SECONDS)
            except Exception as e:
                logging.error(f"_daemon_thread: 오류가 발생했습니다: {e}", exc_info=True)
                self.routine_running = False
                break
        logging.debug("데몬 스레드를 중지합니다.")
        self.routine_running = False

    def stop(self) -> str:
        if not self.routine_running:
            return "스레드가 실행 중이 아닙니다."
        else:
            self.should_stop = True
            return "중지를 예약했습니다. 곧 중지됩니다..."

    def _fetch_verbose(self, url: str, timeout: int, name_invoker: str = "_fetch_verbose") -> requests.Response:
        for attempt in range(self._FETCH_RETRIES):
            try:
                response = requests.get(url, timeout=timeout)
                if response.status_code == 200:
                    logging.debug(f"{name_invoker}: 데이터 요청 성공")
                    return response
                else:
                    logging.error(f"{name_invoker}: 데이터 요청 실패 - 상태 코드: {response.status_code}")
            except requests.exceptions.RequestException as e:
                logging.error(f"{name_invoker}: 요청 중 오류 발생: {e}", exc_info=True)
                time.sleep(self._FETCH_RETRY_INTERVAL)
        raise Exception(f"{name_invoker}: {self._FETCH_RETRIES}회 재시도 후에도 실패했습니다.")

    def fetch_new_laws(self, target_date: str) -> List[Dict]:
        DISPLAY_COUNT = 100  # 페이지당 표시할 항목 수
        result = []
        page = 1
        while True:
            url = f"https://www.law.go.kr/DRF/lawSearch.do?target=lsHstInf&refAdr=law.go.kr&OC={self._LAW_API_KEY}" \
                f"&display={DISPLAY_COUNT}&page={page}&regDt={target_date}&type=json"
            response = self._fetch_verbose(url, self._FETCH_TIMEOUT, name_invoker="fetch_new_laws").json()
            
            if "LawSearch" in response and "law" in response["LawSearch"]:
                laws = response["LawSearch"]["law"]
                # 딕셔너리인 경우 리스트로 변환
                if isinstance(laws, dict):
                    laws = [laws]
                
                result.extend(laws)
                total_count = int(response["LawSearch"]["totalCnt"])
                
                if len(result) >= total_count:
                    break
                page += 1
            else:
                logging.error("fetch_new_laws: 응답 형식이 올바르지 않습니다.")
                break
        
        return result

    def update_laws(self, custom_date=None):
        today = strftime("%Y%m%d", localtime())
        if custom_date is not None:
            today = custom_date
        law_list = self.fetch_new_laws(today)
        if len(law_list) == 0:
            logging.debug(f"update_laws: 날짜 {today}에 법령 업데이트가 없거나 응답이 잘못되었습니다!")
            return
        df = pd.DataFrame(law_list)
        try:
            df = df.sort_values(["법령명한글", "시행일자"], ascending=False)
        except Exception as e:
            logging.error(f"update_laws: 데이터 정렬 중 오류 발생. 받은 데이터:\n{str(law_list)}\n에러 메시지:\n{e}", exc_info=True)
            return
        
        target_row = None

        for index, current_row in df.iterrows():
            current_date = current_row['시행일자']

            if current_date >= today:  # 시행일자가 오늘 이후인 경우
                if target_row is not None:
                    if current_row['법령명한글'] != target_row['법령명한글']:
                        self.insert_law(target_row)
                        target_row = None
                    else:
                        target_row = current_row
                else:
                    target_row = current_row
            else:  # 시행일자가 오늘 이전인 경우
                if target_row is not None and current_row['법령명한글'] == target_row['법령명한글']:
                    current_law_id = self.insert_law(current_row)
                    new_law_id = self.insert_law(target_row, previous_law_id=current_law_id)
                    logging.debug(f"update_laws: 법령 개정 발견: {current_law_id}에서 {new_law_id}로 업데이트되었습니다!")
                else:
                    if target_row is not None:
                        self.insert_law(target_row)
                target_row = None

    def insert_law(self, row, previous_law_id=None):
        law_id = row["법령일련번호"]
        law_url = "https://www.law.go.kr" + row['법령상세링크'].replace("HTML", "XML")
        law_str = self._fetch_verbose(law_url, timeout=self._FETCH_TIMEOUT, name_invoker="insert_law").text
        law_dict = get_law_dict(law_str)
        law_info = law_dict["기본정보"]
        law_clauses = get_law_clauses(law_dict)

        # 데이터 매핑
        data = {
            'law_id': law_id,
            'proclamation_date': law_info['공포일자'],
            'proclamation_number': law_info['공포번호'],
            'language': law_info['언어'],
            'law_type': law_info['법종구분'],
            'law_name_kr': law_info['법령명_한글'],
            'law_name_ch': law_info.get('법령명_한자'),
            'law_short_name': law_info.get('법령명약칭'),
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
            with conn.cursor(row_factory=dict_row) as cursor:
                # INSERT 문 준비
                insert_sql = """
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
                ON CONFLICT (law_id) DO NOTHING
                RETURNING 1;
                """

                # INSERT 실행
                cursor.execute(insert_sql, data)
                insert_result = cursor.fetchone()

                if insert_result:
                    # **케이스 1: 새로운 행이 삽입됨**
                    logging.debug(f"insert_law: law_info 삽입 성공: {data['law_id']}")

                    # law_sections 테이블에 조항 삽입
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
                    )
                    ON CONFLICT DO NOTHING;
                    """

                    clause_data_list = []
                    for clause in law_clauses:
                        clause_data = {
                            "law_id": law_id,
                            "part": clause.get("편"),
                            "chapter": clause.get("장"),
                            "section": clause.get("절"),
                            "article": clause.get("조"),
                            "clause": clause.get("항"),
                            "content": clause.get("항내용"),
                        }
                        clause_data_list.append(clause_data)

                    cursor.executemany(sql_clause, clause_data_list)
                    logging.debug(f"insert_law: {len(clause_data_list)}개의 law_sections 삽입 성공")
                else:
                    # 행이 이미 존재함, previous_law_id 업데이트 시도
                    if data['previous_law_id'] is not None:
                        update_sql = """
                        UPDATE law_info
                        SET previous_law_id = %(previous_law_id)s
                        WHERE law_id = %(law_id)s AND (
                            previous_law_id IS DISTINCT FROM %(previous_law_id)s OR previous_law_id IS NULL
                        )
                        RETURNING 1;
                        """
                        cursor.execute(update_sql, data)
                        update_result = cursor.fetchone()

                        if update_result:
                            # **케이스 2: 충돌 발생, previous_law_id가 업데이트됨**
                            logging.debug(f"insert_law: law_info 업데이트 성공: {data['law_id']}, previous_law_id가 업데이트됨")

                            # law_sections 삽입은 건너뜀
                            logging.debug("insert_law: law_sections 삽입을 건너뜁니다.")
                        else:
                            # **케이스 3: 충돌 발생, 그러나 previous_law_id가 업데이트되지 않음**
                            logging.debug(f"insert_law: law_info 업데이트 필요 없음: {data['law_id']}, previous_law_id가 이미 동일하거나 NULL")

                            # law_sections 삽입은 건너뜀
                            logging.debug("insert_law: law_sections 삽입을 건너뜁니다.")
                    else:
                        # **케이스 3: previous_law_id가 NULL이어서 업데이트할 수 없음**
                        logging.debug("insert_law: previous_law_id가 NULL입니다. 업데이트하지 않습니다.")

                        # law_sections 삽입은 건너뜀
                        logging.debug("insert_law: law_sections 삽입을 건너뜁니다.")
            conn.commit()
        return law_id
