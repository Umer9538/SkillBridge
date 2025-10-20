from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.models.course import Course, Enrollment
from app.models.task import Task, Application
from app.models.review import CourseReview
from app import db
from sqlalchemy import func, extract
from datetime import datetime, timedelta

analytics_bp = Blueprint('analytics', __name__, url_prefix='/api/admin')


@analytics_bp.route('/analytics/overview', methods=['GET'])
@jwt_required()
def get_overview_analytics():
    """Get overview analytics for admin dashboard"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403

    # Total counts
    total_users = User.query.count()
    total_learners = User.query.filter_by(role='learner').count()
    total_companies = User.query.filter_by(role='company').count()
    total_supervisors = User.query.filter_by(role='supervisor').count()
    total_courses = Course.query.count()
    total_tasks = Task.query.count()
    total_enrollments = Enrollment.query.count()
    total_applications = Application.query.count()

    # Active users (logged in within last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    active_users = User.query.filter(User.last_login >= thirty_days_ago).count() if hasattr(User, 'last_login') else total_users

    # Published courses
    published_courses = Course.query.filter_by(is_published=True).count() if hasattr(Course, 'is_published') else total_courses

    # Active tasks
    active_tasks = Task.query.filter_by(status='open').count() if hasattr(Task, 'status') else total_tasks

    return jsonify({
        'overview': {
            'total_users': total_users,
            'total_learners': total_learners,
            'total_companies': total_companies,
            'total_supervisors': total_supervisors,
            'active_users': active_users,
            'total_courses': total_courses,
            'published_courses': published_courses,
            'total_tasks': total_tasks,
            'active_tasks': active_tasks,
            'total_enrollments': total_enrollments,
            'total_applications': total_applications
        }
    }), 200


@analytics_bp.route('/analytics/growth', methods=['GET'])
@jwt_required()
def get_growth_analytics():
    """Get growth analytics (user registrations over time)"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403

    # Get user registrations for last 12 months
    twelve_months_ago = datetime.utcnow() - timedelta(days=365)

    user_growth = db.session.query(
        extract('year', User.created_at).label('year'),
        extract('month', User.created_at).label('month'),
        func.count(User.id).label('count')
    ).filter(
        User.created_at >= twelve_months_ago
    ).group_by('year', 'month').order_by('year', 'month').all()

    # Format growth data
    growth_data = []
    for record in user_growth:
        month_name = datetime(int(record.year), int(record.month), 1).strftime('%b %Y')
        growth_data.append({
            'month': month_name,
            'count': record.count
        })

    # Get enrollment growth
    enrollment_growth = db.session.query(
        extract('year', Enrollment.enrolled_at).label('year'),
        extract('month', Enrollment.enrolled_at).label('month'),
        func.count(Enrollment.id).label('count')
    ).filter(
        Enrollment.enrolled_at >= twelve_months_ago
    ).group_by('year', 'month').order_by('year', 'month').all()

    enrollment_data = []
    for record in enrollment_growth:
        month_name = datetime(int(record.year), int(record.month), 1).strftime('%b %Y')
        enrollment_data.append({
            'month': month_name,
            'count': record.count
        })

    return jsonify({
        'growth': {
            'user_registrations': growth_data,
            'course_enrollments': enrollment_data
        }
    }), 200


