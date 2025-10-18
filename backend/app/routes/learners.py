from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models import Learner, Certificate
from app.utils.decorators import role_required, get_current_user

bp = Blueprint('learners', __name__, url_prefix='/api/learners')


@bp.route('/profile', methods=['GET'])
@jwt_required()
@role_required('learner')
def get_profile():
    """Get learner profile"""
    try:
        user = get_current_user()
        return jsonify({'profile': user.learner.to_dict()}), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get profile: {str(e)}'}), 500


@bp.route('/profile', methods=['PUT'])
@jwt_required()
@role_required('learner')
def update_profile():
    """Update learner profile"""
    try:
        user = get_current_user()
        data = request.get_json()

        # Update learner fields
        if 'skills' in data:
            user.learner.skills = data['skills']
        if 'bio' in data:
            user.learner.bio = data['bio']
        if 'phone' in data:
            user.learner.phone = data['phone']
        if 'location' in data:
            user.learner.location = data['location']
        if 'education' in data:
            user.learner.education = data['education']
        if 'experience' in data:
            user.learner.experience = data['experience']
        if 'portfolio_privacy' in data:
            user.learner.portfolio_privacy = data['portfolio_privacy']

        # Update user fields
        if 'name' in data:
            user.name = data['name']
        if 'profile_picture' in data:
            user.profile_picture = data['profile_picture']

        db.session.commit()

        return jsonify({
            'message': 'Profile updated successfully',
            'profile': user.learner.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to update profile: {str(e)}'}), 500


@bp.route('/portfolio', methods=['GET'])
@jwt_required()
@role_required('learner')
def get_portfolio():
    """Get learner portfolio"""
    try:
        user = get_current_user()
        portfolio = user.learner.get_portfolio()
        return jsonify({'portfolio': portfolio}), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get portfolio: {str(e)}'}), 500


@bp.route('/<int:learner_id>/portfolio', methods=['GET'])
@jwt_required()
def view_portfolio(learner_id):
    """View another learner's portfolio (if public)"""
    try:
        learner = Learner.query.get(learner_id)

        if not learner:
            return jsonify({'message': 'Learner not found'}), 404

        # Check privacy settings
        current_user = get_current_user()
        if learner.portfolio_privacy == 'private' and current_user.learner.id != learner_id:
            # Allow companies and supervisors to view
            if current_user.role not in ['company', 'supervisor', 'admin']:
                return jsonify({'message': 'Portfolio is private'}), 403

        portfolio = learner.get_portfolio()
        return jsonify({'portfolio': portfolio}), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get portfolio: {str(e)}'}), 500


@bp.route('/certificates', methods=['GET'])
@jwt_required()
@role_required('learner')
def get_certificates():
    """Get learner certificates"""
    try:
        user = get_current_user()
        certificates = user.learner.certificates.all()

        return jsonify({
            'certificates': [cert.to_dict() for cert in certificates]
        }), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get certificates: {str(e)}'}), 500
