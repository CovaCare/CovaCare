from flask import Flask
from flask_cors import CORS 

def create_app():
    app = Flask(__name__)

    CORS(app)

    from contacts_routes import contacts_bp
    from cameras_routes import cameras_bp
    from system_routes import system_bp
    from health_check_routes import health_checks_bp

    app.register_blueprint(contacts_bp)
    app.register_blueprint(cameras_bp)
    app.register_blueprint(system_bp)
    app.register_blueprint(health_checks_bp)

    return app