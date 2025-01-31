# Contacts Endpoints
from flask import Blueprint, request, jsonify, abort
from db import get_db_connection, query_db

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
    required_fields = ["name", "phone_number", "status"]
    if not data or not all(key in data for key in required_fields):
        abort(400, description="Missing required fields")
    # Validate 'status'
    if data["status"] not in [0, 1]:
        abort(400, description="Status must be 0 or 1")
    
    result = query_db(
        "INSERT INTO contacts (name, phone_number, status) VALUES (?, ?, ?)",
        (data["name"], data["phone_number"], data["status"]),
        commit=True
    )
    new_id = result['lastrowid']
    
    new_contact = query_db("SELECT * FROM contacts WHERE id = ?", (new_id,), one=True)
    return jsonify(dict(new_contact)), 201

# Update an existing contact
@contacts_bp.route('/contacts/<int:contact_id>', methods=['PUT'])
def update_contact(contact_id):
    data = request.get_json()
    required_fields = ["name", "phone_number", "status"]
    if not data or not all(key in data for key in required_fields):
        abort(400, description="Missing required fields")
    if data["status"] not in [0, 1]:
        abort(400, description="Status must be 0 or 1")
    
    existing_contact = query_db("SELECT * FROM contacts WHERE id = ?", (contact_id,), one=True)
    if existing_contact is None:
        abort(404, description="Contact not found")

    query_db(
        "UPDATE contacts SET name = ?, phone_number = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        (data["name"], data["phone_number"], data["status"], contact_id),
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

# Test alert a contact
@contacts_bp.route('/contacts/<int:contact_id>/test-alert', methods=['POST'])
def test_alert_contact(contact_id):
    contact = query_db("SELECT * FROM contacts WHERE id = ?", (contact_id,), one=True)
    if contact is None:
        abort(404, description="Contact not found")
    return jsonify({"message": f"Test alert sent to {contact['name']} at {contact['phone_number']}."})