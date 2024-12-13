from app import db, bcrypt

class Subcategory(db.Model):
    __tablename__ = 'subcategories'
    subcategory_id = db.Column(db.Integer, primary_key=True)
    subcategory_name = db.Column(db.String(100), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.category_id'))
    codigo_tecnico = db.Column(db.String(10), nullable=False)

    category = db.relationship('Category', backref=db.backref('subcategories', lazy=True))