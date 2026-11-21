// Shared by every page: sticky nav hairline and mobile menu.
document.documentElement.classList.add("js");
(function () {
  // Sticky nav hairline
  var shell = document.querySelector(".nav-shell");
  function onScroll() {
    shell.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  var btn = document.getElementById("menu-btn"),
    menu = document.getElementById("mobile-menu");
  function setMenu(open) {
    btn.setAttribute("aria-expanded", open);
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.hidden = !open;
  }
  btn.addEventListener("click", function () {
    setMenu(menu.hidden);
  });
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !menu.hidden) {
      setMenu(false);
      btn.focus();
    }
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 1200) setMenu(false);
  });
})();
