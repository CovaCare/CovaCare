from flask import Flask, send_from_directory
import os
from server_config import BASE_URL

app = Flask(__name__)

STATIC_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')
if not os.path.exists(STATIC_FOLDER):
    os.makedirs(STATIC_FOLDER)
if not os.path.exists(os.path.join(STATIC_FOLDER, 'images')):
    os.makedirs(os.path.join(STATIC_FOLDER, 'images'))

@app.route('/static/images/<path:filename>')
def serve_image(filename):
    return send_from_directory(os.path.join(STATIC_FOLDER, 'images'), filename)

@app.route('/health')
def health_check():
    return {'status': 'healthy'}, 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) 