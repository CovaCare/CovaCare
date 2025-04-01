import numpy as np
import time
from config import MP_LANDMARK_SIZE

class InactivityMonitor:
    def __init__(self, sensitivity, duration):
        self.previous_keypoints = None
        self.sensitivity = sensitivity
        self.duration = duration
        self.inactive_time = 0
        self.last_frame_time = time.time()

    def check_inactivity(self, current_keypoints):
        if self.previous_keypoints is not None and not np.all(current_keypoints == np.zeros((MP_LANDMARK_SIZE, 2))) and not np.all(self.previous_keypoints == np.zeros((MP_LANDMARK_SIZE, 2))):
            diff = np.linalg.norm(current_keypoints - self.previous_keypoints, axis=1)
            movement = np.mean(diff)

            if movement < self.sensitivity:
                self.inactive_time += time.time() - self.last_frame_time
            else:
                self.inactive_time = 0

        self.previous_keypoints = current_keypoints
        self.last_frame_time = time.time()

        return self.inactive_time >= self.duration
