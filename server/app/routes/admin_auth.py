from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os

router = APIRouter()

class AdminLogin(BaseModel):
    username: str
    password: str

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")

@router.post("/login")
async def admin_login(data: AdminLogin):
    if data.username == ADMIN_USERNAME and data.password == ADMIN_PASSWORD:
        return {"message": "Login successful"}
    raise HTTPException(status_code=401, detail="Invalid credentials")
