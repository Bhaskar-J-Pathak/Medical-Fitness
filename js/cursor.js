/*
 * Custom Cursor
 * Implementation of custom cursor for the physiotherapy website
 */

// Initialize custom cursor
function initCursor() {
    // Check if we're on a device with a mouse pointer
    if (!window.matchMedia('(pointer: fine)').matches) {
      return;
    }
    
    // Get cursor elements
    const cursor = document.querySelector('.cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (!cursor || !cursorDot || !cursorOutline) {
      console.warn('Custom cursor elements not found');
      return;
    }
    
    // Hide the default cursor
    document.documentElement.style.cursor = 'none';
    document.body.style.cursor = 'none';
    
    // Set initial position off-screen
    let posX = -100;
    let posY = -100;
    let mouseX = -100;
    let mouseY = -100;
    
    // Animation speed/smoothness
    const speed = 0.1;
    
    // Track cursor position
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    // Animation loop for smooth cursor movement
    function updateCursor() {
      // Calculate smooth movement with easing
      posX += (mouseX - posX) * speed;
      posY += (mouseY - posY) * speed;
      
      // Apply position
      gsap.set(cursor, {
        left: posX,
        top: posY
      });
      
      // Continue animation loop
      requestAnimationFrame(updateCursor);
    }
    
    // Start animation loop
    updateCursor();
    
    // Handle cursor states for different elements
    handleCursorStates();
  }
  
  // Handle different cursor states based on hovered elements
  function handleCursorStates() {
    const cursor = document.querySelector('.cursor');
    if (!cursor) return;
    
    // Elements that should change cursor state
    const interactiveElements = document.querySelectorAll(
      'a, button, input, textarea, select, [role="button"], .btn, .service-card, .work-item, .pricing-card, .social-link, .nav-link, .mobile-nav-link, .footer-nav-list a, .testimonial-navigation button'
    );
    
    // Elements that should show active cursor state
    const clickableElements = document.querySelectorAll(
      'a, button, [role="button"], .btn'
    );
    
    // Large elements that should expand cursor
    const largeElements = document.querySelectorAll(
      '.hero-title, .section-title, h1, h2, .service-card, .pricing-card, .work-item'
    );
    
    // Add cursor states for all interactive elements
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
      });
      
      element.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
      });
    });
    
    // Add active state for clickable elements
    clickableElements.forEach(element => {
      element.addEventListener('mousedown', () => {
        cursor.classList.add('active');
      });
      
      element.addEventListener('mouseup', () => {
        cursor.classList.remove('active');
      });
      
      // When leaving the element while pressed, remove active state
      element.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
      });
    });
    
    // Add special state for large elements
    largeElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        cursor.classList.add('large');
      });
      
      element.addEventListener('mouseleave', () => {
        cursor.classList.remove('large');
      });
    });
    
    // Add text state for text-heavy elements
    const textElements = document.querySelectorAll('p, .testimonial-quote, .about-paragraph');
    textElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        cursor.classList.add('text');
      });
      
      element.addEventListener('mouseleave', () => {
        cursor.classList.remove('text');
      });
    });
    
    // Add a special state for custom cursor elements
    const cursorSpecialElements = document.querySelectorAll('[data-cursor]');
    cursorSpecialElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        const cursorType = element.dataset.cursor;
        cursor.classList.add(`cursor-${cursorType}`);
      });
      
      element.addEventListener('mouseleave', () => {
        const cursorType = element.dataset.cursor;
        cursor.classList.remove(`cursor-${cursorType}`);
      });
    });
    
    // Handle cursor state on page leave
    document.addEventListener('mouseleave', () => {
      cursor.classList.add('hidden');
    });
    
    document.addEventListener('mouseenter', () => {
      cursor.classList.remove('hidden');
    });
    
    // Handle cursor state while scrolling
    let isScrolling;
    window.addEventListener('scroll', () => {
      cursor.classList.add('scrolling');
      
      // Clear the timeout each time the scroll event fires
      clearTimeout(isScrolling);
      
      // Set a timeout to remove the class after scrolling stops
      isScrolling = setTimeout(() => {
        cursor.classList.remove('scrolling');
      }, 100);
    });
    
    // Handle cursor visibility when using browser UI
    document.addEventListener('mousedown', (e) => {
      // Check if the click target is the document but not any element
      if (e.target === document.documentElement) {
        cursor.classList.add('hidden');
      }
    });
    
    document.addEventListener('mouseup', () => {
      cursor.classList.remove('hidden');
    });
    
    // Add cursor effect for images with zoom capability
    const zoomableImages = document.querySelectorAll('.work-image, .about-image');
    zoomableImages.forEach(image => {
      image.addEventListener('mouseenter', () => {
        cursor.classList.add('zoom');
      });
      
      image.addEventListener('mouseleave', () => {
        cursor.classList.remove('zoom');
      });
    });
  }
  
  // Apply magnetic effect to buttons
  function initMagneticButtons() {
    const magneticElements = document.querySelectorAll('.btn, .service-card, .pricing-card');
    
    magneticElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Adjust the movement strength
        const strength = 0.1;
        
        gsap.to(element, {
          x: x * strength,
          y: y * strength,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      element.addEventListener('mouseleave', () => {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)'
        });
      });
    });
  }
  
  // Initialize cursor magnetism for specific SVG elements
  function initSvgMagnetism() {
    const svgElements = document.querySelectorAll('.social-icon svg, .expertise-icon svg');
    
    svgElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(element, {
          x: x * 0.3,
          y: y * 0.3,
          rotation: x * 0.05,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      element.addEventListener('mouseleave', () => {
        gsap.to(element, {
          x: 0,
          y: 0,
          rotation: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)'
        });
      });
    });
  }
  
  // Export functions
  window.cursorEffects = {
    initCursor,
    initMagneticButtons,
    initSvgMagnetism
  };