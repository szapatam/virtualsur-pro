from flask import Blueprint, jsonify, request
from . import db
from .models import Cliente

main = Blueprint('main', __name__)

@main.route('/')
def home():
    return jsonify({"mensaje": "Bienvenido al bakcend de VirtualSur"})

# Ruta para agregar un nuevo cliente (POST)
@main.route('/clientes', methods=['POST'])
def agregar_cliente():
    data = request.get_json()  # Recibir los datos en formato JSON desde la solicitud

    nuevo_cliente = Cliente(
        client_name=data.get('client_name'),
        client_email=data.get('client_email'),
        client_address=data.get('client_address'),
        client_rut=data.get('client_rut'),
        client_phone=data.get('client_phone')
    )
    
    # Agregar y confirmar en la base de datos
    db.session.add(nuevo_cliente)
    db.session.commit()

    return jsonify({"mensaje": f"Cliente '{data.get('client_name')}' agregado correctamente"}), 201


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


# Ruta para obtener un cliente específico por su RUT (GET)
@main.route('/clientes/<string:rut>', methods=['GET'])
def obtener_cliente(rut):
    cliente = Cliente.query.filter_by(client_rut=rut).first_or_404()  # Obtener el cliente por RUT o devolver un error 404 si no existe
    return jsonify({"client_id": cliente.client_id, "client_name": cliente.client_name, "client_email": cliente.client_email, "client_address": cliente.client_address, "client_rut": cliente.client_rut, "client_phone": cliente.client_phone})


# Ruta para actualizar un cliente por su RUT (PUT)
@main.route('/clientes/<string:rut>', methods=['PUT'])
def actualizar_cliente(rut):
    data = request.get_json()
    cliente = Cliente.query.filter_by(client_rut=rut).first_or_404()

    # Actualizar los campos del cliente con los datos recibidos
    cliente.client_name = data.get('client_name')
    cliente.client_email = data.get('client_email')
    cliente.client_address = data.get('client_address')
    cliente.client_phone = data.get('client_phone')

    # Confirmar cambios en la base de datos
    db.session.commit()
    return jsonify({"mensaje": f"Cliente '{cliente.client_name}' actualizado correctamente"})


# Ruta para eliminar un cliente por su RUT (DELETE)
@main.route('/clientes/<string:rut>', methods=['DELETE'])
def eliminar_cliente(rut):
    cliente = Cliente.query.filter_by(client_rut=rut).first_or_404()
    db.session.delete(cliente)
    db.session.commit()
    return jsonify({"mensaje": f"Cliente '{cliente.client_name}' eliminado correctamente"})
