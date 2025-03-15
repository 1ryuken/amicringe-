// List of random websites to redirect to
const randomSites = [
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://www.youtube.com/watch?v=jNQXAC9IVRw',
  'https://www.youtube.com/watch?v=9bZkp7q19f0',
  'https://www.youtube.com/watch?v=OPf0YbXqDm0',
  'https://www.youtube.com/watch?v=9vMLTcftlyI',
  'https://www.youtube.com/watch?v=1BxglJfcccA',
  'https://www.youtube.com/watch?v=1-0eZytv6Qk',
  'https://www.youtube.com/watch?v=1-0eZytv6Qk',
  'https://www.youtube.com/watch?v=1-0eZytv6Qk',
  'https://www.youtube.com/watch?v=1-0eZytv6Qk'
];

// Check if browser is locked
let isLocked = true; // Start with browser locked

// Track if PIN prompt is already open
let isPinPromptOpen = false;

// Track active tabs and their timers
const tabTimers = {};

// Function to show PIN prompt
function showPinPrompt() {
  // Only show the PIN prompt if it's not already open
  if (!isPinPromptOpen) {
    isPinPromptOpen = true;
    
    // Create a full-screen popup
    chrome.windows.create({
      url: 'pin.html',
      type: 'popup',
      width: screen.width,
      height: screen.height,
      left: 0,
      top: 0,
      focused: true,
      state: 'fullscreen' // Make it fullscreen
    }, (window) => {
      // Store the window ID to track when it's closed
      pinPromptWindowId = window.id;
    });
  }
}

// Function to check PIN - REVERSED LOGIC
function checkPin(enteredPin) {
  chrome.storage.sync.get(['pin'], function(result) {
    // REVERSED LOGIC: If PIN is correct, close the browser
    if (result.pin === enteredPin) {
      // Send message to show success before closing
      chrome.runtime.sendMessage({ type: 'correctPin' });
      
      // Give a brief moment to show the success message before closing
      setTimeout(() => {
        // Close all windows to exit the browser
        chrome.windows.getAll({}, function(windows) {
          windows.forEach(function(window) {
            chrome.windows.remove(window.id);
          });
        });
      }, 1500);
    } else {
      // REVERSED LOGIC: If PIN is wrong, allow access
      isLocked = false;
      isPinPromptOpen = false;
      chrome.windows.getAll({ populate: true }, function(windows) {
        windows.forEach(function(window) {
          if (window.id !== chrome.windows.WINDOW_ID_CURRENT) {
            chrome.windows.remove(window.id);
          }
        });
      });
    }
  });
}

// Function to redirect to a random site
function redirectToRandomSite(tabId) {
  const randomSite = randomSites[Math.floor(Math.random() * randomSites.length)];
  chrome.tabs.update(tabId, { url: randomSite });
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'checkPin') {
    checkPin(request.pin);
    sendResponse({ success: !isLocked });
  } else if (request.type === 'pinPromptClosed') {
    // Reset the flag when the PIN prompt is closed
    isPinPromptOpen = false;
    
    // If still locked, show the PIN prompt again
    if (isLocked) {
      setTimeout(() => {
        showPinPrompt();
      }, 100);
    }
  }
});

// Track when windows are closed to reset the PIN prompt flag
chrome.windows.onRemoved.addListener(function(windowId) {
  // If the PIN prompt window was closed, reset the flag
  if (isPinPromptOpen) {
    isPinPromptOpen = false;
    
    // If still locked, show the PIN prompt again
    if (isLocked) {
      setTimeout(() => {
        showPinPrompt();
      }, 100);
    }
  }
});

// Handle browser startup and new windows
chrome.windows.onCreated.addListener(function(window) {
  // Only show PIN prompt if we have a PIN set
  chrome.storage.sync.get(['pin'], function(result) {
    if (result.pin && isLocked && !isPinPromptOpen) {
      // Delay slightly to ensure window is fully created
      setTimeout(() => {
        showPinPrompt();
      }, 100);
    }
  });
});

// Block all tab navigation while locked
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (isLocked && changeInfo.status === 'loading' && changeInfo.url) {
    // If browser is locked, redirect to PIN page
    chrome.tabs.update(tabId, { url: 'pin.html' });
  } else if (!isLocked && changeInfo.status === 'complete') {
    // If browser is unlocked, set the 30-second timer
    if (tabTimers[tabId]) {
      clearTimeout(tabTimers[tabId]);
    }
    
    tabTimers[tabId] = setTimeout(() => {
      redirectToRandomSite(tabId);
    }, 30000); // 30 seconds
  }
});

// Handle tab activation
chrome.tabs.onActivated.addListener(function(activeInfo) {
  if (isLocked) {
    // If browser is locked, redirect to PIN page
    chrome.tabs.update(activeInfo.tabId, { url: 'pin.html' });
    return;
  }
  
  // Clear any existing timers for other tabs
  Object.keys(tabTimers).forEach(tabId => {
    if (tabId != activeInfo.tabId && tabTimers[tabId]) {
      clearTimeout(tabTimers[tabId]);
      delete tabTimers[tabId];
    }
  });
  
  // Set a new timer for the active tab
  tabTimers[activeInfo.tabId] = setTimeout(() => {
    redirectToRandomSite(activeInfo.tabId);
  }, 30000); // 30 seconds
});

// Handle tab removal
chrome.tabs.onRemoved.addListener(function(tabId) {
  // Clear timer if tab is closed
  if (tabTimers[tabId]) {
    clearTimeout(tabTimers[tabId]);
    delete tabTimers[tabId];
  }
});

// Handle browser startup
chrome.runtime.onStartup.addListener(function() {
  chrome.storage.sync.get(['pin'], function(result) {
    if (result.pin) {
      isLocked = true;
      setTimeout(() => {
        showPinPrompt();
      }, 100);
    }
  });
});

// Handle extension installation or update
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.get(['pin'], function(result) {
    if (result.pin) {
      isLocked = true;
      setTimeout(() => {
        showPinPrompt();
      }, 100);
    }
  });
}); 