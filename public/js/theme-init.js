// Apply the device preference or saved choice before the first paint.
(() => {
  let theme;
  try {
    theme = localStorage.getItem("nimdvir-theme");
  } catch {}
  const mode = ["light", "dark"].includes(theme) ? theme : "system";
  if (mode === "system")
    theme = matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.themePreference = mode;
  document.documentElement.classList.add("js");
})();
