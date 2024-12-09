from flask import Blueprint, jsonify, request, make_response
from sqlalchemy import func
from fpdf import FPDF
from datetime import datetime
from .models import Cliente, Personal, Role, Equipment, Category, Subcategory, Contract, ContractEquipment, ContractPersonal, Document
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
        Role.role_name.label("role_name"),
        Personal.status
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
            "role": p.role_name,
            "status": p.status
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
        Role.role_name.label("role_name"),
        Personal.status
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
        "role": personal.role_name,
        "status": personal.status
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
        personal.status = data['status']

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


# SECCIÓN DE CONTRATOS

@main.route('/contracts', methods=['POST'])
def create_contract():
    data = request.get_json()

    # Agregar un print para verificar los datos recibidos
    print("Datos recibidos:", data)

    # Generar el código único para el contrato
    new_contract_code = Contract.generate_contract_code()

    try:
        # Extraer datos con validación de tipo
        client_id = data.get('client_id')
        event_name = data.get('event_name')
        contract_start_date = data.get('contract_start_date')
        event_execution_date = data.get('event_execution_date')
        event_location = data.get('event_location')
        square_meters = float(data['square_meters'])  # Convertir a float
        square_meter_value = float(data['square_meter_value'])  # Convertir a float
        additional_cost = float(data.get('additional_cost', 0))  # Convertir a float

        # Calcular el costo total
        total_cost = (square_meters * square_meter_value) + additional_cost

        # Crear el objeto de contrato
        new_contract = Contract(
            contract_code=new_contract_code,
            client_id=client_id,
            event_name=event_name,
            contract_start_date=contract_start_date,
            event_execution_date=event_execution_date,
            event_location=event_location,
            square_meters=square_meters,
            square_meter_value=square_meter_value,
            additional_cost=additional_cost,
            total_cost=total_cost
        )

        # Agregar el nuevo contrato a la sesión de base de datos
        db.session.add(new_contract)
        db.session.commit()

        return jsonify({
            "message": "Contrato creado con éxito",
            "contract_code": new_contract.contract_code,
            "contract_id": new_contract.contract_id
        }), 201

    except Exception as e:
        db.session.rollback()
        print("Error al crear el contrato:", str(e))
        return jsonify({"error": str(e)}), 400


@main.route('/contracts', methods=['GET'])
def get_contracts():
    contracts = Contract.query.all()
    result = [
        {
            "contract_id": c.contract_id,
            "contract_code": c.contract_code,
            "client_name": c.client.client_name,  # relación con cliente
            "event_name": c.event_name,
            "contract_start_date": c.contract_start_date,
            "event_execution_date": c.event_execution_date,
            "event_location": c.event_location,
            "square_meters": c.square_meters,
            "square_meter_value": c.square_meter_value,
            "total_cost": c.total_cost
        }
        for c in contracts
    ]
    return jsonify(result)

