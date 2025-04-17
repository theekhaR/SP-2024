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
from dataModel.companyPermissionListModel import CompanyPermissionList

companyPermissionListAPI = blueprints.Blueprint('companyPermissionListAPI', __name__)


@companyPermissionListAPI.route('/create_new_permission', methods=['POST'])
def create_new_permission():
    try:
        data = request.get_json()

        # check if all none nullable field contains null or empty string
        if (not data or
                'companyID' not in data or not data.get('companyID') or
                'permissionID' not in data or not data.get('permissionID')):
            return jsonify({'error': 'Missing required fields'}), 400

        existing_permissionID = CompanyPermissionList.query.filter_by(CompanyID=data.get('companyID'), PermissionID=data.get('permissionID') ).first()

        if existing_permissionID:
            return jsonify({'error': 'This permissionID already exists in this company'}), 409

        new_companypermissionlist = CompanyPermissionList(
            CompanyID=data.get('companyID'),
            PermissionID=data.get('permissionID'),
            PermissionName=data.get('permissionName') if data.get('permissionName') else None,
        )

        db.session.add(new_companypermissionlist)
        db.session.commit()

        return jsonify({'message': 'New permission added to company successfully',
                        'CompanyName': new_companypermissionlist.company_mapping.CompanyName,
                       'PermissionName': new_companypermissionlist.PermissionName}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500



