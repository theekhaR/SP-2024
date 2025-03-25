from flask import blueprints , jsonify, request
from datetime import datetime, timedelta
from dataModel.__init__ import db
from dataModel.companyModel import Company
from dataModel.companyIndustryListModel import CompanyIndustryList
from dataModel.companyListingMappingModel import CompanyListingMapping
from dataModel.companyMemberMappingModel import CompanyMemberMapping
from dataModel.companyPermissionListModel import CompanyPermissionList
import uuid

companyAPI = blueprints.Blueprint('companyAPI', __name__)

@companyAPI.route('/companies', methods=['GET'])
def get_all_companies():
    companies = Company.query.all()
    company_list = [
        {
            'CompanyID': company.CompanyID,
            'CompanyName': company.CompanyName,
            'CompanyAbout': company.CompanyAbout,
            'CompanyOverview': company.CompanyOverview,
            'CompanySite': company.CompanySite,
            'CompanyLocation': company.CompanyLocation,
            'IndustryID': company.companyindustrylist_mapping.IndustryName if company.companyindustrylist_mapping else None,
            'CreatedBy': f"{company.user_mapping.UserFirstName} {company.user_mapping.UserLastName}"  if company.user_mapping else None,
            'CreatedOn': company.CreatedOn.strftime('%Y-%m-%d %H:%M:%S') if company.CreatedOn else None
        }
        for company in companies
    ]
    return jsonify(company_list)

@companyAPI.route('/members', methods=['GET'])
def get_all_members():
    data = request.get_json()
    if not data or 'CompanyID' not in data:
        return jsonify({'error': 'Missing required fields'}), 400

    members = CompanyMemberMapping.query.filter_by(CompanyID=data['CompanyID'])

    if not members:
        return jsonify({'error': 'This company does not exists or do not have a member'}), 409

    member_list = [
        {
            'UserID': member.user_mapping.UserID,
            'Name': f"{member.user_mapping.UserFirstName} {member.user_mapping.UserLastName}"  if member.user_mapping else None,
            'Role': member.Role,
            'Permission': member.companypermissionlist_mapping.PermissionName if member.companypermissionlist_mapping else None
        }
        for member in members
    ]
    print(member_list)
    return jsonify(member_list)

@companyAPI.route('/companylistings', methods=['GET'])
def get_all_listings_from_company():
    data = request.get_json()
    if not data or 'CompanyID' not in data:
        return jsonify({'error': 'Missing required fields'}), 400

    listings = CompanyListingMapping.query.filter_by(CompanyID=data['CompanyID'])

    if not listings:
        return jsonify({'error': 'This company does not exists or do not have a listing'}), 409
    print(listings)
    listing_list = [
        {
            'ListingID': listing.ListingID,
            'Position': f"{listing.listing_mapping.Position}",
        }
        for listing in listings
    ]
    return jsonify(listing_list)
