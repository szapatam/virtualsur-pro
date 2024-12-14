from app import db, bcrypt

class Contract(db.Model):
    __tablename__ = 'contracts'

    contract_id = db.Column(db.Integer, primary_key=True)
    contract_code = db.Column(db.String(50), unique=True, nullable=False)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.client_id'), nullable=False)
    event_name = db.Column(db.String(100), nullable=False)
    contract_start_date = db.Column(db.Date, nullable=False)
    event_execution_date = db.Column(db.Date, nullable=False)
    event_location = db.Column(db.String(200), nullable=False)
    square_meters = db.Column(db.Float, nullable=False)
    square_meter_value = db.Column(db.Float, nullable=False)
    additional_cost = db.Column(db.Float, nullable=True, default=0)
    total_cost = db.Column(db.Float, nullable=False)
    status = db.Column(db.Enum('En curso', 'Finalizado'), nullable=False, default='En curso')

    # Relación con la tabla Client
    client = db.relationship('Cliente', back_populates='contracts')

    #Relación  con Documents
    documents = db.relationship('Document', back_populates='contract')

    #Metodo para generar un codigo unico
    @staticmethod
    def generate_contract_code():
        last_contract = Contract.query.order_by(Contract.contract_id.desc()).first()
        if last_contract:
            last_number = int(last_contract.contract_code.split('-')[1])
            next_number = last_number + 1
        else:
            next_number = 1      
        return f"CT-{str(next_number).zfill(3)}"