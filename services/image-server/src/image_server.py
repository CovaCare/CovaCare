from flask import Flask, send_from_directory
import os
import time
import threading

app = Flask(__name__)

STATIC_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')
IMAGES_FOLDER = os.path.join(STATIC_FOLDER, 'images')
CLEANUP_TIMEOUT = 30
RETENTION_TIME = 120

if not os.path.exists(STATIC_FOLDER):
    os.makedirs(STATIC_FOLDER)
if not os.path.exists(IMAGES_FOLDER):
    os.makedirs(IMAGES_FOLDER)

@app.route('/static/images/<path:filename>')
def serve_image(filename):
    return send_from_directory(IMAGES_FOLDER, filename)

@app.route('/health')
def health_check():
    return {'status': 'healthy'}, 200

def cleanup_images():
    while True:
        current_time = time.time()
        for filename in os.listdir(IMAGES_FOLDER):
            file_path = os.path.join(IMAGES_FOLDER, filename)
            if os.path.isfile(file_path):
                file_age = current_time - os.path.getmtime(file_path)
                if file_age > RETENTION_TIME:
                    os.remove(file_path)
        time.sleep(CLEANUP_TIMEOUT)

cleanup_thread = threading.Thread(target=cleanup_images, daemon=True)
cleanup_thread.start()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)
