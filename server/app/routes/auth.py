from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext
from app.schemas import StudentRegister, CounsellorRegister
from app.database import students_collection, counsellors_collection

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

@router.post("/register")
async def register(data: dict):
    role = data.get("role")
    if role == "student":
        student = StudentRegister(**data)
        if students_collection.find_one({"email": student.email}):
            raise HTTPException(status_code=400, detail="Email already registered")
        student_dict = student.dict()
        # student_dict["password"] = hash_password(student.password)
        student_dict["password"] = student.password
        students_collection.insert_one(student_dict)
        return {"message": "Student registered successfully"}
    elif role == "counsellor":
        counsellor = CounsellorRegister(**data)
        if counsellors_collection.find_one({"email": counsellor.email}):
            raise HTTPException(status_code=400, detail="Email already registered")
        counsellor_dict = counsellor.dict()
        # counsellor_dict["password"] = hash_password(counsellor.password)
        counsellor_dict["password"] = counsellor.password
        counsellors_collection.insert_one(counsellor_dict)
        return {"message": "Counsellor registered successfully"}
    else:
        raise HTTPException(status_code=400, detail="Invalid role")

@router.post("/login")
async def login(data: dict):
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not email or not password or not role:
        raise HTTPException(status_code=400, detail="Email, password, and role are required")

    user = None
    if role == "student":
        user = students_collection.find_one({"email": email})
    elif role == "counsellor":
        user = counsellors_collection.find_one({"email": email})
    else:
        raise HTTPException(status_code=400, detail="Invalid role")

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # if not verify_password(password, user["password"]):
    #     raise HTTPException(status_code=401, detail="Invalid password")
    if password != user["password"]:
        raise HTTPException(status_code=401, detail="Invalid password")

    # Get the unique _id from the user document and convert it to a string.
    user_id = str(user["_id"])

    return {
        "message": f"{role.capitalize()} login successful",
        "user_id": user_id,  # <-- This is the unique ID you'll use
        "user": {
            "full_name": user.get("full_name"),
            "email": user.get("email"),
            "role": role,
        }
    }