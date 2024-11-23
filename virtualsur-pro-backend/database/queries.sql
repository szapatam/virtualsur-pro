use virtualsurpro;

-- Lists all the tables in a particular database
SELECT table_name
FROM information_schema.tables
WHERE table_type='BASE TABLE'
      AND table_schema = 'virtualsurpro';
      
      
drop table roles;

select * from clients;
select * from staffs;
select * from roles;



/*Ejecutar para poblar la tabla roles*/
insert into roles (role_id, role_name)values (1,'Chofer');
insert into roles (role_id, role_name)values (2,'Carguer');
insert into roles (role_id, role_name)values (3,'Sonidista');
insert into roles (role_id, role_name)values (4,'Jefe Tecnico');