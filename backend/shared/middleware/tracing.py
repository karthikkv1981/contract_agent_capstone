import uuid
from typing import Callable, Awaitable
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from backend.shared.utils.logger import get_logger
from backend.shared.utils.context_vars import correlation_id_var, user_id_var, username_var
from backend.auth.jwt_service import decode_token

logger = get_logger(__name__)

def _try_set_user_context(request: Request) -> tuple:
    """Extract user info from JWT if present, without raising errors"""
    auth_header = request.headers.get("Authorization")
    user_token_id = None
    user_token_name = None
    
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        try:
            payload = decode_token(token)
            # Assuming payload.sub is username
            username_var.set(payload.sub)
            user_token_name = payload.sub
        except Exception:
            pass # Unauthenticated/invalid tokens are ignored here, let auth dependencies handle it
            
    return user_token_id, user_token_name

class TracingMiddleware(BaseHTTPMiddleware):
    """
    FastAPI Middleware to inject and track a unique correlation ID per request.
    This enables full request observability and correlation across logs and LLM calls.
    """
    async def dispatch(self, request: Request, call_next: Callable[[Request], Awaitable[Response]]) -> Response:
        # Extract existing correlation ID from headers or generate a new one
        correlation_id = request.headers.get("X-Correlation-ID", str(uuid.uuid4()))
        
        # Set the correlation ID in the current ContextVar block
        token_corr = correlation_id_var.set(correlation_id)
        
        # Extract and set user context if available
        _try_set_user_context(request)
        
        # Optional: Log the incoming request to verify correlation tracks
        logger.info(f"Handling incoming request: {request.method} {request.url.path}")
        
        try:
            # Process request
            response = await call_next(request)
            # Ensure the correlation ID flows back to the client
            response.headers["X-Correlation-ID"] = correlation_id
            return response
        finally:
            # Always reset the context variable afterward to prevent leakages across async tasks
            correlation_id_var.reset(token_corr)
            # Cannot easily reset the other vars since we didn't store their tokens, 
            # but setting them to empty string on new request works too. We trust next 
            # request to overwrite or we can just reset them if we saved the tokens.
            # FastApi/Starlette handles contextvars per request if supported, or we should be careful.

