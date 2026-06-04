/* ============================================================
   FILE: assets/js/ui/accordion.js
   PURPOSE: Accessible accordion for FAQ page and any
            collapsible content sections.
            Supports single-open and multi-open modes,
            keyboard navigation, deep linking via URL hash,
            and smooth height animation.
   DEPENDS ON: app.js
   LOAD ORDER: <script src="/assets/js/ui/accordion.js" defer>
   ============================================================ */


(function () {

  'use strict';


  /* ----------------------------------------------------------
     CONSTANTS
  ---------------------------------------------------------- */
  const ACCORDION_SEL     = '[data-accordion]';
  const ITEM_SEL          = '[data-accordion-item]';
  const TRIGGER_SEL       = '[data-accordion-trigger]';
  const CONTENT_SEL       = '[data-accordion-content]';
  const ACTIVE_CLASS      = 'accordion-item--active';
  const ANIMATING_CLASS   = 'accordion-item--animating';
  const TRANSITION_MS     = 300;


  /* ============================================================
     CORE ACCORDION CLASS
     One instance per [data-accordion] group.
     ============================================================ */

  function Accordion(groupEl) {

    this.group     = groupEl;
    this.allowMulti = groupEl.getAttribute('data-accordion') === 'multi';
    this.items     = [];

    this._init();
  }


  /* ----------------------------------------------------------
     INIT
     Finds all items, sets up ARIA, binds events.
  ---------------------------------------------------------- */
  Accordion.prototype._init = function () {
    const self    = this;
    const itemEls = this.group.querySelectorAll(ITEM_SEL);

    itemEls.forEach(function (itemEl, index) {
      const trigger = itemEl.querySelector(TRIGGER_SEL);
      const content = itemEl.querySelector(CONTENT_SEL);

      if (!trigger || !content) return;

      // Generate IDs if missing
      const itemId    = itemEl.getAttribute('id') ||
        'accordion-item-' + generateId();
      const triggerId = trigger.getAttribute('id') ||
        'accordion-trigger-' + generateId();
      const contentId = content.getAttribute('id') ||
        'accordion-content-' + generateId();

      itemEl.setAttribute('id',    itemId);
      trigger.setAttribute('id',   triggerId);
      content.setAttribute('id',   contentId);

      // ARIA setup
      trigger.setAttribute('aria-controls',  contentId);
      trigger.setAttribute('aria-expanded',  'false');
      trigger.setAttribute('role',           'button');
      trigger.setAttribute('tabindex',       '0');

      content.setAttribute('aria-labelledby', triggerId);
      content.setAttribute('role',            'region');

      // Initial CSS state — closed
      content.style.height   = '0';
      content.style.overflow = 'hidden';
      content.style.transition = 'height ' + TRANSITION_MS + 'ms ease';
      // Visibility hidden when closed (accessibility)
      content.setAttribute('aria-hidden', 'true');

      const item = {
        el:       itemEl,
        trigger:  trigger,
        content:  content,
        isOpen:   false,
        index:    index
      };

      self.items.push(item);

      // Click
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        self.toggle(item);
      });

      // Keyboard
      trigger.addEventListener('keydown', function (e) {
        self._handleKeydown(e, item);
      });
    });

    // Check URL hash for deep link
    this._checkHash();

    // Listen for hash changes (browser back/forward)
    window.addEventListener('hashchange', function () {
      self._checkHash();
    });
  };


  /* ----------------------------------------------------------
     TOGGLE
     Opens if closed, closes if open.
  ---------------------------------------------------------- */
  Accordion.prototype.toggle = function (item) {
    if (item.el.classList.contains(ANIMATING_CLASS)) return;

    if (item.isOpen) {
      this.close(item);
    } else {
      this.open(item);
    }
  };


  /* ----------------------------------------------------------
     OPEN
  ---------------------------------------------------------- */
  Accordion.prototype.open = function (item) {
    const self = this;

    // Close others if single-open mode
    if (!this.allowMulti) {
      this.items.forEach(function (other) {
        if (other !== item && other.isOpen) {
          self.close(other);
        }
      });
    }

    item.isOpen = true;
    item.el.classList.add(ACTIVE_CLASS, ANIMATING_CLASS);

    // ARIA
    item.trigger.setAttribute('aria-expanded', 'true');
    item.content.setAttribute('aria-hidden',   'false');

    // Animate height — 0 → scrollHeight → auto
    const targetHeight = item.content.scrollHeight;

    item.content.style.height = targetHeight + 'px';

    // After animation — set to auto for responsive resize
    setTimeout(function () {
      item.el.classList.remove(ANIMATING_CLASS);
      item.content.style.height = 'auto';

      // Dispatch event
      item.el.dispatchEvent(new CustomEvent('accordion:opened', {
        bubbles: true,
        detail:  { item: item }
      }));
    }, TRANSITION_MS);

    // Update URL hash (for deep linking)
    this._updateHash(item);
  };


  /* ----------------------------------------------------------
     CLOSE
  ---------------------------------------------------------- */
  Accordion.prototype.close = function (item) {
    if (!item.isOpen) return;

    item.isOpen = false;
    item.el.classList.add(ANIMATING_CLASS);
    item.el.classList.remove(ACTIVE_CLASS);

    // ARIA
    item.trigger.setAttribute('aria-expanded', 'false');
    item.content.setAttribute('aria-hidden',   'true');

    // Animate height — auto → scrollHeight → 0
    // Must set explicit px first (can't animate from auto)
    item.content.style.height = item.content.scrollHeight + 'px';

    // Force reflow before setting to 0
    void item.content.offsetHeight;

    item.content.style.height = '0';

    setTimeout(function () {
      item.el.classList.remove(ANIMATING_CLASS);

      item.el.dispatchEvent(new CustomEvent('accordion:closed', {
        bubbles: true,
        detail:  { item: item }
      }));
    }, TRANSITION_MS);
  };


  /* ----------------------------------------------------------
     OPEN ALL
     Only useful in multi-open mode.
  ---------------------------------------------------------- */
  Accordion.prototype.openAll = function () {
    const self = this;
    this.items.forEach(function (item) {
      if (!item.isOpen) self.open(item);
    });
  };


  /* ----------------------------------------------------------
     CLOSE ALL
  ---------------------------------------------------------- */
  Accordion.prototype.closeAll = function () {
    const self = this;
    this.items.forEach(function (item) {
      if (item.isOpen) self.close(item);
    });
  };


  /* ----------------------------------------------------------
     OPEN BY INDEX
  ---------------------------------------------------------- */
  Accordion.prototype.openIndex = function (index) {
    const item = this.items[index];
    if (item && !item.isOpen) this.open(item);
  };


  /* ----------------------------------------------------------
     OPEN BY ID
     Opens the item whose element has a matching ID.
  ---------------------------------------------------------- */
  Accordion.prototype.openById = function (id) {
    const item = this.items.find(function (i) {
      return i.el.getAttribute('id') === id;
    });
    if (item && !item.isOpen) this.open(item);
  };


  /* ----------------------------------------------------------
     KEYBOARD NAVIGATION
     Arrow keys move between triggers.
     Home/End jump to first/last.
  ---------------------------------------------------------- */
  Accordion.prototype._handleKeydown = function (e, item) {
    const self    = this;
    const triggers = this.items.map(function (i) { return i.trigger; });
    const current  = triggers.indexOf(item.trigger);

    switch (e.key) {

      case 'ArrowDown':
        e.preventDefault();
        if (current < triggers.length - 1) {
          triggers[current + 1].focus();
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (current > 0) {
          triggers[current - 1].focus();
        }
        break;

      case 'Home':
        e.preventDefault();
        triggers[0].focus();
        break;

      case 'End':
        e.preventDefault();
        triggers[triggers.length - 1].focus();
        break;

      case 'Enter':
      case ' ':
        e.preventDefault();
        self.toggle(item);
        break;

    }
  };


  /* ----------------------------------------------------------
     DEEP LINK — CHECK HASH
     Opens accordion item if URL hash matches its ID.
     Example: /pages/faq.html#accordion-item-csc-exam
  ---------------------------------------------------------- */
  Accordion.prototype._checkHash = function () {
    const hash = window.location.hash;
    if (!hash) return;

    const id = hash.replace('#', '');
    const self = this;

    this.items.forEach(function (item) {
      const itemId      = item.el.getAttribute('id');
      const contentId   = item.content.getAttribute('id');

      if (itemId === id || contentId === id) {
        // Small delay — let page render first
        setTimeout(function () {
          self.open(item);

          // Scroll to item with header offset
          const headerHeight = parseInt(
            getComputedStyle(document.documentElement)
              .getPropertyValue('--header-height'),
            10
          ) || 64;

          const top = item.el.getBoundingClientRect().top
                    + window.scrollY
                    - headerHeight
                    - 16;

          window.scrollTo({ top: top, behavior: 'smooth' });
        }, 150);
      }
    });
  };


  /* ----------------------------------------------------------
     UPDATE HASH
     Updates URL hash when item opens (for sharing/bookmarking).
     Uses replaceState — no browser history entry.
  ---------------------------------------------------------- */
  Accordion.prototype._updateHash = function (item) {
    const id = item.el.getAttribute('id');
    if (!id) return;

    try {
      history.replaceState(null, '', '#' + id);
    } catch (e) {
      // Fail silently
    }
  };


  /* ============================================================
     FAQ PAGE ENHANCEMENTS
     ============================================================ */

  /* ----------------------------------------------------------
     ADD EXPAND/COLLAPSE ALL BUTTON
     Useful for FAQ pages with many questions.
  ---------------------------------------------------------- */
  function addExpandCollapseAll(group, accordion) {
    // Only on pages with data-accordion-controls attribute
    if (!group.hasAttribute('data-accordion-controls')) return;

    const container = document.createElement('div');
    container.className = 'accordion-controls';
    container.innerHTML =
      '<button class="btn btn--ghost btn--sm" id="expand-all">' +
        '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"' +
             ' stroke-width="2" width="16" height="16">' +
          '<polyline points="7 13 12 18 17 13"/>' +
          '<polyline points="7 6 12 11 17 6"/>' +
        '</svg>' +
        'Expand all' +
      '</button>' +
      '<button class="btn btn--ghost btn--sm" id="collapse-all">' +
        '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"' +
             ' stroke-width="2" width="16" height="16">' +
          '<polyline points="17 11 12 6 7 11"/>' +
          '<polyline points="17 18 12 13 7 18"/>' +
        '</svg>' +
        'Collapse all' +
      '</button>';

    group.insertBefore(container, group.firstChild);

    document.getElementById('expand-all').addEventListener('click', function () {
      accordion.openAll();
    });

    document.getElementById('collapse-all').addEventListener('click', function () {
      accordion.closeAll();
    });
  }


  /* ----------------------------------------------------------
     ADD FAQ SEARCH
     Filters FAQ items by keyword.
     Only on [data-accordion-search] groups.
  ---------------------------------------------------------- */
  function addFAQSearch(group, accordion) {
    if (!group.hasAttribute('data-accordion-search')) return;

    const searchWrap = document.createElement('div');
    searchWrap.className = 'accordion-search';
    searchWrap.innerHTML =
      '<div class="form-input-wrap">' +
        '<svg class="form-input-icon form-input-icon--left" viewBox="0 0 24 24"' +
             ' stroke="currentColor" fill="none" stroke-width="2">' +
          '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>' +
        '</svg>' +
        '<input' +
          ' type="search"' +
          ' class="form-input form-input--icon-left"' +
          ' id="faq-search"' +
          ' placeholder="Search FAQ..."' +
          ' aria-label="Search frequently asked questions"' +
          ' autocomplete="off"' +
        '>' +
        '<button class="form-input-action" id="faq-search-clear"' +
                ' aria-label="Clear search" style="display:none;">' +
          '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">' +
            '<line x1="18" y1="6" x2="6" y2="18"/>' +
            '<line x1="6" y1="6" x2="18" y2="18"/>' +
          '</svg>' +
        '</button>' +
      '</div>' +
      '<p class="accordion-search__count" id="faq-count" aria-live="polite"></p>';

    group.insertBefore(searchWrap, group.firstChild);

    const input     = document.getElementById('faq-search');
    const clearBtn  = document.getElementById('faq-search-clear');
    const countEl   = document.getElementById('faq-count');
    let   debouncer;

    input.addEventListener('input', function () {
      clearTimeout(debouncer);
      debouncer = setTimeout(function () {
        filterFAQ(input.value.trim(), accordion, countEl);
        clearBtn.style.display = input.value ? 'flex' : 'none';
      }, 200);
    });

    clearBtn.addEventListener('click', function () {
      input.value            = '';
      clearBtn.style.display = 'none';
      filterFAQ('', accordion, countEl);
      input.focus();
    });
  }


  /* ----------------------------------------------------------
     FILTER FAQ ITEMS
  ---------------------------------------------------------- */
  function filterFAQ(query, accordion, countEl) {
    const q       = query.toLowerCase().trim();
    let   visible = 0;

    accordion.items.forEach(function (item) {
      const text = item.el.textContent.toLowerCase();
      const match = !q || text.includes(q);

      item.el.style.display = match ? '' : 'none';

      if (match) {
        visible++;
        // Highlight matching text in trigger
        if (q) highlightText(item.trigger, q);
        else   removeHighlight(item.trigger);
      }
    });

    // Update count
    if (countEl) {
      if (!q) {
        countEl.textContent = '';
      } else {
        countEl.textContent = visible + ' question' +
          (visible !== 1 ? 's' : '') + ' found';
      }
    }

    // Open first visible match
    if (q) {
      const firstMatch = accordion.items.find(function (item) {
        return item.el.style.display !== 'none';
      });
      if (firstMatch && !firstMatch.isOpen) {
        accordion.open(firstMatch);
      }
    }
  }


  /* ----------------------------------------------------------
     HIGHLIGHT MATCHING TEXT
  ---------------------------------------------------------- */
  function highlightText(el, query) {
    // Only highlight in trigger text node — avoid breaking HTML
    const textNode = Array.from(el.childNodes).find(function (n) {
      return n.nodeType === Node.TEXT_NODE && n.textContent.trim();
    });

    if (!textNode) return;

    const text     = textNode.textContent;
    const re       = new RegExp('(' + escapeRegex(query) + ')', 'gi');
    const replaced = text.replace(re, '<mark>$1</mark>');

    if (replaced !== escapeHtml(text)) {
      const span = document.createElement('span');
      span.innerHTML = replaced;
      el.replaceChild(span, textNode);
      el._originalText = text;
    }
  }


  function removeHighlight(el) {
    const span = el.querySelector('span');
    if (span && el._originalText) {
      const textNode = document.createTextNode(el._originalText);
      el.replaceChild(textNode, span);
      delete el._originalText;
    }
  }


  /* ============================================================
     SCHEMA.ORG — FAQ PAGE
     Injects FAQPage JSON-LD from accordion content.
     Critical for Google rich results.
     ============================================================ */

  function injectFAQSchema(group) {
    if (!group.hasAttribute('data-accordion-schema')) return;

    const items = group.querySelectorAll(ITEM_SEL);
    const faqs  = [];

    items.forEach(function (item) {
      const trigger = item.querySelector(TRIGGER_SEL);
      const content = item.querySelector(CONTENT_SEL);
      if (!trigger || !content) return;

      faqs.push({
        '@type':          'Question',
        'name':           trigger.textContent.trim(),
        'acceptedAnswer': {
          '@type': 'Answer',
          'text':  content.textContent.trim()
            .replace(/\s+/g, ' ')
            .slice(0, 500)  // Schema.org recommended max
        }
      });
    });

    if (!faqs.length) return;

    const schema = {
      '@context': 'https://schema.org',
      '@type':    'FAQPage',
      'mainEntity': faqs
    };

    const script = document.createElement('script');
    script.type        = 'application/ld+json';
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
  }


  /* ============================================================
     HELPERS
     ============================================================ */

  let idCounter = 0;
  function generateId() {
    return 'tw-' + (++idCounter) + '-' + Math.random().toString(36).slice(2, 6);
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }


  /* ============================================================
     STYLES
     Minimal styles injected for accordion components.
     ============================================================ */

  function injectStyles() {
    if (document.getElementById('accordion-styles')) return;

    const style = document.createElement('style');
    style.id    = 'accordion-styles';
    style.textContent = `

      /* Accordion wrapper */
      [data-accordion] {
        display:        flex;
        flex-direction: column;
        gap:            var(--space-2);
      }

      /* Individual item */
      [data-accordion-item] {
        background:    var(--bg-surface);
        border:        1px solid var(--border-color);
        border-radius: var(--radius-xl);
        overflow:      hidden;
        transition:    border-color var(--transition-fast),
                       box-shadow   var(--transition-fast);
      }

      [data-accordion-item].accordion-item--active {
        border-color: var(--color-primary);
        box-shadow:   0 0 0 1px var(--color-primary);
      }

      /* Trigger button */
      [data-accordion-trigger] {
        display:         flex;
        align-items:     center;
        justify-content: space-between;
        width:           100%;
        padding:         var(--space-5) var(--space-6);
        background:      none;
        border:          none;
        cursor:          pointer;
        text-align:      left;
        font-family:     var(--font-sans);
        font-size:       var(--text-base);
        font-weight:     var(--font-semibold);
        color:           var(--text-primary);
        line-height:     var(--leading-normal);
        gap:             var(--space-4);
        transition:      color      var(--transition-fast),
                         background var(--transition-fast);
      }

      [data-accordion-trigger]:hover {
        background: var(--bg-surface-2);
        color:      var(--color-primary);
      }

      .accordion-item--active [data-accordion-trigger] {
        color: var(--color-primary);
      }

      html.dark .accordion-item--active [data-accordion-trigger] {
        color: var(--text-link);
      }

      /* Chevron icon */
      .accordion-icon {
        width:       20px;
        height:      20px;
        flex-shrink: 0;
        color:       var(--text-muted);
        transition:  transform var(--transition-normal),
                     color    var(--transition-fast);
      }

      .accordion-item--active .accordion-icon {
        transform: rotate(180deg);
        color:     var(--color-primary);
      }

      /* Content panel */
      [data-accordion-content] {
        height:     0;
        overflow:   hidden;
        transition: height 300ms ease;
      }

      /* Inner padding — separate from content
         so padding doesn't affect height animation */
      .accordion-body {
        padding:     0 var(--space-6) var(--space-5);
        font-size:   var(--text-base);
        color:       var(--text-secondary);
        line-height: var(--leading-relaxed);
      }

      .accordion-body p + p      { margin-top: var(--space-3); }
      .accordion-body ul         { padding-left: var(--space-5); }
      .accordion-body ul li      { list-style: disc; margin-bottom: var(--space-1); }
      .accordion-body a          { color: var(--text-link); text-decoration: underline; }
      .accordion-body strong     { color: var(--text-primary); font-weight: var(--font-semibold); }

      /* Highlighted search text */
      [data-accordion-trigger] mark,
      [data-accordion-content] mark {
        background:    rgba(22, 72, 150, 0.15);
        color:         var(--color-primary);
        border-radius: 2px;
        font-style:    normal;
      }

      html.dark [data-accordion-trigger] mark,
      html.dark [data-accordion-content] mark {
        background: rgba(96, 165, 250, 0.2);
        color:      var(--text-link);
      }

      /* Controls row */
      .accordion-controls {
        display:     flex;
        gap:         var(--space-2);
        margin-bottom: var(--space-4);
      }

      /* Search bar */
      .accordion-search {
        margin-bottom: var(--space-4);
      }

      .accordion-search__count {
        font-size:  var(--text-sm);
        color:      var(--text-muted);
        margin-top: var(--space-2);
        min-height: 20px;
      }

      /* FAQ category label */
      .accordion-category {
        font-size:      var(--text-xs);
        font-weight:    var(--font-bold);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color:          var(--text-muted);
        padding:        var(--space-6) 0 var(--space-3);
        margin-top:     var(--space-4);
      }

      .accordion-category:first-child {
        margin-top: 0;
        padding-top: 0;
      }

    `;

    document.head.appendChild(style);
  }


  /* ============================================================
     MAIN INIT
     ============================================================ */

  /* ----------------------------------------------------------
     INIT ALL ACCORDION GROUPS
  ---------------------------------------------------------- */
  function initAll() {
    injectStyles();

    const groups    = document.querySelectorAll(ACCORDION_SEL);
    const instances = [];

    groups.forEach(function (group) {
      // Add chevron icons to triggers if missing
      addChevronIcons(group);

      const accordion = new Accordion(group);
      instances.push(accordion);

      // FAQ-specific enhancements
      addExpandCollapseAll(group, accordion);
      addFAQSearch(group, accordion);
      injectFAQSchema(group);

      // Store instance on element for external access
      group._accordion = accordion;
    });

    // Re-init after dynamic content loads
    document.addEventListener('article:rendered', function () {
      document.querySelectorAll(ACCORDION_SEL + ':not([data-accordion-init])').forEach(
        function (group) {
          group.setAttribute('data-accordion-init', 'true');
          addChevronIcons(group);
          const accordion = new Accordion(group);
          instances.push(accordion);
          group._accordion = accordion;
        }
      );
    });

    return instances;
  }


  /* ----------------------------------------------------------
     ADD CHEVRON ICONS
     Injects chevron SVG into triggers if not already there.
  ---------------------------------------------------------- */
  function addChevronIcons(group) {
    group.querySelectorAll(TRIGGER_SEL).forEach(function (trigger) {
      if (trigger.querySelector('.accordion-icon')) return;

      const icon = document.createElement('span');
      icon.className   = 'accordion-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.innerHTML =
        '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2.5">' +
          '<polyline points="6 9 12 15 18 9"/>' +
        '</svg>';

      trigger.appendChild(icon);
    });
  }


  /* ----------------------------------------------------------
     DOM READY
  ---------------------------------------------------------- */
  const instances = [];

  function init() {
    const found = initAll();
    found.forEach(function (i) { instances.push(i); });
  }

  if (window.TrabahoApp) {
    TrabahoApp.onReady(init);
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }


  /* ----------------------------------------------------------
     PUBLIC API
     window.TrabahoAccordion

     Usage:
       TrabahoAccordion.openById('faq-csc-exam')
       TrabahoAccordion.get(element)
       TrabahoAccordion.init()
  ---------------------------------------------------------- */
  window.TrabahoAccordion = {

    // Get accordion instance for a group element
    get: function (el) {
      return el && el._accordion ? el._accordion : null;
    },

    // Open item by ID across all groups
    openById: function (id) {
      instances.forEach(function (accordion) {
        accordion.openById(id);
      });
    },

    // Re-initialize (after dynamic content injection)
    init: initAll

  };

}());