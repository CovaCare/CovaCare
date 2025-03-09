import pytest
import sys
import os
from unittest.mock import patch
import json

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))
from __init__ import create_app
from db import query_db

@pytest.fixture
def app():
    app = create_app()
    yield app

@pytest.fixture
def client(app):
    return app.test_client()

def test_contacts_integration(client):
    with patch('db.TESTING_MODE', True):
        query_db('DELETE FROM contacts', commit=True)
        response = client.get('/contacts')
        assert response.status_code == 200
        assert len(response.json) == 0

        new_contact = {
            "name": "John Doe",
            "phone_number": "1234567890",
            "status": 1
        }
        response = client.post('/contacts', json=new_contact)
        assert response.status_code == 201
        contact_id = response.json['id']

        response = client.get('/contacts')
        assert response.status_code == 200
        assert len(response.json) == 1
        assert response.json[0]['name'] == 'John Doe'

        with patch('contacts_routes.AlertService') as mock_alert_service:
            mock_instance = mock_alert_service.return_value
            mock_instance.send_alert.return_value = "test-sid"

            response = client.post('/contacts/alert-all', json={"message": "Test alert!"})
            
            assert response.status_code == 200
            data = json.loads(response.data)
            assert data["success"] is True
            assert data["message"] == "Alerts sent to all active contacts."

        updated_contact = {
            "name": "John Doe",
            "phone_number": "1234567890",
            "status": 0
        }
        response = client.put(f'/contacts/{contact_id}', json=updated_contact)
        assert response.status_code == 200
        assert response.json['name'] == 'John Doe'

        with patch('contacts_routes.AlertService') as mock_alert_service:
            mock_instance = mock_alert_service.return_value
            mock_instance.send_alert.return_value = "test-sid"

            response = client.post('/contacts/alert-all', json={"message": "Test alert!"})
            
            assert response.status_code == 404
            data = json.loads(response.data)
            assert data["success"] is False
            assert data["message"] == "No active contacts found."

        response = client.delete(f'/contacts/{contact_id}')
        assert response.status_code == 200
        assert response.json['message'] == 'Contact deleted'

        response = client.get('/contacts')
        assert response.status_code == 200
        assert len(response.json) == 0
