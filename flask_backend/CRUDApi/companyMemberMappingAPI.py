from flask import blueprints , jsonify, request
from datetime import datetime, timedelta
import uuid

from dataModel.userModel import db, User
from dataModel.userApplicationModel import UserApplication
from dataModel.userFollowingModel import UserFollowing
from dataModel.userBookmarkModel import UserBookmark
from dataModel.listingApplicantMapping import ListingApplicantMapping
from dataModel.companyModel import Company
from dataModel.companyMemberMappingModel import CompanyMemberMapping

companyMemberMappingAPI = blueprints.Blueprint('companyMemberMappingAPI', __name__)


@companyMemberMappingAPI.route('/get_company_of_a_user', methods=['GET'])
def get_company_of_user():
    try:
        userID = request.args.get('userID')

        if not userID:
            return jsonify({'error': 'Missing UserID'}), 400

        companies = CompanyMemberMapping.query.filter_by(UserID=userID)
        companies_count = companies.count()

        if companies_count == 0:
            return jsonify({'error': 'This user does not exists or are not in a company'}), 409

        companies_json = [
            {
                "companyID": company.CompanyID,
                'companyName': company.company_mapping.CompanyName,
                'role': company.Role,
                'permissionID': company.companypermissionlist_mapping.PermissionID,
                'permissionName': company.companypermissionlist_mapping.PermissionName
            }
            for company in companies
        ]
        return jsonify(companies_json), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@companyMemberMappingAPI.route('/create_company_member_mapping', methods=['POST'])
def create_company_member_mapping():
    try:
        data = request.get_json()

        if (not data or 'CompanyID' not in data or not data.get('CompanyID') or
                'userID' not in data or not data.get('userID') or
                'permissionID' not in data or not data.get('permissionID')):
            return jsonify({'error': 'Missing required fields'}), 400

        companies = CompanyMemberMapping.query.filter_by(UserID=data['userID'])
        companies_count = companies.count()

        if companies_count == 0:
            return jsonify({'error': 'This user does not exists or are not in a company'}), 409

        new_companymembermapping = CompanyMemberMapping(
            CompanyID=data.get('CompanyID'),
            UserID=data.get('userID'),
            Role=data.get('role') if data.get('role') else None,
            PermissionID=data.get('permissionID'),
        )
        db.session.add(new_companymembermapping)
        db.session.commit()

        return jsonify({'message': 'User successfully added to Company'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500
