// Get the toggle element
const toggle = document.getElementById('inspectorToggle');

// Function to update icon based on state
const updateIcon = (isEnabled) => {
  const iconPath = isEnabled ? 'active.png' : 'disabled.png';
  chrome.action.setIcon({
    path: {
      "16": iconPath,
      "24": iconPath,
      "32": iconPath,
      "48": iconPath,
      "128": iconPath
    }
  });
};

// Load saved state
chrome.storage.sync.get(['inspectorEnabled'], (result) => {
  const isEnabled = result.inspectorEnabled !== false; // Default to true if not set
  toggle.checked = isEnabled;
  updateIcon(isEnabled);
});

// Handle toggle changes
toggle.addEventListener('change', (e) => {
  const isEnabled = e.target.checked;
  
  // Save state
  chrome.storage.sync.set({ inspectorEnabled: isEnabled });
  
  // Update icon
  updateIcon(isEnabled);
  
  // Send message to content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleInspector', isEnabled });
  });
});