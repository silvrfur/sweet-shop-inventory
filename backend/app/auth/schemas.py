def serialize_user(user):
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "role": user["role"]
    }
