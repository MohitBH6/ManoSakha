import bcrypt
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token

from ..extensions import db
from ..models import User, StudentProfile, CounsellorProfile
from ..schemas import validate_register_payload

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    data = request.get_json()
    role = data.get("role")

    error = validate_register_payload(data, role)
    if error:
        return jsonify({"error": error}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already registered"}), 409

    hashed = bcrypt.hashpw(data["password"].encode("utf-8"), bcrypt.gensalt())

    user = User(
        email=data["email"],
        password_hash=hashed.decode("utf-8"),
        full_name=data["full_name"],
        role=role,
        phone=data.get("phone"),
        gender=data.get("gender"),
        dob=data.get("dob"),
    )
    db.session.add(user)
    db.session.flush()  # assigns user.id without finishing the transaction yet

    if role == "student":
        profile = StudentProfile(
            user_id=user.id,
            roll_no=data["roll_no"],
            department=data["department"],
            year=data["year"],
            section=data["section"],
            emergency_contact_name=data.get("emergency_contact_name"),
            emergency_contact_phone=data.get("emergency_contact_phone"),
        )
    else:
        profile = CounsellorProfile(
            user_id=user.id,
            employee_id=data["employee_id"],
            qualification=data["qualification"],
            specialization=data["specialization"],
            experience_years=data.get("experience_years"),
            availability=data.get("availability"),
        )

    db.session.add(profile)
    db.session.commit()

    return jsonify({"message": "Registered successfully", "user_id": user.id}), 201


@auth_bp.post("/login")
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    if not bcrypt.checkpw(password.encode("utf-8"), user.password_hash.encode("utf-8")):
        return jsonify({"error": "Invalid email or password"}), 401

    token = create_access_token(identity=str(user.id), additional_claims={"role": user.role})

    return jsonify({
        "message": "Login successful",
        "access_token": token,
        "user_id": user.id,
        "role": user.role,
        "full_name": user.full_name,
    }), 200