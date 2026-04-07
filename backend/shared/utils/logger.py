import logging
import json
from datetime import datetime
from typing import Optional

from backend.shared.utils.context_vars import correlation_id_var, user_id_var, username_var

class JsonFormatter(logging.Formatter):
    """
    A unified standard JSON formatter that automatically injects the active correlation_id, 
    user_id, and username from contextvars, adhering to structured logging best practices.
    """
    def format(self, record: logging.LogRecord) -> str:
        log_record = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "name": record.name,
            "message": record.getMessage(),
        }
        
        correlation_id = correlation_id_var.get()
        if correlation_id:
            log_record["correlation_id"] = correlation_id
            
        username = username_var.get()
        if username:
            log_record["username"] = username
            
        user_id = user_id_var.get()
        if user_id:
            log_record["user_id"] = user_id
            
        if record.exc_info:
            log_record["exception"] = self.formatException(record.exc_info)
            
        return json.dumps(log_record)

def setup_logging(level: int = logging.INFO):
    """
    Configure the root Python logger to use our JSON Formatter.
    This centralized configuration should be called on app startup.
    """
    handler = logging.StreamHandler()
    handler.setFormatter(JsonFormatter())
    
    # Configure the root logger exactly once to avoid duplicate logs
    logging.root.setLevel(level)
    # Remove existing handlers to ensure we only have our JSON formatter
    logging.root.handlers = [handler]

def get_logger(name: str) -> logging.Logger:
    """
    Get a pre-configured logger instance.
    This serves as the single entry point for creating loggers codebase-wide
    (DRY principle).
    """
    return logging.getLogger(name)

# Ensure logging is setup globally as soon as this utility is imported
setup_logging()
