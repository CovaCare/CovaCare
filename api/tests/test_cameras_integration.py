import pytest
import sys
import os
from unittest.mock import patch

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

def test_cameras_integration(client):
    with patch('db.TESTING_MODE', True):
        query_db('DELETE FROM cameras', commit=True)
        response = client.get('/cameras')
        assert response.status_code == 200
        assert len(response.json) == 0

        new_camera = {
            "name": "Camera 1",
            "username": "admin",
            "password": "pass123",
            "stream_url": "111.111",
            "fall_detection_enabled": 1,
            "inactivity_detection_enabled": 1
        }
        response = client.post('/cameras', json=new_camera)
        assert response.status_code == 201
        camera_id = response.json['id'] 

        response = client.get('/cameras')
        assert response.status_code == 200
        assert len(response.json) == 1
        assert response.json[0]['name'] == 'Camera 1'

        updated_camera = {
            "name": "Updated Camera 1",
            "username": "admin",
            "password": "newpass123",
            "stream_url": "111.111",
            "fall_detection_enabled": 0,
            "inactivity_detection_enabled": 1
        }
        response = client.put(f'/cameras/{camera_id}', json=updated_camera)
        assert response.status_code == 200
        assert response.json['name'] == 'Updated Camera 1'

        response = client.delete(f'/cameras/{camera_id}')
        assert response.status_code == 200
        assert response.json['message'] == 'Camera deleted'

        response = client.get('/cameras')
        assert response.status_code == 200
        assert len(response.json) == 0
