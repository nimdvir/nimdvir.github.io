// Apply the saved choice before the first paint. Light unless the visitor
// picked Dark or System.
(() => {
  let theme;
  try {
    theme = localStorage.getItem("nimdvir-theme");
  } catch {}
  const mode = ["light", "dark", "system"].includes(theme) ? theme : "light";
  if (mode === "system")
    theme = matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.themePreference = mode;
  document.documentElement.classList.add("js");
})();
