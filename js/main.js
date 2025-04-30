/*
 * Main JavaScript
 * Primary JavaScript file that initializes all functionality
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded - initializing core modules');
  
  // Initialize all modules
  initLoader();
  initMobileMenu();
  initStickyHeader();
  initBackToTop();
  initTestimonialsSlider();
  initFormInteractions();
  initCounters();
  
  // Initialize all external libraries
  // These will be called after the libraries have loaded
  window.addEventListener('load', () => {
    console.log('Window Loaded - initializing advanced features');
    
    // Initialize animations
    if (typeof initGSAP === 'function') {
      initGSAP();
    } else {
      console.warn('GSAP animations module not loaded');
    }
    
    // Initialize custom cursor
    if (window.matchMedia('(pointer: fine)').matches && typeof initCursor === 'function') {
      initCursor();
    }
  });
});

// Loader Animation with Counter
function initLoader() {
  const loader = document.querySelector('.loader');
  const counter = document.querySelector('.loader-counter');
  const progress = document.querySelector('.loader-progress');
  
  if (!loader || !counter || !progress) return;
  
  let count = 0;
  const interval = setInterval(() => {
    count += Math.floor(Math.random() * 5) + 1;
    if (count > 100) count = 100;
    
    counter.textContent = `${count}%`;
    progress.style.width = `${count}%`;
    
    if (count === 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
          loader.style.display = 'none';
          document.body.classList.add('loaded');
        }, 500);
      }, 500);
    }
  }, 70);
}

// Mobile Menu Toggle
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  
  if (!menuToggle || !mobileMenu) return;
  
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });
  
  // Close menu when a link is clicked
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });
}

// Sticky Header on Scroll
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  
  const scrollThreshold = 50;
  
  function handleScroll() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  
  window.addEventListener('scroll', handleScroll);
  // Check on initial load as well
  handleScroll();
}

// Back to Top Button
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) return;
  
  const scrollThreshold = 300;
  
  function handleScroll() {
    if (window.scrollY > scrollThreshold) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }
  
  window.addEventListener('scroll', handleScroll);
  
  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Testimonials Slider
function initTestimonialsSlider() {
  // Check if Swiper is available
  if (typeof Swiper === 'undefined') {
    console.warn('Swiper not loaded');
    return;
  }
  
  const testimonialsContainer = document.querySelector('.testimonials-slider .swiper-container');
  if (!testimonialsContainer) return;
  
  const swiper = new Swiper(testimonialsContainer, {
    slidesPerView: 1,
    spaceBetween: 30,
    speed: 600,
    loop: true,
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.testimonials-pagination',
      clickable: true,
      bulletClass: 'testimonials-bullet',
      bulletActiveClass: 'testimonials-bullet-active'
    },
    navigation: {
      nextEl: '.testimonials-next',
      prevEl: '.testimonials-prev'
    }
  });
}

// Form Interaction Enhancements
function initFormInteractions() {
  const form = document.querySelector('.contact-form');
  
  if (form) {
    // Add active class to form fields on focus
    const formInputs = form.querySelectorAll('input, textarea, select');
    
    formInputs.forEach(input => {
      // Add focus class to parent when input is focused
      input.addEventListener('focus', () => {
        input.closest('.form-group').classList.add('focused');
      });
      
      input.addEventListener('blur', () => {
        input.closest('.form-group').classList.remove('focused');
        // Add filled class if the input has a value
        if (input.value.trim() !== '') {
          input.closest('.form-group').classList.add('filled');
        } else {
          input.closest('.form-group').classList.remove('filled');
        }
      });
      
      // Check initial state
      if (input.value.trim() !== '') {
        input.closest('.form-group').classList.add('filled');
      }
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simple validation
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');
      
      requiredFields.forEach(field => {
        if (field.value.trim() === '') {
          isValid = false;
          field.closest('.form-group').classList.add('error');
        } else {
          field.closest('.form-group').classList.remove('error');
        }
      });
      
      if (isValid) {
        // Simulated form submission
        const submitBtn = form.querySelector('.form-submit');
        
        if (submitBtn) {
          const originalText = submitBtn.innerHTML;
          submitBtn.innerHTML = '<span class="loading-dots"><span class="loading-dot"></span><span class="loading-dot"></span><span class="loading-dot"></span></span>';
          submitBtn.disabled = true;
          
          // Simulate API call
          setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent';
            submitBtn.classList.add('success');
            
            // Reset form
            form.reset();
            formInputs.forEach(input => {
              input.closest('.form-group').classList.remove('filled');
            });
            
            // Reset button after delay
            setTimeout(() => {
              submitBtn.innerHTML = originalText;
              submitBtn.disabled = false;
              submitBtn.classList.remove('success');
            }, 3000);
          }, 2000);
        }
      }
    });
  }
}

// Number Counter Animation
function initCounters() {
  const counters = document.querySelectorAll('.stats-number');
  
  function animateCounter(counter, target, duration = 2) {
    let start = 0;
    const increment = Math.ceil(target / (duration * 60));
    const timer = setInterval(() => {
      start += increment;
      
      if (start > target) {
        counter.textContent = target;
        clearInterval(timer);
      } else {
        counter.textContent = start;
      }
    }, 1000 / 60);
  }
  
  function handleIntersection(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.count);
        
        if (!isNaN(target)) {
          animateCounter(counter, target);
        }
        
        observer.unobserve(counter);
      }
    });
  }
  
  // Use Intersection Observer to trigger counter animation when in view
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.5
    });
    
    counters.forEach(counter => {
      observer.observe(counter);
    });
  } else {
    // Fallback for browsers that don't support Intersection Observer
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.count);
      if (!isNaN(target)) {
        animateCounter(counter, target);
      }
    });
  }
}

// Initialize custom cursor (defined in cursor.js)
function initCustomCursor() {
  if (typeof initCursor === 'function') {
    initCursor();
  } else {
    console.warn('Custom cursor module not loaded');
  }
}

// Initialize smooth scrolling (defined in scroll.js)
function initSmoothScroll() {
  if (typeof initLenisScroll === 'function') {
    initLenisScroll();
  } else {
    console.warn('Smooth scroll module not loaded');
  }
}

// Initialize animations (defined in animations.js)
function initAnimations() {
  if (typeof initGSAP === 'function') {
    initGSAP();
  } else {
    console.warn('Animations module not loaded');
  }
}