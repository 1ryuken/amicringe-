document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const usernameInput = document.getElementById('usernameInput');
  const roastBtn = document.getElementById('roastBtn');
  const loadingSpinner = document.getElementById('loadingSpinner');
  const inputSection = document.getElementById('inputSection');
  const resultSection = document.getElementById('resultSection');
  const roastComments = document.getElementById('roastComments');
  const copyBtn = document.getElementById('copyBtn');
  const newRoastBtn = document.getElementById('newRoastBtn');

  // API URL - Flask backend
  const API_URL = 'http://localhost:5000/api/analyze';

  // Hide loading spinner and results initially
  loadingSpinner.style.display = 'none';
  resultSection.style.display = 'none';

  // Handle roast button click
  roastBtn.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    
    if (!username) {
      alert('Please enter an Instagram username');
      return;
    }

     loadingSpinner.style.display = 'flex';
    roastBtn.disabled = true;

    try {
      // Call Flask API
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze profile');
      }

      const data = await response.json();
      
      // Display results
      displayResults(data);
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.message}`);
      loadingSpinner.style.display = 'none';
      roastBtn.disabled = false;
    }
  });

  // Display roast results
  function displayResults(data) {
    // Hide loading spinner and input section
    loadingSpinner.style.display = 'none';
    inputSection.style.display = 'none';
    
    // Clear previous results
    roastComments.innerHTML = '';
    
    // Add rizz score
    const scoreElement = document.createElement('div');
    scoreElement.className = 'rizz-score';
    scoreElement.innerHTML = `<h3>${data.rizz_score}</h3>`;
    roastComments.appendChild(scoreElement);
    
    // Add comments
    data.comments.forEach(comment => {
      const commentElement = document.createElement('div');
      commentElement.className = 'comment';
      commentElement.textContent = comment;
      roastComments.appendChild(commentElement);
    });
    
    // Show results section
    resultSection.style.display = 'block';
  }

  // Copy results to clipboard
  copyBtn.addEventListener('click', () => {
    const textToCopy = Array.from(roastComments.querySelectorAll('.comment'))
      .map(comment => comment.textContent)
      .join('\n\n');
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        alert('Results copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  });

  // Reset for new roast
  newRoastBtn.addEventListener('click', () => {
    resultSection.style.display = 'none';
    inputSection.style.display = 'block';
    usernameInput.value = '';
    roastBtn.disabled = false;
  });
});
