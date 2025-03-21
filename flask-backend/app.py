from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dataModel import db, User
import configparser

app = Flask(__name__)

config = configparser.ConfigParser()
config.read('database.ini')

db_user = config['postgresql']['user']
db_password = config['postgresql']['password']
db_host = config['postgresql']['host']
db_name = config['postgresql']['database']


app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{db_user}:{db_password}@{db_host}/{db_name}?sslmode=require'
db.init_app(app)

CORS(app)  # Enable CORS for all routes


@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({"message": "Hello from Flask!"})

# @app.route('/add_user', methods=['POST'])
# def add_user():
#     try:
#         data = request.json
#         new_user = User(
#             UserID=data['UserID'],
#             UserFirstName=data['UserFirstName'],
#             UserLastName=data['UserLastName'],
#             UserPassword=data['UserPassword'],  # Hash in real apps
#             UserEmail=data['UserEmail'],
#             UserPicURL=data.get('UserPicURL', None),
#             AccountType=data['AccountType'],
#             Validated=data.get('Validated', False),
#             Company=data.get('Company', None),
#             IsActive=data.get('IsActive', True)
#         )
#
#         db.session.add(new_user)
#         db.session.commit()
#         return jsonify({'message': 'User created successfully!'}), 201
#     except Exception as e:
#         return jsonify({'error': str(e)}), 400

@app.route('/add_user_dummy', methods=['GET'])
def add_user():
    try:
        dummy_user = User(
            UserID="test123",
            UserFirstName="John",
            UserLastName="Doe",
            UserPassword="hashed_password",  # Hash in real apps
            UserEmail="johndoe@example.com",
            UserPicURL="https://example.com/john.jpg",
            AccountType=1,
            Validated=True,
            Company="Tech Corp",
            CreatedOn="2016-06-22 19:10:25-07",
            IsActive=True
        )
        db.session.add(dummy_user)
        db.session.commit()
        return jsonify({'message': 'User created successfully!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

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

# @app.route('/createUser', method = ['POST'])
# def createUser():
#     fname=request.form['fname']
#     lname=request.form['lname']
#     email=request.form['email']
#     password=request.form['password']
#     user = User(fname=fname, lname=lname, email=email, password=password)
#     db.session.add(user)
#     db.session.commit()
#     return jsonify({'message': 'User created successfully!'})

@app.route('/users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    users_list = [{'id': user.UserID, 'name': user.UserFirstName, 'email': user.UserEmail} for user in users]
    return jsonify(users_list)

if __name__ == "__main__":
    app.run(debug=True)
