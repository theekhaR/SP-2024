from datetime import datetime
from .__init__ import db

class Company(db.Model):
    __tablename__ = 'Company'
    __table_args__ = {'schema': 'SP2024-4'}

    CompanyID = db.Column(db.String(36), primary_key=True)
    CompanyName = db.Column(db.String(100), nullable=False)
    CompanyAbout = db.Column(db.String(1000), nullable=False)
    CompanyOverview = db.Column(db.String(2000), nullable=False)
    CompanySite = db.Column(db.String(200))
    CompanyLocation = db.Column(db.String(200))
    IndustryID = db.Column(db.Integer, db.ForeignKey('SP2024-4.CompanyIndustryList.IndustryID'))
    CreatedBy = db.Column(db.String(50), db.ForeignKey('SP2024-4.User.UserID'))
    CreatedOn = db.Column(db.DateTime, default=datetime.now)

    from .companyMemberMappingModel import CompanyMemberMapping
    from .companyListingMappingModel import CompanyListingMapping
    from .companyPermissionListModel import CompanyPermissionList
    #NEEDED TO BE HERE TO FIX PROBLEM
    #Before declaring relation, import the class that you want to declear first to ensure that the class will already be created by the time this relation function is called
    member_mapping = db.relationship('CompanyMemberMapping', backref='Company')
    listing_mapping = db.relationship('CompanyListingMapping', backref='Company')
    permission_mapping = db.relationship('CompanyPermissionList', backref='Company')