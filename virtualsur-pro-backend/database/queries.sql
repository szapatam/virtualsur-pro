--Pasos para ejecutar en nuevo equipo:

1. Crear las tablas bases
2. Ejecutar los insert de la sección INSERTS OBLIGATORIOS.


--CREART TABLAS INVENTARIO

use virtualsurpro;

-- Lists all the tables in a particular database
SELECT table_name
FROM information_schema.tables
WHERE table_type='BASE TABLE'
      AND table_schema = 'virtualsurpro';
      
      
drop table equipments;

select * from clients;
select * from staffs;
select * from roles;
select * from equipments;

-----



-- Crear la base de datos
CREATE DATABASE virtualsur_pro;
USE virtualsur_pro;

-- Tabla Categorías
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL
);

-- Tabla Subcategorías
CREATE TABLE subcategories (
    subcategory_id INT AUTO_INCREMENT PRIMARY KEY,
    subcategory_name VARCHAR(100) NOT NULL,
    category_id INT,
    codigo_tecnico VARCHAR(10) NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);


-- Tabla Equipos
CREATE TABLE equipments (
    equipment_id INT AUTO_INCREMENT PRIMARY KEY,
    subcategory_id INT,
    tech_code VARCHAR(50) UNIQUE NOT NULL,
    status_equipment ENUM('Operativa', 'No Operativa', 'En Mantención') NOT NULL,
    FOREIGN KEY (subcategory_id) REFERENCES subcategories(subcategory_id)
);


-- INSERTS OBLIGATORIOS --

insert into roles (role_id, role_name)values (1,'Chofer');
insert into roles (role_id, role_name)values (2,'Carguer');
insert into roles (role_id, role_name)values (3,'Sonidista');
insert into roles (role_id, role_name)values (4,'Jefe Tecnico');

-- Insertar Categorías
INSERT INTO categories (category_name) VALUES 
('Pantallas'), 
('Cajones (Cases)'), 
('Cables Técnicos'), 
('Soportes'), 
('Escenario (Truss)'), 
('Materiales Técnicos'), 
('Materiales Visualizador');

select * from categories;

-- Insertar Subcategorías y Códigos Técnicos
INSERT INTO subcategories (subcategory_name, category_id, codigo_tecnico) VALUES 
('Pantalla Modular 50x50cm', 1, 'PL'),
('Cajón de Pantallas', 2, 'CJP'),
('Cajón técnico de corriente', 2, 'CJC'),
('Cajón técnico de red', 2, 'CJR'),
('Cajón de repuesto', 2, 'CJR'),
('Cables técnicos',3, 'CB'),
('Torres elevadoras', 4, 'TRE'),
('Atriles', 4, 'ATR'),
('Tecle', 4, 'TEC'),
('Base Truss', 5, 'BTR'),
('Truss cuadrado 50x50', 5, 'TCQ'),
('Truss Triangular 25x25', 5, 'TCT'),
('Eslingas', 6, 'ESL'),
('Candados', 6, 'CAN'),
('Soporte de pantallas (bumpers)', 6, 'BUP'),
('Clamps', 6, 'CLP'),
('Procesadores de videos', 7, 'PRV'),
('Computadores de la empresa', 7, 'CMP');