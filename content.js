(() => {
  const DEFAULT_KEYWORDS = [
    'amazon basics',
    'amazonbasics',
    'amazon essentials',
    'amazon elements',
    'amazon collection',
    'amazon brand',
    'amazon commercial',
    'solimo',
    'presto!'
  ];

  // Card-level containers on amazon.com search/listing/carousel pages.
  // Amazon's DOM changes fairly often, so this list is intentionally broad
  // and matched against visible text rather than exact class names.
  const CARD_SELECTORS = [
    'div.s-result-item[data-asin]:not([data-asin=""])',
    'div[data-component-type="s-search-result"]',
    'div[data-component-type="sp-sponsored-result"]',
    'li.a-carousel-card'
  ];

  let settings = { enabled: true, keywords: DEFAULT_KEYWORDS };
  let scheduled = false;

  function normalize(str) {
    return (str || '').toLowerCase();
  }

  function cardMatches(card) {
    const text = normalize(card.innerText);
    return settings.keywords.some((kw) => kw && text.includes(normalize(kw)));
  }

  function collectCards() {
    const found = new Set();
    for (const sel of CARD_SELECTORS) {
      document.querySelectorAll(sel).forEach((el) => found.add(el));
    }
    return found;
  }

  function process() {
    if (!settings.enabled) {
      document.querySelectorAll('.hab-hidden').forEach((el) => el.classList.remove('hab-hidden'));
      chrome.storage.local.set({ hiddenCount: 0 });
      chrome.runtime.sendMessage({ type: 'HAB_COUNT', count: 0 });
      return;
    }

    let hiddenCount = 0;
    collectCards().forEach((card) => {
      if (cardMatches(card)) {
        card.classList.add('hab-hidden');
        hiddenCount++;
      } else {
        card.classList.remove('hab-hidden');
      }
    });
    chrome.storage.local.set({ hiddenCount });
    chrome.runtime.sendMessage({ type: 'HAB_COUNT', count: hiddenCount });
  }

  function scheduleProcess() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      process();
    });
  }

  function loadSettingsAndRun() {
    chrome.storage.sync.get({ enabled: true, keywords: DEFAULT_KEYWORDS }, (stored) => {
      settings = stored;
      process();
    });
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync') return;
    if (changes.enabled) settings.enabled = changes.enabled.newValue;
    if (changes.keywords) settings.keywords = changes.keywords.newValue;
    process();
  });

  // Amazon loads results dynamically as you scroll/paginate/filter,
  // so keep watching the page rather than scanning once.
  const observer = new MutationObserver(scheduleProcess);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  loadSettingsAndRun();
})();
