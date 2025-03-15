document.addEventListener('DOMContentLoaded', function() {
  const pinDisplay = document.getElementById('pinDisplay');
  const keypadContainer = document.getElementById('keypadContainer');
  const clearBtn = document.getElementById('clearBtn');
  const submitBtn = document.getElementById('submitBtn');
  const errorDiv = document.getElementById('error');
  
  let currentPin = '';
  let keypadMapping = {}; // Maps displayed numbers to actual values
  let keyElements = []; // Store references to key elements
  
  // Generate a random keypad layout with floating keys
  function generateKeypad() {
    // Clear existing keypad
    keypadContainer.innerHTML = '';
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
      
      // Random initial position within container
      const left = Math.random() * (keypadContainer.offsetWidth - 60);
      const top = Math.random() * (keypadContainer.offsetHeight - 60);
      
      key.style.left = `${left}px`;
      key.style.top = `${top}px`;
      
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
      
      keypadContainer.appendChild(key);
      keyElements.push({
        element: key,
        // Random velocity for floating effect
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        // Random rotation
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 4
      });
    });
    
    // Start the animation
    if (!animationRunning) {
      animationRunning = true;
      animateKeys();
    }
  }
  
  let animationRunning = false;
  
  // Animate the keys to float around
  function animateKeys() {
    const containerWidth = keypadContainer.offsetWidth;
    const containerHeight = keypadContainer.offsetHeight;
    
    keyElements.forEach(item => {
      // Get current position
      const rect = item.element.getBoundingClientRect();
      const containerRect = keypadContainer.getBoundingClientRect();
      
      let left = parseFloat(item.element.style.left) || 0;
      let top = parseFloat(item.element.style.top) || 0;
      
      // Update position based on velocity
      left += item.vx;
      top += item.vy;
      
      // Bounce off walls
      if (left <= 0 || left >= containerWidth - rect.width) {
        item.vx *= -1;
        // Add some randomness to the bounce
        item.vx += (Math.random() - 0.5) * 0.5;
      }
      
      if (top <= 0 || top >= containerHeight - rect.height) {
        item.vy *= -1;
        // Add some randomness to the bounce
        item.vy += (Math.random() - 0.5) * 0.5;
      }
      
      // Update rotation
      item.rotation += item.rotationSpeed;
      
      // Apply new position and rotation
      item.element.style.left = `${left}px`;
      item.element.style.top = `${top}px`;
      item.element.style.transform = `rotate(${item.rotation}deg)`;
    });
    
    // Continue animation
    requestAnimationFrame(animateKeys);
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
}); 