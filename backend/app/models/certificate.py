from datetime import datetime
from app import db
import uuid


class Certificate(db.Model):
    """Certificate model for course completion"""
    __tablename__ = 'certificates'

    id = db.Column(db.Integer, primary_key=True)
    learner_id = db.Column(db.Integer, db.ForeignKey('learners.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    verification_code = db.Column(db.String(100), unique=True, nullable=False)
    certificate_url = db.Column(db.String(255), nullable=True)  # Path to generated PDF
    issued_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Unique constraint: one certificate per learner per course
    __table_args__ = (db.UniqueConstraint('learner_id', 'course_id', name='unique_certificate'),)

    def __init__(self, learner_id, course_id, **kwargs):
        super(Certificate, self).__init__(**kwargs)
        self.learner_id = learner_id
        self.course_id = course_id
        self.verification_code = self.generate_verification_code()

    @staticmethod
    def generate_verification_code():
        """Generate a unique verification code"""
        return f"SB-{uuid.uuid4().hex[:12].upper()}"

    def to_dict(self):
        """Convert certificate to dictionary"""
        return {
            'id': self.id,
            'learner_id': self.learner_id,
            'learner_name': self.learner.user.name if self.learner else None,
            'course_id': self.course_id,
            'course_title': self.course.title if self.course else None,
            'verification_code': self.verification_code,
            'certificate_url': self.certificate_url,
            'issued_at': self.issued_at.isoformat() if self.issued_at else None
        }

    def __repr__(self):
        return f'<Certificate {self.verification_code}>'
