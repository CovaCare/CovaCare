import threading
import cv2
from datetime import datetime, timedelta
import queue
from urllib.parse import quote, urljoin
import os
from pose import process_pose
from fall_detection import FallDetector
from inactivity_detection import InactivityMonitor
from api_connection import get_api_cameras, alert_active_contacts
from config import ( INCLUDE_API_CAMS, INCLUDE_WEBCAM, CAMERA_STREAM_REFRESH_PERIOD, DISPLAY_VIDEOS, DRAW_LANDMARKS, 
                     DISPLAY_RESULTS_ON_FRAME, SEND_ALERTS, FALL_ALERT_TIMEOUT_PER_CAMERA, INACTIVITY_ALERT_TIMEOUT_PER_CAMERA, 
                     DEFAULT_INACTIVITY_DETECTION_ENABLED, DEFAULT_FALL_DETECTION_ENABLED, DEFAULT_INACTIVITY_DURATION, 
                     DEFAULT_INACTIVITY_SENSITIVITY, CAP_GRAB_COUNT, ENFORCE_REALTIME )

import sys
image_server_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 
                                'services', 'image-server', 'src')
sys.path.append(image_server_path)
from server_config import BASE_URL

frame_queue = queue.Queue()
stop_event = threading.Event()

def format_alert_message(event_type, camera_name=None, timestamp=None):
    timestamp = timestamp or datetime.now()
    time_str = timestamp.strftime('%I:%M %p')
    date_str = timestamp.strftime('%B %d, %Y')
    location = f"Camera: {camera_name}" if camera_name else "Unknown Camera"
    
    if event_type == "fall":
        return f"FALL DETECTED \n\nTime: {time_str}\nDate: {date_str}\nLocation: {location}\n\nImmediate assistance may be required. Please check on the person as soon as possible."
    elif event_type == "inactivity":
        return f"INACTIVITY ALERT \n\nTime: {time_str}\nDate: {date_str}\nLocation: {location}\n\nNo movement has been detected for an extended period. Please check on the person."
    return ""

def save_incident_frame(frame, incident_type, camera_name=None):
    image_server_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 
                                   'services', 'image-server', 'src', 'static', 'images')
    os.makedirs(image_server_dir, exist_ok=True)
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    camera_id = camera_name.replace(" ", "_").lower() if camera_name else "unknown_camera"
    filename = f'{incident_type}_incident_{camera_id}_{timestamp}.jpeg'
    filepath = os.path.join(image_server_dir, filename)
    
    cv2.imwrite(filepath, frame, [cv2.IMWRITE_JPEG_QUALITY, 95])
    
    relative_path = f'/static/images/{filename}'
    full_url = urljoin(BASE_URL, relative_path)
    
    return full_url

