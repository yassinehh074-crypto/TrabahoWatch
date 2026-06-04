/* ============================================================
   ASSETS/JS/UI/READING-PROGRESS.JS — Reading progress bar
   Tracks scroll position relative to article content
   Updates #reading-progress width
   TrabahoWatch v1.0
   ============================================================ */

'use strict';

(function () {

  /* ============================================================
     CONFIG
     ============================================================ */

  var BAR_ID          = 'reading-progress';
  var CONTENT_SELECTOR = [
    '.article-wrap',
    '.article-section',
    '#main-content',
    'main'
  ].join(', ');

  /* ============================================================
     STATE
     ============================================================ */

  var barEl        = null;
  var contentEl    = null;
  var ticking      = false;
  var lastProgress = -1;

  /* ============================================================
     GET CONTENT ELEMENT
     Find the best element to measure scroll against
     ============================================================ */

  function getContentElement() {
    /* Try specific article wrap first */
    var el = document.querySelector('.article-wrap');
    if (el) return el;

    /* Try main content */
    el = document.getElementById('main-content');
    if (el) return el;

    /* Fallback to document */
    return document.documentElement;
  }

  /* ============================================================
     CALCULATE PROGRESS
     Returns 0–100
     ============================================================ */

  function calculateProgress() {
    var scrollTop = window.scrollY || window.pageYOffset ||
                    document.documentElement.scrollTop;

    if (!contentEl || contentEl === document.documentElement) {
      /* Document-level progress */
      var doc    = document.documentElement;
      var height = doc.scrollHeight - doc.clientHeight;
      if (height <= 0) return 100;
      return Math.min(Math.round((scrollTop / height) * 100), 100);
    }

    /* Content-element-based progress */
    var rect        = contentEl.getBoundingClientRect();
    var contentTop  = scrollTop + rect.top;
    var contentHeight = contentEl.offsetHeight;
    var viewHeight  = window.innerHeight;

    /* Start progress when content enters viewport */
    var start = contentTop - viewHeight;
    /* End progress when content bottom reaches viewport bottom */
    var end   = contentTop + contentHeight - viewHeight;
    var range = end - start;

    if (range <= 0) return 100;

    var progress = ((scrollTop - start) / range) * 100;
    return Math.min(Math.max(Math.round(progress), 0), 100);
  }

  /* ============================================================
     UPDATE BAR
     ============================================================ */

  function updateBar() {
    ticking = false;

    if (!barEl) return;

    var progress = calculateProgress();

    /* Skip if unchanged */
    if (progress === lastProgress) return;
    lastProgress = progress;

    /* Update width */
    barEl.style.width = progress + '%';

    /* Update ARIA */
    barEl.setAttribute('aria-valuenow', progress);

    /* Color shift as reading progresses */
    if (progress >= 100) {
      barEl.style.background = 'linear-gradient(90deg, #16a34a 0%, #0891b2 100%)';
    } else if (progress >= 50) {
      barEl.style.background = 'linear-gradient(90deg, var(--color-primary) 0%, #0891b2 100%)';
    } else {
      barEl.style.background = 'linear-gradient(90deg, var(--color-primary) 0%, #0891b2 100%)';
    }
  }

  /* ============================================================
     SCROLL HANDLER — RAF throttled
     ============================================================ */

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateBar);
    }
  }

  /* ============================================================
     CREATE BAR IF NOT IN DOM
     ============================================================ */

  function ensureBar() {
    barEl = document.getElementById(BAR_ID);

    if (!barEl) {
      barEl = document.createElement('div');
      barEl.id = BAR_ID;
      barEl.setAttribute('role', 'progressbar');
      barEl.setAttribute('aria-valuenow', '0');
      barEl.setAttribute('aria-valuemin', '0');
      barEl.setAttribute('aria-valuemax', '100');
      barEl.setAttribute('aria-label', 'Reading progress');
      barEl.style.cssText = [
        'position:fixed',
        'top:0',
        'left:0',
        'height:3px',
        'width:0%',
        'background:linear-gradient(90deg, var(--color-primary) 0%, #0891b2 100%)',
        'z-index:var(--z-progress, 9999)',
        'transition:width 0.1s linear',
        'pointer-events:none'
      ].join(';');

      document.body.insertBefore(barEl, document.body.firstChild);
    }
  }

  /* ============================================================
     ONLY SHOW ON ARTICLE / LONG-FORM PAGES
     ============================================================ */

  function shouldShowProgress() {
    var page = document.body.dataset.page || '';

    var articlePages = [
      'article',
      'salary-grade',
      'csc-exams',
      'salary-guide',
      'methodology',
      'privacy-policy',
      'about',
      'faq'
    ];

    /* Show on any page with article-wrap or long content */
    if (document.querySelector('.article-wrap')) return true;
    if (document.querySelector('.article-section')) return true;

    /* Show on designated page types */
    return articlePages.some(function (p) {
      return page.includes(p);
    });
  }

  /* ============================================================
     RESIZE HANDLER
     Recalculate on window resize
     ============================================================ */

  function onResize() {
    /* Reset cached values */
    lastProgress = -1;
    contentEl    = getContentElement();
    onScroll();
  }

  /* ============================================================
     INIT
     ============================================================ */

  function init() {
    /* Only on pages where it makes sense */
    if (!shouldShowProgress()) return;

    /* Ensure bar element exists */
    ensureBar();

    /* Find content element */
    contentEl = getContentElement();

    /* Bind scroll */
    window.addEventListener('scroll', onScroll, { passive: true });

    /* Bind resize */
    window.addEventListener('resize', onResize, { passive: true });

    /* Initial calculation */
    updateBar();
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
     PUBLIC API
     ============================================================ */

  window.TrabahoReadingProgress = {
    init:   init,
    update: updateBar,
    hide:   function () {
      if (barEl) barEl.style.display = 'none';
    },
    show:   function () {
      if (barEl) barEl.style.display = 'block';
    }
  };

}()); READY
  ---------------------------------------------------------- */
  if (window.TrabahoApp) {
    TrabahoApp.onReady(init);
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }


  /* ----------------------------------------------------------
     PUBLIC API
  ---------------------------------------------------------- */
  window.TrabahoReadingProgress = {
    update: updateBar,
    reset:  function () {
      if (state.barEl) {
        state.barEl.style.width = '0%';
        state.barEl.setAttribute('aria-valuenow', '0');
      }
    }
  };

}());