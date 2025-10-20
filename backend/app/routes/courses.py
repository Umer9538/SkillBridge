from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models import Course, Module, Enrollment, Certificate
from app.utils.decorators import role_required, get_current_user
from datetime import datetime

bp = Blueprint('courses', __name__, url_prefix='/api/courses')


@bp.route('', methods=['GET'])
def get_courses():
    """Get all published courses with optional filtering"""
    try:
        category = request.args.get('category')
        difficulty = request.args.get('difficulty')
        search = request.args.get('search')

        query = Course.query.filter_by(status='published')

        if category:
            query = query.filter_by(category=category)
        if difficulty:
            query = query.filter_by(difficulty=difficulty)
        if search:
            query = query.filter(Course.title.ilike(f'%{search}%'))

        courses = query.all()
        return jsonify({'courses': [course.to_dict() for course in courses]}), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get courses: {str(e)}'}), 500


@bp.route('/<int:course_id>', methods=['GET'])
def get_course(course_id):
    """Get course details"""
    try:
        course = Course.query.get(course_id)
        if not course:
            return jsonify({'message': 'Course not found'}), 404

        return jsonify({'course': course.to_dict(include_modules=True)}), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get course: {str(e)}'}), 500


@bp.route('/<int:course_id>/enroll', methods=['POST'])
@jwt_required()
@role_required('learner')
def enroll_course(course_id):
    """Enroll in a course"""
    try:
        user = get_current_user()
        course = Course.query.get(course_id)

        if not course:
            return jsonify({'message': 'Course not found'}), 404

        if course.status != 'published':
            return jsonify({'message': 'Course is not available for enrollment'}), 400

        # Check if already enrolled
        existing = Enrollment.query.filter_by(
            learner_id=user.learner.id,
            course_id=course_id
        ).first()

        if existing:
            return jsonify({'message': 'Already enrolled in this course'}), 400

        # Create enrollment
        enrollment = Enrollment(
            learner_id=user.learner.id,
            course_id=course_id
        )
        db.session.add(enrollment)
        db.session.commit()

        return jsonify({
            'message': 'Enrolled successfully',
            'enrollment': enrollment.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Enrollment failed: {str(e)}'}), 500


@bp.route('/my-enrollments', methods=['GET'])
@jwt_required()
@role_required('learner')
def get_my_enrollments():
    """Get current user's enrollments"""
    try:
        user = get_current_user()
        enrollments = user.learner.enrollments.all()

        return jsonify({
            'enrollments': [enrollment.to_dict() for enrollment in enrollments]
        }), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get enrollments: {str(e)}'}), 500


@bp.route('/<int:course_id>/enrollments', methods=['GET'])
@jwt_required()
def get_course_enrollments(course_id):
    """Get all enrollments for a specific course (for supervisor/admin)"""
    try:
        user = get_current_user()
        course = Course.query.get(course_id)

        if not course:
            return jsonify({'message': 'Course not found'}), 404

        # Check authorization - only supervisor who created course or admin can see enrollments
        if user.role == 'supervisor':
            if not hasattr(user, 'supervisor') or course.supervisor_id != user.supervisor.id:
                return jsonify({'message': 'Unauthorized'}), 403
        elif user.role != 'admin':
            return jsonify({'message': 'Unauthorized'}), 403

        enrollments = Enrollment.query.filter_by(course_id=course_id).all()

        # Enrich enrollment data with learner details
        enrollment_data = []
        for enrollment in enrollments:
            data = enrollment.to_dict()
            if enrollment.learner and enrollment.learner.user:
                data['learner_name'] = enrollment.learner.user.name
                data['learner_email'] = enrollment.learner.user.email
            enrollment_data.append(data)

        return jsonify({'enrollments': enrollment_data}), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get enrollments: {str(e)}'}), 500


@bp.route('/enrollments/<int:enrollment_id>/progress', methods=['PUT'])
@jwt_required()
@role_required('learner')
def update_progress(enrollment_id):
    """Update course progress"""
    try:
        user = get_current_user()
        enrollment = Enrollment.query.get(enrollment_id)

        if not enrollment or enrollment.learner_id != user.learner.id:
            return jsonify({'message': 'Enrollment not found'}), 404

        data = request.get_json()
        module_id = data.get('module_id')
        completed = data.get('completed', True)

        if not module_id:
            return jsonify({'message': 'Module ID required'}), 400

        enrollment.update_progress(module_id, completed)
        db.session.commit()

        # Check if course is completed and generate certificate
        if enrollment.status == 'completed':
            # Check if certificate already exists
            existing_cert = Certificate.query.filter_by(
                learner_id=user.learner.id,
                course_id=enrollment.course_id
            ).first()

            if not existing_cert:
                certificate = Certificate(
                    learner_id=user.learner.id,
                    course_id=enrollment.course_id
                )
                db.session.add(certificate)
                db.session.commit()

        return jsonify({
            'message': 'Progress updated',
            'enrollment': enrollment.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to update progress: {str(e)}'}), 500
