// Apply the device preference or saved choice before the first paint.
(() => {
  let theme;
  try {
    theme = localStorage.getItem("nimdvir-theme");
  } catch {}
  if (theme !== "light" && theme !== "dark")
    theme = matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.add("js");
})();
