import cv2
import mediapipe as mp
import csv

mp_pose = mp.solutions.pose
pose_full = mp_pose.Pose(model_complexity=1)  # Full model (more accurate)

cap = cv2.VideoCapture('sample_videos/sample_video.mp4')

# Define the key points of interest
key_points = {
    'left_shoulder': 11,
    'right_shoulder': 12,
    'left_elbow': 13,
    'right_elbow': 14,
    'left_wrist': 15,
    'right_wrist': 16,
    'left_hip': 23,
    'right_hip': 24,
    'left_knee': 25,
    'right_knee': 26,
    'left_ankle': 27,
    'right_ankle': 28
}

with open('pose_results/pose_results.csv', mode='w', newline='') as file:
    writer = csv.writer(file)

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        results = pose_full.process(frame)

        # Extract and save specific key points for each frame
        if results.pose_landmarks:
            keypoints_data = []

            for point_name, point_index in key_points.items():
                landmark = results.pose_landmarks.landmark[point_index]
                keypoints_data.append(landmark.x)
                keypoints_data.append(landmark.y)

            writer.writerow(keypoints_data)

            # Draw landmarks
            mp.solutions.drawing_utils.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

        cv2.imshow('MediaPipe Pose', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()
