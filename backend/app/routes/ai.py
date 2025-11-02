"""
AI Routes
Handles AI-powered features: recommendations, matching, evaluations
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.models.task import Task
from app.models.course import Course
from app.models.application import Application
from app.utils.ai_service import AIService
from app import db

ai_bp = Blueprint('ai', __name__, url_prefix='/api/ai')


@ai_bp.route('/task-matches/<int:task_id>', methods=['GET'])
@jwt_required()
def get_task_matches(task_id):
    """
    Get AI-powered learner matches for a task
    Available to: Company (task owner)
    """
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user:
        return jsonify({'error': 'User not found'}), 404

    # Get the task
    task = Task.query.get(task_id)
    if not task:
        return jsonify({'error': 'Task not found'}), 404

    # Check authorization (only task owner can see matches)
    if current_user.role != 'company' or task.company_id != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403

    # Get all learners
    learners = User.query.filter_by(role='learner', is_active=True).all()

    # Get AI matches
    matches = AIService.match_learners_to_task(task, learners)

    return jsonify({
        'task_id': task_id,
        'task_title': task.title,
        'matches': matches
    }), 200


@ai_bp.route('/course-recommendations', methods=['GET'])
@jwt_required()
def get_course_recommendations():
    """
    Get AI-powered course recommendations for a learner
    Available to: Learner
    """
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user or current_user.role != 'learner':
        return jsonify({'error': 'Only learners can get course recommendations'}), 403

    limit = request.args.get('limit', 5, type=int)

    # Get recommendations
    recommendations = AIService.get_course_recommendations(current_user_id, limit)

    return jsonify({
        'recommendations': recommendations,
        'count': len(recommendations)
    }), 200


@ai_bp.route('/learner-recommendations', methods=['GET'])
@jwt_required()
def get_learner_recommendations():
    """
    Get AI-powered top learner recommendations for a company
    Available to: Company
    """
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user or current_user.role != 'company':
        return jsonify({'error': 'Only companies can get learner recommendations'}), 403

    limit = request.args.get('limit', 10, type=int)

    # Get recommendations
    recommendations = AIService.recommend_learners_to_company(current_user_id, limit)

    return jsonify({
        'recommendations': recommendations,
        'count': len(recommendations)
    }), 200


@ai_bp.route('/evaluate-submission', methods=['POST'])
@jwt_required()
def evaluate_submission():
    """
    AI-powered evaluation of code/design submission
    Available to: Learner (for their own submissions)
    """
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    code = data.get('code')
    language = data.get('language', 'python')
    task_description = data.get('task_description', '')

    if not code:
        return jsonify({'error': 'Code is required'}), 400

    # Perform AI evaluation
    evaluation = AIService.evaluate_code_submission(code, language, task_description)

    return jsonify({
        'evaluation': evaluation
    }), 200


@ai_bp.route('/update-portfolio', methods=['POST'])
@jwt_required()
def update_portfolio():
    """
    Trigger automatic portfolio update for a learner
    Available to: Learner, Admin
    """
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user:
        return jsonify({'error': 'User not found'}), 404

    # Learners can update their own portfolio, admins can update any
    learner_id = current_user_id
    if current_user.role == 'admin':
        learner_id = request.get_json().get('learner_id', current_user_id)

    # Perform auto-update
    success = AIService.auto_update_portfolio(learner_id)

    if success:
        return jsonify({
            'message': 'Portfolio updated successfully',
            'learner_id': learner_id
        }), 200
    else:
        return jsonify({'error': 'Failed to update portfolio'}), 400


@ai_bp.route('/smart-search/tasks', methods=['GET'])
@jwt_required()
def smart_task_search():
    """
    AI-powered smart task search for learners
    Matches tasks based on learner's skills and interests
    Available to: Learner
    """
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user or current_user.role != 'learner':
        return jsonify({'error': 'Only learners can use smart task search'}), 403

    from app.models.learner import Learner

    learner = Learner.query.filter_by(user_id=current_user_id).first()
    if not learner:
        return jsonify({'error': 'Learner profile not found'}), 404

    # Get all active tasks
    active_tasks = Task.query.filter_by(status='active').all()

    # Calculate match scores for each task
    matched_tasks = []
    for task in active_tasks:
        learner_skills = learner.skills or []
        required_skills = task.skills_required or []

        match_score = AIService.calculate_skill_match_score(learner_skills, required_skills)

        if match_score > 0:
            matched_tasks.append({
                'id': task.id,
                'title': task.title,
                'description': task.description,
                'category': task.category,
                'difficulty': task.difficulty,
                'skills_required': task.skills_required,
                'estimated_hours': task.estimated_hours,
                'deadline': task.deadline.isoformat() if task.deadline else None,
                'match_score': round(match_score, 1),
                'company_name': task.company.name if task.company else None
            })

    # Sort by match score
    matched_tasks.sort(key=lambda x: x['match_score'], reverse=True)

    return jsonify({
        'tasks': matched_tasks,
        'count': len(matched_tasks)
    }), 200


@ai_bp.route('/smart-search/courses', methods=['GET'])
@jwt_required()
def smart_course_search():
    """
    AI-powered smart course search for learners
    Matches courses based on learner's skills and progress
    Available to: Learner
    """
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user or current_user.role != 'learner':
        return jsonify({'error': 'Only learners can use smart course search'}), 403

    # Use the recommendation system
    recommendations = AIService.get_course_recommendations(current_user_id, limit=20)

    return jsonify({
        'courses': recommendations,
        'count': len(recommendations)
    }), 200


@ai_bp.route('/analytics/learner-insights', methods=['GET'])
@jwt_required()
def get_learner_insights():
    """
    Get AI-powered insights about learner's progress and recommendations
    Available to: Learner
    """
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user or current_user.role != 'learner':
        return jsonify({'error': 'Only learners can view insights'}), 403

    from app.models.learner import Learner
    from app.models.enrollment import Enrollment
    from app.models.application import Application

    learner = Learner.query.filter_by(user_id=current_user_id).first()

    # Get statistics
    total_enrollments = Enrollment.query.filter_by(learner_id=current_user_id).count()
    completed_courses = Enrollment.query.filter_by(learner_id=current_user_id, status='completed').count()
    in_progress_courses = Enrollment.query.filter_by(learner_id=current_user_id, status='in_progress').count()

    total_applications = Application.query.filter_by(learner_id=current_user_id).count()
    accepted_applications = Application.query.filter_by(learner_id=current_user_id, status='accepted').count()

    # Calculate completion rate
    completion_rate = (completed_courses / total_enrollments * 100) if total_enrollments > 0 else 0
    acceptance_rate = (accepted_applications / total_applications * 100) if total_applications > 0 else 0

    # Get recommendations
    course_recommendations = AIService.get_course_recommendations(current_user_id, limit=3)

    # Generate insights
    insights = []
    if completion_rate >= 80:
        insights.append("You're an excellent learner! Keep up the great work.")
    elif completion_rate >= 50:
        insights.append("Good progress! Try to complete more courses.")
    else:
        insights.append("Focus on completing your enrolled courses.")

    if acceptance_rate >= 70:
        insights.append("High task acceptance rate! Companies value your work.")
    elif total_applications == 0:
        insights.append("Start applying to tasks to gain practical experience.")

    if len(learner.skills or []) < 3:
        insights.append("Build more skills by completing diverse courses.")

    return jsonify({
        'statistics': {
            'total_enrollments': total_enrollments,
            'completed_courses': completed_courses,
            'in_progress_courses': in_progress_courses,
            'total_applications': total_applications,
            'accepted_applications': accepted_applications,
            'completion_rate': round(completion_rate, 1),
            'acceptance_rate': round(acceptance_rate, 1)
        },
        'skills': learner.skills or [],
        'insights': insights,
        'recommended_courses': course_recommendations
    }), 200
