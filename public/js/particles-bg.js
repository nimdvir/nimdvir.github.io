// Page background, using the particles.js library in /js/particles.js.
// Full strength on the home page, subtler elsewhere. The main column hides
// the particles below the page intro, so there they show only in the margins.
(() => {
  const layer = document.getElementById("particles-js");
  const main = document.querySelector("main");
  if (!layer || !main || typeof window.particlesJS !== "function") return;

  const root = document.documentElement;
  const full = document.body.dataset.particles === "full";
  const intro = main.querySelector(".home-top, .page-intro");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Leave the intro uncovered and fade the column in just below it.
  function placeVeil() {
    if (!intro) return;
    const gap = full ? 0 : 24;
    main.style.setProperty(
      "--veil-top",
      `${intro.offsetTop + intro.offsetHeight + gap}px`,
    );
    main.style.setProperty("--veil-fade", full ? "96px" : "48px");
  }
  placeVeil();
  new ResizeObserver(placeVeil).observe(main);

  const themeColor = () =>
    getComputedStyle(root).getPropertyValue("--link").trim() || "#0b5fb0";
  const color = themeColor();
  const look = full
    ? { number: 80, area: 900, opacity: 0.6, line: 0.4, size: 3, speed: 1.5 }
    : { number: 60, area: 1100, opacity: 0.4, line: 0.22, size: 2.5, speed: 1 };

  window.particlesJS("particles-js", {
    particles: {
      number: { value: look.number, density: { enable: true, value_area: look.area } },
      color: { value: color },
      shape: { type: "circle" },
      opacity: { value: look.opacity, random: true },
      size: { value: look.size, random: true },
      line_linked: { enable: true, distance: 150, color, opacity: look.line, width: 1 },
      move: {
        enable: !reduceMotion,
        speed: look.speed,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "grab" },
        onclick: { enable: true, mode: "push" },
        resize: true,
      },
      modes: {
        grab: { distance: 140, line_linked: { opacity: full ? 1 : 0.6 } },
        push: { particles_nb: 4 },
      },
    },
    retina_detect: true,
  });

  const pJS = window.pJSDom[window.pJSDom.length - 1]?.pJS;
  if (!pJS) return;
  const mouse = pJS.interactivity.mouse;

  // The canvas sits behind the page, so follow the pointer on the document.
  document.addEventListener("pointermove", (event) => {
    mouse.pos_x = event.clientX * pJS.canvas.pxratio;
    mouse.pos_y = event.clientY * pJS.canvas.pxratio;
    pJS.interactivity.status = "mousemove";
  });
  document.documentElement.addEventListener("pointerleave", () => {
    mouse.pos_x = null;
    mouse.pos_y = null;
    pJS.interactivity.status = "mouseleave";
  });
  // Clicking empty space adds particles; clicks on content don't.
  const emptySpace = [document.documentElement, document.body, main];
  document.addEventListener("click", (event) => {
    const empty =
      emptySpace.includes(event.target) ||
      event.target.matches(".home-top, .home-hero");
    if (empty && pJS.particles.move.enable && mouse.pos_x !== null) {
      pJS.fn.modes.pushParticles(pJS.interactivity.modes.push.particles_nb, mouse);
    }
  });

  // Follow the site's light and dark themes.
  new MutationObserver(() => {
    const next = themeColor();
    const rgb = window.hexToRgb(next);
    if (!rgb) return;
    pJS.particles.color.value = next;
    pJS.particles.line_linked.color_rgb_line = rgb;
    pJS.particles.array.forEach((particle) => {
      particle.color.rgb = rgb;
    });
    if (!pJS.particles.move.enable) pJS.fn.particlesDraw();
  }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

  // Pause when no particles can be seen: no side margins and the intro has
  // scrolled away.
  if (!pJS.particles.move.enable) return;
  let running = true;
  function checkVisible() {
    const margins = innerWidth - main.getBoundingClientRect().width > 120;
    const introVisible = intro && intro.getBoundingClientRect().bottom > 0;
    const visible = margins || introVisible;
    if (visible && !running) {
      running = true;
      pJS.fn.vendors.draw();
    } else if (!visible && running) {
      running = false;
      cancelAnimationFrame(pJS.fn.drawAnimFrame);
    }
  }
  addEventListener("scroll", checkVisible, { passive: true });
  addEventListener("resize", checkVisible);
  checkVisible();
})();
