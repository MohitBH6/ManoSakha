from pydantic import BaseModel, EmailStr
from typing import Optional

class StudentRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    phone: str
    gender: str
    dob: str
    role: str
    roll_no: str
    department: str
    year: int
    section: str
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None

class CounsellorRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    phone: str
    gender: str
    dob: str
    role: str
    employee_id: str
    qualification: str
    specialization: str
    experience_years: Optional[int] = None
    availability: Optional[str] = None
