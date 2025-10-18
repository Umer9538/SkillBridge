from app import create_app, db
from app.models import *
import os

app = create_app(os.getenv('FLASK_ENV', 'development'))

@app.shell_context_processor
def make_shell_context():
    """Make database models available in Flask shell"""
    return {
        'db': db,
        'User': User,
        'Learner': Learner,
        'Company': Company,
        'Supervisor': Supervisor,
        'Course': Course,
        'Module': Module,
        'Enrollment': Enrollment,
        'Task': Task,
        'Application': Application,
        'Evaluation': Evaluation,
        'Certificate': Certificate,
        'Notification': Notification,
        'Message': Message
    }

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return {'status': 'ok', 'message': 'SkillBridge API is running'}, 200

if __name__ == '__main__':
    with app.app_context():
        # Create tables if they don't exist
        db.create_all()

    # Using port 5001 to avoid conflict with macOS AirPlay Receiver on port 5000
    app.run(host='0.0.0.0', port=5001, debug=True)
