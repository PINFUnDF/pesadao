var express = require("express");
const conexao = require("../db.js");

var router = express.Router();

router.get("/", (req, res) => {
  let sqlFemininos = `SELECT * FROM produtos WHERE generoProd = 'Feminino' OR generoProd = 'Feminina'`;
  let sqlMasculinos = `SELECT * FROM produtos WHERE generoProd = 'Masculino' OR generoProd = 'Masculina'`;
  let sqlMochilas = `SELECT * FROM produtos WHERE name LIKE '%Mochila%'`;
  let sqlJaquetas = `SELECT * FROM produtos WHERE name LIKE '%Jaqueta%' OR name LIKE '%Casaco%' OR name LIKE '%Sobretudo%'`;
  let sqlNovidades = `SELECT * FROM produtos WHERE id = 2 OR id = 3 OR id = 8`;

  conexao.query(sqlFemininos, (erroFemininos, resultadosFemininos) => {
    if (erroFemininos) {
      console.error(erroFemininos);
      res.status(500).send("Erro ao buscar produtos femininos");
      return;
    }

    const groupedResultadosFemininos = [];
    for (let i = 0; i < resultadosFemininos.length; i += 3) {
      groupedResultadosFemininos.push(resultadosFemininos.slice(i, i + 3));
    }

    conexao.query(sqlMasculinos, (erroMasculinos, resultadosMasculinos) => {
      if (erroMasculinos) {
        console.error(erroMasculinos);
        res.status(500).send("Erro ao buscar produtos masculinos");
        return;
      }

      const groupedResultadosMasculinos = [];
      for (let i = 0; i < resultadosMasculinos.length; i += 3) {
        groupedResultadosMasculinos.push(resultadosMasculinos.slice(i, i + 3));
      }

      conexao.query(sqlMochilas, (erroMochilas, resultadosMochilas) => {
        if (erroMochilas) {
          console.error(erroMochilas);
          res.status(500).send("Erro ao buscar mochilas");
          return;
        }

        const groupedResultadosMochilas = [];
        for (let i = 0; i < resultadosMochilas.length; i += 3) {
          groupedResultadosMochilas.push(resultadosMochilas.slice(i, i + 3));
        }

        // Adicione suas consultas adicionais aqui
        // Consulta 1
        conexao.query(sqlJaquetas, (erroJaquetas, resultadosJaquetas) => {
          if (erroJaquetas) {
            console.error(erroJaquetas);
            res.status(500).send("Erro ao buscar Jaquetas");
            return;
          }

          const groupedResultadosJaquetas = [];
          for (let i = 0; i < resultadosJaquetas.length; i += 3) {
            groupedResultadosJaquetas.push(resultadosJaquetas.slice(i, i + 3));
          }

          // Consulta 2
          conexao.query(sqlNovidades, (erroNovidades, resultadosNovidades) => {
            if (erroNovidades) {
              console.error(erroNovidades);
              res.status(500).send("Erro ao buscar Novidades");
              return;
            }

            const groupedResultadosNovidades = [];
            for (let i = 0; i < resultadosNovidades.length; i += 3) {
              groupedResultadosNovidades.push(
                resultadosNovidades.slice(i, i + 3),
              );
            }

            res.render("index", {
              title: "Home - Pesadão",
              groupedResultadosFemininos: groupedResultadosFemininos,
              groupedResultadosMasculinos: groupedResultadosMasculinos,
              groupedResultadosMochilas: groupedResultadosMochilas,
              groupedResultadosJaquetas: groupedResultadosJaquetas,
              groupedResultadosNovidades: groupedResultadosNovidades,
            });
          });
        });
      });
    });
  });
});

module.exports = router;
