from flask import Blueprint, jsonify, request
from .models import Cliente, Personal, Role
from . import db

main = Blueprint('main', __name__)


@main.route('/roles', methods=['GET'])
def get_roles():
    roles = Role.query.all()
    roles_list = [{"role_id": role.role_id, "role_name": role.role_name} for role in roles]
    return jsonify(roles_list)


@main.route('/')
def home():
    return jsonify({"mensaje": "Bienvenido al bakcend de VirtualSur"})

# Ruta para agregar un nuevo cliente (POST)
@main.route('/clientes', methods=['POST'])
def agregar_cliente():
    try:
        data = request.get_json()
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

# ruta para ver detalle del cliente seleccionado (GET)
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


# Ruta para actualizar un cliente (PUT)
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

# Ruta para Eliminar un cliente por id(DELETE)
@main.route('/clientes/<int:client_id>', methods=['DELETE'])
def delete_cliente(client_id):
    cliente = Cliente.query.get(client_id)
    if cliente is None:
        return jsonify({"message": "Cliente no encontrado"}), 404
    
    db.session.delete(cliente)
    db.session.commit()
    return jsonify({"message": "Cliente Eliminado con exito"}), 200


# ---- SECCIÓN DE PERSONAL -----

@main.route('/personal', methods=['POST'])
def add_personal():
    data = request.get_json()
    new_personal = Personal(
        staff_name=data['staff_name'],
        staff_rut=data['staff_rut'],
        staff_email=data['staff_email'],
        staff_phone=data['staff_phone'],
        staff_address=data['staff_address'],
        role_id=data['role_id'],
    )
    db.session.add(new_personal)
    db.session.commit()
    return jsonify({"mensaje": "Personal creado con exito"})

@main.route('/personal', methods=['GET'])
def get_personal():
    personal_list = Personal.query.all()
    result =[
        {
        "staff_id": p.staff_id,
        "staff_name": p.staff_name,
        "staff_rut": p.staff_rut,
        "staff_email": p.staff_email,
        "staff_phone": p.staff_phone,
        "staff_address": p.staff_address,
        "role_id": p.role_id
        } for p in personal_list
    ]
    return jsonify(result)