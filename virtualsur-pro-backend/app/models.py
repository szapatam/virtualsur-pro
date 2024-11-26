from . import db

#Clase ROL
class Role (db.Model):
    __tablename__ = 'roles'

    role_id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String(50), nullable=False, unique=True)

    def __init__(self, role_name):
        self.role_name = role_name

#Clase Clientes
class Cliente(db.Model):
    __tablename__ = 'clients'

    client_id = db.Column(db.Integer, primary_key=True)
    client_name = db.Column(db.String(50))
    client_email = db.Column(db.String(150))
    client_address = db.Column(db.String(50))
    client_rut = db.Column(db.String(50))
    client_phone = db.Column(db.Integer)

    def __init__(self, client_name, client_email, client_address, client_rut, client_phone):
        self.client_name = client_name
        self.client_email = client_email
        self.client_address = client_address
        self.client_rut = client_rut
        self.client_phone = client_phone

#Clase Personal
class Personal (db.Model):
    __tablename__ = 'staffs'

    staff_id = db.Column(db.Integer, primary_key=True)
    staff_name = db.Column(db.String(50))
    staff_rut = db.Column(db.String(50))
    staff_email = db.Column(db.String(50))
    staff_phone = db.Column(db.String(50))
    staff_address = db.Column(db.String(50))
    role_id = db.Column(db.Integer, db.ForeignKey('roles.role_id'))

    role = db.relationship('Role', backref='staffs')

    def __init__(self, staff_name, staff_rut, staff_email, staff_phone, staff_address, role_id):
        self.staff_name = staff_name
        self.staff_rut = staff_rut
        self.staff_email = staff_email
        self.staff_phone = staff_phone
        self.staff_address = staff_address
        self.role_id = role_id 

#Clase Categoria
class Category(db.Model):
    __tablename__ = 'categories'
    category_id = db.Column(db.Integer, primary_key=True)
    category_name = db.Column(db.String(100), nullable=False)

# Subcategoría Model
class Subcategory(db.Model):
    __tablename__ = 'subcategories'
    subcategory_id = db.Column(db.Integer, primary_key=True)
    subcategory_name = db.Column(db.String(100), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.category_id'))
    codigo_tecnico = db.Column(db.String(10), nullable=False)

    category = db.relationship('Category', backref=db.backref('subcategories', lazy=True))

# Equipos Model
class Equipment(db.Model):
    __tablename__ = 'equipments'
    equipment_id = db.Column(db.Integer, primary_key=True)
    subcategory_id = db.Column(db.Integer, db.ForeignKey('subcategories.subcategory_id'))
    tech_code = db.Column(db.String(50), unique=True, nullable=False)
    status_equipment = db.Column(db.Enum('Operativa', 'No Operativa', 'En Mantención'), nullable=False)
    equipment_name = db.Column(db.String(50))
    subcategory = db.relationship('Subcategory', backref=db.backref('equipments', lazy=True))