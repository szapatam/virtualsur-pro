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
    contracts = db.relationship('Contract', back_populates='client')

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
    status = db.Column(db.String(50), default="Disponible")

    role = db.relationship('Role', backref='staffs')

    @property
    def role_name(self):
        return self.role.role_name if self.role else None

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
    status_equipment = db.Column(db.Enum('Operativo', 'No Operativo', 'En Mantención','Asignado'), nullable=False, default='Operativo')
    equipment_name = db.Column(db.String(50))
    subcategory = db.relationship('Subcategory', backref=db.backref('equipments', lazy=True))


# Contratos
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

    # Relación con la tabla Client
    client = db.relationship('Cliente', back_populates='contracts')

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
    
#Tabla intermerdia Equpamiento - Contrato
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

# Tabla intermedia Persnal - Contrato
class ContractPersonal(db.Model):
    __tablename__ = 'contract_personal'

    id = db.Column(db.Integer, primary_key=True)
    contract_id = db.Column(db.Integer, db.ForeignKey('contracts.contract_id'))
    staff_id = db.Column(db.Integer, db.ForeignKey('staffs.staff_id'))

    def __init__(self, contract_id, staff_id):
        self.contract_id = contract_id
        self.staff_id = staff_id
