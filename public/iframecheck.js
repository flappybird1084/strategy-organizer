// This just checks if the script is running in an iframe, that's it, this is for use with loader.js
if (window.top === window.self) {
    // Not in an iframe
    window.location.href = '/'; // Redirect to main page
  }