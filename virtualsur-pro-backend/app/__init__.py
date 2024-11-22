from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# instancia de SQLAlchemy
db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    CORS(app)

    # Configuración para la base de datos MySQL
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:admin@localhost/virtualsurpro'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'clave123'

    db.init_app(app)

    # Config. adicionales
    from .routes import main
    app.register_blueprint(main)

    return app
