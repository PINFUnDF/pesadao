const mysql = require("mysql2");

const conexao = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "pesadao",
});

module.exports = conexao;
