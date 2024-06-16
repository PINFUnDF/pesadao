var express = require("express");
var router = express.Router();
var conexao = require("../db");

router.get("/", function (req, res) {
  let productName = req.query.name;

  if (!productName) {
    return res.status(400).send("Nome do produto não fornecido");
  }

  console.log(`Buscando por: ${productName}`);

  let sql = `SELECT * FROM produtos WHERE name LIKE ?`;
  let query = "%" + productName + "%";

  console.log(`Executando SQL: ${sql} com query: ${query}`);

  conexao.query(sql, [query], function (erro, resultadosBusca) {
    if (erro) {
      console.error("Erro ao executar a consulta:", erro);
      res.status(500).send("Erro ao buscar!");
    } else {
      const groupedResultadosBusca = [];
      for (let i = 0; i < resultadosBusca.length; i += 3) {
        groupedResultadosBusca.push(resultadosBusca.slice(i, i + 3));
      }
      console.log(groupedResultadosBusca);
      res.render("resultadoPesquisa", {
        title: "Pesadão",
        groupedResultadosBusca: groupedResultadosBusca,
      });
    }
  });
});

module.exports = router;
