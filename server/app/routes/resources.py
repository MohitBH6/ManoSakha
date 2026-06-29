# app/routes/resources.py
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List
from bson import ObjectId
import gridfs
import os
from io import BytesIO
from app.database import resources
from app.database import client, db  # using your existing database.py which exposes client and db
# If your database.py exposes students_collection etc but not client, adjust accordingly (client = MongoClient(...))

router = APIRouter()
# create GridFS instance
fs = gridfs.GridFS(db)

# Optional: resources collection for metadata
resources = db["resources"]


class ResourceOut(BaseModel):
    id: str
    type: str  # image / video / post
    title: Optional[str]
    filename: Optional[str]
    content_type: Optional[str]
    file_id: Optional[str]
    description: Optional[str]
    created_at: Optional[str]


@router.post("/upload")
async def upload_resource(
    resource_type: str = Form(...),            # "image" or "video"
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    file: UploadFile = File(...)
):
    if resource_type not in ("image", "video"):
        raise HTTPException(status_code=400, detail="resource_type must be 'image' or 'video'")

    # Read bytes
    content = await file.read()

    # Save bytes to GridFS
    try:
        file_id = fs.put(content, filename=file.filename, contentType=file.content_type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    # Save metadata in resources collection
    meta = {
        "type": resource_type,
        "title": title or file.filename,
        "filename": file.filename,
        "content_type": file.content_type,
        "file_id": file_id,
        "description": description,
    }
    res = resources.insert_one(meta)
    return {"message": "uploaded", "resource_id": str(res.inserted_id), "file_id": str(file_id)}


class PostCreate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    content: str


@router.post("/post")
async def create_post(payload: PostCreate):
    doc = {
        "type": "post",
        "title": payload.title or "Post",
        "description": payload.description,
        "content": payload.content,
    }
    res = resources.insert_one(doc)
    return {"message": "post created", "resource_id": str(res.inserted_id)}


@router.get("/", response_model=List[ResourceOut])
async def list_resources():
    out = []
    for doc in resources.find().sort("_id", -1):
        out.append({
            "id": str(doc["_id"]),
            "type": doc.get("type"),
            "title": doc.get("title"),
            "filename": doc.get("filename"),
            "content_type": doc.get("content_type"),
            "file_id": str(doc.get("file_id")) if doc.get("file_id") else None,
            "description": doc.get("description"),
            "created_at": str(doc.get("_id").generation_time) if doc.get("_id") else None
        })
    return out


@router.get("/file/{file_id}")
async def get_file(file_id: str):
    try:
        oid = ObjectId(file_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid file id")

    if not fs.exists(oid):
        raise HTTPException(status_code=404, detail="File not found")

    grid_out = fs.get(oid)
    # stream bytes
    def iterfile():
        yield grid_out.read()

    return StreamingResponse(iterfile(), media_type=grid_out.content_type, headers={
        "Content-Disposition": f'attachment; filename="{grid_out.filename}"'
    })


@router.delete("/{resource_id}")
async def delete_resource(resource_id: str):
    try:
        rid = ObjectId(resource_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid resource id")

    doc = resources.find_one({"_id": rid})
    if not doc:
        raise HTTPException(status_code=404, detail="Resource not found")

    # if there is file_id, delete file from GridFS
    file_id = doc.get("file_id")
    if file_id:
        try:
            fs.delete(ObjectId(file_id))
        except Exception:
            # ignore if fails but continue to delete metadata
            pass

    resources.delete_one({"_id": rid})
    return {"message": "deleted"}
