from flask import blueprints , jsonify, request
from datetime import datetime, timedelta
import uuid

from dataModel.userModel import db, User
from dataModel.userApplicationModel import UserApplication
from dataModel.userFollowingModel import UserFollowing
from dataModel.userProfileModel import UserProfile
from dataModel.listingApplicantMapping import ListingApplicantMapping
from dataModel.userCareerPathModel import UserCareerPath

from AI.generativeUser import generateQueryFromURL
from AI.generativeCareerCompass import generate_recommendation, generate_AIgenerative_career_path
from openai import OpenAI
from sqlalchemy.dialects.postgresql import ARRAY
from flask.cli import load_dotenv
import os



userCareerPathAPI = blueprints.Blueprint('userCareerPathAPI', __name__)

# === CONFIGURATION ===
load_dotenv()
OPENAI_API_KEY = os.getenv('openai_key')
#OPENAI_API_KEY =

# === INITIALIZE OPENAI ===
openai = OpenAI(api_key=OPENAI_API_KEY)

@userCareerPathAPI.route('/generate_career_path', methods=['POST'])
def generate_career_path():
    user_id = request.args.get('userID')
    if not user_id:
        return jsonify({'error': 'Missing required field userID'}), 400

    profile = UserProfile.query.filter_by(UserID=user_id).first()

    if not profile or not profile.PortfolioSummary:
        return jsonify({'error': 'This user does not exists or currently does not have a summarization of skill.'}), 409

    UserCareerPath.query.filter_by(UserID=user_id).delete()
    db.session.commit()

    possible_career = generate_recommendation(profile.PortfolioSummary)
    career_list = [career.strip() for career in possible_career.split(',') if career.strip()]

    created_paths = []
    for career_name in career_list:
        # Optional: Check if the career already exists for the user
        existing = UserCareerPath.query.filter_by(UserID=user_id, CareerName=career_name).first()
        if existing:
            print(f"Skipping already existing career path: {career_name}")
            continue
        explanation = generate_AIgenerative_career_path(profile.PortfolioSummary, career_name)

        career_path_entry = UserCareerPath(
            UserID=user_id,
            CareerName=career_name,
            Explanation=explanation
        )
        db.session.add(career_path_entry)
        created_paths.append(career_name)

    db.session.commit()
    return jsonify({'created_career_paths': created_paths}), 200

@userCareerPathAPI.route('/get_career_path', methods=['GET'])
def get_user_career_paths():
    user_id = request.args.get('userID')
    if not user_id:
        return jsonify({'error': 'Missing required field userID'}), 400

    # Validate the user exists
    profile = UserProfile.query.filter_by(UserID=user_id).first()
    if not profile:
        return jsonify({'error': 'This user does not exist'}), 409

    # Fetch all career paths for this user
    career_paths = UserCareerPath.query.filter_by(UserID=user_id).all()
    print(f"Found {len(career_paths)} career paths.")

    result = [
        {
            "career_name": path.CareerName,
            "explanation": path.Explanation
        }
        for path in career_paths
    ]

    return jsonify(result), 200

@userCareerPathAPI.route('/delete_career_paths', methods=['DELETE'])
def delete_user_career_paths():
    user_id = request.args.get('userID')
    if not user_id:
        return jsonify({'error': 'Missing required field userID'}), 400

    # Check if user exists
    profile = UserProfile.query.filter_by(UserID=user_id).first()
    if not profile:
        return jsonify({'error': 'This user does not exist'}), 409

    # Delete all career paths for this user
    deleted_count = UserCareerPath.query.filter_by(UserID=user_id).delete()
    db.session.commit()

    return jsonify({
        'message': f'Deleted {deleted_count} career path(s) for user {user_id}.'
    }), 200