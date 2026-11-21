/* Give the page text and fonts their first paint before loading the decorative 3D library. */
(() => {
  let started = false;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const constrained = matchMedia("(max-width: 760px)").matches || navigator.connection?.saveData;
  function load() {
    if (started || document.hidden) return;
    started = true;
    const library = document.createElement("script");
    library.src = "/vendor/three-r128.min.js";
    library.async = true;
    library.onload = () => dispatchEvent(new Event("benzz:three-ready"));
    library.onerror = () => { document.querySelector("#bg").hidden = true; document.body.classList.add("nogl"); };
    document.head.append(library);
  }
  if (reduced) {
    document.querySelector("#bg").hidden = true;
    document.body.classList.add("nogl");
  } else if (constrained) {
    // Decorative WebGL follows intent on mobile so text and controls paint first.
    for (const event of ["pointerdown", "keydown", "scroll"])
      addEventListener(event, load, { once: true, passive: true });
  } else {
    document.fonts.ready.then(() => requestAnimationFrame(() => requestAnimationFrame(load)));
    document.addEventListener("visibilitychange", load);
  }
})();
