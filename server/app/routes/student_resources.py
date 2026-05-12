# app/routes/student_resources.py
from fastapi import APIRouter, HTTPException
from typing import List
from bson import ObjectId
from app.database import db

router = APIRouter()
resources_coll = db["resources"]

@router.get("/", summary="List all resources for students")
async def list_resources():
    out = []
    for doc in resources_coll.find().sort("_id", -1):
        out.append({
            "id": str(doc["_id"]),
            "type": doc.get("type"),
            "title": doc.get("title"),
            "filename": doc.get("filename"),
            "content_type": doc.get("content_type"),
            "file_id": str(doc.get("file_id")) if doc.get("file_id") else None,
            "description": doc.get("description"),
            "created_at": str(doc["_id"].generation_time) if doc.get("_id") else None
        })
    return out
