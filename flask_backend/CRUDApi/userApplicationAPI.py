from flask import blueprints , jsonify, request
from datetime import datetime, timedelta
import uuid

from dataModel.userModel import db, User
from dataModel.userApplicationModel import UserApplication
from dataModel.userFollowingModel import UserFollowing
from dataModel.userBookmarkModel import UserBookmark
from dataModel.listingApplicantMapping import ListingApplicantMapping

userApplicationAPI = blueprints.Blueprint('userApplicationAPI', __name__)


@userApplicationAPI.route('/add_user_applicantion', methods=['POST'])
def add_user_applicantion():
    try:
        data = request.get_json()

        # check if all none nullable field contains null or empty string
        if (not data or
                'userID' not in data or not data.get('userID') or
                'listingID' not in data or not data.get('listingID')):
            return jsonify({'error': 'Missing required fields'}), 400

        new_userapplication_entry = UserApplication(
            UserID=data.get('userID'),
            ListingID=data.get('listingID')
        )

        db.session.add(new_userapplication_entry)
        db.session.flush()
        # NOTE: this will actually insert the record in the database and set
        # new_group.id automatically. The session, however, is not committed yet!

        new_listingapplicantmapping_entry = ListingApplicantMapping(
            ListingID=data.get('listingID'),
            UserID=data.get('userID'),
            AppliedOn=datetime.now(),
            Status="Not Processed"
        )
        db.session.add(new_listingapplicantmapping_entry)
        db.session.commit()

        return jsonify({'message': 'User application added successfully', 'ListingID': new_userapplication_entry.ListingID}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@userApplicationAPI.route('/remove_user_application', methods=['DELETE'])
def remove_user_application():
    try:
        data = request.get_json()

        if (not data or
                'userID' not in data or not data.get('userID') or
                'listingID' not in data or not data.get('listingID')):
            return jsonify({'error': 'Missing required fields'}), 400

        result_userapplication = db.session.query(UserApplication).filter(UserApplication.UserID == data['userID'], UserApplication.ListingID == data['listingID']).first()

        # Check if the entry exists
        if result_userapplication:
            db.session.delete(result_userapplication)
            db.session.flush()
#DEBUG ONLY         else:
#DEBUG ONLY        return jsonify({'error': 'This user or listing does not exist on UserApplication'}), 409



        result_listingapplicant = db.session.query(ListingApplicantMapping).filter(ListingApplicantMapping.UserID == data['userID'],
                                                          ListingApplicantMapping.ListingID == data['listingID']).first()
        if result_listingapplicant:
            db.session.delete(result_listingapplicant)
            db.session.flush()
# DEBUG ONLY         else:
# DEBUG ONLY            return jsonify({'error': 'This user or listing does not exist on ListingApplicantMapping'}), 409

        db.session.commit()
        return jsonify({'message': 'UserApplication entry deleted successfully'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@userApplicationAPI.route('/get_user_application', methods=['GET'])
def get_user_application():
    userID = request.args.get('userID')
    if not userID:
        return jsonify({'error': 'Missing required field userID'}), 400

    listings = ListingApplicantMapping.query.filter_by(UserID=userID)
    listings_count = listings.count()

    if listings_count == 0:
        return jsonify({'error': 'This user does not exists or do not have an application'}), 409

    listings_json = [
        {
            "listingID": listing.ListingID,
            'position': listing.listing_mapping.Position if listing.listing_mapping.Position else None,
            'companyLogoURL': listing.listing_mapping.companylistingmapping_mapping.company_mapping.CompanyLogoURL,
            'companyName': listing.listing_mapping.companylistingmapping_mapping.company_mapping.CompanyName if listing.listing_mapping.companylistingmapping_mapping.company_mapping.CompanyName else None,
            'appliedOn': listing.AppliedOn,
            'status': listing.Status,
        }
        for listing in listings
    ]
    return jsonify(listings_json)



@userApplicationAPI.route('/validate_company', methods=['GET'])
def validate_company():
    companyID = request.args.get('compnayID')
    if not companyID:
        return jsonify({'error': 'Missing required field userID'}), 400

    queries = ListingApplicantMapping.query.filter_by(ListingID=listingID)
    queries_count = queries.count()

    if queries_count == 0:
        return jsonify({'error': 'This listing does not exists or do not have an application'}), 409

    applicants_json = [
        {
            "userFirstName": applicant.listing_mapping.UserFirstName,
            "userLastName": applicant.listing_mapping.UserLastName,
            "userEmail": applicant.listing_mapping.UserEmail,
            "appliedOn": applicant.appliedOn,
            "status": applicant.status,
            "memo": applicant.memo,
            "score": applicant.score,
        }
        for applicant in queries
    ]
    return jsonify(applicants_json)