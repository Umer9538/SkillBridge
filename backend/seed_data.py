"""
Seed script to populate the database with sample data
Run this script to add demo users, courses, tasks, and other data
"""

from app import create_app, db
from app.models import (
    User, Learner, Company, Supervisor,
    Course, Module, Task, Notification, Enrollment, Application
)
from datetime import datetime, timedelta

def clear_database():
    """Clear all data from the database"""
    print("Clearing existing data...")
    db.drop_all()
    db.create_all()
    print("Database cleared and recreated!")

def create_users():
    """Create sample users for each role"""
    print("Creating users...")

    users = []

    # Create Learners
    learner1 = User(
        email='learner@skillbridge.com',
        password='password123',
        name='Alice Johnson',
        role='learner'
    )
    db.session.add(learner1)
    db.session.flush()

    learner1_profile = Learner(
        user_id=learner1.id,
        skills=['Python', 'JavaScript', 'React'],
        bio='Passionate about web development and learning new technologies.',
        location='New York, USA',
        education=[
            {'degree': 'BS Computer Science', 'institution': 'MIT', 'year': '2022'}
        ]
    )
    db.session.add(learner1_profile)
    users.append(learner1)

    learner2 = User(
        email='john@example.com',
        password='password123',
        name='John Doe',
        role='learner'
    )
    db.session.add(learner2)
    db.session.flush()

    learner2_profile = Learner(
        user_id=learner2.id,
        skills=['Data Analysis', 'SQL', 'Python'],
        bio='Data enthusiast looking to gain practical experience.',
        location='San Francisco, USA'
    )
    db.session.add(learner2_profile)
    users.append(learner2)

    # Create Companies
    company1 = User(
        email='company@techcorp.com',
        password='password123',
        name='Sarah Smith',
        role='company'
    )
    db.session.add(company1)
    db.session.flush()

    company1_profile = Company(
        user_id=company1.id,
        company_name='TechCorp Solutions',
        industry='Software Development',
        description='Leading software development company specializing in web applications.',
        website='https://techcorp.example.com',
        location='San Francisco, CA',
        size='51-200'
    )
    db.session.add(company1_profile)
    users.append(company1)

    company2 = User(
        email='hr@datainc.com',
        password='password123',
        name='Mike Chen',
        role='company'
    )
    db.session.add(company2)
    db.session.flush()

    company2_profile = Company(
        user_id=company2.id,
        company_name='DataInc Analytics',
        industry='Data Analytics',
        description='Data analytics firm helping businesses make data-driven decisions.',
        website='https://datainc.example.com',
        location='New York, NY',
        size='11-50'
    )
    db.session.add(company2_profile)
    users.append(company2)

    # Create Supervisors
    supervisor1 = User(
        email='supervisor@university.edu',
        password='password123',
        name='Dr. Emily Brown',
        role='supervisor'
    )
    db.session.add(supervisor1)
    db.session.flush()

    supervisor1_profile = Supervisor(
        user_id=supervisor1.id,
        specialization='Computer Science',
        affiliation='Stanford University',
        bio='Professor of Computer Science with 15 years of teaching experience.',
        expertise_areas=['Programming', 'Web Development', 'Data Structures']
    )
    db.session.add(supervisor1_profile)
    users.append(supervisor1)

    supervisor2 = User(
        email='prof.davis@mit.edu',
        password='password123',
        name='Prof. David Davis',
        role='supervisor'
    )
    db.session.add(supervisor2)
    db.session.flush()

    supervisor2_profile = Supervisor(
        user_id=supervisor2.id,
        specialization='Data Science',
        affiliation='MIT',
        bio='Data Science expert passionate about teaching practical skills.',
        expertise_areas=['Data Analysis', 'Machine Learning', 'Statistics']
    )
    db.session.add(supervisor2_profile)
    users.append(supervisor2)

    # Create Admin
    admin = User(
        email='admin@skillbridge.com',
        password='password123',
        name='Admin User',
        role='admin'
    )
    db.session.add(admin)
    users.append(admin)

    db.session.commit()
    print(f"Created {len(users)} users!")
    return users

