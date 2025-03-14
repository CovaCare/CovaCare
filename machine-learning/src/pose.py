import mediapipe as mp
import numpy as np
from config import MP_POSE_MODEL, MP_LANDMARK_SIZE, MP_CONFIDENCE_THRESHOLD


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
    fall_keypoints = []
    inactivity_keypoints = []

    if results.pose_landmarks:
        total_confidence = np.mean([lmk.visibility for lmk in results.pose_landmarks.landmark])

        if total_confidence < MP_CONFIDENCE_THRESHOLD:
            return [0] * (len(key_points) * 3), np.zeros((MP_LANDMARK_SIZE, 2)), frame

        inactivity_keypoints = np.array(
            [[lmk.x, lmk.y] for lmk in results.pose_landmarks.landmark]
        )
        for point_index in key_points.values():
            landmark = results.pose_landmarks.landmark[point_index]
            fall_keypoints.extend([landmark.x, landmark.y, landmark.z])

        if draw_landmarks:
            mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
    
    else:
        fall_keypoints = [0] * (len(key_points) * 3)
        inactivity_keypoints = np.zeros((MP_LANDMARK_SIZE, 2))

    return fall_keypoints, inactivity_keypoints, frame
