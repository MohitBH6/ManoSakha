from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from app.database import students_collection, counsellors_collection
from app.schemas import StudentRegister, CounsellorRegister
from passlib.context import CryptContext
import pandas as pd
from io import BytesIO

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

@router.post("/upload")
async def upload_users(
    role: str = Form(...), 
    file: UploadFile = File(...)
):
    if role not in ["student", "counsellor"]:
        raise HTTPException(status_code=400, detail="Role must be 'student' or 'counsellor'")

    if not file.filename.endswith((".xlsx", ".csv")):
        raise HTTPException(status_code=400, detail="File must be .xlsx or .csv")
    
    content = await file.read()
    df = None
    if file.filename.endswith(".xlsx"):
        df = pd.read_excel(BytesIO(content))
    else:
        df = pd.read_csv(BytesIO(content))

    report = {"total_rows": len(df), "success_count": 0, "failed_count": 0, "errors": []}

    for idx, row in df.iterrows():
        try:
            user_data = row.to_dict()
            
            # Convert numeric fields to string for Pydantic
            for field in ["phone", "roll_no", "emergency_contact_phone", "employee_id"]:
                if field in user_data and pd.notna(user_data[field]):
                    user_data[field] = str(user_data[field])

            if role == "student":
                user = StudentRegister(**user_data)
                if students_collection.find_one({"email": user.email}):
                    raise ValueError("Duplicate email")
                user_dict = user.dict()
                user_dict["password"] = hash_password(user.password)
                students_collection.insert_one(user_dict)

            else:  # counsellor
                user = CounsellorRegister(**user_data)
                if counsellors_collection.find_one({"email": user.email}):
                    raise ValueError("Duplicate email")
                user_dict = user.dict()
                user_dict["password"] = hash_password(user.password)
                counsellors_collection.insert_one(user_dict)

            report["success_count"] += 1

        except Exception as e:
            report["failed_count"] += 1
            report["errors"].append({
                "row": idx + 2,
                "email": row.get("email", ""),
                "error": str(e)
            })
    return report
