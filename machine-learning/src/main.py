import threading
from api_connection import start_camera_polling, stop_camera_polling
from camera_processing import manage_camera_threads, display_frames, stop_processing

def main():
    start_camera_polling()

    cam_thread = threading.Thread(target=manage_camera_threads, daemon=True)
    cam_thread.start()

    try:
        display_frames() 
    except KeyboardInterrupt:
        print("Stopping...")
        stop_processing()
        stop_camera_polling()

if __name__ == '__main__':
    main()
