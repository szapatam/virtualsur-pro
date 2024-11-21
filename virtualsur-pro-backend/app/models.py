from . import db


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
