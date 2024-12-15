from flask import Blueprint, jsonify, request
from sqlalchemy import func
from fpdf import FPDF
from datetime import datetime
from flask_jwt_extended import jwt_required
from app import db
from app.models import Contract, Equipment, Personal, Cliente, Subcategory, ContractEquipment, ContractPersonal, Role, Document

contract_bp = Blueprint('contract', __name__)

@contract_bp.route('/contracts', methods=['POST'])
@jwt_required()
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
        status = data.get('status')

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
            total_cost=total_cost,
            status=status
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


@contract_bp.route('/contracts', methods=['GET'])
@jwt_required()
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
            "total_cost": c.total_cost,
            "status": c.status
        }
        for c in contracts
    ]
    return jsonify(result)

@contract_bp.route('/contracts/<int:contract_id>', methods=['GET'])
@jwt_required()
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
            Contract.total_cost,
            Contract.status
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
            "status": contract.status,
            "equipments": equipment_list,  # Incluir equipos asignados
            'personnel_list': personnel_list # Agregar el personal asignado

        }
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400

    
@contract_bp.route('/contracts/<int:contract_id>', methods=['PUT'])
@jwt_required()
def update_contract(contract_id):
    try:
        # Obtener los datos enviados por el frontend
        data = request.get_json()
        print(data)

        # Buscar el contrato existente
        contract = Contract.query.filter_by(contract_id=contract_id).first()

        if not contract:
            return jsonify({"message": "Contrato no encontrado"}), 404
        
        if contract.status == 'Finalizado':
            return jsonify({"error": "No se pueden modificar recursos de un contrato finalizado"}), 400
        

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

        equipments = []
        removed_equipments = []

        # Manejar equipos asignados SOLO SI EL CONTRATO NO ESTA FINALIZADO
        if contract.status != 'Finalizado':
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




@contract_bp.route('/contracts/<int:contract_id>', methods=['DELETE'])
@jwt_required()
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
@contract_bp.route('/contracts/<int:contract_id>/assign_equipment', methods=['POST'])
@jwt_required()
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


@contract_bp.route('/contracts/<int:contract_id>/equipments', methods=['GET'])
@jwt_required()
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
@contract_bp.route('/equipment/available', methods=['GET'])
@jwt_required()
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


@contract_bp.route('/equipment/reserve', methods=['POST'])
@jwt_required()
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


@contract_bp.route('/contracts/<int:contract_id>/remove_equipment/<int:equipment_id>', methods=['DELETE'])
@jwt_required()
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

@contract_bp.route('/contracts/<int:contract_id>/assign_personal', methods=['POST'])
@jwt_required()
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
    
@contract_bp.route('/contracts/<int:contract_id>/remove_personal/<int:staff_id>', methods=['DELETE'])
@jwt_required()
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
    
@contract_bp.route('/contracts/<int:contract_id>/personal', methods=['GET'])
@jwt_required()
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
    
@contract_bp.route('/personal/available', methods=['GET'])
@jwt_required()
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

@contract_bp.route('/contracts/<int:contract_id>/generate_cotizacion', methods=['POST'])
@jwt_required()
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
    
@contract_bp.route('/contracts/<int:contract_id>/documents', methods=['GET'])
@jwt_required()
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
    
#finalizar un contrato    
@contract_bp.route('/contracts/<int:contract_id>/finalize', methods=['POST'])
@jwt_required()
def finalize_contract(contract_id):
    try:
        # Buscar contrato por ID
        contract = Contract.query.get(contract_id)
        if not contract:
            return jsonify({"error": "Contrato no encontrado"}), 404

        # Validar que el contrato no esté ya finalizado
        if contract.status == 'Finalizado':
            return jsonify({"error": "El contrato ya está finalizado"}), 400

        # Actualizar estado del contrato
        contract.status = 'Finalizado'

        # Liberar equipos asignados al contrato
        assigned_equipments = ContractEquipment.query.filter_by(contract_id=contract_id).all()
        for item in assigned_equipments:
            equipment = Equipment.query.get(item.equipment_id)
            if equipment:
                equipment.status_equipment = 'Operativo'

        # Liberar personal asignado al contrato
        assigned_personnel = ContractPersonal.query.filter_by(contract_id=contract_id).all()
        if assigned_personnel:
            print("Personal asignado al contrato:", assigned_personnel)  # Depuración
            for item in assigned_personnel:
                personal = Personal.query.get(item.staff_id)
                if personal:
                    print(f"Liberando personal: {personal.staff_id} - {personal.staff_name}")  # Depuración
                    personal.status = 'Disponible'
                    db.session.add(personal)  # Asegurarse de añadir a la sesión
                    print(f"Estado despues de cambiar {personal.status}")
        else:
            print("No se encontró personal asignado para este contrato.")

        try:
            db.session.commit()
            print("Cambios guardados en la base de datos correctamente.")
            # Verificar en una nueva consulta tras el commit
        except Exception as e:
            db.session.rollback()
            print("Error al guardar cambios en la base de datos:", str(e))

        return jsonify({"message": "Contrato finalizado y recursos liberados correctamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
