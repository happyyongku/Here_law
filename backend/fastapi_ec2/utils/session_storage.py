import threading
import os
import time
import uuid
import logging

from datetime import datetime, timedelta, timezone
from typing import Dict, Any, List, Optional

from fastapi import HTTPException, status

from agents.base_agent import BaseAgent

# Session-related CONFIG with safer defaults
SESSION_TIMEOUT = timedelta(minutes=int(os.environ.get("SESSION_TIMEOUT", 5)))  # Default to 5 mins
MAX_SESSIONS_PER_USER = int(os.environ.get("MAX_SESSIONS_PER_USER", 3))  # Default to 3 sessions
SESSIONS_CLEANUP_INTERVAL = int(os.environ.get("SESSIONS_CLEANUP_INTERVAL", 300))  # Default to 300 seconds

class SessionStorage:
    """
    Singleton class for managing user sessions.
    Instead of Redis, we use an in-memory dictionary for this implementation.
    """
    _instance = None
    _KEY_LAST_ACTIVE = "last_activity"
    _KEY_CREATED = "created_at"
    _KEY_AGENT = "agent"

    def __new__(cls):
        if cls._instance is None:
            logging.debug("SessionStorage: instance does not exists. creating new...")
            cls._instance = super(SessionStorage, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        if not hasattr(self, 'initialized'):  # Make sure __init__ runs only once for the singleton
            self.storage = {}
            self.lock = threading.Lock()  # Ensure thread safety
            self.cleanup_thread = threading.Thread(target=self.session_cleanup_task, daemon=True)
            logging.debug("SessionStorage: __init__: defined cleanup thread")
            self.cleanup_thread.start()
            logging.debug("SessionStorage: __init__: started cleanup thread")
            self.initialized = True

    def session_cleanup_task(self):
        while True:
            with self.lock:
                logging.debug("session_cleanup_task: got lock")
                for user_email, session_dicts in self.storage.items():
                    self.get_active_sessions(user_email)  # This will delete expired sessions
            # Sleep for a specified interval before next cleanup
            logging.debug(f"session_cleanup_task: cleanup complete. sleeping for {SESSIONS_CLEANUP_INTERVAL} seconds....")
            time.sleep(SESSIONS_CLEANUP_INTERVAL)

    def is_session_active(self, session: dict) -> bool:
        logging.debug(f"is_session_active: checking if the session is fresh....: {session}")
        last_activity = datetime.fromisoformat(session[self._KEY_LAST_ACTIVE])
        logging.debug(f"is_session_active: current time: {datetime.now(timezone.utc)}")
        logging.debug(f"is_session_active: last activity: {last_activity}")
        logging.debug(f"is_session_active: time difference: {datetime.now(timezone.utc) - last_activity}")
        logging.debug(f"is_session_active: session timeout: {SESSION_TIMEOUT}")
        return datetime.now(timezone.utc) - last_activity < SESSION_TIMEOUT

    def get_user_sessions(self, user_email: str) -> Dict[str, Dict[str, Any]]:
        """Returns a dictionary of session_id -> session_data for a given user."""
        try:
            return self.storage[user_email]
        except KeyError:

            return {}

    def create_session(self, user_id: str, agent: BaseAgent, created_at=None, last_activity=None) -> str:
        """Creates a new session for the user."""
        with self.lock:
            sessions = self.get_user_sessions(user_id)
            if len(sessions) >= MAX_SESSIONS_PER_USER:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Maximum session limit reached.",
                )
            
            session_id = str(uuid.uuid4())
            while session_id in sessions:
                session_id = str(uuid.uuid4())

            session_data = {
                self._KEY_AGENT: agent,
                self._KEY_CREATED: created_at or datetime.now(timezone.utc).isoformat(),
                self._KEY_LAST_ACTIVE: last_activity or datetime.now(timezone.utc).isoformat(),
            }
            sessions[session_id] = session_data
            self.storage[user_id] = sessions
            return session_id

    def delete_session(self, user_email: str, session_id: str) -> Optional[Dict]:
        """Deletes a specific session for a user."""
        with self.lock:
            user_session = self.get_user_sessions(user_email)
            return user_session.pop(session_id, None)

    def get_session(self, user_email: str, session_id: str) -> Optional[Dict]:
        """Retrieves a session for a user by session_id."""
        try:
            user_sessions = self.get_user_sessions(user_email)
            return user_sessions[session_id]
        except KeyError:
            logging.debug("get_session: KeyError")
            return None

    def update_session_activity(self, user_email: str, session_id: str):
        """Updates the last activity timestamp for a session."""
        with self.lock:
            session_dict = self.get_session(user_email, session_id)
            if not session_dict:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Session not found.",
                )
            session_dict[self._KEY_LAST_ACTIVE] = datetime.now(timezone.utc).isoformat()

    def get_active_sessions(self, user_email: str) -> List[str]:
        """Returns a list of active session IDs for a user, and cleans up expired sessions."""
        with self.lock:
            sessions = self.get_user_sessions(user_email)
            active_sessions = []
            for session_id, session_dict in sessions.items():
                if self.is_session_active(session_dict):
                    active_sessions.append(session_id)
                else:
                    # Session has timed out, delete it
                    self.delete_session(user_email, session_id)
            return active_sessions
