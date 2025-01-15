# Settings Endpoints
from flask import Blueprint, request, jsonify, abort
from db import get_db_connection, query_db

settings_bp = Blueprint('settings', __name__)

@settings_bp.route('/settings', methods=['GET'])
def get_settings():
    settings = query_db("SELECT * FROM settings")
    return jsonify([dict(setting) for setting in settings])

@settings_bp.route('/settings', methods=['PUT'])
def update_settings():
    data = request.get_json()
    if not data:
        abort(400, description="No settings provided")
    if not isinstance(data, list):
        data = [data]
    
    conn = get_db_connection()
    for setting in data:
        if not all(key in setting for key in ["camera_id", "active_start_time", "active_end_time"]):
            abort(400, description="Missing required fields in settings for camera_id {}".format(setting.get("camera_id")))
        
        cursor = conn.execute(
            """UPDATE settings SET 
               fall_detection_enabled = ?,
               inactivity_detection_enabled = ?,
               active_start_time = ?,
               active_end_time = ?
               WHERE camera_id = ?""",
            (setting.get("fall_detection_enabled", 1),
             setting.get("inactivity_detection_enabled", 1),
             setting["active_start_time"],
             setting["active_end_time"],
             setting["camera_id"])
        )
        if cursor.rowcount == 0:
            conn.execute(
                """INSERT INTO settings 
                   (camera_id, fall_detection_enabled, inactivity_detection_enabled, active_start_time, active_end_time)
                   VALUES (?, ?, ?, ?, ?)""",
                (setting["camera_id"],
                 setting.get("fall_detection_enabled", 1),
                 setting.get("inactivity_detection_enabled", 1),
                 setting["active_start_time"],
                 setting["active_end_time"])
            )
    conn.commit()
    conn.close()
    return jsonify({"message": "Settings updated"}), 200
