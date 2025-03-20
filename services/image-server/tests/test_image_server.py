import pytest
import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))
from image_server import app, STATIC_FOLDER

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@pytest.fixture
def setup_test_images():
    test_images_dir = os.path.join(STATIC_FOLDER, 'test')
    if not os.path.exists(test_images_dir):
        os.makedirs(test_images_dir)
    
    test_image_path = os.path.join(test_images_dir, 'test_image.jpg')
    with open(test_image_path, 'w') as f:
        f.write('test image content')
    
    yield
    
    if os.path.exists(test_image_path):
        os.remove(test_image_path)

def test_serve_existing_image(client, setup_test_images):
    """Test serving an existing image"""
    response = client.get('/static/test/test_image.jpg')
    assert response.status_code == 200
    assert response.data == b'test image content'

def test_serve_nonexistent_image(client):
    """Test attempting to serve a non-existent image"""
    response = client.get('/static/test/nonexistent.jpg')
    assert response.status_code == 404
