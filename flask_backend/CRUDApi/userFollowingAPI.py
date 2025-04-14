from flask import blueprints , jsonify, request
from datetime import datetime, timedelta
import uuid

from dataModel.userModel import db, User
from dataModel.userFollowingModel import UserFollowing
from dataModel.userBookmarkModel import UserBookmark
from dataModel.listingApplicantMapping import ListingApplicantMapping

userFollowingAPI = blueprints.Blueprint('userFollowingAPI', __name__)


@userFollowingAPI.route('/add_user_following', methods=['POST'])
def add_user_following():
    try:
        data = request.get_json()

        # check if all none nullable field contains null or empty string
        if (not data or
                'userID' not in data or not data.get('userID') or
                'companyID' not in data or not data.get('companyID')):
            return jsonify({'error': 'Missing required fields'}), 400

        new_userfollowing_entry = UserFollowing(
            UserID=data.get('userID'),
            CompanyID=data.get('companyID')
        )

        db.session.add(new_userfollowing_entry)
        db.session.commit()

        return jsonify({'message': 'User application added successfully', 'CompanyID': new_userfollowing_entry.CompanyID}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@userFollowingAPI.route('/remove_user_following', methods=['DELETE'])
def remove_user_following():
    try:
        data = request.get_json()

        if (not data or
                'userID' not in data or not data.get('userID') or
                'companyID' not in data or not data.get('companyID')):
            return jsonify({'error': 'Missing required fields'}), 400

        result_userfollowing = db.session.query(UserFollowing).filter(UserFollowing.UserID == data['userID'], UserFollowing.CompanyID == data['companyID']).first()

        # Check if the entry exists
        if result_userfollowing:
            db.session.delete(result_userfollowing)
            db.session.commit()
#DEBUG ONLY         else:
#DEBUG ONLY        return jsonify({'error': 'This user or listing does not exist on UserApplication'}), 409

        return jsonify({'message': 'UserFollowing entry deleted successfully'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@userFollowingAPI.route('/get_user_following', methods=['GET'])
def get_user_following():
    data = request.get_json()
    if not data or 'userID' not in data or not data.get('userID'):
        return jsonify({'error': 'Missing required field userID'}), 400

    followings = UserFollowing.query.filter_by(UserID=data['userID'])
    followings_count = followings.count()

    if followings == 0:
        return jsonify({'error': 'This user does not exists or do not have a following'}), 409

    followings_json = [
        {
            "companyID": following.ListingID,
            'companyName': following.company_mapping.CompanyName if following.company_mapping.CompanyName else None
        }
        for following in followings
    ]
    return jsonify(followings_json)
