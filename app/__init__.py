from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_cors import CORS
from flask_migrate import Migrate
from .config import Config
from datetime import timedelta

# Initialize extensions
db = SQLAlchemy()
login_manager = LoginManager()
migrate = Migrate()

@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({"error": "Unauthorized access"}), 401

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Security and Session Configuration
    app.config.update(
        SECRET_KEY='your_secret_key',  # Use environment variable in production
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SECURE=True,
        SESSION_COOKIE_SAMESITE='None',
        SESSION_COOKIE_DOMAIN='ai-hub-v4s7.onrender.com',  # Your backend domain
        PERMANENT_SESSION_LIFETIME=timedelta(days=7),
        REMEMBER_COOKIE_SECURE=True,
        REMEMBER_COOKIE_SAMESITE='None',
        REMEMBER_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_PARTITIONED=True  # Add partitioned attribute
    )

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'
    login_manager.session_protection = 'strong'
    
    # Update CORS configuration
    CORS(app, 
         resources={
             r"/*": {
                 "origins": ["https://aihub-omkar399-omkar399s-projects.vercel.app"],
                 "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                 "allow_headers": ["Content-Type", "Authorization"],
                 "supports_credentials": True,
                 "expose_headers": ["Access-Control-Allow-Origin"]
             }
         }
    )

    # Add CORS headers to all responses
    @app.after_request
    def after_request(response):
        origin = request.headers.get('Origin')
        if origin == 'https://aihub-omkar399-omkar399s-projects.vercel.app':
            response.headers.update({
                'Access-Control-Allow-Origin': origin,
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Vary': 'Origin'
            })
        return response

    # Register blueprints
    from app.routes.main import bp as main_bp
    from app.routes.github import bp as github_bp
    from app.routes.resource import bp as resource_bp
    from app.routes.auth import bp as auth_bp
    from app.routes.bookmarks import bp as bookmarks_bp
    from app.routes.admin import bp as admin_bp
    from app.routes.chat import bp as chat_bp
    
    app.register_blueprint(main_bp)
    app.register_blueprint(github_bp, url_prefix='/api')
    app.register_blueprint(resource_bp, url_prefix='/api')
    app.register_blueprint(bookmarks_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(admin_bp, url_prefix='/api')
    app.register_blueprint(chat_bp, url_prefix='/api')

    register_error_handlers(app)
    return app

def register_error_handlers(app):
    """Register custom error pages."""
    @app.errorhandler(404)
    def not_found_error(error):
        return "Page not found", 404

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()  # Rollback any failed database transactions
        return "An internal error occurred", 500