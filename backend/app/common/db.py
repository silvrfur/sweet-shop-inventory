from pymongo import MongoClient

_client = None
_db = None

def init_db(app):
    global _client, _db

    mongo_uri = app.config.get("MONGO_URI")

    if not mongo_uri:
        raise RuntimeError("MONGO_URI is not set in application config")

    _client = MongoClient(mongo_uri)
    _db = _client.get_database()  # uses DB name from URI

def get_db():
    if _db is None:
        raise RuntimeError("Database not initialized. Call init_db() first.")
    return _db
