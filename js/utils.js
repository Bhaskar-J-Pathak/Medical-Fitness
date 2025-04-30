/*
 * Utilities
 * Helper functions and utilities for the physiotherapy website
 */

// Debounce function to limit function calls
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
      const context = this;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  }
  
  // Throttle function to limit function calls
  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  
  // Get viewport dimensions
  function getViewportDimensions() {
    return {
      width: window.innerWidth || document.documentElement.clientWidth,
      height: window.innerHeight || document.documentElement.clientHeight
    };
  }
  
  // Check if element is in viewport
  function isInViewport(element, offset = 0) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    
    return (
      rect.top + offset < viewportHeight &&
      rect.bottom > 0
    );
  }
  
  // Get random number between min and max
  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  // Clamp a value between min and max
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
  
  // Lerp (Linear Interpolation)
  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }
  
  // Map a value from one range to another
  function mapRange(value, fromMin, fromMax, toMin, toMax) {
    return toMin + (toMax - toMin) * ((value - fromMin) / (fromMax - fromMin));
  }
  
  // Detect device type
  function getDeviceType() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  }
  
  // Check if device supports touch
  function isTouchDevice() {
    return (('ontouchstart' in window) ||
       (navigator.maxTouchPoints > 0) ||
       (navigator.msMaxTouchPoints > 0));
  }
  
  // Check if reduced motion is preferred
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  // Get element position relative to document
  function getElementPosition(element) {
    const rect = element.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    return {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft,
      right: rect.right + scrollLeft,
      bottom: rect.bottom + scrollTop,
      width: rect.width,
      height: rect.height
    };
  }
  
  // Format numbers with commas
  function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  
  // Lazy load images
  function lazyLoadImages() {
    const lazyImages = document.querySelectorAll('img.lazy');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const lazyImage = entry.target;
            lazyImage.src = lazyImage.dataset.src;
            
            if (lazyImage.dataset.srcset) {
              lazyImage.srcset = lazyImage.dataset.srcset;
            }
            
            lazyImage.classList.remove('lazy');
            lazyImage.classList.add('loaded');
            imageObserver.unobserve(lazyImage);
          }
        });
      });
      
      lazyImages.forEach(image => {
        imageObserver.observe(image);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      let lazyLoadThrottled = throttle(() => {
        const scrollTop = window.pageYOffset;
        
        lazyImages.forEach(img => {
          if (img.offsetTop < window.innerHeight + scrollTop) {
            img.src = img.dataset.src;
            
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
            }
            
            img.classList.remove('lazy');
            img.classList.add('loaded');
          }
        });
        
        if (lazyImages.length === 0) {
          document.removeEventListener('scroll', lazyLoadThrottled);
          window.removeEventListener('resize', lazyLoadThrottled);
          window.removeEventListener('orientationchange', lazyLoadThrottled);
        }
      }, 200);
      
      document.addEventListener('scroll', lazyLoadThrottled);
      window.addEventListener('resize', lazyLoadThrottled);
      window.addEventListener('orientationchange', lazyLoadThrottled);
    }
  }
  
  // Form validation
  function validateForm(formElement) {
    if (!formElement) return false;
    
    const requiredFields = formElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      // Clear previous error state
      field.classList.remove('invalid');
      const errorMessage = field.parentElement.querySelector('.error-message');
      if (errorMessage) {
        errorMessage.remove();
      }
      
      // Check for empty fields
      if (field.value.trim() === '') {
        isValid = false;
        field.classList.add('invalid');
        
        // Add error message
        const message = document.createElement('div');
        message.classList.add('error-message');
        message.textContent = 'This field is required';
        field.parentElement.appendChild(message);
      }
      
      // Email validation
      if (field.type === 'email' && field.value.trim() !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value.trim())) {
          isValid = false;
          field.classList.add('invalid');
          
          const message = document.createElement('div');
          message.classList.add('error-message');
          message.textContent = 'Please enter a valid email address';
          field.parentElement.appendChild(message);
        }
      }
      
      // Phone validation
      if (field.type === 'tel' && field.value.trim() !== '') {
        const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
        if (!phoneRegex.test(field.value.trim())) {
          isValid = false;
          field.classList.add('invalid');
          
          const message = document.createElement('div');
          message.classList.add('error-message');
          message.textContent = 'Please enter a valid phone number';
          field.parentElement.appendChild(message);
        }
      }
    });
    
    return isValid;
  }
  
  // Get parameter from URL
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }
  
  // Generate a random ID
  function generateUniqueId(prefix = 'id') {
    return `${prefix}-${Math.random().toString(36).substring(2, 10)}`;
  }
  
  // Add class when element enters viewport
  function addClassOnScroll(elements, className, threshold = 0.2) {
    if (!elements || elements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(className);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold });
    
    elements.forEach(element => {
      observer.observe(element);
    });
  }
  
  // Get current browser support for various features
  function getBrowserSupport() {
    return {
      webp: checkWebpSupport(),
      webgl: checkWebglSupport(),
      webp_animation: checkAnimWebpSupport(),
      avif: checkAvifSupport()
    };
  }
  
  // Check for WebP support
  function checkWebpSupport() {
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  }
  
  // Check for WebGL support
  function checkWebglSupport() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch(e) {
      return false;
    }
  }
  
  // Check for animated WebP support
  function checkAnimWebpSupport() {
    return false; // This requires more complex testing, defaulting to false
  }
  
  // Check for AVIF support
  function checkAvifSupport() {
    return false; // This requires more complex testing, defaulting to false
  }
  
  // Expose utils to global scope
  window.utils = {
    debounce,
    throttle,
    isInViewport,
    getViewportDimensions,
    getRandomNumber,
    clamp,
    lerp,
    mapRange,
    getDeviceType,
    isTouchDevice,
    prefersReducedMotion,
    getElementPosition,
    formatNumber,
    lazyLoadImages,
    validateForm,
    getUrlParameter,
    generateUniqueId,
    addClassOnScroll,
    getBrowserSupport
  };
  
  // Run init functions
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize lazy loading
    lazyLoadImages();
    
    // Add reveal animations
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
    addClassOnScroll(revealElements, 'is-revealed');
    
    // Add staggered animations
    const staggerElements = document.querySelectorAll('.stagger-fade-in');
    addClassOnScroll(staggerElements, 'is-visible');
    
    // Add text reveal animations
    const textRevealElements = document.querySelectorAll('.text-reveal');
    addClassOnScroll(textRevealElements, 'is-visible');
  });