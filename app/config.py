import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-123'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///ai_hub.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    GITHUB_API_TOKEN =''
    GEMINI_API_KEY= "AIzaSyD4zk4W44zJo4Z0-B8l7Dwe8hgvRVMLy3Y"
