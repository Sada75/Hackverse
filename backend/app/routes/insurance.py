from flask import Blueprint, jsonify, request
from app.database import get_db

insurance_bp = Blueprint("insurance", __name__)

@insurance_bp.route('', methods=['GET'])
def list_insurances():
    supabase = get_db()
    response = supabase.table('insurances').select('*').execute()
    return jsonify(response.data)

@insurance_bp.route('/search', methods=['GET'])
def search_insurances():
    query = request.args.get('query')
    supabase = get_db()
    response = supabase.table('insurances').select('*').ilike('name', f'%{query}%').execute()
    return jsonify(response.data)

@insurance_bp.route('/buy', methods=['POST'])
def buy_insurance():
    data = request.json
    user_id = data.get('user_id')
    insurance_id = data.get('insurance_id')
    quantity = data.get('quantity')

    supabase = get_db()
    user_response = supabase.table('users').select('*').eq('id', user_id).execute()
    insurance_response = supabase.table('insurances').select('*').eq('id', insurance_id).execute()

    user = user_response.data[0] if user_response.data else None
    insurance = insurance_response.data[0] if insurance_response.data else None

    if not user or not insurance:
        return jsonify({"error": "Invalid user or insurance ID"}), 400

    total_price = insurance['insurance_policy_price'] * quantity
    discount = min(user['points'], total_price)
    final_price = total_price - discount

    # Deduct points and finalize transaction
    new_points = user['points'] - int(discount / 0.00001)
    supabase.table('users').update({"points": new_points}).eq('id', user_id).execute()

    return jsonify({
        "message": "Purchase successful",
        "insurance_id": insurance_id,
        "total_price": total_price,
        "discount": discount,
        "final_price": final_price,
    })

