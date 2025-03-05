import mediapipe as mp
import numpy as np
from config import MP_POSE_MODEL

mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils
pose_model = mp_pose.Pose(model_complexity=MP_POSE_MODEL)

key_points = {
    'left_shoulder': 11, 'right_shoulder': 12,
    'left_elbow': 13, 'right_elbow': 14,
    'left_wrist': 15, 'right_wrist': 16,
    'left_hip': 23, 'right_hip': 24,
    'left_knee': 25, 'right_knee': 26,
    'left_ankle': 27, 'right_ankle': 28
}

def process_pose(frame, draw_landmarks=False):
    results = pose_model.process(frame)
    keypoints_data = []

    if results.pose_landmarks:
        for point_index in key_points.values():
            landmark = results.pose_landmarks.landmark[point_index]
            keypoints_data.extend([landmark.x, landmark.y, landmark.z])

        if draw_landmarks:
            mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

    return keypoints_data, frame

