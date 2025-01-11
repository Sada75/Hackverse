# app/routes/auth.py
from flask import Blueprint, jsonify, request
from app.database import get_db
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    phonenum = data.get('phone')
    metamask_id = data.get('metamask_id')

    # Validate input
    if not email or not password:
        return jsonify({"error": "Username and password are required"}), 400

    hashed_password = generate_password_hash(password)

    supabase = get_db()
    # Check if the user already exists
    existing_user_response = supabase.table('users').select('*').eq('username', email).execute()
    if existing_user_response.data:
        return jsonify({"error": "User already exists"}), 409

    # Insert new user into the database
    user_response = supabase.table('users').insert({
        "email": email,
        "password": hashed_password,
        "name": name,
        "phone": phonenum,
        "metamask_id": metamask_id
    }).execute()

    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Validate input
    if not email or not password:
        return jsonify({"error": "Username and password are required"}), 400

    supabase = get_db()
    user_response = supabase.table('users').select('*').eq('email', email).execute()
    user = user_response.data[0] if user_response.data else None

    if not user or not check_password_hash(user['password'], password):
        return jsonify({"error": "Invalid username or password"}), 401

    # Here you can return a token or user information as needed
    return jsonify({
        "message": "Login successful",
        "user_id": user['id'],
        "email": user['email'],
        # "name": name,
        # "phone": phonenum,
        # "metamask_id": metamask_id
        # Add any other user information you want to return
    })