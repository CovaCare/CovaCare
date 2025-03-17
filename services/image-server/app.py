from flask import Flask, send_from_directory, send_file
import os

app = Flask(__name__)

STATIC_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')
IMAGE_FOLDER = os.path.join(STATIC_FOLDER, 'images')

os.makedirs(IMAGE_FOLDER, exist_ok=True)

@app.route('/static/images/<path:filename>')
def serve_image(filename):
    """Serve images from the static/images directory"""
    return send_from_directory(IMAGE_FOLDER, filename, mimetype='image/jpeg')

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return {'status': 'healthy'}, 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 