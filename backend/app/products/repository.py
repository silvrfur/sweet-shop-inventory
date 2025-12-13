from bson import ObjectId
from app.common.db import get_db


class ProductRepository:

    @staticmethod
    def create(product):
        db = get_db()
        return db.products.insert_one(product)

    @staticmethod
    def find_all():
        db = get_db()
        return list(db.products.find())

    @staticmethod
    def find_by_id(product_id):
        db = get_db()
        return db.products.find_one({"_id": ObjectId(product_id)})

    @staticmethod
    def update(product_id, data):
        db = get_db()
        return db.products.update_one(
            {"_id": ObjectId(product_id)},
            {"$set": data}
        )

    @staticmethod
    def delete(product_id):
        db = get_db()
        return db.products.delete_one(
            {"_id": ObjectId(product_id)}
        )

    @staticmethod
    def search(filters):
        db = get_db()
        return list(db.products.find(filters))

    @staticmethod
    def decrease_quantity(product_id, amount):
        db = get_db()
        return db.products.update_one(
            {
                "_id": ObjectId(product_id),
                "quantity": {"$gte": amount}
            },
            {
                "$inc": {"quantity": -amount}
            }
        )

    @staticmethod
    def increase_quantity(product_id, amount):
        db = get_db()
        return db.products.update_one(
            {"_id": ObjectId(product_id)},
            {"$inc": {"quantity": amount}}
        )