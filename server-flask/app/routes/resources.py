from flask import Blueprint, request, jsonify, Response
from flask_jwt_extended import jwt_required

from ..extensions import db
from ..models import Resource
from ..auth_helpers import require_role

resources_bp = Blueprint("resources", __name__, url_prefix="/admin/resources")


def serialize(r):
    return {
        "id": r.id,
        "type": r.type,
        "title": r.title,
        "filename": r.title,
        "content_type": r.content_type,
        "file_id": str(r.id) if r.file_data else None,
        "description": r.description,
        "created_at": r.created_at.isoformat(),
    }


@resources_bp.get("/")
@jwt_required()
def list_resources():
    resources = Resource.query.order_by(Resource.id.desc()).all()
    return jsonify([serialize(r) for r in resources]), 200


@resources_bp.post("/upload")
@require_role("admin")
def upload_resource():
    resource_type = request.form.get("resource_type")
    if resource_type not in ("image", "video"):
        return jsonify({"error": "resource_type must be 'image' or 'video'"}), 400

    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file provided"}), 400

    resource = Resource(
        type=resource_type,
        title=request.form.get("title") or file.filename,
        description=request.form.get("description"),
        file_data=file.read(),
        content_type=file.content_type,
    )
    db.session.add(resource)
    db.session.commit()

    return jsonify({"message": "uploaded", "resource_id": resource.id}), 201


@resources_bp.post("/post")
@require_role("admin")
def create_post():
    data = request.get_json()
    resource = Resource(
        type="post",
        title=data.get("title") or "Post",
        description=data.get("description"),
        content_type="text/plain",
    )
    resource.description = data.get("content") or data.get("description")
    db.session.add(resource)
    db.session.commit()

    return jsonify({"message": "post created", "resource_id": resource.id}), 201


@resources_bp.get("/file/<int:resource_id>")
def get_file(resource_id):
    # Intentionally NOT behind @jwt_required() — <img>/<video> tags can't send
    # an Authorization header, so this one stays publicly fetchable by design.
    resource = Resource.query.get(resource_id)
    if not resource or not resource.file_data:
        return jsonify({"error": "File not found"}), 404

    return Response(resource.file_data, mimetype=resource.content_type)


@resources_bp.delete("/<int:resource_id>")
@require_role("admin")
def delete_resource(resource_id):
    resource = Resource.query.get(resource_id)
    if not resource:
        return jsonify({"error": "Resource not found"}), 404

    db.session.delete(resource)
    db.session.commit()
    return jsonify({"message": "deleted"}), 200