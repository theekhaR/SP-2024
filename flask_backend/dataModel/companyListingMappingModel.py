from .__init__ import db

class CompanyListingMapping(db.Model):
    __tablename__ = 'CompanyListingMapping'
    __table_args__ = {'schema': 'SP2024-4'}

    CompanyID = db.Column(db.String(50), db.ForeignKey('SP2024-4.Company.CompanyID'))
    ListingID = db.Column(db.String(50), db.ForeignKey('SP2024-4.Listing.ListingID'), primary_key=True)

    listing_mapping = db.relationship('Listing', back_populates='companylistingmapping_mapping', uselist=False)
    company_mapping = db.relationship('Company', back_populates='companylistingmapping_mapping')