// ======== Load Cart from Local Storage ========
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ======== Select DOM Elements ========
const cartContainer = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const emptyCartMsg = document.getElementById("empty-cart");

// ======== Render Cart ========
function renderCart() {
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    emptyCartMsg.style.display = "block";
    cartTotalEl.textContent = "₹0";
    return;
  }

  emptyCartMsg.style.display = "none";

  cart.forEach((item, index) => {
    const itemRow = document.createElement("div");
    itemRow.classList.add("cart-item");

    itemRow.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-details">
        <h3>${item.name}</h3>
        <p>Price: ₹${item.price}</p>
        <div class="cart-qty">
          <label>Qty:</label>
          <input type="number" min="1" value="${item.quantity}" data-index="${index}" class="qty-input">
        </div>
        <p class="item-subtotal">Subtotal: ₹${item.price * item.quantity}</p>
        <button class="remove-btn" data-index="${index}">Remove</button>
      </div>
    `;

    cartContainer.appendChild(itemRow);
  });

  updateCartTotal();
}

// ======== Update Cart Total ========
function updateCartTotal() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotalEl.textContent = `₹${total}`;
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ======== Handle Quantity Changes ========
cartContainer.addEventListener("input", (e) => {
  if (e.target.classList.contains("qty-input")) {
    const index = e.target.dataset.index;
    const newQty = parseInt(e.target.value);
    if (newQty > 0) {
      cart[index].quantity = newQty;
      renderCart();
    }
  }
});

// ======== Handle Item Removal ========
cartContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    const index = e.target.dataset.index;
    if (confirm(`Remove "${cart[index].name}" from cart?`)) {
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }
  }
});

// ======== Checkout Button ========
document.getElementById("checkout-btn")?.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert("Proceeding to checkout...");
  // You can redirect to a payment or confirmation page here
  window.location.href = "checkout.html";
});

// ======== Initialize Cart Page ========
renderCart();
