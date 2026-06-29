from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token

admin_auth_bp = Blueprint("admin_auth", __name__, url_prefix="/admin")


@admin_auth_bp.post("/login")
def admin_login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if username == current_app.config["ADMIN_USERNAME"] and password == current_app.config["ADMIN_PASSWORD"]:
        token = create_access_token(identity="admin", additional_claims={"role": "admin"})
        return jsonify({"message": "Login successful", "access_token": token}), 200

    return jsonify({"error": "Invalid credentials"}), 401