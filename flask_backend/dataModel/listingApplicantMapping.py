from datetime import datetime
from .__init__ import db

class ListingApplicantMapping(db.Model):
    __tablename__ = 'ListingApplicantMapping'
    __table_args__ = {'schema': 'SP2024-4'}

    ListingID = db.Column(db.String(36), db.ForeignKey('SP2024-4.Listing.ListingID'), nullable=False)  # ForeignKey can be added if linked to User
    UserID = db.Column(db.String(36), db.ForeignKey('SP2024-4.User.UserID'), nullable=False)  # ForeignKey can be added if linked to Company
    AppliedOn = db.Column(db.DateTime, default=datetime.now)
    Status = db.Column(db.Integer)
    Memo = db.Column(db.String(500))
    Score = db.Column(db.Integer)

    user_mapping = db.relationship('User', back_populates='listingapplicantmapping_mapping')
    listing_mapping = db.relationship('Listing', back_populates='listingapplicantmapping_mapping')
    company_mapping = db.relationship('Company', back_populates='listingapplicantmapping_mapping')