from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt


def login_required():
    """
    Ensures the request has a valid JWT.
    Used for endpoints accessible to BOTH USER and ADMIN.
    """

    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            # Step 1: Verify JWT exists and is valid
            verify_jwt_in_request()

            # Step 2: Allow request to proceed
            return fn(*args, **kwargs)

        return decorator

    return wrapper


def admin_required():
    """
    Ensures the request has a valid JWT AND the user role is ADMIN.
    Used for admin-only operations like add/update/delete.
    """

    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            # Step 1: Verify JWT exists and is valid
            verify_jwt_in_request()

            # Step 2: Extract JWT claims
            claims = get_jwt()

            # Step 3: Enforce ADMIN role
            if claims.get("role") != "ADMIN":
                return {"error": "Admin access required"}, 403

            # Step 4: Allow request to proceed
            return fn(*args, **kwargs)

        return decorator

    return wrapper
