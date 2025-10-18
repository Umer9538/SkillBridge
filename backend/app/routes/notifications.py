from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models import Notification
from app.utils.decorators import get_current_user

bp = Blueprint('notifications', __name__, url_prefix='/api/notifications')


@bp.route('', methods=['GET'])
@jwt_required()
def get_notifications():
    """Get current user's notifications"""
    try:
        user = get_current_user()
        notifications = user.notifications.order_by(Notification.created_at.desc()).all()

        return jsonify({
            'notifications': [notif.to_dict() for notif in notifications]
        }), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get notifications: {str(e)}'}), 500


@bp.route('/<int:notification_id>/read', methods=['PUT'])
@jwt_required()
def mark_as_read(notification_id):
    """Mark a notification as read"""
    try:
        user = get_current_user()
        notification = Notification.query.get(notification_id)

        if not notification or notification.user_id != user.id:
            return jsonify({'message': 'Notification not found'}), 404

        notification.read = True
        db.session.commit()

        return jsonify({'message': 'Notification marked as read'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to mark as read: {str(e)}'}), 500


@bp.route('/mark-all-read', methods=['PUT'])
@jwt_required()
def mark_all_as_read():
    """Mark all notifications as read"""
    try:
        user = get_current_user()
        user.notifications.filter_by(read=False).update({'read': True})
        db.session.commit()

        return jsonify({'message': 'All notifications marked as read'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to mark all as read: {str(e)}'}), 500


@bp.route('', methods=['POST'])
@jwt_required()
def create_notification():
    """Create a new notification (internal use or for testing)"""
    try:
        data = request.get_json()

        required_fields = ['user_id', 'type', 'title', 'message']
        if not all(field in data for field in required_fields):
            return jsonify({'message': 'Missing required fields'}), 400

        notification = Notification(
            user_id=data['user_id'],
            type=data['type'],
            title=data['title'],
            message=data['message'],
            link=data.get('link')
        )

        db.session.add(notification)
        db.session.commit()

        return jsonify({
            'message': 'Notification created successfully',
            'notification': notification.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to create notification: {str(e)}'}), 500
