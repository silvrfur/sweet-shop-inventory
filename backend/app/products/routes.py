from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt

from app.products.services import ProductService
from app.products.schemas import serialize_product
from app.common.decorators import login_required,admin_required
products_bp = Blueprint("products", __name__)

@products_bp.route("", methods=["POST"])
@admin_required()
def add_product():
    ProductService.add_product(request.json)
    return {"message": "Sweet added successfully"}, 201

@products_bp.route("", methods=["GET"])
@jwt_required()
def get_products():
    products = ProductService.get_all_products()
    return [serialize_product(p) for p in products]

@products_bp.route("/search", methods=["GET"])
@jwt_required()
def search_products():
    name = request.args.get("name")
    category = request.args.get("category")
    min_price = request.args.get("min_price", type=float)
    max_price = request.args.get("max_price", type=float)

    products = ProductService.search_products(
        name=name,
        category=category,
        min_price=min_price,
        max_price=max_price
    )

    return [serialize_product(p) for p in products]

@products_bp.route("/<product_id>", methods=["PUT"])
@admin_required()
def update_product(product_id):
    ProductService.update_product(product_id, request.json)
    return {"message": "Sweet updated successfully"}

@products_bp.route("/<product_id>", methods=["DELETE"])
@admin_required()
def delete_product(product_id):
    claims = get_jwt()

    if claims.get("role") != "ADMIN":
        return {"error": "Admin access required"}, 403

    ProductService.delete_product(product_id)
    return {"message": "Sweet deleted successfully"}

@products_bp.route("/<product_id>/purchase", methods=["POST"])
@jwt_required()
def purchase_product(product_id):
    data = request.json
    quantity = data.get("quantity", 1)

    try:
        ProductService.purchase_product(product_id, quantity)
        return {"message": "Purchase successful"}
    except ValueError as e:
        return {"error": str(e)}, 400

@products_bp.route("/<product_id>/restock", methods=["POST"])
@admin_required()
def restock_product(product_id):
    data = request.json
    quantity = data.get("quantity")

    if not quantity or quantity <= 0:
        return {"error": "Valid quantity required"}, 400

    ProductService.restock_product(product_id, quantity)
    return {"message": "Sweet restocked successfully"}


