from app import db


class Supervisor(db.Model):
    """Supervisor profile model"""
    __tablename__ = 'supervisors'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    specialization = db.Column(db.String(100), nullable=True)
    affiliation = db.Column(db.String(200), nullable=True)  # University, organization, etc.
    bio = db.Column(db.Text, nullable=True)
    expertise_areas = db.Column(db.JSON, default=list)  # List of expertise areas

    # Relationships
    courses = db.relationship('Course', backref='supervisor', lazy='dynamic', cascade='all, delete-orphan')
    evaluations = db.relationship('Evaluation', backref='evaluator', lazy='dynamic')

    def to_dict(self):
        """Convert supervisor to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'specialization': self.specialization,
            'affiliation': self.affiliation,
            'bio': self.bio,
            'expertise_areas': self.expertise_areas or []
        }

    def get_statistics(self):
        """Get supervisor statistics"""
        total_courses = self.courses.count()
        published_courses = self.courses.filter_by(status='published').count()
        total_enrollments = sum(course.enrollments.count() for course in self.courses)
        total_evaluations = self.evaluations.count()

        return {
            'total_courses': total_courses,
            'published_courses': published_courses,
            'total_enrollments': total_enrollments,
            'total_evaluations': total_evaluations
        }

    def __repr__(self):
        return f'<Supervisor {self.user.email}>'
