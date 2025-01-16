# Cameras Endpoints
from flask import Blueprint, request, jsonify, abort
from db import get_db_connection, query_db

cameras_bp = Blueprint('cameras', __name__)

@cameras_bp.route('/cameras', methods=['GET'])
def get_cameras():
    cameras = query_db("SELECT * FROM cameras")
    return jsonify([dict(camera) for camera in cameras])

@cameras_bp.route('/cameras/<int:camera_id>', methods=['GET'])
def get_camera(camera_id):
    camera = query_db("SELECT * FROM cameras WHERE id = ?", (camera_id,), one=True)
    if camera is None:
        abort(404, description="Camera not found")
    return jsonify(dict(camera))

@cameras_bp.route('/cameras', methods=['POST'])
def add_camera():
    data = request.get_json()
    if not data or not all(key in data for key in ["name", "status"]):
        abort(400, description="Missing required fields")
    ip = data.get("ip")
    fall_detection_enabled = data.get("fall_detection_enabled", 1)
    inactivity_detection_enabled = data.get("inactivity_detection_enabled", 1)
    conn = get_db_connection()
    cursor = conn.execute(
        """INSERT INTO cameras 
           (name, status, ip, fall_detection_enabled, inactivity_detection_enabled)
           VALUES (?, ?, ?, ?, ?)""",
        (data["name"], data["status"], ip, fall_detection_enabled, inactivity_detection_enabled)
    )
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    new_camera = query_db("SELECT * FROM cameras WHERE id = ?", (new_id,), one=True)
    return jsonify(dict(new_camera)), 201

@cameras_bp.route('/cameras/<int:camera_id>', methods=['PUT'])
def update_camera(camera_id):
    data = request.get_json()
    if not data or not all(key in data for key in ["name", "status"]):
        abort(400, description="Missing required fields")
    ip = data.get("ip")
    fall_detection_enabled = data.get("fall_detection_enabled", 1)
    inactivity_detection_enabled = data.get("inactivity_detection_enabled", 1)
    conn = get_db_connection()
    conn.execute(
        """UPDATE cameras SET name = ?, status = ?, ip = ?, 
           fall_detection_enabled = ?, inactivity_detection_enabled = ?, 
           updated_at = CURRENT_TIMESTAMP
           WHERE id = ?""",
        (data["name"], data["status"], ip, fall_detection_enabled, inactivity_detection_enabled, camera_id)
    )
    conn.commit()
    conn.close()
    updated_camera = query_db("SELECT * FROM cameras WHERE id = ?", (camera_id,), one=True)
    if updated_camera is None:
        abort(404, description="Camera not found")
    return jsonify(dict(updated_camera))

@cameras_bp.route('/cameras/<int:camera_id>', methods=['DELETE'])
def delete_camera(camera_id):
    conn = get_db_connection()
    conn.execute("DELETE FROM cameras WHERE id = ?", (camera_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Camera deleted"}), 200
