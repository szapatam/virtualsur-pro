from flask import Blueprint, jsonify, request
from .models import Cliente, Personal, Role, Equipment, Category, Subcategory
from . import db

main = Blueprint('main', __name__)


@main.route('/roles', methods=['GET'])
def get_roles():
    roles = Role.query.all()
    roles_list = [{"role_id": role.role_id, "role_name": role.role_name}
                  for role in roles]
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
    # Realizar un join entre Personal y Rol para obtener los nombres de los roles
    personal_list = Personal.query.join(Role, Personal.role_id == Role.role_id).add_columns(
        Personal.staff_id,
        Personal.staff_name,
        Personal.staff_rut,
        Personal.staff_email,
        Personal.staff_phone,
        Personal.staff_address,
        Role.role_name.label("role_name")
    ).all()

    # Crear la respuesta JSON incluyendo el nombre del rol
    result = [
        {
            "staff_id": p.staff_id,
            "staff_name": p.staff_name,
            "staff_rut": p.staff_rut,
            "staff_email": p.staff_email,
            "staff_phone": p.staff_phone,
            "staff_address": p.staff_address,
            "role": p.role_name
        } for p in personal_list
    ]
    return jsonify(result)

# Ruta obtener datos por ID


@main.route('/personal/<int:staff_id>', methods=['GET'])
def get_personal_detail(staff_id):
    print("fetching details for staff_id", staff_id)
    personal = Personal.query.join(Role, Personal.role_id == Role.role_id).add_columns(
        Personal.staff_id,
        Personal.staff_name,
        Personal.staff_rut,
        Personal.staff_email,
        Personal.staff_phone,
        Personal.staff_address,
        Role.role_name.label("role_name")
    ).filter(Personal.staff_id == staff_id).first()

    if not personal:
        print("Personal no encontrado con ID", staff_id)
        return jsonify({"message": "Personal no encontrado"}), 404

    result = {
        "staff_id": personal.staff_id,
        "staff_name": personal.staff_name,
        "staff_rut": personal.staff_rut,
        "staff_email": personal.staff_email,
        "staff_phone": personal.staff_phone,
        "staff_address": personal.staff_address,
        "role": personal.role_name
    }
    print("personal econtrado:", result)
    return jsonify(result)

# Ruta para Eliminar un personal por id(DELETE)


@main.route('/personal/<int:staff_id>', methods=['DELETE'])
def delete_staff(staff_id):
    personal = Personal.query.get(staff_id)
    if personal is None:
        return jsonify({"message": "Personal no encontrado"}), 404

    db.session.delete(personal)
    db.session.commit()
    return jsonify({"message": "Personal Eliminado con exito"}), 200


@main.route('/personal/<int:staff_id>', methods=['PUT'])
def update_personal(staff_id):
    personal = Personal.query.get(staff_id)
    if not personal:
        return jsonify({"message": "Personal no encontrado"}), 404

    # Datos del request
    data = request.get_json()

    try:
        personal.staff_name = data['staff_name']
        personal.staff_rut = data['staff_rut']
        personal.staff_email = data['staff_email']
        personal.staff_phone = data['staff_phone']
        personal.staff_address = data['staff_address']
        personal.role_id = data['role_id']

        db.session.commit()
        return jsonify({"message": "Datos del personal actualizados correctamente"}), 200
    except Exception:
        return jsonify({"message": "Error al actualizar el personal"}), 500


# SECCIÓN DE INVENTARIO

# CATEGORIAS Y SUB CATEGORIAS
# Ruta para obtener todas las categorías
@main.route('/category', methods=['GET'])
def get_categorias():
    categorias = Category.query.all()
    result = [{"category_id": c.category_id,
               "category_name": c.category_name} for c in categorias]
    return jsonify(result)

@main.route('/subcategory', methods=['GET'])
def get_subcategorias_all():
    subcategorias = Subcategory.query.all()
    result = [{"category_id": c.category_id,
               "subcategory_name": c.subcategory_name,
               "subcategory_id": c.subcategory_id,
               "tech_code": c.codigo_tecnico} for c in subcategorias]
    return jsonify(result)

@main.route('/subcategory/<int:category_id>', methods=['GET'])
def get_subcategorias(category_id):
    subcategorias = Subcategory.query.filter_by(category_id=category_id).all()
    result = [
        {
            "subcategory_id": s.subcategory_id,
            "subcategory_name": s.subcategory_name,
            "codigo_tecnico": s.codigo_tecnico
        } for s in subcategorias
    ]
    return jsonify(result)


# Ruta para obtener el listado de equipos (GET)
@main.route('/equipment', methods=['GET'])
def obtener_equipos():
    # Join para traer información de categorías y subcategorías
    equipos = Equipment.query \
        .join(Subcategory, Equipment.subcategory_id == Subcategory.subcategory_id) \
        .join(Category, Subcategory.category_id == Category.category_id) \
        .add_columns(
            Equipment.equipment_id,
            Equipment.tech_code,
            Equipment.status_equipment,
            Equipment.equipment_name,
            Subcategory.subcategory_name,
            Category.category_name
        ).all()

    # Convertir los resultados en una lista de diccionarios
    result = [
        {
            "equipment_id": equipo.equipment_id,
            "tech_code": equipo.tech_code,
            "status_equipment": equipo.status_equipment,
            "equipment_name": equipo.equipment_name,
            "subcategory_name": equipo.subcategory_name,
            "category_name": equipo.category_name
        } for equipo in equipos
    ]

    # Retornar como JSON
    return jsonify(result)


