// Handle cart counter in navbar
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartCount() {
  document.getElementById("cart-count").textContent = cart.length;
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  const addButtons = document.querySelectorAll(".add-to-cart");
  addButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      const item = e.target.closest(".menu-item");
      const title = item.querySelector("h3").textContent;
      const price = parseFloat(item.querySelector("p").textContent.replace("₹", ""));
      const quantity = parseInt(item.querySelector("select").value);
      const image = item.querySelector("img").src;

      const existing = cart.find(c => c.title === title);
      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.push({ title, price, quantity, image });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      window.location.href = "cart.html"; // Redirect to cart
    });
  });
});
