from datetime import datetime
from .__init__ import db

#Snake case = Python / Camel case = JSON

class User(db.Model): #To indicate that this is a database model
    __tablename__ = 'User'
    __table_args__ = {'schema': 'SP2024-4'}

    UserID = db.Column(db.String(50), primary_key=True)
    UserFirstName = db.Column(db.String(50), nullable=False)
    UserLastName = db.Column(db.String(50), nullable=False)
    UserPassword = db.Column(db.String(100), nullable=False)
    UserEmail = db.Column(db.String(100), unique=True, nullable=False)
    UserPicURL = db.Column(db.String(100))
    AccountType = db.Column(db.Integer, nullable=False)
    Validated = db.Column(db.Boolean, default=False)
    Company = db.Column(db.String(2000))
    CreatedOn = db.Column(db.DateTime, default=datetime.now)
    IsActive = db.Column(db.Boolean, default=True)

    from .companyMemberMappingModel import CompanyMemberMapping
    companies = db.relationship('Company', backref='User')
    companies_mapping = db.relationship('CompanyMemberMapping', backref='User')