# RUTA: Obtener equipo por ID
@main.route('/equipment/<int:equipment_id>', methods=['GET'])
def get_equipment_detail(equipment_id):
    equipment = Equipment.query.filter_by(equipment_id=equipment_id).first()

    if equipment is None:
        return jsonify({"message": "Equipo no encontrado"}), 404
    
    result = {
        "equipment_id": equipment.equipment_id,
        "subcategory_id": equipment.subcategory_id,
        "tech_code": equipment.tech_code,
        "status_equipment": equipment.status_equipment,
        "equipment_name": equipment.equipment_name
    }
    return jsonify(result)


# Ruta ingresar Equipamiento
@main.route('/equipment', methods=['POST'])
def ingresar_equipo():
    data = request.get_json()

    subcategory_id = data.get('subcategory_id')
    cantidad = int(data.get('cantidad'))
    estado = data.get('estado')
    equipment_name = data.get('equipment_name')

    # buscar el ultimo codigo tecnico de la sub
    last_equipment = Equipment.query.filter_by(
        subcategory_id=subcategory_id).order_by(Equipment.tech_code.desc()).first()

    # obtener el prefijo de codigo tecnico
    subcategory = Subcategory.query.filter_by(
        subcategory_id=subcategory_id).first()
    tech_prefix = subcategory.codigo_tecnico

    # Definir el próximo número a partir del último código encontrado
    if last_equipment:
        last_code = last_equipment.tech_code
        if '-' in last_code:
            try:
                last_number = int(last_code.split('-')[1])
                next_number = last_number + 1
            except ValueError:
                # Si el valor después del guion no es un número, empezamos con 1
                next_number = 1
        else:
            # Si el último código no tiene el formato correcto, comenzamos desde 1
            next_number = 1
    else:
        # Si no existe ningún equipo, comenzamos con el número 1
        next_number = 1

    # Insertar los nuevos equipos
    new_equipments = []
    for _ in range(cantidad):
        tech_code = f"{tech_prefix}-{str(next_number).zfill(3)}"
        new_equipment = Equipment(
            subcategory_id=subcategory_id,
            tech_code=tech_code,
            status_equipment=estado,
            equipment_name=equipment_name
        )
        db.session.add(new_equipment)
        new_equipments.append(new_equipment)
        next_number += 1

    db.session.commit()

    return jsonify({"mensaje": "Equipos ingresados exitosamente", "equipos": [e.tech_code for e in new_equipments]})


#Metodo PUT para actualizar equipamiento
# Ruta actualizar Equipamiento
@main.route('/equipment/<int:equipment_id>', methods=['PUT'])
def actualizar_equipo(equipment_id):
    data = request.get_json()

    equipment = Equipment.query.get(equipment_id)

    if not equipment:
        return jsonify({"message": "Equipamiento no encontrado"}), 404

    # Verificar si se ha cambiado la subcategoría
    new_subcategory_id = data.get('subcategory_id', equipment.subcategory_id)

    if new_subcategory_id != equipment.subcategory_id:
        # Obtener el último código técnico de la nueva subcategoría
        last_equipment = Equipment.query.filter_by(
            subcategory_id=new_subcategory_id).order_by(Equipment.tech_code.desc()).first()

        # Obtener el prefijo del código técnico de la nueva subcategoría
        subcategory = Subcategory.query.filter_by(subcategory_id=new_subcategory_id).first()
        tech_prefix = subcategory.codigo_tecnico

        # Definir el próximo número a partir del último código encontrado
        if last_equipment:
            last_code = last_equipment.tech_code
            if '-' in last_code:
                try:
                    last_number = int(last_code.split('-')[1])
                    next_number = last_number + 1
                except ValueError:
                    # Si el valor después del guion no es un número, empezamos con 1
                    next_number = 1
            else:
                next_number = 1
        else:
            next_number = 1

        # Actualizar el código técnico
        new_tech_code = f"{tech_prefix}-{str(next_number).zfill(3)}"
        equipment.tech_code = new_tech_code

    # Actualizar otros campos del equipo
    equipment.subcategory_id = new_subcategory_id
    equipment.status_equipment = data.get('status_equipment', equipment.status_equipment)
    equipment.equipment_name = data.get('equipment_name', equipment.equipment_name)

    db.session.commit()

    return jsonify({"message": "Equipamiento actualizado exitosamente."}), 200


@main.route('/equipment/<int:equipment_id>', methods=['DELETE'])
def delete_equipment(equipment_id):
    equipment = Equipment.query.get(equipment_id)
    if equipment is None:
        return jsonify({"message": "equipment no encontrado"}), 404

    db.session.delete(equipment)
    db.session.commit()
    return jsonify({"message": "equipment Eliminado con exito"}), 200


@main.route('/Clients', methods=['GET'])
def get_client():
    client = Cliente.query.all()
    client_list = [{"client_id": client.client_id,
                    "client_name": client.client_name} for client in client]
    return jsonify(client_list)
