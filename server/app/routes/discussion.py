from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from app.database import db  # your MongoDB connection file
import uuid
from datetime import datetime, timezone, timedelta

router = APIRouter(prefix="/discussion", tags=["Discussion"])

IST = timezone(timedelta(hours=5, minutes=30))

# --------- Helpers ----------
def serialize_post(post):
    return {
        "id": str(post["_id"]),
        "author_id": post["author_id"],
        "author_name": post["author_name"],
        "content": post["content"],
        "timestamp": post["timestamp"],
        "replies": post.get("replies", [])
    }

# --------- Models ----------
class PostCreate(BaseModel):
    author_id: str
    author_name: str   # "Anonymous" or real name
    content: str

class ReplyCreate(BaseModel):
    author_id: str
    author_name: str
    content: str

# --------- Endpoints ----------

# 1. Create Post
@router.post("/post")
async def create_post(post: PostCreate):
    post_data = {
        "author_id": post.author_id,
        "author_name": post.author_name,
        "content": post.content,
        "timestamp": datetime.now(IST).isoformat(),
        "replies": []
    }
    result = db.discussion_posts.insert_one(post_data)
    return {"message": "Post created successfully", "post_id": str(result.inserted_id)}

# 2. Get All Posts (latest first)
@router.get("/posts")
async def get_posts():
    posts = db.discussion_posts.find().sort("timestamp", -1)
    return [serialize_post(post) for post in posts]

# 3. Add Reply to a Post
@router.post("/reply/{post_id}")
async def add_reply(post_id: str, reply: ReplyCreate):
    reply_data = {
        "reply_id": str(uuid.uuid4()),
        "author_id": reply.author_id,
        "author_name": reply.author_name,
        "content": reply.content,
        "timestamp": datetime.now(IST).isoformat()
    }

    result = db.discussion_posts.update_one(
        {"_id": ObjectId(post_id)},
        {"$push": {"replies": reply_data}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")

    return {"message": "Reply added successfully"}

# 4. (Optional) Delete Post
@router.delete("/post/{post_id}")
async def delete_post(post_id: str):
    result = db.discussion_posts.delete_one({"_id": ObjectId(post_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"message": "Post deleted successfully"}

# 5. (Optional) Delete Reply
@router.delete("/reply/{post_id}/{reply_id}")
async def delete_reply(post_id: str, reply_id: str):
    result = db.discussion_posts.update_one(
        {"_id": ObjectId(post_id)},
        {"$pull": {"replies": {"reply_id": reply_id}}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Reply not found or Post not found")
    return {"message": "Reply deleted successfully"}
