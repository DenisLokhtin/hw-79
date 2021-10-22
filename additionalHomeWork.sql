CREATE TABLE if not exists categories (
	id INT NOT NULL AUTO_INCREMENT primary key,
	name varchar(255) NOT NULL,
	description TEXT NULL
);

CREATE TABLE if not exists locations (
	id INT NOT NULL AUTO_INCREMENT primary key,
	name varchar(255) NOT NULL,
	description TEXT NULL
);

CREATE TABLE if not exists items (
	id INT NOT NULL AUTO_INCREMENT primary key,
	locations_id INT NOT NULL,
	categories_id INT NOT NULL,
	name varchar(255) NOT NULL,
	description TEXT NULL,
	image varchar(255) NULL,
	registration_date datetime DEFAULT CURRENT_TIMESTAMP,
	constraint items_locations_id_fk
    foreign key (locations_id)
    references locations(id)
    on delete RESTRICT,
    constraint items_categories_id_fk
    foreign key (categories_id)
    references categories(id)
    on delete RESTRICT
);

insert into categories (name, description)
values ('something', 'something'),
       ('something1', 'something1');

insert into locations (name, description)
values ('here', 'something'),
       ('here1', 'something1');

insert into items (locations_id, categories_id, name, description, image)
values (1, 1, 'something', 'something', null),
       (2, 2, 'something1', 'something1', null);



