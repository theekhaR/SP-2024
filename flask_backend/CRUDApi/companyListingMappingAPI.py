from flask import blueprints , jsonify, request

from dataModel.userModel import db, User
from dataModel.userApplicationModel import UserApplication
from dataModel.userFollowingModel import UserFollowing
from dataModel.userBookmarkModel import UserBookmark
from dataModel.listingApplicantMapping import ListingApplicantMapping
from dataModel.companyModel import Company
from dataModel.companyMemberMappingModel import CompanyMemberMapping
from dataModel.companyListingMappingModel import CompanyListingMapping

companyListingMappingAPI = blueprints.Blueprint('companyListingMappingAPI', __name__)


@companyListingMappingAPI.route('/get_listings_of_company', methods=['GET'])
def get_listings_of_company():
    try:
        companyID = request.args.get('companyID')

        if not companyID:
            return jsonify({'error': 'Missing UserID'}), 400

        listings = CompanyListingMapping.query.filter_by(CompanyID=companyID)
        listings_count = listings.count()
#SQLalchemy
        if listings_count == 0:
            return jsonify({'error': 'This company does not exists or does not have a listing'}), 409

        listings_json = [
            {
                "listingID": listing.ListingID,
                'position': listing.listing_mapping.Position,
                'createdOn': listing.listing_mapping.CreatedOn,
                'affectiveUntil': listing.listing_mapping.AffectiveUntil
            }
            for listing in listings
        ]
        return jsonify(listings_json), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

