from app import db, bcrypt

class Equipment(db.Model):
    __tablename__ = 'equipments'
    equipment_id = db.Column(db.Integer, primary_key=True)
    subcategory_id = db.Column(db.Integer, db.ForeignKey('subcategories.subcategory_id'))
    tech_code = db.Column(db.String(50), unique=True, nullable=False)
    status_equipment = db.Column(db.Enum('Operativo', 'No Operativo', 'En Mantención','Asignado'), nullable=False, default='Operativo')
    equipment_name = db.Column(db.String(50))
    subcategory = db.relationship('Subcategory', backref=db.backref('equipments', lazy=True))

    subcategory = db.relationship('Subcategory', backref='equipments')