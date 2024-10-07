import os
from psycopg_pool import ConnectionPool
from contextlib import contextmanager

class DBConnection:
    _instance = None
    
    def __new__(cls, min_size=4, max_size=10):
        if cls._instance is None:
            cls._instance = super(DBConnection, cls).__new__(cls)
            # Connection string (conninfo)
            conninfo = (
                f"dbname={os.environ['DB_NAME']} "
                f"user={os.environ['DB_USERNAME']} "
                f"password={os.environ['DB_PASSWORD']} "
                f"host={os.environ['DB_DOMAIN']} "
                f"port={os.environ['DB_PORT_FASTAPI']}"
            )
            # Initialize connection pool
            cls._instance.pool = ConnectionPool(
                conninfo=conninfo, 
                min_size=min_size, 
                max_size=max_size
            )
        return cls._instance

    @contextmanager
    def get_connection(self, timeout: float = 30.0):
        """
        Context manager to obtain a connection from the pool. The connection
        is automatically returned to the pool at the end of the block.
        """
        try:
            with self.pool.connection(timeout=timeout) as conn:
                yield conn
        except Exception as e:
            print(f"Error obtaining connection: {e}")
            raise

    def close_pool(self):
        """Close the connection pool."""
        self.pool.close()

    def resize_pool(self, min_size: int, max_size: int):
        """Resize the connection pool at runtime."""
        self.pool.resize(min_size=min_size, max_size=max_size)

    def check_pool(self):
        """Verify the state of the connections currently in the pool."""
        self.pool.check()

    def get_pool_stats(self):
        """Return current stats about the pool usage."""
        return self.pool.get_stats()

    def pop_pool_stats(self):
        """Return and reset the current pool stats."""
        return self.pool.pop_stats()
