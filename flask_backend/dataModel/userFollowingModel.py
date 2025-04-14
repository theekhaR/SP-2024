from .__init__ import db

class UserFollowing(db.Model):
    __tablename__ = 'UserFollowing'
    __table_args__ = {'schema': 'SP2024-4'}

    UserID = db.Column(db.String(36), db.ForeignKey('SP2024-4.User.UserID') , primary_key=True)
    CompanyID = db.Column(db.String(36), db.ForeignKey('SP2024-4.Company.CompanyID'), primary_key=True)

    user_mapping = db.relationship('User', back_populates='userfollowing_mapping')
    company_mapping = db.relationship('Company', back_populates='userfollowing_mapping')

