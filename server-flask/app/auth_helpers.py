from functools import wraps
from flask_jwt_extended import jwt_required, get_jwt


def require_role(*roles):
    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            claims = get_jwt()
            if claims.get("role") not in roles:
                return {"error": "Forbidden: insufficient role"}, 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator