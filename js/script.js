
// Simple smooth scroll and nav highlight
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("header nav a");
  links.forEach((link) => {
    if (link.href === window.location.href) {
      link.classList.add("active");
    }
  });
});
