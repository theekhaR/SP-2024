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
            'IndustryID': company.Industry.IndustryName if company.Industry else None,
            'CreatedBy': f"{company.User.UserFirstName} {company.User.UserLastName}"  if company.User else None,
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
            'UserID': member.User.UserID,
            'Name': f"{member.User.UserFirstName} {member.User.UserLastName}"  if member.User else None,
            'Role': member.Role,
            'Permission': member.CompanyPermissionList.PermissionName if member.CompanyPermissionList else None
        }
        for member in members
    ]
    print(member_list)
    return jsonify(member_list)

@companyAPI.route('/listings', methods=['GET'])
def get_all_listings():
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
            'Position': f"{listing.ListingID.Position}",
        }
        for listing in listings
    ]
    return jsonify(listing_list)
