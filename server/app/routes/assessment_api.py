from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List
from datetime import datetime
from app.database import db  # make sure this exports a connected MongoDB db

# MongoDB collection
submissions_collection = db["submissions"]

# Create router
router = APIRouter(prefix="/assessment", tags=["Assessment"])

# Pydantic models
class Submission(BaseModel):
    user_id: str
    assessment_id: str
    answers: Dict[str, int]
    total_score: int
    severity: str
    date: datetime = datetime.utcnow()

class AllSubmissions(BaseModel):
    submissions: List[Submission]

# Save multiple submissions at once
@router.post("/submit")
def submit_assessments(all_submissions: AllSubmissions):
    try:
        submissions_dicts = [sub.dict() for sub in all_submissions.submissions]
        submissions_collection.insert_many(submissions_dicts)
        return {"message": "Submissions saved successfully!", "count": len(submissions_dicts)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get all submissions for a user
@router.get("/submissions/{user_id}")
def get_user_submissions(user_id: str):
    try:
        user_subs = list(submissions_collection.find({"user_id": user_id}, {"_id": 0}))
        return {"submissions": user_subs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
