(function () {
  const nav = document.querySelector(".site-nav");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  const toast = document.getElementById("toast");

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 2800);
  }

  if (nav) {
    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.classList.remove("is-open");
      });
    });
  }

  document.querySelectorAll("[data-product-form]").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      if (!form.hasAttribute("data-ajax-cart")) return;
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      if (btn) btn.disabled = true;
      try {
        const res = await fetch(window.Shopify?.routes?.root
          ? `${window.Shopify.routes.root}cart/add.js`
          : "/cart/add.js", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            items: [{
              id: Number(form.querySelector('[name="id"]').value),
              quantity: Number(form.querySelector('[name="quantity"]')?.value || 1),
            }],
          }),
        });
        if (!res.ok) throw new Error("add failed");
        showToast("Peça adicionada à sacola");
        const countEl = document.querySelector(".cart-count");
        if (countEl) {
          const cart = await fetch("/cart.js").then((r) => r.json());
          countEl.textContent = String(cart.item_count);
        }
      } catch {
        form.removeAttribute("data-ajax-cart");
        form.submit();
      } finally {
        if (btn) btn.disabled = false;
      }
    });
  });

  document.querySelectorAll("[data-thumb]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const main = document.getElementById("mainProductImg");
      const src = btn.getAttribute("data-src");
      if (main && src) {
        main.src = src;
        document.querySelectorAll("[data-thumb]").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
      }
    });
  });

  window.FlorenzaTheme = { showToast };
})();
