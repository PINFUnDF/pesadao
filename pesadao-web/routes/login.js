var router = require("express").Router();
var conexao = require("../db");

router.get("/", function (req, res) {
  res.render("login", { title: "Login - Pesadão" });
});

router.post("/", function (req, res) {
  let email = req.body.email;
  let senha = req.body.password;

  // SQL para verificar se o email existe no banco de dados
  let sql = `SELECT * FROM cliente WHERE email = '${email}'`;

  // Executar a consulta SQL
  conexao.query(sql, function (erro, resultados) {
    if (erro) {
      console.error(erro);
      res.status(500).send("Erro ao tentar fazer login");
    } else {
      // Verificar se encontrou algum resultado
      if (resultados.length > 0) {
        // Comparar a senha fornecida com a senha armazenada no banco de dados
        if (senha === resultados[0].senha) {
          let nomeCliente = resultados[0].nome;
          req.session.nomeCliente = nomeCliente;
          res.redirect("/resLogin");
        } else {
          // Senha incorreta, mostrar mensagem de erro
          res.status(400).send("Senha incorreta");
        }
      } else {
        // Email não encontrado, mostrar mensagem de erro
        res.status(404).send("Email não encontrado");
      }
    }
  });
});

router.post("/google", function (req, res) {
  let nome = req.body.nome;
  console.log(nome);

  req.session.nomeCliente = nome;
  res.send({ url: "/resLogin" });
});

module.exports = router;
