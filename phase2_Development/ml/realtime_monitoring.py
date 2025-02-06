import threading
import time
import requests
import cv2
from urllib.parse import quote
import mediapipe as mp
from collections import deque
import tensorflow as tf
import numpy as np

DRAW_LANDMARKS = True
SHOW_VIDEO = True
INCLUDE_WEBCAM = False
DROP_FRAMES = True
INCLUDE_API_CAMS = True

MOVEMENT_THRESHOLD = 0.005  # Sensitivity
INACTIVITY_TIME_LIMIT = 5  # In seconds

@tf.keras.utils.register_keras_serializable()
class FallDetectionLSTM(tf.keras.Model):
    def __init__(self, hidden_size=128, output_size=1, **kwargs):
        super(FallDetectionLSTM, self).__init__(**kwargs)
        self.hidden_size = hidden_size
        self.output_size = output_size
        self.lstm = tf.keras.layers.LSTM(self.hidden_size, return_sequences=False, kernel_regularizer=tf.keras.regularizers.l2(0.01))
        self.dropout = tf.keras.layers.Dropout(0.2)
        self.fc = tf.keras.layers.Dense(self.output_size, activation='sigmoid', kernel_regularizer=tf.keras.regularizers.l2(0.01))

    def call(self, inputs):
        x = self.lstm(inputs)
        x = self.dropout(x)
        return self.fc(x)

    def get_config(self):
        config = super(FallDetectionLSTM, self).get_config()
        config.update({
            'hidden_size': self.hidden_size,
            'output_size': self.output_size
        })
        return config

    @classmethod
    def from_config(cls, config):
        return cls(**config)

input_size = 36
sequence_length = 30

model = tf.keras.models.load_model('fall_detection.keras', custom_objects={'FallDetectionLSTM': FallDetectionLSTM})

mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils
pose_full = mp_pose.Pose(model_complexity=1)

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

cameras = []
lock = threading.Lock()
running = True
target_fps = 15
frame_dict = {}

WINDOW_SIZE = 30

previous_keypoints = None
inactive_time = 0  
last_frame_time = time.time()

def poll_cameras(api_url):
    global cameras, running
    while running:
        try:
            response = requests.get(api_url, timeout=5)
            if response.status_code == 200:
                new_camera_data = response.json()
                with lock:
                    cameras.clear()
                    if INCLUDE_API_CAMS:
                        cameras.extend(new_camera_data)
                    if INCLUDE_WEBCAM:
                        cameras.append({"stream_url": 0})

        except requests.RequestException as e:
            print(f"Error polling cameras: {e}")
        time.sleep(10)

def process_camera(camera):
    global previous_keypoints, inactive_time, last_frame_time

    stream_url = camera.get("stream_url", "")
    username = camera.get("username", "")
    password = camera.get("password", "")

    if username and password and stream_url:
        user = quote(username)
        pwd = quote(password)
        stream_url = f"rtsp://{user}:{pwd}@{stream_url}:554/stream1"
    else:
        stream_url = 0

    cap = cv2.VideoCapture(stream_url)
    cap.set(cv2.CAP_PROP_FPS, target_fps)

    pose_data_window = deque(maxlen=WINDOW_SIZE)

    while running:
        if not cap.isOpened():
            print(f"Failed to connect to {stream_url}")
            break

        if DROP_FRAMES:
            while cap.isOpened():
                ret, frame = cap.read()
                if not cap.grab(): 
                    break
                if ret:
                    break
        else:
            ret, frame = cap.read()

        if ret:
            results = pose_full.process(frame)

            keypoints_data = []
            if results.pose_landmarks:
                for point_index in key_points.values():
                    landmark = results.pose_landmarks.landmark[point_index]
                    keypoints_data.extend([landmark.x, landmark.y, landmark.z])

                # Inactivity detection
                current_keypoints = np.array([[lmk.x, lmk.y] for lmk in results.pose_landmarks.landmark])

                if previous_keypoints is not None:
                    diff = np.linalg.norm(current_keypoints - previous_keypoints, axis=1)
                    movement = np.mean(diff)

                    if movement < MOVEMENT_THRESHOLD:
                        inactive_time += time.time() - last_frame_time
                    else:
                        inactive_time = 0

                    cv2.putText(frame, f'Diff: {movement:.4f}', (10, 70),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

                previous_keypoints = current_keypoints
                last_frame_time = time.time()

                if inactive_time >= INACTIVITY_TIME_LIMIT:
                    #Send SMS alert
                    cv2.putText(frame, 'ALERT: Prolonged Inactivity!', (10, 140),
                                cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 0, 255), 2)

                if SHOW_VIDEO and DRAW_LANDMARKS:
                    mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
            else:
                keypoints_data = [0] * (len(key_points) * 3)

            pose_data_window.append(keypoints_data)
            if len(pose_data_window) == WINDOW_SIZE:
                sequence_data = np.array(pose_data_window).reshape(1, WINDOW_SIZE, input_size)
                prediction = model.predict(sequence_data)
                prediction = (prediction > 0.5).astype(int)

                if prediction == 1:
                    #Send SMS alert
                    print(f"Fall detected in stream {stream_url}")
                    font = cv2.FONT_HERSHEY_SIMPLEX
                    cv2.putText(frame, 'Fall detected', (50, 50), font, 1, (0, 0, 255), 2, cv2.LINE_AA)

            if SHOW_VIDEO:
                with lock:
                    frame_dict[stream_url] = frame

    cap.release()

def display_frames():
    while running:
        with lock:
            for stream_url, frame in frame_dict.items():
                cv2.imshow(f'Camera {stream_url}', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cv2.destroyAllWindows()

def start_camera_threads():
    camera_threads = {}
    while running:
        with lock:
            current_cameras = cameras.copy()

        for camera in current_cameras:
            stream_url = camera.get("stream_url", "")
            if stream_url not in camera_threads:
                thread = threading.Thread(target=process_camera, args=(camera,))
                camera_threads[stream_url] = thread
                thread.start()

        for stream_url in list(camera_threads.keys()):
            if stream_url not in [cam.get("stream_url", "") for cam in current_cameras]:
                camera_threads.pop(stream_url)

        time.sleep(5)

def stop_polling():
    global running
    running = False

if __name__ == '__main__':
    api_url = 'http://localhost:5001/cameras'

    polling_thread = threading.Thread(target=poll_cameras, args=(api_url,))
    polling_thread.start()

    try:
        threading.Thread(target=start_camera_threads).start()
        if SHOW_VIDEO:
            display_frames()
    except KeyboardInterrupt:
        print("Stopping...")
        stop_polling()
        polling_thread.join()
