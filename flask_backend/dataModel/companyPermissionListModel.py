from .__init__ import db

class CompanyPermissionList(db.Model):
    __tablename__ = 'CompanyPermissionList'
    __table_args__ = {'schema': 'SP2024-4'}

    CompanyID = db.Column(db.String(50), db.ForeignKey('SP2024-4.Company.CompanyID'), primary_key=True)
    PermissionName = db.Column(db.String(100))
    PermissionID = db.Column(db.Integer, primary_key=True)

    CompanyMemberMapping = db.relationship('CompanyMemberMapping',backref='CompanyPermissionList')
    CompanyMapping = db.relationship('Company', backref='CompanyPermissionList')

    # primaryjoin='and_(''CompanyPermissionList.PermissionID == CompanyMemberMapping.PermissionID)'