from flask import blueprints , jsonify, request
from datetime import datetime, timedelta
import uuid

from dataModel.userModel import db, User
from dataModel.userApplicationModel import UserApplication
from dataModel.userFollowingModel import UserFollowing
from dataModel.userBookmarkModel import UserBookmark
from dataModel.listingApplicantMapping import ListingApplicantMapping

listingApplicantMappingAPI = blueprints.Blueprint('listingApplicantMappingAPI', __name__)

@listingApplicantMappingAPI.route('/get_listing_application', methods=['GET'])
def get_listing_application():

    listingID = request.args.get('listingID')
    if not listingID:
        return jsonify({'error': 'Missing required field userID'}), 400

    queries = ListingApplicantMapping.query.filter_by(ListingID=listingID)
    queries_count = queries.count()

    if queries_count == 0:
        return jsonify({'error': 'This listing does not exists or do not have an application'}), 409

    applicants_json = [
        {
            "userID": applicant.UserID,
            "userFirstName": applicant.user_mapping.UserFirstName,
            "userLastName": applicant.user_mapping.UserLastName,
            "userEmail": applicant.user_mapping.UserEmail,
            "appliedOn": applicant.AppliedOn,
            "status": applicant.Status,
            "memo": applicant.Memo,
            "score": applicant.Score,
            "userPicURL": applicant.user_mapping.UserPicURL,
        }
        for applicant in queries
    ]
    return jsonify(applicants_json)

@listingApplicantMappingAPI.route('/edit_applicant', methods=['PATCH'])
def edit_applicant():
    try:
        data = request.get_json()
        if (not data or
                'userID' not in data or not data.get('userID') or
                'listingID' not in data or not data.get('listingID')):
            return jsonify({'error': 'Missing fields'}), 409

        query = ListingApplicantMapping.query.filter_by(UserID=data.get('userID'), ListingID=data.get('listingID')).first()

        if not query:
            return jsonify({'error': 'This relation does not exist'}), 409

        if 'status' in data and (data.get('status')):
            query.Status = data.get('status')
        if 'memo' in data and (data.get('memo')):
            query.Memo = data.get('memo')
        if 'score' in data and (data.get('score')):
            query.Score = data.get('score')

        db.session.commit()
        return jsonify({'message': 'Applicant data updated successfully'}), 201

    except Exception as e:
        print("Exception occurred:", str(e))
        return jsonify({'error': str(e)}), 500