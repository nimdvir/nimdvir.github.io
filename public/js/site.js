(() => {
  const root = document.documentElement;
  const preference = matchMedia("(prefers-color-scheme: dark)");
  const themeButton = document.querySelector(".theme-toggle");
  let manualTheme = false;
  try {
    manualTheme = ["light", "dark"].includes(
      localStorage.getItem("nimdvir-theme"),
    );
  } catch {}
  function syncThemeButton() {
    const dark = root.dataset.theme === "dark";
    if (!themeButton) return;
    themeButton.setAttribute(
      "aria-label",
      `Switch to ${dark ? "light" : "dark"} mode`,
    );
    themeButton.setAttribute(
      "title",
      `Switch to ${dark ? "light" : "dark"} mode`,
    );
    const label = themeButton.querySelector(".theme-label");
    if (label) label.textContent = dark ? "Light" : "Dark";
  }
  if (themeButton) {
    themeButton.hidden = false;
    syncThemeButton();
    themeButton.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      manualTheme = true;
      try {
        localStorage.setItem("nimdvir-theme", root.dataset.theme);
      } catch {}
      syncThemeButton();
    });
  }
  preference.addEventListener("change", (event) => {
    if (!manualTheme) {
      root.dataset.theme = event.matches ? "dark" : "light";
      syncThemeButton();
    }
  });
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#primary-nav");
  if (menu && nav) {
    menu.hidden = false;
    const close = () => {
      menu.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    };
    menu.addEventListener("click", () => {
      const open = menu.getAttribute("aria-expanded") !== "true";
      menu.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    });
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) close();
    });
    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        menu.getAttribute("aria-expanded") === "true"
      ) {
        close();
        menu.focus();
      }
    });
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".site-header")) close();
    });
    matchMedia("(min-width: 961px)").addEventListener("change", close);
  }
  // A single short typing pass, with a static screen-reader equivalent.
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  document.querySelectorAll("[data-typewriter]").forEach((el) => {
    const text = (el.textContent || "").trim();
    if (reduced.matches) return;
    let index = 0;
    el.textContent = "";
    const timer = setInterval(() => {
      if (reduced.matches) {
        el.textContent = text;
        clearInterval(timer);
        return;
      }
      el.textContent = text.slice(0, ++index);
      if (index >= text.length) {
        clearInterval(timer);
        el.classList.add("typing-complete");
      }
    }, 65);
  });
  const filters = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll("[data-project-category]");
  if (filters.length) {
    document.querySelector(".project-filters")?.removeAttribute("hidden");
    filters.forEach((button) =>
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        filters.forEach((b) =>
          b.setAttribute("aria-pressed", String(b === button)),
        );
        let count = 0;
        cards.forEach((card) => {
          card.hidden =
            filter !== "all" && card.dataset.projectCategory !== filter;
          if (!card.hidden) count++;
        });
        const status = document.querySelector("#filter-status");
        if (status)
          status.textContent = `${count} ${count === 1 ? "project" : "projects"} shown`;
      }),
    );
  }
})();
