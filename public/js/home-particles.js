// Home page hero background, using the particles.js library in /js/particles.js.
(() => {
  const layer = document.getElementById("particles-js");
  const band = layer?.parentElement;
  if (!layer || !band || typeof window.particlesJS !== "function") return;

  const root = document.documentElement;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const themeColor = () =>
    getComputedStyle(root).getPropertyValue("--link").trim() || "#0b5fb0";
  const color = themeColor();

  window.particlesJS("particles-js", {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 900 } },
      color: { value: color },
      shape: { type: "circle" },
      opacity: { value: 0.6, random: true },
      size: { value: 3, random: true },
      line_linked: { enable: true, distance: 150, color, opacity: 0.4, width: 1 },
      move: {
        enable: !reduceMotion,
        speed: 1.5,
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
        grab: { distance: 140, line_linked: { opacity: 1 } },
        push: { particles_nb: 4 },
      },
    },
    retina_detect: true,
  });

  const pJS = window.pJSDom[window.pJSDom.length - 1]?.pJS;
  if (!pJS) return;
  const mouse = pJS.interactivity.mouse;

  // The hero content sits above the canvas, so track the pointer on the whole
  // band instead of on the canvas itself.
  band.addEventListener("pointermove", (event) => {
    const rect = pJS.canvas.el.getBoundingClientRect();
    mouse.pos_x = (event.clientX - rect.left) * pJS.canvas.pxratio;
    mouse.pos_y = (event.clientY - rect.top) * pJS.canvas.pxratio;
    pJS.interactivity.status = "mousemove";
  });
  band.addEventListener("pointerleave", () => {
    mouse.pos_x = null;
    mouse.pos_y = null;
    pJS.interactivity.status = "mouseleave";
  });
  // Clicking empty space adds particles; clicks on the card and links don't.
  band.addEventListener("click", (event) => {
    if (event.target.closest(".hero-card, .portrait-wrap")) return;
    if (pJS.particles.move.enable && mouse.pos_x !== null) {
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

  // Pause the animation while the hero is off screen.
  if (pJS.particles.move.enable && "IntersectionObserver" in window) {
    let running = true;
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        pJS.fn.vendors.draw();
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(pJS.fn.drawAnimFrame);
      }
    }).observe(band);
  }
})();
