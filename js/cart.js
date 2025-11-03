document.addEventListener("DOMContentLoaded", () => {
  const addButtons = document.querySelectorAll(".add-cart");
  const cartCount = document.getElementById("cart-count");
  const cartItemsContainer = document.getElementById("cart-items");
  const totalElement = document.getElementById("cart-total");

  // Load existing cart from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // --- 1. Add to Cart buttons (menu page) ---
  addButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      const existing = cart.find((item) => item.name === name);

      if (existing) existing.qty += 1;
      else cart.push({ name, price, qty: 1 });

      saveCart();
      updateCartCount();
      alert(`${name} added to cart!`);
    });
  });

  // --- 2. Render cart (cart page) ---
  if (cartItemsContainer) {
    renderCart();
  }

  // --- 3. Render Function ---
  function renderCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
      totalElement.textContent = "0.00";
      updateCartCount();
      return;
    }

    cart.forEach((item, index) => {
      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
        <span>${item.name}</span>
        <div class="qty-controls">
          <button class="decrease">−</button>
          <span>${item.qty}</span>
          <button class="increase">+</button>
        </div>
        <span>$${(item.price * item.qty).toFixed(2)}</span>
      `;

      // Decrease
      div.querySelector(".decrease").addEventListener("click", () => {
        if (item.qty > 1) item.qty -= 1;
        else cart.splice(index, 1);
        saveCart();
        renderCart();
      });

      // Increase
      div.querySelector(".increase").addEventListener("click", () => {
        item.qty += 1;
        saveCart();
        renderCart();
      });

      cartItemsContainer.appendChild(div);
      total += item.price * item.qty;
    });

    totalElement.textContent = total.toFixed(2);
    updateCartCount();
  }

  // --- 4. Update cart count in navbar ---
  function updateCartCount() {
    if (cartCount) {
      const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
      cartCount.textContent = totalQty;
    }
  }

  // --- 5. Save cart to localStorage ---
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // --- 6. Checkout ---
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      alert("Thank you for your order! ☕");
      localStorage.removeItem("cart");
      cart = [];
      renderCart();
    });
  }

  // Show count on every page
  updateCartCount();
});
