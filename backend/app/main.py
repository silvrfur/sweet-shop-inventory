from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from app.common.db import init_db
from app.auth.routes import auth_bp
from app.products.routes import products_bp


def create_app(testing=False):
    app = Flask(__name__)

    # =====================
    # Configuration
    # =====================
    app.config["JWT_SECRET_KEY"] = "super-secret-key"

    if testing:
        app.config["TESTING"] = True
        app.config["MONGO_URI"] = "mongodb://localhost:27017/sweetshop_test"
    else:
        app.config["MONGO_URI"] = "mongodb://localhost:27017/sweetshop"

    # =====================
    # Extensions
    # =====================
    CORS(app)
    JWTManager(app)

    # =====================
    # Database
    # =====================
    init_db(app)

    # =====================
    # Routes
    # =====================
    @app.route("/health")
    def health():
        return {"status": "ok"}

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(products_bp, url_prefix="/api/products")

    return app