@main.route('/contracts/<int:contract_id>', methods=['GET'])
def get_contract_details(contract_id):
    try:
        # Consultar los detalles básicos del contrato
        contract = Contract.query.join(Cliente, Contract.client_id == Cliente.client_id).add_columns(
            Contract.contract_id,
            Contract.contract_code,
            Cliente.client_name.label("client_name"),
            Contract.event_name,
            Contract.contract_start_date,
            Contract.event_execution_date,
            Contract.event_location,
            Contract.square_meters,
            Contract.square_meter_value,
            Contract.additional_cost,
            Contract.total_cost
        ).filter(Contract.contract_id == contract_id).first()

        if not contract:
            return jsonify({"message": "Contrato no encontrado"}), 404

        # Consultar los equipos asignados al contrato
        equipments = ContractEquipment.query.filter_by(contract_id=contract_id).all()
        equipment_list = [
            {
                "equipment_id": equipment.equipment_id,
                "tech_code": equipment.tech_code,
                "equipment_name": equipment.equipment_name,
                "subcategory_name": equipment.subcategory_name,
                "quantity": equipment.quantity
            }
            for equipment in equipments
        ]

        # Consulta para obtener el personal asignado
        assigned_personnel = db.session.query(
            Personal.staff_id,
            Personal.staff_name,
            Role.role_name
        ).join(Role, Personal.role_id == Role.role_id)\
         .join(ContractPersonal, Personal.staff_id == ContractPersonal.staff_id)\
         .filter(ContractPersonal.contract_id == contract_id).all()

        personnel_list = [
            {"staff_id": person.staff_id, "name": person.staff_name, "role": person.role_name}
            for person in assigned_personnel
        ]

        # Formar el resultado final
        result = {
            "contract_id": contract.contract_id,
            "contract_code": contract.contract_code,
            "client_name": contract.client_name,
            "event_name": contract.event_name,
            "contract_start_date": str(contract.contract_start_date),
            "event_execution_date": str(contract.event_execution_date),
            "event_location": contract.event_location,
            "square_meters": contract.square_meters,
            "square_meter_value": contract.square_meter_value,
            "additional_cost": contract.additional_cost,
            "total_cost": contract.total_cost,
            "equipments": equipment_list,  # Incluir equipos asignados
            'personnel_list': personnel_list # Agregar el personal asignado

        }
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400

    
@main.route('/contracts/<int:contract_id>', methods=['PUT'])
def update_contract(contract_id):
    try:
        # Obtener los datos enviados por el frontend
        data = request.get_json()
        print(data)

        # Buscar el contrato existente
        contract = Contract.query.filter_by(contract_id=contract_id).first()

        if not contract:
            return jsonify({"message": "Contrato no encontrado"}), 404

        # Actualizar los datos del contrato
        contract.client_id = data.get('client_id', contract.client_id)
        contract.event_name = data.get('event_name', contract.event_name)
        contract.contract_start_date = data.get('contract_start_date', contract.contract_start_date)
        contract.event_execution_date = data.get('event_execution_date', contract.event_execution_date)
        contract.event_location = data.get('event_location', contract.event_location)
        contract.square_meters = data.get('square_meters', contract.square_meters)
        contract.square_meter_value = data.get('square_meter_value', contract.square_meter_value)
        contract.additional_cost = data.get('additional_cost', contract.additional_cost)

        # Recalcular el costo total
        contract.total_cost = (
            float(contract.square_meters) * float(contract.square_meter_value)
        ) + float(contract.additional_cost)

        # Manejar equipos asignados
        equipments = data.get('equipments', [])
        removed_equipments = data.get('removed_equipments', [])

        # Eliminar equipos removidos
        if removed_equipments:
            ContractEquipment.query.filter(
                ContractEquipment.contract_id == contract_id,
                ContractEquipment.tech_code.in_(removed_equipments)
            ).delete(synchronize_session='fetch')

        # Agregar nuevos equipos asignados
        for equipment in equipments:
            tech_code = equipment.get('tech_code')
            if not tech_code:
                continue

            # Verificar si ya existe la relación para evitar duplicados
            existing_relation = ContractEquipment.query.filter_by(
                contract_id=contract_id,
                tech_code=tech_code
            ).first()

            if not existing_relation:
                # Crear nueva relación equipo-contrato
                new_contract_equipment = ContractEquipment(
                    contract_id=contract_id,
                    equipment_id=equipment.get('equipment_id'),  # Asegúrate de enviar este campo desde el frontend
                    tech_code=tech_code,
                    equipment_name=equipment.get('equipment_name'),
                    subcategory_name=equipment.get('subcategory_name'),
                    quantity=1  # Cada equipo cuenta como uno
                )
                db.session.add(new_contract_equipment)

                # Cambiar el estado del equipo en la tabla de Equipments
                assigned_equipment = Equipment.query.filter_by(tech_code=tech_code).first()
                if assigned_equipment:
                    assigned_equipment.status_equipment = "Asignado"
                    db.session.add(assigned_equipment)

        #Tratamiento de Personal
        personal = data.get('personal', [])
        removed_personal = data.get('removed_personal', [])

               # Actualizar el estado del personal asignado
        if personal:
            for person_data in personal:
                staff_id = person_data.get("staff_id")
                staff = Personal.query.filter_by(staff_id=staff_id).first()
                if staff:
                    staff.status = "Asignado"
                    db.session.add(staff)

        # Revertir el estado del personal eliminado
        if removed_personal:
            for person_data in removed_personal:
                staff_id = person_data.get("staff_id")
                staff = Personal.query.filter_by(staff_id=staff_id).first()
                if staff:
                    staff.status = "Disponible"
                    db.session.add(staff)


        # Guardar cambios en la base de datos
        db.session.commit()

        return jsonify({"message": "Contrato actualizado con éxito"}), 200

    except Exception as e:
        db.session.rollback()
        print("Error al actualizar contrato:", e)
        return jsonify({"error": str(e)}), 400




