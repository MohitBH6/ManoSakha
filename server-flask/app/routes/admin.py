import bcrypt
import pandas as pd
from io import BytesIO
from flask import Blueprint, request, jsonify

from ..extensions import db
from ..models import User, StudentProfile, CounsellorProfile
from ..auth_helpers import require_role

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


@admin_bp.post("/upload")
@require_role("admin")
def upload_users():
    role = request.form.get("role")
    file = request.files.get("file")

    if role not in ("student", "counsellor"):
        return jsonify({"error": "Role must be 'student' or 'counsellor'"}), 400
    if not file or not file.filename.endswith((".xlsx", ".csv")):
        return jsonify({"error": "File must be .xlsx or .csv"}), 400

    content = file.read()
    df = pd.read_excel(BytesIO(content)) if file.filename.endswith(".xlsx") else pd.read_csv(BytesIO(content))

    report = {"total_rows": len(df), "success_count": 0, "failed_count": 0, "errors": []}

    for idx, row in df.iterrows():
        try:
            data = row.to_dict()
            email = data.get("email")

            if User.query.filter_by(email=email).first():
                raise ValueError("Duplicate email")

            user = User(
                email=email,
                password_hash=hash_password(str(data["password"])),
                full_name=data.get("full_name"),
                role=role,
                phone=str(data.get("phone")),
                gender=data.get("gender"),
                dob=str(data.get("dob")),
            )
            db.session.add(user)
            db.session.flush()

            if role == "student":
                profile = StudentProfile(
                    user_id=user.id,
                    roll_no=str(data.get("roll_no")),
                    department=data.get("department"),
                    year=int(data.get("year")) if pd.notna(data.get("year")) else None,
                    section=data.get("section"),
                )
            else:
                profile = CounsellorProfile(
                    user_id=user.id,
                    employee_id=str(data.get("employee_id")),
                    qualification=data.get("qualification"),
                    specialization=data.get("specialization"),
                )
            db.session.add(profile)
            db.session.commit()
            report["success_count"] += 1

        except Exception as e:
            db.session.rollback()
            report["failed_count"] += 1
            report["errors"].append({"row": idx + 2, "email": row.get("email", ""), "error": str(e)})

    return jsonify(report), 200