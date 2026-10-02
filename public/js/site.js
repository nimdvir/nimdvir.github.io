(() => {
  const root = document.documentElement;
  const preference = matchMedia("(prefers-color-scheme: dark)");
  const picker = document.querySelector(".theme-picker");
  const themeButton = picker?.querySelector(".theme-toggle");
  const options = picker?.querySelector(".theme-options");
  let mode = root.dataset.themePreference || "system";
  function applyTheme() {
    const dark = mode === "dark" || (mode === "system" && preference.matches);
    root.dataset.theme = dark ? "dark" : "light";
    root.dataset.themePreference = mode;
    themeButton?.setAttribute(
      "aria-label",
      `Choose color theme: ${mode}, currently ${root.dataset.theme}`,
    );
    themeButton?.setAttribute("title", `Color theme: ${mode}`);
    picker?.querySelectorAll("[data-theme-choice]").forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.themeChoice === mode),
      );
    });
  }
  function closeThemePicker(restoreFocus = false) {
    if (!options || !themeButton) return;
    options.hidden = true;
    themeButton.setAttribute("aria-expanded", "false");
    if (restoreFocus) themeButton.focus();
  }
  if (picker && themeButton && options) {
    picker.hidden = false;
    applyTheme();
    themeButton.addEventListener("click", () => {
      options.hidden = !options.hidden;
      themeButton.setAttribute("aria-expanded", String(!options.hidden));
      if (!options.hidden)
        options.querySelector('[aria-pressed="true"]')?.focus();
    });
    options.querySelectorAll("[data-theme-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        mode = button.dataset.themeChoice;
        try {
          localStorage.setItem("nimdvir-theme", mode);
        } catch {}
        applyTheme();
        closeThemePicker(true);
      });
    });
    document.addEventListener("click", (event) => {
      if (!picker.contains(event.target)) closeThemePicker();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !options.hidden) closeThemePicker(true);
    });
    picker.addEventListener("focusout", (event) => {
      if (!picker.contains(event.relatedTarget)) closeThemePicker();
    });
  }
  preference.addEventListener("change", () => {
    if (mode === "system") applyTheme();
  });
  window.addEventListener("storage", (event) => {
    if (event.key !== "nimdvir-theme" && event.key !== null) return;
    mode = ["light", "dark"].includes(event.newValue)
      ? event.newValue
      : "system";
    applyTheme();
  });
  // Keep personal-site navigation in this tab. CCE is a separate website
  // hosted under the same GitHub Pages origin.
  const siteOrigins = [location.origin, "https://nimdvir.github.io"];
  document.querySelectorAll("a[href]").forEach((link) => {
    const isWebLink = ["http:", "https:"].includes(link.protocol);
    const isCceSite =
      link.pathname === "/cce-2026" ||
      link.pathname.startsWith("/cce-2026/");
    const isExternal =
      isWebLink && (!siteOrigins.includes(link.origin) || isCceSite);
    link.target = isExternal ? "_blank" : "_self";
    if (isExternal) {
      link.relList.add("noopener", "noreferrer");
    }
  });
  const copyEmail = document.querySelector("[data-copy-email]");
  if (copyEmail) {
    copyEmail.hidden = false;
    copyEmail.addEventListener("click", async () => {
      const status = document.querySelector(".copy-status");
      try {
        await navigator.clipboard.writeText(copyEmail.dataset.copyEmail);
        status.textContent = "Email address copied.";
      } catch {
        status.textContent =
          "Select and copy the address above: ndvir@albany.edu";
      }
    });
  }
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
