from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from djongo import models
from pymongo import MongoClient

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Connect to MongoDB
        client = MongoClient('localhost', 27017)
        db = client['octofit_db']

        # Drop collections if they exist
        db.users.drop()
        db.teams.drop()
        db.activities.drop()
        db.leaderboard.drop()
        db.workouts.drop()

        # Create unique index on email for users
        db.users.create_index([('email', 1)], unique=True)

        # Sample users (superheroes)
        users = [
            {"name": "Clark Kent", "email": "superman@dc.com", "team": "DC"},
            {"name": "Bruce Wayne", "email": "batman@dc.com", "team": "DC"},
            {"name": "Diana Prince", "email": "wonderwoman@dc.com", "team": "DC"},
            {"name": "Tony Stark", "email": "ironman@marvel.com", "team": "Marvel"},
            {"name": "Steve Rogers", "email": "captain@marvel.com", "team": "Marvel"},
            {"name": "Natasha Romanoff", "email": "blackwidow@marvel.com", "team": "Marvel"},
        ]
        db.users.insert_many(users)

        # Sample teams
        teams = [
            {"name": "Marvel", "members": ["Tony Stark", "Steve Rogers", "Natasha Romanoff"]},
            {"name": "DC", "members": ["Clark Kent", "Bruce Wayne", "Diana Prince"]},
        ]
        db.teams.insert_many(teams)

        # Sample activities
        activities = [
            {"user": "Clark Kent", "activity": "Flight", "duration": 60},
            {"user": "Bruce Wayne", "activity": "Martial Arts", "duration": 45},
            {"user": "Tony Stark", "activity": "Weight Lifting", "duration": 30},
            {"user": "Steve Rogers", "activity": "Running", "duration": 50},
        ]
        db.activities.insert_many(activities)

        # Sample leaderboard
        leaderboard = [
            {"team": "Marvel", "points": 150},
            {"team": "DC", "points": 140},
        ]
        db.leaderboard.insert_many(leaderboard)

        # Sample workouts
        workouts = [
            {"name": "Super Strength", "suggested_for": ["Clark Kent", "Steve Rogers"]},
            {"name": "Stealth Training", "suggested_for": ["Bruce Wayne", "Natasha Romanoff"]},
        ]
        db.workouts.insert_many(workouts)

        self.stdout.write(self.style.SUCCESS('octofit_db database populated with test data.'))
