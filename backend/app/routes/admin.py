from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models import User, Learner, Company, Supervisor, Course, Task
from app.utils.decorators import role_required

bp = Blueprint('admin', __name__, url_prefix='/api/admin')


@bp.route('/users', methods=['GET'])
@jwt_required()
@role_required('admin')
def get_users():
    """Get all users with optional filtering"""
    try:
        role = request.args.get('role')
        is_active = request.args.get('is_active')
        search = request.args.get('search')

        query = User.query

        if role:
            query = query.filter_by(role=role)
        if is_active is not None:
            query = query.filter_by(is_active=is_active == 'true')
        if search:
            query = query.filter(User.name.ilike(f'%{search}%') | User.email.ilike(f'%{search}%'))

        users = query.all()

        return jsonify({
            'users': [user.to_dict() for user in users]
        }), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get users: {str(e)}'}), 500


@bp.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
@role_required('admin')
def get_user(user_id):
    """Get user details"""
    try:
        user = User.query.get(user_id)

        if not user:
            return jsonify({'message': 'User not found'}), 404

        return jsonify({'user': user.to_dict()}), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get user: {str(e)}'}), 500


@bp.route('/users/<int:user_id>/toggle-active', methods=['PUT'])
@jwt_required()
@role_required('admin')
def toggle_user_active(user_id):
    """Activate or deactivate a user"""
    try:
        user = User.query.get(user_id)

        if not user:
            return jsonify({'message': 'User not found'}), 404

        user.is_active = not user.is_active
        db.session.commit()

        return jsonify({
            'message': f'User {"activated" if user.is_active else "deactivated"} successfully',
            'user': user.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to update user: {str(e)}'}), 500


@bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
@role_required('admin')
def delete_user(user_id):
    """Delete a user"""
    try:
        user = User.query.get(user_id)

        if not user:
            return jsonify({'message': 'User not found'}), 404

        if user.role == 'admin':
            return jsonify({'message': 'Cannot delete admin users'}), 403

        db.session.delete(user)
        db.session.commit()

        return jsonify({'message': 'User deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to delete user: {str(e)}'}), 500


@bp.route('/statistics', methods=['GET'])
@jwt_required()
@role_required('admin')
def get_statistics():
    """Get platform statistics"""
    try:
        stats = {
            'total_users': User.query.count(),
            'total_learners': Learner.query.count(),
            'total_companies': Company.query.count(),
            'total_supervisors': Supervisor.query.count(),
            'total_courses': Course.query.count(),
            'total_tasks': Task.query.count(),
            'active_users': User.query.filter_by(is_active=True).count(),
            'published_courses': Course.query.filter_by(status='published').count(),
            'active_tasks': Task.query.filter_by(status='active').count()
        }

        return jsonify({'statistics': stats}), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get statistics: {str(e)}'}), 500


@bp.route('/courses', methods=['GET'])
@jwt_required()
@role_required('admin')
def get_all_courses():
    """Get all courses (including drafts)"""
    try:
        courses = Course.query.all()
        return jsonify({
            'courses': [course.to_dict() for course in courses]
        }), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get courses: {str(e)}'}), 500


@bp.route('/tasks', methods=['GET'])
@jwt_required()
@role_required('admin')
def get_all_tasks():
    """Get all tasks"""
    try:
        tasks = Task.query.all()
        return jsonify({
            'tasks': [task.to_dict() for task in tasks]
        }), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get tasks: {str(e)}'}), 500
