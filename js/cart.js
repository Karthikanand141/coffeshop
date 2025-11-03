document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-items");
  const totalPrice = document.getElementById("total-price");
  const cartCount = document.getElementById("cart-count");

  function updateCartCount(cart) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
  }

  function updateTotal(cart) {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalPrice.textContent = total.toFixed(2);
  }

  function renderCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty ☕</p>";
      updateTotal(cart);
      updateCartCount(cart);
      return;
    }

    cart.forEach((item, index) => {
      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
        <img src="${item.img}" alt="${item.name}" width="60">
        <span>${item.name}</span>
        <div class="qty-controls">
          <button class="decrease" data-index="${index}">-</button>
          <span>${item.quantity}</span>
          <button class="increase" data-index="${index}">+</button>
        </div>
        <span>$${(item.price * item.quantity).toFixed(2)}</span>
        <button class="remove" data-index="${index}">Remove</button>
      `;
      cartContainer.appendChild(div);
    });

    updateTotal(cart);
    updateCartCount(cart);
  }

  cartContainer.addEventListener("click", (e) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = e.target.dataset.index;

    if (e.target.classList.contains("increase")) {
      cart[index].quantity++;
    } else if (e.target.classList.contains("decrease")) {
      cart[index].quantity--;
      if (cart[index].quantity <= 0) cart.splice(index, 1);
    } else if (e.target.classList.contains("remove")) {
      cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  });

  renderCart();
});
