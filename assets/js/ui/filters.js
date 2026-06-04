/* ============================================================
   ASSETS/JS/UI/FILTERS.JS — Filter pipeline
   Manages filter state, syncs pills/selects,
   dispatches trabahoFilters:change event
   TrabahoWatch v1.0
   ============================================================ */

'use strict';

(function () {

  /* ============================================================
     FILTER STATE
     ============================================================ */

  var state = {
    q:        '',
    sector:   '',
    category: '',
    region:   '',
    type:     '',
    sort:     'published'
  };

  var debounceTimer = null;

  /* ============================================================
     DISPATCH CHANGE EVENT
     ============================================================ */

  function dispatch() {
    window.dispatchEvent(new CustomEvent('trabahoFilters:change', {
      detail: Object.assign({}, state),
      bubbles: true
    }));
  }

  function dispatchDebounced(delay) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(dispatch, delay || 300);
  }

  /* ============================================================
     SET A FILTER VALUE
     ============================================================ */

  function setFilter(key, value, immediate) {
    if (!(key in state)) return;
    if (state[key] === value) return;

    state[key] = value || '';

    if (immediate) {
      dispatch();
    } else {
      dispatchDebounced(200);
    }
  }

  /* ============================================================
     RESET ALL FILTERS
     ============================================================ */

  function resetAll() {
    state.q        = '';
    state.sector   = '';
    state.category = '';
    state.region   = '';
    state.type     = '';
    state.sort     = 'published';

    /* Reset all bound UI elements */
    syncUIFromState();
    dispatch();
  }

  /* ============================================================
     SYNC UI ELEMENTS → state (read from DOM)
     ============================================================ */

  function syncStateFromUI() {
    /* Search inputs */
    var searchInput = document.querySelector(
      'input[data-filter="q"], #job-search-input, [data-jobmap-search]'
    );
    if (searchInput) state.q = searchInput.value.trim();

    /* Selects */
    ['sector', 'category', 'region', 'sort'].forEach(function (key) {
      var sel = document.querySelector('[data-filter="' + key + '"]');
      if (sel) state[key] = sel.value || '';
    });

    /* Active pill buttons */
    document.querySelectorAll('[data-filter-pill]').forEach(function (btn) {
      var key = btn.dataset.filterPill;
      if (btn.getAttribute('aria-pressed') === 'true') {
        state[key] = btn.dataset.value || '';
      }
    });
  }

  /* ============================================================
     SYNC UI ELEMENTS ← state (write to DOM)
     ============================================================ */

  function syncUIFromState() {
    /* Search inputs */
    document.querySelectorAll(
      'input[data-filter="q"], #job-search-input, [data-jobmap-search]'
    ).forEach(function (input) {
      input.value = state.q;
    });

    /* Select dropdowns */
    ['sector', 'category', 'region', 'sort'].forEach(function (key) {
      document.querySelectorAll('[data-filter="' + key + '"]').forEach(function (sel) {
        sel.value = state[key] || '';
      });
    });

    /* Pill buttons */
    document.querySelectorAll('[data-filter-pill]').forEach(function (btn) {
      var key    = btn.dataset.filterPill;
      var active = (btn.dataset.value || '') === (state[key] || '');
      btn.classList.toggle('btn--pill-active',   active);
      btn.classList.toggle('btn--pill-inactive', !active);
      btn.setAttribute('aria-pressed', String(active));
    });

    /* Results count */
    updateResultsCount();
  }

  /* ============================================================
     UPDATE RESULTS COUNT LABEL
     ============================================================ */

  function updateResultsCount(total) {
    var countEl = document.querySelector(
      '[data-results-count], .results-header__count'
    );
    if (!countEl) return;

    if (total === undefined) {
      countEl.textContent = 'Loading…';
      return;
    }

    if (total === 0) {
      countEl.textContent = 'No results found';
    } else if (total === 1) {
      countEl.textContent = '1 job found';
    } else {
      countEl.textContent = total.toLocaleString('en-PH') + ' jobs found';
    }
  }

  /* ============================================================
     BIND SEARCH INPUT
     ============================================================ */

  function bindSearchInputs() {
    var selector = [
      'input[data-filter="q"]',
      '#job-search-input',
      '[data-jobmap-search]',
      '.filter-search-input'
    ].join(', ');

    document.querySelectorAll(selector).forEach(function (input) {
      /* Input event — debounced */
      input.addEventListener('input', function () {
        state.q = input.value.trim();
        dispatchDebounced(350);
      });

      /* Enter key — immediate */
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          state.q = input.value.trim();
          clearTimeout(debounceTimer);
          dispatch();
        }
      });

      /* Clear button inside input */
      var clearBtn = input.parentNode
        ? input.parentNode.querySelector('[data-filter-clear-input]')
        : null;
      if (clearBtn) {
        clearBtn.addEventListener('click', function () {
          input.value = '';
          state.q = '';
          input.focus();
          dispatch();
        });
      }
    });
  }

  /* ============================================================
     BIND SELECT DROPDOWNS
     ============================================================ */

  function bindSelects() {
    document.querySelectorAll('[data-filter]').forEach(function (sel) {
      if (sel.tagName !== 'SELECT') return;

      sel.addEventListener('change', function () {
        var key = sel.dataset.filter;
        if (key in state) {
          state[key] = sel.value || '';
          dispatch();
        }
      });
    });
  }

  /* ============================================================
     BIND PILL BUTTONS
     ============================================================ */

  function bindPills() {
    document.querySelectorAll('[data-filter-pill]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key   = btn.dataset.filterPill;
        var value = btn.dataset.value || '';

        /* Toggle: clicking active pill deactivates it */
        if (state[key] === value) {
          value = '';
        }

        state[key] = value;

        /* Update sibling pills in same group */
        document.querySelectorAll(
          '[data-filter-pill="' + key + '"]'
        ).forEach(function (sibling) {
          var active = (sibling.dataset.value || '') === value;
          sibling.classList.toggle('btn--pill-active',   active);
          sibling.classList.toggle('btn--pill-inactive', !active);
          sibling.setAttribute('aria-pressed', String(active));
        });

        /* Sync any matching select */
        var matchingSelect = document.querySelector(
          '[data-filter="' + key + '"]'
        );
        if (matchingSelect && matchingSelect.tagName === 'SELECT') {
          matchingSelect.value = value;
        }

        dispatch();
      });
    });
  }

  /* ============================================================
     BIND CLEAR BUTTONS
     ============================================================ */

  function bindClearButtons() {

    /* Clear all filters */
    document.querySelectorAll(
      '#clear-filters-btn, [data-filter-clear-all]'
    ).forEach(function (btn) {
      btn.addEventListener('click', function () {
        resetAll();
      });
    });

    /* Clear individual filter */
    document.querySelectorAll('[data-filter-clear]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.dataset.filterClear;
        if (key && key in state) {
          state[key] = key === 'sort' ? 'published' : '';
          syncUIFromState();
          dispatch();
        }
      });
    });
  }

  /* ============================================================
     BIND SORT SHORTCUTS
     e.g. <button data-sort-by="deadline">Sort by Deadline</button>
     ============================================================ */

  function bindSortShortcuts() {
    document.querySelectorAll('[data-sort-by]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var sortValue = btn.dataset.sortBy;
        state.sort = sortValue || 'published';

        /* Update select if present */
        var sortSelect = document.querySelector('[data-filter="sort"]');
        if (sortSelect) sortSelect.value = state.sort;

        /* Update button states */
        document.querySelectorAll('[data-sort-by]').forEach(function (b) {
          b.classList.toggle('btn--pill-active',
            b.dataset.sortBy === state.sort);
          b.classList.toggle('btn--pill-inactive',
            b.dataset.sortBy !== state.sort);
        });

        dispatch();
      });
    });
  }

  /* ============================================================
     INIT FROM URL PARAMS
     ============================================================ */

  function initFromURL() {
    var params = new URLSearchParams(window.location.search);

    if (params.get('q'))        state.q        = params.get('q');
    if (params.get('sector'))   state.sector   = params.get('sector');
    if (params.get('category')) state.category = params.get('category');
    if (params.get('region'))   state.region   = params.get('region');
    if (params.get('sort'))     state.sort     = params.get('sort');
    if (params.get('type'))     state.type     = params.get('type');
  }

  /* ============================================================
     LISTEN TO RESULTS COUNT UPDATE
     (hub.js and job-map.js post results count back)
     ============================================================ */

  window.addEventListener('trabahoResults:count', function (e) {
    updateResultsCount(e.detail && e.detail.count);
  });

  /* ============================================================
     INIT
     ============================================================ */

  function init() {
    /* Only run on pages with filter UI */
    var hasFilters = document.querySelector(
      '[data-filter], [data-filter-pill], #job-search-input, [data-jobmap-search]'
    );
    if (!hasFilters) return;

    /* Read initial state from URL */
    initFromURL();

    /* Bind all UI elements */
    bindSearchInputs();
    bindSelects();
    bindPills();
    bindClearButtons();
    bindSortShortcuts();

    /* Sync UI to match initial state */
    syncUIFromState();
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

  window.TrabahoFilters = {
    getState:       function ()      { return Object.assign({}, state); },
    setFilter:      setFilter,
    resetAll:       resetAll,
    syncUI:         syncUIFromState,
    updateCount:    updateResultsCount,
    dispatch:       dispatch
  };

}());