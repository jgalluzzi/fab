// Clear the badge as soon as a tab starts navigating, so a stale count
// from the previous page doesn't linger while the new page loads.
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'loading') {
    chrome.action.setBadgeText({ text: '', tabId });
  }
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message?.type !== 'HAB_COUNT' || sender.tab?.id == null) return;
  const text = message.count > 0 ? String(message.count) : '';
  chrome.action.setBadgeText({ text, tabId: sender.tab.id });
  chrome.action.setBadgeBackgroundColor({ color: '#FF9900', tabId: sender.tab.id });
});
