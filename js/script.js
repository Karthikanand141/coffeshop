// -----------------------------
// COFFEE SHOP - script.js
// Handles menu Add to Cart + Navbar Cart Count
// -----------------------------

// Load existing cart or create empty one
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Function to update cart count in navbar
function updateCartCount() {
  const cartCount = document.querySelector("#cart-count");
  if (cartCount) {
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  }
}

// Call it on page load
updateCartCount();

// Function to add product to cart
function addToCart(productId, name, price, image) {
  const existingItem = cart.find(item => item.id === productId);
  const quantityDropdown = document.querySelector(`#quantity-${productId}`);
  const quantity = parseInt(quantityDropdown.value);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: productId,
      name,
      price,
      image,
      quantity
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

  // Redirect to cart page
  window.location.href = "cart.html";
}

// -----------------------------
// BUY NOW (Just like add to cart but goes directly)
// -----------------------------
function buyNow(productId, name, price, image) {
  const order = [{
    id: productId,
    name,
    price,
    image,
    quantity: 1
  }];
  localStorage.setItem("cart", JSON.stringify(order));
  window.location.href = "cart.html";
}
