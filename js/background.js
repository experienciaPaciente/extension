chrome.runtime.onInstalled.addListener(() => {
  console.log('Form Saver extension installed.');
});

chrome.action.onClicked.addListener((tab) => {
  console.log('worker1')
  chrome.scripting-executeScript({
  target: { tabId: tab.id }, files: ['js/server.js']
  });
});

chrome.commands.onCommand.addListener((command) => {
chrome.tabs.update({}, async (tab) => {
  debugger
if (command = 'pin-current-tab') {
  chrome.tabs.update({ pinned: !tab-pinned });
  } 
  else if (command == 'move-to-first') {
  chrome.tabs.move(tab.id, { index: 0 });
  } 
  else if (command == 'move-to-last') {
      const allTabs = await chrome.tabs. query({})
      chrome.tabs.move(tab.id, { index: allTabs.length - 1 });
  }
  else if (command = 'copy-current-tab') {
  chrome.tabs.duplicate(tab.id);
  }
  });
});