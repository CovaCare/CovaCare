import cv2
import mediapipe as mp
import numpy as np
import time

mp_pose = mp.solutions.pose
pose = mp_pose.Pose(model_complexity=1)  # Full model (more accurate)
mp_drawing = mp.solutions.drawing_utils

MOVEMENT_THRESHOLD = 0.005  # Sensitivity
INACTIVITY_TIME_LIMIT = 5  # In seconds

previous_keypoints = None
inactive_time = 0  # Time (in seconds) the user has been inactive
last_frame_time = time.time()

cap = cv2.VideoCapture(0)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    current_frame_time = time.time()
    elapsed_time = current_frame_time - last_frame_time
    last_frame_time = current_frame_time

    results = pose.process(frame)

    if results.pose_landmarks:
        current_keypoints = np.array(
            [[lmk.x, lmk.y] for lmk in results.pose_landmarks.landmark]
        )

        # If previous keypoints exist, calculate movement
        if previous_keypoints is not None:
            diff = np.linalg.norm(current_keypoints - previous_keypoints, axis=1)
            movement = np.mean(diff)

            if movement < MOVEMENT_THRESHOLD:
                inactive_time += elapsed_time
            else:
                inactive_time = 0

            cv2.putText(frame, f'Diff: {movement:.4f}', (10, 70),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

        previous_keypoints = current_keypoints

        mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

    cv2.putText(frame, f'Inactive Time: {inactive_time:.2f}s', (10, 100),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)

    if inactive_time >= INACTIVITY_TIME_LIMIT:
        cv2.putText(frame, 'ALERT: Prolonged Inactivity!', (10, 140),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 0, 255), 2)

    cv2.imshow('Time-Based Inactivity Monitor', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