def create_courses():
    """Create sample courses"""
    print("Creating courses...")

    supervisor1 = Supervisor.query.first()
    supervisor2 = Supervisor.query.all()[1] if len(Supervisor.query.all()) > 1 else supervisor1

    courses = []

    # Course 1: Web Development
    course1 = Course(
        title='Full Stack Web Development',
        description='Learn to build modern web applications from scratch using React and Node.js. This comprehensive course covers frontend and backend development.',
        category='Programming',
        difficulty='Intermediate',
        duration=40,
        supervisor_id=supervisor1.id,
        status='published',
        prerequisites=[],
        learning_objectives=[
            'Build responsive web interfaces with React',
            'Create RESTful APIs with Node.js',
            'Understand database design and integration',
            'Deploy applications to the cloud'
        ]
    )
    db.session.add(course1)
    db.session.flush()

    # Add modules to course 1
    modules1 = [
        Module(
            course_id=course1.id,
            title='Introduction to Web Development',
            description='Overview of modern web development technologies and tools',
            content_type='video',
            content_url='https://example.com/intro-video',
            order=1,
            duration=30,
            is_preview=True
        ),
        Module(
            course_id=course1.id,
            title='HTML & CSS Fundamentals',
            description='Learn the building blocks of web pages',
            content_type='video',
            content_url='https://example.com/html-css-video',
            order=2,
            duration=45
        ),
        Module(
            course_id=course1.id,
            title='JavaScript Basics',
            description='Master JavaScript programming fundamentals',
            content_type='video',
            content_url='https://example.com/js-basics-video',
            order=3,
            duration=60
        ),
        Module(
            course_id=course1.id,
            title='React Fundamentals',
            description='Build interactive UIs with React',
            content_type='video',
            content_url='https://example.com/react-video',
            order=4,
            duration=90
        ),
        Module(
            course_id=course1.id,
            title='Backend with Node.js',
            description='Create server-side applications',
            content_type='video',
            content_url='https://example.com/nodejs-video',
            order=5,
            duration=75
        )
    ]
    for module in modules1:
        db.session.add(module)
    courses.append(course1)

    # Course 2: Data Analysis
    course2 = Course(
        title='Data Analysis with Python',
        description='Master data analysis using Python, pandas, and visualization libraries. Perfect for aspiring data analysts.',
        category='Data Analysis',
        difficulty='Beginner',
        duration=30,
        supervisor_id=supervisor2.id,
        status='published',
        prerequisites=[],
        learning_objectives=[
            'Clean and manipulate data with pandas',
            'Create stunning visualizations',
            'Perform statistical analysis',
            'Work with real-world datasets'
        ]
    )
    db.session.add(course2)
    db.session.flush()

    modules2 = [
        Module(
            course_id=course2.id,
            title='Introduction to Data Analysis',
            description='What is data analysis and why it matters',
            content_type='video',
            content_url='https://example.com/data-intro',
            order=1,
            duration=25,
            is_preview=True
        ),
        Module(
            course_id=course2.id,
            title='Python for Data Analysis',
            description='Essential Python skills for data work',
            content_type='video',
            content_url='https://example.com/python-data',
            order=2,
            duration=50
        ),
        Module(
            course_id=course2.id,
            title='Working with Pandas',
            description='Data manipulation with pandas library',
            content_type='video',
            content_url='https://example.com/pandas',
            order=3,
            duration=60
        ),
        Module(
            course_id=course2.id,
            title='Data Visualization',
            description='Create charts and graphs with matplotlib and seaborn',
            content_type='video',
            content_url='https://example.com/viz',
            order=4,
            duration=45
        )
    ]
    for module in modules2:
        db.session.add(module)
    courses.append(course2)

    # Course 3: UX/UI Design
    course3 = Course(
        title='UX/UI Design Fundamentals',
        description='Learn the principles of user experience and interface design. Create beautiful, user-friendly designs.',
        category='UX/UI Design',
        difficulty='Beginner',
        duration=25,
        supervisor_id=supervisor1.id,
        status='published',
        prerequisites=[],
        learning_objectives=[
            'Understand UX design principles',
            'Create wireframes and prototypes',
            'Design user interfaces in Figma',
            'Conduct user research'
        ]
    )
    db.session.add(course3)
    db.session.flush()

    modules3 = [
        Module(
            course_id=course3.id,
            title='Introduction to UX Design',
            description='Fundamentals of user experience',
            content_type='video',
            content_url='https://example.com/ux-intro',
            order=1,
            duration=30,
            is_preview=True
        ),
        Module(
            course_id=course3.id,
            title='User Research Methods',
            description='Learn how to understand your users',
            content_type='video',
            content_url='https://example.com/user-research',
            order=2,
            duration=40
        ),
        Module(
            course_id=course3.id,
            title='Wireframing and Prototyping',
            description='Create low and high-fidelity prototypes',
            content_type='video',
            content_url='https://example.com/wireframes',
            order=3,
            duration=50
        ),
        Module(
            course_id=course3.id,
            title='UI Design with Figma',
            description='Design beautiful interfaces',
            content_type='video',
            content_url='https://example.com/figma',
            order=4,
            duration=60
        )
    ]
    for module in modules3:
        db.session.add(module)
    courses.append(course3)

    # Course 4: Cybersecurity
    course4 = Course(
        title='Introduction to Cybersecurity',
        description='Learn the basics of cybersecurity, including network security, encryption, and ethical hacking.',
        category='Cybersecurity',
        difficulty='Intermediate',
        duration=35,
        supervisor_id=supervisor1.id,
        status='published',
        prerequisites=[],
        learning_objectives=[
            'Understand security fundamentals',
            'Identify common vulnerabilities',
            'Implement security best practices',
            'Perform basic penetration testing'
        ]
    )
    db.session.add(course4)
    db.session.flush()

    modules4 = [
        Module(
            course_id=course4.id,
            title='Cybersecurity Basics',
            description='Introduction to security concepts',
            content_type='video',
            content_url='https://example.com/security-basics',
            order=1,
            duration=35,
            is_preview=True
        ),
        Module(
            course_id=course4.id,
            title='Network Security',
            description='Securing network infrastructure',
            content_type='video',
            content_url='https://example.com/network-sec',
            order=2,
            duration=55
        ),
        Module(
            course_id=course4.id,
            title='Encryption and Cryptography',
            description='Understanding encryption methods',
            content_type='video',
            content_url='https://example.com/crypto',
            order=3,
            duration=45
        )
    ]
    for module in modules4:
        db.session.add(module)
    courses.append(course4)

    db.session.commit()
    print(f"Created {len(courses)} courses with modules!")
    return courses

