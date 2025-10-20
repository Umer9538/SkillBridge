from flask_mail import Message
from flask import current_app, render_template_string
from app import mail
from threading import Thread


def send_async_email(app, msg):
    """Send email asynchronously"""
    with app.app_context():
        try:
            mail.send(msg)
        except Exception as e:
            print(f"Error sending email: {str(e)}")


def send_email(subject, recipients, text_body, html_body=None):
    """Send email with optional HTML body"""
    msg = Message(
        subject,
        sender=current_app.config['MAIL_USERNAME'] or 'noreply@skillbridge.com',
        recipients=recipients if isinstance(recipients, list) else [recipients]
    )
    msg.body = text_body
    if html_body:
        msg.html = html_body

    # Send email asynchronously
    Thread(
        target=send_async_email,
        args=(current_app._get_current_object(), msg)
    ).start()


def send_welcome_email(user):
    """Send welcome email to new user"""
    subject = "Welcome to SkillBridge!"

    text_body = f"""
    Hi {user.name},

    Welcome to SkillBridge! We're excited to have you on board.

    Your account has been successfully created as a {user.role}.

    {'As a learner, you can now:' if user.role == 'learner' else ''}
    {'- Browse and enroll in courses' if user.role == 'learner' else ''}
    {'- Apply for real-world tasks from companies' if user.role == 'learner' else ''}
    {'- Track your learning progress' if user.role == 'learner' else ''}

    {'As a company, you can now:' if user.role == 'company' else ''}
    {'- Post real-world tasks for learners' if user.role == 'company' else ''}
    {'- Review applications from talented learners' if user.role == 'company' else ''}
    {'- Build your team with skilled professionals' if user.role == 'company' else ''}

    {'As a supervisor, you can now:' if user.role == 'supervisor' else ''}
    {'- Create and manage courses' if user.role == 'supervisor' else ''}
    {'- Add modules and learning content' if user.role == 'supervisor' else ''}
    {'- Track learner progress' if user.role == 'supervisor' else ''}

    Get started by logging in to your account!

    Best regards,
    The SkillBridge Team
    """

    html_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2563eb;">Welcome to SkillBridge!</h2>
                <p>Hi {user.name},</p>
                <p>Welcome to SkillBridge! We're excited to have you on board.</p>
                <p>Your account has been successfully created as a <strong>{user.role}</strong>.</p>

                {f'''
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">As a learner, you can now:</h3>
                    <ul>
                        <li>Browse and enroll in courses</li>
                        <li>Apply for real-world tasks from companies</li>
                        <li>Track your learning progress</li>
                    </ul>
                </div>
                ''' if user.role == 'learner' else ''}

                {f'''
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">As a company, you can now:</h3>
                    <ul>
                        <li>Post real-world tasks for learners</li>
                        <li>Review applications from talented learners</li>
                        <li>Build your team with skilled professionals</li>
                    </ul>
                </div>
                ''' if user.role == 'company' else ''}

                {f'''
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">As a supervisor, you can now:</h3>
                    <ul>
                        <li>Create and manage courses</li>
                        <li>Add modules and learning content</li>
                        <li>Track learner progress</li>
                    </ul>
                </div>
                ''' if user.role == 'supervisor' else ''}

                <p>Get started by logging in to your account!</p>
                <p>Best regards,<br>The SkillBridge Team</p>
            </div>
        </body>
    </html>
    """

    send_email(subject, user.email, text_body, html_body)


def send_password_reset_email(user, reset_token):
    """Send password reset email"""
    subject = "Reset Your Password - SkillBridge"

    reset_url = f"{current_app.config.get('FRONTEND_URL', 'http://localhost:3000')}/reset-password?token={reset_token}"

    text_body = f"""
    Hi {user.name},

    You requested to reset your password for your SkillBridge account.

    Click the link below to reset your password:
    {reset_url}

    This link will expire in 1 hour.

    If you didn't request this password reset, please ignore this email.

    Best regards,
    The SkillBridge Team
    """

    html_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2563eb;">Reset Your Password</h2>
                <p>Hi {user.name},</p>
                <p>You requested to reset your password for your SkillBridge account.</p>
                <p>Click the button below to reset your password:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{reset_url}"
                       style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
                <p style="color: #666; font-size: 14px;">If you didn't request this password reset, please ignore this email.</p>
                <p>Best regards,<br>The SkillBridge Team</p>
            </div>
        </body>
    </html>
    """

    send_email(subject, user.email, text_body, html_body)


