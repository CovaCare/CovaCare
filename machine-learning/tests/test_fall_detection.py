import pytest
from unittest.mock import patch, MagicMock
import numpy as np
from collections import deque
import sys 
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))
from config import FALL_WINDOW_SIZE, FALL_INPUT_SIZE, FALL_PREDICTION_HISTORY_SIZE
from fall_detection import FallDetector

@pytest.fixture
def mock_fall_detector():
    with patch('tensorflow.keras.models.load_model') as mock_load_model:
        mock_model = MagicMock()
        mock_load_model.return_value = mock_model
        
        mock_model.predict.return_value = np.array([[0, 0, 1, 0]])
        
        fall_detector = FallDetector()
        yield fall_detector 


def test_evaluate_window(mock_fall_detector):
    keypoints_data = np.random.uniform(0, 1, FALL_INPUT_SIZE)

    for _ in range(FALL_WINDOW_SIZE - 1):
        result = mock_fall_detector.evaluate_window(keypoints_data)
        assert result == 0
    
    result = mock_fall_detector.evaluate_window(keypoints_data)
    assert result == 2 

def test_check_history_for_falls_pattern_1(mock_fall_detector):
    prediction_history = [0] * 60

    mock_fall_detector.prediction_history = deque(prediction_history, maxlen=FALL_PREDICTION_HISTORY_SIZE)
    result = mock_fall_detector.check_history_for_falls()
    assert result is False 

def test_check_history_for_falls_pattern_2(mock_fall_detector):
    prediction_history = [0] * 10 + [1] * 10 + [2] * 10 + [3] * 10 + [0] * 20


    mock_fall_detector.prediction_history = deque(prediction_history, maxlen=FALL_PREDICTION_HISTORY_SIZE)
    result = mock_fall_detector.check_history_for_falls()
    assert result is True 

def test_check_history_for_falls_pattern_3(mock_fall_detector):
    prediction_history = [0] * 10 + [1] * 6 + [2] * 3 + [1] * 4 + [2] * 3 + [3] * 14 + [0] * 20


    mock_fall_detector.prediction_history = deque(prediction_history, maxlen=FALL_PREDICTION_HISTORY_SIZE)
    result = mock_fall_detector.check_history_for_falls()
    assert result is True 

def test_check_history_for_falls_pattern_4(mock_fall_detector):
    prediction_history = [2] * 59

    mock_fall_detector.prediction_history = deque(prediction_history, maxlen=FALL_PREDICTION_HISTORY_SIZE)
    result = mock_fall_detector.check_history_for_falls()
    assert result is False 

