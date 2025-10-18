from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.review import CourseReview, TaskReview
from app.models.course import Course
from app.models.task import Task
from app.models.user import User
from sqlalchemy import func

reviews_bp = Blueprint('reviews', __name__)

# ==================== COURSE REVIEWS ====================

@reviews_bp.route('/courses/<int:course_id>/reviews', methods=['GET'])
def get_course_reviews(course_id):
    """Get all reviews for a course"""
    try:
        course = Course.query.get_or_404(course_id)

        reviews = CourseReview.query.filter_by(course_id=course_id).order_by(CourseReview.created_at.desc()).all()

        # Calculate statistics
        total_reviews = len(reviews)
        avg_rating = db.session.query(func.avg(CourseReview.rating)).filter_by(course_id=course_id).scalar() or 0

        rating_distribution = {
            '5': CourseReview.query.filter_by(course_id=course_id, rating=5).count(),
            '4': CourseReview.query.filter_by(course_id=course_id, rating=4).count(),
            '3': CourseReview.query.filter_by(course_id=course_id, rating=3).count(),
            '2': CourseReview.query.filter_by(course_id=course_id, rating=2).count(),
            '1': CourseReview.query.filter_by(course_id=course_id, rating=1).count(),
        }

        return jsonify({
            'reviews': [review.to_dict() for review in reviews],
            'statistics': {
                'total_reviews': total_reviews,
                'average_rating': round(float(avg_rating), 2),
                'rating_distribution': rating_distribution
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@reviews_bp.route('/courses/<int:course_id>/reviews', methods=['POST'])
@jwt_required()
def create_course_review(course_id):
    """Create a new course review"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()

        # Validate course exists
        course = Course.query.get_or_404(course_id)

        # Check if user already reviewed this course
        existing_review = CourseReview.query.filter_by(
            course_id=course_id,
            user_id=current_user_id
        ).first()

        if existing_review:
            return jsonify({'error': 'You have already reviewed this course'}), 400

        # Validate rating
        rating = data.get('rating')
        if not rating or rating not in [1, 2, 3, 4, 5]:
            return jsonify({'error': 'Rating must be between 1 and 5'}), 400

        # Create review
        review = CourseReview(
            course_id=course_id,
            user_id=current_user_id,
            rating=rating,
            review_text=data.get('review_text', '')
        )

        db.session.add(review)

        # Update course average rating
        avg_rating = db.session.query(func.avg(CourseReview.rating)).filter_by(course_id=course_id).scalar()
        course.rating = round(float(avg_rating), 2) if avg_rating else rating

        db.session.commit()

        return jsonify({
            'message': 'Review created successfully',
            'review': review.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@reviews_bp.route('/courses/<int:course_id>/reviews/<int:review_id>', methods=['PUT'])
@jwt_required()
def update_course_review(course_id, review_id):
    """Update a course review"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()

        review = CourseReview.query.get_or_404(review_id)

        # Check if user owns this review
        if review.user_id != current_user_id:
            return jsonify({'error': 'Unauthorized'}), 403

        # Update review
        if 'rating' in data:
            rating = data['rating']
            if rating not in [1, 2, 3, 4, 5]:
                return jsonify({'error': 'Rating must be between 1 and 5'}), 400
            review.rating = rating

        if 'review_text' in data:
            review.review_text = data['review_text']

        db.session.commit()

        # Update course average rating
        course = Course.query.get(course_id)
        avg_rating = db.session.query(func.avg(CourseReview.rating)).filter_by(course_id=course_id).scalar()
        course.rating = round(float(avg_rating), 2) if avg_rating else 0
        db.session.commit()

        return jsonify({
            'message': 'Review updated successfully',
            'review': review.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@reviews_bp.route('/courses/<int:course_id>/reviews/<int:review_id>', methods=['DELETE'])
@jwt_required()
def delete_course_review(course_id, review_id):
    """Delete a course review"""
    try:
        current_user_id = get_jwt_identity()

        review = CourseReview.query.get_or_404(review_id)

        # Check if user owns this review
        if review.user_id != current_user_id:
            return jsonify({'error': 'Unauthorized'}), 403

        db.session.delete(review)
        db.session.commit()

        # Update course average rating
        course = Course.query.get(course_id)
        avg_rating = db.session.query(func.avg(CourseReview.rating)).filter_by(course_id=course_id).scalar()
        course.rating = round(float(avg_rating), 2) if avg_rating else 0
        db.session.commit()

        return jsonify({'message': 'Review deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ==================== TASK REVIEWS ====================

@reviews_bp.route('/tasks/<int:task_id>/reviews', methods=['GET'])
def get_task_reviews(task_id):
    """Get all reviews for a task"""
    try:
        task = Task.query.get_or_404(task_id)

        reviews = TaskReview.query.filter_by(task_id=task_id).order_by(TaskReview.created_at.desc()).all()

        # Calculate statistics
        total_reviews = len(reviews)
        avg_rating = db.session.query(func.avg(TaskReview.rating)).filter_by(task_id=task_id).scalar() or 0

        return jsonify({
            'reviews': [review.to_dict() for review in reviews],
            'statistics': {
                'total_reviews': total_reviews,
                'average_rating': round(float(avg_rating), 2)
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@reviews_bp.route('/tasks/<int:task_id>/reviews', methods=['POST'])
@jwt_required()
def create_task_review(task_id):
    """Create a new task review"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()

        # Validate task exists
        task = Task.query.get_or_404(task_id)

        # Check if user already reviewed this task
        existing_review = TaskReview.query.filter_by(
            task_id=task_id,
            user_id=current_user_id
        ).first()

        if existing_review:
            return jsonify({'error': 'You have already reviewed this task'}), 400

        # Validate rating
        rating = data.get('rating')
        if not rating or rating not in [1, 2, 3, 4, 5]:
            return jsonify({'error': 'Rating must be between 1 and 5'}), 400

        # Create review
        review = TaskReview(
            task_id=task_id,
            user_id=current_user_id,
            rating=rating,
            review_text=data.get('review_text', '')
        )

        db.session.add(review)
        db.session.commit()

        return jsonify({
            'message': 'Review created successfully',
            'review': review.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
