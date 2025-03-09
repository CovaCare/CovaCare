# System Endpoints
from flask import Blueprint, jsonify

system_bp = Blueprint('system', __name__)

@system_bp.route('/system/status', methods=['GET'])
def system_status():
    return jsonify({"status": "online"})

