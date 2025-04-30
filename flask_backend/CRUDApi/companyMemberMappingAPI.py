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
                'permissionName': company.companypermissionlist_mapping.PermissionName,
                'companyLogoURL': company.company_mapping.CompanyLogoURL,
            }
            for company in companies
        ]
        return jsonify(companies_json), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@companyMemberMappingAPI.route('/get_user_data_in_company', methods=['GET'])
def get_user_data_in_company():
    try:
        userID = request.args.get('userID')
        companyID = request.args.get('companyID')

        if not userID or not companyID:
            return jsonify({'error': 'Missing UserID or CompanyID'}), 400

        user_company_data = CompanyMemberMapping.query.filter_by(UserID=userID, CompanyID=companyID).first()
        user_company_data_json = {
            'role': user_company_data.Role,
            'permissionID': user_company_data.PermissionID,
        }

        return jsonify(user_company_data_json), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@companyMemberMappingAPI.route('/add_new_member_to_company', methods=['POST'])
def add_new_member_to_company():
    try:
        data = request.get_json()

        if (not data or 'companyID' not in data or not data.get('companyID') or
                'userID' not in data or not data.get('userID')):
            return jsonify({'error': 'Missing required fields'}), 400

        previous_relation = CompanyMemberMapping.query.filter_by(UserID=data.get('userID'), CompanyID=data.get('companyID'))
        companies_count = previous_relation.count()

        if companies_count != 0:
            return jsonify({'error': 'This user does not exists or are not in a company'}), 409

        new_companymembermapping = CompanyMemberMapping(
            CompanyID=data.get('companyID'),
            UserID=data.get('userID'),
            Role=data.get('role') if data.get('role') else None,
            PermissionID=data.get('permissionID'),
        )
        db.session.add(new_companymembermapping)
        db.session.commit()

        return jsonify({'message': 'User successfully added to Company'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@companyMemberMappingAPI.route('/add_new_member_to_company_using_email', methods=['POST'])
def add_new_member_to_company_using_email():
    try:
        data = request.get_json()

        if (not data or
                'companyID' not in data or not data.get('companyID') or
                'userEmail' not in data or not data.get('userEmail')):
            return jsonify({'error': 'Missing required fields'}), 400

        getUser = User.query.filter_by(UserEmail=data.get('userEmail')).first()

        if not getUser:
            return jsonify({'error': 'This user does not exist'}), 409

        userID = getUser.UserID
        previous_relation = CompanyMemberMapping.query.filter_by(UserID=userID , CompanyID=data.get('companyID'))
        companies_count = previous_relation.count()

        if companies_count != 0:
            return jsonify({'error': 'This user does not exists or are not in a company'}), 409

        new_companymembermapping = CompanyMemberMapping(
            CompanyID=data.get('companyID'),
            UserID=userID, #because userID was fetched from the query of getUser above
            Role=data.get('role') if data.get('role') else None,
            PermissionID=1, #1 is default
        )
        db.session.add(new_companymembermapping)
        db.session.commit()

        return jsonify({'message': 'User successfully added to Company'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@companyMemberMappingAPI.route('/get_company_member', methods=['GET'])
def get_company_member():
    companyID = request.args.get('companyID')
    if not 'companyID':
        return jsonify({'error': 'Missing companyID'}), 400

    members = CompanyMemberMapping.query.filter_by(CompanyID=companyID)

    if not members:
        return jsonify({'error': 'This company does not exists or do not have a member'}), 409

    member_list = [
        {
            'userID': member.user_mapping.UserID,
            'name': f"{member.user_mapping.UserFirstName} {member.user_mapping.UserLastName}"  if member.user_mapping else None,
            'role': member.Role,
            'permissionID': member.companypermissionlist_mapping.PermissionID if member.companypermissionlist_mapping else None,
            'permissionName': member.companypermissionlist_mapping.PermissionName if member.companypermissionlist_mapping else None,
            'userPicURL': member.user_mapping.UserPicURL
        }
        for member in members
    ]
    print(member_list)
    return jsonify(member_list)

@companyMemberMappingAPI.route('/edit_member_detail', methods=['PATCH'])
def edit_member_detail():

    data = request.get_json()

    if (not data or
            'userID' not in data or not data.get('userID') or
            'companyID' not in data or not data.get('companyID')):
        return jsonify({'error': 'Missing userID or companyID'}), 400

    subject_query = CompanyMemberMapping.query.filter_by(UserID=data.get('userID'), CompanyID=data.get('companyID')).first()

    if not subject_query:
        return jsonify({'error': 'This relation does not exists'}), 409

    #
    if 'permissionID' in data and (data.get('permissionID')):
        subject_query.PermissionID = data.get('permissionID')
    if 'role' in data and (data.get('role')):
        subject_query.Role = data.get('role')

    db.session.commit()
    return jsonify({'message': 'User updated successfully'}), 201

@companyMemberMappingAPI.route('/delete_member', methods=['DELETE'])
def delete_member():

    data = request.get_json()

    if (not data or
            'userID' not in data or not data.get('userID') or
            'companyID' not in data or not data.get('companyID')):
        return jsonify({'error': 'Missing userID or companyID'}), 400

    subject_query = CompanyMemberMapping.query.filter_by(UserID=data.get('userID'), CompanyID=data.get('companyID')).first()

    if not subject_query:
        return jsonify({'error': 'This relation does not exists'}), 409

    db.session.delete(subject_query)
    db.session.commit()

    return jsonify({'message': 'User updated successfully'}), 201

