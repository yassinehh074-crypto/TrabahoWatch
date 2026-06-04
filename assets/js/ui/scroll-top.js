/* ============================================================
   FILE: assets/js/ui/scroll-top.js
   PURPOSE: Scroll-to-top button — show/hide based on
            scroll position, smooth scroll with fallback,
            keyboard accessible, AdSense-aware positioning.
   DEPENDS ON: app.js (may already create the button)
   LOAD ORDER: <script src="/assets/js/ui/scroll-top.js" defer>
   ============================================================ */


(function () {

  'use strict';


  /* ----------------------------------------------------------
     CONSTANTS
  ---------------------------------------------------------- */
  const BTN_ID           = 'scroll-top';
  const SHOW_THRESHOLD   = 400;    // px from top before showing
  const HIDE_THRESHOLD   = 300;    // px — hide again if back near top
  const SCROLL_DURATION  = 500;    // ms for manual smooth scroll
  const VISIBLE_CLASS    = 'visible';


  /* ----------------------------------------------------------
     STATE
  ---------------------------------------------------------- */
  const state = {
    isVisible:    false,
    isTicking:    false,
    lastScrollY:  0,
    animationId:  null   // for manual smooth scroll
  };


  /* ----------------------------------------------------------
     GET OR CREATE BUTTON
     If app.js already created it — use it.
     Otherwise create a new one.
  ---------------------------------------------------------- */
  function getOrCreateButton() {
    let btn = document.getElementById(BTN_ID);

    if (btn) return btn;

    btn = document.createElement('button');
    btn.id        = BTN_ID;
    btn.className = 'btn--icon-round';
    btn.setAttribute('aria-label', 'Scroll to top of page');
    btn.setAttribute('title',      'Back to top');
    btn.setAttribute('aria-hidden','true');   // hidden until visible

    btn.innerHTML =
      '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"' +
          ' stroke-width="2.5" width="20" height="20"' +
          ' aria-hidden="true">' +
        '<polyline points="18 15 12 9 6 15"/>' +
      '</svg>';

    document.body.appendChild(btn);
    return btn;
  }


  /* ----------------------------------------------------------
     SHOW BUTTON
  ---------------------------------------------------------- */
  function showButton(btn) {
    if (state.isVisible) return;
    state.isVisible = true;

    btn.classList.add(VISIBLE_CLASS);
    btn.setAttribute('aria-hidden', 'false');
    btn.removeAttribute('tabindex');
  }


  /* ----------------------------------------------------------
     HIDE BUTTON
  ---------------------------------------------------------- */
  function hideButton(btn) {
    if (!state.isVisible) return;
    state.isVisible = false;

    btn.classList.remove(VISIBLE_CLASS);
    btn.setAttribute('aria-hidden', 'true');
    btn.setAttribute('tabindex', '-1');
  }


  /* ----------------------------------------------------------
     HANDLE SCROLL
     Throttled via requestAnimationFrame.
  ---------------------------------------------------------- */
  function handleScroll(btn) {
    state.lastScrollY = window.scrollY;

    if (!state.isTicking) {
      requestAnimationFrame(function () {
        updateVisibility(btn, state.lastScrollY);
        state.isTicking = false;
      });
      state.isTicking = true;
    }
  }


  /* ----------------------------------------------------------
     UPDATE VISIBILITY
     Shows/hides based on scroll position.
  ---------------------------------------------------------- */
  function updateVisibility(btn, scrollY) {
    if (scrollY > SHOW_THRESHOLD) {
      showButton(btn);
    } else if (scrollY < HIDE_THRESHOLD) {
      hideButton(btn);
    }
  }


  /* ----------------------------------------------------------
     SMOOTH SCROLL TO TOP
     Uses native smooth scroll with polyfill fallback.
  ---------------------------------------------------------- */
  function scrollToTop() {
    // Cancel any existing scroll animation
    if (state.animationId) {
      cancelAnimationFrame(state.animationId);
      state.animationId = null;
    }

    // Native smooth scroll — supported in modern browsers
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Polyfill — eased scroll for Safari < 15.4
    const startY    = window.scrollY;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / SCROLL_DURATION, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);

      window.scrollTo(0, startY * (1 - eased));

      if (progress < 1) {
        state.animationId = requestAnimationFrame(step);
      } else {
        state.animationId = null;
        // Ensure we're exactly at 0
        window.scrollTo(0, 0);
      }
    }

    state.animationId = requestAnimationFrame(step);
  }


  /* ----------------------------------------------------------
     HANDLE ADSENSE OVERLAP
     Raises button if AdSense floating ad is present.
     Checks for common AdSense containers near bottom-right.
  ---------------------------------------------------------- */
  function avoidAdSenseOverlap() {
    // Watch for AdSense iframe insertion near bottom
    if (!window.MutationObserver) return;

    const observer = new MutationObserver(function () {
      const adFrames = document.querySelectorAll(
        'ins.adsbygoogle[data-ad-format="autorelaxed"],' +
        'ins.adsbygoogle[data-ad-slot]'
      );

      adFrames.forEach(function (ad) {
        const rect = ad.getBoundingClientRect();

        // If ad is in bottom-right quadrant
        if (
          rect.bottom > window.innerHeight * 0.6 &&
          rect.right  > window.innerWidth  * 0.6
        ) {
          // Raise scroll-top button above the ad
          const btn = document.getElementById(BTN_ID);
          if (btn) {
            const adHeight = rect.height + 16;
            btn.style.setProperty(
              '--scroll-top-bottom',
              'calc(var(--space-6) + ' + adHeight + 'px)'
            );
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree:   true
    });

    // Clean up after 10s — ads load quickly
    setTimeout(function () {
      observer.disconnect();
    }, 10000);
  }


  /* ----------------------------------------------------------
     BIND KEYBOARD
     Enter and Space activate the button.
     Already handled by browser for <button> —
     but we add explicit handling for safety.
  ---------------------------------------------------------- */
  function bindKeyboard(btn) {
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        scrollToTop();

        // Return focus to first focusable element at top
        setTimeout(function () {
          const firstFocusable = document.querySelector(
            'a[href], button:not([disabled]), input, [tabindex="0"]'
          );
          if (firstFocusable && firstFocusable.id !== BTN_ID) {
            firstFocusable.focus();
          }
        }, SCROLL_DURATION);
      }
    });
  }


  /* ----------------------------------------------------------
     BIND FOCUS TRAP PREVENTION
     When button is focused via Tab,
     scrolling past it shouldn't hide it mid-focus.
  ---------------------------------------------------------- */
  function bindFocusGuard(btn) {
    btn.addEventListener('focus', function () {
      // Force visible while focused
      showButton(btn);
    });

    btn.addEventListener('blur', function () {
      // Re-check visibility on blur
      updateVisibility(btn, window.scrollY);
    });
  }


  /* ----------------------------------------------------------
     INJECT CSS VARIABLE OVERRIDE
     Allows --scroll-top-bottom to be set dynamically.
  ---------------------------------------------------------- */
  function injectPositionOverride() {
    if (document.getElementById('scroll-top-override')) return;

    const style = document.createElement('style');
    style.id    = 'scroll-top-override';
    style.textContent = `
      #scroll-top {
        bottom: var(--scroll-top-bottom, var(--space-6));
      }
    `;
    document.head.appendChild(style);
  }


  /* ============================================================
     PROGRESS RING (OPTIONAL)
     Visual reading progress ring around the button.
     Only shown on article pages.
     ============================================================ */

  /* ----------------------------------------------------------
     ADD PROGRESS RING
     SVG ring that fills as user scrolls down.
  ---------------------------------------------------------- */
  function addProgressRing(btn) {
    // Only on article pages
    if (document.body.getAttribute('data-page') !== 'article') return;

    const ring = document.createElement('svg');
    ring.className = 'scroll-top-ring';
    ring.setAttribute('viewBox',   '0 0 44 44');
    ring.setAttribute('aria-hidden', 'true');
    ring.style.cssText =
      'position:absolute;inset:-4px;width:calc(100% + 8px);' +
      'height:calc(100% + 8px);pointer-events:none;' +
      'transform:rotate(-90deg);';

    const circle = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    );

    const radius        = 20;
    const circumference = 2 * Math.PI * radius;

    circle.setAttribute('cx',           '22');
    circle.setAttribute('cy',           '22');
    circle.setAttribute('r',            String(radius));
    circle.setAttribute('fill',         'none');
    circle.setAttribute('stroke',       'var(--color-primary)');
    circle.setAttribute('stroke-width', '2.5');
    circle.setAttribute('stroke-linecap', 'round');
    circle.style.strokeDasharray  = circumference + 'px';
    circle.style.strokeDashoffset = circumference + 'px';
    circle.style.transition        = 'stroke-dashoffset 0.1s linear';
    circle.style.opacity           = '0.6';

    ring.appendChild(circle);

    // Make button relative for ring positioning
    btn.style.position = 'relative';
    btn.appendChild(ring);

    // Update ring on scroll
    let ringTicking = false;

    window.addEventListener('scroll', function () {
      if (!ringTicking) {
        requestAnimationFrame(function () {
          const docH    = document.documentElement.scrollHeight
                        - window.innerHeight;
          const progress = docH > 0
            ? Math.min(window.scrollY / docH, 1)
            : 0;

          const offset = circumference * (1 - progress);
          circle.style.strokeDashoffset = offset + 'px';
          ringTicking = false;
        });
        ringTicking = true;
      }
    }, { passive: true });
  }


  /* ============================================================
     MAIN INIT
     ============================================================ */

  function init() {
    injectPositionOverride();

    const btn = getOrCreateButton();

    // Initial state — hidden
    hideButton(btn);

    // Bind click
    btn.addEventListener('click', scrollToTop);

    // Bind keyboard
    bindKeyboard(btn);

    // Bind focus guard
    bindFocusGuard(btn);

    // Scroll listener — throttled
    window.addEventListener('scroll', function () {
      handleScroll(btn);
    }, { passive: true });

    // Check initial position
    // (user might have loaded page mid-scroll)
    updateVisibility(btn, window.scrollY);

    // AdSense overlap avoidance
    avoidAdSenseOverlap();

    // Progress ring on article pages
    addProgressRing(btn);

    // Clean up scroll animation on page unload
    window.addEventListener('beforeunload', function () {
      if (state.animationId) {
        cancelAnimationFrame(state.animationId);
      }
    });
  }


  /* ----------------------------------------------------------
     DOM READY
     Wait for app:ready if app.js is present —
     button might already exist.
  ---------------------------------------------------------- */
  if (window.TrabahoApp) {
    TrabahoApp.onReady(init);
  } else {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }


  /* ----------------------------------------------------------
     PUBLIC API
     window.TrabahoScrollTop
  ---------------------------------------------------------- */
  window.TrabahoScrollTop = {

    scrollToTop: scrollToTop,

    show: function () {
      const btn = document.getElementById(BTN_ID);
      if (btn) showButton(btn);
    },

    hide: function () {
      const btn = document.getElementById(BTN_ID);
      if (btn) hideButton(btn);
    },

    setBottomOffset: function (px) {
      const btn = document.getElementById(BTN_ID);
      if (btn) {
        btn.style.setProperty(
          '--scroll-top-bottom',
          'calc(var(--space-6) + ' + px + 'px)'
        );
      }
    }

  };

}());