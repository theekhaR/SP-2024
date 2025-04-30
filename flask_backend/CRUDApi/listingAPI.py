import os

from flask import blueprints , jsonify, request
from datetime import datetime, timedelta, timezone
import uuid
from dataModel.listingModel import db, Listing
from dataModel.companyModel import Company
from dataModel.companyListingMappingModel import CompanyListingMapping
from dataModel.userModel import User
from dateutil import parser
from AI.generativeListing import generateSummaryOfListing
from supabase_client import supabase
from openai import OpenAI
from sqlalchemy.dialects.postgresql import ARRAY
from AI.generativeListing import generateSummaryOfListing
from flask.cli import load_dotenv

listingAPI = blueprints.Blueprint('listingAPI', __name__)

# === CONFIGURATION ===
load_dotenv()
OPENAI_API_KEY = os.getenv('openai_key')
#OPENAI_API_KEY =

# === INITIALIZE OPENAI ===
openai = OpenAI(api_key=OPENAI_API_KEY)

def generate_embedding(text):
    """Generate an embedding using OpenAI"""
    response = openai.embeddings.create(
        input=text,
        model="text-embedding-ada-002"
    )
    return response.data[0].embedding

# @listingAPI.route('/check_user_id', methods=['POST'])
# def check_user_id():
#     data = request.get_json()
#     user_id = data.get('userID')
#     print("Received user ID:", user_id)
#     return jsonify({'received': user_id}), 200

@listingAPI.route('/matching', methods=['POST'])
def match_jobs_by_skills():
    data = request.get_json()
    user_id = data.get('userID')

    if not user_id:
        return jsonify({"error": "Missing userID"}), 400

    response = supabase.rpc('match_jobs_by_skills', {'user_id': user_id}).execute()

    if not response.data:
        # You can also check response.status_code if needed
        return jsonify({'error': 'No data returned or user embedding not found'}), 500

    print(response.data)

    return jsonify(response.data), 200

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
            'companyName': listing.companylistingmapping_mapping.company_mapping.CompanyName if listing.companylistingmapping_mapping.company_mapping.CompanyName else None,
            'companyLogoURL': listing.companylistingmapping_mapping.company_mapping.CompanyLogoURL,
            'position': listing.Position,
            'location': listing.Location,
            'salary': listing.Salary,
            'description': listing.RoleDescription,
            'qualification': listing.Qualification,
            'detail': listing.Detail,
            'workType': listing.WorkType,
            'workCondition': listing.WorkCondition,
            'experience':listing.Experience,
            'industry':listing.companylistingmapping_mapping.company_mapping.companyindustrylist_mapping.IndustryName,
            'companyID': listing.companylistingmapping_mapping.company_mapping.CompanyID if listing.companylistingmapping_mapping.company_mapping.CompanyID else None,
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

        # Ensure qualification is a list
        qualifications = data.get('qualification', [])
        if not isinstance(qualifications, list):
            return jsonify({'error': 'Qualification must be an array of text'}), 400


        new_listing = Listing(
            ListingID=str(uuid.uuid4()),
            CreatedBy=data.get('createdBy' if data.get('createdBy') else None),
            CompanyID=data.get('companyID' if data.get('companyID') else None),
            Position=data.get('position' if data.get('position') else None),
            Location=data.get('Location' if data.get('Location') else None),
            WorkType=data.get('workType') if data.get('workType') else "Not Specified",
            WorkCondition=data.get('workCondition') if data.get('workCondition') else "Not Specified",
            RoleDescription=data.get('roleDescription', ''),
            Detail=data.get('detail', False),
            Qualification=qualifications,
            ListingPicURL=data.get('listingPicURL', ''),
            Salary=data.get('salary', ''),
            Experience=data.get('experience', ''),
            CreatedOn=datetime.now(),
            #AffectiveUntil=datetime.strptime(data.get('affectiveUntil'), '%Y-%m-%dT%H:%M:%S%z')
            AffectiveUntil = datetime.strptime(data.get('affectiveUntil', (datetime.now(timezone.utc).astimezone() + timedelta(days=7)).strftime('%Y-%m-%dT%H:%M:%S%z')), '%Y-%m-%dT%H:%M:%S%z'),
            # embedding = Embedding
        )

        db.session.add(new_listing)
        db.session.flush()

        parts = [
            new_listing.Position or '',
            new_listing.RoleDescription or '',
            new_listing.Detail or '',
            ', '.join(new_listing.Qualification) if new_listing.Qualification else '',
        ]
        all_text = '\n'.join(parts).strip()
        print(all_text)
        summary = generateSummaryOfListing(all_text)

        summarized_list = [skill.strip() for skill in summary.split(',')]
        position_text = new_listing.Position or ""
        new_listing.GenerativeSummary = summarized_list

        summary_text_for_embedding = '\n'.join(summarized_list)
        embedding_vector = generate_embedding(summary_text_for_embedding)
        new_listing.embedding = embedding_vector

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

    if not query_listing:
        return jsonify({'error': 'Listing not found'}), 404

    listing_json = {
        'listingID': query_listing.ListingID,
        'companyName': query_listing.company_mapping.CompanyName if query_listing.company_mapping else None,
        'companyID': query_listing.CompanyID,
        'position': query_listing.Position,
        'companyLogoURL': query_listing.company_mapping.CompanyLogoURL if query_listing.company_mapping else None,
        'companyLocation': query_listing.company_mapping.CompanyLocation if query_listing.company_mapping else None,
        'industryName': query_listing.company_mapping.companyindustrylist_mapping.IndustryName if query_listing.company_mapping.companyindustrylist_mapping.IndustryName else None,
        'createdBy': f"{query_listing.user_mapping.UserFirstName} {query_listing.user_mapping.UserLastName}" if query_listing.user_mapping else None,
        'createdOn': query_listing.CreatedOn.strftime('%Y-%m-%d %H:%M:%S') if query_listing.CreatedOn else None,
        'workType': query_listing.WorkType if query_listing.WorkType else "Not Specified",
        'workCondition': query_listing.WorkCondition if query_listing.WorkCondition else "Not Specified",
        'roleDescription': query_listing.RoleDescription,
        'detail': query_listing.Detail,
        'qualification': query_listing.Qualification,
        'listingPicURL': query_listing.ListingPicURL,
        'salary': query_listing.Salary,
        'experience': query_listing.Experience,
        'Location': query_listing.Location,
        'affectiveUntil': query_listing.AffectiveUntil.strftime('%Y-%m-%dT%H:%M:%S%z') if query_listing.AffectiveUntil else None
    }


    return jsonify(listing_json)

