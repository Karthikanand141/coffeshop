document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");
  const cartCountElement = document.getElementById("cart-count");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function updateCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="item-details">
          <div class="item-name">${item.name}</div>
          <div class="item-price">$${item.price.toFixed(2)}</div>
        </div>
        <div class="quantity-controls">
          <button class="decrease" data-index="${index}">-</button>
          <span>${item.quantity}</span>
          <button class="increase" data-index="${index}">+</button>
        </div>
        <div class="item-total">$${itemTotal.toFixed(2)}</div>
        <button class="remove-btn" data-index="${index}">Remove</button>
      `;
      cartItemsContainer.appendChild(cartItem);
    });

    cartTotalElement.textContent = total.toFixed(2);
    cartCountElement.textContent = cart.length;
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  cartItemsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("increase")) {
      const index = e.target.dataset.index;
      cart[index].quantity++;
      updateCart();
    } else if (e.target.classList.contains("decrease")) {
      const index = e.target.dataset.index;
      if (cart[index].quantity > 1) {
        cart[index].quantity--;
      } else {
        cart.splice(index, 1);
      }
      updateCart();
    } else if (e.target.classList.contains("remove-btn")) {
      const index = e.target.dataset.index;
      cart.splice(index, 1);
      updateCart();
    }
  });

  updateCart();
});
