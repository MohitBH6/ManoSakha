import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise ValueError("❌ MONGO_URI is not set in .env file")

client = MongoClient(MONGO_URI)
db = client["sih"]

students_collection = db["students"]
counsellors_collection = db["counsellors"]
resources = db["resources"]
print("✅ Connected to MongoDB Atlas successfully")
