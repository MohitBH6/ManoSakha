from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from ..extensions import db
from ..models import Submission

assessments_bp = Blueprint("assessments", __name__, url_prefix="/assessment")


@assessments_bp.post("/submit")
@jwt_required()
def submit_assessment():
    data = request.get_json()
    user_id = int(get_jwt_identity())

    submission = Submission(
        user_id=user_id,
        assessment_id=data.get("assessment_id"),
        answers=data.get("answers"),
        total_score=data.get("total_score"),
        severity=data.get("severity"),
    )
    db.session.add(submission)
    db.session.commit()

    return jsonify({
        "message": "Submission saved",
        "submission_id": submission.id,
        "created_at": submission.created_at.isoformat(),
    }), 201


@assessments_bp.get("/submissions/<int:user_id>")
@jwt_required()
def get_submissions(user_id):
    requester_id = int(get_jwt_identity())
    if requester_id != user_id:
        return jsonify({"error": "Forbidden: you can only view your own submissions"}), 403

    submissions = (
        Submission.query.filter_by(user_id=user_id)
        .order_by(Submission.created_at.desc())
        .all()
    )
    return jsonify([
        {
            "id": s.id,
            "assessment_id": s.assessment_id,
            "answers": s.answers,
            "total_score": s.total_score,
            "severity": s.severity,
            "created_at": s.created_at.isoformat(),
        }
        for s in submissions
    ]), 200