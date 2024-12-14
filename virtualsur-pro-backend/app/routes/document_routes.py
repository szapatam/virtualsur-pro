from flask import Blueprint, jsonify, request, make_response
from flask_jwt_extended import jwt_required
from sqlalchemy.sql.expression import case
from sqlalchemy import func
from datetime import datetime
from fpdf import FPDF
from app import db
from app.models import Contract, Equipment, Personal, Cliente, Category, Subcategory, ContractEquipment, ContractPersonal, Role, Document

document_bp = Blueprint('document', __name__)


@document_bp.route('/documents/<int:document_id>', methods=['GET'])
@jwt_required()
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

@document_bp.route('/documents/<int:document_id>', methods=['DELETE'])
@jwt_required()
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


@document_bp.route('/contracts/<int:contract_id>/generate_guia_despacho', methods=['POST'])
@jwt_required()
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
@document_bp.route('/contracts/filter', methods=['GET'])
@jwt_required()
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


@document_bp.route('/contracts/filter/report', methods=['POST'])
@jwt_required()
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

# Sección Resumen

from flask import request

@document_bp.route('/contracts/events', methods=['GET'])
@jwt_required()
def get_contract_events():
    try:
        # Obtener parámetros de filtro (mes y año)
        month = request.args.get('month', type=int)
        year = request.args.get('year', type=int)

        # Base query
        query = db.session.query(
            Contract.contract_code,
            Contract.event_execution_date,
            Contract.event_name,
            Contract.contract_id,
            Contract.status
        )

        # Aplicar filtros opcionales
        if month:
            query = query.filter(db.extract('month', Contract.event_execution_date) == month)
        if year:
            query = query.filter(db.extract('year', Contract.event_execution_date) == year)

        # Consultar solo eventos futuros si no hay filtros
        if not month and not year:
            query = query.filter(Contract.event_execution_date >= datetime.now())

        events = query.all()

        # Formatear los resultados en JSON
        result = [
            {
                "contract_code": event.contract_code,
                "event_execution_date": event.event_execution_date.strftime('%Y-%m-%d'),
                "event_name": event.event_name,
                "contract_id": event.contract_id,
                "status": event.status
            }
            for event in events
        ]

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@document_bp.route('/inventory/levels', methods=['GET'])
@jwt_required()
def get_inventory_levels():
    try:
        # Calcular el total de equipos y equipos asignados (general)
        # pylint: disable=not-callable
        total_units = db.session.query(func.count(Equipment.equipment_id)).scalar() or 0
        total_assigned = db.session.query(func.count(Equipment.equipment_id)).filter(
            Equipment.status_equipment == 'Asignado'
        ).scalar() or 0
        general_occupancy = (total_assigned / total_units * 100) if total_units > 0 else 0

        print(f"Total Units: {total_units}, Total Assigned: {total_assigned}, General Occupancy: {general_occupancy}%")

        # Consulta para categorías y subcategorías
        categories_query = db.session.query(
            Category.category_name,
            Subcategory.subcategory_name,
            # pylint: disable=not-callable
            func.count(Equipment.equipment_id).label('total_quantity'),
            func.sum(
                case(
                    (Equipment.status_equipment == 'Asignado', 1),  # Condición y resultado
                    else_=0  # Valor predeterminado
                )
            ).label('assigned_quantity')
        ).join(Subcategory, Subcategory.subcategory_id == Equipment.subcategory_id
        ).join(Category, Category.category_id == Subcategory.category_id
        ).group_by(Category.category_name, Subcategory.subcategory_name)

        # Ejecutar consulta
        categories = categories_query.all()

        # Procesar resultados
        category_summary = {}
        for category_name, subcategory_name, total_quantity, assigned_quantity in categories:
            # Manejar casos donde assigned_quantity sea NULL
            assigned_quantity = assigned_quantity or 0
            if category_name not in category_summary:
                category_summary[category_name] = {
                    "subcategories": [],
                    "total_occupancy": 0,
                    "total_count": 0
                }

            occupancy = (assigned_quantity / total_quantity * 100) if total_quantity > 0 else 0
            category_summary[category_name]["subcategories"].append({
                "subcategory_name": subcategory_name,
                "total_quantity": total_quantity,
                "assigned_quantity": assigned_quantity,
                "occupancy": occupancy
            })
            category_summary[category_name]["total_occupancy"] += occupancy
            category_summary[category_name]["total_count"] += 1

        # Calcular promedio por categoría
        for category_name, data in category_summary.items():
            data["total_occupancy"] = data["total_occupancy"] / data["total_count"]

        # Formatear respuesta
        response = {
            "general_occupancy": general_occupancy,
            "categories": [
                {
                    "category_name": category_name,
                    "total_occupancy": data["total_occupancy"],
                    "subcategories": data["subcategories"]
                }
                for category_name, data in category_summary.items()
            ]
        }

        return jsonify(response), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500