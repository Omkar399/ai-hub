from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models.bookmarks import Bookmark
from app.models.resource import Resource
from app import db

bp = Blueprint('bookmarks', __name__)

@bp.route('/bookmarks', methods=['POST'])
@login_required
def add_bookmark():
    """
    Add a bookmark for the current user.
    """
    data = request.json
    resource_id = data.get('resource_id')

    # Check if the resource exists
    resource = Resource.query.get(resource_id)
    if not resource:
        return jsonify({"error": "Resource not found"}), 404

    # Check if the bookmark already exists
    existing_bookmark = Bookmark.query.filter_by(user_id=current_user.id, resource_id=resource_id).first()
    if existing_bookmark:
        return jsonify({"message": "Bookmark already exists"}), 400

    # Create a new bookmark
    new_bookmark = Bookmark(user_id=current_user.id, resource_id=resource_id)
    db.session.add(new_bookmark)
    db.session.commit()

    return jsonify({"message": "Bookmark added successfully"}), 201


@bp.route('/bookmarks', methods=['GET'])
@login_required
def get_bookmarks():
    """
    Retrieve all bookmarks for the current user.
    """
    bookmarks = Bookmark.query.filter_by(user_id=current_user.id).all()
    resources = [Resource.query.get(bookmark.resource_id).to_dict() for bookmark in bookmarks]
    
    return jsonify(resources)


@bp.route('/bookmarks/<int:bookmark_id>', methods=['DELETE'])
@login_required
def delete_bookmark(bookmark_id):
    """
    Delete a bookmark by ID.
    """
    bookmark = Bookmark.query.get(bookmark_id)

    if not bookmark or bookmark.user_id != current_user.id:
        return jsonify({"error": "Bookmark not found"}), 404

    db.session.delete(bookmark)
    db.session.commit()

    return jsonify({"message": "Bookmark deleted successfully"}), 200
