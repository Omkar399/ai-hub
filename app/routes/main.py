from flask import Blueprint, render_template, request, jsonify
from app.models.resource import Resource
from app.utils.chatbot import AIAssistant

bp = Blueprint('main', __name__)
chatbot = AIAssistant()

@bp.route('/')
def index():
    resources = Resource.query.filter_by(approved=True).all()
    return render_template('index.html', resources=resources)

@bp.route('/search')
def search():
    query = request.args.get('q', '')
    category = request.args.get('category', '')
    
    resources = Resource.query.filter(
        Resource.title.contains(query),
        Resource.approved == True
    )
    
    if category:
        resources = resources.filter_by(category=category)
        
    return render_template('search.html', resources=resources.all())

@bp.route('/chat', methods=['POST'])
def chat():
    query = request.json.get('query')
    response = chatbot.get_response(query)
    return jsonify({'response': response})

@bp.route('/github', methods=['GET'])
def github():
    return render_template('github.html')