import time
import cv2
import mediapipe as mp

mp_pose = mp.solutions.pose
pose_lite = mp_pose.Pose(model_complexity=0)  # Lite model (faster)
pose_full = mp_pose.Pose(model_complexity=1)  # Full model (more accurate)

# Webcam
cap = cv2.VideoCapture(0)
# Video file
#cap = cv2.VideoCapture('output_video_full.mp4')

# Function to draw the pose landmarks on the frame
def draw_landmarks(frame, results):
    if results.pose_landmarks:
        mp.solutions.drawing_utils.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    
    start_time = time.time() 
    results_lite = pose_lite.process(frame)
    end_time = time.time()
    
    frame_time_lite = end_time - start_time 
    fps_lite = 1 / frame_time_lite
    
    start_time = time.time() 
    results_full = pose_full.process(frame) 
    end_time = time.time() 
    
    frame_time_full = end_time - start_time 
    fps_full = 1 / frame_time_full
    
    # Draw the pose landmarks for Lite model
    draw_landmarks(frame, results_lite)
    
    # Draw the pose landmarks for Full model
    draw_landmarks(frame, results_full)

    cv2.putText(frame, f'Lite FPS: {fps_lite:.2f}', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    cv2.putText(frame, f'Full FPS: {fps_full:.2f}', (10, 70), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
    
    cv2.imshow('MediaPipe Pose', frame)
    
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
