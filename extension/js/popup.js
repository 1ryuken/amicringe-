document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const pinSection = document.getElementById('pinSection');
  const pinInput = document.getElementById('pinInput');
  const setPinBtn = document.getElementById('setPinBtn');
  const usernameInput = document.getElementById('usernameInput');
  const roastBtn = document.getElementById('roastBtn');
  const resultSection = document.getElementById('resultSection');
  const roastComments = document.getElementById('roastComments');
  const closeResult = document.getElementById('closeResult');

  // Load saved settings
  chrome.storage.sync.get(['pin'], function(result) {
    // Hide PIN section if PIN is already set
    if (result.pin) {
      pinSection.style.display = 'none';
    }
  });

  // Set PIN
  setPinBtn.addEventListener('click', function() {
    const pin = pinInput.value;
    if (pin.length === 4 && /^\d+$/.test(pin)) {
      chrome.storage.sync.set({ pin: pin }, function() {
        alert('PIN set successfully!');
        // Hide PIN section after setting
        pinSection.style.display = 'none';
      });
    } else {
      alert('Please enter a valid 4-digit PIN');
    }
  });

  // Get Roasted
  roastBtn.addEventListener('click', async function() {
    const username = usernameInput.value.trim();
    if (!username) {
      alert('Please enter an Instagram username');
      return;
    }

    roastBtn.disabled = true;
    roastBtn.textContent = 'Analyzing...';

    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Display results
      roastComments.innerHTML = data.comments.map(comment => `<p>${comment}</p>`).join('');
      resultSection.style.display = 'block';
      document.getElementById('roastSection').style.display = 'none';
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      roastBtn.disabled = false;
      roastBtn.textContent = 'Get Roasted';
    }
  });

  // Close results
  closeResult.addEventListener('click', function() {
    resultSection.style.display = 'none';
    document.getElementById('roastSection').style.display = 'block';
  });
}); 