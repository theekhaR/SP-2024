from flask import blueprints , jsonify, request
from datetime import datetime, timedelta
from dataModel.listingModel import db, Listing
import uuid

listingAPI = blueprints.Blueprint('listingAPI', __name__)

@listingAPI.route('/allListings', methods=['GET'])
def get_all_listings():
    listings = Listing.query.all()

    listings_list = [
        {
        'ListingID': listing.ListingID,
        'CreatedBy': f"{listing.user_mapping.UserFirstName} {listing.user_mapping.UserLastName}",
        'Company': listing.companylistingmapping_mapping.company_mapping.CompanyName if listing.companylistingmapping_mapping.company_mapping.CompanyName else None,
        'CreatedOn': listing.CreatedOn
        }
        for listing in listings
    ]
    return jsonify(listings_list)