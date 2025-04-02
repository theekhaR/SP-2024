from flask import blueprints , jsonify, request
from datetime import datetime, timedelta
from dataModel.userModel import db, User
import uuid

userAPI = blueprints.Blueprint('userAPI', __name__)

@userAPI.route('/users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    users_list = [{'id': user.UserID, 'name': user.UserFirstName, 'email': user.UserEmail} for user in users]
    return jsonify(users_list)

@userAPI.route('/create_user', methods=['POST'])
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