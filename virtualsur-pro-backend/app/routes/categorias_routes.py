from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from app import db
from app.models import Category, Subcategory

categoria_bp = Blueprint('category', __name__)

@categoria_bp.route('/category', methods=['GET'])
@jwt_required()
def get_categorias():
    categorias = Category.query.all()
    result = [{"category_id": c.category_id,
               "category_name": c.category_name} for c in categorias]
    return jsonify(result)

@categoria_bp.route('/subcategory', methods=['GET'])
@jwt_required()
def get_subcategorias_all():
    subcategorias = Subcategory.query.all()
    result = [{"category_id": c.category_id,
               "subcategory_name": c.subcategory_name,
               "subcategory_id": c.subcategory_id,
               "tech_code": c.codigo_tecnico} for c in subcategorias]
    return jsonify(result)

@categoria_bp.route('/subcategory/<int:category_id>', methods=['GET'])
@jwt_required()
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