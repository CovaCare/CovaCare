# Contacts Endpoints
from flask import Blueprint, request, jsonify, abort
from db import get_db_connection, query_db

contacts_bp = Blueprint('contacts', __name__)

@contacts_bp.route('/contacts', methods=['GET'])
def get_contacts():
    contacts = query_db("SELECT * FROM contacts")
    return jsonify([dict(contact) for contact in contacts])

@contacts_bp.route('/contacts/<int:contact_id>', methods=['GET'])
def get_contact(contact_id):
    contact = query_db("SELECT * FROM contacts WHERE id = ?", (contact_id,), one=True)
    if contact is None:
        abort(404, description="Contact not found")
    return jsonify(dict(contact))

@contacts_bp.route('/contacts', methods=['POST'])
def add_contact():
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

@contacts_bp.route('/contacts/<int:contact_id>', methods=['PUT'])
def update_contact(contact_id):
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

@contacts_bp.route('/contacts/<int:contact_id>', methods=['DELETE'])
def delete_contact(contact_id):
    conn = get_db_connection()
    conn.execute("DELETE FROM contacts WHERE id = ?", (contact_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Contact deleted"}), 200

@contacts_bp.route('/contacts/<int:contact_id>/test-alert', methods=['POST'])
def test_alert_contact(contact_id):
    contact = query_db("SELECT * FROM contacts WHERE id = ?", (contact_id,), one=True)
    if contact is None:
        abort(404, description="Contact not found")
    return jsonify({"message": f"Test alert sent to {contact['name']} at {contact['phone_number']}."})
