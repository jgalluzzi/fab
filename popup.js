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

const enabledEl = document.getElementById('enabled');
const keywordsEl = document.getElementById('keywords');
const countEl = document.getElementById('count');
const saveBtn = document.getElementById('save');

function load() {
  chrome.storage.sync.get({ enabled: true, keywords: DEFAULT_KEYWORDS }, (stored) => {
    enabledEl.checked = stored.enabled;
    keywordsEl.value = stored.keywords.join('\n');
  });
  chrome.storage.local.get({ hiddenCount: 0 }, (stored) => {
    countEl.textContent = `Hidden on the active Amazon tab: ${stored.hiddenCount}`;
  });
}

enabledEl.addEventListener('change', () => {
  chrome.storage.sync.set({ enabled: enabledEl.checked });
});

saveBtn.addEventListener('click', () => {
  const keywords = keywordsEl.value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
  chrome.storage.sync.set({ keywords }, () => {
    saveBtn.textContent = 'Saved!';
    setTimeout(() => {
      saveBtn.textContent = 'Save';
    }, 1000);
  });
});

load();
