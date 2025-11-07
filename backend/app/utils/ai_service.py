"""
AI Service Module
Provides AI-powered features for the SkillBridge platform
"""

from flask import current_app
from typing import List, Dict, Any
import re
from datetime import datetime
from sqlalchemy import and_, or_, func


class AIService:
    """AI-powered recommendation and matching service"""

    @staticmethod
    def calculate_skill_match_score(learner_skills: List[str], required_skills: List[str]) -> float:
        """
        Calculate match score between learner skills and required skills
        Returns a score between 0 and 100
        """
        if not required_skills:
            return 100.0

        if not learner_skills:
            return 0.0

        # Normalize skills to lowercase for comparison
        learner_skills_lower = [skill.lower().strip() for skill in learner_skills]
        required_skills_lower = [skill.lower().strip() for skill in required_skills]

        # Calculate exact matches
        exact_matches = sum(1 for skill in required_skills_lower if skill in learner_skills_lower)

        # Calculate partial matches (fuzzy matching)
        partial_matches = 0
        for req_skill in required_skills_lower:
            for learner_skill in learner_skills_lower:
                if req_skill != learner_skill:
                    # Check if skills are similar (e.g., "python" in "python3", "javascript" in "js")
                    if req_skill in learner_skill or learner_skill in req_skill:
                        partial_matches += 0.5
                        break

        total_matches = exact_matches + partial_matches
        match_percentage = (total_matches / len(required_skills_lower)) * 100

        return min(match_percentage, 100.0)

    @staticmethod
    def match_learners_to_task(task, learners) -> List[Dict[str, Any]]:
        """
        Match learners to a task based on their skills and experience
        Returns list of learners with match scores, sorted by best match
        """
        from app.models.learner import Learner

        matches = []
        required_skills = task.skills_required or []

        for learner in learners:
            learner_data = Learner.query.filter_by(user_id=learner.id).first()
            if not learner_data:
                continue

            learner_skills = learner_data.skills or []

            # Calculate skill match score
            skill_score = AIService.calculate_skill_match_score(learner_skills, required_skills)

            # Calculate experience bonus (based on completed tasks)
            from app.models.application import Application
            completed_tasks = Application.query.filter(
                and_(
                    Application.learner_id == learner.id,
                    Application.status == 'accepted'
                )
            ).count()

            experience_bonus = min(completed_tasks * 5, 20)  # Max 20% bonus

            # Calculate final score
            final_score = min(skill_score + experience_bonus, 100)

            matches.append({
                'learner_id': learner.id,
                'learner_name': learner.name,
                'learner_email': learner.email,
                'match_score': round(final_score, 1),
                'matched_skills': [skill for skill in learner_skills if skill.lower() in [s.lower() for s in required_skills]],
                'completed_tasks': completed_tasks
            })

        # Sort by match score descending
        matches.sort(key=lambda x: x['match_score'], reverse=True)

        return matches

    @staticmethod
    def get_course_recommendations(learner_id: int, limit: int = 5) -> List[Dict[str, Any]]:
        """
        Recommend courses to a learner based on:
        - Completed courses (suggest advanced courses in same category)
        - Skills (suggest courses that match their interests)
        - Popular courses in their field
        """
        from app.models.learner import Learner
        from app.models.course import Course, Enrollment
        from app import db

        learner = Learner.query.filter_by(user_id=learner_id).first()
        if not learner:
            return []

        # Get courses learner is already enrolled in
        enrolled_course_ids = [e.course_id for e in Enrollment.query.filter_by(learner_id=learner_id).all()]

        # Get learner's skills
        learner_skills = learner.skills or []

        # Get completed courses
        completed_courses = db.session.query(Course).join(Enrollment).filter(
            and_(
                Enrollment.learner_id == learner_id,
                Enrollment.status == 'completed'
            )
        ).all()

        completed_categories = [c.category for c in completed_courses]

        # Get available published courses (not enrolled)
        available_courses = Course.query.filter(
            and_(
                Course.status == 'published',
                ~Course.id.in_(enrolled_course_ids) if enrolled_course_ids else True
            )
        ).all()

        recommendations = []

        for course in available_courses:
            score = 0
            reasons = []

            # Category match (completed courses in same category)
            if course.category in completed_categories:
                score += 30
                reasons.append(f"You've completed courses in {course.category}")

            # Skill/interest match
            course_title_lower = course.title.lower()
            course_desc_lower = (course.description or '').lower()

            for skill in learner_skills:
                if skill.lower() in course_title_lower or skill.lower() in course_desc_lower:
                    score += 20
                    reasons.append(f"Matches your skill: {skill}")
                    break

            # Difficulty progression (suggest intermediate/advanced after beginner)
            if completed_courses:
                avg_completed_difficulty = sum([1 if c.difficulty == 'beginner' else 2 if c.difficulty == 'intermediate' else 3 for c in completed_courses]) / len(completed_courses)

                course_difficulty_value = 1 if course.difficulty == 'beginner' else 2 if course.difficulty == 'intermediate' else 3

                if course_difficulty_value > avg_completed_difficulty:
                    score += 25
                    reasons.append("Next level challenge for you")

            # Popularity bonus (based on enrollments)
            enrollment_count = Enrollment.query.filter_by(course_id=course.id).count()
            if enrollment_count > 10:
                score += 10
                reasons.append("Popular course")

            # Rating bonus
            if course.rating and course.rating >= 4.0:
                score += 10
                reasons.append("Highly rated")

            if score > 0:
                recommendations.append({
                    'course_id': course.id,
                    'title': course.title,
                    'category': course.category,
                    'difficulty': course.difficulty,
                    'rating': course.rating or 0,
                    'thumbnail': course.thumbnail,
                    'recommendation_score': score,
                    'reasons': reasons[:2]  # Top 2 reasons
                })

        # Sort by score and return top recommendations
        recommendations.sort(key=lambda x: x['recommendation_score'], reverse=True)

        return recommendations[:limit]

    @staticmethod
    def recommend_learners_to_company(company_id: int, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Recommend top-performing learners to a company based on:
        - Completed courses
        - Task completion rate
        - Skills match with company's posted tasks
        - Overall performance
        """
        from app.models.user import User
        from app.models.learner import Learner
        from app.models.enrollment import Enrollment
        from app.models.application import Application
        from app.models.task import Task
        from app import db

        # Get company's posted tasks to understand what skills they need
        company_tasks = Task.query.filter_by(company_id=company_id).all()
        company_required_skills = []
        for task in company_tasks:
            if task.skills_required:
                company_required_skills.extend(task.skills_required)

        # Remove duplicates
        company_required_skills = list(set([s.lower() for s in company_required_skills]))

        # Get all learners
        learners = User.query.filter_by(role='learner', is_active=True).all()

        recommendations = []

        for user in learners:
            learner = Learner.query.filter_by(user_id=user.id).first()
            if not learner:
                continue

            score = 0

            # Completed courses count
            completed_courses_count = Enrollment.query.filter(
                and_(
                    Enrollment.learner_id == user.id,
                    Enrollment.status == 'completed'
                )
            ).count()

            score += min(completed_courses_count * 5, 30)  # Max 30 points

            # Task completion rate
            total_applications = Application.query.filter_by(learner_id=user.id).count()
            accepted_applications = Application.query.filter(
                and_(
                    Application.learner_id == user.id,
                    Application.status == 'accepted'
                )
            ).count()

            if total_applications > 0:
                completion_rate = (accepted_applications / total_applications) * 100
                score += min(completion_rate * 0.3, 30)  # Max 30 points

            # Skills match
            learner_skills = learner.skills or []
            if company_required_skills:
                skill_match_score = AIService.calculate_skill_match_score(learner_skills, company_required_skills)
                score += skill_match_score * 0.4  # Max 40 points

            if score > 0:
                recommendations.append({
                    'learner_id': user.id,
                    'name': user.name,
                    'email': user.email,
                    'score': round(score, 1),
                    'completed_courses': completed_courses_count,
                    'completed_tasks': accepted_applications,
                    'skills': learner_skills[:5],  # Top 5 skills
                    'match_reason': 'Strong skill match' if skill_match_score > 70 else 'Good performance'
                })

        # Sort by score
        recommendations.sort(key=lambda x: x['score'], reverse=True)

        return recommendations[:limit]

    @staticmethod
    def evaluate_code_submission(code: str, language: str, task_description: str) -> Dict[str, Any]:
        """
        AI-powered code evaluation (simulated)
        In production, this would integrate with OpenAI, Claude, or CodeLlama
        """
        # Simple heuristic-based evaluation for demo
        score = 50  # Base score
        feedback = []

        # Check code length
        if len(code) < 50:
            feedback.append("Code seems too short. Consider adding more functionality.")
            score -= 10
        elif len(code) > 200:
            score += 10
            feedback.append("Good code length and detail.")

        # Check for common good practices
        if 'def ' in code or 'function ' in code or 'class ' in code:
            score += 10
            feedback.append("Good use of functions/classes.")

        if '#' in code or '//' in code or '"""' in code:
            score += 10
            feedback.append("Well-commented code.")

        if 'try' in code or 'catch' in code or 'except' in code:
            score += 10
            feedback.append("Good error handling.")

        # Check for language-specific patterns
        if language.lower() == 'python':
            if 'import ' in code:
                score += 5
                feedback.append("Proper use of imports.")

        if language.lower() in ['javascript', 'js']:
            if 'const ' in code or 'let ' in code:
                score += 5
                feedback.append("Modern JavaScript syntax.")

        # Cap score at 100
        score = min(score, 100)

        # Overall assessment
        if score >= 80:
            assessment = "Excellent"
        elif score >= 60:
            assessment = "Good"
        elif score >= 40:
            assessment = "Needs Improvement"
        else:
            assessment = "Poor"

        return {
            'score': score,
            'assessment': assessment,
            'feedback': feedback,
            'evaluated_at': datetime.utcnow().isoformat(),
            'note': 'This is an automated evaluation. Human review is recommended.'
        }

    @staticmethod
    def auto_update_portfolio(learner_id: int) -> bool:
        """
        Automatically update learner's portfolio when they complete a course or task
        """
        from app.models.learner import Learner
        from app.models.enrollment import Enrollment
        from app.models.application import Application
        from app.models.course import Course
        from app.models.task import Task
        from app import db

        learner = Learner.query.filter_by(user_id=learner_id).first()
        if not learner:
            return False

        # Get completed courses
        completed_courses = db.session.query(Course).join(Enrollment).filter(
            and_(
                Enrollment.learner_id == learner_id,
                Enrollment.status == 'completed'
            )
        ).all()

        # Get accepted tasks
        accepted_tasks = db.session.query(Task).join(Application).filter(
            and_(
                Application.learner_id == learner_id,
                Application.status == 'accepted'
            )
        ).all()

        # Build portfolio content
        portfolio_items = []

        # Add courses
        for course in completed_courses:
            portfolio_items.append({
                'type': 'course',
                'title': course.title,
                'category': course.category,
                'completed_at': datetime.utcnow().isoformat()
            })

        # Add tasks
        for task in accepted_tasks:
            portfolio_items.append({
                'type': 'task',
                'title': task.title,
                'category': task.category,
                'completed_at': datetime.utcnow().isoformat()
            })

        # Extract skills from completed items
        all_skills = set()
        for course in completed_courses:
            if course.category:
                all_skills.add(course.category)
        for task in accepted_tasks:
            if task.skills_required:
                all_skills.update(task.skills_required)

        # Update learner profile
        if not learner.skills:
            learner.skills = []

        # Merge new skills with existing
        existing_skills_lower = [s.lower() for s in learner.skills]
        for skill in all_skills:
            if skill.lower() not in existing_skills_lower:
                learner.skills.append(skill)

        db.session.commit()

        return True
