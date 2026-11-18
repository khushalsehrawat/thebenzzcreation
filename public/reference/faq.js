/* Progressive enhancement: all answers and category links work without JavaScript. */
(() => {
  const search = document.querySelector('.faq-search');
  const input = document.querySelector('#faq-query');
  if (!search || !input) return;
  const entries = [...document.querySelectorAll('[data-faq]')];
  const status = document.querySelector('#faq-results');
  search.hidden = false;
  const revealHash = () => {
    const target = document.getElementById(location.hash.slice(1));
    if (target?.matches('[data-faq]')) target.open = true;
  };
  revealHash();
  addEventListener('hashchange', revealHash);
  input.addEventListener('input', () => {
    const words = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let count = 0;
    entries.forEach((entry) => {
      const matches = words.every((word) => entry.textContent.toLowerCase().includes(word));
      entry.hidden = !matches;
      entry.open = words.length > 0 && matches;
      if (matches) count++;
    });
    document.querySelectorAll('[data-faq-category]').forEach((category) => {
      category.hidden = ![...category.querySelectorAll('[data-faq]')].some((entry) => !entry.hidden);
    });
    status.textContent = `${count} ${count === 1 ? 'answer' : 'answers'} found${count ? '.' : '. Try a different term or contact us.'}`;
  });
})();
