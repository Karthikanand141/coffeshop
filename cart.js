// Example coffee menu data
const menuData = [
  { id: 1, name: 'Espresso', price: 3.0, img: 'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03' },
  { id: 2, name: 'Cappuccino', price: 4.0, img: 'https://images.unsplash.com/photo-1511920170033-f8396924c348' },
  { id: 3, name: 'Latte', price: 4.5, img: 'https://images.unsplash.com/photo-1521305916504-4a1121188589' },
  { id: 4, name: 'Mocha', price: 5.0, img: 'https://images.unsplash.com/photo-1541167760496-1628856ab772' },
  { id: 5, name: 'Cold Brew', price: 4.0, img: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814' }
];

// ===== MENU PAGE =====
const menuContainer = document.getElementById('menu-items');
if (menuContainer) {
  menuData.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('menu-item');
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>Freshly brewed perfection.</p>
      <span>$${item.price.toFixed(2)}</span>
      <button class="btn add-to-cart" data-id="${item.id}">Add to Cart</button>
    `;
    menuContainer.appendChild(div);
  });

  // Handle add-to-cart
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = parseInt(e.target.dataset.id);
      addToCart(id);
    });
  });
}

// ===== CART FUNCTIONS =====
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function addToCart(id) {
  const cart = getCart();
  const item = menuData.find(i => i.id === id);
  const existing = cart.find(c => c.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  saveCart(cart);
  alert(`${item.name} added to cart!`);
}

function removeFromCart(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  renderCart();
}

function updateQuantity(id, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty = qty > 0 ? qty : 1;
    saveCart(cart);
    renderCart();
  }
}

// ===== CART PAGE RENDER =====
const cartContainer = document.getElementById('cart-container');
function renderCart() {
  if (!cartContainer) return;
  const cart = getCart();
  cartContainer.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty ☕</p>';
  } else {
    cart.forEach(item => {
      total += item.price * item.qty;
      const div = document.createElement('div');
      div.classList.add('menu-item');
      div.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>$${item.price.toFixed(2)} x 
          <input type="number" min="1" value="${item.qty}" data-id="${item.id}" class="qty-input">
        </p>
        <strong>Subtotal: $${(item.price * item.qty).toFixed(2)}</strong>
        <button class="btn remove" data-id="${item.id}">Remove</button>
      `;
      cartContainer.appendChild(div);
    });
  }

  document.getElementById('cart-total').textContent = total.toFixed(2);

  // Bind actions
  document.querySelectorAll('.remove').forEach(btn => {
    btn.addEventListener('click', e => removeFromCart(parseInt(e.target.dataset.id)));
  });

  document.querySelectorAll('.qty-input').forEach(input => {
    input.addEventListener('change', e => {
      updateQuantity(parseInt(e.target.dataset.id), parseInt(e.target.value));
    });
  });
}

// ===== CART COUNT (HEADER) =====
function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((acc, item) => acc + item.qty, 0);
  const el = document.getElementById('cart-count');
  if (el) el.textContent = count;
}

// ===== INITIALIZE =====
window.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderCart();
});

// ===== CHECKOUT BUTTON =====
const checkoutBtn = document.getElementById('checkout-btn');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    const cart = getCart();
    if (cart.length === 0) {
      alert('Your cart is empty!');
    } else {
      alert('✅ Thank you! Your coffee order is confirmed.');
      localStorage.removeItem('cart');
      renderCart();
      updateCartCount();
    }
  });
}
