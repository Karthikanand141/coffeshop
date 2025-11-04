// ===== Shared Authentication Script =====

// Get user info
function getUser() {
  return localStorage.getItem("user");
}

// Update navbar Sign In/Out link
function updateNavbar() {
  const signinBtn = document.getElementById("signin-btn");
  if (!signinBtn) return;

  const user = getUser();
  if (user) {
    signinBtn.textContent = `Hello, ${user.split("@")[0]}`;
    signinBtn.classList.add("signedin");
    signinBtn.onclick = () => {
      if (confirm("Do you want to sign out?")) {
        localStorage.removeItem("user");
        updateNavbar();
      }
    };
  } else {
    signinBtn.textContent = "Sign In";
    signinBtn.classList.remove("signedin");
    signinBtn.onclick = () => openSignInModal();
  }
}

// Open Sign-In modal
function openSignInModal() {
  const modal = document.getElementById("signin-modal");
  if (modal) modal.style.display = "flex";
}

// Close Sign-In modal
function closeSignInModal() {
  const modal = document.getElementById("signin-modal");
  if (modal) modal.style.display = "none";
}

// Handle Login
function handleLogin() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }
  localStorage.setItem("user", email);
  alert("Signed in successfully!");
  closeSignInModal();
  updateNavbar();
}

// Protect checkout — call before proceeding to checkout
function checkSignInBeforeCheckout() {
  if (!getUser()) {
    alert("Please sign in to proceed to checkout.");
    openSignInModal();
    return false;
  }
  return true;
}

// ===== Event Bindings =====
document.addEventListener("DOMContentLoaded", () => {
  updateNavbar();

  const closeBtn = document.querySelector(".close-btn");
  if (closeBtn) closeBtn.onclick = () => closeSignInModal();

  window.onclick = (e) => {
    const modal = document.getElementById("signin-modal");
    if (e.target === modal) closeSignInModal();
  };

  const loginBtn = document.getElementById("login-btn");
  if (loginBtn) loginBtn.onclick = () => handleLogin();
});