@main.route('/contracts/<int:contract_id>', methods=['DELETE'])
def delete_contract(contract_id):
    try:
        contract = Contract.query.get(contract_id)

        if not contract:
            return jsonify({"message": "Contrato no encontrado"}), 404

        db.session.delete(contract)
        db.session.commit()

        return jsonify({"message": "Contrato eliminado con éxito"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
    
# SECCIÓN EQUIPAMIENTO - CONTRATO
@main.route('/contracts/<int:contract_id>/assign_equipment', methods=['POST'])
def assign_equipment(contract_id):
    data = request.get_json()
    subcategory_id = data.get('subcategory_id')
    quantity = data.get('quantity')

    # Validar datos
    if not subcategory_id or not quantity or quantity <= 0:
        return jsonify({"error": "Datos inválidos"}), 400

    # Buscar equipos disponibles
    available_equipments = Equipment.query.filter_by(
        subcategory_id=subcategory_id, status_equipment="Operativa"
    ).order_by(Equipment.tech_code).limit(quantity).all()

    if len(available_equipments) < quantity:
        return jsonify({"error": "No hay suficientes equipos disponibles"}), 400

    # Asignar equipos
    assigned_equipments = []
    for equipment in available_equipments:
        equipment.status_equipment = "Asignado"  # Cambiar estado a 'Asignado'
        db.session.add(equipment)

        # Crear la relación entre contrato y equipo con los nuevos campos
        contract_equipment = ContractEquipment(
            contract_id=contract_id,
            equipment_id=equipment.equipment_id,
            tech_code=equipment.tech_code,
            equipment_name=equipment.equipment_name,
            subcategory_name=equipment.subcategory.subcategory_name,  # Asegúrate de que hay relación en el modelo
            quantity=1  # Cada equipo asignado cuenta como uno
        )
        db.session.add(contract_equipment)

        # Añadir equipo asignado a la respuesta
        assigned_equipments.append({
            "tech_code": equipment.tech_code,
            "equipment_name": equipment.equipment_name
        })

    # Guardar cambios
    db.session.commit()

    return jsonify({"assigned_equipments": assigned_equipments}), 200


@main.route('/contracts/<int:contract_id>/equipments', methods=['GET'])
def get_assigned_equipments(contract_id):
    try:
        assigned_equipments = db.session.query(
            ContractEquipment, Equipment
        ).join(Equipment, ContractEquipment.equipment_id == Equipment.equipment_id).filter(
            ContractEquipment.contract_id == contract_id
        ).all()

        result = [
            {
                "equipment_id": equipment.equipment_id,
                "tech_code": equipment.tech_code,
                "equipment_name": equipment.equipment_name,
                "subcategory_id": equipment.subcategory_id,
                "status_equipment": equipment.status_equipment
            }
            for _, equipment in assigned_equipments
        ]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"message": "Error al obtener los equipamientos asignados.", "error": str(e)}), 500


#MODAL
@main.route('/equipment/available', methods=['GET'])
def get_available_equipments():
    try:
        # Subconsulta para contar equipos disponibles por subcategoría
        subquery_count = db.session.query(
            Equipment.subcategory_id,
            # pylint: disable=not-callable
            func.count(Equipment.equipment_id).label("available_count")
        ).filter(Equipment.status_equipment == "Operativo")\
         .group_by(Equipment.subcategory_id)\
         .subquery()

        # Subconsulta para obtener los equipos disponibles por subcategoría
        subquery_details = db.session.query(
            Equipment.subcategory_id,
            # pylint: disable=not-callable
            func.group_concat(Equipment.tech_code).label("tech_codes"),
            func.group_concat(Equipment.equipment_name).label("equipment_names"),
            func.group_concat(Equipment.equipment_id).label("equipment_ids")
        ).filter(Equipment.status_equipment == "Operativo")\
         .group_by(Equipment.subcategory_id)\
         .subquery()

        # Consulta principal para unir subcategorías, conteo y detalles
        available_equipments = db.session.query(
            Subcategory.subcategory_id,
            Subcategory.subcategory_name,
            # pylint: disable=not-callable
            func.coalesce(subquery_count.c.available_count, 0).label("available_count"),
            func.coalesce(subquery_details.c.tech_codes, "").label("tech_codes"),
            func.coalesce(subquery_details.c.equipment_names, "").label("equipment_names"),
            func.coalesce(subquery_details.c.equipment_ids, "").label("equipment_ids")  # Incluir equipment_ids
        ).outerjoin(subquery_count, Subcategory.subcategory_id == subquery_count.c.subcategory_id)\
         .outerjoin(subquery_details, Subcategory.subcategory_id == subquery_details.c.subcategory_id)\
         .group_by(
             Subcategory.subcategory_id,
             Subcategory.subcategory_name,
             subquery_count.c.available_count,
             subquery_details.c.tech_codes,
             subquery_details.c.equipment_names,
             subquery_details.c.equipment_ids
            # pylint: disable=not-callable
         ).all()

        # Construcción del resultado en JSON
        results = [
            {
                "subcategory_id": equipment.subcategory_id,
                "subcategory_name": equipment.subcategory_name,
                "available_count": equipment.available_count,
                "tech_codes": equipment.tech_codes.split(",") if equipment.tech_codes else [],
                "equipment_names": equipment.equipment_names.split(",") if equipment.equipment_names else [],
                "equipment_ids": equipment.equipment_ids.split(",") if equipment.equipment_ids else []
            }
            for equipment in available_equipments
        ]

        return jsonify(results)

    except Exception as e:
        print(f"Error fetching available equipments: {str(e)}")
        return jsonify({"error": "Unable to fetch available equipments"}), 500


