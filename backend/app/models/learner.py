from app import db
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy import Text


class Learner(db.Model):
    """Learner profile model"""
    __tablename__ = 'learners'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    skills = db.Column(db.JSON, default=list)  # List of skills
    bio = db.Column(db.Text, nullable=True)
    portfolio_privacy = db.Column(db.String(20), default='public')  # public, private
    phone = db.Column(db.String(20), nullable=True)
    location = db.Column(db.String(100), nullable=True)
    education = db.Column(db.JSON, nullable=True)  # List of education entries
    experience = db.Column(db.JSON, nullable=True)  # List of experience entries

    # Relationships
    enrollments = db.relationship('Enrollment', backref='learner', lazy='dynamic', cascade='all, delete-orphan')
    applications = db.relationship('Application', backref='learner', lazy='dynamic', cascade='all, delete-orphan')
    certificates = db.relationship('Certificate', backref='learner', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self):
        """Convert learner to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'skills': self.skills or [],
            'bio': self.bio,
            'portfolio_privacy': self.portfolio_privacy,
            'phone': self.phone,
            'location': self.location,
            'education': self.education or [],
            'experience': self.experience or []
        }

    def get_portfolio(self):
        """Get learner portfolio data"""
        completed_applications = self.applications.filter_by(status='completed').all()
        certificates = self.certificates.all()

        return {
            'profile': self.to_dict(),
            'completed_tasks': [app.to_dict() for app in completed_applications],
            'certificates': [cert.to_dict() for cert in certificates],
            'total_completed': len(completed_applications),
            'skills': self.skills or []
        }

    def __repr__(self):
        return f'<Learner {self.user.email}>'
