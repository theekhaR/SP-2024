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
            "userFirstName": applicant.user_mapping.UserFirstName,
            "userLastName": applicant.user_mapping.UserLastName,
            "userEmail": applicant.user_mapping.UserEmail,
            "appliedOn": applicant.AppliedOn,
            "status": applicant.Status,
            "memo": applicant.Memo,
            "score": applicant.Score,
        }
        for applicant in queries
    ]
    return jsonify(applicants_json)