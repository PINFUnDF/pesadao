var express = require("express");
var router = express.Router();
var conexao = require("../db");

router.get("/:id", function (req, res) {
  let productId = req.params.id;
  let sql = "SELECT * FROM produtos WHERE id = ?";
  conexao.query(sql, [productId], function (erro, resultados) {
    if (erro) {
      console.error(erro);
      res.status(500).send("Erro ao buscar o produto");
    } else {
      console.log(resultados);
      res.render("produto", {
        title: "Produto - Pesadão",
        produto: resultados[0], // Assumindo que você espera apenas um resultado
      });
    }
  });
});

module.exports = router;
