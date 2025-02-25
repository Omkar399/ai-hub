from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models.resource import Resource
from app import db

bp = Blueprint('resource', __name__)

@bp.route('/resources', methods=['GET'])
def get_resources():
    """
    Get all resources or filter by category or search query.
    """
    category = request.args.get('category')
    query = request.args.get('query')

    resources_query = Resource.query.filter_by(approved=True)

    if category:
        resources_query = resources_query.filter(Resource.category.has(name=category))
    
    if query:
        resources_query = resources_query.filter(
            Resource.title.ilike(f'%{query}%') |
            Resource.description.ilike(f'%{query}%')
        )

    resources = resources_query.all()
    
    return jsonify([resource.to_dict() for resource in resources])

@bp.route('/resources', methods=['POST'])
@login_required  # Ensure only logged-in users can access this endpoint
def submit_resource():
    """
    Allow authenticated users to submit a resource.
    """
    data = request.json

    try:
        # Create a new resource and associate it with the current user
        resource = Resource(
            title=data['title'],
            description=data.get('description', ''),  # Optional field
            url=data['url'],
            category_id=data['category_id'],  # Ensure category exists in the database
            approved=False,  # Default to not approved
            submitted_by=current_user.id  # Associate with the logged-in user
        )
        db.session.add(resource)
        db.session.commit()

        return jsonify({"message": "Resource submitted successfully! Awaiting admin approval."}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@bp.route('/resources/pending', methods=['GET'])
@login_required  # Ensure only admins or authenticated users can access this route
def get_pending_resources():
    """
    Fetch all unapproved resources for admin moderation.
    """
    pending_resources = Resource.query.filter_by(approved=False).all()

    return jsonify([
        {
            **resource.to_dict(),
            "submitted_by": resource.submitted_by_user.username if resource.submitted_by_user else "Unknown"  # Include submitter's name
        }
        for resource in pending_resources
    ])

@bp.route('/resources/<int:resource_id>', methods=['PATCH'])
@login_required
def update_resource_status(resource_id):
    # Only allow admin users to update the approval status
    if current_user.username != 'admin':
        return jsonify({"error": "Access denied. Admins only."}), 403

    resource = Resource.query.get_or_404(resource_id)
    data = request.get_json() or {}

    if 'approved' not in data:
        return jsonify({"error": "Missing 'approved' field in request."}), 400

    resource.approved = data['approved']
    db.session.commit()
    return jsonify(resource.to_dict()), 200

@bp.route('/resources/<int:resource_id>', methods=['DELETE'])
@login_required
def delete_resource(resource_id):
    """
    Delete a resource by ID. Only accessible by admin users.
    """
    # Ensure only admins can delete resources
    if current_user.username != 'admin':
        return jsonify({"error": "Access denied. Admins only."}), 403

    resource = Resource.query.get_or_404(resource_id)

    try:
        db.session.delete(resource)
        db.session.commit()
        return jsonify({"message": f"Resource with ID {resource_id} successfully deleted."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500