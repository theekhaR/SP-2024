from .__init__ import db

class CompanyListingMapping(db.Model):
    __tablename__ = 'CompanyListingMapping'
    __table_args__ = {'schema': 'SP2024-4'}

    CompanyID = db.Column(db.String(50), db.ForeignKey('SP2024-4.Company.CompanyID'), primary_key=True)
    ListingID = db.Column(db.String(50), db.ForeignKey('SP2024-4.Listing.ListingID'), primary_key=True)

