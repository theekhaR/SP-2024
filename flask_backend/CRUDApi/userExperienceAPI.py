from flask import blueprints , jsonify, request
from datetime import datetime, timedelta
import uuid

from dataModel.userModel import db, User
from dataModel.userExperince import UserExperince

userEducationAPI = blueprints.Blueprint('userEducationAPI', __name__)


@userEducationAPI.route('/edit_user_education', methods=['POST'])
def edit_user_education():
    try:
        data = request.get_json()

        # check if required field is included (OFTEN THE PRIMARY KEY)
        if (not data or 'userID' not in data or not data.get('userID')):
            return jsonify({'error': 'Missing userID'}), 400

        update_userID = data.get('userID')
        subject_user = UserExperince.query.filter_by(UserID=update_userID).first()

        # Check if user exists
        if not subject_user:
            return jsonify({'error': 'This user does not exist'}), 409

        if 'position' in data and (data.get('position')):
            subject_user.Position = data['position']
        if 'organization' in data and (data.get('organization')):
            subject_user.Organization = data['organization']
        if 'placeOfWork' in data and (data.get('placeOfWork')):
            subject_user.PlaceOfWork = data['placeOfWork']
        if 'details' in data and (data.get('details')):
            subject_user.Details = data['details']
        if 'startYear' in data and data.get('startYear') and 'startMonth' in data and data.get('startMonth'):
            year = int(data['startYear'])
            month = int(data['startMonth'])
            subject_user.StartYear = datetime(year, month, 1)  # Always use the 1st of the month as it is not important
        if 'finishYear' in data and data.get('finishYear') and 'finishMonth' in data and data.get('finishMonth'):
            year = int(data['finishYear'])
            month = int(data['finishMonth'])
            subject_user.FinishYear = datetime(year, month, 1)  # Always use the 1st of the month as it is not important

        db.session.commit()
        return jsonify({'message': 'UserExperience updated successfully', 'UserID': subject_user.UserID}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500