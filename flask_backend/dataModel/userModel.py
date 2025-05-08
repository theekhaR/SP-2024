from datetime import datetime
from .__init__ import db

#Snake case = Python / Camel case = JSON

class User(db.Model): #To indicate that this is a database model
    __tablename__ = 'User'
    __table_args__ = {'schema': 'SP2024-4'}

    UserID = db.Column(db.String(36), primary_key=True)
    UserFirstName = db.Column(db.String(50), nullable=False)
    UserLastName = db.Column(db.String(50), nullable=False)
    UserPassword = db.Column(db.String(100), nullable=False)
    UserEmail = db.Column(db.String(100), unique=True, nullable=False)
    UserPicURL = db.Column(db.Text)
    AccountType = db.Column(db.Integer, nullable=False)
    Validated = db.Column(db.Boolean, default=False)
    Company = db.Column(db.String(2000))
    CreatedOn = db.Column(db.DateTime, default=datetime.now)
    IsActive = db.Column(db.Boolean, default=True)

    from .companyMemberMappingModel import CompanyMemberMapping
    company_mapping = db.relationship('Company', back_populates='user_mapping')
    companymembermapping_mapping = db.relationship('CompanyMemberMapping', back_populates='user_mapping')
    listing_mapping = db.relationship('Listing', back_populates='user_mapping')

    from .userApplicationModel import UserApplication
    from .userBookmarkModel import UserBookmark
    from .userEducationModel import UserEducation
    from .userExperienceModel import UserExperience
    from .userFollowingModel import UserFollowing
    from .userProfileModel import UserProfile
    from .userSkillModel import UserSkill

    userapplication_mapping = db.relationship('UserApplication', back_populates='user_mapping')
    userbookmark_mapping = db.relationship('UserBookmark', back_populates='user_mapping')
    usercareerpath_mapping = db.relationship('UserCareerPath', back_populates='user_mapping')
    usereducation_mapping = db.relationship('UserEducation', back_populates='user_mapping')
    userexperience_mapping = db.relationship('UserExperience', back_populates='user_mapping')
    userfollowing_mapping = db.relationship('UserFollowing', back_populates='user_mapping')
    userprofile_mapping = db.relationship('UserProfile', back_populates='user_mapping')
    userskill_mapping = db.relationship('UserSkill', back_populates='user_mapping')
    listingapplicantmapping_mapping = db.relationship('ListingApplicantMapping', back_populates='user_mapping')


