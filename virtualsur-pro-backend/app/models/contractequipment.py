from app import db, bcrypt

class ContractEquipment(db.Model):
    __tablename__ = 'contract_equipments'

    id = db.Column(db.Integer, primary_key=True)
    contract_id = db.Column(db.Integer, db.ForeignKey('contracts.contract_id'))
    equipment_id = db.Column(db.Integer, db.ForeignKey('equipments.equipment_id'))
    tech_code = db.Column(db.String(50))  # Código técnico del equipo
    equipment_name = db.Column(db.String(100))  # Nombre del equipo
    subcategory_name = db.Column(db.String(100))  # Nombre de la subcategoría
    quantity = db.Column(db.Integer, nullable=False)  # Cantidad asignada

    def __init__(self, contract_id, equipment_id, tech_code, equipment_name, subcategory_name, quantity):
        self.contract_id = contract_id
        self.equipment_id = equipment_id
        self.tech_code = tech_code
        self.equipment_name = equipment_name
        self.subcategory_name = subcategory_name
        self.quantity = quantity