document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Navigation Scroll Effect & Active Section ---
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    
    // Header shadow and padding adjustment
    if (scrollPos > 50) {
      header.classList.add('scrolled');
      backToTop.classList.add('visible');
    } else {
      header.classList.remove('scrolled');
      backToTop.classList.remove('visible');
    }

    // Scroll progress bar
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (windowHeight > 0) {
      const scrolledPercent = (scrollPos / windowHeight) * 100;
      scrollProgress.style.width = `${scrolledPercent}%`;
    }

    // Active Nav Item highlighting
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // --- 2. Mobile Menu (Drawer Toggling) ---
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      mobileMenuBtn.innerHTML = isExpanded ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Close menu when links are clicked on mobile
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  // --- 3. Hero Typewriter Effect ---
  const typewriterText = document.getElementById('typewriterText');
  const roles = [
    'IoT & Robotics Developer',
    'AI & Data Science Student',
    'Embedded Systems Enthusiast',
    'Problem Solver'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
      typewriterText.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // faster deletion
    } else {
      typewriterText.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100; // standard typing
    }

    // Determine state
    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 1500; // Pause at end of word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Pause before typing next word
    }

    setTimeout(typeEffect, typingSpeed);
  }

  if (typewriterText) {
    typeEffect();
  }

  // --- 4. Back to Top Smooth Scroll ---
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- 5. Interactive Skill Tabs ---
  const tabBtns = document.querySelectorAll('.tab-btn');
  const skillContents = document.querySelectorAll('.skill-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active states
      tabBtns.forEach(t => t.classList.remove('active'));
      skillContents.forEach(c => c.classList.remove('active'));

      // Add active state to clicked elements
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  // --- 6. Scroll Fade In Observer ---
  const fadeElements = document.querySelectorAll('.fade-in-section');
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // stop observing once visible
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => {
    fadeObserver.observe(el);
  });

  // --- 7. Mouse Tracker background lights (Optional premium aesthetic effect) ---
  const orbs = document.querySelectorAll('.glow-orb');
  window.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    
    // Shift orbs slightly towards the cursor for interactive feedback
    if (orbs[0]) {
      orbs[0].style.transform = `translate(${x * 0.05}px, ${y * 0.05}px)`;
    }
    if (orbs[1]) {
      orbs[1].style.transform = `translate(${x * -0.03}px, ${y * -0.03}px)`;
    }
  });

  // --- 8. Contact Form Verification ---
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        showStatus('Please fill in all required fields.', 'error');
        return;
      }

      if (!validateEmail(email)) {
        showStatus('Please enter a valid email address.', 'error');
        return;
      }

      // Since we don't have a live backend endpoint in this local static version, 
      // we'll simulate a successful message send.
      showStatus('Message sent successfully! Thank you, I will get back to you soon.', 'success');
      contactForm.reset();
    });
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function showStatus(msg, type) {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.className = 'form-status'; // reset
    formStatus.classList.add(type);
    
    setTimeout(() => {
      formStatus.style.display = 'none';
    }, 5000);
  }

  // --- 9. Project Slideshow Initialization (Removed - using static mockups with Lightbox Zoom) ---
  
  // --- 10. Lightbox Modal for Image Expansion ---
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeLightbox = document.querySelector('.close-lightbox');
  
  // Select all slide images
  const slideImages = document.querySelectorAll('.project-slide img');
  
  slideImages.forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent slider controls trigger
      if (lightboxModal && lightboxImg) {
        lightboxModal.style.display = 'block';
        lightboxImg.src = e.target.src;
        if (lightboxCaption) {
          const slideElement = e.target.parentElement;
          const captionElement = slideElement.querySelector('.slide-caption');
          lightboxCaption.textContent = captionElement ? captionElement.textContent : e.target.alt;
        }
      }
    });
  });
  
  if (closeLightbox) {
    closeLightbox.addEventListener('click', () => {
      lightboxModal.style.display = 'none';
    });
  }
  
  // Close lightbox on click outside the image
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.style.display = 'none';
      }
    });
  }
});
