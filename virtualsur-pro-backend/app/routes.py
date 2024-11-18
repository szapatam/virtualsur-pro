from flask import Blueprint, jsonify, request

main = Blueprint('main', __name__)

@main.route('/')
def home():
    return jsonify({"mensaje": "Bienvenido al bakcend de VirtualSur"})

#Ruta para obtener la lista de clientes (GET)
@main.route('/clientes', methods=['GET'])
def obtener_clientes():
    clientes =[
        {"id": 1, "nombre": "cliente A"},
        {"id": 2, "nombre": "cliente B"},
        {"id": 3, "nombre": "cliente C"}
    ]
    return jsonify(clientes)

def agregar_clientes():
    data = request.get_json()
    return jsonify({"mensaje": f"Cliente {data['nombre']} agregado correctamente"}), 201
