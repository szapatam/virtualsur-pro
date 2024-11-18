from flask import Flask
from .routes import main
from flask_sqlalchemy import SQLAlchemy

# instancia de SQLAlchemy
db = SQLAlchemy()


def create_app():
    app = Flask(__name__)

    # Configuración para la base de datos MySQL
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:admin@localhost/virtualsurpro'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'clave123'

    db.init_app(app)

    # Config. adicionales
    app.register_blueprint(main)

    return app
