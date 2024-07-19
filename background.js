chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    patterns: [
      { keyword: 'k-(.*)', url: 'https://google.com/?q=$1' },
    ]
  });
});

chrome.omnibox.onInputEntered.addListener((text, disposition) => {
  chrome.storage.sync.get('patterns', (data) => {
    const patterns = data.patterns || [];
    const url = expandKeyword(text, patterns);
    navigateToUrl(url, disposition);
  });
});

function expandKeyword(text, patterns) {
  for (const pattern of patterns) {
    const regex = new RegExp(`^${pattern.keyword}$`);
    const match = text.match(regex);
    if (match) {
      let url = pattern.url;
      for (let i = 1; i < match.length; i++) {
        url = url.replace(`$${i}`, match[i]);
      }
      return url;
    }
  }
}

function navigateToUrl(url, disposition) {
  if (disposition === 'currentTab') {
    chrome.tabs.update({ url });
  } else if (disposition === 'newForegroundTab') {
    chrome.tabs.create({ url });
  } else if (disposition === 'newBackgroundTab') {
    chrome.tabs.create({ url, active: false });
  }
}
