import threading
import requests
from config import API_POLLING_PERIOD, API_BASE_URL, API_CAMERA_ROUTE, API_TIMEOUT

lock = threading.Lock()
cameras = []
stop_event = threading.Event()

def poll_cameras():
    while not stop_event.is_set():
        try:
            response = requests.get(API_BASE_URL + API_CAMERA_ROUTE, timeout=API_TIMEOUT)
            if response.status_code == 200:
                new_camera_data = response.json()
                with lock:
                    cameras.clear()
                    cameras.extend(new_camera_data)
            else:
                print(f"API error: {response.status_code}")
        except requests.RequestException as e:
            print(f"Error polling cameras: {e}")
        
        stop_event.wait(API_POLLING_PERIOD)

def start_api_polling():
    thread = threading.Thread(target=poll_cameras, daemon=True)
    thread.start()
    return thread

def stop_api_polling():
    stop_event.set()

def get_api_cameras():
    with lock:
        return cameras.copy()
