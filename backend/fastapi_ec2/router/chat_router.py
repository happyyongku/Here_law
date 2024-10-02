# chat_router.py
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
import os
import redis
import json
import threading
import time
import logging

from agents.rag_agent import CaseRagAgent
from dto.user_model import User
from utils.security import get_current_user
from utils.session_storage import SessionStorage
from datetime import datetime, timedelta, timezone
from langchain_core.messages.tool import ToolMessage
from langchain_core.messages.ai import AIMessage

logging.basicConfig(level=logging.DEBUG)

# 서버 CONFIG
EMBEDDER_URL = os.environ.get("EMBEDDER_URL", None)
LLM_URL = os.environ.get("LLM_URL", None)
DB_URL = os.environ.get("DB_USERNAME")\
    +":"\
    +os.environ.get("DB_PASSWORD")\
    +"@"\
    +os.environ.get("DB_DOMAIN")\
    +":"\
    +os.environ.get("DB_PORT_FASTAPI")\
    +"/"\
    +os.environ.get("DB_NAME")
API_KEY = os.environ.get("API_KEY", None)


class ChatRequest(BaseModel):
    input_data: str
    session_id: Optional[str] = None  # Optional session ID for existing sessions

class CreateSessionResponse(BaseModel):
    session_id: str
    message: str

# class HeartbeatRequest(BaseModel): #TODO: implement
#     session_id: str


class RagChatResponse(BaseModel):
    session_id: str
    tool_message: Optional[ToolMessage]
    ai_message: AIMessage

#=================Router Start========================
chat_router = APIRouter()

session_storage_instance = SessionStorage()

@chat_router.get("/case_search/new", response_model=CreateSessionResponse)
async def create_session_endpoint(user: User = Depends(get_current_user)):
    try:
        session_id = session_storage_instance.create_session(user.email, CaseRagAgent(
            db_url=DB_URL,
            embedder_url=EMBEDDER_URL,
            gpu_url=LLM_URL,
            api_key=API_KEY,
            temperature=0
        ))
    except HTTPException as e:
        raise HTTPException(status_code=500, detail=str(e))
    return CreateSessionResponse(session_id=session_id, message="Session created.")

@chat_router.post("/case_search")
async def case_search(
    request: ChatRequest,
    user: User = Depends(get_current_user)
):
    logging.debug("case_search starting....")
    session_id = request.session_id
    if not session_id:
        logging.info(f"No session_id has been provided for user {user.email}")
        raise HTTPException(status_code=400, detail="Session ID is required.")
    session = session_storage_instance.get_session(user.email, session_id)
    
    logging.debug(f"case_search: session retrieved:{session}")
    if session is None:
        logging.info(f"Session does not exist for user {user.email} with session_id={session_id}")
        raise HTTPException(status_code=404, detail="해당 세션이 존재하지 않음")
    
    if not session_storage_instance.is_session_active(session):
        session_storage_instance.get_active_sessions(user.email)
        logging.info(f"Session expired. for user {user.email}")
        raise HTTPException(status_code=404, detail="Session expired.")
    logging.debug(f"case_search: got session: {session}")
    session_storage_instance.update_session_activity(user.email, session_id)
    try:
        agent = session["agent"]

        logging.debug("Preparing inputs for the agent...")
        inputs = {"messages": [("user", request.input_data)]}
        # Get the result(PROMISE) from the agent
        result = agent(inputs)
        last_result = None # for debug
        last_tool = None
        last_ai = None
        for s in result:
            last_result = s
            latest_genned = s["messages"][-1]
            if(isinstance(latest_genned, ToolMessage)):
                last_tool = latest_genned
            elif(isinstance(latest_genned, AIMessage)):
                last_ai = latest_genned
        session_storage_instance.update_session_activity(user.email, session_id)
        result_payload = {"session_id" : session_id, "ai_message" : last_ai}
        if last_tool is not None:
            result_payload["tool_message"] = last_tool
        return RagChatResponse.model_construct(**result_payload).model_dump_json()
    except Exception as e:
        session_storage_instance.update_session_activity(user.email, session_id)
        raise HTTPException(status_code=500, detail=str(e))