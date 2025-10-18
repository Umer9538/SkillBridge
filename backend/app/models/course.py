from datetime import datetime
from app import db


class Course(db.Model):
    """Course model"""
    __tablename__ = 'courses'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)  # Programming, Data Analysis, etc.
    difficulty = db.Column(db.String(20), nullable=False)  # Beginner, Intermediate, Advanced
    duration = db.Column(db.Integer, nullable=True)  # Duration in hours
    thumbnail = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(20), default='draft')  # draft, published, archived
    prerequisites = db.Column(db.JSON, default=list)  # List of course IDs
    learning_objectives = db.Column(db.JSON, default=list)  # List of objectives
    supervisor_id = db.Column(db.Integer, db.ForeignKey('supervisors.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    modules = db.relationship('Module', backref='course', lazy='dynamic',
                            cascade='all, delete-orphan', order_by='Module.order')
    enrollments = db.relationship('Enrollment', backref='course', lazy='dynamic',
                                cascade='all, delete-orphan')
    certificates = db.relationship('Certificate', backref='course', lazy='dynamic')

    def to_dict(self, include_modules=False):
        """Convert course to dictionary"""
        data = {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'difficulty': self.difficulty,
            'duration': self.duration,
            'thumbnail': self.thumbnail,
            'status': self.status,
            'prerequisites': self.prerequisites or [],
            'learning_objectives': self.learning_objectives or [],
            'supervisor_id': self.supervisor_id,
            'supervisor_name': self.supervisor.user.name if self.supervisor else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'total_modules': self.modules.count(),
            'total_enrollments': self.enrollments.count()
        }

        if include_modules:
            data['modules'] = [module.to_dict() for module in self.modules]

        return data

    def __repr__(self):
        return f'<Course {self.title}>'


class Module(db.Model):
    """Course module model"""
    __tablename__ = 'modules'

    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    content_type = db.Column(db.String(20), nullable=False)  # video, text, quiz, assignment
    content_url = db.Column(db.String(255), nullable=True)  # URL or path to content
    content_data = db.Column(db.JSON, nullable=True)  # For quiz questions, text content, etc.
    order = db.Column(db.Integer, nullable=False)
    duration = db.Column(db.Integer, nullable=True)  # Duration in minutes
    is_preview = db.Column(db.Boolean, default=False)  # Can be viewed without enrollment
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        """Convert module to dictionary"""
        return {
            'id': self.id,
            'course_id': self.course_id,
            'title': self.title,
            'description': self.description,
            'content_type': self.content_type,
            'content_url': self.content_url,
            'content_data': self.content_data,
            'order': self.order,
            'duration': self.duration,
            'is_preview': self.is_preview,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f'<Module {self.title}>'


class Enrollment(db.Model):
    """Course enrollment model"""
    __tablename__ = 'enrollments'

    id = db.Column(db.Integer, primary_key=True)
    learner_id = db.Column(db.Integer, db.ForeignKey('learners.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    status = db.Column(db.String(20), default='active')  # active, completed, dropped
    progress = db.Column(db.JSON, default=dict)  # {module_id: completed (bool)}
    completion_percentage = db.Column(db.Float, default=0.0)
    enrolled_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)

    # Unique constraint: one enrollment per learner per course
    __table_args__ = (db.UniqueConstraint('learner_id', 'course_id', name='unique_enrollment'),)

    def to_dict(self):
        """Convert enrollment to dictionary"""
        return {
            'id': self.id,
            'learner_id': self.learner_id,
            'course_id': self.course_id,
            'course_title': self.course.title if self.course else None,
            'status': self.status,
            'progress': self.progress or {},
            'completion_percentage': self.completion_percentage,
            'enrolled_at': self.enrolled_at.isoformat() if self.enrolled_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }

    def update_progress(self, module_id, completed=True):
        """Update progress for a specific module"""
        if self.progress is None:
            self.progress = {}

        self.progress[str(module_id)] = completed

        # Calculate completion percentage
        total_modules = self.course.modules.count()
        completed_modules = sum(1 for v in self.progress.values() if v)
        self.completion_percentage = (completed_modules / total_modules * 100) if total_modules > 0 else 0

        # Check if course is completed
        if self.completion_percentage == 100 and self.status != 'completed':
            self.status = 'completed'
            self.completed_at = datetime.utcnow()

    def __repr__(self):
        return f'<Enrollment learner={self.learner_id} course={self.course_id}>'
