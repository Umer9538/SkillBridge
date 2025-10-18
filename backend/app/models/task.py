from datetime import datetime
from app import db


class Task(db.Model):
    """Task model for company-posted tasks"""
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    difficulty = db.Column(db.String(20), nullable=False)  # Beginner, Intermediate, Advanced
    skills_required = db.Column(db.JSON, default=list)  # List of required skills
    estimated_hours = db.Column(db.Integer, nullable=True)
    deadline = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(20), default='active')  # active, closed, completed, archived
    requirements = db.Column(db.Text, nullable=True)  # Detailed requirements
    deliverables = db.Column(db.Text, nullable=True)  # Expected deliverables
    max_applicants = db.Column(db.Integer, nullable=True)  # Maximum number of applicants
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    applications = db.relationship('Application', backref='task', lazy='dynamic',
                                  cascade='all, delete-orphan')

    def to_dict(self, include_company=True):
        """Convert task to dictionary"""
        data = {
            'id': self.id,
            'company_id': self.company_id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'difficulty': self.difficulty,
            'skills_required': self.skills_required or [],
            'estimated_hours': self.estimated_hours,
            'deadline': self.deadline.isoformat() if self.deadline else None,
            'status': self.status,
            'requirements': self.requirements,
            'deliverables': self.deliverables,
            'max_applicants': self.max_applicants,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'total_applications': self.applications.count()
        }

        if include_company and self.company:
            data['company_name'] = self.company.company_name
            data['company_logo'] = self.company.user.profile_picture

        return data

    def __repr__(self):
        return f'<Task {self.title}>'


class Application(db.Model):
    """Task application model"""
    __tablename__ = 'applications'

    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=False)
    learner_id = db.Column(db.Integer, db.ForeignKey('learners.id'), nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, accepted, rejected, in_progress, submitted, completed
    cover_letter = db.Column(db.Text, nullable=True)
    submission_url = db.Column(db.String(255), nullable=True)  # URL or path to submission
    submission_files = db.Column(db.JSON, default=list)  # List of file paths
    submission_notes = db.Column(db.Text, nullable=True)
    applied_at = db.Column(db.DateTime, default=datetime.utcnow)
    accepted_at = db.Column(db.DateTime, nullable=True)
    submitted_at = db.Column(db.DateTime, nullable=True)
    completed_at = db.Column(db.DateTime, nullable=True)

    # Relationships
    evaluation = db.relationship('Evaluation', backref='application', uselist=False,
                                cascade='all, delete-orphan')

    # Unique constraint: one application per learner per task
    __table_args__ = (db.UniqueConstraint('learner_id', 'task_id', name='unique_application'),)

    def to_dict(self, include_evaluation=False):
        """Convert application to dictionary"""
        data = {
            'id': self.id,
            'task_id': self.task_id,
            'task_title': self.task.title if self.task else None,
            'learner_id': self.learner_id,
            'learner_name': self.learner.user.name if self.learner else None,
            'status': self.status,
            'cover_letter': self.cover_letter,
            'submission_url': self.submission_url,
            'submission_files': self.submission_files or [],
            'submission_notes': self.submission_notes,
            'applied_at': self.applied_at.isoformat() if self.applied_at else None,
            'accepted_at': self.accepted_at.isoformat() if self.accepted_at else None,
            'submitted_at': self.submitted_at.isoformat() if self.submitted_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }

        if include_evaluation and self.evaluation:
            data['evaluation'] = self.evaluation.to_dict()

        return data

    def __repr__(self):
        return f'<Application learner={self.learner_id} task={self.task_id}>'


class Evaluation(db.Model):
    """Task evaluation model"""
    __tablename__ = 'evaluations'

    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey('applications.id'), nullable=False, unique=True)
    evaluator_id = db.Column(db.Integer, db.ForeignKey('supervisors.id'), nullable=True)  # Can be null if evaluated by company
    rating = db.Column(db.Float, nullable=False)  # 1-5 scale
    feedback = db.Column(db.Text, nullable=True)
    strengths = db.Column(db.Text, nullable=True)
    improvements = db.Column(db.Text, nullable=True)
    is_outstanding = db.Column(db.Boolean, default=False)
    evaluated_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        """Convert evaluation to dictionary"""
        return {
            'id': self.id,
            'application_id': self.application_id,
            'evaluator_id': self.evaluator_id,
            'evaluator_name': self.evaluator.user.name if self.evaluator else 'Company',
            'rating': self.rating,
            'feedback': self.feedback,
            'strengths': self.strengths,
            'improvements': self.improvements,
            'is_outstanding': self.is_outstanding,
            'evaluated_at': self.evaluated_at.isoformat() if self.evaluated_at else None
        }

    def __repr__(self):
        return f'<Evaluation application={self.application_id} rating={self.rating}>'
