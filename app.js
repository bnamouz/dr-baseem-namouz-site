/**
 * Dr. Baseem Namouz Homepage — JavaScript
 * Dark mode toggle, mobile nav, scroll animations, sticky header
 */

(function () {
  'use strict';

  // ============================
  // DARK MODE TOGGLE
  // ============================
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let currentTheme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', currentTheme);

  function updateThemeIcon() {
    if (!themeToggle) return;
    if (currentTheme === 'dark') {
      themeToggle.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
      themeToggle.setAttribute('aria-label', 'החלף למצב בהיר');
    } else {
      themeToggle.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      themeToggle.setAttribute('aria-label', 'החלף למצב כהה');
    }
  }

  updateThemeIcon();

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', currentTheme);
      updateThemeIcon();
    });
  }

  // ============================
  // MOBILE NAVIGATION
  // ============================
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  let isMenuOpen = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    mobileNav.classList.toggle('is-open', isMenuOpen);
    mobileMenuBtn.setAttribute('aria-expanded', isMenuOpen);

    if (isMenuOpen) {
      mobileMenuBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenuBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
      document.body.style.overflow = '';
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMenu);
  }

  // Close mobile nav on link click
  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (isMenuOpen) toggleMenu();
      });
    });
  }

  // ============================
  // STICKY HEADER SHADOW
  // ============================
  const header = document.getElementById('header');
  let lastScroll = 0;

  function handleScroll() {
    var scrollY = window.scrollY || window.pageYOffset;

    if (header) {
      if (scrollY > 20) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    }

    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ============================
  // SCROLL ANIMATIONS
  // ============================
  var fadeElements = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything
    fadeElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // ============================
  // SMOOTH SCROLL FOR NAV LINKS
  // ============================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
