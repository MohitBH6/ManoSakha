from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from bson import ObjectId
from datetime import datetime
from app.database import db

router = APIRouter()
appointments_coll = db["appointments"]

# Approve/reject payload
class AppointmentUpdate(BaseModel):
    status: str  # "approved" or "rejected"

# Get all pending appointments (for all counsellors)
@router.get("/pending", summary="Get all pending appointments")
async def get_pending_appointments():
    docs = appointments_coll.find({"status": "pending"})
    appointments = []
    for d in docs:
        appointments.append({
            "id": str(d["_id"]),
            "student_id": d["student_id"],
            "reason": d["reason"],
            "preferred_time": d["preferred_time"].strftime("%Y-%m-%d %H:%M") if isinstance(d["preferred_time"], datetime) else str(d["preferred_time"]),
            "status": d["status"],
            "created_at": d["created_at"].strftime("%Y-%m-%d %H:%M") if isinstance(d["created_at"], datetime) else str(d["created_at"]),
        })
    return appointments

# Update appointment status
@router.patch("/{appointment_id}", summary="Update appointment status")
async def update_appointment_status(appointment_id: str, payload: AppointmentUpdate):
    res = appointments_coll.update_one(
        {"_id": ObjectId(appointment_id)},
        {"$set": {"status": payload.status}}
    )
    if res.modified_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"message": f"Appointment {payload.status}"}
