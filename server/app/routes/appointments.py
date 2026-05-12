# app/routes/appointments.py
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import Optional, Literal
from bson import ObjectId
from datetime import datetime
from app.database import db

router = APIRouter()
appointments_coll = db["appointments"]

def get_current_user_id(x_user_id: str = Header(None)):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="User not authenticated")
    return x_user_id

class AppointmentCreate(BaseModel):
    reason: str
    preferred_time: datetime
    language: str
    therapy_type: Literal["self", "family", "other"]
    gender: Literal["male", "female", "other"]
    mode: Literal["in-person", "online"]
    issue: str
    identity_visibility: Literal["anonymous", "public"]

@router.post("/", summary="Book an appointment")
async def book_appointment(
    payload: AppointmentCreate,
    student_id: str = Depends(get_current_user_id)
):
    doc = {
        "student_id": student_id,
        "reason": payload.reason,
        "preferred_time": payload.preferred_time,
        "language": payload.language,
        "therapy_type": payload.therapy_type,
        "gender": payload.gender,
        "mode": payload.mode,
        "issue": payload.issue,
        "identity_visibility": payload.identity_visibility,
        "status": "pending",
        "created_at": datetime.utcnow()
    }
    res = appointments_coll.insert_one(doc)
    return {"message": "Appointment booked", "appointment_id": str(res.inserted_id)}

@router.get("/{student_id}", summary="Get appointments for student")
async def get_appointments(student_id: str):
    docs = appointments_coll.find({"student_id": student_id})
    appointments = []
    for d in docs:
        appointments.append({
            "id": str(d["_id"]),
            "reason": d["reason"],
            "preferred_time": d["preferred_time"].strftime("%Y-%m-%d %H:%M") if isinstance(d["preferred_time"], datetime) else str(d["preferred_time"]),
            "language": d.get("language"),
            "therapy_type": d.get("therapy_type"),
            "gender": d.get("gender"),
            "mode": d.get("mode"),
            "issue": d.get("issue"),
            "identity_visibility": d.get("identity_visibility"),
            "status": d.get("status", "pending"),
            "created_at": d["created_at"].strftime("%Y-%m-%d %H:%M") if isinstance(d["created_at"], datetime) else str(d["created_at"])
        })
    return appointments
