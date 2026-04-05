from pymongo import MongoClient
from config import MONGO_URI, DB_NAME

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
users_collection = db["users"]
meetings_collection = db["meetings"]

# AUTO-FIX indexes on startup
try:
    users_collection.drop_index("username_1")
    print("Removed bad username_1 index")
except:
    pass

users_collection.create_index("email", unique=True)
print("Fixed indexes - Ready!")