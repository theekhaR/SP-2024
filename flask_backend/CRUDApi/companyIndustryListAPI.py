from flask import blueprints , jsonify, request
from datetime import datetime, timedelta
import uuid

from dataModel.userModel import db, User
from dataModel.userApplicationModel import UserApplication
from dataModel.userFollowingModel import UserFollowing
from dataModel.userBookmarkModel import UserBookmark
from dataModel.listingApplicantMapping import ListingApplicantMapping
from dataModel.companyIndustryListModel import CompanyIndustryList

companyIndustryListAPI = blueprints.Blueprint('companyIndustryListAPI', __name__)


@companyIndustryListAPI.route('/add_company_industry', methods=['POST'])
def add_company_industry():
    try:
        data = request.get_json()

        # check if all none nullable field contains null or empty string
        if (not data or
                'industryName' not in data or not data.get('industryName')):
            return jsonify({'error': 'Missing Industry Name fields'}), 400

        new_companyindustrylist_entry = CompanyIndustryList(
            IndustryName=data.get('industryName')
        )

        db.session.add(new_companyindustrylist_entry)
        db.session.commit()

        return jsonify({'message': 'User application added successfully'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@companyIndustryListAPI.route('/get_all_industries', methods=['GET'])
def get_all_industries():
    try:
            industries = CompanyIndustryList.query.all()
            industries_list = [{'industryID': industry.IndustryID, 'industryName': industry.IndustryName} for industry in industries]
            return jsonify(industries_list), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