def create_tasks():
    """Create sample tasks"""
    print("Creating tasks...")

    companies = Company.query.all()
    company1 = companies[0]
    company2 = companies[1] if len(companies) > 1 else company1

    tasks = []

    # Task 1
    task1 = Task(
        company_id=company1.id,
        title='Build a Responsive Landing Page',
        description='Create a modern, responsive landing page for our new product using React and Tailwind CSS. The page should include a hero section, features section, and contact form.',
        category='Programming',
        difficulty='Beginner',
        skills_required=['HTML', 'CSS', 'React', 'Tailwind CSS'],
        estimated_hours=15,
        deadline=datetime.utcnow() + timedelta(days=30),
        status='active',
        requirements='Must be responsive on all devices, follow our brand guidelines, and include animations.',
        deliverables='GitHub repository with source code, deployed demo link, documentation.',
        max_applicants=5
    )
    db.session.add(task1)
    tasks.append(task1)

    # Task 2
    task2 = Task(
        company_id=company1.id,
        title='API Integration Project',
        description='Integrate third-party payment API into our existing application. Need someone familiar with REST APIs and Node.js.',
        category='Programming',
        difficulty='Intermediate',
        skills_required=['Node.js', 'JavaScript', 'REST APIs', 'Express'],
        estimated_hours=25,
        deadline=datetime.utcnow() + timedelta(days=45),
        status='active',
        requirements='Experience with payment gateways, secure coding practices, error handling.',
        deliverables='Working integration, test cases, API documentation.',
        max_applicants=3
    )
    db.session.add(task2)
    tasks.append(task2)

    # Task 3
    task3 = Task(
        company_id=company2.id,
        title='Sales Data Analysis Dashboard',
        description='Analyze our sales data from the past year and create an interactive dashboard with insights and visualizations.',
        category='Data Analysis',
        difficulty='Intermediate',
        skills_required=['Python', 'Pandas', 'Data Visualization', 'SQL'],
        estimated_hours=20,
        deadline=datetime.utcnow() + timedelta(days=21),
        status='active',
        requirements='Experience with pandas, matplotlib/seaborn, ability to derive business insights.',
        deliverables='Jupyter notebook with analysis, interactive dashboard, presentation of findings.',
        max_applicants=4
    )
    db.session.add(task3)
    tasks.append(task3)

    # Task 4
    task4 = Task(
        company_id=company2.id,
        title='Customer Behavior Analysis',
        description='Study customer behavior patterns using our e-commerce data and provide actionable recommendations.',
        category='Data Analysis',
        difficulty='Advanced',
        skills_required=['Python', 'Machine Learning', 'Statistics', 'SQL'],
        estimated_hours=30,
        deadline=datetime.utcnow() + timedelta(days=60),
        status='active',
        requirements='Strong statistical background, experience with customer analytics, ML knowledge.',
        deliverables='Detailed report, predictive models, visualization dashboard.',
        max_applicants=2
    )
    db.session.add(task4)
    tasks.append(task4)

    # Task 5
    task5 = Task(
        company_id=company1.id,
        title='Mobile App UI/UX Design',
        description='Design a modern, user-friendly interface for our mobile fitness tracking app.',
        category='UX/UI Design',
        difficulty='Intermediate',
        skills_required=['Figma', 'UI Design', 'UX Research', 'Mobile Design'],
        estimated_hours=18,
        deadline=datetime.utcnow() + timedelta(days=25),
        status='active',
        requirements='Portfolio with mobile designs, proficiency in Figma, understanding of iOS/Android guidelines.',
        deliverables='Figma design files, interactive prototype, design system documentation.',
        max_applicants=3
    )
    db.session.add(task5)
    tasks.append(task5)

    # Task 6
    task6 = Task(
        company_id=company2.id,
        title='Security Audit Report',
        description='Conduct a security audit of our web application and provide a detailed report with recommendations.',
        category='Cybersecurity',
        difficulty='Advanced',
        skills_required=['Penetration Testing', 'Security Auditing', 'OWASP', 'Network Security'],
        estimated_hours=35,
        deadline=datetime.utcnow() + timedelta(days=40),
        status='active',
        requirements='Certified in security (CEH/OSCP preferred), experience with security tools, ethical hacking skills.',
        deliverables='Comprehensive security audit report, vulnerability assessment, remediation plan.',
        max_applicants=2
    )
    db.session.add(task6)
    tasks.append(task6)

    db.session.commit()
    print(f"Created {len(tasks)} tasks!")
    return tasks

