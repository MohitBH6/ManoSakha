from fastapi import APIRouter, HTTPException
from app.database import db
from bson import ObjectId



router = APIRouter(prefix="/user", tags=["User"])

@router.get("/{user_id}")
async def get_user(user_id: str):
    # Check in students collection
    user = db.students.find_one({"_id": ObjectId(user_id)})
    if not user:
        # Check in teachers collection
        user = db.counsellors.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    result = {"user_id": user_id, "name": user.get("full_name", "Unknown")}
    # print("Returning user info:", result)  # <-- this will print to your server console
    return result

