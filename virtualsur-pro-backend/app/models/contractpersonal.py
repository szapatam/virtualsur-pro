from app import db, bcrypt

class ContractPersonal(db.Model):
    __tablename__ = 'contract_personal'

    id = db.Column(db.Integer, primary_key=True)
    contract_id = db.Column(db.Integer, db.ForeignKey('contracts.contract_id'))
    staff_id = db.Column(db.Integer, db.ForeignKey('staffs.staff_id'))

    def __init__(self, contract_id, staff_id):
        self.contract_id = contract_id
        self.staff_id = staff_id