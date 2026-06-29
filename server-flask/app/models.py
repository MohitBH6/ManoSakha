from datetime import datetime
from .extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # "student" or "counsellor"
    phone = db.Column(db.String(20))
    gender = db.Column(db.String(20))
    dob = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # one-to-one links to the role-specific tables
    student_profile = db.relationship("StudentProfile", backref="user", uselist=False, cascade="all, delete-orphan")
    counsellor_profile = db.relationship("CounsellorProfile", backref="user", uselist=False, cascade="all, delete-orphan")


class StudentProfile(db.Model):
    __tablename__ = "student_profiles"

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
    roll_no = db.Column(db.String(50), unique=True, nullable=False)
    department = db.Column(db.String(100))
    year = db.Column(db.Integer)
    section = db.Column(db.String(10))
    emergency_contact_name = db.Column(db.String(255))
    emergency_contact_phone = db.Column(db.String(20))


class CounsellorProfile(db.Model):
    __tablename__ = "counsellor_profiles"

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
    employee_id = db.Column(db.String(50), unique=True, nullable=False)
    qualification = db.Column(db.String(255))
    specialization = db.Column(db.String(255))
    experience_years = db.Column(db.Integer)
    availability = db.Column(db.String(255))


class Appointment(db.Model):
    __tablename__ = "appointments"

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    reason = db.Column(db.Text)
    preferred_time = db.Column(db.String(100))
    therapy_type = db.Column(db.String(100))
    mode = db.Column(db.String(50))
    gender_preference = db.Column(db.String(50))
    language = db.Column(db.String(50))
    identity_visibility = db.Column(db.String(50))
    status = db.Column(db.String(20), default="pending")  # pending / approved / rejected
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    student = db.relationship("User", backref="appointments")


class DiscussionPost(db.Model):
    __tablename__ = "discussion_posts"

    id = db.Column(db.Integer, primary_key=True)
    author_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    author_name = db.Column(db.String(255))  # "Anonymous" or real name, chosen at post time
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    author = db.relationship("User", backref="discussion_posts")
    replies = db.relationship("DiscussionReply", backref="post", cascade="all, delete-orphan")


class DiscussionReply(db.Model):
    __tablename__ = "discussion_replies"

    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey("discussion_posts.id"), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    author_name = db.Column(db.String(255))
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    author = db.relationship("User", backref="discussion_replies")

class Submission(db.Model):
    __tablename__ = "submissions"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    assessment_id = db.Column(db.String(50), nullable=False)  # e.g. "phq9", "gad7"
    answers = db.Column(db.JSON, nullable=False)  # {question_id: score}
    total_score = db.Column(db.Integer)
    severity = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", backref="submissions")


class Resource(db.Model):
    __tablename__ = "resources"

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50))  # "image", "video", "post"
    title = db.Column(db.String(255))
    description = db.Column(db.Text)
    file_data = db.Column(db.LargeBinary)  # the actual file bytes, stored right in Postgres
    content_type = db.Column(db.String(100))  # e.g. "image/png", needed to serve it back correctly
    created_at = db.Column(db.DateTime, default=datetime.utcnow)