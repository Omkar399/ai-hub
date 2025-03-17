from flask import Blueprint, request, jsonify, session, current_app
from app.models.user import User
from app import db
from flask_login import login_user, logout_user, current_user
from flask_cors import cross_origin

bp = Blueprint('auth', __name__)

@bp.route('/register', methods=['POST', 'OPTIONS'])
@cross_origin(supports_credentials=True)
def register():
    if request.method == 'OPTIONS':
        return handle_preflight()

    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if User.query.filter_by(email=email).first() or User.query.filter_by(username=username).first():
        return jsonify({"error": "User already exists"}), 400

    new_user = User(username=username, email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

@bp.route('/login', methods=['POST', 'OPTIONS'])
@cross_origin(supports_credentials=True)
def login():
    if request.method == 'OPTIONS':
        return handle_preflight()

    try:
        data = request.json
        user = User.query.filter_by(email=data.get('email')).first()

        if user and user.check_password(data.get('password')):
            login_user(user, remember=True)
            session.permanent = True
            return jsonify({
                "loggedIn": True,
                "user": {"id": user.id, "username": user.username}
            })
        return jsonify({"error": "Invalid email or password"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/check', methods=['GET', 'OPTIONS'])
@cross_origin(supports_credentials=True)
def check_auth():
    if request.method == 'OPTIONS':
        return handle_preflight()

    try:
        if current_user.is_authenticated:
            return jsonify({
                "loggedIn": True,
                "user": {"id": current_user.id, "username": current_user.username}
            })
        return jsonify({"loggedIn": False}), 401
    except Exception as e:
        print(f"Auth check error: {str(e)}")
        return jsonify({"loggedIn": False, "error": str(e)}), 401

@bp.route('/logout', methods=['POST', 'OPTIONS'])
@cross_origin(supports_credentials=True)
def logout():
    if request.method == 'OPTIONS':
        return handle_preflight()

    try:
        logout_user()
        session.clear()
        return jsonify({"message": "Successfully logged out"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def handle_preflight():
    response = jsonify({"status": "ok"})
    origin = request.headers.get('Origin')
    if origin == 'https://aihub-omkar399-omkar399s-projects.vercel.app':
        response.headers.update({
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': '3600'
        })
    return response
