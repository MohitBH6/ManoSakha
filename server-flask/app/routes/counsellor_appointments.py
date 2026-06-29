from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models import Appointment
from ..auth_helpers import require_role

counsellor_appointments_bp = Blueprint("counsellor_appointments", __name__, url_prefix="/appointments")


def serialize(a):
    return {
        "id": a.id,
        "student_id": a.student_id,
        "student_name": a.student.full_name if a.student else None,
        "reason": a.reason,
        "preferred_time": a.preferred_time,
        "therapy_type": a.therapy_type,
        "mode": a.mode,
        "status": a.status,
        "created_at": a.created_at.isoformat(),
    }


@counsellor_appointments_bp.get("/pending")
@require_role("counsellor")
def get_pending_appointments():
    appointments = Appointment.query.filter_by(status="pending").order_by(Appointment.created_at.desc()).all()
    return jsonify([serialize(a) for a in appointments]), 200


@counsellor_appointments_bp.get("/")
@require_role("counsellor")
def get_all_appointments():
    appointments = Appointment.query.order_by(Appointment.created_at.desc()).all()
    return jsonify([serialize(a) for a in appointments]), 200


@counsellor_appointments_bp.patch("/<int:appointment_id>")
@require_role("counsellor")
def update_appointment_status(appointment_id):
    data = request.get_json()
    new_status = data.get("status")
    if new_status not in ("approved", "rejected"):
        return jsonify({"error": "status must be 'approved' or 'rejected'"}), 400

    appointment = Appointment.query.get(appointment_id)
    if not appointment:
        return jsonify({"error": "Appointment not found"}), 404

    appointment.status = new_status
    db.session.commit()
    return jsonify({"message": "Appointment updated", "status": appointment.status}), 200