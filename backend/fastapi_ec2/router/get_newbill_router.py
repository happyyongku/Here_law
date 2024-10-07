import os
import json
import psycopg2
import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# 라우터 객체 생성
new_bill_router = APIRouter()

# PostgreSQL 연결 설정 함수
def connect_db():
    return psycopg2.connect(
        dbname=os.environ.get("DB_NAME"),
        user=os.environ.get("DB_USERNAME"),
        password=os.environ.get("DB_PASSWORD"),
        host=os.environ.get("DB_DOMAIN"),
        port=os.environ.get("DB_PORT_FASTAPI")
    )

# WebSocket 연결 관리 클래스
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

# WebSocket 연결 관리자
manager = ConnectionManager()

# PostgreSQL NOTIFY 감지
async def listen_for_db_notifications():
    conn = connect_db()
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = conn.cursor()
    cur.execute("LISTEN new_bill;")  # 새로운 데이터에 대해 'new_bill' 이벤트 리슨

    while True:
        conn.poll()
        while conn.notifies:
            notify = conn.notifies.pop(0)
            payload = json.loads(notify.payload)
            print(f"New bill notification: {payload}")
            await manager.broadcast(json.dumps(payload))
        await asyncio.sleep(1)

# WebSocket 라우터 - 새로운 법안 알림 전송
@new_bill_router.websocket("/ws/bill_notifications")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_personal_message(f"Message received: {data}", websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# DB 변경 감지를 백그라운드로 실행
@new_bill_router.on_event("startup")
async def startup_event():
    asyncio.create_task(listen_for_db_notifications())