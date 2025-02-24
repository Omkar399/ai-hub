import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-123'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///ai_hub.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    GITHUB_API_TOKEN ='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'
