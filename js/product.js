document.addEventListener("DOMContentLoaded", () => {
  const addToCartBtn = document.getElementById("addToCartBtn");
  const buyNowBtn = document.getElementById("buyNowBtn");
  const quantitySelect = document.getElementById("quantity");
  const cartCountElement = document.getElementById("cart-count");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartCountElement.textContent = cart.length;

  const product = {
    name: "Espresso",
    price: 3.00,
    image: "images/coffee1.png",
  };

  addToCartBtn.addEventListener("click", () => {
    const qty = parseInt(quantitySelect.value);
    const existingItem = cart.find(item => item.name === product.name);

    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      cart.push({ ...product, quantity: qty });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "cart.html";
  });

  buyNowBtn.addEventListener("click", () => {
    const qty = parseInt(quantitySelect.value);
    localStorage.setItem("cart", JSON.stringify([{ ...product, quantity: qty }]));
    window.location.href = "cart.html";
  });
});
