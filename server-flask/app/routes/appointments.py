from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity

from ..extensions import db
from ..models import Appointment
from ..auth_helpers import require_role

student_appointments_bp = Blueprint("student_appointments", __name__, url_prefix="/student/appointments")


@student_appointments_bp.post("/")
@require_role("student")
def book_appointment():
    data = request.get_json()
    student_id = int(get_jwt_identity())  # who they ARE, from the token — not from the request body

    appointment = Appointment(
        student_id=student_id,
        reason=data.get("reason"),
        preferred_time=data.get("preferred_time"),
        therapy_type=data.get("therapy_type"),
        mode=data.get("mode"),
        gender_preference=data.get("gender_preference") or data.get("gender"),
        language=data.get("language"),
        identity_visibility=data.get("identity_visibility"),
    )
    db.session.add(appointment)
    db.session.commit()

    return jsonify({"message": "Appointment booked", "appointment_id": appointment.id}), 201


@student_appointments_bp.get("/<int:student_id>")
@require_role("student")
def get_my_appointments(student_id):
    requester_id = int(get_jwt_identity())
    if requester_id != student_id:
        return jsonify({"error": "Forbidden: you can only view your own appointments"}), 403

    appointments = (
        Appointment.query.filter_by(student_id=student_id)
        .order_by(Appointment.created_at.desc())
        .all()
    )
    return jsonify([
        {
            "id": a.id,
            "reason": a.reason,
            "preferred_time": a.preferred_time,
            "therapy_type": a.therapy_type,
            "mode": a.mode,
            "status": a.status,
            "created_at": a.created_at.isoformat(),
        }
        for a in appointments
    ]), 200