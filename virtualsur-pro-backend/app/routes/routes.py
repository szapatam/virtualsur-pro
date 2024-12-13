from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

main = Blueprint('main', __name__)


@main.route('/')
def home():
    return jsonify({"mensaje": "Bienvenido al backend de VirtualSur"})

@main.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    print("authorization Header:", request.headers.get('Authorization'))
    current_user = get_jwt_identity()  # Obtiene la identidad del usuario desde el token
    return jsonify({
        "message": "This is a protected route",
        "current_user": current_user
    }), 200