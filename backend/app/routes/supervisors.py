from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models import Supervisor, Course, Module, Evaluation, Application
from app.utils.decorators import role_required, get_current_user
from datetime import datetime

bp = Blueprint('supervisors', __name__, url_prefix='/api/supervisors')


@bp.route('/profile', methods=['GET'])
@jwt_required()
@role_required('supervisor')
def get_profile():
    """Get supervisor profile"""
    try:
        user = get_current_user()
        return jsonify({'profile': user.supervisor.to_dict()}), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get profile: {str(e)}'}), 500


@bp.route('/profile', methods=['PUT'])
@jwt_required()
@role_required('supervisor')
def update_profile():
    """Update supervisor profile"""
    try:
        user = get_current_user()
        data = request.get_json()

        if 'specialization' in data:
            user.supervisor.specialization = data['specialization']
        if 'affiliation' in data:
            user.supervisor.affiliation = data['affiliation']
        if 'bio' in data:
            user.supervisor.bio = data['bio']
        if 'expertise_areas' in data:
            user.supervisor.expertise_areas = data['expertise_areas']

        if 'name' in data:
            user.name = data['name']
        if 'profile_picture' in data:
            user.profile_picture = data['profile_picture']

        db.session.commit()

        return jsonify({
            'message': 'Profile updated successfully',
            'profile': user.supervisor.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to update profile: {str(e)}'}), 500


@bp.route('/courses', methods=['GET'])
@jwt_required()
@role_required('supervisor')
def get_my_courses():
    """Get supervisor's courses"""
    try:
        user = get_current_user()
        courses = user.supervisor.courses.all()

        return jsonify({
            'courses': [course.to_dict() for course in courses]
        }), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get courses: {str(e)}'}), 500


@bp.route('/courses', methods=['POST'])
@jwt_required()
@role_required('supervisor')
def create_course():
    """Create a new course"""
    try:
        user = get_current_user()
        data = request.get_json()

        required_fields = ['title', 'description', 'category', 'difficulty']
        if not all(field in data for field in required_fields):
            return jsonify({'message': 'Missing required fields'}), 400

        course = Course(
            title=data['title'],
            description=data['description'],
            category=data['category'],
            difficulty=data['difficulty'],
            supervisor_id=user.supervisor.id,
            duration=data.get('duration'),
            thumbnail=data.get('thumbnail'),
            prerequisites=data.get('prerequisites', []),
            learning_objectives=data.get('learning_objectives', [])
        )

        db.session.add(course)
        db.session.commit()

        return jsonify({
            'message': 'Course created successfully',
            'course': course.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to create course: {str(e)}'}), 500


@bp.route('/courses/<int:course_id>', methods=['PUT'])
@jwt_required()
@role_required('supervisor')
def update_course(course_id):
    """Update a course"""
    try:
        user = get_current_user()
        course = Course.query.get(course_id)

        if not course or course.supervisor_id != user.supervisor.id:
            return jsonify({'message': 'Course not found'}), 404

        data = request.get_json()

        if 'title' in data:
            course.title = data['title']
        if 'description' in data:
            course.description = data['description']
        if 'category' in data:
            course.category = data['category']
        if 'difficulty' in data:
            course.difficulty = data['difficulty']
        if 'duration' in data:
            course.duration = data['duration']
        if 'thumbnail' in data:
            course.thumbnail = data['thumbnail']
        if 'status' in data:
            course.status = data['status']
        if 'prerequisites' in data:
            course.prerequisites = data['prerequisites']
        if 'learning_objectives' in data:
            course.learning_objectives = data['learning_objectives']

        db.session.commit()

        return jsonify({
            'message': 'Course updated successfully',
            'course': course.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to update course: {str(e)}'}), 500


@bp.route('/courses/<int:course_id>', methods=['DELETE'])
@jwt_required()
@role_required('supervisor')
def delete_course(course_id):
    """Delete a course"""
    try:
        user = get_current_user()
        course = Course.query.get(course_id)

        if not course or course.supervisor_id != user.supervisor.id:
            return jsonify({'message': 'Course not found'}), 404

        # Check if course has enrollments
        if course.enrollments.count() > 0:
            return jsonify({'message': 'Cannot delete course with active enrollments. Please archive it instead by setting status to "archived".'}), 400

        db.session.delete(course)
        db.session.commit()

        return jsonify({'message': 'Course deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to delete course: {str(e)}'}), 500


@bp.route('/courses/<int:course_id>/modules', methods=['POST'])
@jwt_required()
@role_required('supervisor')
def create_module(course_id):
    """Create a new module for a course"""
    try:
        user = get_current_user()
        course = Course.query.get(course_id)

        if not course or course.supervisor_id != user.supervisor.id:
            return jsonify({'message': 'Course not found'}), 404

        data = request.get_json()

        required_fields = ['title', 'content_type', 'order']
        if not all(field in data for field in required_fields):
            return jsonify({'message': 'Missing required fields'}), 400

        module = Module(
            course_id=course_id,
            title=data['title'],
            description=data.get('description'),
            content_type=data['content_type'],
            content_url=data.get('content_url'),
            content_data=data.get('content_data'),
            order=data['order'],
            duration=data.get('duration'),
            is_preview=data.get('is_preview', False)
        )

        db.session.add(module)
        db.session.commit()

        return jsonify({
            'message': 'Module created successfully',
            'module': module.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to create module: {str(e)}'}), 500


@bp.route('/modules/<int:module_id>', methods=['PUT'])
@jwt_required()
@role_required('supervisor')
def update_module(module_id):
    """Update a module"""
    try:
        user = get_current_user()
        module = Module.query.get(module_id)

        if not module:
            return jsonify({'message': 'Module not found'}), 404

        # Check if supervisor owns the course
        if module.course.supervisor_id != user.supervisor.id:
            return jsonify({'message': 'Unauthorized'}), 403

        data = request.get_json()

        # Update fields
        if 'title' in data:
            module.title = data['title']
        if 'description' in data:
            module.description = data['description']
        if 'content_type' in data:
            module.content_type = data['content_type']
        if 'content_url' in data:
            module.content_url = data['content_url']
        if 'content_data' in data:
            module.content_data = data['content_data']
        if 'order' in data:
            module.order = data['order']
        if 'duration' in data:
            module.duration = data['duration']
        if 'is_preview' in data:
            module.is_preview = data['is_preview']

        db.session.commit()

        return jsonify({
            'message': 'Module updated successfully',
            'module': module.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to update module: {str(e)}'}), 500


@bp.route('/modules/<int:module_id>', methods=['DELETE'])
@jwt_required()
@role_required('supervisor')
def delete_module(module_id):
    """Delete a module"""
    try:
        user = get_current_user()
        module = Module.query.get(module_id)

        if not module:
            return jsonify({'message': 'Module not found'}), 404

        # Check if supervisor owns the course
        if module.course.supervisor_id != user.supervisor.id:
            return jsonify({'message': 'Unauthorized'}), 403

        db.session.delete(module)
        db.session.commit()

        return jsonify({'message': 'Module deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to delete module: {str(e)}'}), 500


@bp.route('/evaluations', methods=['GET'])
@jwt_required()
@role_required('supervisor')
def get_evaluations():
    """Get supervisor's evaluations"""
    try:
        user = get_current_user()
        evaluations = user.supervisor.evaluations.all()

        return jsonify({
            'evaluations': [ev.to_dict() for ev in evaluations]
        }), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get evaluations: {str(e)}'}), 500


@bp.route('/statistics', methods=['GET'])
@jwt_required()
@role_required('supervisor')
def get_statistics():
    """Get supervisor statistics"""
    try:
        user = get_current_user()
        stats = user.supervisor.get_statistics()
        return jsonify({'statistics': stats}), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get statistics: {str(e)}'}), 500
