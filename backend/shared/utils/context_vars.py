import contextvars

# Context variables for request tracing and tracking authenticated actor (SRP, DRY)
correlation_id_var: contextvars.ContextVar[str] = contextvars.ContextVar("correlation_id", default="")
user_id_var: contextvars.ContextVar[str] = contextvars.ContextVar("user_id", default="")
username_var: contextvars.ContextVar[str] = contextvars.ContextVar("username", default="")
