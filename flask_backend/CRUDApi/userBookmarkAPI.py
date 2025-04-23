from flask import blueprints , jsonify, request
from datetime import datetime, timedelta
import uuid

from dataModel.userModel import db, User
from dataModel.userApplicationModel import UserApplication
from dataModel.userFollowingModel import UserFollowing
from dataModel.userBookmarkModel import UserBookmark
from dataModel.listingApplicantMapping import ListingApplicantMapping


userBookmarkAPI = blueprints.Blueprint('userBookmarkAPI', __name__)


@userBookmarkAPI.route('/add_user_bookmark', methods=['POST'])
def add_user_bookmark():
    try:
        data = request.get_json()
        # check if all none nullable field contains null or empty string
        if (not data or
                'userID' not in data or not data.get('userID') or
                'listingID' not in data or not data.get('listingID')):
           return jsonify({'Error': 'Missing required fields'}), 400

        new_userbookmark_entry = UserBookmark(
            UserID=data.get('userID'),
            ListingID=data.get('listingID')
        )

        db.session.add(new_userbookmark_entry)
        db.session.commit()

        return jsonify({'message': 'User Bookmark added successfully', 'ListingID': new_userbookmark_entry.ListingID}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@userBookmarkAPI.route('/remove_user_bookmark', methods=['DELETE'])
def remove_user_bookmark():
    try:
        data = request.get_json()
        print(data)
        if (not data
                or 'userID' not in data or not data.get('userID')
                or 'listingID' not in data or not data.get('listingID')):
            jsonify({'error': 'Missing required fields'}), 400

        result = db.session.query(UserBookmark).filter(UserBookmark.UserID == data['userID'], UserBookmark.ListingID == data['listingID']).first()
        if not result:
            return jsonify({'error': 'This user or the bookmark specified does not exists'}), 409

        db.session.delete(result)
        db.session.commit()

        return jsonify({'message': 'UserBookmark entry deleted successfully'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@userBookmarkAPI.route('/get_user_bookmark', methods=['GET'])
def get_user_bookmark():
    userID = request.args.get('userID')
    if not userID:
        return jsonify({'error': 'Missing required field userID'}), 400

    listings = UserBookmark.query.filter_by(UserID=userID)
    listings_count = listings.count()

    if listings_count == 0:
        return jsonify({'error': 'This user does not exists or do not have a bookmark'}), 409

    listings_json = [
        {
            "listingID": listing.ListingID,
            'listingName': listing.listing_mapping.Position if listing.listing_mapping.Position else None,
            'companyName': listing.listing_mapping.companylistingmapping_mapping.company_mapping.CompanyName if listing.listing_mapping.companylistingmapping_mapping.company_mapping.CompanyName else None
        }
        for listing in listings
    ]
    return jsonify(listings_json)
