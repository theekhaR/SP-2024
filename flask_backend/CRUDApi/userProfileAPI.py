from flask import blueprints , jsonify, request
from datetime import datetime, timedelta
import uuid

from dataModel.userModel import db, User
from dataModel.userApplicationModel import UserApplication
from dataModel.userFollowingModel import UserFollowing
from dataModel.userProfileModel import UserProfile
from dataModel.listingApplicantMapping import ListingApplicantMapping

from AI.generativeUser import generateQueryFromURL

userProfileAPI = blueprints.Blueprint('userProfileAPI', __name__)


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

        # Check if user exists
        if not subject_user:
            return jsonify({'error': 'This user does not exist'}), 409

        #
        if 'portfolio' in data and (data.get('portfolio')):
            subject_user.Portfolio = data.get('portfolio')

        summary = generateQueryFromURL(subject_user.Portfolio)
        skill_list = [skill.strip() for skill in summary.split(',')]
        subject_user.PortfolioSummary = skill_list

        db.session.commit()
        return jsonify({'message': 'UserProfile updated successfully', 'UserID': subject_user.UserID}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500