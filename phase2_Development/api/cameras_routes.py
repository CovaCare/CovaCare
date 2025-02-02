# Cameras Endpoints
from flask import Blueprint, request, jsonify, abort
from db import get_db_connection, query_db

cameras_bp = Blueprint('cameras', __name__)

# Get all cameras
@cameras_bp.route('/cameras', methods=['GET'])
def get_cameras():
    cameras = query_db("SELECT * FROM cameras")
    return jsonify([dict(camera) for camera in cameras])

# Get a specific camera
@cameras_bp.route('/cameras/<int:camera_id>', methods=['GET'])
def get_camera(camera_id):
    camera = query_db("SELECT * FROM cameras WHERE id = ?", (camera_id,), one=True)
    if camera is None:
        abort(404, description="Camera not found")
    return jsonify(dict(camera))

# Add a new camera
@cameras_bp.route('/cameras', methods=['POST'])
def add_camera():
    data = request.get_json()

    name = data.get("name", "")
    username = data.get("username", "")
    password = data.get("password", "")
    stream_url = data.get("stream_url", "")
    fall_detection_enabled = data.get("fall_detection_enabled", 0)
    inactivity_detection_enabled = data.get("inactivity_detection_enabled", 0)

    fall_detection_start_time = data.get("fall_detection_start_time", "")
    fall_detection_end_time = data.get("fall_detection_end_time", "")
    inactivity_detection_start_time = data.get("inactivity_detection_start_time", "")
    inactivity_detection_end_time = data.get("inactivity_detection_end_time", "")

    inactivity_detection_sensitivity = data.get("inactivity_detection_sensitivity", 50)
    inactivity_detection_duration = data.get("inactivity_detection_duration", 30)

    result = query_db(
        """
        INSERT INTO cameras (
            name,
            username,
            password,
            stream_url,
            fall_detection_enabled,
            inactivity_detection_enabled,
            fall_detection_start_time,
            fall_detection_end_time,
            inactivity_detection_start_time,
            inactivity_detection_end_time,
            inactivity_detection_sensitivity,
            inactivity_detection_duration
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            name,
            username,
            password,
            stream_url,
            fall_detection_enabled,
            inactivity_detection_enabled,
            fall_detection_start_time,
            fall_detection_end_time,
            inactivity_detection_start_time,
            inactivity_detection_end_time,
            inactivity_detection_sensitivity,
            inactivity_detection_duration
        ),
        commit=True
    )
    new_id = result['lastrowid']

    new_camera = query_db("SELECT * FROM cameras WHERE id = ?", (new_id,), one=True)
    return jsonify(dict(new_camera)), 201

# Update an existing camera
@cameras_bp.route('/cameras/<int:camera_id>', methods=['PUT'])
def update_camera(camera_id):
    data = request.get_json()
    if not data:
        abort(400, description="Request body is required")
    
    # Fetch existing camera to ensure it exists
    existing_camera = query_db("SELECT * FROM cameras WHERE id = ?", (camera_id,), one=True)
    if existing_camera is None:
        abort(404, description="Camera not found")

    name = data.get("name", existing_camera["name"])
    username = data.get("username", existing_camera["username"])
    password = data.get("password", existing_camera["password"])
    stream_url = data.get("stream_url", existing_camera["stream_url"])
    fall_detection_enabled = data.get("fall_detection_enabled", existing_camera["fall_detection_enabled"])
    inactivity_detection_enabled = data.get("inactivity_detection_enabled", existing_camera["inactivity_detection_enabled"])

    fall_detection_start_time = data.get("fall_detection_start_time", existing_camera["fall_detection_start_time"])
    fall_detection_end_time = data.get("fall_detection_end_time", existing_camera["fall_detection_end_time"])
    inactivity_detection_start_time = data.get("inactivity_detection_start_time", existing_camera["inactivity_detection_start_time"])
    inactivity_detection_end_time = data.get("inactivity_detection_end_time", existing_camera["inactivity_detection_end_time"])
    inactivity_detection_sensitivity = data.get("inactivity_detection_sensitivity", existing_camera["inactivity_detection_sensitivity"])
    inactivity_detection_duration = data.get("inactivity_detection_duration", existing_camera["inactivity_detection_duration"])

    query_db(
        """
        UPDATE cameras
        SET
            name = ?,
            username = ?,
            password = ?,
            stream_url = ?,
            fall_detection_enabled = ?,
            inactivity_detection_enabled = ?,
            fall_detection_start_time = ?,
            fall_detection_end_time = ?,
            inactivity_detection_start_time = ?,
            inactivity_detection_end_time = ?,
            inactivity_detection_sensitivity = ?,
            inactivity_detection_duration = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        """,
        (
            name,
            username,
            password,
            stream_url,
            fall_detection_enabled,
            inactivity_detection_enabled,
            fall_detection_start_time,
            fall_detection_end_time,
            inactivity_detection_start_time,
            inactivity_detection_end_time,
            inactivity_detection_sensitivity,
            inactivity_detection_duration,
            camera_id
        ),
        commit=True
    )

    updated_camera = query_db("SELECT * FROM cameras WHERE id = ?", (camera_id,), one=True)
    return jsonify(dict(updated_camera))

# Delete a camera
@cameras_bp.route('/cameras/<int:camera_id>', methods=['DELETE'])
def delete_camera(camera_id):
    existing_camera = query_db("SELECT * FROM cameras WHERE id = ?", (camera_id,), one=True)
    if existing_camera is None:
        abort(404, description="Camera not found")

    query_db("DELETE FROM cameras WHERE id = ?", (camera_id,), commit=True)
    return jsonify({"message": "Camera deleted"}), 200