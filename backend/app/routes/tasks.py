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
