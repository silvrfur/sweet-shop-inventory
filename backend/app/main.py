from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from app.common.db import init_db
from app.auth.routes import auth_bp

def create_app():
    app = Flask(__name__)

    app.config["JWT_SECRET_KEY"] = "super-secret-key"

    CORS(app)
    JWTManager(app)

    init_db(app)

    @app.route("/health")
    def health():
        return {"status": "ok"}
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    return app
