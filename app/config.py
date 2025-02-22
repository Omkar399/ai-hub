import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-123'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///ai_hub.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    GITHUB_API_TOKEN = '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'
