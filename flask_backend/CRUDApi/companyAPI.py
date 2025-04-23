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

@companyAPI.route('/create_company', methods=['POST'])
def create_company():

    data = request.get_json()
    # if not data or 'userEmail' not in data or 'userPassword' not in data or 'userFirstName' not in data or 'userLastName' not in data:
    #     return jsonify({'error': 'Missing required fields'}), 400

    existing_company = Company.query.filter_by(CompanyName=data['companyName']).first()
    if existing_company:
        return jsonify({'error': 'Company with this name already exists'}), 409

    new_company = Company(
            CompanyID=str(uuid.uuid4()),
            CompanyName= data.get('companyName', ''),
            CompanyAbout= data.get('companyAbout', ''),
            CompanyOverview= data.get('companyOverview', ''),
            CompanyLocation= data.get('companyLocation', ''),
            IndustryID= int(data.get('industryID', 1)) if data.get('industryID', 1) not in [None, ""] else 1,
            CreatedBy= data.get('createdBy'),
            CreatedOn= datetime.now(),
            CompanyLogoURL=data.get('companyLogoURL', ''),
    )
    db.session.add(new_company)
    db.session.flush()

    new_companypermissionlist = CompanyPermissionList(
        CompanyID=new_company.CompanyID,
        PermissionID=1,
        PermissionName='Default'
    )
    db.session.add(new_companypermissionlist)
    db.session.flush()

    new_companymembermapping = CompanyMemberMapping(
        CompanyID=new_company.CompanyID,
        UserID=new_company.CreatedBy,
        Role=data.get('role', ''),
        PermissionID=new_companypermissionlist.PermissionID,
    )
    db.session.add(new_companymembermapping)
    db.session.commit()

    return jsonify({'message': 'Company created successfully', 'companyID': new_company.CompanyID}), 201

@companyAPI.route('/get_company', methods=['GET'])
def get_company():

    companyID = request.args.get('companyID')
    if not companyID:
        return jsonify({'error': 'Missing required fields'}), 400

    query_company = Company.query.filter_by(CompanyID=companyID).first()

    company_json ={
        'companyID': query_company.CompanyID,
        'companyName': query_company.CompanyName,
        'companyAbout': query_company.CompanyAbout,
        'companyOverview': query_company.CompanyOverview,
        'companyLogoURL': query_company.CompanyLogoURL,
        'companyLocation': query_company.CompanyLocation,
        'industryName': query_company.companyindustrylist_mapping.IndustryName if query_company.companyindustrylist_mapping else None,
        'createdBy': f"{query_company.user_mapping.UserFirstName} {query_company.user_mapping.UserLastName}"  if query_company.user_mapping else None,
        'createdOn': query_company.CreatedOn.strftime('%Y-%m-%d %H:%M:%S') if query_company.CreatedOn else None
    }

    return jsonify(company_json)


@companyAPI.route('/get_all_companies', methods=['GET'])
def get_all_companies():
    companies = Company.query.all()
    company_list = [
        {
            'CompanyID': company.CompanyID,
            'CompanyName': company.CompanyName,
            'CompanyAbout': company.CompanyAbout,
            'CompanyOverview': company.CompanyOverview,
            'CompanyLogoURL': company.CompanyLogoURL,
            'CompanyLocation': company.CompanyLocation,
            'IndustryID': company.companyindustrylist_mapping.IndustryName if company.companyindustrylist_mapping else None,
            'CreatedBy': f"{company.user_mapping.UserFirstName} {company.user_mapping.UserLastName}"  if company.user_mapping else None,
            'CreatedOn': company.CreatedOn.strftime('%Y-%m-%d %H:%M:%S') if company.CreatedOn else None
        }
        for company in companies
    ]
    return jsonify(company_list)
