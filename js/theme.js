/*
 * Theme Toggle
 * Handles dark/light theme toggling and persistence
 */

// Initialize theme toggle
function initThemeToggle() {
    const themeSwitch = document.getElementById('theme-switch');
    const body = document.body;
    
    if (!themeSwitch) {
      console.warn('Theme switch element not found');
      return;
    }
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    // If a preference exists, apply it
    if (savedTheme === 'dark') {
      body.classList.add('dark-theme');
      themeSwitch.checked = true;
    }
    
    // Apply theme based on system preference if no saved preference
    if (!savedTheme) {
      const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
      
      if (prefersDarkScheme.matches) {
        body.classList.add('dark-theme');
        themeSwitch.checked = true;
      }
    }
    
    // Toggle theme when switch is clicked
    themeSwitch.addEventListener('change', function() {
      if (this.checked) {
        // Switch to dark theme
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        
        // If GSAP is available, animate the transition
        if (typeof gsap !== 'undefined') {
          animateThemeTransition(true);
        }
      } else {
        // Switch to light theme
        body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
        
        // If GSAP is available, animate the transition
        if (typeof gsap !== 'undefined') {
          animateThemeTransition(false);
        }
      }
    });
    
    // Set initial theme attributes for HTML element
    updateMetaThemeColor();
  }
  
  // Animate theme transition
  function animateThemeTransition(isDark) {
    // Create transition overlay
    const overlay = document.createElement('div');
    overlay.className = 'theme-transition-overlay';
    
    // Style the overlay
    Object.assign(overlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: isDark ? '#0F1215' : '#FFFFFF',
      pointerEvents: 'none',
      zIndex: '9000',
      opacity: '0'
    });
    
    // Add overlay to body
    document.body.appendChild(overlay);
    
    // Animate overlay
    gsap.to(overlay, {
      opacity: 1,
      duration: 0.3,
      onComplete: () => {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.5,
          delay: 0.1,
          onComplete: () => {
            // Remove overlay after animation
            overlay.remove();
          }
        });
      }
    });
  }
  
  // Update meta theme-color for browser UI
  function updateMetaThemeColor() {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const isDarkTheme = document.body.classList.contains('dark-theme');
    
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    
    metaThemeColor.content = isDarkTheme ? '#0F1215' : '#FFFFFF';
  }
  
  // Listen for system theme changes
  function listenForSystemThemeChanges() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    prefersDarkScheme.addEventListener('change', (event) => {
      // Only update if user hasn't set a preference
      if (!localStorage.getItem('theme')) {
        const themeSwitch = document.getElementById('theme-switch');
        
        if (event.matches) {
          document.body.classList.add('dark-theme');
          if (themeSwitch) themeSwitch.checked = true;
        } else {
          document.body.classList.remove('dark-theme');
          if (themeSwitch) themeSwitch.checked = false;
        }
        
        updateMetaThemeColor();
      }
    });
  }
  
  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    listenForSystemThemeChanges();
  });
  
  // Export functions to global scope
  window.themeUtils = {
    toggleTheme: () => {
      const themeSwitch = document.getElementById('theme-switch');
      if (themeSwitch) {
        themeSwitch.checked = !themeSwitch.checked;
        themeSwitch.dispatchEvent(new Event('change'));
      }
    },
    isDarkTheme: () => {
      return document.body.classList.contains('dark-theme');
    }
  };