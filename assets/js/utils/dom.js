/* ============================================================
   ASSETS/JS/UTILS/DOM.JS — DOM manipulation utilities
   TrabahoWatch v1.0
   ============================================================ */

'use strict';

(function () {

  /* ── Noop ─────────────────────────────────────────────────── */
  function noop() {}

  /* ============================================================
     QUERIES
     ============================================================ */

  function $(selector, context) {
    return (context || document).querySelector(selector);
  }

  function $$(selector, context) {
    return Array.prototype.slice.call(
      (context || document).querySelectorAll(selector)
    );
  }

  function $id(id) {
    return document.getElementById(id);
  }

  function closest(el, selector) {
    if (!el) return null;
    if (el.closest) return el.closest(selector);
    var node = el;
    while (node && node.nodeType === 1) {
      if (node.matches(selector)) return node;
      node = node.parentElement;
    }
    return null;
  }

  function exists(selector, context) {
    return !!$(selector, context);
  }

  /* ============================================================
     CREATION
     ============================================================ */

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
        } else if (key.indexOf('data-') === 0) {
          el.setAttribute(key, attrs[key]);
        } else if (key === 'style' && typeof attrs[key] === 'object') {
          Object.keys(attrs[key]).forEach(function (prop) {
            el.style[prop] = attrs[key][prop];
          });
        } else {
          el.setAttribute(key, attrs[key]);
        }
      });
    }

    if (children !== undefined && children !== null) {
      var items = Array.isArray(children) ? children : [children];
      items.forEach(function (item) {
        if (item === null || item === undefined) return;
        if (item instanceof Node) {
          el.appendChild(item);
        } else {
          el.appendChild(document.createTextNode(String(item)));
        }
      });
    }

    return el;
  }

  function createSVG(tag, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        el.setAttribute(key, attrs[key]);
      });
    }
    return el;
  }

  function htmlToElement(html) {
    var template = document.createElement('template');
    template.innerHTML = String(html).trim();
    return template.content.firstElementChild;
  }

  function htmlToFragment(html) {
    var template = document.createElement('template');
    template.innerHTML = String(html).trim();
    return template.content;
  }

  /* ============================================================
     SAFE RENDERING
     ============================================================ */

  function setText(el, text) {
    if (!el) return;
    el.textContent = text === null || text === undefined ? '' : String(text);
  }

  function setHtml(el, html) {
    if (!el) return;
    el.innerHTML = html === null || html === undefined ? '' : String(html);
  }

  function empty(el) {
    if (!el) return;
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  function replaceContent(el, content) {
    if (!el) return;
    empty(el);
    if (content === null || content === undefined) return;
    var items = Array.isArray(content) ? content : [content];
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

  function addClass(el, className) {
    if (!el || !className) return;
    String(className).split(' ').forEach(function (c) {
      if (c) el.classList.add(c);
    });
  }

  function removeClass(el, className) {
    if (!el || !className) return;
    String(className).split(' ').forEach(function (c) {
      if (c) el.classList.remove(c);
    });
  }

  function toggleClass(el, className, force) {
    if (!el || !className) return;
    if (force !== undefined) {
      el.classList.toggle(className, force);
    } else {
      el.classList.toggle(className);
    }
  }

  function hasClass(el, className) {
    if (!el || !className) return false;
    return el.classList.contains(className);
  }

  function setClass(el, className) {
    if (!el) return;
    el.className = className || '';
  }

  /* ============================================================
     VISIBILITY
     ============================================================ */

  function show(el, displayValue) {
    if (!el) return;
    el.hidden = false;
    el.removeAttribute('aria-hidden');
    el.style.display = displayValue || '';
  }

  function hide(el) {
    if (!el) return;
    el.style.display = 'none';
    el.setAttribute('aria-hidden', 'true');
  }

  function toggle(el, visible, displayValue) {
    if (!el) return;
    if (visible === undefined) {
      visible = el.style.display === 'none' || el.hidden;
    }
    if (visible) show(el, displayValue);
    else hide(el);
  }

  function isVisible(el) {
    if (!el) return false;
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  }

  function isInViewport(el, threshold) {
    if (!el) return false;
    threshold = threshold || 0;
    var rect = el.getBoundingClientRect();
    return (
      rect.bottom >= threshold &&
      rect.right  >= threshold &&
      rect.top    <= (window.innerHeight - threshold) &&
      rect.left   <= (window.innerWidth  - threshold)
    );
  }

  /* ============================================================
     EVENT MANAGEMENT
     ============================================================ */

  function on(el, event, handler, options) {
    if (!el || !event || !handler) return noop;

    var events   = String(event).split(' ');
    var cleanups = [];

    events.forEach(function (evt) {
      var e = evt.trim();
      if (!e) return;
      el.addEventListener(e, handler, options || false);
      cleanups.push(function () {
        el.removeEventListener(e, handler, options || false);
      });
    });

    return function () {
      cleanups.forEach(function (fn) { fn(); });
    };
  }

  function off(el, event, handler) {
    if (!el || !event) return;
    String(event).split(' ').forEach(function (evt) {
      el.removeEventListener(evt.trim(), handler);
    });
  }

  function once(el, event, handler) {
    return on(el, event, handler, { once: true });
  }

  function delegate(parent, event, childSelector, handler) {
    if (!parent || !event || !childSelector || !handler) return noop;

    function listener(e) {
      var target = closest(e.target, childSelector);
      if (target && parent.contains(target)) {
        handler.call(target, e, target);
      }
    }

    parent.addEventListener(event, listener);

    return function () {
      parent.removeEventListener(event, listener);
    };
  }

  function emit(el, eventName, detail) {
    var event = new CustomEvent(eventName, {
      bubbles:    true,
      cancelable: true,
      detail:     detail || {}
    });
    (el || window).dispatchEvent(event);
    return event;
  }

  /* ============================================================
     SCROLL
     ============================================================ */

  function scrollTo(el, extraOffset) {
    if (!el) return;

    var headerH = parseInt(
      getComputedStyle(document.documentElement)
        .getPropertyValue('--header-height'),
      10
    ) || 64;

    var offset = headerH + (extraOffset || 16);
    var top    = el.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  function scrollToTop(smooth) {
    window.scrollTo({
      top:      0,
      behavior: smooth === false ? 'auto' : 'smooth'
    });
  }

  function getScrollPercent() {
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    if (docH <= 0) return 100;
    return Math.round((window.scrollY / docH) * 100);
  }

  function getElementScrollPercent(el) {
    if (!el) return 0;
    var rect     = el.getBoundingClientRect();
    var elH      = el.offsetHeight;
    var viewH    = window.innerHeight;
    var scrolled = -rect.top;
    var readable = elH - viewH;
    if (readable <= 0) return 100;
    if (scrolled <= 0) return 0;
    return Math.min(Math.round((scrolled / readable) * 100), 100);
  }

  /* ============================================================
     INTERSECTION OBSERVER HELPERS
     ============================================================ */

  function onVisible(el, callback, options) {
    if (!el || !callback) return noop;

    if (!('IntersectionObserver' in window)) {
      callback(el);
      return noop;
    }

    var opts = {
      threshold:  (options && options.threshold)  || 0.1,
      rootMargin: (options && options.rootMargin) || '0px 0px -40px 0px',
      repeat:     !!(options && options.repeat),
      root:       (options && options.root) || null
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        callback(entry.target);
        if (!opts.repeat) observer.unobserve(entry.target);
      });
    }, {
      threshold:  opts.threshold,
      rootMargin: opts.rootMargin,
      root:       opts.root
    });

    observer.observe(el);

    return function () {
      observer.unobserve(el);
      observer.disconnect();
    };
  }

  function onVisibleAll(elements, callback, options) {
    if (!elements || !elements.length || !callback) return noop;

    if (!('IntersectionObserver' in window)) {
      elements.forEach(callback);
      return noop;
    }

    var opts = {
      threshold:  (options && options.threshold)  || 0.1,
      rootMargin: (options && options.rootMargin) || '0px 0px -40px 0px',
      repeat:     !!(options && options.repeat)
    };

    var observer = new IntersectionObserver(function (entries) {
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

  var FOCUSABLE_SELECTOR = [
    'a[href]', 'button:not([disabled])', 'input:not([disabled])',
    'select:not([disabled])', 'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  function focusFirst(container) {
    if (!container) return;
    var focusable = container.querySelector(FOCUSABLE_SELECTOR);
    if (focusable) focusable.focus();
  }

  function trapFocus(container) {
    if (!container) return noop;

    function handler(e) {
      if (e.key !== 'Tab') return;

      var focusables = $$(FOCUSABLE_SELECTOR, container).filter(isVisible);
      if (!focusables.length) { e.preventDefault(); return; }

      var first = focusables[0];
      var last  = focusables[focusables.length - 1];

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

  function getData(el, key) {
    if (!el || !key) return null;
    return el.getAttribute('data-' + key);
  }

  function setData(el, key, value) {
    if (!el || !key) return;
    el.setAttribute('data-' + key, value);
  }

  function setAttr(el, attrs) {
    if (!el || !attrs) return;
    Object.keys(attrs).forEach(function (key) {
      var val = attrs[key];
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

  function getCSSVar(name, parse) {
    var value = getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();

    if (parse) return parseInt(value, 10) || 0;
    return value;
  }

  function setCSSVar(name, value) {
    document.documentElement.style.setProperty(name, value);
  }

  /* ============================================================
     LOADING STATES
     ============================================================ */

  function setLoading(el, loading) {
    if (!el) return;
    if (loading) {
      el.setAttribute('aria-busy', 'true');
      el.setAttribute('data-loading', '');
      el.classList.add('is-loading');
      el.classList.add('skeleton-wave');
      if (el.tagName === 'BUTTON') el.disabled = true;
    } else {
      el.removeAttribute('aria-busy');
      el.removeAttribute('data-loading');
      el.classList.remove('is-loading');
      el.classList.remove('skeleton-wave');
      if (el.tagName === 'BUTTON') el.disabled = false;
    }
  }

  function injectSkeleton(el, rows, rowHeight) {
    if (!el) return;
    rows      = rows      || 3;
    rowHeight = rowHeight || '16px';

    var html = '';
    for (var i = 0; i < rows; i++) {
      html += '<div class="skeleton skeleton-wave"' +
        ' style="height:' + rowHeight + ';border-radius:4px;margin-bottom:8px;">' +
        '</div>';
    }
    el.innerHTML = html;
  }

  /* ============================================================
     MISC UTILITIES
     ============================================================ */

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

  function throttle(fn, limit) {
    var ticking  = false;
    var lastTime = 0;
    return function () {
      var args    = arguments;
      var context = this;
      var now     = Date.now();

      if (limit) {
        if (now - lastTime >= limit) {
          lastTime = now;
          fn.apply(context, args);
        }
        return;
      }

      if (!ticking) {
        requestAnimationFrame(function () {
          fn.apply(context, args);
          ticking = false;
        });
        ticking = true;
      }
    };
  }

  function waitFor(selector, timeout) {
    timeout = timeout || 5000;

    return new Promise(function (resolve, reject) {
      var el = $(selector);
      if (el) { resolve(el); return; }

      if (!('MutationObserver' in window)) {
        reject(new Error('MutationObserver not supported'));
        return;
      }

      var timer = setTimeout(function () {
        observer.disconnect();
        reject(new Error('Timeout waiting for: ' + selector));
      }, timeout);

      var observer = new MutationObserver(function () {
        var found = $(selector);
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

  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    }
  }

  /* ============================================================
     PUBLIC API
     window.TrabahoDOM
     ============================================================ */
  window.TrabahoDOM = {

    /* Queries */
    $:       $,
    $$:      $$,
    $id:     $id,
    closest: closest,
    exists:  exists,

    /* Creation */
    el:             createElement,
    create:         createElement,
    createSVG:      createSVG,
    htmlToElement:  htmlToElement,
    htmlToFragment: htmlToFragment,

    /* Safe rendering */
    setText:        setText,
    setHTML:        setHtml,
    setHtml:        setHtml,
    empty:          empty,
    replaceContent: replaceContent,

    /* Classes */
    addClass:    addClass,
    removeClass: removeClass,
    toggleClass: toggleClass,
    hasClass:    hasClass,
    setClass:    setClass,

    /* Visibility */
    show:         show,
    hide:         hide,
    toggle:       toggle,
    isVisible:    isVisible,
    isInViewport: isInViewport,

    /* Events */
    on:       on,
    off:      off,
    once:     once,
    delegate: delegate,
    emit:     emit,

    /* Scroll */
    scrollTo:                scrollTo,
    scrollToTop:             scrollToTop,
    getScrollPercent:        getScrollPercent,
    getElementScrollPercent: getElementScrollPercent,

    /* Intersection */
    onVisible:    onVisible,
    onVisibleAll: onVisibleAll,

    /* Animation */
    animateIn: animateIn,
    flash:     flash,

    /* Focus */
    focusFirst: focusFirst,
    trapFocus:  trapFocus,

    /* Attributes */
    getData: getData,
    setData: setData,
    setAttr: setAttr,

    /* Styles */
    getCSSVar: getCSSVar,
    setCSSVar: setCSSVar,

    /* Loading */
    setLoading:     setLoading,
    injectSkeleton: injectSkeleton,

    /* Misc */
    debounce: debounce,
    throttle: throttle,
    waitFor:  waitFor,
    ready:    ready,
    noop:     noop

  };

}());
