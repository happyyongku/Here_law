import os
from dotenv import load_dotenv

load_dotenv()

DB_NAME = os.environ.get("JWT_EXPIRATION")

print(DB_NAME)