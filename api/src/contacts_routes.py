# Contacts Endpoints
from flask import Blueprint, request, jsonify, abort
from db import query_db
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from services.alerting.src.alert_service import AlertService

contacts_bp = Blueprint('contacts', __name__)

# Get all contacts
@contacts_bp.route('/contacts', methods=['GET'])
def get_contacts():
    contacts = query_db("SELECT * FROM contacts")
    return jsonify([dict(contact) for contact in contacts])

# Get a specific contact
@contacts_bp.route('/contacts/<int:contact_id>', methods=['GET'])
def get_contact(contact_id):
    contact = query_db("SELECT * FROM contacts WHERE id = ?", (contact_id,), one=True)
    if contact is None:
        abort(404, description="Contact not found")
    return jsonify(dict(contact))

# Add a new contact
@contacts_bp.route('/contacts', methods=['POST'])
def add_contact():
    data = request.get_json()

    name = data.get("name", "")
    phone_number = data.get("phone_number", "")
    status = data.get("status", 1)
    
    result = query_db(
        "INSERT INTO contacts (name, phone_number, status) VALUES (?, ?, ?)",
        (name, phone_number, status),
        commit=True
    )
    new_id = result['lastrowid']

    new_contact = query_db("SELECT * FROM contacts WHERE id = ?", (new_id,), one=True)
    return jsonify(dict(new_contact)), 201

# Update an existing contact
@contacts_bp.route('/contacts/<int:contact_id>', methods=['PUT'])
def update_contact(contact_id):
    data = request.get_json()
    
    existing_contact = query_db("SELECT * FROM contacts WHERE id = ?", (contact_id,), one=True)
    if existing_contact is None:
        abort(404, description="Contact not found")

    name = data.get("name", existing_contact["name"])
    phone_number = data.get("phone_number", existing_contact["phone_number"])
    status = data.get("status", existing_contact["status"])

    query_db(
        "UPDATE contacts SET name = ?, phone_number = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        (name, phone_number, status, contact_id),
        commit=True
    )
    
    updated_contact = query_db("SELECT * FROM contacts WHERE id = ?", (contact_id,), one=True)
    return jsonify(dict(updated_contact))

# Delete a contact
@contacts_bp.route('/contacts/<int:contact_id>', methods=['DELETE'])
def delete_contact(contact_id):
    existing_contact = query_db("SELECT * FROM contacts WHERE id = ?", (contact_id,), one=True)
    if existing_contact is None:
        abort(404, description="Contact not found")

    query_db("DELETE FROM contacts WHERE id = ?", (contact_id,), commit=True)
    return jsonify({"message": "Contact deleted"}), 200

# Send a test alert to a contact
@contacts_bp.route('/contacts/<int:contact_id>/test-alert', methods=['POST'])
def test_alert_contact(contact_id):
    contact = query_db("SELECT * FROM contacts WHERE id = ?", (contact_id,), one=True)
    if contact is None:
        abort(404, description="Contact not found")
    
    alert_service = AlertService()
    try:
        message = "This is a test alert from CovaCare!"
        result = alert_service.send_alert(contact['phone_number'], message)
        return jsonify({
            "success": True,
            "message": f"Test alert sent to {contact['name']} at {contact['phone_number']}.",
            "sid": result
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to send test alert: {str(e)}"
        }), 500
    
# Alert all active contacts
@contacts_bp.route('/contacts/alert-all', methods=['POST'])
def alert_all_contacts():
    data = request.get_json()
    
    message = data.get("message")
    if not message:
        return jsonify({
            "success": False,
            "message": "No message provided in the request."
        }), 400

    contacts = query_db("SELECT * FROM contacts WHERE status = 1")
    
    if not contacts:
        return jsonify({
            "success": False,
            "message": "No active contacts found."
        }), 404
    
    media_url = data.get("media_url", None)
    
    alert_service = AlertService()
    failed_contacts = []
    
    for contact in contacts:
        try:
            result = alert_service.send_alert(contact['phone_number'], message, media_url)
            print(f"Alert sent to {contact['name']} at {contact['phone_number']}. SID: {result}")
        except Exception as e:
            failed_contacts.append({
                "name": contact['name'],
                "phone_number": contact['phone_number'],
                "error": str(e)
            })
    
    if failed_contacts:
        return jsonify({
            "success": False,
            "message": "Some alerts failed.",
            "failed_contacts": failed_contacts
        }), 500
    
    return jsonify({
        "success": True,
        "message": "Alerts sent to all active contacts."
    })