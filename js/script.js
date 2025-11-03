document.addEventListener("DOMContentLoaded", () => {
  const addButtons = document.querySelectorAll(".add-cart");
  const cartCount = document.getElementById("cart-count");

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
  }

  addButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      const img = btn.dataset.img;

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existing = cart.find(item => item.name === name);
      if (existing) {
        existing.quantity++;
      } else {
        cart.push({ name, price, img, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      window.location.href = "cart.html"; // redirect to cart
    });
  });

  updateCartCount();
});
