from pymongo import MongoClient

_client = None
_db = None

def init_db(app):
    global _client, _db
    _client = MongoClient("mongodb://localhost:27017")
    _db = _client["shreeram_mithai"]

def get_db():
    if _db is None:
        raise RuntimeError("Database not initialized. Call init_db() first.")
    return _db
