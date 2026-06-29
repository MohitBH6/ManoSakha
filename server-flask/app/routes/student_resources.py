from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from ..models import Resource
from .resources import serialize

student_resources_bp = Blueprint("student_resources", __name__, url_prefix="/student/resources")


@student_resources_bp.get("/")
@jwt_required()
def list_resources_for_students():
    resources = Resource.query.order_by(Resource.id.desc()).all()
    return jsonify([serialize(r) for r in resources]), 200