import numpy as np
import time
from config import INACTIVITY_TIME_LIMIT, INACTIVITY_SENSITIVTY

class InactivityMonitor:
    def __init__(self):
        self.previous_keypoints = None
        self.inactive_time = 0
        self.last_frame_time = time.time()

    def check_inactivity(self, current_keypoints):
        current_keypoints = np.array(current_keypoints).reshape(-1, 2)
        if self.previous_keypoints is not None:
            diff = np.linalg.norm(current_keypoints - self.previous_keypoints, axis=1)
            movement = np.mean(diff)

            if movement < INACTIVITY_SENSITIVTY:
                self.inactive_time += time.time() - self.last_frame_time
            else:
                self.inactive_time = 0

        self.previous_keypoints = current_keypoints
        self.last_frame_time = time.time()

        return self.inactive_time >= INACTIVITY_TIME_LIMIT
