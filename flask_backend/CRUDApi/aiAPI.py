from flask import blueprints , jsonify, request
from datetime import datetime, timedelta
from dataModel.__init__ import db
from dataModel.companyModel import Company
from dataModel.companyIndustryListModel import CompanyIndustryList
from dataModel.companyListingMappingModel import CompanyListingMapping
from dataModel.companyMemberMappingModel import CompanyMemberMapping
from dataModel.companyPermissionListModel import CompanyPermissionList
from dataModel.userProfileModel import UserProfile
import uuid
from AI.generativeUser import generateQueryFromURL
from AI.generativeListing import generateSummaryOfListing

from dataModel.listingModel import Listing

aiAPI = blueprints.Blueprint('aiAPI', __name__)

#@aiAPI.route('/generate_skill_summary', methods=['GET'])
def generate_skill_summary(link_to_portfolio):

    userID = request.args.get('userID')
    if not userID:
        return jsonify({'error': 'Missing userID'}), 400

    query_user = UserProfile.query.filter_by(UserID=userID).first()

    if not query_user or not query_user.Portfolio:
        return jsonify({'error': 'Portfolio cannot be found'}), 404

    summary = generateQueryFromURL(link_to_portfolio)
    skill_list = [skill.strip() for skill in summary.split(',')]
    print(skill_list)

    return jsonify({'skillSummary': skill_list})

#@aiAPI.route('/generate_listing_summary', methods=['GET'])
def generate_listing_summary():

    listingID = request.args.get('listingID')
    if not listingID:
        return jsonify({'error': 'Missing listingID'}), 400

    query_listing = Listing.query.filter_by(ListingID=listingID).first()

    if not query_listing or not query_listing.Qualification:
        return jsonify({'error': 'There is no listing entry'}), 404

    parts = [
        query_listing.Position or '',
        query_listing.RoleDescription or '',
        query_listing.Detail or '',
        ', '.join(query_listing.Qualification) if query_listing.Qualification else '',
    ]
    all_text = '\n'.join(parts).strip()
    print(all_text)
    summary = generateSummaryOfListing(all_text)
    position_text = query_listing.Position or ""
    summary = f"{position_text}: {summary}" if position_text else summary

    return jsonify({'skillSummary': summary})
