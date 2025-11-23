console.log('Ghost Extension Background Script loaded');

chrome.runtime.onInstalled.addListener(() => {
  console.log('Ghost Extension installed successfully!');
  
  chrome.storage.sync.set({
    ghostEnabled: true,
    ghostLevel: 'medium',
    installationDate: new Date().toISOString()
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);
  
  if (request.action === 'getTabInfo') {
    sendResponse({
      tabId: sender.tab.id,
      url: sender.tab.url
    });
  }
  
  return true;
});