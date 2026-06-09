/* ============================================================
   ASSETS/JS/CORE/APP.JS — Application bootstrap
   Injects header/footer/sidebar components
   Initializes scroll-top, reveal animations, dark mode toggle
   TrabahoWatch v1.0
   ============================================================ */

'use strict';

(function () {

  /* ============================================================
     ESCAPE HTML
     ============================================================ */

  function esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ============================================================
     FETCH HTML COMPONENT
     ============================================================ */

  function fetchComponent(url) {
    return fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load: ' + url);
        return res.text();
      });
  }

  /* ============================================================
     INJECT HEADER
     ============================================================ */

  function injectHeader() {
    var el = document.getElementById('site-header');
    if (!el) return Promise.resolve();

    return fetchComponent('/components/header.html')
      .then(function (html) {
        el.innerHTML = html;
        el.removeAttribute('data-loading');
        el.classList.add('loaded');

        /* Mark active nav link */
        markActiveNav();

        /* Init dark mode toggle */
        initDarkModeToggle();

        /* Init mobile menu */
        initMobileMenu();

        /* Init header search */
        initHeaderSearch();
      })
      .catch(function (err) {
        console.warn('[App] Header load failed:', err);
        el.innerHTML = buildFallbackHeader();
        el.removeAttribute('data-loading');
      });
  }

  /* ============================================================
     INJECT FOOTER
     ============================================================ */

  function injectFooter() {
    var el = document.getElementById('site-footer');
    if (!el) return Promise.resolve();

    return fetchComponent('/components/footer.html')
      .then(function (html) {
        el.innerHTML = html;
        el.removeAttribute('data-loading');
        el.classList.add('loaded');

        /* Update copyright year */
        var yearEl = el.querySelector('[data-year]');
        if (yearEl) yearEl.textContent = new Date().getFullYear();
      })
      .catch(function (err) {
        console.warn('[App] Footer load failed:', err);
        el.innerHTML = buildFallbackFooter();
        el.removeAttribute('data-loading');
      });
  }

  /* ============================================================
     INJECT SIDEBAR
     ============================================================ */

  function injectSidebar() {
    var el = document.getElementById('site-sidebar');
    if (!el) return Promise.resolve();

    /* Only on pages with sidebar (not no-sidebar) */
    var wrapper = document.querySelector('.page-wrapper');
    if (wrapper && wrapper.classList.contains('no-sidebar')) {
      el.style.display = 'none';
      return Promise.resolve();
    }

    return fetchComponent('/components/sidebar.html')
      .then(function (html) {
        el.innerHTML = html;
        el.removeAttribute('data-loading');
      })
      .catch(function (err) {
        console.warn('[App] Sidebar load failed:', err);
        el.style.display = 'none';
      });
  }

  /* ============================================================
     FALLBACK HEADER (if fetch fails)
     ============================================================ */

  function buildFallbackHeader() {
    return [
      '<div class="container" style="display:flex;align-items:center;',
          'justify-content:space-between;height:var(--header-height,64px);">',
        '<a href="/" style="font-weight:700;font-size:1.25rem;',
            'color:var(--color-primary);text-decoration:none;">',
          'TrabahoWatch',
        '</a>',
        '<nav style="display:flex;gap:var(--space-4);">',
          '<a href="/government/" style="color:var(--text-secondary);',
              'text-decoration:none;font-size:var(--text-sm);">Gov</a>',
          '<a href="/private/" style="color:var(--text-secondary);',
              'text-decoration:none;font-size:var(--text-sm);">Private</a>',
          '<a href="/ofw/" style="color:var(--text-secondary);',
              'text-decoration:none;font-size:var(--text-sm);">OFW</a>',
        '</nav>',
      '</div>'
    ].join('');
  }

  /* ============================================================
     FALLBACK FOOTER (if fetch fails)
     ============================================================ */

  function buildFallbackFooter() {
    return [
      '<div class="container" style="padding:var(--space-8) var(--space-6);',
          'text-align:center;">',
        '<p style="font-size:var(--text-sm);color:var(--text-muted);">',
          '© ', new Date().getFullYear(), ' TrabahoWatch. ',
          'Free job information for every Filipino.',
        '</p>',
      '</div>'
    ].join('');
  }

  /* ============================================================
     MARK ACTIVE NAV LINK
     ============================================================ */

  function markActiveNav() {
    var path = window.location.pathname;

    document.querySelectorAll('[data-nav-link]').forEach(function (link) {
      var href = link.getAttribute('href') || '';

      /* Exact match or starts-with for section pages */
      var isActive = false;

      if (href === '/' && path === '/') {
        isActive = true;
      } else if (href !== '/' && path.startsWith(href)) {
        isActive = true;
      }

      link.setAttribute('aria-current', isActive ? 'page' : 'false');
      link.classList.toggle('nav-link--active', isActive);
    });
  }

  /* ============================================================
     DARK MODE TOGGLE
     ============================================================ */

  function initDarkModeToggle() {
    var toggleBtn = document.getElementById('dark-mode-toggle') ||
                    document.querySelector('[data-dark-toggle]');
    if (!toggleBtn) return;

    /* Set initial icon based on current theme */
    updateToggleIcon(toggleBtn);

    toggleBtn.addEventListener('click', function () {
      var html     = document.documentElement;
      var isDark   = html.classList.contains('dark');
      var newTheme = isDark ? 'light' : 'dark';

      html.classList.toggle('dark',  newTheme === 'dark');
      html.classList.toggle('light', newTheme === 'light');

      try {
        localStorage.setItem('trabahowatch-theme', newTheme);
      } catch (e) { /* ignore */ }

      updateToggleIcon(toggleBtn);
      toggleBtn.setAttribute('aria-label',
        newTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
    });
  }

  function updateToggleIcon(btn) {
    var isDark = document.documentElement.classList.contains('dark');
    var sunSVG = '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"' +
                 ' stroke-width="2" width="20" height="20" aria-hidden="true">' +
                 '<circle cx="12" cy="12" r="5"/>' +
                 '<line x1="12" y1="1"  x2="12" y2="3"/>' +
                 '<line x1="12" y1="21" x2="12" y2="23"/>' +
                 '<line x1="4.22" y1="4.22"   x2="5.64" y2="5.64"/>' +
                 '<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>' +
                 '<line x1="1"  y1="12" x2="3"  y2="12"/>' +
                 '<line x1="21" y1="12" x2="23" y2="12"/>' +
                 '<line x1="4.22" y1="19.78"  x2="5.64" y2="18.36"/>' +
                 '<line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"/>' +
                 '</svg>';
    var moonSVG= '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"' +
                 ' stroke-width="2" width="20" height="20" aria-hidden="true">' +
                 '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>' +
                 '</svg>';

    btn.innerHTML = isDark ? sunSVG : moonSVG;
    btn.setAttribute('aria-label',
      isDark ? 'Switch to light mode' : 'Switch to dark mode'
    );
  }

  /* ============================================================
     MOBILE MENU
     ============================================================ */

  function initMobileMenu() {
    var menuBtn   = document.getElementById('mobile-menu-btn') ||
                    document.querySelector('[data-mobile-menu-btn]');
    var menuPanel = document.getElementById('mobile-menu') ||
                    document.querySelector('[data-mobile-menu]');

    if (!menuBtn || !menuPanel) return;

    var isOpen = false;

    function openMenu() {
      isOpen = true;
      menuPanel.hidden = false;
      menuPanel.setAttribute('aria-hidden', 'false');
      menuBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';

      /* Focus first link */
      var firstLink = menuPanel.querySelector('a, button');
      if (firstLink) setTimeout(function () { firstLink.focus(); }, 50);
    }

    function closeMenu() {
      isOpen = false;
      menuPanel.hidden = true;
      menuPanel.setAttribute('aria-hidden', 'true');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      menuBtn.focus();
    }

    menuBtn.addEventListener('click', function () {
      isOpen ? closeMenu() : openMenu();
    });

    /* Close on Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) closeMenu();
    });

    /* Close on overlay click */
    menuPanel.addEventListener('click', function (e) {
      if (e.target === menuPanel) closeMenu();
    });

    /* Close when nav link clicked */
    menuPanel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ============================================================
     HEADER SEARCH INIT
     (Overlay search — full logic in search.js)
     ============================================================ */

  function initHeaderSearch() {
    var searchBtn = document.getElementById('search-trigger') ||
                    document.querySelector('[data-search-trigger]');
    var searchOverlay = document.getElementById('search-overlay') ||
                        document.querySelector('[data-search-overlay]');

    if (!searchBtn || !searchOverlay) return;

    searchBtn.addEventListener('click', function () {
      searchOverlay.hidden = false;
      searchOverlay.setAttribute('aria-hidden', 'false');
      var input = searchOverlay.querySelector('input[type="search"]');
      if (input) setTimeout(function () { input.focus(); }, 50);
    });

    /* Close overlay */
    var closeBtn = searchOverlay.querySelector('[data-search-close]') ||
                   searchOverlay.querySelector('.search-overlay__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        searchOverlay.hidden = true;
        searchOverlay.setAttribute('aria-hidden', 'true');
        searchBtn.focus();
      });
    }

    /* Escape key */
    searchOverlay.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        searchOverlay.hidden = true;
        searchOverlay.setAttribute('aria-hidden', 'true');
        searchBtn.focus();
      }
    });
  }

  /* ============================================================
     SCROLL TO TOP BUTTON
     ============================================================ */

  function initScrollTop() {
    /* Create button if not in HTML */
    var btn = document.getElementById('scroll-top-btn');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'scroll-top-btn';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Scroll to top');
      btn.innerHTML =
        '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"' +
        ' stroke-width="2.5" width="20" height="20" aria-hidden="true">' +
        '<polyline points="18 15 12 9 6 15"/>' +
        '</svg>';
      document.body.appendChild(btn);
    }

    /* Show/hide on scroll */
    var THRESHOLD = 400;
    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY > THRESHOLD;
      btn.classList.toggle('visible', scrolled);
    }, { passive: true });

    /* Scroll to top on click */
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================================
     REVEAL ANIMATIONS
     IntersectionObserver for .reveal elements
     ============================================================ */

  function initRevealAnimations() {
    var elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    if (!window.IntersectionObserver) {
      elements.forEach(function (el) {
        el.classList.add('revealed');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold:  0.08,
      rootMargin: '0px 0px -30px 0px'
    });

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ============================================================
     READING PROGRESS BAR
     ============================================================ */

  function initReadingProgress() {
    var bar = document.getElementById('reading-progress');
    if (!bar) return;

    function update() {
      var doc    = document.documentElement;
      var top    = doc.scrollTop || document.body.scrollTop;
      var height = doc.scrollHeight - doc.clientHeight;
      var pct    = height > 0 ? Math.min(Math.round((top / height) * 100), 100) : 0;
      bar.style.width = pct + '%';
      bar.setAttribute('aria-valuenow', pct);
    }

    window.addEventListener('scroll', function () {
      requestAnimationFrame(update);
    }, { passive: true });
  }

  /* ============================================================
     TOAST SYSTEM
     ============================================================ */

  function showToast(message, type, duration) {
    type     = type     || 'info';
    duration = duration || 4000;

    var container = document.getElementById('toast-container');
    if (!container) return;

    var icons = {
      success: '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2.5" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      error:   '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2.5" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      warning: '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2.5" aria-hidden="true"><path d="m10.29 3.86-8.19 14.2A1 1 0 0 0 3 20h18a1 1 0 0 0 .9-1.45L13.7 3.86a1 1 0 0 0-1.79.01z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      info:    '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2.5" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
    };

    var toast = document.createElement('div');
    toast.className = 'toast toast--' + type;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.innerHTML = [
      '<div class="toast__icon">', icons[type] || icons.info, '</div>',
      '<div class="toast__content">',
        '<p class="toast__message">', esc(message), '</p>',
      '</div>',
      '<button class="toast__close" type="button" aria-label="Dismiss">',
        '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"',
            ' stroke-width="2.5" width="14" height="14" aria-hidden="true">',
          '<line x1="18" y1="6" x2="6" y2="18"/>',
          '<line x1="6" y1="6" x2="18" y2="18"/>',
        '</svg>',
      '</button>',
      '<div class="toast__progress" style="animation-duration:' + duration + 'ms;"></div>'
    ].join('');

    /* Close handler */
    toast.querySelector('.toast__close').addEventListener('click', function () {
      removeToast(toast);
    });

    container.appendChild(toast);

    /* Auto-remove */
    var timer = setTimeout(function () {
      removeToast(toast);
    }, duration);

    toast._timer = timer;
  }

  function removeToast(toast) {
    if (toast._timer) clearTimeout(toast._timer);
    toast.classList.add('toast--leaving');
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }

  /* ============================================================
     SKIP LINK
     ============================================================ */

  function initSkipLink() {
    var skipLink = document.querySelector('.skip-link');
    if (!skipLink) return;

    skipLink.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.getElementById('main-content');
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  /* ============================================================
     SERVICE WORKER REGISTRATION
     ============================================================ */

  function registerSW() {
    if (!('serviceWorker' in navigator)) return;
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js')
        .then(function (reg) {
          /* Check for updates */
          reg.addEventListener('updatefound', function () {
            var newWorker = reg.installing;
            if (!newWorker) return;
            newWorker.addEventListener('statechange', function () {
              if (newWorker.state === 'installed' &&
                  navigator.serviceWorker.controller) {
                showToast(
                  'New version available. Refresh to update.',
                  'info',
                  8000
                );
              }
            });
          });
        })
        .catch(function () { /* Silent fail */ });
    });
  }

  /* ============================================================
     EXTERNAL LINK SAFETY
     Add rel="noopener noreferrer" to all external links
     ============================================================ */

  function secureExternalLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(function (link) {
      if (!link.hostname || link.hostname === window.location.hostname) return;
      if (!link.rel.includes('noopener')) {
        link.rel = (link.rel ? link.rel + ' ' : '') + 'noopener noreferrer';
      }
      if (!link.target) {
        link.target = '_blank';
      }
    });
  }

  /* ============================================================
     MAIN INIT
     ============================================================ */

  function init() {

    /* 1. Inject components in parallel */
    Promise.all([
      injectHeader(),
      injectFooter(),
      injectSidebar()
    ]).then(function () {

      /* 2. Post-inject setup */
      initScrollTop();
      initRevealAnimations();
      initReadingProgress();
      initSkipLink();
      secureExternalLinks();

      /* 3. Register SW */
      registerSW();

      /* 4. Dispatch app ready */
      window.dispatchEvent(new CustomEvent('trabahoApp:ready'));

    });
  }

  /* ============================================================
     BOOT
     ============================================================ */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ============================================================
     EXPOSE PUBLIC API
     ============================================================ */

  window.TrabahoApp = {
  showToast:    showToast,
  removeToast:  removeToast,
  initReveal:   initRevealAnimations,
  onReady:      function (callback) {
    if (document.readyState !== 'loading') {
      callback();
    } else {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    }
  }
};

}());
