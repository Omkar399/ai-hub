from flask import Blueprint, render_template, request, jsonify
from app.models.resource import Resource
from app.utils.chatbot import AIAssistant
from app.models.resource import Category  # Ensure this is imported if using categories
from app.services.arxiv_service import fetch_arxiv_papers
from app.services.paperswithcode_service import fetch_papers_with_code
from app.services.google_search_service import search_google
from app.services.coursera_service import fetch_coursera_courses
from app.services.medium_service import scrape_tds_articles
from app.services.github_services import search_github_repositories
from app.services.tutorials_service import fetch_google_tutorials

bp = Blueprint('main', __name__)
chatbot = AIAssistant()

@bp.route('/')
def index():
    resources = Resource.query.filter_by(approved=True).all()
    return render_template('index.html', resources=resources)

@bp.route('/search')
def search():
    """
    Search for resources in the local database or external APIs.
    """
    query = request.args.get('q', '')  # Search query
    category = request.args.get('category', '')  # Category filter
    source = request.args.get('source', 'local')  # Source: local, arxiv, paperswithcode, google

    results = []

    # Step 1: Search in the local database
    if source == 'local':
        resources_query = Resource.query.filter(Resource.approved == True)

        if query:
            resources_query = resources_query.filter(
                Resource.title.ilike(f'%{query}%') |
                Resource.description.ilike(f'%{query}%')
            )

        if category:
            # Use a join to filter by category name
            resources_query = resources_query.join(Category).filter(Category.name.ilike(f'%{category}%'))

        resources = resources_query.all()

        # Return results as JSON
        return jsonify([resource.to_dict() for resource in resources])

    # Step 2: Fetch from arXiv API
    elif source == 'arxiv':
        try:
            results.extend(fetch_arxiv_papers(query))
        except Exception as e:
            return jsonify({"error": f"Failed to fetch data from arXiv: {str(e)}"}), 500

    # Step 3: Fetch from PapersWithCode API
    elif source == 'paperswithcode':
        try:
            results.extend(fetch_papers_with_code(query))
        except Exception as e:
            return jsonify({"error": f"Failed to fetch data from PapersWithCode: {str(e)}"}), 500

    # Step 4: Fetch from Google Search API
    elif source == 'google':
        try:
            results.extend(search_google(query))
        except Exception as e:
            return jsonify({"error": f"Failed to fetch data from Google Search: {str(e)}"}), 500
    
    elif source == 'coursera':
        try:
            courses = fetch_coursera_courses(query)
            print(f"Fetched courses from Coursera: {courses}")
            results.extend(courses)
        except Exception as e:
            return jsonify({"error": f"Failed to fetch data from Coursera: {str(e)}"}), 500
        
    elif source == 'medium':
        try:
            results.extend(scrape_tds_articles(query))
        except Exception as e:
            return jsonify({"error": f"Failed to fetch data from Medium: {str(e)}"}), 500
    
    elif source == 'github':
        try:
            results.extend(search_github_repositories(query))
        except Exception as e:
            return jsonify({"error": f"Failed to fetch data from GitHub: {str(e)}"}), 500
    
    elif source == 'goooglesearch':
        try:
            results.extend(fetch_google_tutorials(query))
        except Exception as e:
            return jsonify({"error": f"Failed to fetch data from Google Search: {str(e)}"}), 500

    return jsonify(results)

@bp.route('/chat', methods=['POST'])
def chat():
    query = request.json.get('query')
    response = chatbot.get_response(query)
    return jsonify({'response': response})

@bp.route('/github', methods=['GET'])
def github():
    return render_template('github.html')