import configparser
from datetime import datetime, timedelta
import uuid
import os
from flask import Flask, jsonify, request
from flask.cli import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.debug import console

from dataModel import db, User
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager


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

    access_token = create_access_token(identity=email) #To be upgraded
    return jsonify(access_token=access_token)


@app.route('/create_user', methods=['POST'])
def add_user():
    try:
        data = request.get_json()
        print(data)
        if not data or 'userEmail' not in data or 'userPassword' not in data or 'userFirstName' not in data or 'userLastName' not in data:
            return jsonify({'error': 'Missing required fields'}), 400

        # Check if user already exists
        existing_user = User.query.filter_by(UserEmail=data['userEmail']).first()
        if existing_user:
            return jsonify({'error': 'User with this email already exists'}), 409

        new_user = User(
            UserID=str(uuid.uuid4()),  # Generate a unique ID
            UserFirstName=data.get('userFirstName', ''),
            UserLastName=data.get('userLastName', ''),
            UserPassword=data['userPassword'],  # Hash password
            UserEmail=data['userEmail'],
            UserPicURL=data.get('userPicURL', ''),
            AccountType=data.get('accountType', 0),
            Validated=data.get('validated', False),
            Company=data.get('company', ''),
            CreatedOn=datetime.now(),
            IsActive=True
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'User created successfully', 'UserID': new_user.UserID}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# @app.route('/api/job', methods=['GET'])
# def get_job():
#     job_data = {
#         "title": "Frontend Software Developer - Junior Web Development Position - React/JavaScript",
#         "description": "We are seeking a motivated Junior Frontend Developer to build responsive, user-friendly web applications using React and JavaScript.",
#         "company": "MyCompany Limited Co.",
#         "company_logo": "your-company-logo-url",
#         "listing_image": "your-image-url",
#         "posted_days_ago": "2 days ago",
#         "duration": "Full-Time",
#         "position_level": "Intermediate",
#         "work_experience": "0 - 3 years",
#         "location": "Bangkok",
#         "requirements": [
#             "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, dignissimos?",
#             "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, vero?",
#             "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nam, totam."
#         ]
#     }
#     return jsonify(job_data)

@app.route('/users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    users_list = [{'id': user.UserID, 'name': user.UserFirstName, 'email': user.UserEmail} for user in users]
    return jsonify(users_list)

if __name__ == "__main__":
    app.run(debug=True)
