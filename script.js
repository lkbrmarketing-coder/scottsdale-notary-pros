/* ==========================================================================
   Scottsdale Notary Pros — site scripts
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------- Mobile overlay nav --- */

  var toggle = document.querySelector('.nav-toggle');
  var overlay = document.querySelector('.nav-overlay');

  function closeNav() {
    if (!overlay || !toggle) return;
    overlay.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }

  if (toggle && overlay) {
    toggle.addEventListener('click', function () {
      var isOpen = overlay.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.classList.toggle('nav-open', isOpen);
    });

    // Close when a link inside the overlay is tapped.
    overlay.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 960) closeNav();
    });
  }

  /* ---------------------------------------------- Active nav link state --- */

  var path = window.location.pathname.split('/').pop() || 'index.html';
  var page = path.replace(/\.html$/, '');
  if (page === '') page = 'index';

  document.querySelectorAll('.nav-links a, .nav-overlay a').forEach(function (link) {
    var href = (link.getAttribute('href') || '').replace(/\.html$/, '');
    if (href && href === page && !link.classList.contains('nav-overlay-cta')) {
      link.classList.add('active');
    }
  });

  /* ------------------------------------------------ Fade-in on scroll --- */

  var faders = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    faders.forEach(function (el) { observer.observe(el); });
  } else {
    faders.forEach(function (el) { el.classList.add('visible'); });
  }

  /* -------------------------------------------------- Back to top button --- */

  var toTop = document.querySelector('.to-top');

  if (toTop) {
    var onScroll = function () {
      toTop.classList.toggle('show', window.pageYOffset > 300);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------ Formspree submit handling --- */

  var form = document.getElementById('notary-form');
  var success = document.getElementById('form-success');

  if (form && success) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var button = form.querySelector('.form-submit');
      var original = button ? button.textContent : '';

      if (button) {
        button.disabled = true;
        button.textContent = 'Sending…';
      }

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (!response.ok) throw new Error('Submission failed');
          form.style.display = 'none';
          success.classList.add('show');
          success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        })
        .catch(function () {
          if (button) {
            button.disabled = false;
            button.textContent = original;
          }
          var error = document.getElementById('form-error');
          if (error) {
            error.classList.add('show');
            error.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });
    });
  }
})();
