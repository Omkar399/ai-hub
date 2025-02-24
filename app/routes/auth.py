from flask import Blueprint, request, jsonify, session
from app.models.user import User
from app import db
from flask_login import login_user, logout_user, current_user

bp = Blueprint('auth', __name__)

@bp.route('/register', methods=['POST'])
def register():
    """
    Register a new user.
    """
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Check if user already exists
    if User.query.filter_by(email=email).first() or User.query.filter_by(username=username).first():
        return jsonify({"error": "User already exists"}), 400

    # Create new user
    new_user = User(username=username, email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


@bp.route('/login', methods=['POST'])
def login():
    """
    Log in an existing user.
    """
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user is None or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    login_user(user)
    return jsonify({"message": "Logged in successfully", "user": {"id": user.id, "username": user.username}})


@bp.route('/logout', methods=['POST'])
def logout():
    try:
        # Log out the user
        logout_user()
        
        # Clear any additional session data if necessary
        session.clear()

        # Return a success response (JSON or redirect)
        return jsonify({"message": "Successfully logged out"}), 200
    except Exception as e:
        # Handle any unexpected errors gracefully
        return jsonify({"error": str(e)}), 500
    
@bp.route('/check', methods=['GET'])
def check_auth():
    """
    Check if the current user is authenticated.
    """
    if current_user.is_authenticated:
        return jsonify({"loggedIn": True, "user": {"id": current_user.id, "username": current_user.username}})
    
    return jsonify({"loggedIn": False}), 401
