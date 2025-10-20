from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from app import db, bcrypt
from app.models import User, Learner, Company, Supervisor, Course, Task
from app.utils.decorators import role_required
from app.utils.email_service import send_welcome_email

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


@bp.route('/courses/<int:course_id>', methods=['DELETE'])
@jwt_required()
@role_required('admin')
def delete_course(course_id):
    """Delete a course (admin only)"""
    try:
        course = Course.query.get(course_id)

        if not course:
            return jsonify({'message': 'Course not found'}), 404

        # Admin can force delete even with enrollments (use with caution)
        db.session.delete(course)
        db.session.commit()

        return jsonify({'message': 'Course deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to delete course: {str(e)}'}), 500


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


@bp.route('/impersonate/<int:user_id>', methods=['POST'])
@jwt_required()
@role_required('admin')
def impersonate_user(user_id):
    """Impersonate another user (admin only)"""
    try:
        current_user_id = get_jwt_identity()
        admin = User.query.get(current_user_id)

        if not admin or admin.role != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403

        # Get the user to impersonate
        target_user = User.query.get(user_id)

        if not target_user:
            return jsonify({'error': 'User not found'}), 404

        if not target_user.is_active:
            return jsonify({'error': 'Cannot impersonate inactive user'}), 400

        # Create a new token for the target user
        access_token = create_access_token(identity=target_user.id)

        return jsonify({
            'message': f'Now impersonating {target_user.name}',
            'token': access_token,
            'user': target_user.to_dict()
        }), 200

    except Exception as e:
        return jsonify({'error': f'Failed to impersonate user: {str(e)}'}), 500


@bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
@role_required('admin')
def update_user(user_id):
    """Update user information"""
    try:
        user = User.query.get(user_id)

        if not user:
            return jsonify({'error': 'User not found'}), 404

        data = request.get_json()

        # Update allowed fields
        if 'name' in data:
            user.name = data['name']
        if 'email' in data:
            # Check if email already exists
            existing = User.query.filter_by(email=data['email']).first()
            if existing and existing.id != user_id:
                return jsonify({'error': 'Email already in use'}), 400
            user.email = data['email']
        if 'role' in data and data['role'] in ['learner', 'company', 'supervisor', 'admin']:
            user.role = data['role']
        if 'is_active' in data:
            user.is_active = data['is_active']

        db.session.commit()

        return jsonify({
            'message': 'User updated successfully',
            'user': user.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update user: {str(e)}'}), 500


@bp.route('/create-admin', methods=['POST'])
@jwt_required()
@role_required('admin')
def create_admin_user():
    """Create a new admin user (admin only)"""
    try:
        current_user_id = get_jwt_identity()
        admin = User.query.get(current_user_id)

        if not admin or admin.role != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403

        data = request.get_json()

        # Validate required fields
        required_fields = ['email', 'password', 'name']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400

        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400

        # Create admin user
        user = User(
            email=data['email'],
            password=data['password'],
            name=data['name'],
            role='admin'
        )
        db.session.add(user)
        db.session.commit()

        # Send welcome email
        try:
            send_welcome_email(user)
        except Exception as e:
            print(f"Failed to send welcome email: {str(e)}")

        return jsonify({
            'message': 'Admin user created successfully',
            'user': user.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create admin user: {str(e)}'}), 500
