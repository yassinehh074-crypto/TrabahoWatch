/* ============================================================
   ASSETS/JS/UI/SEARCH.JS — Search overlay with live results
   Connects to TrabahoJobs.search()
   Manages recent searches in localStorage
   TrabahoWatch v1.0
   ============================================================ */

'use strict';

(function () {

  /* ============================================================
     CONFIG
     ============================================================ */

  var MAX_RESULTS       = 6;
  var MAX_RECENT        = 5;
  var DEBOUNCE_MS       = 250;
  var STORAGE_KEY       = 'trabahowatch-recent-searches';
  var MIN_QUERY_LENGTH  = 2;

  /* ============================================================
     STATE
     ============================================================ */

  var searchTimer   = null;
  var currentQuery  = '';
  var isOpen        = false;

  /* ============================================================
     DOM REFERENCES (resolved on init)
     ============================================================ */

  var overlayEl     = null;
  var inputEl       = null;
  var resultsEl     = null;
  var recentEl      = null;
  var closeBtn      = null;
  var triggerBtns   = [];

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
     FORMAT SALARY
     ============================================================ */

  function formatSalary(job) {
    if (job.salaryText) return job.salaryText;
    if (job.salary)     return '₱' + Number(job.salary).toLocaleString('en-PH') + '/mo';
    if (job.sg)         return 'SG ' + job.sg;
    return '';
  }

  /* ============================================================
     RECENT SEARCHES — localStorage
     ============================================================ */

  function getRecentSearches() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveRecentSearch(query) {
    if (!query || query.trim().length < MIN_QUERY_LENGTH) return;
    query = query.trim();

    try {
      var recent = getRecentSearches();
      /* Remove if already exists */
      recent = recent.filter(function (r) {
        return r.toLowerCase() !== query.toLowerCase();
      });
      /* Add to front */
      recent.unshift(query);
      /* Keep only MAX_RECENT */
      recent = recent.slice(0, MAX_RECENT);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
    } catch (e) { /* ignore */ }
  }

  function clearRecentSearches() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) { /* ignore */ }
  }

  /* ============================================================
     BUILD RESULT ITEM HTML
     ============================================================ */

  function buildResultItem(job) {
    var sectorBadgeMap = {
      government: '<span class="badge badge--gov" style="font-size:10px;">Gov</span>',
      private:    '<span class="badge badge--private" style="font-size:10px;">Private</span>',
      ofw:        '<span class="badge badge--ofw" style="font-size:10px;">OFW</span>'
    };

    var statusBadge = job.isUrgent
      ? '<span class="badge badge--urgent" style="font-size:10px;">Closing Soon</span>'
      : job.isArchived
        ? '<span class="badge badge--archived" style="font-size:10px;">Archived</span>'
        : '';

    var salary = formatSalary(job);

    return [
      '<a href="', esc(job.url), '" ',
          'class="search-result-item" ',
          'role="option" ',
          'aria-label="', esc(job.title), ' at ', esc(job.agency), '">',

        '<div style="display:flex;flex-direction:column;gap:4px;flex:1;min-width:0;">',

          '<div style="display:flex;align-items:center;gap:var(--space-2);flex-wrap:wrap;">',
            '<span style="font-size:var(--text-sm);font-weight:var(--font-bold);',
                'color:var(--text-primary);white-space:nowrap;',
                'overflow:hidden;text-overflow:ellipsis;max-width:200px;">',
              esc(job.title),
            '</span>',
            sectorBadgeMap[job.sector] || '',
            statusBadge,
          '</div>',

          '<div style="display:flex;align-items:center;gap:var(--space-3);">',
            '<span style="font-size:var(--text-xs);color:var(--text-muted);">',
              esc(job.agency),
            '</span>',
            job.location
              ? '<span style="font-size:var(--text-xs);color:var(--text-muted);">' +
                '· ' + esc(job.location) + '</span>'
              : '',
          '</div>',

        '</div>',

        salary
          ? '<span style="font-size:var(--text-xs);font-weight:var(--font-bold);' +
            'color:var(--color-success);white-space:nowrap;margin-left:auto;' +
            'padding-left:var(--space-3);">' +
            esc(salary) + '</span>'
          : '',

        '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"',
            ' stroke-width="2" width="14" height="14"',
            ' style="flex-shrink:0;color:var(--text-muted);" aria-hidden="true">',
          '<path d="m9 18 6-6-6-6"/>',
        '</svg>',

      '</a>'
    ].join('');
  }

  /* ============================================================
     BUILD RECENT SEARCHES HTML
     ============================================================ */

  function buildRecentHTML(recent) {
    if (!recent || recent.length === 0) return '';

    var items = recent.map(function (query) {
      return [
        '<button type="button" ',
            'class="search-recent-item" ',
            'data-recent-query="', esc(query), '" ',
            'aria-label="Search for ', esc(query), '">',
          '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"',
              ' stroke-width="2" width="14" height="14" aria-hidden="true">',
            '<circle cx="12" cy="12" r="10"/>',
            '<polyline points="12 6 12 12 16 14"/>',
          '</svg>',
          '<span>', esc(query), '</span>',
        '</button>'
      ].join('');
    }).join('');

    return [
      '<div class="search-recent">',
        '<div style="display:flex;align-items:center;justify-content:space-between;',
            'margin-bottom:var(--space-2);">',
          '<p style="font-size:var(--text-xs);font-weight:var(--font-bold);',
              'color:var(--text-muted);text-transform:uppercase;',
              'letter-spacing:0.06em;">Recent Searches</p>',
          '<button type="button" id="clear-recent-btn" ',
              'style="font-size:var(--text-xs);color:var(--text-muted);',
              'background:none;border:none;cursor:pointer;',
              'text-decoration:underline;">Clear</button>',
        '</div>',
        '<div style="display:flex;flex-direction:column;gap:2px;">',
          items,
        '</div>',
      '</div>'
    ].join('');
  }

  /* ============================================================
     BUILD "VIEW ALL" LINK
     ============================================================ */

  function buildViewAllLink(query) {
    var url = '/jobs/job-map.html' +
              (query ? '?q=' + encodeURIComponent(query) : '');
    return [
      '<a href="', esc(url), '" ',
          'class="search-view-all" ',
          'style="display:flex;align-items:center;justify-content:center;',
          'gap:var(--space-2);padding:var(--space-3);',
          'font-size:var(--text-sm);font-weight:var(--font-semibold);',
          'color:var(--color-primary);text-decoration:none;',
          'border-top:1px solid var(--border-color);',
          'margin-top:var(--space-2);">',
        query
          ? 'View all results for "' + esc(query) + '" →'
          : 'Browse all jobs →',
      '</a>'
    ].join('');
  }

  /* ============================================================
     HIGHLIGHT QUERY IN TEXT
     ============================================================ */

  function highlightQuery(text, query) {
    if (!query || !text) return esc(text);
    var regex  = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return esc(text).replace(regex,
      '<mark style="background:rgba(22,72,150,0.15);color:inherit;border-radius:2px;">$1</mark>'
    );
  }

  /* ============================================================
     PERFORM SEARCH
     ============================================================ */

  function performSearch(query) {
    if (!window.TrabahoJobs) return;
    if (!resultsEl) return;

    query = (query || '').trim();
    currentQuery = query;

    /* Show recent searches if query too short */
    if (query.length < MIN_QUERY_LENGTH) {
      showRecentSearches();
      return;
    }

    /* Search */
    var results = window.TrabahoJobs.search(query, {
      limit: MAX_RESULTS,
      includeArchived: false
    });

    /* Render results */
    if (results.length === 0) {
      resultsEl.innerHTML = [
        '<div style="padding:var(--space-8);text-align:center;',
            'color:var(--text-muted);">',
          '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"',
              ' stroke-width="1.5" width="32" height="32"',
              ' style="margin:0 auto var(--space-3);" aria-hidden="true">',
            '<circle cx="11" cy="11" r="8"/>',
            '<path d="m21 21-4.35-4.35"/>',
          '</svg>',
          '<p style="font-size:var(--text-sm);font-weight:var(--font-semibold);',
              'margin-bottom:var(--space-1);">No results found</p>',
          '<p style="font-size:var(--text-xs);">',
            'Try different keywords or ',
            '<a href="/jobs/job-map.html" style="color:var(--color-primary);">',
            'browse all jobs</a>.',
          '</p>',
        '</div>',
        buildViewAllLink(query)
      ].join('');
      return;
    }

    var items = results.map(buildResultItem).join('');
    resultsEl.innerHTML = items + buildViewAllLink(query);

    /* Bind result click → save recent search */
    resultsEl.querySelectorAll('.search-result-item').forEach(function (link) {
      link.addEventListener('click', function () {
        saveRecentSearch(query);
        closeOverlay();
      });
    });

    /* Keyboard navigation */
    initResultsKeyboard();
  }

  /* ============================================================
     SHOW RECENT SEARCHES
     ============================================================ */

  function showRecentSearches() {
    if (!resultsEl) return;

    var recent = getRecentSearches();

    if (recent.length === 0) {
      resultsEl.innerHTML = [
        '<div style="padding:var(--space-6);text-align:center;',
            'color:var(--text-muted);">',
          '<p style="font-size:var(--text-sm);">',
            'Start typing to search jobs…',
          '</p>',
          buildViewAllLink(''),
        '</div>'
      ].join('');
      return;
    }

    resultsEl.innerHTML = buildRecentHTML(recent) + buildViewAllLink('');

    /* Bind recent search buttons */
    resultsEl.querySelectorAll('[data-recent-query]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var q = btn.dataset.recentQuery;
        if (inputEl) inputEl.value = q;
        performSearch(q);
      });
    });

    /* Bind clear recent */
    var clearBtn = document.getElementById('clear-recent-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        clearRecentSearches();
        showRecentSearches();
      });
    }
  }

  /* ============================================================
     KEYBOARD NAVIGATION IN RESULTS
     ============================================================ */

  function initResultsKeyboard() {
    if (!resultsEl || !inputEl) return;

    var items = Array.from(
      resultsEl.querySelectorAll('.search-result-item, .search-recent-item')
    );

    if (items.length === 0) return;

    inputEl.addEventListener('keydown', handleInputKeydown);

    function handleInputKeydown(e) {
      var focused = document.activeElement;
      var idx     = items.indexOf(focused);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        var next = idx < items.length - 1 ? items[idx + 1] : items[0];
        next.focus();

      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        var prev = idx > 0 ? items[idx - 1] : items[items.length - 1];
        prev.focus();

      } else if (e.key === 'Escape') {
        closeOverlay();
      }
    }

    /* Allow keyboard navigation within results */
    items.forEach(function (item, i) {
      item.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          var next = i < items.length - 1 ? items[i + 1] : inputEl;
          next.focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          var prev = i > 0 ? items[i - 1] : inputEl;
          prev.focus();
        } else if (e.key === 'Escape') {
          closeOverlay();
        }
      });
    });
  }

  /* ============================================================
     OPEN OVERLAY
     ============================================================ */

  function openOverlay() {
    if (!overlayEl) return;
    isOpen = true;

    overlayEl.hidden = false;
    overlayEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    /* Focus input */
    if (inputEl) {
      setTimeout(function () {
        inputEl.focus();
        inputEl.select();
      }, 50);
    }

    /* Show recent searches initially */
    showRecentSearches();

    /* Dispatch open event */
    window.dispatchEvent(new CustomEvent('trabahoSearch:open'));
  }

  /* ============================================================
     CLOSE OVERLAY
     ============================================================ */

  function closeOverlay() {
    if (!overlayEl) return;
    isOpen = false;

    overlayEl.hidden = true;
    overlayEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    /* Clear input */
    if (inputEl) inputEl.value = '';
    currentQuery = '';

    /* Return focus to trigger */
    if (triggerBtns.length > 0) {
      triggerBtns[0].focus();
    }

    /* Dispatch close event */
    window.dispatchEvent(new CustomEvent('trabahoSearch:close'));
  }

  /* ============================================================
     BUILD OVERLAY HTML (if not in DOM)
     ============================================================ */

  function buildOverlayHTML() {
    return [
      '<div id="search-overlay" ',
          'role="dialog" ',
          'aria-modal="true" ',
          'aria-label="Search job listings" ',
          'hidden ',
          'style="position:fixed;inset:0;z-index:var(--z-modal,400);',
          'background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);',
          'display:flex;align-items:flex-start;justify-content:center;',
          'padding:var(--space-16,4rem) var(--space-4) var(--space-4);">',

        '<div style="width:100%;max-width:560px;',
            'background:var(--bg-surface);border-radius:var(--radius-2xl);',
            'box-shadow:var(--shadow-xl);overflow:hidden;">',

          /* Search input bar */
          '<div style="display:flex;align-items:center;gap:var(--space-3);',
              'padding:var(--space-4) var(--space-5);',
              'border-bottom:1px solid var(--border-color);">',

            '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"',
                ' stroke-width="2" width="18" height="18"',
                ' style="flex-shrink:0;color:var(--text-muted);" aria-hidden="true">',
              '<circle cx="11" cy="11" r="8"/>',
              '<path d="m21 21-4.35-4.35"/>',
            '</svg>',

            '<input type="search" ',
                'id="search-overlay-input" ',
                'class="search-overlay-input" ',
                'placeholder="Search jobs — Teacher I, Nurse, BPO…" ',
                'autocomplete="off" ',
                'spellcheck="false" ',
                'aria-label="Search job listings" ',
                'style="flex:1;border:none;outline:none;font-size:var(--text-base);',
                'font-family:var(--font-sans);color:var(--text-primary);',
                'background:transparent;caret-color:var(--color-primary);">',

            '<button type="button" ',
                'id="search-overlay-close" ',
                'data-search-close ',
                'aria-label="Close search" ',
                'style="flex-shrink:0;width:28px;height:28px;',
                'border:none;background:var(--bg-surface-2);',
                'border-radius:var(--radius-md);cursor:pointer;',
                'display:flex;align-items:center;justify-content:center;',
                'color:var(--text-muted);">',
              '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"',
                  ' stroke-width="2.5" width="14" height="14" aria-hidden="true">',
                '<line x1="18" y1="6" x2="6" y2="18"/>',
                '<line x1="6" y1="6" x2="18" y2="18"/>',
              '</svg>',
            '</button>',

          '</div>',

          /* Results container */
          '<div id="search-overlay-results" ',
              'role="listbox" ',
              'aria-label="Search results" ',
              'style="max-height:60vh;overflow-y:auto;">',
          '</div>',

        '</div>',
      '</div>'
    ].join('');
  }

  /* ============================================================
     RESOLVE DOM ELEMENTS
     ============================================================ */

  function resolveElements() {
    overlayEl = document.getElementById('search-overlay');

    /* Build overlay if not in DOM */
    if (!overlayEl) {
      var temp = document.createElement('div');
      temp.innerHTML = buildOverlayHTML();
      document.body.appendChild(temp.firstElementChild);
      overlayEl = document.getElementById('search-overlay');
    }

    inputEl   = document.getElementById('search-overlay-input') ||
                overlayEl.querySelector('input[type="search"]');
    resultsEl = document.getElementById('search-overlay-results') ||
                overlayEl.querySelector('[role="listbox"]');
    closeBtn  = document.getElementById('search-overlay-close') ||
                overlayEl.querySelector('[data-search-close]');

    triggerBtns = Array.from(document.querySelectorAll(
      '#search-trigger, [data-search-trigger]'
    ));
  }

  /* ============================================================
     BIND EVENTS
     ============================================================ */

  function bindEvents() {

    /* Trigger buttons */
    triggerBtns.forEach(function (btn) {
      btn.addEventListener('click', openOverlay);
    });

    /* Keyboard shortcut: / or Ctrl+K */
    document.addEventListener('keydown', function (e) {
      /* Don't trigger when typing in inputs */
      var tag = (document.activeElement || {}).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === '/' || (e.ctrlKey && e.key === 'k')) {
        e.preventDefault();
        openOverlay();
      }
    });

    /* Close button */
    if (closeBtn) {
      closeBtn.addEventListener('click', closeOverlay);
    }

    /* Click outside to close */
    if (overlayEl) {
      overlayEl.addEventListener('click', function (e) {
        if (e.target === overlayEl) closeOverlay();
      });
    }

    /* Escape key */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) closeOverlay();
    });

    /* Search input */
    if (inputEl) {
      inputEl.addEventListener('input', function () {
        var query = inputEl.value.trim();

        clearTimeout(searchTimer);

        if (query.length < MIN_QUERY_LENGTH) {
          showRecentSearches();
          return;
        }

        searchTimer = setTimeout(function () {
          performSearch(query);
        }, DEBOUNCE_MS);
      });

      /* Enter to navigate to search page */
      inputEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          var query = inputEl.value.trim();
          if (query) {
            saveRecentSearch(query);
            window.location.href =
              '/jobs/job-map.html?q=' + encodeURIComponent(query);
          }
        }
      });
    }
  }

  /* ============================================================
     WAIT FOR JOBS DATA
     ============================================================ */

  function waitForJobs() {
    return new Promise(function (resolve) {
      if (window.TrabahoJobs) { resolve(); return; }
      window.addEventListener('trabahoJobs:ready', function () {
        resolve();
      }, { once: true });
    });
  }

  /* ============================================================
     INIT
     ============================================================ */

  function init() {
    resolveElements();
    bindEvents();

    /* Pre-load jobs data for instant search */
    waitForJobs();
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

  window.TrabahoSearch = {
    open:    openOverlay,
    close:   closeOverlay,
    search:  performSearch,
    clear:   clearRecentSearches
  };

}());