def manage_camera_threads():
    active_threads = {}

    while not stop_event.is_set():
        new_camera_data = get_api_cameras()
        current_cameras = {}

        if INCLUDE_API_CAMS:
            for cam in new_camera_data:
                url = format_stream_url(cam)
                
                fall_active = bool(cam["fall_detection_enabled"]) and is_within_time_range(
                    cam.get("fall_detection_start_time"), cam.get("fall_detection_end_time"), datetime.now().time()
                )
                
                inactivity_active = bool(cam["inactivity_detection_enabled"]) and is_within_time_range(
                    cam.get("inactivity_detection_start_time"), cam.get("inactivity_detection_end_time"), datetime.now().time()
                )

                settings = (
                    fall_active,
                    inactivity_active,
                    cam.get("inactivity_detection_sensitivity", DEFAULT_INACTIVITY_SENSITIVITY),
                    cam.get("inactivity_detection_duration", DEFAULT_INACTIVITY_DURATION),
                    cam.get("name", "Unknown Camera")
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

def is_within_time_range(start_time, end_time, now):
    if start_time == "00:00" and end_time == "00:00":  # All-day configuration
        return True

    today = datetime.today().date()

    start_dt = datetime.strptime(start_time, "%H:%M").replace(year=today.year, month=today.month, day=today.day)
    end_dt = datetime.strptime(end_time, "%H:%M").replace(year=today.year, month=today.month, day=today.day)

    if end_dt < start_dt:
        end_dt += timedelta(days=1)

    now_dt = datetime.combine(today, now)
    if now_dt < start_dt:
        now_dt += timedelta(days=1)

    return start_dt <= now_dt <= end_dt


def process_camera(stream_url, fall_detection_active, inactivity_detection_active, inactivity_sensitivity, inactivity_duration, camera_name):
    cap = cv2.VideoCapture(stream_url)
    if not cap.isOpened():
        print(f"Failed to connect to {stream_url}")
        return

    fall_detector = FallDetector()
    inactivity_monitor = InactivityMonitor(inactivity_sensitivity, inactivity_duration * 60)

    last_fall_alert_time = datetime.now() - timedelta(seconds=FALL_ALERT_TIMEOUT_PER_CAMERA + 1)
    last_inactivity_alert_time = datetime.now() - timedelta(seconds=INACTIVITY_ALERT_TIMEOUT_PER_CAMERA + 1)

    while not stop_event.is_set():
        if ENFORCE_REALTIME and CAP_GRAB_COUNT > 0:
            for _ in range(CAP_GRAB_COUNT):
                cap.grab()
            ret, frame = cap.retrieve()
        else:
            ret, frame = cap.read()

        if not ret:
            continue

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
                (0, 255, 0), 2, cv2.LINE_AA 
            )
            cv2.putText(
                frame, f"Fall Detected: {fall_detected}", (0, 100),
                cv2.FONT_HERSHEY_SIMPLEX, 1,
                (0, 255, 0), 2, cv2.LINE_AA 
            )
            cv2.putText(
                frame, f"Inactivity Detected: {inactive}", (0, 150),
                cv2.FONT_HERSHEY_SIMPLEX, 1,
                (0, 255, 0), 2, cv2.LINE_AA
            )
            # cv2.putText(
            #     frame, f"Inactivity Active: {inactivity_detection_active}", (0, 200),
            #     cv2.FONT_HERSHEY_SIMPLEX, 1,
            #     (0, 255, 0), 2, cv2.LINE_AA
            # )
            # cv2.putText(
            #     frame, f"Fall Active: {fall_detection_active}", (0, 250),
            #     cv2.FONT_HERSHEY_SIMPLEX, 1,
            #     (0, 255, 0), 2, cv2.LINE_AA
            # )
            # cv2.putText(
            #     frame, f"Duration: {inactivity_duration}", (0, 300),
            #     cv2.FONT_HERSHEY_SIMPLEX, 1,
            #     (0, 255, 0), 2, cv2.LINE_AA
            # )
            
            if SEND_ALERTS:
                current_time = datetime.now()
                
                if fall_detected:
                    time_since_last_fall_alert = (current_time - last_fall_alert_time).total_seconds()
                    if time_since_last_fall_alert > FALL_ALERT_TIMEOUT_PER_CAMERA:
                        image_url = save_incident_frame(frame, "fall", camera_name)
                        message = format_alert_message("fall", camera_name, current_time)
                        message += f"\n\n{image_url}"
                        success = alert_active_contacts(message)
                        if success:
                            last_fall_alert_time = current_time
                            
                if inactive:
                    time_since_last_inactivity_alert = (current_time - last_inactivity_alert_time).total_seconds()
                    if time_since_last_inactivity_alert > INACTIVITY_ALERT_TIMEOUT_PER_CAMERA:
                        image_url = save_incident_frame(frame, "inactivity", camera_name)
                        message = format_alert_message("inactivity", camera_name, current_time)
                        message += f"\n\n{image_url}"
                        success = alert_active_contacts(message)
                        if success:
                            last_inactivity_alert_time = current_time

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