@analytics_bp.route('/analytics/top-courses', methods=['GET'])
@jwt_required()
def get_top_courses():
    """Get top courses by enrollment"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403

    # Get top 5 courses by enrollment
    top_courses = db.session.query(
        Course,
        func.count(Enrollment.id).label('enrollment_count')
    ).outerjoin(
        Enrollment, Course.id == Enrollment.course_id
    ).group_by(Course.id).order_by(
        func.count(Enrollment.id).desc()
    ).limit(5).all()

    courses_data = []
    for course, enrollment_count in top_courses:
        # Get average rating
        avg_rating = db.session.query(
            func.avg(CourseReview.rating)
        ).filter(CourseReview.course_id == course.id).scalar() or 0

        courses_data.append({
            'id': course.id,
            'title': course.title,
            'category': course.category,
            'enrollments': enrollment_count,
            'rating': round(float(avg_rating), 1)
        })

    return jsonify({
        'top_courses': courses_data
    }), 200


@analytics_bp.route('/analytics/top-companies', methods=['GET'])
@jwt_required()
def get_top_companies():
    """Get top companies by tasks posted"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403

    # Get top 5 companies by tasks posted
    top_companies = db.session.query(
        User,
        func.count(Task.id).label('task_count')
    ).filter(
        User.role == 'company'
    ).outerjoin(
        Task, User.id == Task.company_id
    ).group_by(User.id).order_by(
        func.count(Task.id).desc()
    ).limit(5).all()

    companies_data = []
    for company, task_count in top_companies:
        # Get total applications for this company's tasks
        total_applications = db.session.query(
            func.count(Application.id)
        ).join(
            Task, Application.task_id == Task.id
        ).filter(Task.company_id == company.id).scalar() or 0

        companies_data.append({
            'id': company.id,
            'name': company.name,
            'email': company.email,
            'tasks_posted': task_count,
            'total_applications': total_applications
        })

    return jsonify({
        'top_companies': companies_data
    }), 200


@analytics_bp.route('/analytics/recent-activity', methods=['GET'])
@jwt_required()
def get_recent_activity():
    """Get recent platform activity"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403

    activities = []

    # Recent user registrations (last 10)
    recent_users = User.query.order_by(User.created_at.desc()).limit(10).all()
    for u in recent_users:
        activities.append({
            'type': 'user_registration',
            'description': f'{u.name} joined as {u.role}',
            'timestamp': u.created_at.isoformat(),
            'user_id': u.id,
            'user_name': u.name
        })

    # Recent course enrollments (last 10)
    recent_enrollments = Enrollment.query.order_by(Enrollment.enrolled_at.desc()).limit(10).all()
    for enrollment in recent_enrollments:
        learner = User.query.get(enrollment.user_id)
        course = Course.query.get(enrollment.course_id)
        if learner and course:
            activities.append({
                'type': 'course_enrollment',
                'description': f'{learner.name} enrolled in {course.title}',
                'timestamp': enrollment.enrolled_at.isoformat(),
                'user_id': learner.id,
                'user_name': learner.name,
                'course_id': course.id,
                'course_title': course.title
            })

    # Recent task applications (last 10)
    recent_applications = Application.query.order_by(Application.applied_at.desc()).limit(10).all()
    for application in recent_applications:
        learner = User.query.get(application.learner_id)
        task = Task.query.get(application.task_id)
        if learner and task:
            activities.append({
                'type': 'task_application',
                'description': f'{learner.name} applied to {task.title}',
                'timestamp': application.applied_at.isoformat(),
                'user_id': learner.id,
                'user_name': learner.name,
                'task_id': task.id,
                'task_title': task.title
            })

    # Sort all activities by timestamp
    activities.sort(key=lambda x: x['timestamp'], reverse=True)

    # Return top 20 most recent activities
    return jsonify({
        'recent_activity': activities[:20]
    }), 200


@analytics_bp.route('/analytics/engagement', methods=['GET'])
@jwt_required()
def get_engagement_metrics():
    """Get engagement metrics"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403

    # Calculate engagement rates
    total_learners = User.query.filter_by(role='learner').count()
    learners_with_enrollments = db.session.query(
        func.count(func.distinct(Enrollment.user_id))
    ).scalar() or 0

    enrollment_rate = (learners_with_enrollments / total_learners * 100) if total_learners > 0 else 0

    learners_with_applications = db.session.query(
        func.count(func.distinct(Application.learner_id))
    ).scalar() or 0

    application_rate = (learners_with_applications / total_learners * 100) if total_learners > 0 else 0

    # Average enrollments per learner
    avg_enrollments = db.session.query(
        func.avg(
            db.session.query(func.count(Enrollment.id))
            .filter(Enrollment.user_id == User.id)
            .scalar_subquery()
        )
    ).filter(User.role == 'learner').scalar() or 0

    return jsonify({
        'engagement': {
            'enrollment_rate': round(enrollment_rate, 1),
            'application_rate': round(application_rate, 1),
            'avg_enrollments_per_learner': round(float(avg_enrollments or 0), 1),
            'total_active_learners': learners_with_enrollments
        }
    }), 200
