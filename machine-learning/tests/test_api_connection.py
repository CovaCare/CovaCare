import sys
import os
import pytest
import time

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))
from api_connection import start_camera_polling, get_api_cameras, alert_active_contacts, stop_camera_polling

from unittest.mock import patch

@pytest.fixture
def mock_camera_data():
    return [
        {"name": "test1"},
        {"name": "test2"},
    ]

@pytest.fixture
def mock_requests_get():
    with patch('requests.get') as mock:
        yield mock

@pytest.fixture
def mock_requests_post():
    with patch('requests.post') as mock:
        yield mock

def test_poll_cameras(mock_requests_get, mock_camera_data):
    mock_requests_get.return_value.status_code = 200
    mock_requests_get.return_value.json.return_value = mock_camera_data

    start_camera_polling()
    time.sleep(1)
    stop_camera_polling()

    cameras = get_api_cameras()
    assert len(cameras) == len(mock_camera_data)


def test_alert_active_contacts(mock_requests_post):
    mock_requests_post.return_value.status_code = 200

    result = alert_active_contacts("Test Alert")
    assert result is True

def test_alert_active_contacts_failure(mock_requests_post):
    mock_requests_post.return_value.status_code = 500

    result = alert_active_contacts("Test Alert")
    assert result is False
