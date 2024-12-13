from app import db, bcrypt

class Document(db.Model):
    __tablename__ = 'documents'

    id = db.Column(db.Integer, primary_key=True)
    document_code = db.Column(db.String(50), unique=True, nullable=False)  # Ejemplo: CT-001-COT
    document_type = db.Column(db.String(50), nullable=False)  # Ejemplo: "Cotización"
    file_content = db.Column(db.LargeBinary, nullable=False)  # Archivo PDF en binario
    generated_at = db.Column(db.DateTime, nullable=False)  # Fecha y hora de generación
    contract_id = db.Column(db.Integer, db.ForeignKey('contracts.contract_id'), nullable=False)
    # Relación con contratos
    contract = db.relationship('Contract', back_populates='documents')