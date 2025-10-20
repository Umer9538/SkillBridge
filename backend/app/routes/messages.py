from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models import Message, User
from app.utils.decorators import get_current_user
from datetime import datetime
from sqlalchemy import or_, and_

bp = Blueprint('messages', __name__, url_prefix='/api/messages')


@bp.route('', methods=['GET'])
@jwt_required()
def get_messages():
    """Get all messages (sent and received) for current user"""
    try:
        user = get_current_user()

        # Get all messages where user is sender or receiver
        messages = Message.query.filter(
            or_(
                Message.sender_id == user.id,
                Message.receiver_id == user.id
            )
        ).order_by(Message.created_at.desc()).all()

        return jsonify({
            'messages': [msg.to_dict() for msg in messages]
        }), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get messages: {str(e)}'}), 500


@bp.route('/conversations', methods=['GET'])
@jwt_required()
def get_conversations():
    """Get list of all conversations with last message"""
    try:
        user = get_current_user()

        # Get all messages where user is involved
        messages = Message.query.filter(
            or_(
                Message.sender_id == user.id,
                Message.receiver_id == user.id
            )
        ).order_by(Message.created_at.desc()).all()

        # Group by conversation partner
        conversations = {}
        for msg in messages:
            # Determine the other user in the conversation
            other_user_id = msg.receiver_id if msg.sender_id == user.id else msg.sender_id

            if other_user_id not in conversations:
                other_user = User.query.get(other_user_id)
                conversations[other_user_id] = {
                    'user_id': other_user_id,
                    'user_name': other_user.name if other_user else 'Unknown',
                    'user_role': other_user.role if other_user else None,
                    'user_profile_picture': other_user.profile_picture if other_user else None,
                    'last_message': msg.to_dict(),
                    'unread_count': 0
                }

            # Count unread messages from this user
            if msg.receiver_id == user.id and not msg.read:
                conversations[other_user_id]['unread_count'] += 1

        return jsonify({
            'conversations': list(conversations.values())
        }), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get conversations: {str(e)}'}), 500


@bp.route('/conversations/<int:user_id>', methods=['GET'])
@jwt_required()
def get_conversation(user_id):
    """Get conversation with a specific user"""
    try:
        user = get_current_user()

        # Get all messages between current user and specified user
        messages = Message.query.filter(
            or_(
                and_(Message.sender_id == user.id, Message.receiver_id == user_id),
                and_(Message.sender_id == user_id, Message.receiver_id == user.id)
            )
        ).order_by(Message.created_at.asc()).all()

        # Mark all messages from the other user as read
        unread_messages = Message.query.filter(
            Message.sender_id == user_id,
            Message.receiver_id == user.id,
            Message.read == False
        ).all()

        for msg in unread_messages:
            msg.read = True
            msg.read_at = datetime.utcnow()

        if unread_messages:
            db.session.commit()

        # Get other user details
        other_user = User.query.get(user_id)

        return jsonify({
            'conversation': {
                'user_id': user_id,
                'user_name': other_user.name if other_user else 'Unknown',
                'user_role': other_user.role if other_user else None,
                'user_profile_picture': other_user.profile_picture if other_user else None,
                'messages': [msg.to_dict() for msg in messages]
            }
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to get conversation: {str(e)}'}), 500


@bp.route('', methods=['POST'])
@jwt_required()
def send_message():
    """Send a new message"""
    try:
        user = get_current_user()
        data = request.get_json()

        # Validate required fields
        if not data.get('receiver_id'):
            return jsonify({'message': 'Receiver ID is required'}), 400

        if not data.get('content'):
            return jsonify({'message': 'Message content is required'}), 400

        # Check if receiver exists
        receiver = User.query.get(data['receiver_id'])
        if not receiver:
            return jsonify({'message': 'Receiver not found'}), 404

        # Create message
        message = Message(
            sender_id=user.id,
            receiver_id=data['receiver_id'],
            subject=data.get('subject'),
            content=data['content']
        )

        db.session.add(message)
        db.session.commit()

        return jsonify({
            'message': 'Message sent successfully',
            'data': message.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to send message: {str(e)}'}), 500


@bp.route('/<int:message_id>/read', methods=['PUT'])
@jwt_required()
def mark_as_read(message_id):
    """Mark a message as read"""
    try:
        user = get_current_user()
        message = Message.query.get(message_id)

        if not message:
            return jsonify({'message': 'Message not found'}), 404

        # Only receiver can mark as read
        if message.receiver_id != user.id:
            return jsonify({'message': 'Unauthorized'}), 403

        message.read = True
        message.read_at = datetime.utcnow()
        db.session.commit()

        return jsonify({
            'message': 'Message marked as read',
            'data': message.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to mark as read: {str(e)}'}), 500


@bp.route('/<int:message_id>', methods=['DELETE'])
@jwt_required()
def delete_message(message_id):
    """Delete a message"""
    try:
        user = get_current_user()
        message = Message.query.get(message_id)

        if not message:
            return jsonify({'message': 'Message not found'}), 404

        # Only sender or receiver can delete
        if message.sender_id != user.id and message.receiver_id != user.id:
            return jsonify({'message': 'Unauthorized'}), 403

        db.session.delete(message)
        db.session.commit()

        return jsonify({'message': 'Message deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to delete message: {str(e)}'}), 500


@bp.route('/unread-count', methods=['GET'])
@jwt_required()
def get_unread_count():
    """Get count of unread messages"""
    try:
        user = get_current_user()

        count = Message.query.filter(
            Message.receiver_id == user.id,
            Message.read == False
        ).count()

        return jsonify({'unread_count': count}), 200

    except Exception as e:
        return jsonify({'message': f'Failed to get unread count: {str(e)}'}), 500
