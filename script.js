// Navbar toggle
const menuToggle = document.getElementById('menu-toggle');
const navbar = document.getElementById('navbar');
menuToggle.addEventListener('click', () => {
  navbar.classList.toggle('active');
});

// Cart logic
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartCount = document.getElementById('cart-count');
const cartPopup = document.getElementById('cart-popup');
const cartIcon = document.getElementById('cart-icon');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

let cart = [];

addToCartButtons.forEach(button => {
  button.addEventListener('click', () => {
    const item = button.closest('.menu-item');
    const name = item.getAttribute('data-name');
    const price = parseFloat(item.getAttribute('data-price'));

    const existing = cart.find(i => i.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }
    updateCart();
  });
});

cartIcon.addEventListener('click', () => {
  cartPopup.classList.toggle('active');
});

function updateCart() {
  cartItemsContainer.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${item.name} x${item.qty} - $${(item.price * item.qty).toFixed(2)}
      <button class="remove-item" data-index="${index}">✖</button>
    `;
    cartItemsContainer.appendChild(li);
    total += item.price * item.qty;
  });

  cartTotal.textContent = total.toFixed(2);
  cartCount.textContent = cart.length;

  // Remove items
  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const i = e.target.getAttribute('data-index');
      cart.splice(i, 1);
      updateCart();
    });
  });
}

// Checkout button
document.getElementById('checkout-btn').addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty!');
  } else {
    alert('Thank you for your order! ☕');
    cart = [];
    updateCart();
    cartPopup.classList.remove('active');
  }
});
