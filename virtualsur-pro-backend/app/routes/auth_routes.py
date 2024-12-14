from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
from app.models import User
from app import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json

    # Validar datos
    if not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({"error": "All fields are required"}), 400

    # Verificar si el usuario o email ya existe
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"error": "Username already exists"}), 409
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already exists"}), 409

    # Crear nuevo usuario
    new_user = User(
        username=data['username'],
        email=data['email']
    )
    new_user.set_password(data['password'])  # Encriptar contraseña

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json

    # Validar los datos de entrada
    if not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password are required"}), 400

    # Buscar al usuario por email
    user = User.query.filter_by(email=data['email']).first()

    # Verificar si el usuario existe y si la contraseña es correcta
    if not user or not user.check_password(data['password']):
        return jsonify({"error": "Invalid credentials"}), 401

    # Generar un token JWT para el usuario
    identity = str(user.id)
    access_token = create_access_token(
        identity= identity
    )

    return jsonify({"access_token": access_token}), 200

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required()  # El usuario debe estar autenticado
def refresh_token():
    identity = get_jwt_identity()  # Obtener el ID del usuario autenticado
    new_access_token = create_access_token(identity=identity)  # Generar un nuevo token
    return jsonify({"access_token": new_access_token}), 200