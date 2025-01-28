# Cameras Endpoints
from flask import Blueprint, request, jsonify, abort
from db import get_db_connection, query_db

cameras_bp = Blueprint('cameras', __name__)

# Get all cameras
@cameras_bp.route('/cameras', methods=['GET'])
def get_cameras():
    cameras = query_db("SELECT * FROM cameras")
    return jsonify([dict(camera) for camera in cameras])

# Get a single camera by ID
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
    if not data or not all(key in data for key in ["name"]):
        abort(400, description="Missing required fields: 'name'")
    
    username = data.get("username")
    password = data.get("password")
    stream_url = data.get("stream_url")
    fall_detection_enabled = data.get("fall_detection_enabled", 0)  # Default to 0 (disabled)
    inactivity_detection_enabled = data.get("inactivity_detection_enabled", 0)  # Default to 0 (disabled)

    conn = get_db_connection()
    cursor = conn.execute(
        """
        INSERT INTO cameras 
        (name, username, password, stream_url, fall_detection_enabled, inactivity_detection_enabled)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (data["name"], username, password, stream_url, fall_detection_enabled, inactivity_detection_enabled)
    )
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()

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

    # Update only the provided fields
    name = data.get("name", existing_camera["name"])
    username = data.get("username", existing_camera["username"])
    password = data.get("password", existing_camera["password"])
    stream_url = data.get("stream_url", existing_camera["stream_url"])
    fall_detection_enabled = data.get("fall_detection_enabled", existing_camera["fall_detection_enabled"])
    inactivity_detection_enabled = data.get("inactivity_detection_enabled", existing_camera["inactivity_detection_enabled"])

    conn = get_db_connection()
    conn.execute(
        """
        UPDATE cameras
        SET name = ?, username = ?, password = ?, stream_url = ?, 
            fall_detection_enabled = ?, inactivity_detection_enabled = ?, 
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        """,
        (name, username, password, stream_url, fall_detection_enabled, inactivity_detection_enabled, camera_id)
    )
    conn.commit()
    conn.close()

    updated_camera = query_db("SELECT * FROM cameras WHERE id = ?", (camera_id,), one=True)
    return jsonify(dict(updated_camera))

# Delete a camera
@cameras_bp.route('/cameras/<int:camera_id>', methods=['DELETE'])
def delete_camera(camera_id):
    # Ensure the camera exists before attempting to delete
    existing_camera = query_db("SELECT * FROM cameras WHERE id = ?", (camera_id,), one=True)
    if existing_camera is None:
        abort(404, description="Camera not found")

    conn = get_db_connection()
    conn.execute("DELETE FROM cameras WHERE id = ?", (camera_id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Camera deleted"}), 200