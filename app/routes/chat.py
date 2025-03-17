from flask import Blueprint, request, jsonify
from flask_cors import CORS
from app.utils.chatbot import AIAssistant
import logging

bp = Blueprint("chat", __name__)  # ✅ Ensure correct prefix

# Logging setup
logging.basicConfig(level=logging.DEBUG)

# Initialize AI Assistant
try:
    assistant = AIAssistant()
    logging.info("✅ AI Assistant initialized successfully.")
except Exception as e:
    logging.error(f"❌ AI Assistant failed to initialize: {e}")
    assistant = None  # Prevent crashing if AI setup fails


@bp.route("/chat", methods=["POST", "OPTIONS"])  # ✅ Fix 308 Redirect
def chat():
    """Handles user chat requests and gets response from AI Assistant."""
    print(" I was here")
    # ✅ Handle Preflight ⁠ OPTIONS ⁠ Requests
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()

    data = request.get_json()
    user_input = data.get("message", "")

    if not user_input:
        return jsonify({"response": "Error: No input provided."}), 400

    if not assistant:
        logging.error("❌ AI Assistant is not initialized. Check API key!")
        return jsonify({"response": "Error: AI Assistant is unavailable."}), 500

    try:
        bot_response = assistant.get_response(user_input)
        logging.info(f"📝 User: {user_input} → 🤖 AI: {bot_response}")
        return jsonify({"response": bot_response})
    except Exception as e:
        logging.error(f"❌ AI Processing Error: {e}")
        return jsonify({"response": f"Error: {str(e)}"}), 500


# def _build_cors_preflight_response():
#     """Handles CORS preflight OPTIONS requests"""
#     response = jsonify({"message": "CORS preflight successful"})
#     response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
#     response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
#     response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
#     response.headers["Access-Control-Allow-Credentials"] = "true"
#     return response, 200


# def _corsify_actual_response(response):
#     """Adds CORS headers to actual responses"""
#     response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
#     response.headers["Access-Control-Allow-Credentials"] = "true"
#     return response
