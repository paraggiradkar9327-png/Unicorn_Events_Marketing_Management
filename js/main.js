/**
 * UNICORN EVENTS — Main Site JavaScript
 * Handles: navbar scroll, mobile menu, scroll animations,
 *          animated counters, active nav highlighting, contact form.
 */

(function () {
  'use strict';



  // ─── NAVBAR SCROLL EFFECT ─────────────────────────────────
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    function onScroll() {
      if (window.scrollY > 50) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  // ─── MOBILE MENU ─────────────────────────────────────────
  function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });

    // Close when a menu link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ─── SCROLL-TRIGGERED FADE-IN ANIMATIONS ─────────────────
  function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const delay = parseInt(entry.target.dataset.delay || '0', 10);
        setTimeout(() => entry.target.classList.add('visible'), delay);
      });
    }, { threshold: 0.12 });

    elements.forEach((el, i) => {
      el.dataset.delay = (i % 6) * 90;
      observer.observe(el);
    });
  }

  // ─── ANIMATED STAT COUNTERS ───────────────────────────────
  function animateCounter(el, target, suffix) {
    const duration = 1400; // ms
    const step = 16;   // ~60fps
    const steps = duration / step;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
        return;
      }
      el.textContent = Math.floor(current) + suffix;
    }, step);
  }

  function initCounters() {
    const statsSection = document.querySelector('.about-stats');
    if (!statsSection) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('[data-count]').forEach(el => {
          animateCounter(el, +el.dataset.count, el.dataset.suffix || '');
        });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }

  // ─── ACTIVE NAV LINK ON SCROLL ───────────────────────────
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
    if (!sections.length || !navLinks.length) return;

    function highlightNav() {
      let current = '';
      sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
      });
      navLinks.forEach(a => {
        const isActive = a.getAttribute('href') === '#' + current;
        a.style.color = isActive ? 'var(--gold)' : '';
      });
    }

    window.addEventListener('scroll', highlightNav, { passive: true });
    highlightNav();
  }

  // ─── CONTACT FORM ────────────────────────────────────────
  function initContactForm() {
    const form = document.getElementById('contact-form');
    const successMsg = document.getElementById('form-success');
    if (!form || !successMsg) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      const required = form.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#e05555';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });
      if (!valid) return;

      // Show success message
      successMsg.style.display = 'block';
      form.reset();

      setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
    });
  }

  // ─── INIT ALL ────────────────────────────────────────────
  // Wait for components.js to finish injecting navbar/footer,
  // then initialise everything that depends on those elements.
  function initAll() {
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initCounters();
    initActiveNav();
    initContactForm();
  }

  // 'components:loaded' is fired by components.js after all
  // shared HTML is injected. If components.js is not on the
  // page (shouldn't happen), fall back to DOMContentLoaded.
  document.addEventListener('components:loaded', initAll);
  document.addEventListener('DOMContentLoaded', () => {
    // Fallback: run after a short tick to give components.js
    // a chance to fire first.
    setTimeout(() => {
      const navbar = document.getElementById('navbar');
      if (!navbar) initAll(); // components.js not present
    }, 50);
  });





})();
