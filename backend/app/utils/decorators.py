from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from app.models import User


def role_required(*allowed_roles):
    """Decorator to check if user has the required role"""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)

            if not user:
                return jsonify({'message': 'User not found'}), 404

            if not user.is_active:
                return jsonify({'message': 'Account is inactive'}), 403

            if user.role not in allowed_roles:
                return jsonify({'message': 'Access denied. Insufficient permissions'}), 403

            return fn(*args, **kwargs)
        return wrapper
    return decorator


def get_current_user():
    """Helper function to get current user from JWT"""
    verify_jwt_in_request()
    current_user_id = get_jwt_identity()
    return User.query.get(current_user_id)
