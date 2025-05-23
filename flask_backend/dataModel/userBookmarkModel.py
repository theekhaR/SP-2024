from .__init__ import db

class UserBookmark(db.Model):
    __tablename__ = 'UserBookmark'
    __table_args__ = {'schema': 'SP2024-4'}

    UserID = db.Column(db.String(36), db.ForeignKey('SP2024-4.User.UserID') , primary_key=True)
    ListingID = db.Column(db.String(36), db.ForeignKey('SP2024-4.Listing.ListingID'), primary_key=True)

    user_mapping = db.relationship('User', back_populates='userbookmark_mapping')
    listing_mapping = db.relationship('Listing', back_populates='userbookmark_mapping')

