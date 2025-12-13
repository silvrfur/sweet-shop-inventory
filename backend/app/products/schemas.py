def serialize_product(product):
    return {
        "id": str(product["_id"]),
        "name": product["name"],
        "category": product["category"],
        "price": product["price"],
        "quantity": product["quantity"]
    }
