from .__init__ import db

class CompanyIndustryList(db.Model): #To indicate that this is a database model
    __tablename__ = 'CompanyIndustryList'
    __table_args__ = {'schema': 'SP2024-4'}

    IndustryID = db.Column(db.Integer, primary_key=True)
    IndustryName = db.Column(db.String(50))

    from .companyModel import Company
    company_mapping = db.relationship('Company', back_populates='companyindustrylist_mapping')

    #Backref is essentially an additional column created to link to the parent column
    #which in this case in CompanyIndustryList table


    # So, when to get the IndustryName that was set in the CompanyIndustryList table
    # you can access the name using "Industry" as a connection
    # IndustryID': company.Industry.IndustryName,
