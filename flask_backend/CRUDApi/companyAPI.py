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

# region Company Table -------------------------------------------------------------------------------------------------------------------------------------
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
        PermissionName='Owner'
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

    data = request.get_json()
    if not data or 'CompanyID' not in data or not data.get('CompanyID'):
        return jsonify({'error': 'Missing required fields'}), 400

    query_company = Company.query.filter_by(CompanyID=data['CompanyID']).first()

    company_json =[
    {
        'companyID': query_company.CompanyID,
        'companyName': query_company.CompanyName,
        'companyAbout': query_company.CompanyAbout,
        'companyOverview': query_company.CompanyOverview,
        'companySite': query_company.CompanySite,
        'companyLocation': query_company.CompanyLocation,
        'industryName': query_company.companyindustrylist_mapping.IndustryName if query_company.companyindustrylist_mapping else None,
        'createdBy': f"{query_company.user_mapping.UserFirstName} {query_company.user_mapping.UserLastName}"  if company.user_mapping else None,
        'createdOn': query_company.CreatedOn.strftime('%Y-%m-%d %H:%M:%S') if query_company.CreatedOn else None
    }]

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
            'CompanySite': company.CompanySite,
            'CompanyLocation': company.CompanyLocation,
            'IndustryID': company.companyindustrylist_mapping.IndustryName if company.companyindustrylist_mapping else None,
            'CreatedBy': f"{company.user_mapping.UserFirstName} {company.user_mapping.UserLastName}"  if company.user_mapping else None,
            'CreatedOn': company.CreatedOn.strftime('%Y-%m-%d %H:%M:%S') if company.CreatedOn else None
        }
        for company in companies
    ]
    return jsonify(company_list)

@companyAPI.route('/add_user_to_company', methods=['POST'])
def add_user_to_company():
    data = request.get_json()
    if not data or 'userID' not in data:
        return jsonify({'error': 'Missing required fields'}), 400

    members = CompanyMemberMapping.query.filter_by(CompanyID=data['CompanyID'])
# endregion =======================================================================================================================================================

# region CompanyMemberMapping Table -------------------------------------------------------------------------------------------------------------------------------------

@companyAPI.route('/get_company_member', methods=['GET'])
def get_company_member():
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

# endregion =======================================================================================================================================================


# region CompanyListingMapping Table -------------------------------------------------------------------------------------------------------------------------------------
@companyAPI.route('/companylistings', methods=['GET'])
def get_all_listings_from_company():
    data = request.get_json()
    if not data or 'companyID' not in data:
        return jsonify({'error': 'Missing required fields'}), 400

    listings = CompanyListingMapping.query.filter_by(CompanyID=data['companyID'])

    if not listings:
        return jsonify({'error': 'This company does not exists or do not have a listing'}), 409
    print(listings)
    listing_list = [
        {
            'listingID': listing.ListingID,
            'position': f"{listing.listing_mapping.Position}",
        }
        for listing in listings
    ]
    return jsonify(listing_list)

# endregion =======================================================================================================================================================
