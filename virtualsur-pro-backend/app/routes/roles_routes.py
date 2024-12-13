from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from app import db
from app.models import Role

roles_bp = Blueprint('roles', __name__)

@roles_bp.route('/roles', methods=['GET'])
@jwt_required()
def get_roles():
    roles = Role.query.all()
    roles_list = [{"role_id": role.role_id, "role_name": role.role_name}
                  for role in roles]
    return jsonify(roles_list)