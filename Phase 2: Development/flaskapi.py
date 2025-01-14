from flask import Flask, request, jsonify, abort
import sqlite3
import os

app = Flask(__name__)
DB_FILENAME = 'covacare.db'

# ---------------------------
# Database Helper Functions
# ---------------------------
def get_db_connection():
    conn = sqlite3.connect(DB_FILENAME)
    conn.row_factory = sqlite3.Row
    return conn

def query_db(query, args=(), one=False, commit=False):
    conn = get_db_connection()
    cursor = conn.execute(query, args)
    if commit:
        conn.commit()
        conn.close()
        return
    results = cursor.fetchall()
    conn.close()
    return (results[0] if results else None) if one else results

# ---------------------------
# Emergency Contacts Endpoints
# ---------------------------
@app.route('/contacts', methods=['GET'])
def get_contacts():
    """List all emergency contacts."""
    contacts = query_db("SELECT * FROM contacts")
    return jsonify([dict(contact) for contact in contacts])

@app.route('/contacts/<int:contact_id>', methods=['GET'])
def get_contact(contact_id):
    """Retrieve a specific contact by ID."""
    contact = query_db("SELECT * FROM contacts WHERE id = ?", (contact_id,), one=True)
    if contact is None:
        abort(404, description="Contact not found")
    return jsonify(dict(contact))

@app.route('/contacts', methods=['POST'])
def add_contact():
    """Add a new contact. Expects JSON with 'name', 'phoneNumber', and 'status' (0 or 1)."""
    data = request.get_json()
    if not data or not all(key in data for key in ["name", "phoneNumber", "status"]):
        abort(400, description="Missing required fields")
    
    conn = get_db_connection()
    cursor = conn.execute(
        "INSERT INTO contacts (name, phone_number, status) VALUES (?, ?, ?)",
        (data["name"], data["phoneNumber"], data["status"])
    )
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    
    new_contact = query_db("SELECT * FROM contacts WHERE id = ?", (new_id,), one=True)
    return jsonify(dict(new_contact)), 201

@app.route('/contacts/<int:contact_id>', methods=['PUT'])
def update_contact(contact_id):
    """Update a specific contact. Expects a complete new object."""
    data = request.get_json()
    if not data or not all(key in data for key in ["name", "phoneNumber", "status"]):
        abort(400, description="Missing required fields")
    
    conn = get_db_connection()
    conn.execute(
        "UPDATE contacts SET name = ?, phone_number = ?, status = ? WHERE id = ?",
        (data["name"], data["phoneNumber"], data["status"], contact_id)
    )
    conn.commit()
    conn.close()
    
    updated_contact = query_db("SELECT * FROM contacts WHERE id = ?", (contact_id,), one=True)
    if updated_contact is None:
        abort(404, description="Contact not found")
    return jsonify(dict(updated_contact))

@app.route('/contacts/<int:contact_id>', methods=['DELETE'])
def delete_contact(contact_id):
    """Remove a contact."""
    conn = get_db_connection()
    conn.execute("DELETE FROM contacts WHERE id = ?", (contact_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Contact deleted"}), 200

@app.route('/contacts/<int:contact_id>/test-alert', methods=['POST'])
def test_alert_contact(contact_id):
    """Sends a test alert to a contact."""
    contact = query_db("SELECT * FROM contacts WHERE id = ?", (contact_id,), one=True)
    if contact is None:
        abort(404, description="Contact not found")
    # Simulate sending an alert; in a real implementation, integrate with an SMS/email service.
    return jsonify({"message": f"Test alert sent to {contact['name']} at {contact['phone_number']}."})

# ---------------------------
# Cameras Endpoints
# ---------------------------
@app.route('/cameras', methods=['GET'])
def get_cameras():
    """List all cameras."""
    cameras = query_db("SELECT * FROM cameras")
    return jsonify([dict(camera) for camera in cameras])

@app.route('/cameras/<int:camera_id>', methods=['GET'])
def get_camera(camera_id):
    """Retrieve a specific camera by ID."""
    camera = query_db("SELECT * FROM cameras WHERE id = ?", (camera_id,), one=True)
    if camera is None:
        abort(404, description="Camera not found")
    return jsonify(dict(camera))

@app.route('/cameras', methods=['POST'])
def add_camera():
    """
    Add a new camera.
    Expects JSON with 'name', 'status' (0 or 1), and optionally:
      'ip', 'fall_detection_enabled', 'inactivity_detection_enabled'
    """
    data = request.get_json()
    if not data or not all(key in data for key in ["name", "status"]):
        abort(400, description="Missing required fields")
    
    # Optional fields with defaults:
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

@app.route('/cameras/<int:camera_id>', methods=['PUT'])
def update_camera(camera_id):
    """
    Update a specific camera.
    Expects a complete new object in JSON with the same fields as on creation.
    """
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

@app.route('/cameras/<int:camera_id>', methods=['DELETE'])
def delete_camera(camera_id):
    """Remove a camera."""
    conn = get_db_connection()
    conn.execute("DELETE FROM cameras WHERE id = ?", (camera_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Camera deleted"}), 200

# ---------------------------
# Settings Endpoints
# ---------------------------
@app.route('/settings', methods=['GET'])
def get_settings():
    """Retrieves all settings data (per-camera settings)."""
    settings = query_db("SELECT * FROM settings")
    return jsonify([dict(setting) for setting in settings])

@app.route('/settings', methods=['PUT'])
def update_settings():
    """
    Update settings.
    Expects a complete new object or a list of objects for camera settings.
    Each object should include:
      'camera_id', 'active_start_time', 'active_end_time',
      and optionally 'fall_detection_enabled', 'inactivity_detection_enabled'
    """
    data = request.get_json()
    if not data:
        abort(400, description="No settings provided")
    
    # Allow for a single settings object or a list
    if not isinstance(data, list):
        data = [data]
    
    conn = get_db_connection()
    for setting in data:
        if not all(key in setting for key in ["camera_id", "active_start_time", "active_end_time"]):
            abort(400, description="Missing required fields in settings for camera_id {}".format(setting.get("camera_id")))
        
        # Try updating the settings if they exist
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
            # No existing settings for this camera; insert a new row.
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

# ---------------------------
# System Endpoints
# ---------------------------
@app.route('/system/status', methods=['GET'])
def system_status():
    """System health check."""
    return jsonify({"status": "online"})

@app.route('/system/restart', methods=['POST'])
def system_restart():
    """
    Restart the system.
    For now, this is just a placeholder.
    In a real application, you might handle a restart differently.
    """
    return jsonify({"message": "System restart triggered (not actually implemented)."}), 200

# ---------------------------
# Run the Flask Application
# ---------------------------
if __name__ == '__main__':
    # Run on 0.0.0.0 to be accessible on the local network
    app.run(debug=True, host='0.0.0.0')

# python3 flaskapi.py