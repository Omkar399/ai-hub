from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user

bp = Blueprint('admin', __name__)

@bp.route('/admin-panel', methods=['GET'])
@login_required  # Ensure only logged-in users can access this endpoint
def admin_panel():
    """
    Admin panel for managing pending resources.
    Only accessible by users with the username 'admin'.
    """
    if current_user.username != 'admin':
        return jsonify({"error": "Access denied. Admins only."}), 403

    pending_resources = Resource.query.filter_by(approved=False).all()
    return jsonify([resource.to_dict() for resource in pending_resources])
