from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_mail import Mail
from flask_migrate import Migrate
from config import config

# Initialize extensions
db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()
mail = Mail()
migrate = Migrate()


def create_app(config_name='default'):
    """Application factory pattern"""
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # Initialize extensions with app
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
    migrate.init_app(app, db)
    CORS(app, origins=app.config['CORS_ORIGINS'], supports_credentials=True)

    # Register blueprints
    from app.routes import auth, learners, companies, supervisors, admin, courses, tasks, notifications, upload, reviews, analytics, messages

    app.register_blueprint(auth.bp)
    app.register_blueprint(learners.bp)
    app.register_blueprint(companies.bp)
    app.register_blueprint(supervisors.bp)
    app.register_blueprint(admin.bp)
    app.register_blueprint(courses.bp)
    app.register_blueprint(tasks.bp)
    app.register_blueprint(notifications.bp)
    app.register_blueprint(messages.bp)
    app.register_blueprint(upload.upload_bp, url_prefix='/api')
    app.register_blueprint(reviews.reviews_bp, url_prefix='/api')
    app.register_blueprint(analytics.analytics_bp)

    # Create upload folder if it doesn't exist
    import os
    upload_folder = app.config['UPLOAD_FOLDER']
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)

    return app
