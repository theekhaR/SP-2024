import os
import uuid

from flask import blueprints , jsonify, request
from datetime import datetime, timedelta

# from .__init__ import supabase_client
from dataModel.__init__ import db
from dataModel.companyModel import Company
from dataModel.userModel import User
from dataModel.userApplicationModel import UserApplication
from dataModel.userBookmarkModel import UserBookmark
from dataModel.userEducationModel import UserEducation
from dataModel.userExperienceModel import UserExperience
from dataModel.userFollowingModel import UserFollowing
from dataModel.userProfileModel import UserProfile
from dataModel.userSkillModel import UserSkill

userAPI = blueprints.Blueprint('userAPI', __name__)

# region User Table -------------------------------------------------------------------------------------------------------------------------------------
@userAPI.route('/get_all_users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    users_list = [{'ID': user.UserID, 'name': user.UserFirstName, 'email': user.UserEmail} for user in users]
    return jsonify(users_list)

@userAPI.route('/check_if_user_email_exists', methods=['GET'])
def check_if_user_email_exists():
    user_email = request.args.get('userEmail')
    if not user_email:
        return jsonify({'error': 'Missing userEmail'}), 400

    existing_user = User.query.filter_by(UserEmail=user_email).first()
    if existing_user:
        return jsonify({'error': 'User with this email already exists'}), 409

    return jsonify({'message': 'No User with this Email'}), 200

@userAPI.route('/create_user', methods=['POST'])
def create_user():
    try:
        data = request.get_json()

        #check if all none nullable field contains null or empty string
        if (not data or
                'userEmail' not in data or not data.get('userEmail') or
                'userPassword' not in data or not data.get('userPassword') or
                'userFirstName' not in data or not data.get('userFirstName') or
                'userLastName' not in data or not data.get('userLastName')):
            return jsonify({'error': 'Missing required fields'}), 400

        # Check if user already exists
        existing_user = User.query.filter_by(UserEmail=data['userEmail']).first()
        if existing_user:
            return jsonify({'error': 'User with this email already exists'}), 409

        new_user = User(
            UserID=str(uuid.uuid4()),  # Generate a unique ID
            UserFirstName=data.get('userFirstName' if data.get('userFirstName') else None), #Set to NULL so that if the validator doesn't detect it does not goes into the database
            UserLastName=data.get('userLastName'if data.get('userLastName') else None),
            UserPassword=data.get('userPassword'if data.get('userPassword') else None),
            UserEmail=data.get('userEmail' if data.get('userEmail') else None),
            UserPicURL=data.get('userPicURL', None),
            AccountType=int(data.get('accountType', 1)), #They could not choose either way
            Validated=bool(data.get('validated', False)),
            Company=data.get('company', None),
            CreatedOn=datetime.now(),
            IsActive=True
        )
        db.session.add(new_user)
        db.session.flush()

        new_usereducation_entry = UserEducation(
            UserID=new_user.UserID
        )
        db.session.add(new_usereducation_entry)
        db.session.flush()

        new_userexperience_entry = UserExperience(
            UserID=new_user.UserID
        )
        db.session.add(new_userexperience_entry)
        db.session.flush()

        new_userprofile_entry = UserProfile(
            UserID=new_user.UserID
        )
        db.session.add(new_userprofile_entry)
        db.session.flush()

        new_userskill_entry = UserSkill(
            UserID=new_user.UserID
        )
        db.session.add(new_userskill_entry)
        db.session.commit()

        return jsonify({'message': 'User created successfully', 'UserID': new_user.UserID}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@userAPI.route('/create_subsequence_tables', methods=['POST'])
def create_subsequence_tables():
    try:
        data = request.get_json()

        #check if all none nullable field contains null or empty string
        if (not data or
                'userID' not in data or not data.get('userID')):
            return jsonify({'error': 'Missing userID to create subsequence tables'}), 400

        new_usereducation_entry = UserEducation(
            UserID=data.get('userID')
        )
        db.session.add(new_usereducation_entry)
        db.session.flush()

        new_userexperience_entry = UserExperience(
            UserID=data.get('userID')
        )
        db.session.add(new_userexperience_entry)
        db.session.flush()

        new_userprofile_entry = UserProfile(
            UserID=data.get('userID')
        )
        db.session.add(new_userprofile_entry)
        db.session.flush()

        new_userskill_entry = UserSkill(
            UserID=data.get('userID')
        )
        db.session.add(new_userskill_entry)
        db.session.commit()

        return jsonify({'message': 'User subsequence table created successfully', 'UserID': data.get('userID')}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@userAPI.route('/update_user', methods=['PATCH'])
def update_user():
    try:
        data = request.get_json()

        #check if required field is included (OFTEN THE PRIMARY KEY)
        if (not data or'userID' not in data or not data.get('userID')):
            return jsonify({'error': 'Missing userID'}), 400

        update_userID = data.get('userID')
        subject_user = User.query.filter_by(UserID=update_userID).first()
        # Check if user exists
        if not subject_user:
            return jsonify({'error': 'This user does not exist'}), 409

        #
        if 'userFirstName' in data and (data.get('userFirstName')):
            subject_user.UserFirstName = data['userFirstName']
        if 'userLastName' in data and (data.get('userLastName')):
            subject_user.UserLastName = data['userLastName']
        if 'userPassword' in data and (data.get('userPassword')):
            subject_user.UserPassword = data['userPassword']
        if 'userEmail' in data and (data.get('userEmail')):
            subject_user.UserEmail = data['userEmail']
        if 'userPicURL' in data and (data.get('userPicURL')):
            subject_user.UserPicURL = data.get('userPicURL')

        db.session.commit()
        return jsonify({'message': 'User updated successfully', 'UserID': subject_user.UserID}), 201

    except Exception as e:
        print("Exception occurred:", str(e))
        return jsonify({'error': str(e)}), 500

@userAPI.route('/deactivate_user', methods=['PATCH'])
def deactivate_user():
    try:
        data = request.get_json()

        #check if required field is included (OFTEN THE PRIMARY KEY)
        if (not data
                or'userID' not in data or not data.get('userID')):
            return jsonify({'error': 'Missing userID'}), 400

        update_userID = data['userID']
        subject_user = User.query.filter_by(UserID=update_userID).first()
        subject_user.IsActive = False
        db.session.commit()
        return jsonify({'message': 'User deactivated successfully', 'userID': subject_user.UserID}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500




