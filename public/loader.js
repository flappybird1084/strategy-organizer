// This file is used to trigger the page transition (swipe up)
// It is portable across all pages

const messages = [
    'Stealing data from TAB & Statbotics...',
    'Getting ready to roll...',
    'Aligning swerve modules...',
    'Making PIDs...',
    'Making SRC (Second Robotics Competition)...',
    'Burning Spark MAX...'
];

// Function to trigger the page transition
function triggerPageTransition(targetUrl) {
    let blocker = document.getElementById('ui-blocker'); // UI blocker is active during the transition to prevent clicking on the moving content
    if (!blocker) {
      blocker = document.createElement('div');
      blocker.id = 'ui-blocker';
      blocker.style.position = 'fixed';
      blocker.style.top = 0;
      blocker.style.left = 0;
      blocker.style.width = '100%';
      blocker.style.height = '100%';
      blocker.style.zIndex = 9999;
      blocker.style.background = 'transparent';
      blocker.style.pointerEvents = 'all';
    }
    document.body.appendChild(blocker);

    // This is the box that contains the messages above
    const loadingBox = document.getElementById('loading-box');
    loadingBox.style.display = 'flex';
    loadingBox.textContent = '';
    const span = document.createElement('span');
    span.className = 'blinking';
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]; // Random pick
    span.textContent = randomMessage;
    loadingBox.appendChild(span);
  
    const iframe = document.getElementById('preload-frame'); // Frame that contains the new/target page
    iframe.src = '';
    iframe.style.display = 'block';
    iframe.style.top = '100%';
    loadingBox.style.transform = 'translateY(0)';
    document.body.style.overflow = 'hidden';
    iframe.src = targetUrl;
  
    iframe.onload = () => { // When the ui loads, we remove the blocker and reset the iframe, and finish the animation
      iframe.style.top = '0';
      const blocker = document.getElementById('ui-blocker');
      if (blocker) blocker.remove();
    };
  }
  
  // Reverse animation when the back button is clicked
  window.addEventListener('message', (event) => {
    if (event.data?.type === 'reverse-animation') {
      const iframe = document.getElementById('preload-frame');
      iframe.style.top = '100%';
      setTimeout(() => {
        document.getElementById('loading-box').style.transform = 'translateY(100%)';
      }, 100);
  
      setTimeout(() => {
        document.getElementById('loading-box').style.display = 'none';
        document.getElementById('loading-box').style.transform = 'translateY(0)';
        iframe.src = '';
        iframe.style.display = 'none';
        document.body.style.overflow = '';
        const blocker = document.getElementById('ui-blocker');
        if (blocker) blocker.remove();
      }, 900);
    }
  });