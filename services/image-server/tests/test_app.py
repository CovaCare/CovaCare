import os
import sys
import pytest
from PIL import Image
import shutil
from datetime import datetime

# Add the parent directory to Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from src.app import app, IMAGE_FOLDER

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@pytest.fixture
def test_image():

    os.makedirs(IMAGE_FOLDER, exist_ok=True)
    
    def _create_test_image(filename):
        # Create a simple test image (100x100 red square)
        image = Image.new('RGB', (100, 100), color='red')
        filepath = os.path.join(IMAGE_FOLDER, filename)
        image.save(filepath, 'JPEG')
        return filepath
    
    yield _create_test_image
    
    if os.path.exists(IMAGE_FOLDER):
        shutil.rmtree(IMAGE_FOLDER)
        os.makedirs(IMAGE_FOLDER)

def test_serve_image(client, test_image):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"fall_detection_camera1_{timestamp}.jpeg"
    test_image(filename)
    
    response = client.get(f'/static/images/{filename}')
    
    assert response.status_code == 200
    assert response.headers['Content-Type'] == 'image/jpeg'
    assert os.path.exists(os.path.join(IMAGE_FOLDER, filename))

def test_serve_nonexistent_image(client):
    response = client.get('/static/images/nonexistent.jpg')
    assert response.status_code == 404

def test_multiple_images(client, test_image):
    filenames = []
    for i in range(3):
        timestamp = datetime.now().strftime(f"%Y%m%d_%H%M%S_{i}")
        filename = f"fall_detection_camera{i}_{timestamp}.jpeg"
        test_image(filename)
        filenames.append(filename)
    
    for filename in filenames:
        response = client.get(f'/static/images/{filename}')
        assert response.status_code == 200
        assert response.headers['Content-Type'] == 'image/jpeg'
        assert os.path.exists(os.path.join(IMAGE_FOLDER, filename))

def test_image_directory_structure(test_image):
    assert os.path.exists(IMAGE_FOLDER)
    assert os.path.isdir(IMAGE_FOLDER)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"fall_detection_camera1_{timestamp}.jpeg"
    filepath = test_image(filename)
    
    assert os.path.exists(filepath)
    assert os.path.isfile(filepath)
    
    assert os.path.dirname(filepath) == IMAGE_FOLDER 