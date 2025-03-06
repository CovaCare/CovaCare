import sys
import os
import pytest
from datetime import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

from camera_processing import format_stream_url, is_within_time_range

@pytest.fixture
def mock_camera_data():
    return [
        {"stream_url": "111.111", "username": "user1", "password": "pass1"},
    ]


def test_format_stream_url(mock_camera_data):
    camera = mock_camera_data[0]
    formatted_url = format_stream_url(camera)
    assert formatted_url == "rtsp://user1:pass1@111.111:554/stream1"

def test_is_within_time_range():
    start_time = datetime(2025, 3, 5, 11, 30, 0).time()
    end_time = datetime(2025, 3, 5, 13, 30, 0).time()
    now = datetime(2025, 3, 5, 12, 30, 0).time()

    result = is_within_time_range(start_time, end_time, now)
    assert result == True
