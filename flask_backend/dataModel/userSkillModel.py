from .__init__ import db

class UserSkill(db.Model):
    __tablename__ = 'UserSkill'
    __table_args__ = {'schema': 'SP2024-4'}

    UserID = db.Column(db.String(36), db.ForeignKey('SP2024-4.User.UserID') , primary_key=True)
    Description = db.Column(db.String(500))

    user_mapping = db.relationship('User', back_populates='userskill_mapping')

