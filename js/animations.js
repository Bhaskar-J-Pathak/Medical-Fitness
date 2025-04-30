/*
 * Animations
 * GSAP animations and ScrollTrigger implementation for the physiotherapy website
 */

// Initialize GSAP animations
function initGSAP() {
    // Check if GSAP and ScrollTrigger are available
    if (typeof gsap === 'undefined') {
      console.warn('GSAP library not loaded');
      return;
    }
    
    if (typeof ScrollTrigger === 'undefined') {
      console.warn('ScrollTrigger plugin not loaded');
      return;
    }
    
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Initialize all animations
    initTextSplitting();
    initHeroAnimations();
    initSectionAnimations();
    initParallaxEffects();
    initRevealAnimations();
    initStaggerAnimations();
    initHoverAnimations();
    initSectionOverlaps();
    initScrollProgressIndicator();
  }
  
  // Split text for text animations
  function initTextSplitting() {
    // Check if SplitType is available
    if (typeof SplitType === 'undefined') {
      console.warn('SplitType library not loaded');
      return;
    }
    
    // Split all text elements with the split-text class
    const splitTextElements = document.querySelectorAll('.split-text');
    
    splitTextElements.forEach(element => {
      // Split by lines and then words within each line
      new SplitType(element, { types: 'lines,words', tagName: 'span' });
      
      // Hide all words initially
      gsap.set(element.querySelectorAll('.word'), { 
        opacity: 0,
        y: 50
      });
    });
  }
  
  // Hero section animations
  function initHeroAnimations() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    const heroTitle = heroSection.querySelector('.hero-title');
    const heroDescription = heroSection.querySelector('.hero-description');
    const heroCtas = heroSection.querySelector('.hero-ctas');
    const heroMedia = heroSection.querySelector('.hero-media');
    const heroDecorations = heroSection.querySelectorAll('.decoration-item');
    const statsBar = heroSection.querySelector('.stats-bar');
    
    // Main timeline
    const tl = gsap.timeline({ 
      defaults: { 
        ease: 'power3.out',
        duration: 1
      }
    });
    
    // Add animations to timeline
    if (heroTitle) {
      // Animate words in the title
      const words = heroTitle.querySelectorAll('.word');
      if (words.length > 0) {
        tl.to(words, { 
          opacity: 1, 
          y: 0, 
          stagger: 0.08,
          duration: 1.2
        }, 0.2);
      } else {
        // Fallback if split text is not working
        tl.fromTo(heroTitle, { 
          opacity: 0, 
          y: 50 
        }, { 
          opacity: 1, 
          y: 0 
        }, 0.2);
      }
    }
    
    if (heroDescription) {
      tl.fromTo(heroDescription, { 
        opacity: 0, 
        y: 30 
      }, { 
        opacity: 1, 
        y: 0 
      }, 0.6);
    }
    
    if (heroCtas) {
      tl.fromTo(heroCtas.children, { 
        opacity: 0, 
        y: 30 
      }, { 
        opacity: 1, 
        y: 0, 
        stagger: 0.15 
      }, 0.8);
    }
    
    if (heroMedia) {
      tl.fromTo(heroMedia, { 
        opacity: 0, 
        scale: 0.9 
      }, { 
        opacity: 1, 
        scale: 1, 
        duration: 1.5 
      }, 0.4);
    }
    
    if (heroDecorations.length > 0) {
      tl.fromTo(heroDecorations, { 
        opacity: 0, 
        scale: 0.5 
      }, { 
        opacity: 1, 
        scale: 1, 
        stagger: 0.2, 
        duration: 1.5 
      }, 0.8);
    }
    
    if (statsBar) {
      tl.fromTo(statsBar, { 
        opacity: 0, 
        y: 30 
      }, { 
        opacity: 1, 
        y: 0 
      }, 1.2);
    }
    
    // Parallax effect on hero image
    if (heroMedia) {
      const heroImage = heroMedia.querySelector('.hero-image');
      if (heroImage) {
        gsap.to(heroImage, {
          y: '20%',
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });
      }
    }
  }
  
  // Section header animations
  function initSectionAnimations() {
    const sectionHeaders = document.querySelectorAll('.section-header');
    
    sectionHeaders.forEach(header => {
      const sectionTitle = header.querySelector('.section-title');
      const sectionSubtitle = header.querySelector('.section-subtitle');
      const sectionDescription = header.querySelector('.section-description');
      
      // Create timeline for each section header
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: header,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none none'
        }
      });
      
      if (sectionSubtitle) {
        tl.fromTo(sectionSubtitle, { 
          opacity: 0, 
          y: 30 
        }, { 
          opacity: 1, 
          y: 0, 
          duration: 0.6 
        }, 0);
      }
      
      if (sectionTitle) {
        // Check if the title has been split
        const words = sectionTitle.querySelectorAll('.word');
        
        if (words.length > 0) {
          tl.to(words, { 
            opacity: 1, 
            y: 0, 
            stagger: 0.04,
            duration: 0.8 
          }, 0.2);
        } else {
          tl.fromTo(sectionTitle, { 
            opacity: 0, 
            y: 30 
          }, { 
            opacity: 1, 
            y: 0, 
            duration: 0.8 
          }, 0.2);
        }
      }
      
      if (sectionDescription) {
        tl.fromTo(sectionDescription, { 
          opacity: 0, 
          y: 30 
        }, { 
          opacity: 1, 
          y: 0, 
          duration: 0.6 
        }, 0.4);
      }
    });
  }
  
  // Parallax scrolling effects
  function initParallaxEffects() {
    // Images and elements with parallax data attribute
    const parallaxElements = document.querySelectorAll('[data-scroll-speed]');
    
    parallaxElements.forEach(element => {
      const speed = parseFloat(element.dataset.scrollSpeed) || 0.5;
      
      gsap.to(element, {
        y: `${speed * 100}%`,
        scrollTrigger: {
          trigger: element.closest('section') || element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
    
    // Parallax for about image
    const aboutImage = document.querySelector('.about-image');
    if (aboutImage) {
      gsap.to(aboutImage, {
        y: '10%',
        scrollTrigger: {
          trigger: '.about-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    }
    
    // Parallax for decoration elements
    const decorations = document.querySelectorAll('.decoration-item');
    decorations.forEach((decoration, index) => {
      const direction = index % 2 === 0 ? 1 : -1;
      
      gsap.to(decoration, {
        y: `${direction * 50}%`,
        scrollTrigger: {
          trigger: decoration.closest('section') || decoration,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
  }
  
  // Reveal animations for sections and elements
  function initRevealAnimations() {
    // Animate about section content
    const aboutContent = document.querySelector('.about-content');
    if (aboutContent) {
      const aboutImage = aboutContent.querySelector('.about-image-container');
      const aboutText = aboutContent.querySelector('.about-text');
      const expertiseItems = aboutContent.querySelectorAll('.expertise-item');
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: aboutContent,
          start: 'top 70%',
          end: 'bottom 20%',
          toggleActions: 'play none none none'
        }
      });
      
      if (aboutImage) {
        tl.fromTo(aboutImage, { 
          opacity: 0, 
          x: -50 
        }, { 
          opacity: 1, 
          x: 0, 
          duration: 1 
        }, 0);
      }
      
      if (aboutText) {
        const aboutHeading = aboutText.querySelector('.about-heading');
        const aboutParagraphs = aboutText.querySelectorAll('p');
        
        if (aboutHeading) {
          tl.fromTo(aboutHeading, { 
            opacity: 0, 
            y: 30 
          }, { 
            opacity: 1, 
            y: 0, 
            duration: 0.8 
          }, 0.2);
        }
        
        if (aboutParagraphs.length > 0) {
          tl.fromTo(aboutParagraphs, { 
            opacity: 0, 
            y: 30 
          }, { 
            opacity: 1, 
            y: 0, 
            stagger: 0.15, 
            duration: 0.8 
          }, 0.4);
        }
      }
      
      if (expertiseItems.length > 0) {
        tl.fromTo(expertiseItems, { 
          opacity: 0, 
          y: 30 
        }, { 
          opacity: 1, 
          y: 0, 
          stagger: 0.1, 
          duration: 0.6 
        }, 0.6);
      }
    }
    
    // Animate services cards
    const servicesGrid = document.querySelector('.services-grid');
    if (servicesGrid) {
      const serviceCards = servicesGrid.querySelectorAll('.service-card');
      
      gsap.fromTo(serviceCards, { 
        opacity: 0, 
        y: 50 
      }, { 
        opacity: 1, 
        y: 0, 
        stagger: 0.1, 
        duration: 0.8,
        scrollTrigger: {
          trigger: servicesGrid,
          start: 'top 70%',
          end: 'bottom 20%',
          toggleActions: 'play none none none'
        }
      });
    }
    
    // Animate work items
    const workGrid = document.querySelector('.work-grid');
    if (workGrid) {
      const workItems = workGrid.querySelectorAll('.work-item');
      
      gsap.fromTo(workItems, { 
        opacity: 0, 
        scale: 0.9 
      }, { 
        opacity: 1, 
        scale: 1, 
        stagger: 0.1, 
        duration: 0.8,
        scrollTrigger: {
          trigger: workGrid,
          start: 'top 70%',
          end: 'bottom 20%',
          toggleActions: 'play none none none'
        }
      });
    }
    
    // Animate pricing cards
    const pricingGrid = document.querySelector('.pricing-grid');
    if (pricingGrid) {
      const pricingCards = pricingGrid.querySelectorAll('.pricing-card');
      
      gsap.fromTo(pricingCards, { 
        opacity: 0, 
        y: 50 
      }, { 
        opacity: 1, 
        y: 0, 
        stagger: 0.15, 
        duration: 0.8,
        scrollTrigger: {
          trigger: pricingGrid,
          start: 'top 70%',
          end: 'bottom 20%',
          toggleActions: 'play none none none'
        }
      });
    }
    
    // Animate contact section
    const contactContainer = document.querySelector('.contact-container');
    if (contactContainer) {
      const contactInfo = contactContainer.querySelector('.contact-info');
      const contactForm = contactContainer.querySelector('.contact-form');
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: contactContainer,
          start: 'top 70%',
          end: 'bottom 20%',
          toggleActions: 'play none none none'
        }
      });
      
      if (contactInfo) {
        const contactItems = contactInfo.querySelectorAll('.contact-info-item');
        
        tl.fromTo(contactItems, { 
          opacity: 0, 
          x: -30 
        }, { 
          opacity: 1, 
          x: 0, 
          stagger: 0.1, 
          duration: 0.6 
        }, 0);
      }
      
      if (contactForm) {
        tl.fromTo(contactForm, { 
          opacity: 0, 
          x: 30 
        }, { 
          opacity: 1, 
          x: 0, 
          duration: 0.8 
        }, 0.2);
      }
    }
  }
  
  // Staggered animations for grouped elements
  function initStaggerAnimations() {
    // Generic staggered reveals for elements with .stagger-item class
    const staggerContainers = document.querySelectorAll('.stagger-container');
    
    staggerContainers.forEach(container => {
      const items = container.querySelectorAll('.stagger-item');
      
      if (items.length > 0) {
        gsap.fromTo(items, { 
          opacity: 0, 
          y: 30 
        }, { 
          opacity: 1, 
          y: 0, 
          stagger: 0.1, 
          duration: 0.6,
          scrollTrigger: {
            trigger: container,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none none'
          }
        });
      }
    });
    
    // Footer reveal animation
    const footerContainer = document.querySelector('.site-footer');
    if (footerContainer) {
      const footerTop = footerContainer.querySelector('.footer-top');
      const footerBottom = footerContainer.querySelector('.footer-bottom');
      
      if (footerTop) {
        const footerWidgets = footerTop.querySelectorAll('.footer-widget, .footer-nav-column');
        
        gsap.fromTo(footerWidgets, { 
          opacity: 0, 
          y: 30 
        }, { 
          opacity: 1, 
          y: 0, 
          stagger: 0.1, 
          duration: 0.6,
          scrollTrigger: {
            trigger: footerTop,
            start: 'top 90%',
            end: 'bottom 70%',
            toggleActions: 'play none none none'
          }
        });
      }
      
      if (footerBottom) {
        gsap.fromTo(footerBottom, { 
          opacity: 0, 
          y: 20 
        }, { 
          opacity: 1, 
          y: 0, 
          duration: 0.6,
          scrollTrigger: {
            trigger: footerBottom,
            start: 'top 95%',
            end: 'bottom 85%',
            toggleActions: 'play none none none'
          }
        });
      }
    }
  }
  
  // Hover animations for interactive elements
  function initHoverAnimations() {
    // Service cards hover effect
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { 
          y: -10, 
          boxShadow: '0 20px 30px rgba(0, 0, 0, 0.1)', 
          duration: 0.3 
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { 
          y: 0, 
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.06)', 
          duration: 0.3 
        });
      });
    });
    
    // Work items hover effect
    const workItems = document.querySelectorAll('.work-item');
    
    workItems.forEach(item => {
      const overlay = item.querySelector('.work-overlay');
      const image = item.querySelector('.work-image');
      
      if (overlay && image) {
        gsap.set(overlay, { opacity: 0, y: 20 });
        
        item.addEventListener('mouseenter', () => {
          gsap.to(overlay, { opacity: 1, y: 0, duration: 0.3 });
          gsap.to(image, { scale: 1.1, duration: 0.6 });
        });
        
        item.addEventListener('mouseleave', () => {
          gsap.to(overlay, { opacity: 0, y: 20, duration: 0.3 });
          gsap.to(image, { scale: 1, duration: 0.6 });
        });
      }
    });
    
    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        gsap.to(button, { scale: 1.03, duration: 0.2 });
      });
      
      button.addEventListener('mouseleave', () => {
        gsap.to(button, { scale: 1, duration: 0.2 });
      });
      
      button.addEventListener('mousedown', () => {
        gsap.to(button, { scale: 0.98, duration: 0.1 });
      });
      
      button.addEventListener('mouseup', () => {
        gsap.to(button, { scale: 1.03, duration: 0.1 });
      });
    });
  }
  
  // Section overlapping effect
  function initSectionOverlaps() {
    // Get all overlapping sections
    const sections = document.querySelectorAll(
      '.about-section, .services-section, .work-section, .pricing-section, .testimonials-section, .contact-section'
    );
    
    // Set initial z-indices to ensure proper stacking
    sections.forEach((section, index) => {
      section.style.zIndex = sections.length - index + 1;
    });
    
    // Create scroll-triggered animations for each overlap
    sections.forEach((section) => {
      // Get previous section for reference (if any)
      const prevSection = section.previousElementSibling;
      if (!prevSection || !prevSection.matches('section')) return;
      
      // Create scroll trigger for the overlap effect
      ScrollTrigger.create({
        trigger: section,
        start: 'top 90%', // Adjust this value to control when the animation starts
        end: 'top 40%',   // Adjust this value to control when the animation completes
        onUpdate: (self) => {
          // Calculate section overlap translation
          const progress = self.progress;
          gsap.to(section, {
            borderRadius: `${30 * (1 - progress)}rem ${30 * (1 - progress)}rem 0 0`,
            duration: 0.1,
            ease: 'none'
          });
        }
      });
    });
  }
  
  // Create a scroll progress indicator
  function initScrollProgressIndicator() {
    // Create progress bar if it doesn't exist
    let progressBar = document.querySelector('.scroll-progress-bar');
    
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.classList.add('scroll-progress-bar');
      document.body.appendChild(progressBar);
      
      // Style the progress bar
      gsap.set(progressBar, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '0%',
        height: '4px',
        backgroundColor: 'var(--primary)',
        zIndex: 9999,
      });
    }
    
    // Update progress bar width based on scroll position
    gsap.to(progressBar, {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3
      }
    });
  }
  
  // Magnetic elements effect
  function initMagneticElements() {
    const magneticElements = document.querySelectorAll('.magnetic');
    
    magneticElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(element, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.5,
          ease: 'power2.out'
        });
      });
      
      element.addEventListener('mouseleave', () => {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: 'elastic.out(1, 0.3)'
        });
      });
    });
  }
  
  // Reveal images with sliding shutter effect
  function initImageRevealEffect() {
    const revealImages = document.querySelectorAll('.reveal-image');
    
    revealImages.forEach(imageContainer => {
      const image = imageContainer.querySelector('img');
      
      if (image) {
        // Create a shutter element
        const shutter = document.createElement('div');
        shutter.classList.add('image-shutter');
        imageContainer.appendChild(shutter);
        
        // Style the shutter
        gsap.set(shutter, {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'var(--primary)',
          transformOrigin: 'left'
        });
        
        // Hide the image initially
        gsap.set(image, { opacity: 0 });
        
        // Create the reveal animation
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: imageContainer,
            start: 'top 70%',
            end: 'bottom 20%',
            toggleActions: 'play none none none'
          }
        });
        
        tl.to(shutter, {
          scaleX: 0,
          duration: 0.8,
          ease: 'power3.inOut'
        })
        .to(image, {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out'
        }, '-=0.4');
      }
    });
  }
  
  // Expose functions globally
  window.animationEffects = {
    initGSAP,
    initHoverAnimations,
    initMagneticElements,
    initImageRevealEffect
  };