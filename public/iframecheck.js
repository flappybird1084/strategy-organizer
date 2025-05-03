if (window.top === window.self) {
    // Not in an iframe
    window.location.href = '/'; // Redirect to main page
  }