import configparser
from datetime import timedelta
import os
from flask import Flask, jsonify, request
from flask.cli import load_dotenv
from flask_cors import CORS

from dataModel.userModel import db, User
from flask_jwt_extended import create_access_token, get_jwt_identity, \
    jwt_required, JWTManager

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
db_name = config['postgresql']['database']

app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{db_user}:{db_password}@{db_host}/{db_name}?sslmode=require'
#app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

from CRUDApi.userAPI import userAPI
from CRUDApi.companyAPI import companyAPI
from CRUDApi.listingAPI import listingAPI
app.register_blueprint(userAPI)
app.register_blueprint(companyAPI)
app.register_blueprint(listingAPI)

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({"message": "Hello from Flask!"})

@app.route('/token', methods=['POST']) #Create new token for login
def create_token():
    email = request.json.get("userEmail", None)
    password = request.json.get("userPassword", None)

    if not email or not password:
        return jsonify({"error": "Invalid email or password"}), 400

    user = User.query.filter_by(UserEmail=email).first() #Each email should have one entry

    if user is None or email != user.UserEmail or password != user.UserPassword:
        if not user is None:
            print(email, user.UserEmail, password, user.UserPassword)   #FOR DEBUGGING ONLY
        return jsonify({"msg": "Bad username or password"}), 401
    firstname = user.UserFirstName
    access_token = create_access_token(identity=firstname)
    return jsonify(access_token=access_token)




@app.route('/api/job', methods=['GET'])
def get_job():
    job_data = {
        "title": "Frontend Software Developer - Junior Web Development Position - React/JavaScript",
        "description": "We are seeking a motivated Junior Frontend Developer to build responsive, user-friendly web applications using React and JavaScript.",
        "company": "MyCompany Limited Co.",
        "company_logo": "your-company-logo-url",
        "listing_image": "your-image-url",
        "posted_days_ago": "2 days ago",
        "duration": "Full-Time",
        "position_level": "Intermediate",
        "work_experience": "0 - 3 years",
        "location": "Bangkok",
        "requirements": [
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, dignissimos?",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, vero?",
            "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nam, totam."
        ]
    }
    return jsonify(job_data)



@app.route('/create_company', methods=['POST'])

# @app.route('/users', methods=['GET'])
# def get_all_users():
#     users = User.query.all()
#     users_list = [{'id': user.UserID, 'name': user.UserFirstName, 'email': user.UserEmail} for user in users]
#     return jsonify(users_list)

@app.route('/users_token', methods=['GET'])
@jwt_required()
def get_all_users_token():
    request_by = get_jwt_identity()
    users = User.query.all()
    users_list = [{'id': user.UserID, 'name': user.UserFirstName, 'email': user.UserEmail} for user in users]
    return jsonify(request_by, users_list)

if __name__ == "__main__":
    app.run(debug=True)
