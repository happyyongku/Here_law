import logging
import threading

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