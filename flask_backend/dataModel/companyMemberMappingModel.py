from .__init__ import db

class CompanyMemberMapping(db.Model):
    __tablename__ = 'CompanyMemberMapping'
    __table_args__ = {'schema': 'SP2024-4'}

    CompanyID = db.Column(db.String(50), db.ForeignKey('SP2024-4.Company.CompanyID'), primary_key=True)
    UserID = db.Column(db.String(50), db.ForeignKey('SP2024-4.User.UserID'), primary_key=True)
    Role = db.Column(db.String(100))
    PermissionID = db.Column(db.Integer, db.ForeignKey('SP2024-4.CompanyPermissionList.PermissionID'))

    companypermissionlist_mapping = db.relationship('CompanyPermissionList', back_populates='companymembermapping_mapping')
    company_mapping = db.relationship('Company', back_populates='companymembermapping_mapping')
    user_mapping = db.relationship('User', back_populates='companymembermapping_mapping')
