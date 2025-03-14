import pytest
import numpy as np
import time
from unittest.mock import patch
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))
from config import DEFAULT_INACTIVITY_SENSITIVITY, DEFAULT_INACTIVITY_DURATION
from inactivity_detection import InactivityMonitor

@pytest.fixture
def inactivity_monitor():
    return InactivityMonitor(sensitivity=DEFAULT_INACTIVITY_SENSITIVITY, duration=DEFAULT_INACTIVITY_DURATION)

def test_inactivity_detection_no_movement(inactivity_monitor):
    inactivity_monitor.check_inactivity(np.zeros((33, 2)))
    assert inactivity_monitor.check_inactivity(np.zeros((33, 2))) is False

def test_inactivity_detection_movement(inactivity_monitor):
    inactivity_monitor.check_inactivity(np.zeros((33, 2)))
    assert inactivity_monitor.check_inactivity(np.ones((33, 2))) is False 

def test_inactivity_detection_after_duration(inactivity_monitor):
    inactivity_monitor.check_inactivity(np.ones((33, 2)))
    time.sleep(DEFAULT_INACTIVITY_DURATION)
    assert inactivity_monitor.check_inactivity(np.ones((33, 2))) is True
    assert inactivity_monitor.check_inactivity(np.full((33, 2), 2)) is False

