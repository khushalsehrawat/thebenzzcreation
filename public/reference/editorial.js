/* Optional enhancements: all guides and article text remain available without JS. */
(() => {
  const form = document.querySelector("[data-editorial-filters]");
  if (form) {
    const search = form.querySelector("input");
    const category = form.querySelector("select");
    const cards = [...document.querySelectorAll("[data-article]")];
    const count = document.querySelector("#guide-count");
    const empty = document.querySelector("[data-editorial-empty]");
    function filter() {
      const terms = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
      let visible = 0;
      for (const card of cards) {
        card.hidden = !terms.every((term) => card.dataset.search.includes(term)) ||
          (!!category.value && card.dataset.category !== category.value);
        if (!card.hidden) visible++;
      }
      count.textContent = `${visible} ${visible === 1 ? "guide" : "guides"} found`;
      empty.hidden = visible !== 0;
    }
    form.hidden = false;
    form.addEventListener("submit", (event) => event.preventDefault());
    form.addEventListener("input", filter);
    form.addEventListener("change", filter);
    form.addEventListener("reset", () => setTimeout(filter, 0));
  }
  const copy = document.querySelector("[data-copy-link]");
  if (copy && navigator.clipboard?.writeText) {
    copy.hidden = false;
    copy.addEventListener("click", async () => {
      const status = document.querySelector("[data-copy-status]");
      try {
        await navigator.clipboard.writeText(copy.dataset.copyLink);
        status.textContent = "Link copied.";
      } catch {
        status.textContent = "Could not copy. Use the page address or email link.";
      }
    });
  }
})();
