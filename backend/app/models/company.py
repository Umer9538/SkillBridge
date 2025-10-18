from app import db


class Company(db.Model):
    """Company profile model"""
    __tablename__ = 'companies'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    company_name = db.Column(db.String(200), nullable=False)
    industry = db.Column(db.String(100), nullable=True)
    description = db.Column(db.Text, nullable=True)
    website = db.Column(db.String(255), nullable=True)
    location = db.Column(db.String(100), nullable=True)
    size = db.Column(db.String(50), nullable=True)  # e.g., "1-10", "11-50", "51-200", etc.

    # Relationships
    tasks = db.relationship('Task', backref='company', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self):
        """Convert company to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'company_name': self.company_name,
            'industry': self.industry,
            'description': self.description,
            'website': self.website,
            'location': self.location,
            'size': self.size
        }

    def get_statistics(self):
        """Get company statistics"""
        total_tasks = self.tasks.count()
        active_tasks = self.tasks.filter_by(status='active').count()
        completed_tasks = self.tasks.filter_by(status='completed').count()

        # Get total applications across all tasks
        total_applications = sum(task.applications.count() for task in self.tasks)

        return {
            'total_tasks': total_tasks,
            'active_tasks': active_tasks,
            'completed_tasks': completed_tasks,
            'total_applications': total_applications
        }

    def __repr__(self):
        return f'<Company {self.company_name}>'
