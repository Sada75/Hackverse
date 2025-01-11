from flask import Blueprint, jsonify, request
from app.database import get_db
from app.utils import validate_datetime

appointment_bp = Blueprint('appointment', __name__)

@appointment_bp.route('', methods=['GET'])
def list_appointments():
    supabase = get_db()
    response = supabase.table('appointments').select('*').execute()
    return jsonify(response.data)

@appointment_bp.route('/book', methods=['POST'])
def book_appointment():
    data = request.json
    user_id = data.get('user_id')
    patient_name = data.get('patient_name')
    datetime = data.get('datetime')

    if not validate_datetime(datetime):
        return jsonify({"error": "Invalid datetime format"}), 400

    supabase = get_db()
    user_response = supabase.table('users').select('*').eq('id', user_id).execute()
    user = user_response.data[0] if user_response.data else None

    if not user:
        return jsonify({"error": "User not found"}), 404

    base_price = 500
    discount = min(user['points'] * 0.01, base_price)
    final_price = base_price - discount

    new_points = user['points'] - int(discount / 0.01)
    supabase.table('users').update({"points": new_points}).eq('id', user_id).execute()

    appointment_data = {
        "patient_name": patient_name,
        "datetime": datetime,
        "user_id": user_id
    }
    supabase.table('appointments').insert(appointment_data).execute()

    return jsonify({
        "message": "Appointment booked successfully",
        "base_price": base_price,
        "discount": discount,
        "final_price": final_price,
    })

@appointment_bp.route('/cancel', methods=['DELETE'])
def cancel_appointment():
    appointment_id = request.args.get('appointment_id')
    supabase = get_db()
    appointment = supabase.table('appointments').select('*').eq('id', appointment_id).execute()

    if not appointment.data:
        return jsonify({"error": "Appointment not found"}), 404

    supabase.table('appointments').delete().eq('id', appointment_id).execute()

    return jsonify({"message": "Appointment cancelled successfully"})
