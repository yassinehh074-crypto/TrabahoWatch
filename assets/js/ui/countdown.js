/* ============================================================
   ASSETS/JS/UI/COUNTDOWN.JS — Multi-instance countdown timer
   Reads data-countdown attribute for target date
   Updates days/hours/minutes/seconds every second
   Pauses when tab is hidden (Visibility API)
   TrabahoWatch v1.0
   ============================================================ */

'use strict';

(function () {

  /* ============================================================
     ACTIVE INSTANCES
     ============================================================ */

  var instances = [];
  var globalInterval = null;
  var isPaused = false;

  /* ============================================================
     PARSE TARGET DATE FROM ELEMENT
     Supports:
       data-countdown="2026-08-16"
       data-countdown="2026-08-16T08:00:00"
       data-countdown="2026-08-16T08:00:00+08:00"
     ============================================================ */

  function parseTargetDate(el) {
    var raw = el.dataset.countdown;
    if (!raw) return null;

    /* Add Philippine time offset if no timezone specified */
    if (raw.length === 10) {
      /* Date only: YYYY-MM-DD → treat as midnight PHT (UTC+8) */
      raw = raw + 'T00:00:00+08:00';
    } else if (raw.length === 19 && raw.indexOf('+') === -1 && raw.indexOf('Z') === -1) {
      /* DateTime without timezone → assume PHT */
      raw = raw + '+08:00';
    }

    var date = new Date(raw);
    return isNaN(date.getTime()) ? null : date;
  }

  /* ============================================================
     CALCULATE TIME REMAINING
     Returns { days, hours, minutes, seconds, total, expired }
     ============================================================ */

  function getTimeRemaining(targetDate) {
    var now   = new Date();
    var total = targetDate - now;

    if (total <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0, expired: true };
    }

    var seconds = Math.floor((total / 1000) % 60);
    var minutes = Math.floor((total / 1000 / 60) % 60);
    var hours   = Math.floor((total / 1000 / 60 / 60) % 24);
    var days    = Math.floor(total / 1000 / 60 / 60 / 24);

    return { days: days, hours: hours, minutes: minutes, seconds: seconds, total: total, expired: false };
  }

  /* ============================================================
     PAD NUMBER TO 2 DIGITS
     ============================================================ */

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  /* ============================================================
     BUILD AN INSTANCE FROM A ROOT ELEMENT
     ============================================================ */

  function buildInstance(rootEl) {
    var targetDate = parseTargetDate(rootEl);
    if (!targetDate) return null;

    /* Find display elements */
    var daysEl    = rootEl.querySelector('[data-countdown-days] [data-countdown-number]')    ||
                    rootEl.querySelector('[data-countdown-days]');
    var hoursEl   = rootEl.querySelector('[data-countdown-hours] [data-countdown-number]')   ||
                    rootEl.querySelector('[data-countdown-hours]');
    var minutesEl = rootEl.querySelector('[data-countdown-minutes] [data-countdown-number]') ||
                    rootEl.querySelector('[data-countdown-minutes]');
    var secondsEl = rootEl.querySelector('[data-countdown-seconds] [data-countdown-number]') ||
                    rootEl.querySelector('[data-countdown-seconds]');

    /* At least one display element must exist */
    if (!daysEl && !hoursEl && !minutesEl && !secondsEl) return null;

    var instance = {
      rootEl:     rootEl,
      targetDate: targetDate,
      daysEl:     daysEl,
      hoursEl:    hoursEl,
      minutesEl:  minutesEl,
      secondsEl:  secondsEl,
      expired:    false,
      label:      rootEl.dataset.countdownLabel || 'Countdown'
    };

    return instance;
  }

  /* ============================================================
     UPDATE A SINGLE INSTANCE
     ============================================================ */

  function updateInstance(instance) {
    if (instance.expired) return;

    var t = getTimeRemaining(instance.targetDate);

    if (t.expired) {
      instance.expired = true;
      onExpired(instance);
      return;
    }

    /* Update display elements */
    if (instance.daysEl) {
      instance.daysEl.textContent = String(t.days);
      instance.daysEl.setAttribute('aria-label', t.days + ' days');
    }

    if (instance.hoursEl) {
      instance.hoursEl.textContent = pad(t.hours);
      instance.hoursEl.setAttribute('aria-label', t.hours + ' hours');
    }

    if (instance.minutesEl) {
      instance.minutesEl.textContent = pad(t.minutes);
      instance.minutesEl.setAttribute('aria-label', t.minutes + ' minutes');
    }

    if (instance.secondsEl) {
      instance.secondsEl.textContent = pad(t.seconds);
      instance.secondsEl.setAttribute('aria-label', t.seconds + ' seconds');
    }

    /* Update live region for screen readers every minute */
    if (t.seconds === 0) {
      instance.rootEl.setAttribute(
        'aria-label',
        instance.label + ': ' + t.days + ' days, ' +
        t.hours + ' hours, ' + t.minutes + ' minutes remaining'
      );
    }
  }

  /* ============================================================
     ON EXPIRED
     ============================================================ */

  function onExpired(instance) {
    /* Zero out all displays */
    [instance.daysEl, instance.hoursEl,
     instance.minutesEl, instance.secondsEl].forEach(function (el) {
      if (el) el.textContent = '00';
    });
    if (instance.daysEl) instance.daysEl.textContent = '0';

    /* Add expired class to root */
    instance.rootEl.classList.add('countdown--expired');
    instance.rootEl.setAttribute('aria-label', instance.label + ': Expired');

    /* Dispatch event */
    instance.rootEl.dispatchEvent(new CustomEvent('countdown:expired', {
      bubbles: true,
      detail: { label: instance.label }
    }));

    /* Remove from instances */
    instances = instances.filter(function (i) { return i !== instance; });

    /* Stop global ticker if no more instances */
    if (instances.length === 0) {
      stopTicker();
    }
  }

  /* ============================================================
     FLIP ANIMATION (optional — triggered on second change)
     ============================================================ */

  function triggerFlip(el) {
    if (!el) return;
    el.classList.remove('flip');
    /* Force reflow */
    void el.offsetWidth;
    el.classList.add('flip');
  }

  /* ============================================================
     GLOBAL TICK — updates all instances every second
     ============================================================ */

  function tick() {
    if (isPaused) return;

    instances.forEach(function (instance) {
      /* Flip animation on seconds element */
      triggerFlip(instance.secondsEl);
      updateInstance(instance);
    });
  }

  /* ============================================================
     START / STOP TICKER
     ============================================================ */

  function startTicker() {
    if (globalInterval) return;
    globalInterval = setInterval(tick, 1000);
  }

  function stopTicker() {
    if (globalInterval) {
      clearInterval(globalInterval);
      globalInterval = null;
    }
  }

  /* ============================================================
     VISIBILITY API — pause when tab is hidden
     ============================================================ */

  function initVisibilityHandler() {
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        isPaused = true;
      } else {
        isPaused = false;
        /* Immediately update all instances when tab becomes visible */
        instances.forEach(updateInstance);
      }
    });
  }

  /* ============================================================
     DISCOVER AND INIT ALL COUNTDOWN ELEMENTS
     ============================================================ */

  function initAll() {
    var elements = document.querySelectorAll('[data-countdown]');
    if (elements.length === 0) return;

    elements.forEach(function (el) {
      var instance = buildInstance(el);
      if (!instance) return;

      /* Initial update immediately */
      updateInstance(instance);

      /* Only add to ticker if not already expired */
      if (!instance.expired) {
        instances.push(instance);
      }
    });

    /* Start global ticker if we have active instances */
    if (instances.length > 0) {
      startTicker();
      initVisibilityHandler();
    }
  }

  /* ============================================================
     PUBLIC API — add a countdown programmatically
     ============================================================ */

  function addCountdown(el) {
    /* Skip if already initialized */
    if (el.dataset.countdownInit) return;
    el.dataset.countdownInit = 'true';

    var instance = buildInstance(el);
    if (!instance) return;

    updateInstance(instance);

    if (!instance.expired) {
      instances.push(instance);
      startTicker();
    }
  }

  /* ============================================================
     OBSERVE DOM FOR DYNAMIC COUNTDOWN ELEMENTS
     ============================================================ */

  function observeDOM() {
    if (!window.MutationObserver) return;

    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return;

          /* Check node itself */
          if (node.dataset && node.dataset.countdown &&
              !node.dataset.countdownInit) {
            node.dataset.countdownInit = 'true';
            addCountdown(node);
          }

          /* Check descendants */
          if (node.querySelectorAll) {
            node.querySelectorAll('[data-countdown]').forEach(function (el) {
              if (!el.dataset.countdownInit) {
                el.dataset.countdownInit = 'true';
                addCountdown(el);
              }
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree:   true
    });
  }

  /* ============================================================
     CSS FOR FLIP ANIMATION
     Injected once if not already in stylesheet
     ============================================================ */

  function injectFlipStyles() {
    if (document.getElementById('countdown-flip-styles')) return;

    var style = document.createElement('style');
    style.id  = 'countdown-flip-styles';
    style.textContent = [
      '@keyframes countdown-flip {',
      '  0%   { transform: rotateX(0deg);   }',
      '  50%  { transform: rotateX(-90deg); }',
      '  100% { transform: rotateX(0deg);   }',
      '}',
      '.csc-countdown__number.flip {',
      '  animation: countdown-flip 0.4s ease;',
      '}',
      '@media (prefers-reduced-motion: reduce) {',
      '  .csc-countdown__number.flip {',
      '    animation: none;',
      '  }',
      '}'
    ].join('\n');

    document.head.appendChild(style);
  }

  /* ============================================================
     INIT
     ============================================================ */

  function init() {
    injectFlipStyles();
    initAll();
    observeDOM();
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

  window.TrabahoCountdown = {
    add:  addCountdown,
    stop: stopTicker,
    start: startTicker,
    instances: instances
  };

}());