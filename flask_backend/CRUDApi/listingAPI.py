from flask import blueprints , jsonify, request
from datetime import datetime, timedelta, timezone
import uuid
from dataModel.listingModel import db, Listing
from dataModel.companyModel import Company
from dataModel.companyListingMappingModel import CompanyListingMapping
from dataModel.userModel import User
from dateutil import parser
from supabase import create_client

url = "https://jvxogeiwtwcdrkdxqwjb.supabase.co"
anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2eG9nZWl3dHdjZHJrZHhxd2piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2OTgzNDUsImV4cCI6MjA1OTI3NDM0NX0.zr8dMif4qi588JLMXXWo1VFCeRw1w4TbpaA4zCIoDWM"
supabase = create_client(url, anon_key)

listingAPI = blueprints.Blueprint('listingAPI', __name__)


@listingAPI.route('/search', methods=['GET'])
def search_listings():
    search_text = request.args.get('searchText')
    search_industry = request.args.get('searchIndustry')
    search_location = request.args.get('searchLocation')
    search_work_type = request.args.get('searchWorkType')
    search_work_condition = request.args.get('searchWorkCondition')
    search_experience = request.args.get('searchExperience')

    response = supabase.rpc('search_listings', {
        "search_text": search_text if search_text else None,
        "search_industry": search_industry if search_industry else None,
        "search_location": search_location if search_location else None,
        "search_work_type": search_work_type if search_work_type else None,
        "search_work_condition": search_work_condition if search_work_condition else None,
        "search_experience": search_experience if search_experience else None,
    }).execute()

    if response.data is None:
        return jsonify({'error': 'No data returned from database'}), 400

    return jsonify(response.data)

@listingAPI.route('/get_default_listings', methods=['GET'])
def get_default_listings():
    try:
        listings = Listing.query.all()
        listings_list = [
            {
            'listingID': listing.ListingID,
            'company': listing.companylistingmapping_mapping.company_mapping.CompanyName if listing.companylistingmapping_mapping.company_mapping.CompanyName else None,
            'image_url': listing.companylistingmapping_mapping.company_mapping.CompanyLogoURL,
            'position': listing.Position,
            'location': listing.Location,
            'salary': listing.Salary,
            'description': listing.RoleDescription,
            'qualification': listing.Qualification,
            'detail': listing.Detail,
            'worktype': listing.WorkType,
            'workcondition': listing.WorkCondition,
            'experience':listing.Experience,
            'industry':listing.companylistingmapping_mapping.company_mapping.companyindustrylist_mapping.IndustryName
            }
            for listing in listings
        ]
        return jsonify(listings_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@listingAPI.route('/get_all_listings', methods=['GET'])
def get_all_listings():
    listings = Listing.query.all()
    listings_list = [
        {
        'listingID': listing.ListingID,
        'createdBy': f"{listing.user_mapping.UserFirstName} {listing.user_mapping.UserLastName}",
        'company': listing.companylistingmapping_mapping.company_mapping.CompanyName if listing.companylistingmapping_mapping.company_mapping.CompanyName else None,
        'createdOn': listing.CreatedOn
        }
        for listing in listings
    ]
    return jsonify(listings_list), 200

@listingAPI.route('/create_listing', methods=['POST'])
def create_listing():
    try:
        data = request.get_json()
        if (not data or
                'createdBy' not in data or not data.get('createdBy') or
                'position' not in data or not data.get('position') or
                'companyID' not in data or not data.get('companyID')):

           return jsonify({'error': 'Missing required fields'}), 400

        #if not data.get('affectiveUntil') or:
        # Check if user exists
        existing_user = User.query.filter_by(UserID=data['createdBy']).first()
        if not existing_user:
            return jsonify({'error': 'User not valid'}), 409

        existing_company = Company.query.filter_by(CompanyID=data['companyID']).first()
        if not existing_company:
            return jsonify({'error': 'Company not valid'}), 409

        new_listing = Listing(
            ListingID=str(uuid.uuid4()),
            CreatedBy=data.get('createdBy' if data.get('createdBy') else None),
            CompanyID=data.get('companyID' if data.get('companyID') else None),
            Position=data.get('position' if data.get('position') else None),
            WorkType=data.get('workType') if data.get('workType') else "Not Specified",
            WorkCondition=data.get('workCondition') if data.get('workCondition') else "Not Specified",
            RoleDescription=data.get('roleDescription', ''),
            Detail=data.get('detail', False),
            Qualification=data.get('qualification', ''),
            ListingPicURL=data.get('listingPicURL', ''),
            Salary=data.get('salary', ''),
            Experience=data.get('experience', ''),
            CreatedOn=datetime.now(),
            #AffectiveUntil=datetime.strptime(data.get('affectiveUntil'), '%Y-%m-%dT%H:%M:%S%z')
            AffectiveUntil = datetime.strptime(data.get('affectiveUntil', (datetime.now(timezone.utc).astimezone() + timedelta(days=7)).strftime('%Y-%m-%dT%H:%M:%S%z')), '%Y-%m-%dT%H:%M:%S%z')
        )

        db.session.add(new_listing)
        db.session.flush()
        # NOTE: this will actually insert the record in the database and set
        # new_group.id automatically. The session, however, is not committed yet!

        new_company_listing_mapping = CompanyListingMapping(
            ListingID=new_listing.ListingID,
            CompanyID=new_listing.CompanyID
        )
        db.session.add(new_company_listing_mapping)
        db.session.commit()

        return jsonify({'message': 'Listing created successfully'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@listingAPI.route('/get_listing_detail', methods=['GET'])
def get_listing_detail():

    listingID = request.args.get('listingID')
    if not listingID:
        return jsonify({'error': 'Missing listingID'}), 400

    query_listing = Listing.query.filter_by(ListingID=listingID).first()

    listing_json ={
        'listingID': query_listing.CompanyID,
        'createdBy': query_listing.CompanyName,
        'companyID': query_listing.CompanyAbout,
        'position': query_listing.CompanyOverview,
        'companyLogoURL': query_listing.CompanyLogoURL,
        'companyLocation': query_listing.CompanyLocation,
        'industryName': query_listing.companyindustrylist_mapping.IndustryName if query_listing.companyindustrylist_mapping else None,
        'createdBy': f"{query_listing.user_mapping.UserFirstName} {query_listing.user_mapping.UserLastName}"  if query_listing.user_mapping else None,
        'createdOn': query_listing.CreatedOn.strftime('%Y-%m-%d %H:%M:%S') if query_listing.CreatedOn else None
    }

    return jsonify(company_json)