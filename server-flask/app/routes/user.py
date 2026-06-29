from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from ..models import User

user_bp = Blueprint("user", __name__, url_prefix="/user")


@user_bp.get("/<int:user_id>")
@jwt_required()
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"user_id": user.id, "name": user.full_name}), 200