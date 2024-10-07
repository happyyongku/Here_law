import logging
import threading
from abc import ABC, abstractmethod

class SingletonMeta(type):
    """
    싱글톤 메타클래스
    """
    _instances = {}
    _lock = threading.Lock()

    def __call__(cls, *args, **kwargs):
        # 스레드 안전성을 위해 Lock 사용
        with cls._lock:
            if cls not in cls._instances:
                logging.debug(f"{cls.__name__}: 새로운 인스턴스를 생성합니다.")
                cls._instances[cls] = super().__call__(*args, **kwargs)
            else:
                logging.debug(f"{cls.__name__}: 기존 인스턴스를 반환합니다.")
        return cls._instances[cls]

class BaseDaemon(ABC, metaclass=SingletonMeta):
    """
    데몬 스레드를 관리하기 위한 베이스 클래스
    """
    _CLASS_NAME = "BaseDaemon"

    def __init__(self):
        # 초기화 여부 확인
        if not hasattr(self, '_initialized'):
            self._thread = None  # 데몬 스레드
            self._stop_event = threading.Event()  # 스레드 중지 이벤트
            self._initialized = True  # 초기화 완료 플래그

    def __call__(self):
        """
        데몬 스레드를 시작합니다.
        """
        if self._thread is None or not self._thread.is_alive():
            logging.debug(f"{self._CLASS_NAME}: 데몬 스레드를 시작합니다.")
            self._stop_event.clear()
            self._thread = threading.Thread(target=self._run, daemon=True)
            self._thread.start()
        else:
            logging.warning(f"{self._CLASS_NAME}: 데몬 스레드가 이미 실행 중입니다.")

    def stop(self) -> str:
        """
        데몬 스레드를 중지합니다.
        """
        if self._thread is None or not self._thread.is_alive():
            return f"{self._CLASS_NAME}: 데몬 스레드가 실행 중이 아닙니다."
        else:
            logging.debug(f"{self._CLASS_NAME}: 데몬 스레드를 중지합니다.")
            self._stop_event.set()
            self._thread.join()
            return f"{self._CLASS_NAME}: 데몬 스레드가 중지되었습니다."

    def _run(self):
        """
        데몬 스레드의 실행 루틴
        """
        try:
            self._daemon_thread()
        except Exception as e:
            logging.error(f"{self._CLASS_NAME}: 데몬 스레드 실행 중 예외 발생 - {e}")
        finally:
            logging.debug(f"{self._CLASS_NAME}: 데몬 스레드가 종료되었습니다.")

    @abstractmethod
    def _daemon_thread(self):
        """
        자식 클래스에서 구현해야 하는 데몬 스레드 메서드
        """
        pass
