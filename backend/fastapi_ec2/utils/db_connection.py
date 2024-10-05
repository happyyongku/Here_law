import os
from psycopg_pool import ConnectionPool

class DBConnection:
    _instance = None
    _DSN = f'dbname={os.environ["DB_USERNAME"]} user={os.environ["DB_NAME"]} password={os.environ["DB_PASSWORD"]} host={os.environ["DB_DOMAIN"]} port={os.environ["DB_PORT_FASTAPI"]}'
    def __new__(cls, min_size=1, max_size=10):
        if cls._instance is None:
            cls._instance = super(DBConnection, cls).__new__(cls)
            cls._instance._initialize_pool(cls._DSN, min_size, max_size)
        return cls._instance

    def _initialize_pool(self, dsn, min_size, max_size):
        self.pool = ConnectionPool(dsn, min_size=min_size, max_size=max_size)

    def __call__(self):
        return self.pool.connection()
