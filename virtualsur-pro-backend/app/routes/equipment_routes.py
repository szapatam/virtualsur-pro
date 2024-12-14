
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from app import db
from app.models import Equipment, Category,Subcategory

equipment_bp = Blueprint('equipment', __name__)

@equipment_bp.route('/equipment', methods=['GET'])
@jwt_required()
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

@equipment_bp.route('/equipment/grouped', methods=['GET'])
@jwt_required()
def obtener_equipos_agrupados():
    # Consulta con join para obtener subcategorías y categorías
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

    # Agrupar los equipos por subcategoría
    grouped_data = {}
    for equipo in equipos:
        subcategory_name = equipo.subcategory_name
        if subcategory_name not in grouped_data:
            grouped_data[subcategory_name] = []
        grouped_data[subcategory_name].append({
            "equipment_id": equipo.equipment_id,
            "tech_code": equipo.tech_code,
            "status_equipment": equipo.status_equipment,
            "equipment_name": equipo.equipment_name,
            "category_name": equipo.category_name
        })

    # Convertir en una lista para enviar al frontend
    result = [{"subcategory_name": key, "equipments": value} for key, value in grouped_data.items()]
    return jsonify(result)

# RUTA: Obtener equipo por ID
@equipment_bp.route('/equipment/<int:equipment_id>', methods=['GET'])
@jwt_required()
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
@equipment_bp.route('/equipment', methods=['POST'])
@jwt_required()
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
@equipment_bp.route('/equipment/<int:equipment_id>', methods=['PUT'])
@jwt_required()
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


@equipment_bp.route('/equipment/<int:equipment_id>', methods=['DELETE'])
@jwt_required()
def delete_equipment(equipment_id):
    equipment = Equipment.query.get(equipment_id)
    if equipment is None:
        return jsonify({"message": "equipment no encontrado"}), 404

    db.session.delete(equipment)
    db.session.commit()
    return jsonify({"message": "equipment Eliminado con exito"}), 200