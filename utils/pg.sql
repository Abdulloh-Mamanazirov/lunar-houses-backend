CREATE DATABASE exam;
CREATE EXTENSION "uuid-ossp";

-- psql postgres://kavmfgfh:9LWRFhy2ieFso13_P65mwY4VRiW57ffX@drona.db.elephantsql.com/kavmfgfh

CREATE TABLE admin(
    id TEXT UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL 
);
INSERT INTO admin(username, email, password)VALUES('admin007', 'admin@gmail.com', '1234567');

CREATE TABLE users(
    id TEXT NOT NULL DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    login_date DATE NOT NULL DEFAULT CURRENT_DATE
);
INSERT INTO users(name, email)VALUES('Sarah','sarah@email.com'),('John','johndoe@gmail.com');

-- COMPANY
CREATE TABLE company(
    id TEXT NOT NULL DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    image TEXT NOT NULL,
    created_by_id TEXT NOT NULL,
    CONSTRAINT fk_creator_id
    FOREIGN KEY (created_by_id)
    REFERENCES admin(id)
);
ALTER TABLE company ADD UNIQUE (id);
INSERT INTO company(name, image, created_by_id)
VALUES('Golden House','https://media.istockphoto.com/id/1152129571/vector/building-logo-design-in-modern-graphic-style.jpg?s=612x612&w=0&k=20&c=dZ1cdCkKtDFVT0QFABE2sqIJWhw2jj-4wAUTEOF50AY=', 'fbbbdcaa-0778-46e9-8d71-cc74ac9f7d19'),('My Buildings', 'https://img.freepik.com/premium-photo/highways-high-rise-buildings-fuzhou-fujian-province-china_91566-1140.jpg', 'fbbbdcaa-0778-46e9-8d71-cc74ac9f7d19');


-- COMPLEX
CREATE TABLE complex(
    id TEXT NOT NULL DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    address TEXT NOT NULL,
    company_id TEXT NOT NULL,
    CONSTRAINT fk_company_id
    FOREIGN KEY (company_id)
    REFERENCES company(id)
);
ALTER TABLE complex ADD UNIQUE (id);
INSERT INTO complex(name,address,company_id)
    VALUES
    ('Hidden Leaf', 'particular region', 'cee88a92-f94d-42a6-ba2a-de9387aaa225'),
    ('Hidden Stone', 'a certain region', 'cee88a92-f94d-42a6-ba2a-de9387aaa225');
INSERT INTO complex(name,address,company_id)VALUES('Silver Buildings', 'Chilonzor', 'd73e8646-7706-42e6-913f-83c525fb4b06');

SELECT c.name as company_name, com.company_id as company_id, com.id as complex_id, com.name as complex_name, com.address FROM company c JOIN complex com ON c.id = com.company_id;

select * from complex where company_id = 'd73e8646-7706-42e6-913f-83c525fb4b06';


-- ROOMS
CREATE TABLE room(
    id TEXT NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    number_of_rooms INTEGER NOT NULL,
    price INTEGER NOT NULL,
    kv INTEGER NOT NULL,
    company_id VARCHAR NOT NULL,
    CONSTRAINT fk_company_id
    FOREIGN KEY (company_id)
    REFERENCES company(id),
    complex_id VARCHAR NOT NULL,
    CONSTRAINT fk_complex_id
    FOREIGN KEY (complex_id)
    REFERENCES complex(id)
);
INSERT INTO room(number_of_rooms, price, kv, company_id, complex_id)VALUES(3, 5000000, 60, 'cee88a92-f94d-42a6-ba2a-de9387aaa225', '5b6e08dd-87c4-4d98-8499-08d3456ed7d4'),(2,4200000, 47,'d73e8646-7706-42e6-913f-83c525fb4b06','b0e657a7-7ab1-4511-bb47-cd7aa115be08');

SELECT r.id room_id, r.number_of_rooms, r.price, r.kv, cpx.id complex_id, cpx.name comlex_name, cpy.id company_id, cpy.name company_name FROM room r JOIN complex cpx ON r.complex_id = cpx.id JOIN company cpy ON cpx.company_id = cpy.id;

-- BANKS 
CREATE TABLE banks(
    id TEXT UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    image TEXT NOT NULL,
    max_loan INT NOT NULL,
    starting_payment INT NOT NULL,
    service_fee INT NOT NULL
);
INSERT INTO banks(name, image, max_loan, starting_payment, service_fee)
    VALUES
    ('Asaka Bank', 'https://upload.wikimedia.org/wikipedia/commons/7/71/AsakabankLogo.png', 400000000 ,17, 2000000),
    ('SQB', 'https://i.ytimg.com/vi/934JxNHpArk/maxresdefault.jpg', 300000000, 15, 2500000),
    ('NBU', 'https://upload.wikimedia.org/wikipedia/commons/e/e7/NBU_new_logo.jpg',500000000, 12, 1800000);

select * from banks where max_loan < 420000000; 