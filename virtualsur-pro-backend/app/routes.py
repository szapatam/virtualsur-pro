from flask import Blueprint, jsonify, request
from .models import Cliente
from . import db
import logging

main = Blueprint('main', __name__)


@main.route('/')
def home():
    return jsonify({"mensaje": "Bienvenido al bakcend de VirtualSur"})

# Ruta para agregar un nuevo cliente (POST)


@main.route('/clientes', methods=['POST'])
def agregar_cliente():
    try:
        data = request.get_json()
        logging.warning(f"Datos recibidos: {data}")

        new_client = Cliente(
            client_name=data['client_name'],
            client_email=data['client_email'],
            client_address=data['client_address'],
            client_rut=data['client_rut'],
            client_phone=data['client_phone']
        )
        db.session.add(new_client)
        db.session.commit()
        return jsonify({"message": "Cliente agregado con éxito"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Ruta para obtener la lista de clientes (GET)
@main.route('/clientes', methods=['GET'])
def obtener_clientes():
    clientes = Cliente.query.all()  # Obtener todos los registros de clientes
    clientes_data = [
        {"client_id": cliente.client_id,
         "client_name": cliente.client_name,
         "client_email": cliente.client_email,
         "client_address": cliente.client_address,
         "client_rut": cliente.client_rut,
         "client_phone": cliente.client_phone}
        for cliente in clientes
    ]
    return jsonify(clientes_data)


@main.route('/clientes/<int:client_id>', methods=['GET'])
def obtener_cliente_id(client_id):
    cliente = Cliente.query.get(client_id)
    if cliente is None:
        return jsonify({"message": "Cliente no encontrado"}), 404
    return jsonify({
        "client_id": cliente.client_id,
        "client_name": cliente.client_name,
        "client_email": cliente.client_email,
        "client_address": cliente.client_address,
        "client_rut": cliente.client_rut,
        "client_phone": cliente.client_phone
    })


# Ruta para actualizar un cliente por su RUT (PUT)
@main.route('/clientes/<int:client_id>', methods=['PUT'])
def update_cliente(client_id):
    cliente = Cliente.query.get(client_id)
    if cliente is None:
        return jsonify({"message": "Cliente no encontrado"}), 404

    data = request.get_json()

    # Actualizar los campos del cliente con los datos recibidos
    cliente.client_name = data.get('client_name')
    cliente.client_email = data.get('client_email')
    cliente.client_address = data.get('client_address')
    cliente.client_rut = data.get('client_rut')
    cliente.client_phone = data.get('client_phone')

    # Confirmar cambios en la base de datos
    db.session.commit()
    return jsonify({"mensaje": f"Cliente '{cliente.client_name}' actualizado correctamente"})
