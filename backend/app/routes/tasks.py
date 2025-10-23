from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models import Task, Application, Evaluation
from app.utils.decorators import role_required, get_current_user
from datetime import datetime

bp = Blueprint('tasks', __name__, url_prefix='/api/tasks')


@bp.route('', methods=['GET'])
@jwt_required()
def get_tasks():
    """Get all active tasks with optional filtering"""
    try:
        category = request.args.get('category')
        difficulty = request.args.get('difficulty')
        search = request.args.get('search')

        query = Task.query.filter_by(status='active')

        if category:
            query = query.filter_by(category=category)
        if difficulty:
            query = query.filter_by(difficulty=difficulty)
        if search:
            query = query.filter(Task.title.ilike(f'%{search}%'))

        tasks = query.all()
        return jsonify({'tasks': [task.to_dict() for task in tasks]}), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get tasks: {str(e)}'}), 500

@bp.route('', methods=['POST'])
@jwt_required()
@role_required('company')
def create_tasks():
    """Create the new tasks"""
    try:
        user = get_current_user()
        data = request.get_data()

        required_fields = ['title', 'description', 'category', 'difficulty']
        if not all(field in data for field in required_fields):
            return jsonify({'message': 'Missing required fields'}), 400
        
        task = Task(
            company_id=user.company.id,
            title=data["title"],
            description=data["description"],
            category=data["category"],
            difficulty=data['difficulty'],
            skills_required=data["skills_required"],
            estimated_hours=data["estimated_hours"],
            deadline=data["deadline"],
            requirements=data["requirements"],
            deliverables=data["deliverables"],
            max_applicants=data["max_applicants"],
            compensation=data["compensation"],
        )
        
        db.session.add(task)
        db.session.commit()

        return jsonify({
            'message': 'task created successfully',
            'task': task.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to create task: {str(e)}'}), 500

@bp.route('/my', methods=['GET'])
@jwt_required()
@role_required('company')
def get_my_tasks():
    """Get tasks posted by current company (alias for /api/companies/tasks)"""
    try:
        user = get_current_user()

        if not hasattr(user, 'company') or not user.company:
            return jsonify({'message': 'Only companies can access their tasks'}), 403

        tasks = Task.query.filter_by(company_id=user.company.id).all()

        return jsonify({
            'tasks': [task.to_dict() for task in tasks]
        }), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get tasks: {str(e)}'}), 500


@bp.route('/<int:task_id>', methods=['GET'])
@jwt_required()
def get_task(task_id):
    """Get task details"""
    try:
        task = Task.query.get(task_id)
        if not task:
            return jsonify({'message': 'Task not found'}), 404

        return jsonify({'task': task.to_dict()}), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get task: {str(e)}'}), 500


@bp.route('/<int:task_id>/apply', methods=['POST'])
@jwt_required()
@role_required('learner')
def apply_task(task_id):
    """Apply for a task"""
    try:
        user = get_current_user()
        task = Task.query.get(task_id)

        if not task:
            return jsonify({'message': 'Task not found'}), 404

        if task.status != 'active':
            return jsonify({'message': 'Task is no longer active'}), 400

        # Check if already applied
        existing = Application.query.filter_by(
            learner_id=user.learner.id,
            task_id=task_id
        ).first()

        if existing:
            return jsonify({'message': 'Already applied to this task'}), 400

        data = request.get_json()

        # Create application
        application = Application(
            task_id=task_id,
            learner_id=user.learner.id,
            cover_letter=data.get('cover_letter')
        )
        db.session.add(application)
        db.session.commit()

        return jsonify({
            'message': 'Application submitted successfully',
            'application': application.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Application failed: {str(e)}'}), 500


@bp.route('/applications/my', methods=['GET'])
@jwt_required()
@role_required('learner')
def get_my_applications():
    """Get current learner's applications"""
    try:
        user = get_current_user()
        status = request.args.get('status')

        query = user.learner.applications

        if status:
            query = query.filter_by(status=status)

        applications = query.all()

        return jsonify({
            'applications': [app.to_dict(include_evaluation=True) for app in applications]
        }), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get applications: {str(e)}'}), 500


@bp.route('/applications/<int:app_id>/submit', methods=['PUT'])
@jwt_required()
@role_required('learner')
def submit_work(app_id):
    """Submit work for an application"""
    try:
        user = get_current_user()
        application = Application.query.get(app_id)

        if not application or application.learner_id != user.learner.id:
            return jsonify({'message': 'Application not found'}), 404

        if application.status != 'accepted' and application.status != 'in_progress':
            return jsonify({'message': 'Cannot submit work for this application'}), 400

        data = request.get_json()

        application.submission_url = data.get('submission_url')
        application.submission_notes = data.get('submission_notes')
        application.submission_files = data.get('submission_files', [])
        application.status = 'submitted'
        application.submitted_at = datetime.utcnow()

        db.session.commit()

        return jsonify({
            'message': 'Work submitted successfully',
            'application': application.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Submission failed: {str(e)}'}), 500


@bp.route('/<int:task_id>', methods=['PUT'])
@jwt_required()
@role_required('company')
def update_task(task_id):
    """Update a task (company only)"""
    try:
        user = get_current_user()
        task = Task.query.get(task_id)

        if not task:
            return jsonify({'message': 'Task not found'}), 404

        if not hasattr(user, 'company') or task.company_id != user.company.id:
            return jsonify({'message': 'Unauthorized'}), 403

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


@bp.route('/<int:task_id>', methods=['DELETE'])
@jwt_required()
@role_required('company')
def delete_task(task_id):
    """Delete a task (company only)"""
    try:
        user = get_current_user()
        task = Task.query.get(task_id)

        if not task:
            return jsonify({'message': 'Task not found'}), 404

        if not hasattr(user, 'company') or task.company_id != user.company.id:
            return jsonify({'message': 'Unauthorized'}), 403

        # Check if task has applications
        if task.applications.count() > 0:
            return jsonify({'message': 'Cannot delete task with existing applications. Please close the task instead.'}), 400

        db.session.delete(task)
        db.session.commit()

        return jsonify({'message': 'Task deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to delete task: {str(e)}'}), 500
