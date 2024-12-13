from app import db, bcrypt

class Personal (db.Model):
    __tablename__ = 'staffs'

    staff_id = db.Column(db.Integer, primary_key=True)
    staff_name = db.Column(db.String(50))
    staff_rut = db.Column(db.String(50))
    staff_email = db.Column(db.String(50))
    staff_phone = db.Column(db.String(50))
    staff_address = db.Column(db.String(50))
    role_id = db.Column(db.Integer, db.ForeignKey('roles.role_id'))
    status = db.Column(db.String(50), default="Disponible")

    role = db.relationship('Role', backref='staffs')

    @property
    def role_name(self):
        return self.role.role_name if self.role else None