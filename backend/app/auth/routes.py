from flask import Blueprint, request
from flask_jwt_extended import create_access_token

from app.auth.services import AuthService
from app.auth.schemas import serialize_user

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json

     # minimal validation for green phase
    if "email" not in data or "password" not in data:
        return {"error": "Email and password required"}, 400

    user = AuthService.authenticate(
        data["email"],
        data["password"]
    )

    if not user:
        return {"error": "Invalid credentials"}, 401

    token = create_access_token(
        identity=str(user["_id"]),
        additional_claims={"role": user["role"]}
    )

    return {
        "access_token": token,
        "user": serialize_user(user)
    }
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json

    if not data or not data.get("email") or not data.get("password"):
        return {"error": "Email and password required"}, 400

    AuthService.register(
        email=data["email"],
        password=data["password"],
        role="USER"   # IMPORTANT: force USER
    )

    return {"message": "User registered successfully"}, 201
