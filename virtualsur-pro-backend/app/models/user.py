from app import db, bcrypt

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password = db.Column(db.String(128), nullable=False)
    
    def set_password(self, raw_password):
        """Genera un hash para la contraseña."""
        self.password = bcrypt.generate_password_hash(raw_password).decode('utf-8')

    def check_password(self, raw_password):
        """Verifica si la contraseña ingresada coincide con el hash."""
        return bcrypt.check_password_hash(self.password, raw_password)        
