// -----------------------------
// COFFEE SHOP - cart.js
// Handles Cart Page: display, update, remove, total
// -----------------------------

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartContainer = document.querySelector("#cart-items");
const totalElement = document.querySelector("#cart-total");

// Function to render cart
function renderCart() {
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart">
        <p>Your cart is empty ☕</p>
        <a href="menu.html" class="btn">Go to Menu</a>
      </div>`;
    totalElement.textContent = "₹0";
    return;
  }

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <p>₹${item.price.toFixed(2)}</p>
        <div class="quantity-control">
          <button class="qty-btn" onclick="decreaseQuantity(${index})">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" onclick="increaseQuantity(${index})">+</button>
        </div>
        <p class="subtotal">Subtotal: ₹${itemTotal.toFixed(2)}</p>
        <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
      </div>
    `;

    cartContainer.appendChild(cartItem);
  });

  updateTotal();
}

// Update total amount
function updateTotal() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalElement.textContent = `₹${total.toFixed(2)}`;
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update navbar cart count (if exists)
  const cartCount = document.querySelector("#cart-count");
  if (cartCount) {
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  }
}

// Quantity functions
function increaseQuantity(index) {
  cart[index].quantity++;
  renderCart();
}

function decreaseQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }
  renderCart();
}

// Remove product completely
function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
}

// Run on page load
renderCart();
