drop database if exists carpark_system;
create database carpark_system;

use carpark_system;

create table user_table (
    user_id integer auto_increment primary key,
    first_name varchar(50),
    last_name varchar(50),
    password text,
    email text,
    contact_no text
);