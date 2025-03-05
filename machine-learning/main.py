import threading
from camera_api_polling import start_api_polling, stop_api_polling
from camera_processing import manage_camera_threads, display_frames, stop_processing

def main():
    start_api_polling()

    cam_thread = threading.Thread(target=manage_camera_threads, daemon=True)
    cam_thread.start()

    try:
        display_frames() 
    except KeyboardInterrupt:
        print("Stopping...")
        stop_processing()
        stop_api_polling()

if __name__ == '__main__':
    main()
