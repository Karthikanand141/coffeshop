// ======== Initialize Cart ========
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ======== Update Cart Count in Navbar ========
function updateCartCount() {
  const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) {
    cartCountEl.textContent = cart.length;
  }
}
updateCartCount();

// ======== Add to Cart Function ========
function addToCart(product) {
  const existingItem = cart.find((item) => item.name === product.name);
  if (existingItem) {
    existingItem.quantity += product.quantity;
  } else {
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert(`${product.name} added to cart!`);
}

// ======== Buy Now Function ========
function buyNow(product) {
  localStorage.setItem("cart", JSON.stringify([product]));
  window.location.href = "cart.html";
}

// ======== Handle Add to Cart & Buy Now Buttons ========
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-cart") || e.target.classList.contains("buy-now")) {
    const menuItem = e.target.closest(".menu-item");
    const name = menuItem.querySelector("h3").textContent;
    const price = parseInt(menuItem.querySelector(".price").textContent.replace("₹", ""));
    const image = menuItem.querySelector("img").src;
    const quantity = parseInt(menuItem.querySelector(".quantity-control select").value);

    const product = { name, price, image, quantity };

    if (e.target.classList.contains("add-cart")) {
      addToCart(product);
    } else if (e.target.classList.contains("buy-now")) {
      buyNow(product);
    }
  }
});
