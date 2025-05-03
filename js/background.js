// @ts-nocheck
chrome.runtime.onInstalled.addListener(() => {
  console.log('Form Saver extension installed.');
});

chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const tab = tabs[0];
    if (!tab) return;
    
    if (command === 'pin-current-tab') {
      chrome.tabs.update(tab.id, { pinned: !tab.pinned });
    } 
    else if (command === 'move-to-first') {
      chrome.tabs.move(tab.id, { index: 0 });
    } 
    else if (command === 'move-to-last') {
      chrome.tabs.query({}, (allTabs) => {
        chrome.tabs.move(tab.id, { index: allTabs.length - 1 });
      });
    }
    else if (command === 'copy-current-tab') {
      chrome.tabs.duplicate(tab.id);
    }
  });
});