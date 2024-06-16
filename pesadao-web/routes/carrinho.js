var express = require("express");
var router = express.Router();
var conexao = require("../db");

router.get("/", function (req, res) {
  // Rota para visualizar o carrinho
  const cart = req.session.cart || [];
  if (!Array.isArray(cart)) {
    console.error("O carrinho não é um array:", cart);
    res.status(500).send("Erro ao processar o carrinho");
    return;
  }

  if (cart.length === 0) {
    res.render("carrinho", {
      title: "Carrinho - Pesadão",
      produtos: [],
      totalItens: 0,
      precoTotal: 0,
    });
    return;
  }

  // Consulta os detalhes dos produtos no carrinho
  const placeholders = cart.map(() => "?").join(",");
  const sql = `SELECT * FROM produtos WHERE id IN (${placeholders})`;

  conexao.query(sql, cart, function (erro, resultados) {
    if (erro) {
      console.error(erro);
      res.status(500).send("Erro ao buscar produtos do carrinho");
    } else {
      // Calcula a quantidade específica de cada produto e o preço total multiplicado pela quantidade
      const cartCount = cart.reduce((acc, productId) => {
        acc[productId] = (acc[productId] || 0) + 1;
        return acc;
      }, {});

      // Calcula o preço total de cada produto multiplicado pela quantidade
      resultados.forEach((produto) => {
        produto.quantidade = cartCount[produto.id];

        // Substituir vírgula por ponto no preço e converter para número
        produto.preco = parseFloat(produto.preco.replace(",", "."));

        // Calcular o preço total
        produto.precoTotal = produto.preco * produto.quantidade;

        produto.precoTotalFormatted = produto.precoTotal.toFixed(2);
      });

      // Calcula o número total de itens e o preço total do carrinho
      const totalItens = Object.values(cartCount).reduce(
        (acc, count) => acc + count,
        0,
      );
      const precoTotal = resultados
        .reduce((acc, produto) => acc + parseFloat(produto.precoTotal), 0)
        .toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

      res.render("carrinho", {
        title: "Carrinho - Pesadão",
        produtos: resultados,
        totalItens,
        precoTotal,
      });
    }
  });
});

router.post("/", function (req, res) {
  const productId = req.body.productId;
  console.log(`Adicionando produto com ID: ${productId} ao carrinho`);

  // Verifica se a sessão do carrinho já existe, senão inicializa
  if (!req.session.cart) {
    req.session.cart = [];
  }

  // Adiciona o ID do produto ao carrinho
  req.session.cart.push(productId);
  console.log("Carrinho atual:", req.session.cart);

  // Converte o carrinho em um objeto contendo a contagem de cada produto
  const cartCount = req.session.cart.reduce((acc, productId) => {
    acc[productId] = (acc[productId] || 0) + 1;
    return acc;
  }, {});

  // Envia uma resposta de sucesso com o carrinho atualizado
  res.json({ success: true, cart: cartCount });
});

router.delete("/", function (req, res) {
  const productId = req.body.productId;
  console.log(`Removendo produto com ID: ${productId} do carrinho`);

  // Verifica se a sessão do carrinho existe e se é um array
  if (!req.session.cart || !Array.isArray(req.session.cart)) {
    console.error(
      "Carrinho não encontrado ou não é um array:",
      req.session.cart,
    );
    res.status(500).send("Erro ao processar o carrinho");
    return;
  }

  // Encontra o índice do produto no carrinho
  const index = req.session.cart.findIndex((item) => item === productId);

  // Remove o produto do carrinho se encontrado
  if (index !== -1) {
    req.session.cart.splice(index, 1);
    console.log("Produto removido com sucesso do carrinho:", productId);
    res.json({ success: true });
  } else {
    console.error("Produto não encontrado no carrinho:", productId);
    res
      .status(404)
      .json({ success: false, message: "Produto não encontrado no carrinho" });
  }
});

module.exports = router;
