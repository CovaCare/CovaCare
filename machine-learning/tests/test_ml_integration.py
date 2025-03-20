from unittest.mock import patch
import sys
import os
import threading
import pytest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))
from config import DEFAULT_INACTIVITY_SENSITIVITY, DEFAULT_INACTIVITY_DURATION
from camera_processing import process_camera, stop_processing

@pytest.fixture
def mock_alert():
    with patch('camera_processing.alert_active_contacts') as mock_alert:
        yield mock_alert

@pytest.fixture(autouse=True)
def reset_stop_event():
    with patch('camera_processing.stop_event', threading.Event()) as mock_stop_event:
        yield mock_stop_event


def test_inactivity_detected_from_video(mock_alert):
    stream_url = os.path.join(os.path.dirname(__file__), 'test.mp4')
    fall_detection_active = False
    inactivity_detection_active = True
    inactivity_sensitivity = DEFAULT_INACTIVITY_SENSITIVITY
    inactivity_duration = 0.05

    with patch('camera_processing.SEND_ALERTS', True), patch('camera_processing.NOT_RET_CONTINUE', False), patch('camera_processing.ENFORCE_REALTIME', False), patch('camera_processing.INACTIVITY_ALERT_TIMEOUT_PER_CAMERA', 0), mock_alert:
        process_camera(stream_url, fall_detection_active, inactivity_detection_active, inactivity_sensitivity, inactivity_duration, "test")
        stop_processing()
        assert mock_alert.called

def test_fall_detected_from_video(mock_alert):
    stream_url = os.path.join(os.path.dirname(__file__), 'test.mp4')
    fall_detection_active = True
    inactivity_detection_active = False
    inactivity_sensitivity = DEFAULT_INACTIVITY_SENSITIVITY
    inactivity_duration = DEFAULT_INACTIVITY_DURATION

    with patch('camera_processing.SEND_ALERTS', True), patch('camera_processing.NOT_RET_CONTINUE', False), patch('camera_processing.ENFORCE_REALTIME', False), patch('camera_processing.FALL_ALERT_TIMEOUT_PER_CAMERA', 0), mock_alert:
        process_camera(stream_url, fall_detection_active, inactivity_detection_active, inactivity_sensitivity, inactivity_duration, "test")
        stop_processing()
        assert mock_alert.called






