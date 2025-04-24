from datetime import datetime
from .__init__ import db

class Company(db.Model):
    __tablename__ = 'Company'
    __table_args__ = {'schema': 'SP2024-4'}

    CompanyID = db.Column(db.String(36), primary_key=True)
    CompanyName = db.Column(db.String(100), nullable=False)
    CompanyAbout = db.Column(db.String(1000), nullable=False)
    CompanyOverview = db.Column(db.String(2000), nullable=False)
    CompanyLogoURL = db.Column(db.String(200))
    CompanyLocation = db.Column(db.String(200))
    IndustryID = db.Column(db.Integer, db.ForeignKey('SP2024-4.CompanyIndustryList.IndustryID'))
    CreatedBy = db.Column(db.String(50), db.ForeignKey('SP2024-4.User.UserID'))
    CreatedOn = db.Column(db.DateTime, default=datetime.now)
    CompanySize = db.Column(db.Integer)
    CompanyPhone = db.Column(db.Text)
    CompanyEmail = db.Column(db.Text)
    CompanyWebsite = db.Column(db.Text)

    from .companyMemberMappingModel import CompanyMemberMapping
    from .companyListingMappingModel import CompanyListingMapping
    from .companyPermissionListModel import CompanyPermissionList
    #NEEDED TO BE HERE TO FIX PROBLEM
    #Before declaring relation, import the class that you want to declear first to ensure that the class will already be created by the time this relation function is called
    user_mapping = db.relationship('User', back_populates='company_mapping')
    userfollowing_mapping = db.relationship('UserFollowing', back_populates='company_mapping')
    companymembermapping_mapping = db.relationship('CompanyMemberMapping', back_populates='company_mapping')
    companylistingmapping_mapping = db.relationship('CompanyListingMapping', back_populates='company_mapping')
    companypermissionlist_mapping = db.relationship('CompanyPermissionList', back_populates='company_mapping')
    listing_mapping = db.relationship('Listing', back_populates='company_mapping')
    companyindustrylist_mapping = db.relationship('CompanyIndustryList', back_populates='company_mapping')