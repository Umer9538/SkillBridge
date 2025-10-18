import os
import uuid
from werkzeug.utils import secure_filename
from flask import current_app
from datetime import datetime

# Allowed file extensions
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
ALLOWED_DOCUMENT_EXTENSIONS = {'pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx', 'xls', 'xlsx'}
ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'}
ALLOWED_ALL_EXTENSIONS = ALLOWED_IMAGE_EXTENSIONS | ALLOWED_DOCUMENT_EXTENSIONS | ALLOWED_VIDEO_EXTENSIONS

# Max file sizes (in bytes)
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5MB
MAX_DOCUMENT_SIZE = 20 * 1024 * 1024  # 20MB
MAX_VIDEO_SIZE = 100 * 1024 * 1024  # 100MB


def allowed_file(filename, allowed_extensions=ALLOWED_ALL_EXTENSIONS):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions


def get_file_extension(filename):
    """Get file extension"""
    return filename.rsplit('.', 1)[1].lower() if '.' in filename else ''


def generate_unique_filename(original_filename):
    """Generate unique filename while preserving extension"""
    ext = get_file_extension(original_filename)
    unique_id = str(uuid.uuid4())
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    return f"{timestamp}_{unique_id}.{ext}"


def save_file(file, upload_type='general', allowed_extensions=ALLOWED_ALL_EXTENSIONS, max_size=MAX_DOCUMENT_SIZE):
    """
    Save uploaded file

    Args:
        file: FileStorage object from request.files
        upload_type: Type of upload (profile, course, document, video, etc.)
        allowed_extensions: Set of allowed file extensions
        max_size: Maximum file size in bytes

    Returns:
        dict: {'success': bool, 'filename': str, 'path': str, 'url': str, 'error': str}
    """
    try:
        # Check if file exists
        if not file:
            return {'success': False, 'error': 'No file provided'}

        # Check if filename is present
        if file.filename == '':
            return {'success': False, 'error': 'No file selected'}

        # Check file extension
        if not allowed_file(file.filename, allowed_extensions):
            return {'success': False, 'error': f'File type not allowed. Allowed types: {", ".join(allowed_extensions)}'}

        # Check file size
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)  # Reset file pointer

        if file_size > max_size:
            max_size_mb = max_size / (1024 * 1024)
            return {'success': False, 'error': f'File too large. Maximum size: {max_size_mb}MB'}

        # Generate unique filename
        original_filename = secure_filename(file.filename)
        unique_filename = generate_unique_filename(original_filename)

        # Create upload directory if it doesn't exist
        upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads')
        type_folder = os.path.join(upload_folder, upload_type)
        os.makedirs(type_folder, exist_ok=True)

        # Save file
        file_path = os.path.join(type_folder, unique_filename)
        file.save(file_path)

        # Generate URL
        file_url = f"/uploads/{upload_type}/{unique_filename}"

        return {
            'success': True,
            'filename': unique_filename,
            'original_filename': original_filename,
            'path': file_path,
            'url': file_url,
            'size': file_size,
            'type': upload_type
        }

    except Exception as e:
        return {'success': False, 'error': str(e)}


def delete_file(file_path):
    """Delete a file from the server"""
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            return {'success': True, 'message': 'File deleted successfully'}
        else:
            return {'success': False, 'error': 'File not found'}
    except Exception as e:
        return {'success': False, 'error': str(e)}


def save_profile_picture(file):
    """Save profile picture"""
    return save_file(
        file,
        upload_type='profiles',
        allowed_extensions=ALLOWED_IMAGE_EXTENSIONS,
        max_size=MAX_IMAGE_SIZE
    )


def save_course_thumbnail(file):
    """Save course thumbnail"""
    return save_file(
        file,
        upload_type='courses/thumbnails',
        allowed_extensions=ALLOWED_IMAGE_EXTENSIONS,
        max_size=MAX_IMAGE_SIZE
    )


def save_course_document(file):
    """Save course document"""
    return save_file(
        file,
        upload_type='courses/documents',
        allowed_extensions=ALLOWED_DOCUMENT_EXTENSIONS,
        max_size=MAX_DOCUMENT_SIZE
    )


def save_course_video(file):
    """Save course video"""
    return save_file(
        file,
        upload_type='courses/videos',
        allowed_extensions=ALLOWED_VIDEO_EXTENSIONS,
        max_size=MAX_VIDEO_SIZE
    )


def save_task_attachment(file):
    """Save task attachment"""
    return save_file(
        file,
        upload_type='tasks/attachments',
        allowed_extensions=ALLOWED_DOCUMENT_EXTENSIONS | ALLOWED_IMAGE_EXTENSIONS,
        max_size=MAX_DOCUMENT_SIZE
    )


def save_submission_file(file):
    """Save submission file"""
    return save_file(
        file,
        upload_type='submissions',
        allowed_extensions=ALLOWED_ALL_EXTENSIONS,
        max_size=MAX_DOCUMENT_SIZE
    )
