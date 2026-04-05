import os
from dotenv import load_dotenv

# Force load .env manually (THIS FIXES YOUR ISSUE)
load_dotenv(dotenv_path=".env")

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

SECRET_KEY = os.getenv("SECRET_KEY","ai1234")
ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60

UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"

# Debug print (temporary)
print("MONGO_URI:", MONGO_URI)
print("DB_NAME:", DB_NAME)