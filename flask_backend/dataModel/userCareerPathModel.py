from .__init__ import db

class UserCareerPath(db.Model):
    __tablename__ = 'UserCareerPath'
    __table_args__ = {'schema': 'SP2024-4'}

    UserID = db.Column(db.String(36), db.ForeignKey('SP2024-4.User.UserID') , primary_key=True)
    CareerName = db.Column(db.Text, primary_key=True)
    Explanation = db.Column(db.Text)

    user_mapping = db.relationship('User', back_populates='usercareerpath_mapping')

