import google.generativeai as genai
import logging
from app.models.resource import Resource
from app import db

# Load API Key
API_KEY = "AIzaSyD4zk4W44zJo4Z0-B8l7Dwe8hgvRVMLy3Y"

if not API_KEY:
    raise ValueError("❌ GEMINI_API_KEY is missing. Set it in environment variables.")

class AIAssistant:
    def __init__(self):
        logging.info("🔑 Using Gemini API Key")
        genai.configure(api_key=API_KEY)
        self.model = genai.GenerativeModel("gemini-1.5-flash")
        self.context = self._build_context()

    def _build_context(self):
        """Build context from local resources in the database."""
        try:
            resources = Resource.query.filter_by(approved=True).all()
            context = "Here are some AI learning resources available in our database:\n\n"
            
            for resource in resources:
                context += f"- {resource.title}\n"
                context += f"  Description: {resource.description}\n"
                context += f"  Category: {resource.category.name if resource.category else 'Uncategorized'}\n"
                context += f"  URL: {resource.url}\n\n"
            
            return context
        except Exception as e:
            logging.error(f"❌ Error building context from resources: {e}")
            return ""

    def get_response(self, query):
        """Send user query to Gemini AI with local resource context."""
        try:
            # Combine the query with our local resource context
            enhanced_query = f"""Context about our available resources:
            {self.context}

            User Query: {query}

            Please provide a helpful response, and when relevant, recommend specific resources from our database that might help the user."""

            response = self.model.generate_content(enhanced_query)
            if response and hasattr(response, "text"):
                return response.text
            return "Sorry, I couldn't generate a response."
        except Exception as e:
            logging.error(f"❌ Error communicating with Gemini API: {e}")
            return f"Error: {str(e)}"

    def refresh_context(self):
        """Refresh the local resources context."""
        self.context = self._build_context()
