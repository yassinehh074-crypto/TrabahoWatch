/* ============================================================
   ASSETS/JS/UTILS/DOM.JS — DOM manipulation utilities
   TrabahoWatch v1.0
   ============================================================ */

'use strict';

(function () {

  /* ── $ / $$ — query selectors ───────────────────────────── */
  function $(selector, context) {
    return (context || document).querySelector(selector);
  }

  function $$(selector, context) {
    return Array.from((context || document).querySelectorAll(selector));
  }

  /* ── Create Element ──────────────────────────────────────── */
  function createElement(tag, attrs, children) {
    var el = document.createElement(tag);

    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        if (key === 'className') {
          el.className = attrs[key];
        } else if (key === 'innerHTML') {
          el.innerHTML = attrs[key];
        } else if (key === 'textContent') {
          el.textContent = attrs[key];
        } else if (key.startsWith('data-')) {
          el.setAttribute(key, attrs[key]);
        } else if (key === 'style' && typeof attrs[key] === 'object') {
          Object.assign(el.style, attrs[key]);
        } else {
          el.setAttribute(key, attrs[key]);
        }
      });
    }

    if (children) {
      if (typeof children === 'string') {
        el.textContent = children;
      } else if (Array.isArray(children)) {
        children.forEach(function (child) {
          if (child) el.appendChild(
            typeof child === 'string'
              ? document.createTextNode(child)
              : child
          );
        });
      } else {
        el.appendChild(children);
      }
    }

    return el;
  }

  /* ── Event binding ───────────────────────────────────────── */
  function on(el, event, handler, options) {
    if (!el) return function () {};
    el.addEventListener(event, handler, options || false);
    return function () {
      el.removeEventListener(event, handler, options || false);
    };
  }

  function off(el, event, handler) {
    if (!el) return;
    el.removeEventListener(event, handler);
  }

  /* ── Event delegation ────────────────────────────────────── */
  function delegate(parent, selector, event, handler) {
    if (!parent) return function () {};

    function listener(e) {
      var target = e.target.closest(selector);
      if (target && parent.contains(target)) {
        handler.call(target, e, target);
      }
    }

    parent.addEventListener(event, listener);
    return function () {
      parent.removeEventListener(event, listener);
    };
  }

  /* ── Emit custom event ───────────────────────────────────── */
  function emit(el, eventName, detail) {
    var event = new CustomEvent(eventName, {
      bubbles:    true,
      cancelable: true,
      detail:     detail || {}
    });
    (el || window).dispatchEvent(event);
    return event;
  }

  /* ── IntersectionObserver wrapper ────────────────────────── */
  function onVisible(el, callback, options) {
    if (!el || !callback) return function () {};

    if (!window.IntersectionObserver) {
      callback(el);
      return function () {};
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          callback(entry.target);
          if (!options || !options.repeat) {
            observer.unobserve(entry.target);
          }
        }
      });
    }, {
      threshold:  options && options.threshold  || 0.1,
      rootMargin: options && options.rootMargin || '0px'
    });

    observer.observe(el);
    return function () { observer.unobserve(el); };
  }

  /* ── Trap Focus (for modals) ─────────────────────────────── */
  function trapFocus(el) {
    if (!el) return function () {};

    var focusable = el.querySelectorAll(
      'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])'
    );
    var first = focusable[0];
    var last  = focusable[focusable.length - 1];

    function handler(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    el.addEventListener('keydown', handler);
    if (first) first.focus();

    return function () {
      el.removeEventListener('keydown', handler);
    };
  }

  /* ── Toggle visibility ───────────────────────────────────── */
  function show(el) {
    if (!el) return;
    el.hidden = false;
    el.removeAttribute('aria-hidden');
  }

  function hide(el) {
    if (!el) return;
    el.hidden = true;
    el.setAttribute('aria-hidden', 'true');
  }

  function toggle(el, force) {
    if (!el) return;
    var shouldShow = force !== undefined ? force : el.hidden;
    shouldShow ? show(el) : hide(el);
  }

  /* ── Set HTML safely ─────────────────────────────────────── */
  function setHTML(el, html) {
    if (!el) return;
    el.innerHTML = html;
  }

  /* ── Set text safely ─────────────────────────────────────── */
  function setText(el, text) {
    if (!el) return;
    el.textContent = text;
  }

  /* ── Add / remove loading state ──────────────────────────── */
  function setLoading(el, isLoading) {
    if (!el) return;
    el.setAttribute('aria-busy', String(isLoading));
    if (isLoading) {
      el.dataset.prevHtml = el.innerHTML;
      el.classList.add('skeleton-wave');
    } else {
      el.classList.remove('skeleton-wave');
      delete el.dataset.prevHtml;
    }
  }

  /* ── Scroll to element ───────────────────────────────────── */
  function scrollTo(el, offset) {
    if (!el) return;
    offset = offset || 80; /* account for sticky header */
    var top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  /* ── Debounce ────────────────────────────────────────────── */
  function debounce(fn, delay) {
    var timer;
    return function () {
      var args    = arguments;
      var context = this;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay || 300);
    };
  }

  /* ── Throttle ────────────────────────────────────────────── */
  function throttle(fn, limit) {
    var lastTime = 0;
    return function () {
      var now = Date.now();
      if (now - lastTime >= (limit || 100)) {
        lastTime = now;
        fn.apply(this, arguments);
      }
    };
  }

  /* ── Ready ───────────────────────────────────────────────── */
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    }
  }

  /* ── Expose globally ─────────────────────────────────────── */
  window.TrabahoDOM = {
    $:         $,
    $$:        $$,
    el:        createElement,
    on:        on,
    off:       off,
    delegate:  delegate,
    emit:      emit,
    onVisible: onVisible,
    trapFocus: trapFocus,
    show:      show,
    hide:      hide,
    toggle:    toggle,
    setHTML:   setHTML,
    setText:   setText,
    setLoading:setLoading,
    scrollTo:  scrollTo,
    debounce:  debounce,
    throttle:  throttle,
    ready:     ready
  };

}());sArray(content) ? content : [content];
    items.forEach(function (item) {
      if (item instanceof Node) {
        el.appendChild(item);
      } else if (typeof item === 'string') {
        el.appendChild(document.createTextNode(item));
      }
    });
  }


  /* ============================================================
     CLASS MANIPULATION
     ============================================================ */

  /* ----------------------------------------------------------
     ADD CLASS — with null safety
  ---------------------------------------------------------- */
  function addClass(el, className) {
    if (!el || !className) return;
    className.split(' ').forEach(function (c) {
      if (c) el.classList.add(c);
    });
  }


  /* ----------------------------------------------------------
     REMOVE CLASS — with null safety
  ---------------------------------------------------------- */
  function removeClass(el, className) {
    if (!el || !className) return;
    className.split(' ').forEach(function (c) {
      if (c) el.classList.remove(c);
    });
  }


  /* ----------------------------------------------------------
     TOGGLE CLASS
  ---------------------------------------------------------- */
  function toggleClass(el, className, force) {
    if (!el || !className) return;
    if (force !== undefined) {
      el.classList.toggle(className, force);
    } else {
      el.classList.toggle(className);
    }
  }


  /* ----------------------------------------------------------
     HAS CLASS
  ---------------------------------------------------------- */
  function hasClass(el, className) {
    if (!el || !className) return false;
    return el.classList.contains(className);
  }


  /* ----------------------------------------------------------
     SET CLASSES
     Replaces all classes with new set.
  ---------------------------------------------------------- */
  function setClass(el, className) {
    if (!el) return;
    el.className = className || '';
  }


  /* ============================================================
     VISIBILITY
     ============================================================ */

  /* ----------------------------------------------------------
     SHOW / HIDE
     Uses display property.
  ---------------------------------------------------------- */
  function show(el, displayValue) {
    if (!el) return;
    el.style.display = displayValue || '';
  }

  function hide(el) {
    if (!el) return;
    el.style.display = 'none';
  }

  function toggle(el, visible, displayValue) {
    if (!el) return;
    if (visible === undefined) {
      visible = el.style.display === 'none';
    }
    el.style.display = visible ? (displayValue || '') : 'none';
  }


  /* ----------------------------------------------------------
     IS VISIBLE
     Returns true if element is visible in the DOM.
  ---------------------------------------------------------- */
  function isVisible(el) {
    if (!el) return false;
    return !!(
      el.offsetWidth  ||
      el.offsetHeight ||
      el.getClientRects().length
    );
  }


  /* ----------------------------------------------------------
     IS IN VIEWPORT
     Returns true if element is partially visible in viewport.
  ---------------------------------------------------------- */
  function isInViewport(el, threshold) {
    if (!el) return false;
    threshold = threshold || 0;
    const rect = el.getBoundingClientRect();
    return (
      rect.bottom >= threshold &&
      rect.right  >= threshold &&
      rect.top    <= (window.innerHeight  - threshold) &&
      rect.left   <= (window.innerWidth   - threshold)
    );
  }


  /* ============================================================
     EVENT MANAGEMENT
     ============================================================ */

  /* ----------------------------------------------------------
     ON — Add event listener with AbortController support
     Returns a cleanup function.

     Usage:
       const cleanup = on(btn, 'click', handler);
       // Later:
       cleanup();

     Or with options:
       on(btn, 'click', handler, { once: true });
  ---------------------------------------------------------- */
  function on(el, event, handler, options) {
    if (!el || !event || !handler) return noop;

    const events  = event.split(' ');
    const cleanups = [];

    events.forEach(function (evt) {
      el.addEventListener(evt.trim(), handler, options || false);
      cleanups.push(function () {
        el.removeEventListener(evt.trim(), handler, options || false);
      });
    });

    return function () {
      cleanups.forEach(function (fn) { fn(); });
    };
  }


  /* ----------------------------------------------------------
     OFF — Remove event listener
  ---------------------------------------------------------- */
  function off(el, event, handler) {
    if (!el || !event) return;
    event.split(' ').forEach(function (evt) {
      el.removeEventListener(evt.trim(), handler);
    });
  }


  /* ----------------------------------------------------------
     ONCE — Add one-time event listener
  ---------------------------------------------------------- */
  function once(el, event, handler) {
    return on(el, event, handler, { once: true });
  }


  /* ----------------------------------------------------------
     DELEGATE — Event delegation
     Handles events on dynamic children.

     Usage:
       delegate(list, 'click', '.job-card', function(e, target) {
         console.log('Card clicked:', target);
       });
  ---------------------------------------------------------- */
  function delegate(parent, event, childSelector, handler) {
    if (!parent || !event || !childSelector || !handler) return noop;

    function listener(e) {
      const target = closest(e.target, childSelector);
      if (target && parent.contains(target)) {
        handler.call(target, e, target);
      }
    }

    parent.addEventListener(event, listener);

    return function () {
      parent.removeEventListener(event, listener);
    };
  }


  /* ----------------------------------------------------------
     EMIT — Dispatch custom event
  ---------------------------------------------------------- */
  function emit(el, eventName, detail) {
    if (!el || !eventName) return;
    el.dispatchEvent(new CustomEvent(eventName, {
      bubbles:    true,
      cancelable: true,
      detail:     detail || {}
    }));
  }


  /* ============================================================
     SCROLL
     ============================================================ */

  /* ----------------------------------------------------------
     SCROLL TO ELEMENT
     Smooth scrolls to element with header offset.
  ---------------------------------------------------------- */
  function scrollTo(el, extraOffset) {
    if (!el) return;

    const headerH = parseInt(
      getComputedStyle(document.documentElement)
        .getPropertyValue('--header-height'),
      10
    ) || 64;

    const offset = headerH + (extraOffset || 16);
    const top    = el.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top: top, behavior: 'smooth' });
  }


  /* ----------------------------------------------------------
     SCROLL TO TOP
  ---------------------------------------------------------- */
  function scrollToTop(smooth) {
    window.scrollTo({
      top:      0,
      behavior: smooth === false ? 'auto' : 'smooth'
    });
  }


  /* ----------------------------------------------------------
     GET SCROLL PERCENTAGE
     Returns 0-100 based on document scroll position.
  ---------------------------------------------------------- */
  function getScrollPercent() {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (docH <= 0) return 100;
    return Math.round((window.scrollY / docH) * 100);
  }


  /* ----------------------------------------------------------
     GET ELEMENT SCROLL PERCENTAGE
     Returns 0-100 based on how far element is scrolled past.
     Used for reading progress.
  ---------------------------------------------------------- */
  function getElementScrollPercent(el) {
    if (!el) return 0;
    const rect     = el.getBoundingClientRect();
    const elH      = el.offsetHeight;
    const viewH    = window.innerHeight;
    const scrolled = -rect.top;
    const readable = elH - viewH;
    if (readable <= 0) return 100;
    if (scrolled <= 0) return 0;
    return Math.min(Math.round((scrolled / readable) * 100), 100);
  }


  /* ============================================================
     INTERSECTION OBSERVER HELPERS
     ============================================================ */

  /* ----------------------------------------------------------
     ON VISIBLE
     Calls callback when element enters viewport.
     Optional: repeat = call on every intersection.

     Usage:
       onVisible(el, function() {
         el.classList.add('revealed');
       });
  ---------------------------------------------------------- */
  function onVisible(el, callback, options) {
    if (!el || !callback) return noop;

    if (!('IntersectionObserver' in window)) {
      callback(el);
      return noop;
    }

    const opts = Object.assign({
      threshold:  0.1,
      rootMargin: '0px 0px -40px 0px',
      repeat:     false
    }, options || {});

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        callback(entry.target);
        if (!opts.repeat) observer.unobserve(entry.target);
      });
    }, {
      threshold:  opts.threshold,
      rootMargin: opts.rootMargin,
      root:       opts.root || null
    });

    observer.observe(el);

    return function () { observer.unobserve(el); observer.disconnect(); };
  }


  /* ----------------------------------------------------------
     ON VISIBLE ALL
     Observes multiple elements at once.

     Usage:
       onVisibleAll($$('.reveal'), function(el) {
         el.classList.add('revealed');
       });
  ---------------------------------------------------------- */
  function onVisibleAll(elements, callback, options) {
    if (!elements || !elements.length || !callback) return noop;

    if (!('IntersectionObserver' in window)) {
      elements.forEach(callback);
      return noop;
    }

    const opts = Object.assign({
      threshold:  0.1,
      rootMargin: '0px 0px -40px 0px',
      repeat:     false
    }, options || {});

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        callback(entry.target);
        if (!opts.repeat) observer.unobserve(entry.target);
      });
    }, {
      threshold:  opts.threshold,
      rootMargin: opts.rootMargin
    });

    elements.forEach(function (el) { observer.observe(el); });

    return function () { observer.disconnect(); };
  }


  /* ============================================================
     ANIMATION HELPERS
     ============================================================ */

  /* ----------------------------------------------------------
     ANIMATE IN
     Adds .revealed class with staggered delay.
     Used for card grids.
  ---------------------------------------------------------- */
  function animateIn(elements, delayStep) {
    delayStep = delayStep || 75;
    elements.forEach(function (el, i) {
      el.style.setProperty('--reveal-delay', (i * delayStep) + 'ms');
      requestAnimationFrame(function () {
        el.classList.add('reveal');
        requestAnimationFrame(function () {
          el.classList.add('revealed');
        });
      });
    });
  }


  /* ----------------------------------------------------------
     FLASH
     Briefly highlights an element.
     Used for "scroll to SG row" etc.
  ---------------------------------------------------------- */
  function flash(el, className, duration) {
    if (!el) return;
    className = className || 'sg-row--highlight';
    duration  = duration  || 2000;

    el.classList.add(className);
    setTimeout(function () {
      el.classList.remove(className);
    }, duration);
  }


  /* ============================================================
     FOCUS MANAGEMENT
     ============================================================ */

  /* ----------------------------------------------------------
     FOCUS FIRST
     Focuses the first focusable element inside a container.
  ---------------------------------------------------------- */
  function focusFirst(container) {
    if (!container) return;
    const focusable = container.querySelector(
      'a[href], button:not([disabled]), input:not([disabled]),' +
      ' select:not([disabled]), textarea:not([disabled]),' +
      ' [tabindex]:not([tabindex="-1"])'
    );
    if (focusable) focusable.focus();
  }


  /* ----------------------------------------------------------
     TRAP FOCUS
     Traps Tab/Shift+Tab within a container.
     Used for modals and overlays.
     Returns cleanup function.
  ---------------------------------------------------------- */
  function trapFocus(container) {
    if (!container) return noop;

    const FOCUSABLE = [
      'a[href]', 'button:not([disabled])', 'input:not([disabled])',
      'select:not([disabled])', 'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(',');

    function handler(e) {
      if (e.key !== 'Tab') return;

      const focusables = Array.from(container.querySelectorAll(FOCUSABLE))
        .filter(isVisible);

      if (!focusables.length) { e.preventDefault(); return; }

      const first = focusables[0];
      const last  = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    container.addEventListener('keydown', handler);
    focusFirst(container);

    return function () {
      container.removeEventListener('keydown', handler);
    };
  }


  /* ============================================================
     ATTRIBUTE HELPERS
     ============================================================ */

  /* ----------------------------------------------------------
     GET DATA
     Gets data-* attribute value.
  ---------------------------------------------------------- */
  function getData(el, key) {
    if (!el || !key) return null;
    return el.getAttribute('data-' + key);
  }


  /* ----------------------------------------------------------
     SET DATA
  ---------------------------------------------------------- */
  function setData(el, key, value) {
    if (!el || !key) return;
    el.setAttribute('data-' + key, value);
  }


  /* ----------------------------------------------------------
     SET ATTR
     Sets multiple attributes at once.

     Usage:
       setAttr(btn, { 'aria-expanded': 'true', disabled: '' });
  ---------------------------------------------------------- */
  function setAttr(el, attrs) {
    if (!el || !attrs) return;
    Object.entries(attrs).forEach(function (entry) {
      const key = entry[0];
      const val = entry[1];
      if (val === null || val === false || val === undefined) {
        el.removeAttribute(key);
      } else {
        el.setAttribute(key, String(val));
      }
    });
  }


  /* ============================================================
     STYLE HELPERS
     ============================================================ */

  /* ----------------------------------------------------------
     GET CSS VAR
     Reads a CSS custom property value.

     Usage:
       getCSSVar('--header-height')  → '64px'
       getCSSVar('--header-height', true)  → 64  (parsed int)
  ---------------------------------------------------------- */
  function getCSSVar(name, parse) {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();

    if (parse) return parseInt(value, 10) || 0;
    return value;
  }


  /* ----------------------------------------------------------
     SET CSS VAR
     Sets a CSS custom property on :root.
  ---------------------------------------------------------- */
  function setCSSVar(name, value) {
    document.documentElement.style.setProperty(name, value);
  }


  /* ============================================================
     LOADING STATES
     ============================================================ */

  /* ----------------------------------------------------------
     SET LOADING
     Adds/removes loading state on element.
  ---------------------------------------------------------- */
  function setLoading(el, loading) {
    if (!el) return;
    if (loading) {
      el.setAttribute('aria-busy', 'true');
      el.setAttribute('data-loading', '');
      el.classList.add('is-loading');
      if (el.tagName === 'BUTTON') el.disabled = true;
    } else {
      el.removeAttribute('aria-busy');
      el.removeAttribute('data-loading');
      el.classList.remove('is-loading');
      if (el.tagName === 'BUTTON') el.disabled = false;
    }
  }


  /* ----------------------------------------------------------
     INJECT SKELETON
     Replaces element content with skeleton placeholders.
  ---------------------------------------------------------- */
  function injectSkeleton(el, rows, rowHeight) {
    if (!el) return;
    rows      = rows      || 3;
    rowHeight = rowHeight || '16px';

    el.innerHTML = Array(rows).fill(
      '<div class="skeleton skeleton-wave"' +
      ' style="height:' + rowHeight + ';border-radius:4px;margin-bottom:8px;">' +
      '</div>'
    ).join('');
  }


  /* ============================================================
     MISC UTILITIES
     ============================================================ */

  /* ----------------------------------------------------------
     DEBOUNCE
     Returns a debounced version of fn.
  ---------------------------------------------------------- */
  function debounce(fn, delay) {
    let timer;
    return function () {
      const args    = arguments;
      const context = this;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay || 300);
    };
  }


  /* ----------------------------------------------------------
     THROTTLE
     Returns a throttled version of fn using RAF.
  ---------------------------------------------------------- */
  function throttle(fn) {
    let ticking = false;
    return function () {
      const args    = arguments;
      const context = this;
      if (!ticking) {
        requestAnimationFrame(function () {
          fn.apply(context, args);
          ticking = false;
        });
        ticking = true;
      }
    };
  }


  /* ----------------------------------------------------------
     WAIT FOR ELEMENT
     Polls until element matching selector appears in DOM.
     Returns a Promise.

     Usage:
       waitFor('#dynamic-content').then(function(el) {
         // el is now in DOM
       });
  ---------------------------------------------------------- */
  function waitFor(selector, timeout) {
    timeout = timeout || 5000;

    return new Promise(function (resolve, reject) {
      const el = $(selector);
      if (el) { resolve(el); return; }

      if (!('MutationObserver' in window)) {
        reject(new Error('MutationObserver not supported'));
        return;
      }

      const timer = setTimeout(function () {
        observer.disconnect();
        reject(new Error('Timeout waiting for: ' + selector));
      }, timeout);

      const observer = new MutationObserver(function () {
        const found = $(selector);
        if (found) {
          clearTimeout(timer);
          observer.disconnect();
          resolve(found);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree:   true
      });
    });
  }


  /* ----------------------------------------------------------
     READY
     Runs fn when DOM is ready.
  ---------------------------------------------------------- */
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    }
  }


  /* ----------------------------------------------------------
     NOOP
     Empty function — used as default cleanup.
  ---------------------------------------------------------- */
  function noop() {}


  /* ============================================================
     PUBLIC API
     window.TrabahoDOM

     Usage:
       TrabahoDOM.$('.meta-bar')
       TrabahoDOM.$$('.job-card').forEach(...)
       TrabahoDOM.on(btn, 'click', handler)
       TrabahoDOM.onVisible(el, fn)
       TrabahoDOM.scrollTo(el)
       TrabahoDOM.animateIn(cards)
       TrabahoDOM.debounce(fn, 300)
   ============================================================ */
  window.TrabahoDOM = {

    // Queries
    $:          $,
    $$:         $$,
    $id:        $id,
    closest:    closest,
    exists:     exists,

    // Creation
    create:         createElement,
    createSVG:      createSVG,
    htmlToElement:  htmlToElement,
    htmlToFragment: htmlToFragment,

    // Safe rendering
    setText:        setText,
    setHtml:        setHtml,
    empty:          empty,
    replaceContent: replaceContent,

    // Classes
    addClass:    addClass,
    removeClass: removeClass,
    toggleClass: toggleClass,
    hasClass:    hasClass,
    setClass:    setClass,

    // Visibility
    show:           show,
    hide:           hide,
    toggle:         toggle,
    isVisible:      isVisible,
    isInViewport:   isInViewport,

    // Events
    on:       on,
    off:      off,
    once:     once,
    delegate: delegate,
    emit:     emit,

    // Scroll
    scrollTo:               scrollTo,
    scrollToTop:            scrollToTop,
    getScrollPercent:       getScrollPercent,
    getElementScrollPercent:getElementScrollPercent,

    // Intersection
    onVisible:    onVisible,
    onVisibleAll: onVisibleAll,

    // Animation
    animateIn: animateIn,
    flash:     flash,

    // Focus
    focusFirst: focusFirst,
    trapFocus:  trapFocus,

    // Attributes
    getData: getData,
    setData: setData,
    setAttr: setAttr,

    // Styles
    getCSSVar: getCSSVar,
    setCSSVar: setCSSVar,

    // Loading
    setLoading:     setLoading,
    injectSkeleton: injectSkeleton,

    // Misc
    debounce: debounce,
    throttle: throttle,
    waitFor:  waitFor,
    ready:    ready,
    noop:     noop

  };

}());