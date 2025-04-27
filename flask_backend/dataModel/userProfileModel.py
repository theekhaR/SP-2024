from .__init__ import db

class UserProfile(db.Model):
    __tablename__ = 'UserProfile'
    __table_args__ = {'schema': 'SP2024-4'}

    UserID = db.Column(db.String(36), db.ForeignKey('SP2024-4.User.UserID') , primary_key=True)
    DoB = db.Column(db.DateTime)
    Sex = db.Column(db.Integer)
    Phone = db.Column(db.String(100))
    About = db.Column(db.String(2000))
    CV = db.Column(db.String(200))
    Portfolio = db.Column(db.ARRAY(db.Text))

    user_mapping = db.relationship('User', back_populates='userprofile_mapping')

