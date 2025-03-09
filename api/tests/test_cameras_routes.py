import pytest
from unittest.mock import patch
import json
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))
from cameras_routes import cameras_bp
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
    with patch('cameras_routes.query_db') as mock:
        yield mock

def test_get_cameras(client, mock_query_db):
    mock_cameras = [
        {
            "id": 1,
            "name": "Living Room",
            "username": "admin",
            "password": "pass123",
            "stream_url": "rtsp://example.com",
            "fall_detection_enabled": 1
        }
    ]
    mock_query_db.return_value = mock_cameras

    response = client.get('/cameras')
    assert response.status_code == 200
    assert json.loads(response.data) == mock_cameras

def test_get_camera(client, mock_query_db):
    mock_camera = {
        "id": 1,
        "name": "Living Room",
        "username": "admin",
        "password": "pass123",
        "stream_url": "192.15.168",
        "fall_detection_enabled": 1
    }
    mock_query_db.return_value = mock_camera

    response = client.get('/cameras/1')
    assert response.status_code == 200
    assert json.loads(response.data) == mock_camera

def test_add_camera(client, mock_query_db):
    new_camera = {
        "name": "New Camera",
        "username": "admin",
        "password": "pass123",
        "stream_url": "192.15.168",
        "fall_detection_enabled": 1
    }
    mock_query_db.side_effect = [
        {'lastrowid': 1},
        {"id": 1, **new_camera}
    ]

    response = client.post('/cameras', json=new_camera)
    assert response.status_code == 201

def test_update_camera(client, mock_query_db):
    existing_camera = {
        "id": 1,
        "name": "Old Name",
        "username": "admin",
        "password": "pass123",
        "stream_url": "192.15.168",
        "fall_detection_enabled": 0,
        "inactivity_detection_enabled": 0,
        "fall_detection_start_time": "08:00",
        "fall_detection_end_time": "20:00",
        "inactivity_detection_start_time": "08:00",
        "inactivity_detection_end_time": "20:00",
        "inactivity_detection_sensitivity": 50,
        "inactivity_detection_duration": 30
    }
    mock_query_db.side_effect = [
        existing_camera,
        None,
        {"id": 1, "name": "New Name", **existing_camera}
    ]

    update_data = {"name": "New Name"}
    response = client.put('/cameras/1', json=update_data)
    assert response.status_code == 200

def test_delete_camera(client, mock_query_db):
    mock_query_db.side_effect = [{"id": 1}, None]

    response = client.delete('/cameras/1')
    assert response.status_code == 200
    assert json.loads(response.data)["message"] == "Camera deleted" 