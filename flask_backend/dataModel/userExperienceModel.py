from .__init__ import db

class UserExperience(db.Model):
    __tablename__ = 'UserExperience'
    __table_args__ = {'schema': 'SP2024-4'}

    UserID = db.Column(db.String(36), db.ForeignKey('SP2024-4.User.UserID') , primary_key=True)
    Position = db.Column(db.String(50))
    Organization = db.Column(db.String(200))
    PlaceOfWork = db.Column(db.String(200))
    Details = db.Column(db.String(2000))
    StartYear = db.Column(db.Integer)
    FinishYear = db.Column(db.Float)

    user_mapping = db.relationship('User', back_populates='userexperience_mapping')

