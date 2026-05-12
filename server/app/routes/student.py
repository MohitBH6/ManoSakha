from fastapi import APIRouter, HTTPException
from app.database import db

router = APIRouter()
students_coll = db["students"]

@router.get("/profile/{user_id}", summary="Get student profile")
async def get_student_profile(user_id: str):
    student = students_coll.find_one({"user_id": user_id})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return {
        "student_id": str(student["_id"]),
        "name": student.get("name"),
        "roll_no": student.get("roll_no"),
        "email": student.get("email"),
        "department": student.get("department"),
        "semester": student.get("semester"),
        "section": student.get("section"),
    }
