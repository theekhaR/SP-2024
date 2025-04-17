from flask import blueprints , jsonify, request
from datetime import datetime, timedelta
import uuid
from dataModel.listingModel import db, Listing
from dataModel.companyModel import Company
from dataModel.companyListingMappingModel import CompanyListingMapping
from dataModel.userModel import User

listingAPI = blueprints.Blueprint('listingAPI', __name__)

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
    return jsonify(listings_list)

@listingAPI.route('/create_listing', methods=['POST'])
def create_listing():
    try:
        data = request.get_json()
        if (not data or
                'createdBy' not in data or not data.get('createdBy') or
                'position' not in data or not data.get('position') or
                'affectiveUntil' not in data or not data.get('affectiveUntil') or
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
            PeriodOfWork=int(data.get('periodOfWork', 1)) if data.get('periodOfWork' and data.get('periodOfWork').isdigit()) else 1,
            WorkCondition=int(data.get('workCondition', 1)) if data.get('workCondition' and data.get('workCondition').isdigit()) else 1,
            RoleDescription=data.get('roleDescription', ''),
            Detail=data.get('detail', False),
            Qualification=data.get('qualification', ''),
            ListingPicURL=data.get('listingPicURL', ''),
            CreatedOn=datetime.now(),
            AffectiveUntil=datetime.strptime(data.get('affectiveUntil', (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%dT%H:%M:%S.%f%z')), '%Y-%m-%dT%H:%M:%S.%f%z')
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