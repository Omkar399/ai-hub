from flask import Blueprint, request, jsonify

bp = Blueprint('admin', __name__)

@bp.route('/admin/approve', methods=['POST'])
def approve_resource():
    resource_id = request.json.get('resource_id')
    # Logic to approve resource in the database goes here.
    return jsonify({'message': 'Resource approved'})