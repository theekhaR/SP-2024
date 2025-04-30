from flask import blueprints , jsonify, request
from datetime import datetime, timedelta
import uuid

from dataModel.userModel import db, User
from dataModel.userApplicationModel import UserApplication
from dataModel.userFollowingModel import UserFollowing
from dataModel.userProfileModel import UserProfile
from dataModel.listingApplicantMapping import ListingApplicantMapping

from AI.generativeUser import generateQueryFromURL
from openai import OpenAI
from sqlalchemy.dialects.postgresql import ARRAY
from flask.cli import load_dotenv
import os

userProfileAPI = blueprints.Blueprint('userProfileAPI', __name__)

# === CONFIGURATION ===
load_dotenv()
OPENAI_API_KEY = os.getenv('openai_key')
#OPENAI_API_KEY =

# === INITIALIZE OPENAI ===
openai = OpenAI(api_key=OPENAI_API_KEY)

def generate_embedding(text):
    """Generate an embedding using OpenAI"""
    response = openai.embeddings.create(
        input=text,
        model="text-embedding-ada-002"
    )
    print("\ngenerated embedding")
    return response.data[0].embedding


@userProfileAPI.route('/edit_user_profile', methods=['PATCH'])
def edit_user_profile():
    try:
        data = request.get_json()

        # check if required field is included (OFTEN THE PRIMARY KEY)
        if (not data or 'userID' not in data or not data.get('userID')):
            return jsonify({'error': 'Missing userID'}), 400

        update_userID = data.get('userID')
        subject_user = UserProfile.query.filter_by(UserID=update_userID).first()

        # Check if user exists
        if not subject_user:
            return jsonify({'error': 'This user does not exist'}), 409

        #
        if 'DoBYear' in data and data.get('DoBYear') and 'DoBMonth' in data and data.get('DoBMonth') and 'DoBDay' in data and data.get('DoBDay'):
            year = int(data['DoBYear'])
            month = int(data['DoBMonth'])
            day = int(data['DoBDay'])
            subject_user.DoB = datetime(year, month, day)
        if 'sex' in data and data.get('sex'):
            try:
                subject_user.Sex = int(data['sex'])
            except ValueError:
                raise ValueError("Invalid value for 'sex'. Must be an integer.")
        if 'phone' in data and (data.get('phone')):
            subject_user.Phone = data.get('phone')
        if 'about' in data and (data.get('about')):
            subject_user.About = data.get('about')
        if 'CV' in data and (data.get('CV')):
            subject_user.CV = data.get('CV')
        if 'portfolio' in data and (data.get('portfolio')):
            subject_user.portfolio = data.get('portfolio')

        db.session.commit()
        return jsonify({'message': 'UserProfile updated successfully', 'UserID': subject_user.UserID}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@userProfileAPI.route('/update_portfolio', methods=['PATCH'])
def update_portfolio():
    try:
        data = request.get_json()

        # check if required field is included (OFTEN THE PRIMARY KEY)
        if (not data or
                'userID' not in data or not data.get('userID') or
                'portfolio' not in data or not data.get('portfolio')):
            return jsonify({'error': 'Missing userID'}), 400

        update_userID = data.get('userID')
        subject_user = UserProfile.query.filter_by(UserID=update_userID).first()

        print("=======================================\n")
        print(data.get('portfolio'))
        print("=======================================\n")
        # Check if user exists
        if not subject_user:
            return jsonify({'error': 'This user does not exist'}), 409

        #
        if 'portfolio' in data and (data.get('portfolio')):
            subject_user.Portfolio = data.get('portfolio')

        summary = generateQueryFromURL(subject_user.Portfolio)
        skill_list = [skill.strip() for skill in summary.split(',')]
        subject_user.PortfolioSummary = skill_list
        print(subject_user.PortfolioSummary)

        summary_text_for_embedding = '\n'.join(skill_list)
        embedding_vector = generate_embedding(summary_text_for_embedding)
        subject_user.profile_embedding = embedding_vector

        db.session.commit()
        return jsonify({'message': 'UserProfile updated successfully', 'UserID': subject_user.UserID}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@userProfileAPI.route('/get_user_profile', methods=['GET'])
def get_user_profile():
    user_id = request.args.get('userID')
    if not user_id:
        return jsonify({'error': 'Missing required field userID'}), 400

    profile = UserProfile.query.filter_by(UserID=user_id).first()

    if not profile:
        return jsonify({'error': 'This user does not exists or do not have a following'}), 409

    profile_json = {
            "DoB": profile.DoB,
            "sex": profile.Sex,
            "phone": profile.Phone,
            "about": profile.About,
            "CV": profile.CV,
            "portfolio": profile.Portfolio,
            "portfolioSummary": profile.PortfolioSummary
        }

    return jsonify(profile_json)

@userProfileAPI.route('/get_portfolio', methods=['GET'])
def get_portfolio():
    user_id = request.args.get('userID')
    if not user_id:
        return jsonify({'error': 'Missing required field userID'}), 400

    profile = UserProfile.query.filter_by(UserID=user_id).first()

    if not profile:
        return jsonify({'error': 'This user does not exists or do not have a following'}), 409

    profile_json = {
            "CV": profile.CV,
            "portfolio": profile.Portfolio,
        }

    print(profile_json)

    return jsonify(profile_json)