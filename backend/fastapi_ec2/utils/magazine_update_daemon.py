
import time
import logging
import threading
from datetime import datetime

from openai import OpenAI

import re
from datetime import datetime, timedelta, timezone

from utils.db_connection import DBConnection
from utils.law_service import generate_diff, get_law_infos_by_enforcement_date, reconstruct_law_text_from_sections, get_law_sections_by_law_id, get_law_info_by_law_id
from utils.magazine_service import insert_magazine_article, check_magazine_exists
from psycopg.rows import dict_row

class MagazineUpdateDaemon:
    # Singleton 패턴 구현을 위한 클래스 변수
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            logging.debug("MagazineUpdateDaemon: 새로운 인스턴스를 생성합니다.")
            cls._instance = super(MagazineUpdateDaemon, cls).__new__(cls)
        else:
            logging.debug("MagazineUpdateDaemon: 기존 인스턴스를 반환합니다.")
        return cls._instance

    def __init__(self,
                 openai_api_key,
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
            self._OPENAI_API_KEY = openai_api_key

            # 데이터베이스 연결 설정
            self.pool = DBConnection()
            self.ai_client = OpenAI(api_key=self._OPENAI_API_KEY)

            # 스레드 관련 변수 초기화
            self.api_routine = threading.Thread(target=self._daemon_thread, daemon=True)
            self.routine_running = False  # 루틴 실행 여부 플래그
            self.should_stop = False  # 루틴 중지 플래그
            self.initialized = True  # 초기화 완료 플래그
    
    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            raise RuntimeError("The instance has not been initialized!")
        return cls._instance

    def __call__(self):
        if not self.routine_running:
            logging.debug("MagazineUpdateDaemon 루틴을 시작합니다.")
            self.should_stop = False
            self.routine_running = True
            self.api_routine.start()
        else:
            logging.warning("MagazineUpdateDaemon 루틴이 이미 실행 중입니다.")

    def _daemon_thread(self):
        while not self.should_stop:
            try:
                self.update_magazines()
                time.sleep(self._ROUTINE_INTERVAL_SECONDS)
            except Exception as e:
                logging.error(f"_daemon_thread: 오류가 발생했습니다: {e}", exc_info=True)
                self.routine_running = False
                break
        logging.debug("MagazineUpdateDaemon 데몬 스레드를 중지합니다.")
        self.routine_running = False

    def stop(self) -> str:
        if not self.routine_running:
            return "스레드가 실행 중이 아닙니다."
        else:
            self.should_stop = True
            return "중지를 예약했습니다. 곧 중지됩니다..."

    def update_magazines(self, custom_day = None):
        # 1. 오늘 시행일자인 법령 정보를 가져옵니다.
        today = datetime.now().strftime("%Y-%m-%d")
        if custom_day is not None:
            today = custom_day
        law_infos = get_law_infos_by_enforcement_date(today)

        for law_info in law_infos:
            law_id = law_info['law_id']
            self.generate_and_insert_article(law_id, today)
    
    def generate_and_insert_article(self, law_id:str, generation_day=None):
        """
            Daemon thread의 작동 여부와 관계없이 law_id 를 주면 자동으로 Chatgpt를 이용해 Article을 생성한다.
        Args:
            law_id (str): 법령 id
            generation_day (_type_, optional): iso 포맷에 맞는 날짜. 이 날짜에 생성된 걸로 들어가게 된다. format yyyy-mm-dd.\nDefaults to None.
        """
        # 이미 매거진에 해당 법령이 있는지 확인합니다.
        if check_magazine_exists(law_id):
            logging.debug(f"update_magazines: law_id {law_id}에 대한 매거진이 이미 존재합니다.")
            return

        # 2. 해당 법령의 law_sections를 가져옵니다.
        current_law_sections = get_law_sections_by_law_id(law_id)
        current_law_text = reconstruct_law_text_from_sections(current_law_sections)

        previous_law_text = ""
        law_info = get_law_info_by_law_id(law_id)[0]

        if law_info.get('previous_law_id'):
            # 3. 이전 법령의 law_sections를 가져옵니다.
            previous_law_sections = get_law_sections_by_law_id(law_info['previous_law_id'])
            previous_law_text = reconstruct_law_text_from_sections(previous_law_sections)

        # 4. ChatGPT에 전달할 데이터를 생성합니다.
        diff_text = generate_diff(previous_law_text, current_law_text)
        prompt = self.create_prompt(current_law_text, diff_text)

        # 5. 기사를 생성합니다.
        article_content = self.generate_article(prompt)

        # 기사 내용을 파싱
        title, category, content = self.parse_article_content(article_content)
    
        if not title or not category or not content:
            logging.error("기사 생성 실패: 제목, 분류, 본문 중 일부가 누락되었습니다.")
            return

        # 6. 기사를 DB에 저장합니다.
        insert_magazine_article(law_id, title, category, generation_day, content)
        logging.info(f"law_id {law_id}에 대한 기사를 성공적으로 저장했습니다.")

    def create_prompt(self, law_text: str, diff_text: str) -> str:
        """ChatGPT에 전달할 프롬프트를 생성합니다."""
        prompt = f"""
        
        다음은 신규로 시행되는 법령입니다:
        {law_text}"""
        
        if diff_text is not None:
            prompt += f"""
            
            기사를 작성할 떄에는 이전 법령과의 내용적 차이점에 집중하세요.
            이전 법령과의 변경 사항은 다음과 같습니다. 몇몇 변경점은 내용의 변경점 없이 단순 형식 변경일 수 있으니 주의하세요. :
            {diff_text}"""

        
        prompt += """
        
        위 내용을 바탕으로 일반인이 이해하기 쉬운 기사 형식으로 작성해 주세요.

        문체는 존댓말을 사용하세요."""
        logging.debug(f"create_prompt: ChatGPT 프롬프트를 생성했습니다:\n{prompt}")
        return prompt

    def generate_article(self, prompt: str) -> str:
        """ChatGPT API를 이용하여 기사를 생성합니다."""
        response = self.ai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": """당신은 한국의 법률 기사 작성 기자입니다. 최대 1000자 이내의 길이로 기사를 써주세요. 기사 형식은 다음과 같습니다:
                 제목:{기사 제목}
                 분류:{11가지 기사 분류 중 하나}
                 본문:{기사 본문}
                 
                 11가지 기사 분류는 다음과 같습니다:
                 가족법, 형사법, 민사법, 부동산 및 건설, 회사 및 상사법, 국제 및 무역법, 노동 및 고용법, 조세 및 관세법, 지적재산권, 의료 및 보험법, 행정 및 공공법"""},
                {"role": "user", "content": prompt}
            ]
        )
        article_content = response.choices[0].message.content
        logging.debug(f"generate_article: 기사를 생성했습니다. 생성된 기사: \n{article_content}")
        return article_content

    @staticmethod
    def parse_article_content(article_content: str):
        """AI가 생성한 기사 내용을 파싱합니다."""
        title_match = re.search(r"제목:\s*(.*)", article_content)
        category_match = re.search(r"분류:\s*(.*)", article_content)
        content_match = re.search(r"본문:\s*(.*)", article_content, re.DOTALL)

        title = title_match.group(1).strip() if title_match else ""
        category = category_match.group(1).strip() if category_match else ""
        content = content_match.group(1).strip() if content_match else ""

        return title, category, content