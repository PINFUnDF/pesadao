function removeProduto(productId) {
  // Envia uma solicitação para o servidor para remover o produto do carrinho
  fetch("/carrinho", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId: productId }),
  })
    .then((response) => {
      if (response.ok) {
        // Atualiza a página após a remoção do produto
        window.location.reload();
      } else {
        console.error("Erro ao remover produto docarrinho");
      }
    })
    .catch((error) => {
      console.error("Erro ao remover produto do carrinho:", error);
    });
}