def send_course_enrollment_email(user, course):
    """Send email when user enrolls in a course"""
    subject = f"You're enrolled in {course.title}!"

    text_body = f"""
    Hi {user.name},

    Congratulations! You've successfully enrolled in "{course.title}".

    Course Details:
    - Category: {course.category}
    - Difficulty: {course.difficulty}
    - Duration: {course.duration or 'N/A'} hours

    Start learning now and track your progress in your dashboard.

    Best regards,
    The SkillBridge Team
    """

    html_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2563eb;">You're enrolled in {course.title}!</h2>
                <p>Hi {user.name},</p>
                <p>Congratulations! You've successfully enrolled in <strong>"{course.title}"</strong>.</p>

                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">Course Details:</h3>
                    <ul style="margin: 0;">
                        <li><strong>Category:</strong> {course.category}</li>
                        <li><strong>Difficulty:</strong> {course.difficulty}</li>
                        <li><strong>Duration:</strong> {course.duration or 'N/A'} hours</li>
                    </ul>
                </div>

                <p>Start learning now and track your progress in your dashboard.</p>
                <p>Best regards,<br>The SkillBridge Team</p>
            </div>
        </body>
    </html>
    """

    send_email(subject, user.email, text_body, html_body)


def send_task_application_email(learner, task, company):
    """Send email when learner applies to a task"""
    # Email to learner
    subject_learner = f"Application Submitted: {task.title}"

    text_body_learner = f"""
    Hi {learner.name},

    Your application for "{task.title}" has been successfully submitted!

    The company will review your application and get back to you soon.

    Task Details:
    - Company: {company.name}
    - Category: {task.category}
    - Type: {task.task_type}

    You can track your application status in your dashboard.

    Best regards,
    The SkillBridge Team
    """

    html_body_learner = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2563eb;">Application Submitted!</h2>
                <p>Hi {learner.name},</p>
                <p>Your application for <strong>"{task.title}"</strong> has been successfully submitted!</p>
                <p>The company will review your application and get back to you soon.</p>

                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">Task Details:</h3>
                    <ul style="margin: 0;">
                        <li><strong>Company:</strong> {company.name}</li>
                        <li><strong>Category:</strong> {task.category}</li>
                        <li><strong>Type:</strong> {task.task_type}</li>
                    </ul>
                </div>

                <p>You can track your application status in your dashboard.</p>
                <p>Best regards,<br>The SkillBridge Team</p>
            </div>
        </body>
    </html>
    """

    send_email(subject_learner, learner.email, text_body_learner, html_body_learner)

    # Email to company
    subject_company = f"New Application: {task.title}"

    text_body_company = f"""
    Hi {company.name},

    You have a new application for your task "{task.title}"!

    Applicant: {learner.name}
    Email: {learner.email}

    Review the application in your dashboard.

    Best regards,
    The SkillBridge Team
    """

    html_body_company = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2563eb;">New Application Received!</h2>
                <p>Hi {company.name},</p>
                <p>You have a new application for your task <strong>"{task.title}"</strong>!</p>

                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">Applicant Details:</h3>
                    <ul style="margin: 0;">
                        <li><strong>Name:</strong> {learner.name}</li>
                        <li><strong>Email:</strong> {learner.email}</li>
                    </ul>
                </div>

                <p>Review the application in your dashboard.</p>
                <p>Best regards,<br>The SkillBridge Team</p>
            </div>
        </body>
    </html>
    """

    send_email(subject_company, company.email, text_body_company, html_body_company)


def send_application_status_email(learner, task, status, company):
    """Send email when application status changes"""
    status_text = {
        'accepted': 'Accepted',
        'rejected': 'Rejected',
        'shortlisted': 'Shortlisted'
    }

    subject = f"Application {status_text.get(status, status)}: {task.title}"

    text_body = f"""
    Hi {learner.name},

    Your application for "{task.title}" at {company.name} has been {status_text.get(status, status).lower()}.

    {'Congratulations! The company is interested in your application.' if status == 'accepted' else ''}
    {'Unfortunately, your application was not selected this time. Keep applying!' if status == 'rejected' else ''}
    {'Great news! You have been shortlisted. The company will contact you soon.' if status == 'shortlisted' else ''}

    Check your dashboard for more details.

    Best regards,
    The SkillBridge Team
    """

    html_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: {'#16a34a' if status == 'accepted' else '#dc2626' if status == 'rejected' else '#ea580c'};">
                    Application {status_text.get(status, status)}
                </h2>
                <p>Hi {learner.name},</p>
                <p>Your application for <strong>"{task.title}"</strong> at {company.name} has been <strong>{status_text.get(status, status).lower()}</strong>.</p>

                {f'<div style="background-color: #dcfce7; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #16a34a;"><p style="margin: 0;">Congratulations! The company is interested in your application.</p></div>' if status == 'accepted' else ''}

                {f'<div style="background-color: #fee2e2; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc2626;"><p style="margin: 0;">Unfortunately, your application was not selected this time. Keep applying!</p></div>' if status == 'rejected' else ''}

                {f'<div style="background-color: #ffedd5; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ea580c;"><p style="margin: 0;">Great news! You have been shortlisted. The company will contact you soon.</p></div>' if status == 'shortlisted' else ''}

                <p>Check your dashboard for more details.</p>
                <p>Best regards,<br>The SkillBridge Team</p>
            </div>
        </body>
    </html>
    """

    send_email(subject, learner.email, text_body, html_body)


