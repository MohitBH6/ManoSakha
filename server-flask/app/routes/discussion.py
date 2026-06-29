from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from ..extensions import db
from ..models import DiscussionPost, DiscussionReply, User

discussion_bp = Blueprint("discussion", __name__, url_prefix="/discussion")


def serialize_post(post):
    return {
        "id": post.id,
        "author_name": post.author_name,
        "content": post.content,
        "timestamp": post.timestamp.isoformat(),
        "replies": [
            {
                "id": r.id,
                "author_name": r.author_name,
                "content": r.content,
                "timestamp": r.timestamp.isoformat(),
            }
            for r in post.replies
        ],
    }


@discussion_bp.get("/")
@jwt_required()
def get_posts():
    posts = DiscussionPost.query.order_by(DiscussionPost.timestamp.desc()).all()
    return jsonify([serialize_post(p) for p in posts]), 200


@discussion_bp.post("/")
@jwt_required()
def create_post():
    data = request.get_json()
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    is_anonymous = data.get("anonymous", False)
    display_name = "Anonymous" if is_anonymous else user.full_name

    post = DiscussionPost(
        author_id=user_id,
        author_name=display_name,
        content=data.get("content"),
    )
    db.session.add(post)
    db.session.commit()

    return jsonify(serialize_post(post)), 201


@discussion_bp.post("/<int:post_id>/reply")
@jwt_required()
def create_reply(post_id):
    data = request.get_json()
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    post = DiscussionPost.query.get(post_id)
    if not post:
        return jsonify({"error": "Post not found"}), 404

    is_anonymous = data.get("anonymous", False)
    display_name = "Anonymous" if is_anonymous else user.full_name

    reply = DiscussionReply(
        post_id=post_id,
        author_id=user_id,
        author_name=display_name,
        content=data.get("content"),
    )
    db.session.add(reply)
    db.session.commit()

    return jsonify(serialize_post(post)), 201