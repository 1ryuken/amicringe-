document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const inputSection = document.getElementById('inputSection');
  const resultSection = document.getElementById('resultSection');
  const usernameInput = document.getElementById('usernameInput');
  const roastBtn = document.getElementById('roastBtn');
  const loadingSpinner = document.getElementById('loadingSpinner');
  const roastComments = document.getElementById('roastComments');
  const copyBtn = document.getElementById('copyBtn');
  const newRoastBtn = document.getElementById('newRoastBtn');

  // Roast templates
  const roastTemplates = [
    "Looking at {username}'s profile is like watching a car crash in slow motion - I can't look away, but I'm horrified by what I'm seeing.",
    "{username} is the human equivalent of a participation trophy. Not terrible enough to throw away, but nothing worth celebrating either.",
    "I've seen more personality in a blank piece of paper than in {username}'s entire Instagram feed.",
    "{username}'s selfies look like they're trying to escape from the screen out of pure embarrassment.",
    "If basic was a person, it would be offended that we're comparing it to {username}.",
    "{username} is proof that you can have a phone with a 48MP camera and still take photos that look like they were shot with a potato.",
    "I've never seen someone try so hard to look like they're not trying at all as {username} does.",
    "{username}'s bio says 'living my best life' but their content screams 'desperately seeking validation'.",
    "If {username} was a spice, they'd be flour. If they were a book, they'd be the phone book.",
    "I'm not saying {username} is boring, but their Instagram could be used as a cure for insomnia.",
    "{username} has mastered the art of taking 47 photos of the exact same pose with microscopic differences.",
    "The most interesting thing about {username}'s profile is that they somehow have followers.",
    "{username}'s aesthetic can best be described as 'copied from everyone else but somehow still worse'.",
    "I've seen more authentic connections between strangers on a bus than {username} has with their own personality.",
    "{username} is the type to post a 'candid' photo that took 3 hours and 157 attempts to get right.",
    "If {username} was any more basic, they'd have a pH of 14.",
    "Looking at {username}'s feed is like watching someone have a very public identity crisis.",
    "{username} is living proof that you can have access to all of the world's information and still have nothing interesting to say.",
    "I'm not saying {username}'s content is forgettable, but I forgot what I was looking at while I was still looking at it.",
    "The most genuine thing about {username}'s profile is the desperation seeping through every carefully edited pixel."
  ];

  // Adjectives for generating roasts
  const negativeAdjectives = [
    "basic", "cringey", "desperate", "unoriginal", "bland", "narcissistic", 
    "try-hard", "forgettable", "generic", "predictable", "awkward", "embarrassing",
    "mediocre", "uninspired", "derivative", "artificial", "contrived", "insecure",
    "pretentious", "superficial", "vapid", "forced", "inauthentic", "attention-seeking"
  ];

  // Generate a random roast
  function generateRoast(username) {
    const roasts = [];
    
    // Add 3-5 template roasts
    const shuffledTemplates = [...roastTemplates].sort(() => Math.random() - 0.5);
    const numTemplateRoasts = Math.floor(Math.random() * 3) + 3; // 3-5 roasts
    
    for (let i = 0; i < numTemplateRoasts; i++) {
      if (i < shuffledTemplates.length) {
        roasts.push(shuffledTemplates[i].replace(/{username}/g, username));
      }
    }
    
    // Add 1-2 custom generated roasts
    const numCustomRoasts = Math.floor(Math.random() * 2) + 1; // 1-2 roasts
    
    for (let i = 0; i < numCustomRoasts; i++) {
      const adj1 = negativeAdjectives[Math.floor(Math.random() * negativeAdjectives.length)];
      const adj2 = negativeAdjectives[Math.floor(Math.random() * negativeAdjectives.length)];
      
      // Ensure we don't use the same adjective twice
      if (adj1 === adj2) {
        i--;
        continue;
      }
      
      const customRoasts = [
        `${username}'s profile is so ${adj1} and ${adj2} that it should be studied in psychology classes as a cry for help.`,
        `I've never seen someone so ${adj1} yet so ${adj2} at the same time until I saw ${username}'s Instagram.`,
        `${username} manages to be both ${adj1} and ${adj2} in every single post. It's actually impressive in a sad way.`,
        `If ${adj1} and ${adj2} had a baby, it would be ${username}'s social media presence.`
      ];
      
      roasts.push(customRoasts[Math.floor(Math.random() * customRoasts.length)]);
    }
    
    return roasts;
  }

  // Get Roasted button click
  roastBtn.addEventListener('click', function() {
    const username = usernameInput.value.trim();
    if (!username) {
      alert('Please enter an Instagram username');
      return;
    }

    // Show loading spinner
    loadingSpinner.style.display = 'block';
    roastBtn.disabled = true;

    // Simulate API call with timeout
    setTimeout(() => {
      const roasts = generateRoast(username);
      
      // Display results
      roastComments.innerHTML = roasts.map(roast => `<p>${roast}</p>`).join('');
      
      // Hide loading spinner
      loadingSpinner.style.display = 'none';
      roastBtn.disabled = false;
      
      // Show results section, hide input section
      inputSection.style.display = 'none';
      resultSection.style.display = 'block';
    }, 2000); // 2 second delay to simulate processing
  });

  // Copy results button
  copyBtn.addEventListener('click', function() {
    const roastText = Array.from(roastComments.querySelectorAll('p'))
      .map(p => p.textContent)
      .join('\n\n');
    
    navigator.clipboard.writeText(roastText).then(() => {
      // Change button text temporarily
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
      
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
      }, 2000);
    });
  });

  // New roast button
  newRoastBtn.addEventListener('click', function() {
    // Clear input and results
    usernameInput.value = '';
    roastComments.innerHTML = '';
    
    // Show input section, hide results section
    resultSection.style.display = 'none';
    inputSection.style.display = 'block';
  });

  // Enter key in input field
  usernameInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      roastBtn.click();
    }
  });
}); 