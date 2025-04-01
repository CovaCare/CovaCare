import threading
import requests
from config import API_POLLING_PERIOD, API_BASE_URL, API_CAMERA_ROUTE, API_TIMEOUT, API_ALERT_ROUTE

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

def start_camera_polling():
    thread = threading.Thread(target=poll_cameras, daemon=True)
    thread.start()
    return thread

def stop_camera_polling():
    stop_event.set()

def get_api_cameras():
    with lock:
        return cameras.copy()

def alert_active_contacts(message, media_url=None):
    try:
        data = {"message": message}
        if media_url:
            data["media_url"] = media_url
            
        response = requests.post(
            API_BASE_URL + API_ALERT_ROUTE, 
            json=data,
            timeout=API_TIMEOUT
        )
        
        if response.status_code == 200:
            return True
        else:
            print(f"Failed to send alert: {response.status_code} - {response.text}")
            return False
    except requests.RequestException as e:
        print(f"Error alerting active contacts: {e}")
        return False
    
health_checks = {} 

def poll_health_checks():
    while not stop_event.is_set():
        try:
            response = requests.get(API_BASE_URL + '/health_checks', timeout=API_TIMEOUT)
            if response.status_code == 200:
                new_health_checks = response.json()
                with lock:
                    for cam in new_health_checks.get("requested_camera_ids", []):
                        health_checks[cam] = True
                requests.delete(API_BASE_URL + '/health_checks', timeout=API_TIMEOUT)
            else:
                print(f"API error: {response.status_code}")
        except requests.RequestException as e:
            print(f"Error polling health checks: {e}")
        
        stop_event.wait(API_POLLING_PERIOD)

def start_health_check_polling():
    thread = threading.Thread(target=poll_health_checks, daemon=True)
    thread.start()
    return thread

