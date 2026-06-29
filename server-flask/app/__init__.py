from flask import Flask
from flask_cors import CORS
from .config import Config
from .extensions import db, migrate, jwt

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)

    from . import models  # noqa: F401 — registers tables with SQLAlchemy

    from .routes.auth import auth_bp
    app.register_blueprint(auth_bp)

    from .routes.appointments import student_appointments_bp
    app.register_blueprint(student_appointments_bp)

    from .routes.discussion import discussion_bp
    app.register_blueprint(discussion_bp)

    from .routes.counsellor_appointments import counsellor_appointments_bp
    app.register_blueprint(counsellor_appointments_bp)

    from .routes.user import user_bp
    app.register_blueprint(user_bp)

    from .routes.assessments import assessments_bp
    app.register_blueprint(assessments_bp)

    from .routes.resources import resources_bp
    app.register_blueprint(resources_bp)

    from .routes.student_resources import student_resources_bp
    app.register_blueprint(student_resources_bp)

    from .routes.admin_auth import admin_auth_bp
    app.register_blueprint(admin_auth_bp)

    from .routes.admin import admin_bp
    app.register_blueprint(admin_bp)

    @app.get("/")
    def health_check():
        return {"status": "ManoSakha Flask backend is running"}

    return app