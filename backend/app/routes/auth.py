from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from app import db
from app.models import User, Learner, Company, Supervisor
from app.utils.email_service import send_welcome_email, send_password_reset_email
import secrets
from datetime import datetime, timedelta

bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ['email', 'password', 'name', 'role']
        if not all(field in data for field in required_fields):
            return jsonify({'message': 'Missing required fields'}), 400

        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Email already registered'}), 400

        # Validate role - admin can only be created by existing admins
        valid_roles = ['learner', 'company', 'supervisor']
        if data['role'] not in valid_roles:
            if data['role'] == 'admin':
                return jsonify({'message': 'Admin accounts cannot be created through public registration. Please contact an administrator.'}), 403
            return jsonify({'message': 'Invalid role. Please select Learner, Company, or Supervisor.'}), 400

        # Create user
        user = User(
            email=data['email'],
            password=data['password'],
            name=data['name'],
            role=data['role']
        )
        db.session.add(user)
        db.session.flush()  # Get user.id before creating role-specific profile

        # Create role-specific profile
        if data['role'] == 'learner':
            learner = Learner(user_id=user.id)
            db.session.add(learner)
        elif data['role'] == 'company':
            company = Company(
                user_id=user.id,
                company_name=data.get('company_name', data['name'])
            )
            db.session.add(company)
        elif data['role'] == 'supervisor':
            supervisor = Supervisor(user_id=user.id)
            db.session.add(supervisor)

        db.session.commit()

        # Send welcome email
        try:
            send_welcome_email(user)
        except Exception as e:
            print(f"Failed to send welcome email: {str(e)}")

        # Create tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)

        return jsonify({
            'message': 'Registration successful',
            'token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Registration failed: {str(e)}'}), 500


@bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()

        if not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Email and password required'}), 400

        user = User.query.filter_by(email=data['email']).first()

        if not user or not user.check_password(data['password']):
            return jsonify({'message': 'Invalid email or password'}), 401

        if not user.is_active:
            return jsonify({'message': 'Account is inactive'}), 403

        # Create tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)

        return jsonify({
            'message': 'Login successful',
            'token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict()
        }), 200

    except Exception as e:
        return jsonify({'message': f'Login failed: {str(e)}'}), 500


@bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    current_user_id = get_jwt_identity()
    access_token = create_access_token(identity=current_user_id)
    return jsonify({'token': access_token}), 200


@bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user info"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({'message': 'User not found'}), 404

        return jsonify({'user': user.to_dict()}), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get user: {str(e)}'}), 500


@bp.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    """Change user password"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({'message': 'User not found'}), 404

        data = request.get_json()

        if not data.get('old_password') or not data.get('new_password'):
            return jsonify({'message': 'Old and new password required'}), 400

        if not user.check_password(data['old_password']):
            return jsonify({'message': 'Invalid old password'}), 401

        from app import bcrypt
        user.password_hash = bcrypt.generate_password_hash(data['new_password']).decode('utf-8')
        db.session.commit()

        return jsonify({'message': 'Password changed successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to change password: {str(e)}'}), 500


@bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """Request password reset"""
    try:
        data = request.get_json()

        if not data.get('email'):
            return jsonify({'message': 'Email is required'}), 400

        user = User.query.filter_by(email=data['email']).first()

        # Always return success message to prevent email enumeration
        if not user:
            return jsonify({'message': 'If the email exists, a password reset link has been sent'}), 200

        # Generate reset token
        reset_token = secrets.token_urlsafe(32)
        user.reset_token = reset_token
        user.reset_token_expiry = datetime.utcnow() + timedelta(hours=1)
        db.session.commit()

        # Send password reset email
        try:
            send_password_reset_email(user, reset_token)
        except Exception as e:
            print(f"Failed to send password reset email: {str(e)}")

        return jsonify({'message': 'If the email exists, a password reset link has been sent'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to process request: {str(e)}'}), 500


@bp.route('/reset-password', methods=['POST'])
def reset_password():
    """Reset password with token"""
    try:
        data = request.get_json()

        if not data.get('token') or not data.get('new_password'):
            return jsonify({'message': 'Token and new password are required'}), 400

        user = User.query.filter_by(reset_token=data['token']).first()

        if not user:
            return jsonify({'message': 'Invalid or expired reset token'}), 400

        # Check if token has expired
        if not user.reset_token_expiry or user.reset_token_expiry < datetime.utcnow():
            return jsonify({'message': 'Reset token has expired'}), 400

        # Update password
        from app import bcrypt
        user.password_hash = bcrypt.generate_password_hash(data['new_password']).decode('utf-8')
        user.reset_token = None
        user.reset_token_expiry = None
        db.session.commit()

        return jsonify({'message': 'Password reset successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to reset password: {str(e)}'}), 500


@bp.route('/verify-reset-token', methods=['POST'])
def verify_reset_token():
    """Verify if reset token is valid"""
    try:
        data = request.get_json()

        if not data.get('token'):
            return jsonify({'message': 'Token is required'}), 400

        user = User.query.filter_by(reset_token=data['token']).first()

        if not user:
            return jsonify({'valid': False, 'message': 'Invalid reset token'}), 200

        # Check if token has expired
        if not user.reset_token_expiry or user.reset_token_expiry < datetime.utcnow():
            return jsonify({'valid': False, 'message': 'Reset token has expired'}), 200

        return jsonify({'valid': True, 'message': 'Token is valid'}), 200

    except Exception as e:
        return jsonify({'valid': False, 'message': f'Failed to verify token: {str(e)}'}), 500
