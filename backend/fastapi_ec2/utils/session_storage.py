import threading
import os
import time
import uuid
import logging

from datetime import datetime, timedelta, timezone
from typing import Dict, Any, List, Optional

from fastapi import HTTPException, status

from agents.base_agent import BaseAgent

# Session-related configuration
SESSION_TIMEOUT = timedelta(seconds=int(os.environ.get("SESSION_TIMEOUT")))
MAX_SESSIONS_PER_USER = int(os.environ.get("MAX_SESSIONS_PER_USER"))
SESSIONS_CLEANUP_INTERVAL = int(os.environ.get("SESSIONS_CLEANUP_INTERVAL"))

class SessionStorage:
    """
    Singleton class for managing user sessions.
    Uses an in-memory dictionary for this implementation.
    """
    _instance = None
    _KEY_LAST_ACTIVE = "last_activity"
    _KEY_CREATED = "created_at"
    _KEY_AGENT = "agent"

    def __new__(cls):
        if cls._instance is None:
            logging.debug("SessionStorage: Creating new instance.")
            cls._instance = super(SessionStorage, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        if not hasattr(self, 'initialized'):
            self.storage: Dict[str, Dict[str, Dict[str, Any]]] = {}
            self.lock = threading.Lock()
            self.cleanup_thread = threading.Thread(target=self.session_cleanup_task, daemon=True)
            logging.debug("SessionStorage: Starting cleanup thread.")
            self.cleanup_thread.start()
            self.initialized = True

    def session_cleanup_task(self):
        while True:
            with self.lock:
                logging.debug("session_cleanup_task: Acquired lock.")
                for user_id in list(self.storage.keys()):
                    sessions = self.storage[user_id]
                    old_size = len(sessions)
                    self._get_active_sessions_lockless(user_id)
                    new_size = len(sessions)
                    if new_size < old_size:
                        logging.info(f"session_cleanup_task: Cleaned {old_size - new_size} sessions for user {user_id}.")
            logging.debug(f"session_cleanup_task: Cleanup complete. Sleeping for {SESSIONS_CLEANUP_INTERVAL} seconds.")
            time.sleep(SESSIONS_CLEANUP_INTERVAL)

    def is_session_active(self, session: Dict[str, Any]) -> bool:
        now = datetime.now(timezone.utc)
        last_activity = datetime.fromisoformat(session[self._KEY_LAST_ACTIVE])
        time_difference = now - last_activity
        logging.debug(f"is_session_active: Time difference: {time_difference}, session timeout: {SESSION_TIMEOUT}")
        return time_difference < SESSION_TIMEOUT

    def get_user_sessions(self, user_id: str) -> Dict[str, Dict[str, Any]]:
        """Returns a dictionary of session_id -> session_data for a given user."""
        return self.storage.get(user_id, {})

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

    def _delete_session_lockless(self, user_id: str, session_id: str) -> Optional[Dict[str, Any]]:
        """Deletes a specific session for a user."""
        sessions = self.get_user_sessions(user_id)
        logging.debug(f"Deleting session {session_id} for user {user_id}.")
        return sessions.pop(session_id, None)

    def delete_session(self, user_id: str, session_id: str) -> Optional[Dict[str, Any]]:
        """Deletes a specific session for a user."""
        with self.lock:
            return self._delete_session_lockless(user_id, session_id)

    def get_session(self, user_id: str, session_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves a session for a user by session_id."""
        sessions = self.get_user_sessions(user_id)
        return sessions.get(session_id)

    def update_session_activity(self, user_id: str, session_id: str):
        """Updates the last activity timestamp for a session."""
        with self.lock:
            session = self.get_session(user_id, session_id)
            if not session:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Session not found.",
                )
            session[self._KEY_LAST_ACTIVE] = datetime.now(timezone.utc).isoformat()

    def _get_active_sessions_lockless(self, user_id: str) -> List[str]:
        """Returns a list of active session IDs for a user, and cleans up expired sessions."""
        sessions = self.get_user_sessions(user_id)
        active_sessions = []
        expired_sessions = []
        for session_id, session_data in list(sessions.items()):
            if self.is_session_active(session_data):
                active_sessions.append(session_id)
            else:
                expired_sessions.append(session_id)
        # Delete expired sessions after iteration
        for session_id in expired_sessions:
            self._delete_session_lockless(user_id, session_id)
        return active_sessions

    def get_active_sessions(self, user_id: str) -> List[str]:
        """Returns a list of active session IDs for a user, and cleans up expired sessions."""
        with self.lock:
            return self._get_active_sessions_lockless(user_id)
