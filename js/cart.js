// ======== Load Cart Data from localStorage ========
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCountEl = document.getElementById("cart-count");

// Update Cart Display
function renderCart() {
  cartContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = `<p>Your cart is empty ☕</p>`;
    cartTotal.textContent = "₹0";
    cartCountEl.textContent = 0;
    return;
  }

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="item-details">
        <h4>${item.name}</h4>
        <p>₹${item.price} each</p>
      </div>
      <div class="item-actions">
        <select class="qty-select" data-index="${index}">
          ${[...Array(10).keys()].map(i => {
            const qty = i + 1;
            return `<option value="${qty}" ${qty === item.quantity ? "selected" : ""}>${qty}</option>`;
          }).join("")}
        </select>
        <button class="remove-btn" data-index="${index}">Remove</button>
      </div>
    `;
    cartContainer.appendChild(div);
  });

  cartTotal.textContent = `₹${total}`;
  cartCountEl.textContent = cart.length;

  localStorage.setItem("cart", JSON.stringify(cart));
}

// ======== Handle Quantity Change ========
cartContainer.addEventListener("change", (e) => {
  if (e.target.classList.contains("qty-select")) {
    const index = e.target.dataset.index;
    const newQty = parseInt(e.target.value);
    cart[index].quantity = newQty;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
});

// ======== Handle Remove Button ========
cartContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    const index = e.target.dataset.index;
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
});

// ======== Checkout Button ========
document.getElementById("checkout-btn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
  } else {
    alert("Thank you for your order! ☕ Your coffee is on the way!");
    localStorage.removeItem("cart");
    cart = [];
    renderCart();
  }
});

// ======== Initialize ========
renderCart();
