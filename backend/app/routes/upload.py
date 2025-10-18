from flask import Blueprint, request, jsonify, send_from_directory, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from app.utils.file_upload import (
    save_profile_picture,
    save_course_thumbnail,
    save_course_document,
    save_course_video,
    save_task_attachment,
    save_submission_file,
    delete_file
)
import os

upload_bp = Blueprint('upload', __name__)

@upload_bp.route('/upload/profile-picture', methods=['POST'])
@jwt_required()
def upload_profile_picture():
    """Upload profile picture"""
    try:
        current_user_id = get_jwt_identity()

        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']

        # Save file
        result = save_profile_picture(file)

        if not result['success']:
            return jsonify({'error': result['error']}), 400

        # Update user profile
        user = User.query.get(current_user_id)

        # Delete old profile picture if exists
        if user.profile_picture:
            old_path = os.path.join(current_app.config.get('UPLOAD_FOLDER', 'uploads'),
                                   user.profile_picture.lstrip('/uploads/'))
            delete_file(old_path)

        user.profile_picture = result['url']
        db.session.commit()

        return jsonify({
            'message': 'Profile picture uploaded successfully',
            'url': result['url'],
            'filename': result['filename']
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@upload_bp.route('/upload/course-thumbnail', methods=['POST'])
@jwt_required()
def upload_course_thumbnail():
    """Upload course thumbnail"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']
        result = save_course_thumbnail(file)

        if not result['success']:
            return jsonify({'error': result['error']}), 400

        return jsonify({
            'message': 'Course thumbnail uploaded successfully',
            'url': result['url'],
            'filename': result['filename']
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@upload_bp.route('/upload/course-document', methods=['POST'])
@jwt_required()
def upload_course_document():
    """Upload course document"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']
        result = save_course_document(file)

        if not result['success']:
            return jsonify({'error': result['error']}), 400

        return jsonify({
            'message': 'Course document uploaded successfully',
            'url': result['url'],
            'filename': result['filename'],
            'original_filename': result['original_filename'],
            'size': result['size']
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@upload_bp.route('/upload/course-video', methods=['POST'])
@jwt_required()
def upload_course_video():
    """Upload course video"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']
        result = save_course_video(file)

        if not result['success']:
            return jsonify({'error': result['error']}), 400

        return jsonify({
            'message': 'Course video uploaded successfully',
            'url': result['url'],
            'filename': result['filename'],
            'size': result['size']
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@upload_bp.route('/upload/task-attachment', methods=['POST'])
@jwt_required()
def upload_task_attachment():
    """Upload task attachment"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']
        result = save_task_attachment(file)

        if not result['success']:
            return jsonify({'error': result['error']}), 400

        return jsonify({
            'message': 'Task attachment uploaded successfully',
            'url': result['url'],
            'filename': result['filename'],
            'original_filename': result['original_filename']
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@upload_bp.route('/upload/submission', methods=['POST'])
@jwt_required()
def upload_submission():
    """Upload submission file"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']
        result = save_submission_file(file)

        if not result['success']:
            return jsonify({'error': result['error']}), 400

        return jsonify({
            'message': 'Submission file uploaded successfully',
            'url': result['url'],
            'filename': result['filename'],
            'original_filename': result['original_filename']
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@upload_bp.route('/uploads/<path:filename>', methods=['GET'])
def serve_file(filename):
    """Serve uploaded files"""
    try:
        upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads')
        return send_from_directory(upload_folder, filename)
    except Exception as e:
        return jsonify({'error': 'File not found'}), 404


@upload_bp.route('/upload/delete', methods=['POST'])
@jwt_required()
def delete_uploaded_file():
    """Delete an uploaded file"""
    try:
        data = request.get_json()
        file_path = data.get('file_path')

        if not file_path:
            return jsonify({'error': 'File path is required'}), 400

        # Remove /uploads/ prefix if present
        if file_path.startswith('/uploads/'):
            file_path = file_path[9:]

        full_path = os.path.join(current_app.config.get('UPLOAD_FOLDER', 'uploads'), file_path)
        result = delete_file(full_path)

        if not result['success']:
            return jsonify({'error': result['error']}), 400

        return jsonify({'message': result['message']}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
