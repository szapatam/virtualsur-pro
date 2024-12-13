from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# instancia de SQLAlchemy
db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    CORS(app)

    # Configuración para la base de datos MySQL
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:admin@localhost/virtualsurpro'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'clave123'

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    from app.routes.routes import main
    app.register_blueprint(main)
    from app.routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')
    from app.routes.clientes_routes import clientes_bp
    app.register_blueprint(clientes_bp)
    from app.routes.roles_routes import roles_bp
    app.register_blueprint(roles_bp)
    from app.routes.categorias_routes import categoria_bp
    app.register_blueprint(categoria_bp)
    from app.routes.contract_routes import contract_bp
    app.register_blueprint(contract_bp)
    from app.routes.document_routes import document_bp
    app.register_blueprint(document_bp)    
    from app.routes.equipment_routes import equipment_bp
    app.register_blueprint(equipment_bp)
    from app.routes.personal_routes import personal_bp
    app.register_blueprint(personal_bp)
    
    

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({"error": "Invalid token provided", "message": str(error)}), 422    
    

    return app
