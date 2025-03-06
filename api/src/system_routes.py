# System Endpoints
from flask import Blueprint, jsonify

system_bp = Blueprint('system', __name__)

@system_bp.route('/system/status', methods=['GET'])
def system_status():
    return jsonify({"status": "online"})

@system_bp.route('/system/restart', methods=['POST'])
def system_restart():
    return jsonify({"message": "System restart triggered (not actually implemented)."}), 200
