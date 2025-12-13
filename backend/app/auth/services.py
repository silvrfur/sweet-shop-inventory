import bcrypt

from app.common.db import get_db

class AuthService:

    @staticmethod
    def register(email, password, role="USER"):
        db=get_db()
        hashed_password = bcrypt.hashpw(
            password.encode(),
            bcrypt.gensalt()
        )

        user = {
            "email": email,
            "password": hashed_password,
            "role": role
        }

        db.users.insert_one(user)

    @staticmethod
    def authenticate(email, password):
        db = get_db()
        user = db.users.find_one({"email": email})

        if not user:
            return None

        stored_password = user["password"]

        if isinstance(stored_password, str):
            stored_password = stored_password.encode()

        if bcrypt.checkpw(password.encode(), stored_password):
            return user

        return None
