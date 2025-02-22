from flask import Blueprint, request, jsonify
from app.models.resource import Resource

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