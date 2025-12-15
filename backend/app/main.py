from dotenv import load_dotenv
load_dotenv()

import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from app.common.db import init_db
from app.auth.routes import auth_bp
from app.products.routes import products_bp


def create_app(testing=False):
    app = Flask(__name__)

    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
    app.config["MONGO_URI"] = os.getenv("MONGO_URI")

    if testing:
        app.config["TESTING"] = True

    CORS(
        app,
        resources={r"/api/*": {
            "origins": [
                "http://localhost:5173",
                "https://sweet-shop-inventory.vercel.app"
            ]
        }},
        supports_credentials=True,
        expose_headers=["Authorization"]
    )

    JWTManager(app)
    init_db(app)

    @app.route("/health")
    def health():
        return {"status": "ok"}

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(products_bp, url_prefix="/api/products")

    return app
