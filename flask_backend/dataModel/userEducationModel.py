from .__init__ import db

class UserEducation(db.Model):
    __tablename__ = 'UserEducation'
    __table_args__ = {'schema': 'SP2024-4'}

    UserID = db.Column(db.String(36), db.ForeignKey('SP2024-4.User.UserID') , primary_key=True)
    PlaceOfEducation = db.Column(db.String(200))
    Degree = db.Column(db.String(200))
    Cirriculum = db.Column(db.String(200))
    StartYear = db.Column(db.Integer)
    EndYear = db.Column(db.Integer)
    GPA = db.Column(db.Float)

    user_mapping = db.relationship('User', back_populates='usereducation_mapping')