@main.route('/equipment/reserve', methods=['POST'])
def reserve_equipment():
    try:
        data = request.json  # Esperamos un array de subcategorías con cantidades
        reserved_equipments = []  # Lista para almacenar los equipos reservados

        for item in data:
            subcategory_id = item.get('subcategory_id')
            quantity_to_reserve = item.get('quantity')

            if not subcategory_id or not quantity_to_reserve:
                continue  # Saltamos si falta algún dato

            # Obtener equipos disponibles por subcategoría
            available_equipments = Equipment.query.filter_by(
                subcategory_id=subcategory_id,
                status_equipment='Operativo'
            ).limit(quantity_to_reserve).all()

            if len(available_equipments) < quantity_to_reserve:
                return jsonify({"error": f"No hay suficientes equipos disponibles para la subcategoría ID {subcategory_id}"}), 400

            # Actualizar estado de los equipos seleccionados y añadirlos a la lista
            for equipment in available_equipments:
                reserved_equipments.append({
                    "tech_code": equipment.tech_code,
                    "equipment_name": equipment.equipment_name,
                    "subcategory_name": equipment.subcategory.subcategory_name
                })

        # Confirmar cambios en la base de datos
        db.session.commit()

        # Devolver los equipos reservados
        return jsonify(reserved_equipments), 200

    except Exception as e:
        db.session.rollback()
        print("Error reservando equipos:", e)
        return jsonify({"error": str(e)}), 500


