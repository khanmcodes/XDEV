// Get the toggle element
const toggle = document.getElementById('inspectorToggle');

// Load saved state
chrome.storage.sync.get(['inspectorEnabled'], (result) => {
  toggle.checked = result.inspectorEnabled !== false; // Default to true if not set
});

// Handle toggle changes
toggle.addEventListener('change', (e) => {
  const isEnabled = e.target.checked;
  
  // Save state
  chrome.storage.sync.set({ inspectorEnabled: isEnabled });
  
  // Send message to content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleInspector', isEnabled });
  });
});