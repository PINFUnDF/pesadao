CREATE DATABASE pesadao;
CREATE TABLE cliente(  
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(350),
    email VARCHAR(255),
    telefone VARCHAR(20), 
    senha VARCHAR(8),
    dataNasc DATE
);
CREATE TABLE produtos(  
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    generoProd VARCHAR(20),
    preco VARCHAR(200),
    imagem VARCHAR(300)
);