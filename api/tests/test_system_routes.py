import pytest
import json
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))
from system_routes import system_bp
from __init__ import create_app

@pytest.fixture
def app():
    app = create_app()
    return app

@pytest.fixture
def client(app):
    return app.test_client()

def test_system_status(client):
    response = client.get('/system/status')
    assert response.status_code == 200
    assert json.loads(response.data)["status"] == "online"

def test_system_restart(client):
    response = client.post('/system/restart')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert "message" in data
    assert "System restart triggered" in data["message"] 