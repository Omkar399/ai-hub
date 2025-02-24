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
    resource_id = data.get('resource_id')  # For local resources
    title = data.get('title')  # For external resources
    description = data.get('description')
    url = data.get('url')
    source = data.get('source')

    if not url or not title or not source:
        return jsonify({"error": "Title, URL, and source are required"}), 400

    # Handle local resources with resource_id
    if resource_id:
        resource = Resource.query.get(resource_id)
        if not resource:
            return jsonify({"error": "Resource not found"}), 404

        # Check if the bookmark already exists for local resources
        existing_bookmark = Bookmark.query.filter_by(user_id=current_user.id, resource_id=resource_id).first()
        if existing_bookmark:
            return jsonify({"message": "Bookmark already exists"}), 400

        new_bookmark = Bookmark(user_id=current_user.id, resource_id=resource_id, title=resource.title,
                                description=resource.description, url=resource.url, source="local")

    # Handle external resources (e.g., arXiv, PapersWithCode)
    else:
        # Check if the bookmark already exists for external resources by URL
        existing_bookmark = Bookmark.query.filter_by(user_id=current_user.id, url=url).first()
        if existing_bookmark:
            return jsonify({"message": "Bookmark already exists"}), 400

        new_bookmark = Bookmark(user_id=current_user.id, title=title, description=description,
                                url=url, source=source)

    # Save the new bookmark to the database
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
    
    # Convert bookmarks to JSON format
    results = []
    for bookmark in bookmarks:
        results.append({
            "id": bookmark.id,
            "title": bookmark.title,
            "description": bookmark.description,
            "url": bookmark.url,
            "source": bookmark.source,
        })

    return jsonify(results)


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
