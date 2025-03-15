document.addEventListener('DOMContentLoaded', function() {
  const pinDisplay = document.getElementById('pinDisplay');
  const keypad = document.getElementById('keypad');
  const clearBtn = document.getElementById('clearBtn');
  const submitBtn = document.getElementById('submitBtn');
  const errorDiv = document.getElementById('error');
  
  let currentPin = '';
  let keypadMapping = {}; // Maps displayed numbers to actual values
  let keyElements = []; // Store references to key elements
  
  // Generate a random keypad layout with vibrating keys
  function generateKeypad() {
    // Clear existing keypad
    keypad.innerHTML = '';
    keyElements = [];
    
    // Create a shuffled array of numbers 0-9
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const shuffled = [...numbers].sort(() => Math.random() - 0.5);
    
    // Reset mapping
    keypadMapping = {};
    
    // Create buttons with shuffled numbers
    shuffled.forEach((num, index) => {
      const key = document.createElement('div');
      key.className = 'key';
      key.textContent = num;
      
      // Map the displayed number to its actual value
      keypadMapping[num] = num;
      
      key.addEventListener('click', () => {
        if (currentPin.length < 4) {
          // Add the actual value to the PIN
          currentPin += keypadMapping[num];
          updatePinDisplay();
          
          // Regenerate keypad after each press
          generateKeypad();
        }
      });
      
      keypad.appendChild(key);
      
      // Store reference for vibration animation
      keyElements.push({
        element: key,
        // Random vibration parameters
        xAmplitude: Math.random() * 5 + 2,
        yAmplitude: Math.random() * 5 + 2,
        xFrequency: Math.random() * 0.05 + 0.02,
        yFrequency: Math.random() * 0.05 + 0.02,
        xPhase: Math.random() * Math.PI * 2,
        yPhase: Math.random() * Math.PI * 2
      });
    });
    
    // Start the vibration animation
    if (!animationRunning) {
      animationRunning = true;
      animateVibration();
    }
  }
  
  let animationRunning = false;
  let startTime = Date.now();
  
  // Animate the keys with vibration effect
  function animateVibration() {
    const elapsed = Date.now() - startTime;
    
    keyElements.forEach(item => {
      // Calculate vibration offset based on sine waves
      const xOffset = item.xAmplitude * Math.sin(elapsed * item.xFrequency + item.xPhase);
      const yOffset = item.yAmplitude * Math.sin(elapsed * item.yFrequency + item.yPhase);
      
      // Apply vibration transform
      item.element.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });
    
    // Continue animation
    requestAnimationFrame(animateVibration);
  }
  
  // Update the PIN display with asterisks
  function updatePinDisplay() {
    pinDisplay.textContent = '*'.repeat(currentPin.length);
    
    // Auto-submit if PIN is complete
    if (currentPin.length === 4) {
      setTimeout(() => {
        submitBtn.click();
      }, 500);
    }
  }
  
  // Clear the PIN
  clearBtn.addEventListener('click', function() {
    currentPin = '';
    updatePinDisplay();
    errorDiv.style.display = 'none';
  });
  
  // Submit the PIN
  submitBtn.addEventListener('click', function() {
    if (currentPin.length === 4) {
      chrome.runtime.sendMessage({ type: 'checkPin', pin: currentPin }, function(response) {
        if (response && response.success) {
          window.close();
        } else {
          errorDiv.style.display = 'block';
          currentPin = '';
          updatePinDisplay();
          generateKeypad(); // Regenerate keypad on failure
        }
      });
    } else {
      errorDiv.textContent = 'Please enter a 4-digit PIN';
      errorDiv.style.display = 'block';
    }
  });
  
  // Handle window close event
  window.addEventListener('beforeunload', function() {
    // Notify background script that the PIN prompt is closed
    chrome.runtime.sendMessage({ type: 'pinPromptClosed' });
  });
  
  // Initialize
  generateKeypad();
  startTime = Date.now();
}); 