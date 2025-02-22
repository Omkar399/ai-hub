from flask import Blueprint, jsonify
from app.services.github_services import fetch_trending_repos

bp = Blueprint('github', __name__)

@bp.route('/github/trending', methods=['GET'])
def trending_repos():
    try:
        repos = fetch_trending_repos()  # Fetch trending repositories using the service function
        return jsonify(repos)           # Return repositories as JSON
    except Exception as e:
        return jsonify({"error": str(e)}), 500