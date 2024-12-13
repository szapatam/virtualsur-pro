from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from app import db
from app.models import Personal, Role

personal_bp = Blueprint('personal', __name__)

@personal_bp.route('/personal', methods=['POST'])
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


@personal_bp.route('/personal', methods=['GET'])
@jwt_required()
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


@personal_bp.route('/personal/<int:staff_id>', methods=['GET'])
@jwt_required()
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


@personal_bp.route('/personal/<int:staff_id>', methods=['DELETE'])
@jwt_required()
def delete_staff(staff_id):
    personal = Personal.query.get(staff_id)
    if personal is None:
        return jsonify({"message": "Personal no encontrado"}), 404

    db.session.delete(personal)
    db.session.commit()
    return jsonify({"message": "Personal Eliminado con exito"}), 200


@personal_bp.route('/personal/<int:staff_id>', methods=['PUT'])
@jwt_required()
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