def send_new_course_notification(supervisor, course):
    """Send email to supervisor when course is created"""
    subject = f"Course Created: {course.title}"

    text_body = f"""
    Hi {supervisor.name},

    Your course "{course.title}" has been successfully created!

    Next steps:
    - Add modules and learning content
    - Set prerequisites and learning objectives
    - Publish your course when ready

    Manage your course in the supervisor dashboard.

    Best regards,
    The SkillBridge Team
    """

    html_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2563eb;">Course Created Successfully!</h2>
                <p>Hi {supervisor.name},</p>
                <p>Your course <strong>"{course.title}"</strong> has been successfully created!</p>

                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">Next steps:</h3>
                    <ul style="margin: 0;">
                        <li>Add modules and learning content</li>
                        <li>Set prerequisites and learning objectives</li>
                        <li>Publish your course when ready</li>
                    </ul>
                </div>

                <p>Manage your course in the supervisor dashboard.</p>
                <p>Best regards,<br>The SkillBridge Team</p>
            </div>
        </body>
    </html>
    """

    send_email(subject, supervisor.email, text_body, html_body)


def send_account_status_email(user, is_active):
    """Send email when account is suspended or activated"""
    subject = f"Account {'Activated' if is_active else 'Suspended'} - SkillBridge"

    text_body = f"""
    Hi {user.name},

    {'Your account has been activated. You can now log in and access all features.' if is_active else 'Your account has been suspended. Please contact support for more information.'}

    Best regards,
    The SkillBridge Team
    """

    html_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: {'#16a34a' if is_active else '#dc2626'};">
                    Account {'Activated' if is_active else 'Suspended'}
                </h2>
                <p>Hi {user.name},</p>

                {f'<div style="background-color: #dcfce7; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #16a34a;"><p style="margin: 0;">Your account has been activated. You can now log in and access all features.</p></div>' if is_active else ''}

                {f'<div style="background-color: #fee2e2; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc2626;"><p style="margin: 0;">Your account has been suspended. Please contact support for more information.</p></div>' if not is_active else ''}

                <p>Best regards,<br>The SkillBridge Team</p>
            </div>
        </body>
    </html>
    """

    send_email(subject, user.email, text_body, html_body)
