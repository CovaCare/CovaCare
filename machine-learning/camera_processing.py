import threading
import cv2
import queue
from urllib.parse import quote
from pose import process_pose
from fall_detection import FallDetector
from inactivity_detection import InactivityMonitor
from camera_api_polling import get_api_cameras
from config import INCLUDE_API_CAMS, INCLUDE_WEBCAM, CAMERA_STREAM_REFRESH_PERIOD, DISPLAY_VIDEOS, DRAW_LANDMARKS, DISPLAY_RESULTS_ON_FRAME

frame_queue = queue.Queue()
stop_event = threading.Event()

def manage_camera_threads():
    active_threads = {}

    while not stop_event.is_set():
        new_camera_data = get_api_cameras()
        current_cameras = set()
        
        if INCLUDE_API_CAMS:
            current_cameras.update(format_stream_url(cam) for cam in new_camera_data)
        if INCLUDE_WEBCAM:
            current_cameras.add(0)

        for url in current_cameras - active_threads.keys():
            thread = threading.Thread(target=process_camera, args=(url,), daemon=True)
            thread.start()
            active_threads[url] = thread

        for url in list(active_threads.keys()):
            if url not in current_cameras:
                active_threads.pop(url)

        stop_event.wait(CAMERA_STREAM_REFRESH_PERIOD)

def format_stream_url(camera):
    stream_url = camera.get("stream_url", "")
    username = camera.get("username", "")
    password = camera.get("password", "")

    if username and password and stream_url:
        user = quote(username)
        pwd = quote(password)
        return f"rtsp://{user}:{pwd}@{stream_url}:554/stream1"
    return 0

def process_camera(stream_url):
    cap = cv2.VideoCapture(stream_url)
    if not cap.isOpened():
        print(f"Failed to connect to {stream_url}")
        return

    fall_detector = FallDetector()
    inactivity_monitor = InactivityMonitor()

    while not stop_event.is_set():
        ret, frame = cap.read()

        if not ret:
            break

        keypoints_data, frame = process_pose(frame, DRAW_LANDMARKS)

        if keypoints_data:
            current_window_class = fall_detector.evaluate_window(keypoints_data)
            fall_detected = fall_detector.check_history_for_falls()
            inactive = inactivity_monitor.check_inactivity(keypoints_data)

            if DISPLAY_RESULTS_ON_FRAME:
                cv2.putText(
                    frame, f"Current Window Class: {current_window_class}", (0, 50),
                    cv2.FONT_HERSHEY_SIMPLEX, 1,
                    (0, 0, 255), 2, cv2.LINE_AA 
                )
                cv2.putText(
                    frame, f"Fall Detected: {fall_detected}", (0, 100),
                    cv2.FONT_HERSHEY_SIMPLEX, 1,
                    (0, 0, 255), 2, cv2.LINE_AA 
                )
                cv2.putText(
                    frame, f"Inactivity Detected: {inactive}", (0, 150),
                    cv2.FONT_HERSHEY_SIMPLEX, 1,
                    (0, 0, 255), 2, cv2.LINE_AA
                )
            
            if 

        if DISPLAY_VIDEOS:
            frame_queue.put((stream_url, frame))

    cap.release()

def display_frames():
    windows = {}

    while not stop_event.is_set():
        while not frame_queue.empty():
            stream_url, frame = frame_queue.get()
            if stream_url not in windows:
                windows[stream_url] = f'Camera {stream_url}'
            cv2.imshow(windows[stream_url], frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            stop_processing()
            break

    cv2.destroyAllWindows()

def stop_processing():
    stop_event.set()
