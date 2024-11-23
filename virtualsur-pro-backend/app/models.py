from . import db


class Role (db.Model):
    __tablename__ = 'roles'

    role_id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String(50), nullable=False, unique=True)

    def __init__(self, role_name):
        self.role_name = role_name

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

class Personal (db.Model):
    __tablename__ = 'staffs'

    staff_id = db.Column(db.Integer, primary_key=True)
    staff_name = db.Column(db.String(50))
    staff_rut = db.Column(db.String(50))
    staff_email = db.Column(db.String(50))
    staff_phone = db.Column(db.Integer)
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