from flask import Blueprint, request, jsonify, abort

health_checks_bp = Blueprint('health_checks', __name__)

requested_health_checks = set()

@health_checks_bp.route('/health_checks', methods=['GET'])
def get_health_checks():
    return jsonify({"requested_camera_ids": list(requested_health_checks)})


@health_checks_bp.route('/health_checks', methods=['POST'])
def request_health_check():
    data = request.get_json()

    camera_id = data.get("camera_id", None)
    if not camera_id:
        abort(400, description="Camera ID is required")

    requested_health_checks.update([camera_id])
    
    return jsonify({"message": "Health check request added", "requested_camera_ids": list(requested_health_checks)}), 201

@health_checks_bp.route('/health_checks', methods=['DELETE'])
def reset_health_checks():
    requested_health_checks.clear()

    return jsonify({"message": f"Health checks cleared"}), 200

