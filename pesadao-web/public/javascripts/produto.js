document.addEventListener("DOMContentLoaded", function () {
  // Seleciona todos os botões com a classe 'add-car'
  const addToCartButtons = document.querySelectorAll(".add-car"); // Adiciona um listener de evento de clique a cada botão
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      const productId = event.target.getAttribute("data-product-id");
      console.log(productId);
      addToCart(productId);
    });
  });
});
function addToCart(productId) {
  fetch("/carrinho", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId: productId }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Produto adicionado ao carrinho!");
      } else {
        alert("Erro ao adicionar o produto ao carrinho.");
      }
    })
    .catch((error) => {
      console.error("Erro:", error);
      alert("Erro ao adicionar o produto ao carrinho.");
    });
}
