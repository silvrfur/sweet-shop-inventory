from app.products.repository import ProductRepository


class ProductService:

    @staticmethod
    def add_product(data):
        product = {
            "name": data["name"],
            "category": data["category"],
            "price": data["price"],
            "quantity": data["quantity"]
        }
        ProductRepository.create(product)

    @staticmethod
    def get_all_products():
        return ProductRepository.find_all()

    @staticmethod
    def update_product(product_id, data):
        ProductRepository.update(product_id, data)

    @staticmethod
    def delete_product(product_id):
        ProductRepository.delete(product_id)

    @staticmethod
    def search_products(name=None, category=None, min_price=None, max_price=None):
        filters = {}

        if name:
            filters["name"] = {"$regex": name, "$options": "i"}

        if category:
            filters["category"] = category

        if min_price is not None or max_price is not None:
            filters["price"] = {}
            if min_price is not None:
                filters["price"]["$gte"] = min_price
            if max_price is not None:
                filters["price"]["$lte"] = max_price

        return ProductRepository.search(filters)
    
    @staticmethod
    def purchase_product(product_id, quantity):
        result = ProductRepository.decrease_quantity(product_id, quantity)

        if result.matched_count == 0:
            raise ValueError("Insufficient stock or invalid product")

    @staticmethod
    def restock_product(product_id, quantity):
        ProductRepository.increase_quantity(product_id, quantity)