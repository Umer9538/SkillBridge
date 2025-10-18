from app import db
from datetime import datetime

class CourseReview(db.Model):
    """Model for course reviews and ratings"""
    __tablename__ = 'course_reviews'

    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1-5 stars
    review_text = db.Column(db.Text, nullable=True)
    is_helpful = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    course = db.relationship('Course', backref=db.backref('reviews', lazy='dynamic', cascade='all, delete-orphan'))
    user = db.relationship('User', backref=db.backref('course_reviews', lazy='dynamic'))

    # Unique constraint: one review per user per course
    __table_args__ = (db.UniqueConstraint('course_id', 'user_id', name='unique_course_user_review'),)

    def to_dict(self):
        return {
            'id': self.id,
            'course_id': self.course_id,
            'user_id': self.user_id,
            'user_name': self.user.name if self.user else 'Unknown',
            'user_profile_picture': self.user.profile_picture if self.user else None,
            'rating': self.rating,
            'review_text': self.review_text,
            'is_helpful': self.is_helpful,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class TaskReview(db.Model):
    """Model for task/company reviews"""
    __tablename__ = 'task_reviews'

    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1-5 stars
    review_text = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    task = db.relationship('Task', backref=db.backref('reviews', lazy='dynamic', cascade='all, delete-orphan'))
    user = db.relationship('User', backref=db.backref('task_reviews', lazy='dynamic'))

    # Unique constraint: one review per user per task
    __table_args__ = (db.UniqueConstraint('task_id', 'user_id', name='unique_task_user_review'),)

    def to_dict(self):
        return {
            'id': self.id,
            'task_id': self.task_id,
            'user_id': self.user_id,
            'user_name': self.user.name if self.user else 'Unknown',
            'user_profile_picture': self.user.profile_picture if self.user else None,
            'rating': self.rating,
            'review_text': self.review_text,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
