# config.py
import os

class Config:
    # Load Supabase URL and Key from environment variables
    SUPABASE_URL = os.environ.get('SUPABASE_URL') or 'https://default.supabase.co'
    SUPABASE_KEY = os.environ.get('SUPABASE_KEY') or ' '  # Use a placeholder if not set

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    #JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'your_default_jwt_secret_key'  # Replace with a strong secret key