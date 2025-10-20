from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models import Company, Task, Application, Evaluation
from app.utils.decorators import role_required, get_current_user
from datetime import datetime

bp = Blueprint('companies', __name__, url_prefix='/api/companies')


@bp.route('/profile', methods=['GET'])
@jwt_required()
@role_required('company')
def get_profile():
    """Get company profile"""
    try:
        user = get_current_user()
        return jsonify({'profile': user.company.to_dict()}), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get profile: {str(e)}'}), 500


@bp.route('/profile', methods=['PUT'])
@jwt_required()
@role_required('company')
def update_profile():
    """Update company profile"""
    try:
        user = get_current_user()
        data = request.get_json()

        # Update company fields
        if 'company_name' in data:
            user.company.company_name = data['company_name']
        if 'industry' in data:
            user.company.industry = data['industry']
        if 'description' in data:
            user.company.description = data['description']
        if 'website' in data:
            user.company.website = data['website']
        if 'location' in data:
            user.company.location = data['location']
        if 'size' in data:
            user.company.size = data['size']

        # Update user fields
        if 'name' in data:
            user.name = data['name']
        if 'profile_picture' in data:
            user.profile_picture = data['profile_picture']

        db.session.commit()

        return jsonify({
            'message': 'Profile updated successfully',
            'profile': user.company.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to update profile: {str(e)}'}), 500


@bp.route('/tasks', methods=['GET'])
@jwt_required()
@role_required('company')
def get_my_tasks():
    """Get company's posted tasks"""
    try:
        user = get_current_user()
        tasks = user.company.tasks.all()

        return jsonify({
            'tasks': [task.to_dict() for task in tasks]
        }), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get tasks: {str(e)}'}), 500


@bp.route('/tasks', methods=['POST'])
@jwt_required()
@role_required('company')
def create_task():
    """Create a new task"""
    try:
        user = get_current_user()
        data = request.get_json()

        # Validate required fields
        required_fields = ['title', 'description', 'category', 'difficulty']
        if not all(field in data for field in required_fields):
            return jsonify({'message': 'Missing required fields'}), 400

        task = Task(
            company_id=user.company.id,
            title=data['title'],
            description=data['description'],
            category=data['category'],
            difficulty=data['difficulty'],
            skills_required=data.get('skills_required', []),
            estimated_hours=data.get('estimated_hours'),
            deadline=datetime.fromisoformat(data['deadline']) if data.get('deadline') else None,
            requirements=data.get('requirements'),
            deliverables=data.get('deliverables'),
            max_applicants=data.get('max_applicants')
        )

        db.session.add(task)
        db.session.commit()

        return jsonify({
            'message': 'Task created successfully',
            'task': task.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to create task: {str(e)}'}), 500


@bp.route('/tasks/<int:task_id>', methods=['PUT'])
@jwt_required()
@role_required('company')
def update_task(task_id):
    """Update a task"""
    try:
        user = get_current_user()
        task = Task.query.get(task_id)

        if not task or task.company_id != user.company.id:
            return jsonify({'message': 'Task not found'}), 404

        data = request.get_json()

        # Update fields
        if 'title' in data:
            task.title = data['title']
        if 'description' in data:
            task.description = data['description']
        if 'category' in data:
            task.category = data['category']
        if 'difficulty' in data:
            task.difficulty = data['difficulty']
        if 'skills_required' in data:
            task.skills_required = data['skills_required']
        if 'estimated_hours' in data:
            task.estimated_hours = data['estimated_hours']
        if 'deadline' in data:
            task.deadline = datetime.fromisoformat(data['deadline']) if data['deadline'] else None
        if 'status' in data:
            task.status = data['status']
        if 'requirements' in data:
            task.requirements = data['requirements']
        if 'deliverables' in data:
            task.deliverables = data['deliverables']

        db.session.commit()

        return jsonify({
            'message': 'Task updated successfully',
            'task': task.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to update task: {str(e)}'}), 500


@bp.route('/tasks/<int:task_id>/applications', methods=['GET'])
@jwt_required()
@role_required('company')
def get_task_applications(task_id):
    """Get applications for a specific task"""
    try:
        user = get_current_user()
        task = Task.query.get(task_id)

        if not task or task.company_id != user.company.id:
            return jsonify({'message': 'Task not found'}), 404

        applications = task.applications.all()

        return jsonify({
            'applications': [app.to_dict(include_evaluation=True) for app in applications]
        }), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get applications: {str(e)}'}), 500


@bp.route('/applications/<int:app_id>/evaluate', methods=['POST'])
@jwt_required()
@role_required('company')
def evaluate_application(app_id):
    """Evaluate an application"""
    try:
        user = get_current_user()
        application = Application.query.get(app_id)

        if not application or application.task.company_id != user.company.id:
            return jsonify({'message': 'Application not found'}), 404

        data = request.get_json()

        if not data.get('rating'):
            return jsonify({'message': 'Rating is required'}), 400

        # Create or update evaluation
        evaluation = application.evaluation
        if not evaluation:
            evaluation = Evaluation(application_id=app_id)
            db.session.add(evaluation)

        evaluation.rating = data['rating']
        evaluation.feedback = data.get('feedback')
        evaluation.strengths = data.get('strengths')
        evaluation.improvements = data.get('improvements')
        evaluation.is_outstanding = data.get('is_outstanding', False)

        # Update application status
        application.status = 'completed'
        application.completed_at = datetime.utcnow()

        db.session.commit()

        return jsonify({
            'message': 'Evaluation submitted successfully',
            'evaluation': evaluation.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to evaluate: {str(e)}'}), 500


@bp.route('/statistics', methods=['GET'])
@jwt_required()
@role_required('company')
def get_statistics():
    """Get company statistics"""
    try:
        user = get_current_user()
        stats = user.company.get_statistics()
        return jsonify({'statistics': stats}), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get statistics: {str(e)}'}), 500


@bp.route('/applications', methods=['GET'])
@jwt_required()
@role_required('company')
def get_all_applications():
    """Get all applications across all company tasks"""
    try:
        user = get_current_user()

        # Get all applications for all tasks posted by this company
        applications = Application.query.join(Task).filter(
            Task.company_id == user.company.id
        ).all()

        return jsonify({
            'applications': [app.to_dict(include_task=True, include_evaluation=True) for app in applications]
        }), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get applications: {str(e)}'}), 500


@bp.route('/applications/<int:app_id>/accept', methods=['PUT'])
@jwt_required()
@role_required('company')
def accept_application(app_id):
    """Accept an application"""
    try:
        user = get_current_user()
        application = Application.query.get(app_id)

        if not application or application.task.company_id != user.company.id:
            return jsonify({'message': 'Application not found'}), 404

        application.status = 'accepted'
        db.session.commit()

        # Send email notification to learner
        try:
            from app.utils.email_service import send_application_status_email
            from app.models import User
            learner = User.query.get(application.learner_id)
            if learner:
                send_application_status_email(learner, application.task, 'accepted', user)
        except Exception as e:
            print(f"Failed to send email notification: {str(e)}")

        return jsonify({
            'message': 'Application accepted successfully',
            'application': application.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to accept application: {str(e)}'}), 500


@bp.route('/applications/<int:app_id>/reject', methods=['PUT'])
@jwt_required()
@role_required('company')
def reject_application(app_id):
    """Reject an application"""
    try:
        user = get_current_user()
        application = Application.query.get(app_id)

        if not application or application.task.company_id != user.company.id:
            return jsonify({'message': 'Application not found'}), 404

        application.status = 'rejected'
        db.session.commit()

        # Send email notification to learner
        try:
            from app.utils.email_service import send_application_status_email
            from app.models import User
            learner = User.query.get(application.learner_id)
            if learner:
                send_application_status_email(learner, application.task, 'rejected', user)
        except Exception as e:
            print(f"Failed to send email notification: {str(e)}")

        return jsonify({
            'message': 'Application rejected successfully',
            'application': application.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to reject application: {str(e)}'}), 500


@bp.route('/tasks/<int:task_id>', methods=['DELETE'])
@jwt_required()
@role_required('company')
def delete_task(task_id):
    """Delete a task"""
    try:
        user = get_current_user()
        task = Task.query.get(task_id)

        if not task or task.company_id != user.company.id:
            return jsonify({'message': 'Task not found'}), 404

        # Check if task has applications
        if task.applications.count() > 0:
            return jsonify({'message': 'Cannot delete task with existing applications. Please close the task instead.'}), 400

        db.session.delete(task)
        db.session.commit()

        return jsonify({'message': 'Task deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to delete task: {str(e)}'}), 500