@main.route('/contracts/<int:contract_id>/remove_equipment/<int:equipment_id>', methods=['DELETE'])
def remove_equipment(contract_id, equipment_id):
    print("Removing equipment with ID:", equipment_id)  # Depuración
    print("For contract ID:", contract_id)  # Depuración
    try:
        # Buscar la relación entre el contrato y el equipamiento
        contract_equipment = ContractEquipment.query.filter_by(
            contract_id=contract_id, equipment_id=equipment_id
        ).first()

        if not contract_equipment:
            return jsonify({"error": "Relación contrato-equipamiento no encontrada"}), 404

        # Buscar el equipamiento en la tabla de equipamientos
        equipment = Equipment.query.filter_by(equipment_id=equipment_id).first()

        if not equipment:
            return jsonify({"error": "Equipamiento no encontrado"}), 404

        # Cambiar el estado del equipamiento a "Operativa"
        equipment.status_equipment = "Operativo"

        # Eliminar la relación contrato-equipamiento
        db.session.delete(contract_equipment)

        # Guardar cambios en la base de datos
        db.session.commit()

        return jsonify({"message": "Equipamiento eliminado del contrato y marcado como operativo"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

#Personal

@main.route('/contracts/<int:contract_id>/assign_personal', methods=['POST'])
def assign_personal(contract_id):
    try:
        data = request.get_json()
        staff_id = data.get('staff_id')

        if not staff_id:
            return jsonify({"error": "Falta el ID del personal"}), 400

        # Buscar el personal disponible
        staff = Personal.query.filter_by(staff_id=staff_id, status="Disponible").first()

        if not staff:
            return jsonify({"error": "El personal no está disponible"}), 400

        # Crear la relación entre contrato y personal
        contract_personal = ContractPersonal(contract_id=contract_id, staff_id=staff_id)
        db.session.add(contract_personal)

        db.session.commit()

        return jsonify({
            "assigned_personnel":{
            "staff_id": staff.staff_id,
            "name": staff.staff_name,
            "role": staff.role.role_name,
            }
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error al asignar personal: {str(e)}")
        return jsonify({"error": "No se pudo asignar el personal"}), 500
    
@main.route('/contracts/<int:contract_id>/remove_personal/<int:staff_id>', methods=['DELETE'])
def remove_personal(contract_id, staff_id):
    try:
        # Buscar la relación contrato-personal
        contract_personal = ContractPersonal.query.filter_by(
            contract_id=contract_id, staff_id=staff_id
        ).first()

        if not contract_personal:
            return jsonify({"error": "Relación contrato-personal no encontrada"}), 404

        # Cambiar el estado del personal a "Disponible"
        personal = Personal.query.get(staff_id)
        if personal:
            personal.status = "Disponible"

        # Eliminar la relación
        db.session.delete(contract_personal)
        db.session.commit()

        return jsonify({"message": "Personal eliminado del contrato"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
@main.route('/contracts/<int:contract_id>/personal', methods=['GET'])
def get_contract_personal(contract_id):
    try:
        # Obtener personal asignado al contrato
        personal = db.session.query(
            Personal.staff_id,
            Personal.staff_name,
            Role.role_name
        ).join(
            ContractPersonal, Personal.staff_id == ContractPersonal.staff_id
        ).outerjoin(
            Role, Personal.role_id == Role.role_id
        ).filter(
            ContractPersonal.contract_id == contract_id
        ).all()

        result = [
            {
                "staff_id": p.staff_id,
                "name": p.staff_name,
                "role": p.role_name if p.role_name else "Sin rol"
            }
            for p in personal
        ]

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@main.route('/personal/available', methods=['GET'])
def get_available_personal():
    try:
        available_personal = Personal.query.filter_by(status="Disponible").all()

        if not available_personal:
            return jsonify([]), 200

        result = [
            {
                "staff_id": person.staff_id,
                "name": person.staff_name,
                "role": person.role.role_name if person.role else "sin rol asignado"
            }
            for person in available_personal
        ]

        return jsonify(result), 200
    except Exception as e:
        print(f"Error fetching available personal: {str(e)}")
        return jsonify({"error": "Unable to fetch available personal"}), 500


#Sección documentación

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, 'COTIZACIÓN', border=False, ln=True, align='C')
        self.ln(10)

    def add_section_title(self, title):
        self.set_font('Arial', 'B', 10)
        self.cell(0, 10, title, ln=True, border=False)
        self.ln(5)

    def add_table_row(self, col_widths, data, bold=False, fill=True):
        self.set_font('Arial', 'B' if bold else '', 9)
        for i, cell_data in enumerate(data):
            self.cell(col_widths[i], 10, cell_data, border=1, align='C')
        self.ln()

    def add_line_break(self, height=5):
        self.ln(height)

@main.route('/contracts/<int:contract_id>/generate_cotizacion', methods=['POST'])
def generate_cotizacion(contract_id):
    try:
        # Obtener los detalles del contrato y cliente
        contract = Contract.query.get(contract_id)
        client = contract.client

        # Datos del proveedor (fijos)
        provider_data = {
            "Razón Social": "VisualSur Pro",
            "Contacto": "visualsurpro@gmail.com",
            "Dirección": "Bernardo O'Higgins 1117",
            "Ciudad": "Temuco",
            "Rut": "77.123.123-3",
            "Teléfono": "961398522"
        }

        # Crear el PDF
        pdf = PDF()
        pdf.add_page()
        pdf.set_fill_color(200, 200, 200)  # Color gris claro
        pdf.set_text_color(0, 0, 0)  # Texto negro

        # Sección: Datos del Cliente
        pdf.add_section_title('DATOS DEL CLIENTE')
        pdf.cell(40,10, "Nombre Cliente", border=1, align='C', fill=True)
        pdf.cell(50,10, client.client_name, border=1, align='C')
        pdf.cell(40,10, "Dirección", border=1, align='C', fill=True)
        pdf.cell(50,10, client.client_address, border=1, align='C')
        pdf.ln()

        pdf.cell(40,10, "Correo", border=1, align='C', fill=True)
        pdf.cell(50,10, client.client_email, border=1, align='C')
        pdf.cell(40,10, "RUT", border=1, align='C', fill=True)
        pdf.cell(50,10, client.client_rut, border=1, align='C')
        pdf.ln()

        # Línea de separación
        pdf.add_line_break()

        # Sección: Datos del Proveedor
        pdf.add_section_title('DATOS DEL PROVEEDOR')
        # Fila del encabezado
        pdf.cell(40, 10, "Razón Social", border=1, align='C', fill=True)
        pdf.cell(50, 10, provider_data['Razón Social'], border=1, align='C', fill=False)
        pdf.cell(40, 10, "Ciudad", border=1, align='C', fill=True)
        pdf.cell(50, 10, provider_data['Ciudad'], border=1, align='C', fill=False)
        pdf.ln()  # Salto de línea

        pdf.cell(40, 10, "Contacto", border=1, align='C', fill=True)
        pdf.cell(50, 10, provider_data['Contacto'], border=1, align='C', fill=False)
        pdf.cell(40, 10, "RUT", border=1, align='C', fill=True)
        pdf.cell(50, 10, provider_data['Rut'], border=1, align='C', fill=False)
        pdf.ln()

        pdf.cell(40, 10, "Dirección", border=1, align='C', fill=True)
        pdf.cell(50, 10, provider_data['Dirección'], border=1, align='C', fill=False)
        pdf.cell(40, 10, "Teléfono", border=1, align='C', fill=True)
        pdf.cell(50, 10, provider_data['Teléfono'], border=1, align='C', fill=False)
        pdf.ln()

        pdf.add_line_break()

        # Sección: Detalle del Producto
        pdf.add_section_title('DATOS DEL PRODUCTO A ADQUIRIR')

        total_without_additional = (contract.square_meters * contract.square_meter_value)
        
        # Tabla del producto        
        pdf.cell(20,10, "Cantidad", border=1, align='C', fill=True)
        pdf.cell(80,10, "Descripción del Producto", border=1, align='C', fill=True)
        pdf.cell(30,10, "Precio Unitario", border=1, align='C', fill=True)
        pdf.cell(20,10, "Cantidad", border=1, align='C', fill=True)
        pdf.cell(40,10, "Precio Total", border=1, align='C', fill=True) 
        pdf.ln()
        pdf.cell(20,10,"1",border=1, align='C', fill=False)
        pdf.cell(80,10,f'Servicios Pantallas LED\'s y Montaje - {contract.square_meters}m²',border=1, align='C', fill=False)
        pdf.cell(30,10,f'${int(contract.square_meter_value)}',border=1, align='C', fill=False)
        pdf.cell(20,10,f'{int(contract.square_meters)}',border=1, align='C', fill=False)
        pdf.cell(40,10,f'${int(total_without_additional)}',border=1, align='C', fill=False)
        pdf.ln()
        pdf.cell(20,10,"1", border=1, align='C', fill=False)
        pdf.cell(80,10,"Costo Adicional", border=1, align='C', fill=False)
        pdf.cell(30,10,f'${int(contract.additional_cost)}', border=1, align='C', fill=False)
        pdf.cell(20,10,"1", border=1, align='C', fill=False)
        pdf.cell(40,10,f'${int(contract.additional_cost)}', border=1, align='C', fill=False)
        pdf.ln()
        pdf.add_line_break()

        # Cálculo de valores
        neto = contract.total_cost / 1.19
        iva = contract.total_cost - neto
        pdf.add_section_title('VALORES')

        pdf.cell(40,10, "NETO", border=1, align='C', fill=True)
        pdf.cell(50,10, f'${int(round(neto, 2))}', border=1, align='C')
        pdf.ln()
        pdf.cell(40,10, "IVA (19%)", border=1, align='C', fill=True)
        pdf.cell(50,10, f'${int(round(iva, 2))}', border=1, align='C')
        pdf.ln()
        pdf.cell(40,10, "TOTAL", border=1, align='C', fill=True)
        pdf.cell(50,10, f'${int(round(contract.total_cost, 2))}', border=1, align='C')

        # Guardar el archivo en memoria
        pdf_output = pdf.output(dest='S').encode('latin1')  # Cambiar encoding para soportar caracteres latinos

        # Código del documento
        document_code = f"{contract.contract_code}-COT"
        now = datetime.now()

        # Guardar en la base de datos
        document = Document(
            document_code=document_code,
            document_type="Cotización",
            file_content=pdf_output,
            generated_at=now,
            contract_id=contract.contract_id
        )
        db.session.add(document)
        db.session.commit()

        return jsonify({"message": "Cotización generada con éxito", "document_code": document_code}), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error generating cotización: {str(e)}")
        return jsonify({"error": "No se pudo generar la cotización"}), 500
    
@main.route('/contracts/<int:contract_id>/documents', methods=['GET'])
def get_documents(contract_id):
    try:
        documents = Document.query.filter_by(contract_id=contract_id).all()
        if not documents:
            return jsonify([]), 200
        result = [
            {
                "id": doc.id,
                "document_code": doc.document_code,
                "document_type": doc.document_type,
                "generated_at": doc.generated_at.isoformat()
            }
            for doc in documents
        ]
        return jsonify(result), 200
    except Exception as e:
        print(f"Error fetching documents: {str(e)}")
        return jsonify({"error": "No se pudo obtener los documentos"}), 500
    
# Ruta para descargar el contenido de un documento
@main.route('/documents/<int:document_id>', methods=['GET'])
def download_document(document_id):
    try:
        # Buscar el documento por su ID
        document = Document.query.filter_by(id=document_id).first()

        if not document:
            return jsonify({"error": "Documento no encontrado"}), 404

        # Preparar el contenido binario para la descarga
        response = make_response(document.file_content)
        response.headers.set('Content-Type', 'application/pdf')
        response.headers.set('Content-Disposition', f'attachment; filename={document.document_code}.pdf')

        return response
    except Exception as e:
        print(f"Error al descargar el documento: {str(e)}")
        return jsonify({"error": "No se pudo descargar el documento"}), 500

@main.route('/documents/<int:document_id>', methods=['DELETE'])
def delete_document(document_id):
    try:
        # Buscar el documento en la base de datos
        document = Document.query.filter_by(id=document_id).first()

        if not document:
            return jsonify({"error": "Documento no encontrado"}), 404

        # Eliminar el documento
        db.session.delete(document)
        db.session.commit()

        return jsonify({"message": "Documento eliminado con éxito"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error al eliminar el documento: {str(e)}")
        return jsonify({"error": "No se pudo eliminar el documento"}), 500


@main.route('/contracts/<int:contract_id>/generate_guia_despacho', methods=['POST'])
def generate_guia_despacho(contract_id):
    try:
        # Obtener datos del contrato
        contract = Contract.query.filter_by(contract_id=contract_id).first()
        if not contract:
            return jsonify({"error": "Contrato no encontrado"}), 404

        # Datos del cliente
        client = contract.client

        # Equipamiento asignado
        equipments = db.session.query(
            Equipment.tech_code,
            Equipment.equipment_name,
            Subcategory.subcategory_name
        ).join(
            Subcategory, Subcategory.subcategory_id == Equipment.subcategory_id
        ).join(
            ContractEquipment, ContractEquipment.equipment_id == Equipment.equipment_id
        ).filter(
            ContractEquipment.contract_id == contract_id
        ).all()
        # Personal asignado
        personal = db.session.query(
            Personal.staff_name,
            Role.role_name
        ).join(
            Role, Role.role_id == Personal.role_id
        ).join(
            ContractPersonal, ContractPersonal.staff_id == Personal.staff_id
        ).filter(
            ContractPersonal.contract_id == contract_id
        ).all()

        # Generar el PDF
        pdf = FPDF()
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.add_page()
        pdf.set_font('Arial', 'B', 16)
        pdf.set_fill_color(200, 200, 200)  # Color gris claro

        # Título
        pdf.cell(0, 10, 'Guía de Despacho/Retiro', ln=True, align='C')
        pdf.ln(10)

        # Datos del contrato
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(0, 10, 'Datos del Contrato', ln=True)
        pdf.set_font('Arial', '', 12)
        pdf.cell(40, 10,'Cliente', fill=True, border=1, align='C')
        pdf.cell(50, 10,f'{client.client_name}', border=1, align='C')
        pdf.cell(40, 10,'Evento', fill=True, border=1, align='C')
        pdf.cell(50, 10,f'{contract.event_name}', border=1, align='C')
        pdf.ln(10)
        pdf.cell(40, 10,'Lugar', fill=True, border=1, align='C')
        pdf.cell(50, 10,f'{contract.event_location}', border=1, align='C')
        pdf.cell(40, 10,'Metros Cuadrados', fill=True, border=1, align='C')
        pdf.cell(50, 10,f'{contract.square_meters}',ln=True, border=1, align='C')
        pdf.ln(10)

        # Equipamiento
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(0, 10, 'Equipamiento', ln=True)
        pdf.set_font('Arial', '', 12)
        pdf.cell(35, 10,'Código Técnico', fill=True, border=1, align='C')
        pdf.cell(60, 10,'Nombre Equipo', fill=True, border=1, align='C')
        pdf.cell(60, 10,'Subcategoría', fill=True, border=1, align='C')
        pdf.cell(35, 10,'Descarga/Carga', fill=True, border=1, align='C', ln=True)

        for equipment in equipments:
            pdf.cell(35, 10, equipment.tech_code, border=1, align='C')
            pdf.cell(60, 10, equipment.equipment_name, border=1, align='C')
            pdf.cell(60, 10, equipment.subcategory_name, border=1, align='C')
            pdf.cell(35, 10, '[   ] [   ]', border=1, ln=True, align='C')

        pdf.ln(10)

        # Personal
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(0, 10, 'Personal Asignado', ln=True)
        pdf.set_font('Arial', '', 12)
        pdf.cell(40, 10, 'Nombre', border=1, align='C', fill=True)
        pdf.cell(40, 10, 'Rol', border=1, ln=True, align='C', fill=True)

        for person in personal:
            pdf.cell(40, 10, person.staff_name, border=1, align='C')
            pdf.cell(40, 10, person.role_name, border=1,align='C', ln=True)

        # Guardar el PDF en un archivo binario
        document_code = f"{contract.contract_code}-GUIA"
        pdf_file = pdf.output(dest='S').encode('latin1')

        new_document = Document(
            document_code=document_code,
            document_type='Guía de Despacho/Retiro',
            generated_at=datetime.now(),
            contract_id=contract_id,
            file_content=pdf_file
        )
        db.session.add(new_document)
        db.session.commit()

        return jsonify({"message": "Guía de Despacho/Retiro generada con éxito", "document_code": document_code}), 201

    except Exception as e:
        print(f"Error generando guía de despacho/retiro: {str(e)}")
        return jsonify({"error": "No se pudo generar la guía de despacho/retiro"}), 500
    

#Filtro - Contratos
@main.route('/contracts/filter', methods=['GET'])
def filter_contracts():
    try:

        # Obtener parámetros de los filtros
        month = request.args.get('month', type=int)  # Mes (opcional)
        year = request.args.get('year', type=int)    # Año (opcional)
        client_id = request.args.get('client_id', type=int)  # Cliente (opcional)

        # Base de la consulta
        query = db.session.query(
            Contract.contract_id,
            Contract.contract_code,
            Contract.event_name,
            Contract.total_cost,
            Contract.event_location,
            Contract.square_meters,
            Cliente.client_name,
            Contract.contract_start_date
        ).join(Cliente, Contract.client_id == Cliente.client_id)

        # Aplicar filtros dinámicamente
        if month:
            query = query.filter(db.extract('month', Contract.contract_start_date) == month)
        if year:
            query = query.filter(db.extract('year', Contract.contract_start_date) == year)
        if client_id:
            query = query.filter(Contract.client_id == client_id)

        # Ejecutar la consulta
        contracts = query.all()

        months_in_spanish = {
        1: "Enero", 2: "Febrero", 3: "Marzo", 4: "Abril",
        5: "Mayo", 6: "Junio", 7: "Julio", 8: "Agosto",
        9: "Septiembre", 10: "Octubre", 11: "Noviembre", 12: "Diciembre"}

        # Formatear resultados para enviarlos al frontend
        results = [
            {
                "contract_id": contract.contract_id,
                "contract_code": contract.contract_code,
                "event_name": contract.event_name,
                "total_cost": contract.total_cost,
                "event_location": contract.event_location,
                "square_meters": contract.square_meters,
                "client_name": contract.client_name,
                "contract_start_date": contract.contract_start_date.strftime('%Y-%m-%d'),
                "month": months_in_spanish[contract.contract_start_date.month],  # Convertir el mes a español
                "year": contract.contract_start_date.year
            }
            for contract in contracts
        ]

        return jsonify(results), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@main.route('/contracts/filter/report', methods=['POST'])
def generate_contracts_report():
    try:

        # Diccionario para los nombres de los meses en español
        months_in_spanish = {
            1: "Enero", 2: "Febrero", 3: "Marzo", 4: "Abril",
            5: "Mayo", 6: "Junio", 7: "Julio", 8: "Agosto",
            9: "Septiembre", 10: "Octubre", 11: "Noviembre", 12: "Diciembre"
        }

        # Obtener filtros
        data = request.get_json()
        month = data.get('month')
        year = data.get('year')
        client_id = data.get('client_id')
        

        # Consulta base de contratos
        query = db.session.query(
            Contract.contract_code,
            Contract.event_name,
            Cliente.client_name,
            Contract.event_location,
            Contract.square_meters,
            Contract.total_cost
        ).join(Cliente, Contract.client_id == Cliente.client_id)

        # Aplicar filtros
        if month:
            query = query.filter(db.extract('month', Contract.contract_start_date) == month)
        if year:
            query = query.filter(db.extract('year', Contract.contract_start_date) == year)
        if client_id:
            query = query.filter(Contract.client_id == client_id)

        contracts = query.all()

        # Generar el PDF
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font('Arial', 'B', 14)
        pdf.cell(0, 10, 'Reporte de Contratos', align='C', ln=True)

        # Filtros aplicados
        pdf.set_font('Arial', '', 10)
        pdf.set_fill_color(200, 200, 200)  # Color gris claro
        if month:
            month_name = months_in_spanish.get(month, "Desconocido")
            pdf.cell(20, 10, 'Mes', border=1, fill=True)
            pdf.cell(30, 10, f'{month_name}', ln=True, border=1 )
        if year:
            pdf.cell(20, 10, 'Año:', border=1, fill=True)
            pdf.cell(30, 10, f'{year}', ln=True, border=1)
        if client_id:
            client = db.session.query(Cliente).filter_by(client_id=client_id).first()
            pdf.cell(20, 10, 'Cliente:', border=1, fill=True)
            pdf.cell(30, 10, f'{client.client_name}', ln=True, border=1)

        pdf.ln(10)

        # Encabezados de tabla
        pdf.set_font('Arial', 'B', 10)
        pdf.set_fill_color(200, 200, 200)  # Color gris claro
        pdf.cell(20, 10, 'Código',1, align='C', fill=True)
        pdf.cell(50, 10, 'Evento', 1, align='C', fill=True)
        pdf.cell(30, 10, 'Cliente', 1, align='C', fill=True)
        pdf.cell(30, 10, 'Ubicación', 1, align='C', fill=True)
        pdf.cell(30, 10, 'Metros Cuad.', 1, align='C', fill=True)
        pdf.cell(30, 10, 'Costo Total', 1, ln=True, align='C', fill=True)

        # Datos de la tabla
        pdf.set_font('Arial', '', 10)
        total_general = 0
        for contract in contracts:
            pdf.cell(20, 10, contract.contract_code, 1)
            pdf.cell(50, 10, contract.event_name, 1)
            pdf.cell(30, 10, contract.client_name, 1)
            pdf.cell(30, 10, contract.event_location, 1)
            pdf.cell(30, 10, str(int(contract.square_meters)), 1)
            pdf.cell(30, 10, f"${int(contract.total_cost)}", 1, ln=True)
            total_general += contract.total_cost

        # Total General
        pdf.set_fill_color(200, 200, 200)  # Color gris claro
        pdf.set_font('Arial', 'B', 10)
        pdf.cell(160, 10, 'Total General', 1, align='R', fill=True)
        pdf.cell(30, 10, f"${int(total_general)}", 1, ln=True)

        # Preparar respuesta
        response = make_response(pdf.output(dest='S').encode('latin1'))
        response.headers['Content-Type'] = 'application/pdf'
        response.headers['Content-Disposition'] = 'inline; filename=Reporte_Contratos.pdf'
        return response

    except Exception as e:
        return jsonify({"error": str(e)}), 500
