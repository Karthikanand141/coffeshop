// --- CART LOGIC --- //
document.addEventListener("DOMContentLoaded", () => {
  const addButtons = document.querySelectorAll(".add-cart");
  const cartItemsContainer = document.getElementById("cart-items");
  const totalElement = document.getElementById("cart-total");

  // Load cart from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Add to cart
  addButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      const existing = cart.find((item) => item.name === name);

      if (existing) existing.qty += 1;
      else cart.push({ name, price, qty: 1 });

      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${name} added to cart!`);
    });
  });

  // Display on cart page
  if (cartItemsContainer) {
    renderCart();
  }

  function renderCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
        <span>${item.name} x ${item.qty}</span>
        <span>$${(item.price * item.qty).toFixed(2)}</span>
      `;
      cartItemsContainer.appendChild(div);
      total += item.price * item.qty;
    });

    totalElement.textContent = total.toFixed(2);
  }

  // Checkout
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      alert("Thank you for your order! ☕");
      localStorage.removeItem("cart");
      cart = [];
      renderCart();
    });
  }
});

