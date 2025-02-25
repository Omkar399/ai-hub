import google.generativeai as genai
import os
import logging
import app

# Load API Key
API_KEY = "AIzaSyD4zk4W44zJo4Z0-B8l7Dwe8hgvRVMLy3Y"

if not API_KEY:
    raise ValueError("❌ GEMINI_API_KEY is missing. Set it in environment variables.")


class AIAssistant:
    def __init__(self):
        logging.info("🔑 Using Gemini API Key")
        genai.configure(api_key=API_KEY)
        self.model = genai.GenerativeModel("gemini-pro")

    def get_response(self, query):
        """Send user query to Gemini AI and return response."""
        try:
            response = self.model.generate_content(query)
            if response and hasattr(response, "text"):
                return response.text
            return "Sorry, I couldn't generate a response."
        except Exception as e:
            logging.error(f"❌ Error communicating with Gemini API: {e}")
            return f"Error: {str(e)}"
