from datetime import datetime
from .__init__ import db

class Listing(db.Model):
    __tablename__ = 'Listing'
    __table_args__ = {'schema': 'SP2024-4'}

    ListingID = db.Column(db.String(36), primary_key=True)
    CreatedBy = db.Column(db.String(36), db.ForeignKey('SP2024-4.User.UserID'), nullable=False)  # ForeignKey can be added if linked to User
    CompanyID = db.Column(db.String(36), db.ForeignKey('SP2024-4.Company.CompanyID'), nullable=False)  # ForeignKey can be added if linked to Company
    Position = db.Column(db.String(50))
    PeriodOfWork = db.Column(db.Integer)
    WorkCondition = db.Column(db.Integer)
    RoleDescription = db.Column(db.String(1000))
    Detail = db.Column(db.String(2000))
    Qualification = db.Column(db.String(1000))
    ListingPicURL = db.Column(db.String(200))
    CreatedOn = db.Column(db.DateTime, default=datetime.now)
    AffectiveUntil = db.Column(db.DateTime)

    from .companyListingMappingModel import CompanyListingMapping

    # NEEDED TO BE HERE TO FIX PROBLEM
    # Before declaring relation, import the class that you want to declear first to ensure that the class will already be created by the time this relation function is called
    companylistingmapping_mapping = db.relationship('CompanyListingMapping', backref='Listing')
    company_mapping = db.relationship('Company', backref='Listing')