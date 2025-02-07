# Settings Endpoints
from flask import Blueprint, request, jsonify, abort
from db import get_db_connection, query_db

settings_bp = Blueprint('settings', __name__)

# Get global settings
@settings_bp.route('/settings', methods=['GET'])
def get_settings():
    settings = query_db("SELECT * FROM global_settings WHERE id = 1", one=True)
    if settings is None:
        abort(404, description="Global settings not found")
    return jsonify(dict(settings))

# Update global settings
@settings_bp.route('/settings', methods=['PUT'])
def update_settings():
    data = request.get_json()
    if not data:
        abort(400, description="No settings provided")
    
    # Validate inputs
    required_keys = [
        "fall_detection_enabled", 
        "fall_detection_start_time", 
        "fall_detection_end_time", 
        "inactivity_detection_enabled", 
        "inactivity_detection_start_time", 
        "inactivity_detection_end_time"
    ]
    if not all(key in data for key in required_keys):
        abort(400, description="Missing required fields in global settings")

    # Update settings
    result = query_db(
        """
        UPDATE global_settings SET 
            fall_detection_enabled = ?,
            fall_detection_start_time = ?,
            fall_detection_end_time = ?,
            inactivity_detection_enabled = ?,
            inactivity_detection_start_time = ?,
            inactivity_detection_end_time = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
        """,
        (
            data["fall_detection_enabled"],
            data["fall_detection_start_time"],
            data["fall_detection_end_time"],
            data["inactivity_detection_enabled"],
            data["inactivity_detection_start_time"],
            data["inactivity_detection_end_time"]
        ),
        commit=True
    )
    
    if result['rowcount'] == 0:
        abort(404, description="Failed to update global settings")

    return jsonify({"message": "Global settings updated"}), 200