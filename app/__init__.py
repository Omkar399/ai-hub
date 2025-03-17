from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_cors import CORS
from flask_migrate import Migrate  # Import Flask-Migrate
from .config import Config

# Initialize extensions
db = SQLAlchemy()
login_manager = LoginManager()
@login_manager.unauthorized_handler
def unauthorized():
    # Return JSON response for unauthorized access
    return jsonify({"error": "Unauthorized access"}), 401
migrate = Migrate()  # Initialize Flask-Migrate without app or db initially

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config['SECRET_KEY'] = 'your_secret_key'  # Required for signing session cookies
    app.config['SESSION_COOKIE_HTTPONLY'] = True  # Prevent JavaScript access to cookies
    app.config['SESSION_COOKIE_SECURE'] = True  # Set to True if using HTTPS
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'

    app.config.update(
        REMEMBER_COOKIE_SECURE=True,
        REMEMBER_COOKIE_SAMESITE='None',
    )
    # Initialize extensions with the app instance
    db.init_app(app)
    migrate.init_app(app, db)  # Bind Flask-Migrate to app and db
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'
    login_manager.session_protection = 'strong'
    
    # Enable CORS for all routes under /api/*
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
    
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