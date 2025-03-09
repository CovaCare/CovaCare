import pytest
from unittest.mock import patch
import json
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))
from __init__ import create_app

@pytest.fixture
def app():
    app = create_app()
    return app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def mock_query_db():
    with patch('contacts_routes.query_db') as mock:
        yield mock

def test_get_contacts(client, mock_query_db):
    mock_contacts = [
        {"id": 1, "name": "John Doe", "phone_number": "1234567890", "status": 1},
        {"id": 2, "name": "Jane Doe", "phone_number": "0987654321", "status": 0}
    ]
    mock_query_db.return_value = mock_contacts

    response = client.get('/contacts')
    assert response.status_code == 200
    assert json.loads(response.data) == mock_contacts

def test_get_contact(client, mock_query_db):
    mock_contact = {"id": 1, "name": "John Doe", "phone_number": "1234567890", "status": 1}
    mock_query_db.return_value = mock_contact

    response = client.get('/contacts/1')
    assert response.status_code == 200
    assert json.loads(response.data) == mock_contact

def test_get_contact_not_found(client, mock_query_db):
    mock_query_db.return_value = None

    response = client.get('/contacts/999')
    assert response.status_code == 404

def test_add_contact(client, mock_query_db):
    new_contact = {
        "name": "New Contact",
        "phone_number": "1234567890",
        "status": 1
    }
    mock_query_db.side_effect = [
        {'lastrowid': 1},
        {"id": 1, "name": "New Contact", "phone_number": "1234567890", "status": 1}
    ]

    response = client.post('/contacts', json=new_contact)
    assert response.status_code == 201

def test_update_contact(client, mock_query_db):
    mock_query_db.side_effect = [
        {"id": 1, "name": "Old Name", "phone_number": "1234567890", "status": 1},
        None,
        {"id": 1, "name": "New Name", "phone_number": "1234567890", "status": 1}
    ]

    update_data = {
        "name": "New Name",
        "phone_number": "1234567890",
        "status": 1
    }

    response = client.put('/contacts/1', json=update_data)
    assert response.status_code == 200

def test_delete_contact(client, mock_query_db):
    mock_query_db.side_effect = [{"id": 1}, None]

    response = client.delete('/contacts/1')
    assert response.status_code == 200
    assert json.loads(response.data)["message"] == "Contact deleted"

def test_test_alert_contact(client, mock_query_db):
    mock_contact = {"id": 1, "name": "John", "phone_number": "1234567890"}
    mock_query_db.return_value = mock_contact

    with patch('contacts_routes.AlertService') as mock_alert_service:
        mock_instance = mock_alert_service.return_value
        mock_instance.send_alert.return_value = "test-sid"

        response = client.post('/contacts/1/test-alert')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data["success"] == True
        assert "sid" in data

def test_alert_all_contacts(client, mock_query_db):
    mock_contacts = [
        {"id": 1, "name": "John Doe", "phone_number": "1234567890", "status": 1},
        {"id": 2, "name": "Jane Doe", "phone_number": "0987654321", "status": 1}
    ]
    mock_query_db.return_value = mock_contacts
    
    with patch('contacts_routes.AlertService') as mock_alert_service:
        mock_instance = mock_alert_service.return_value
        mock_instance.send_alert.return_value = "test-sid"
        
        response = client.post('/contacts/alert-all', json={"message": "Test alert!"})
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data["success"] is True
        assert data["message"] == "Alerts sent to all active contacts."


def test_alert_all_contacts_no_active(client, mock_query_db):
    mock_query_db.return_value = []
    
    response = client.post('/contacts/alert-all', json={"message": "Test alert!"})
    
    assert response.status_code == 404
    data = json.loads(response.data)
    assert data["success"] is False
    assert data["message"] == "No active contacts found."

