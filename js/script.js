document.addEventListener("DOMContentLoaded", () => {
  const cartCount = document.getElementById("cart-count");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Update cart count in navbar
  const updateCartCount = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
  };
  updateCartCount();

  // Quantity +/- logic
  document.querySelectorAll(".menu-item").forEach(item => {
    const minusBtn = item.querySelector(".minus");
    const plusBtn = item.querySelector(".plus");
    const quantityDisplay = item.querySelector(".quantity");
    let quantity = 1;

    minusBtn.addEventListener("click", () => {
      if (quantity > 1) quantity--;
      quantityDisplay.textContent = quantity;
    });

    plusBtn.addEventListener("click", () => {
      quantity++;
      quantityDisplay.textContent = quantity;
    });

    // Add to Cart button
    item.querySelector(".add-to-cart").addEventListener("click", () => {
      const name = item.dataset.name;
      const price = parseFloat(item.dataset.price);

      const existingItem = cart.find(p => p.name === name);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({ name, price, quantity });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      quantity = 1;
      quantityDisplay.textContent = "1";
    });
  });
});
