from datetime import datetime
from .__init__ import db

class Listing(db.Model):
    __tablename__ = 'Listing'
    __table_args__ = {'schema': 'SP2024-4'}

    ListingID = db.Column(db.String(36), primary_key=True)
    CreatedBy = db.Column(db.String(36), db.ForeignKey('SP2024-4.User.UserID'), nullable=False)  # ForeignKey can be added if linked to User
    CompanyID = db.Column(db.String(36), db.ForeignKey('SP2024-4.Company.CompanyID'), nullable=False)  # ForeignKey can be added if linked to Company
    Position = db.Column(db.String(50))
    WorkType = db.Column(db.Text)
    WorkCondition = db.Column(db.Text)
    RoleDescription = db.Column(db.String(1000))
    Detail = db.Column(db.Text)
    Qualification = db.Column(db.ARRAY(db.Text))
    ListingPicURL = db.Column(db.String(200))
    CreatedOn = db.Column(db.DateTime, default=datetime.now)
    AffectiveUntil = db.Column(db.DateTime)
    Salary = db.Column(db.String(200))
    Experience = db.Column(db.String(200))
    GenerativeSummary = db.Column(db.ARRAY(db.Text))
    Location = db.Column(db.Text)

    from .companyListingMappingModel import CompanyListingMapping

    # NEEDED TO BE HERE TO FIX PROBLEM
    # Before declaring relation, import the class that you want to declear first to ensure that the class will already be created by the time this relation function is called

    # uselist = False will return object as the object instead of a list
    # only use when it's a one to one. e.g. when the Mapping table can only map one A to one B, the A and mapping table relationship should be one-to-one

    companylistingmapping_mapping = db.relationship('CompanyListingMapping', back_populates='listing_mapping', uselist=False, cascade='all, delete-orphan',
                                                    passive_deletes=True,
                                                    single_parent=True)
    company_mapping = db.relationship('Company', back_populates='listing_mapping')
    user_mapping = db.relationship('User', back_populates='listing_mapping')
    userapplication_mapping = db.relationship('UserApplication', back_populates='listing_mapping')
    userbookmark_mapping = db.relationship('UserBookmark', back_populates='listing_mapping')
    listingapplicantmapping_mapping = db.relationship('ListingApplicantMapping', back_populates='listing_mapping')