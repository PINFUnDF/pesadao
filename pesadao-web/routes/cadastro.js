var express = require("express");
var router = express.Router();
var conexao = require("../db");

router.get("/", function (req, res) {
  res.render("cadastro", { title: "Cadastro - Pesadão" });
});

router.post("/", function (req, res) {
  let nome = req.body.nome;
  let dataNasc = req.body.data;
  let email = req.body.email;
  let telefone = req.body.phone;
  let senha = req.body.password;
  let confirmSenha = req.body.confirmPassword;

  // Formatar a data para o formato YYYY-MM-DD
  let parts = dataNasc.split("/");
  let formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

  if (senha === confirmSenha) {
    //SQL
    let sql = `INSERT INTO cliente (nome, email, telefone, senha, dataNasc) VALUES ('${nome}', '${email}', '${telefone}', '${senha}', '${formattedDate}')`;
    //EXECUÇÃO SQL
    conexao.query(sql, function (erro, retorno) {
      if (erro) {
        console.error(erro);
        res.status(500).send("Erro ao cadastrar usuário");
      } else {
        console.log(retorno);
        res.redirect("/resLogin");
      }
    });
  } else {
    res.status(400).send("As senhas não coincidem!");
  }
});

module.exports = router;
