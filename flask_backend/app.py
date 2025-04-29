import configparser, os
from datetime import timedelta
from flask import Flask, jsonify, request
from flask.cli import load_dotenv
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from dataModel.__init__ import db


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

load_dotenv()

# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET')
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)

config = configparser.ConfigParser()
config.read('database.ini')

db_user = config['postgresql']['user']
db_password = config['postgresql']['password']
db_host = config['postgresql']['host']
db_name = config['postgresql']['dbname']



app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{db_user}:{db_password}@{db_host}/{db_name}?sslmode=require'
#app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

db.init_app(app)


from CRUDApi.userAPI import userAPI
from CRUDApi.companyAPI import companyAPI
from CRUDApi.listingAPI import listingAPI
from CRUDApi.userApplicationAPI import userApplicationAPI
from CRUDApi.userBookmarkAPI import userBookmarkAPI
from CRUDApi.userEducationAPI import userEducationAPI
from CRUDApi.companyMemberMappingAPI import companyMemberMappingAPI
from CRUDApi.companyIndustryListAPI import companyIndustryListAPI
from CRUDApi.companyListingMappingAPI import companyListingMappingAPI
from CRUDApi.companyPermissionListAPI import companyPermissionListAPI
from CRUDApi.listingApplicantMappingAPI import listingApplicantMappingAPI
from CRUDApi.userProfileAPI import userProfileAPI
from CRUDApi.aiAPI import aiAPI
from AI.generativeUser import generateQueryFromURL
app.register_blueprint(userAPI)
app.register_blueprint(companyAPI)
app.register_blueprint(listingAPI)
app.register_blueprint(userApplicationAPI)
app.register_blueprint(userBookmarkAPI)
app.register_blueprint(userEducationAPI)
app.register_blueprint(companyMemberMappingAPI)
app.register_blueprint(companyIndustryListAPI)
app.register_blueprint(companyListingMappingAPI)
app.register_blueprint(companyPermissionListAPI)
app.register_blueprint(listingApplicantMappingAPI)
app.register_blueprint(userProfileAPI)

app.register_blueprint(aiAPI)

if __name__ == "__main__":
    app.run(debug=True)
