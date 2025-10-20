"""
Seed script to create test users for each role
Run this script to populate the database with test accounts
"""

from app import create_app, db
from app.models.user import User
from app.models.learner import Learner
from app.models.company import Company
from app.models.supervisor import Supervisor

def seed_test_users():
    """Create test users for each role"""
    app = create_app()

    with app.app_context():
        print("🌱 Seeding test users...")

        # Check if users already exist
        if User.query.filter_by(email='admin@test.com').first():
            print("⚠️  Test users already exist. Skipping seed.")
            return

        test_users = [
            {
                'email': 'admin@test.com',
                'password': 'admin123',
                'name': 'Admin User',
                'role': 'admin'
            },
            {
                'email': 'learner@test.com',
                'password': 'learner123',
                'name': 'John Learner',
                'role': 'learner'
            },
            {
                'email': 'company@test.com',
                'password': 'company123',
                'name': 'Tech Corp',
                'role': 'company',
                'company_name': 'Tech Corp Inc.'
            },
            {
                'email': 'supervisor@test.com',
                'password': 'supervisor123',
                'name': 'Jane Supervisor',
                'role': 'supervisor'
            }
        ]

        for user_data in test_users:
            try:
                # Create user
                user = User(
                    email=user_data['email'],
                    password=user_data['password'],
                    name=user_data['name'],
                    role=user_data['role']
                )
                db.session.add(user)
                db.session.flush()

                # Create role-specific profile
                if user_data['role'] == 'learner':
                    learner = Learner(user_id=user.id)
                    db.session.add(learner)
                elif user_data['role'] == 'company':
                    company = Company(
                        user_id=user.id,
                        company_name=user_data.get('company_name', user_data['name'])
                    )
                    db.session.add(company)
                elif user_data['role'] == 'supervisor':
                    supervisor = Supervisor(user_id=user.id)
                    db.session.add(supervisor)

                db.session.commit()
                print(f"✅ Created {user_data['role']}: {user_data['email']} (password: {user_data['password']})")

            except Exception as e:
                db.session.rollback()
                print(f"❌ Failed to create {user_data['email']}: {str(e)}")

        print("\n📋 Test User Credentials:")
        print("=" * 60)
        print("Role        | Email              | Password")
        print("-" * 60)
        print("Admin       | admin@test.com     | admin123")
        print("Learner     | learner@test.com   | learner123")
        print("Company     | company@test.com   | company123")
        print("Supervisor  | supervisor@test.com| supervisor123")
        print("=" * 60)
        print("\n✨ Seeding complete!")

if __name__ == '__main__':
    seed_test_users()
