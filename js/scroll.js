/*
 * Smooth Scrolling
 * Implementation of smooth scrolling using Lenis for the physiotherapy website
 */

let lenis; // Global lenis instance

// Initialize Lenis for smooth scrolling
function initLenisScroll() {
  if (typeof Lenis === 'undefined') {
    console.warn('Lenis library not loaded');
    return;
  }
  
  // Initialize Lenis instance
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });
  
  // Connect lenis to ScrollTrigger for animations
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
  } else {
    // If GSAP is not available, use requestAnimationFrame
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);
  }
  
  // Setup scroll tracking and anchor links
  setupScrollTracking();
  setupAnchorLinks();
}

// Track scroll progress and update navigation
function setupScrollTracking() {
  // Create progress bar
  const progressBar = document.createElement('div');
  progressBar.classList.add('progress-bar');
  document.body.appendChild(progressBar);
  
  // Update active nav link based on section visibility
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');
  
  // Check which section is in view
  function updateActiveLink() {
    const scrollPosition = window.scrollY + 100; // Offset to trigger slightly earlier
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove('active'));
        mobileNavLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to current section links
        document.querySelectorAll(`.nav-link[href="#${sectionId}"], .mobile-nav-link[href="#${sectionId}"]`)
          .forEach(link => link.classList.add('active'));
      }
    });
    
    // Update scroll progress
    const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = `${scrollPercentage}%`;
  }
  
  // Listen for scroll events to update active link
  window.addEventListener('scroll', updateActiveLink);
  
  // Check on initial load
  updateActiveLink();
}

// Setup smooth scrolling for anchor links
function setupAnchorLinks() {
  const scrollLinks = document.querySelectorAll('a[href^="#"]:not([href="#"]), [data-scroll-to]');
  
  scrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get target element ID - either from href or data-scroll-to attribute
      const targetId = this.getAttribute('href') || `#${this.dataset.scrollTo}`;
      
      // Log for debugging
      console.log('Navigation click:', targetId);
      
      // Scroll to the target smoothly
      if (targetId) {
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Get offset due to fixed header
          const header = document.querySelector('.site-header');
          const headerOffset = header ? header.offsetHeight : 0;
          
          // If lenis is available, use it
          if (lenis) {
            console.log('Scrolling with Lenis to:', targetId);
            lenis.scrollTo(targetElement, { 
              offset: -headerOffset - 20,
              duration: 1.5,
              immediate: false
            });
          } else {
            // Fallback to native scrolling
            console.log('Fallback scrolling to:', targetId);
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        } else {
          console.warn('Target element not found:', targetId);
        }
      }
    });
  });
  
  // Log the number of links found
  console.log('Scroll links initialized:', scrollLinks.length);
}

// Override default link click behavior
document.addEventListener('click', (e) => {
  // Find the closest anchor tag
  const link = e.target.closest('a');
  
  if (link && link.getAttribute('href').startsWith('#') && link.getAttribute('href') !== '#') {
    e.preventDefault();
    
    const targetId = link.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement && lenis) {
      // Get offset due to fixed header
      const header = document.querySelector('.site-header');
      const headerOffset = header ? header.offsetHeight : 0;
      
      // Scroll to element with offset
      lenis.scrollTo(targetElement, { 
        offset: -headerOffset - 20,
        duration: 1.5 
      });
    }
  }
});

// Handle section overlapping effect
function setupSectionOverlap() {
  // This will be initialized by GSAP in animations.js
  // But we can use this function to setup additional effects
  
  // Get all overlapping sections
  const overlappingSections = document.querySelectorAll(
    '.about-section, .services-section, .work-section, .pricing-section, .testimonials-section, .contact-section'
  );
  
  // Set initial z-index based on their order
  overlappingSections.forEach((section, index) => {
    section.style.zIndex = overlappingSections.length - index;
  });
}

// Stop and start lenis scrolling
function toggleScrolling(enable) {
  if (!lenis) return;
  
  if (enable) {
    lenis.start();
  } else {
    lenis.stop();
  }
}

// Public API
window.smoothScroll = {
  lenis,
  scrollTo: (target, options) => {
    if (lenis) {
      lenis.scrollTo(target, options);
    }
  },
  toggleScrolling,
};