def create_enrollments():
    """Create sample course enrollments"""
    print("Creating enrollments...")

    learners = User.query.filter_by(role='learner').all()
    courses = Course.query.all()

    if not learners or not courses:
        print("No learners or courses found!")
        return []

    enrollments = []

    # Learner 1 enrolls in courses
    learner1 = learners[0]

    # Enroll in Course 1 (in progress)
    enrollment1 = Enrollment(
        learner_id=learner1.id,
        course_id=courses[0].id,
        status='active'
    )
    db.session.add(enrollment1)
    db.session.flush()

    # Mark some modules as complete
    modules = Module.query.filter_by(course_id=courses[0].id).order_by(Module.order).all()
    if len(modules) >= 2:
        enrollment1.progress[modules[0].id] = True
        enrollment1.progress[modules[1].id] = True

    enrollments.append(enrollment1)

    # Enroll in Course 2 (recently started)
    enrollment2 = Enrollment(
        learner_id=learner1.id,
        course_id=courses[1].id,
        status='active'
    )
    db.session.add(enrollment2)
    enrollments.append(enrollment2)

    # Enroll in Course 3
    enrollment3 = Enrollment(
        learner_id=learner1.id,
        course_id=courses[2].id,
        status='active'
    )
    db.session.add(enrollment3)
    enrollments.append(enrollment3)

    db.session.commit()
    print(f"Created {len(enrollments)} enrollments!")
    return enrollments