@listingAPI.route('/delete_listing', methods=['DELETE'])
def delete_listing():
    try:
        listingID = request.args.get('listingID')
        if not listingID:
            return jsonify({'error': 'Missing listingID'}), 400

        result = db.session.query(Listing).filter(Listing.ListingID == listingID).first()
        if not result:
            return jsonify({'error': 'This listing does not exists'}), 409

        db.session.delete(result)
        db.session.commit()


        return jsonify({'message': 'Listing entry deleted successfully'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@listingAPI.route('/edit_listing', methods=['PATCH'])
def edit_listing():
    try:
        # Retrieve the data from the request body
        data = request.get_json()

        # Ensure 'listingID' is provided and valid
        update_listingID = data.get('listingID')
        subject_listing = Listing.query.filter_by(ListingID=update_listingID).first()
        summary_fields_changed = False

        if not subject_listing:
            return jsonify({'error': 'This listing does not exist'}), 409

        if 'position' in data and data['position'] != subject_listing.Position:
            summary_fields_changed = True
        if 'roleDescription' in data and data['roleDescription'] != subject_listing.RoleDescription:
            summary_fields_changed = True
        if 'detail' in data and data['detail'] != subject_listing.Detail:
            summary_fields_changed = True
        if 'qualification' in data and data['qualification'] != subject_listing.Qualification:
            summary_fields_changed = True

        # Set values for the listing's attributes only if provided
        subject_listing.Position = data.get('position', subject_listing.Position)
        subject_listing.WorkType = data.get('workType', subject_listing.WorkType)
        subject_listing.WorkCondition = data.get('workCondition', subject_listing.WorkCondition)
        subject_listing.RoleDescription = data.get('roleDescription', subject_listing.RoleDescription)
        subject_listing.Detail = data.get('detail', subject_listing.Detail)
        subject_listing.Qualification = data.get('qualification', subject_listing.Qualification)
        subject_listing.ListingPicURL = data.get('listingPicURL', subject_listing.ListingPicURL)
        subject_listing.Salary = data.get('salary', subject_listing.Salary)
        subject_listing.Experience = data.get('experience', subject_listing.Experience)

        # Handle updating AffectiveUntil with a default fallback if not provided
        affectiveUntil = data.get('affectiveUntil')
        date_string_with_timezone = affectiveUntil + '+0700'
        if affectiveUntil:
            subject_listing.AffectiveUntil = datetime.strptime(date_string_with_timezone, '%Y-%m-%dT%H:%M:%S%z')
        else:
            # Use current datetime + 7 days as the default
            subject_listing.AffectiveUntil = subject_listing.AffectiveUntil

        if summary_fields_changed:
            parts = [
                subject_listing.Position or '',
                subject_listing.RoleDescription or '',
                subject_listing.Detail or '',
                ', '.join(subject_listing.Qualification) if subject_listing.Qualification else '',
            ]
            all_text = '\n'.join(parts).strip()
            print(all_text)
            summary = generateSummaryOfListing(all_text)

            summarized_list = [skill.strip() for skill in summary.split(',')]
            position_text = subject_listing.Position or ""
            subject_listing.GenerativeSummary = summarized_list

            summary_text_for_embedding = '\n'.join(summarized_list)
            embedding_vector = generate_embedding(summary_text_for_embedding)
            subject_listing.embedding = embedding_vector

        # Commit the updated data to the database
        db.session.commit()

        return jsonify({'message': 'Listing updated successfully'}), 200

    except Exception as e:
        # Print exception details for debugging
        print("Exception occurred:", str(e))
        return jsonify({'error': str(e)}), 500