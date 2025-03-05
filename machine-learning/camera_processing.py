import threading
import cv2
import time
from datetime import datetime
import queue
from urllib.parse import quote
from pose import process_pose
from fall_detection import FallDetector
from inactivity_detection import InactivityMonitor
from api_connection import get_api_cameras, alert_active_contacts
from config import INCLUDE_API_CAMS, INCLUDE_WEBCAM, CAMERA_STREAM_REFRESH_PERIOD, DISPLAY_VIDEOS, DRAW_LANDMARKS, DISPLAY_RESULTS_ON_FRAME, SEND_ALERTS, FALL_ALERT_TIMEOUT_PER_CAMERA, INACTIVITY_ALERT_TIMEOUT_PER_CAMERA, DEFAULT_INACTIVITY_DETECTION_ENABLED, DEFAULT_FALL_DETECTION_ENABLED, DEFAULT_INACTIVITY_DURATION, DEFAULT_INACTIVITY_SENSITIVITY

frame_queue = queue.Queue()
stop_event = threading.Event()

def manage_camera_threads():
    active_threads = {}

    while not stop_event.is_set():
        new_camera_data = get_api_cameras()
        current_cameras = {}

        if INCLUDE_API_CAMS:
            for cam in new_camera_data:
                url = cam["stream_url"]
                
                fall_active = bool(cam["fall_detection_enabled"]) and is_within_time_range(
                    cam.get("fall_detection_start_time"), cam.get("fall_detection_end_time")
                )
                
                inactivity_active = bool(cam["inactivity_detection_enabled"]) and is_within_time_range(
                    cam.get("inactivity_detection_start_time"), cam.get("inactivity_detection_end_time")
                )

                settings = (
                    fall_active,
                    inactivity_active,
                    cam.get("inactivity_detection_sensitivity", DEFAULT_INACTIVITY_SENSITIVITY),
                    cam.get("inactivity_detection_duration", DEFAULT_INACTIVITY_DURATION)
                )

                current_cameras[url] = settings

        if INCLUDE_WEBCAM:
            current_cameras[0] = (DEFAULT_FALL_DETECTION_ENABLED, DEFAULT_INACTIVITY_DETECTION_ENABLED,
                                  DEFAULT_INACTIVITY_SENSITIVITY, DEFAULT_INACTIVITY_DURATION)

        # Restart threads if settings change
        for url, settings in current_cameras.items():
            if url not in active_threads or active_threads[url]["settings"] != settings:
                if url in active_threads:
                    active_threads[url]["thread"].join()  # Ensure the old thread stops
                thread = threading.Thread(target=process_camera, args=(url, *settings), daemon=True)
                thread.start()
                active_threads[url] = {"thread": thread, "settings": settings}

        # Remove threads for removed cameras
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

def is_within_time_range(start_time, end_time):
    if start_time and end_time:
        now = datetime.now().time()
        return start_time <= now <= end_time
    return True 

def process_camera(stream_url, fall_detection_active, inactivity_detection_active, inactivity_sensitivity, inactivity_duration):
    cap = cv2.VideoCapture(stream_url)
    if not cap.isOpened():
        print(f"Failed to connect to {stream_url}")
        return

    fall_detector = FallDetector()
    inactivity_monitor = InactivityMonitor(inactivity_sensitivity, inactivity_duration)

    last_fall_alert_time = 0
    last_inactivity_alert_time = 0

    while not stop_event.is_set():
        ret, frame = cap.read()

        if not ret:
            break

        fall_keypoints, inactivity_keypoints, frame = process_pose(frame, DRAW_LANDMARKS)

        current_window_class = 0
        fall_detected = False
        if fall_detection_active:
            current_window_class = fall_detector.evaluate_window(fall_keypoints)
            fall_detected = fall_detector.check_history_for_falls()

        inactive = False
        if inactivity_detection_active:
            inactive = inactivity_monitor.check_inactivity(inactivity_keypoints)

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
            
            if SEND_ALERTS:
                if fall_detected:
                    if time.time() - last_fall_alert_time > FALL_ALERT_TIMEOUT_PER_CAMERA:
                        success = alert_active_contacts("Fall detected")
                        if success:
                            last_fall_alert_time = time.time()
                if inactive:
                    if time.time() - last_inactivity_alert_time > INACTIVITY_ALERT_TIMEOUT_PER_CAMERA:
                        success = alert_active_contacts("Inactivity detected")
                        if success:
                            last_inactivity_alert_time = time.time()

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