def create_applications():
    """Create sample task applications"""
    print("Creating applications...")

    learners = User.query.filter_by(role='learner').all()
    tasks = Task.query.all()

    if not learners or not tasks:
        print("No learners or tasks found!")
        return []

    applications = []

    # Learner 1 applies to tasks
    learner1 = learners[0]

    # Application 1 - Pending
    app1 = Application(
        learner_id=learner1.id,
        task_id=tasks[0].id,
        cover_letter='I am excited to work on this landing page project. I have 2 years of experience with React and Tailwind CSS, and have built several responsive websites. I can start immediately and deliver within the deadline.',
        status='pending'
    )
    db.session.add(app1)
    applications.append(app1)

    # Application 2 - Accepted, ready to submit
    app2 = Application(
        learner_id=learner1.id,
        task_id=tasks[2].id,
        cover_letter='I have strong experience in data analysis using Python and Pandas. I have worked on similar sales analysis projects and can provide valuable insights from your data.',
        status='accepted'
    )
    db.session.add(app2)
    applications.append(app2)

    # Application 3 - Submitted, awaiting evaluation
    app3 = Application(
        learner_id=learner1.id,
        task_id=tasks[1].id,
        cover_letter='I have integrated payment APIs in multiple projects using Node.js. I am familiar with Stripe and PayPal integrations.',
        status='submitted',
        submission_url='https://github.com/learner/payment-integration',
        submission_notes='Implemented secure payment integration with Stripe API. All test cases are passing. Documentation included in the README.',
        submitted_at=datetime.utcnow() - timedelta(days=2)
    )
    db.session.add(app3)
    applications.append(app3)

    # Application 4 - Completed with evaluation
    app4 = Application(
        learner_id=learner1.id,
        task_id=tasks[4].id,
        cover_letter='I am a UX/UI designer with 3 years of experience. I have designed multiple mobile apps and have a strong portfolio.',
        status='completed',
        submission_url='https://www.figma.com/file/mobile-fitness-app',
        submission_notes='Complete UI/UX design for the fitness tracking app with interactive prototype.',
        submitted_at=datetime.utcnow() - timedelta(days=10)
    )
    db.session.add(app4)
    applications.append(app4)

    # Application 5 - In Progress
    app5 = Application(
        learner_id=learner1.id,
        task_id=tasks[3].id,
        cover_letter='I have a background in statistics and machine learning. I can analyze customer behavior and provide actionable recommendations.',
        status='in_progress'
    )
    db.session.add(app5)
    applications.append(app5)

    db.session.commit()
    print(f"Created {len(applications)} applications!")
    return applications

def create_notifications():
    """Create sample notifications"""
    print("Creating notifications...")

    learner = User.query.filter_by(role='learner').first()

    notifications = [
        Notification(
            user_id=learner.id,
            type='system',
            title='Welcome to SkillBridge!',
            message='Start your learning journey by exploring our courses and tasks.',
            link='/learner/courses'
        ),
        Notification(
            user_id=learner.id,
            type='course',
            title='New Course Available',
            message='Check out our new Full Stack Web Development course!',
            link='/learner/courses'
        ),
        Notification(
            user_id=learner.id,
            type='task',
            title='New Tasks Posted',
            message='5 new tasks match your skills. Apply now!',
            link='/learner/tasks'
        ),
        Notification(
            user_id=learner.id,
            type='task',
            title='Application Accepted!',
            message='Your application for Sales Data Analysis Dashboard has been accepted. Start working on it!',
            link='/learner/applications',
            read=False
        )
    ]

    for notif in notifications:
        db.session.add(notif)

    db.session.commit()
    print(f"Created {len(notifications)} notifications!")

def seed_all():
    """Run all seed functions"""
    print("\n" + "="*50)
    print("SKILLBRIDGE DATABASE SEEDING")
    print("="*50 + "\n")

    clear_database()
    create_users()
    create_courses()
    create_tasks()
    create_enrollments()
    create_applications()
    create_notifications()

    print("\n" + "="*50)
    print("SEEDING COMPLETED SUCCESSFULLY!")
    print("="*50)
    print("\nTest Credentials:")
    print("-" * 50)
    print("Learner:     learner@skillbridge.com / password123")
    print("Company:     company@techcorp.com / password123")
    print("Supervisor:  supervisor@university.edu / password123")
    print("Admin:       admin@skillbridge.com / password123")
    print("-" * 50)
    print("\n📚 Sample Data Created:")
    print("-" * 50)
    print("✓ 4 Courses with modules")
    print("✓ 6 Tasks from companies")
    print("✓ 3 Course enrollments")
    print("✓ 5 Task applications (various statuses)")
    print("✓ Notifications")
    print("-" * 50)
    print("\nYou can now login and explore the platform!\n")

if __name__ == '__main__':
    app = create_app('development')
    with app.app_context():
        seed_all()
