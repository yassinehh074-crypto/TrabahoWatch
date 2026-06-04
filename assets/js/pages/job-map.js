/* ============================================================
   ASSETS/JS/PAGES/JOB-MAP.JS — Search and browse all jobs
   Reads URL params, renders jobs, syncs filters with URL
   TrabahoWatch v1.0
   ============================================================ */

'use strict';

(function () {

  /* ============================================================
     STATE
     ============================================================ */

  var state = {
    query:    '',
    sector:   '',
    category: '',
    region:   '',
    sort:     'published',
    page:     1,
    perPage:  12
  };

  var allResults   = [];
  var currentJobs  = [];

  /* ============================================================
     WAIT FOR JOBS
     ============================================================ */

  function waitForJobs() {
    return new Promise(function (resolve) {
      if (window.TrabahoJobs) {
        resolve(window.TrabahoJobs);
        return;
      }
      window.addEventListener('trabahoJobs:ready', function () {
        resolve(window.TrabahoJobs);
      }, { once: true });
    });
  }

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
     FORMAT HELPERS
     ============================================================ */

  function formatPeso(n) {
    if (!n) return '';
    return '₱' + Number(n).toLocaleString('en-PH');
  }

  function formatDeadline(dateStr) {
    if (!dateStr) return '';
    var d    = new Date(dateStr);
    var now  = new Date();
    if (isNaN(d.getTime())) return '';
    var diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
    if (diff < 0)   return 'Deadline passed';
    if (diff === 0) return 'Closes today';
    if (diff === 1) return 'Tomorrow';
    if (diff <= 7)  return diff + ' days left';
    return d.toLocaleDateString('en-PH', { month:'short', day:'numeric', year:'numeric' });
  }

  function buildSalaryText(job) {
    if (job.salaryText) return esc(job.salaryText);
    if (job.salary)     return formatPeso(job.salary) + '/mo';
    if (job.salaryMin && job.salaryMax) {
      return formatPeso(job.salaryMin) + '–' + formatPeso(job.salaryMax) + '/mo';
    }
    if (job.sg) return 'SG ' + job.sg;
    return '';
  }

  /* ============================================================
     READ URL PARAMS → state
     ============================================================ */

  function readURLParams() {
    var params = new URLSearchParams(window.location.search);
    state.query    = params.get('q')        || '';
    state.sector   = params.get('sector')   || '';
    state.category = params.get('category') || '';
    state.region   = params.get('region')   || '';
    state.sort     = params.get('sort')     || 'published';
    state.page     = parseInt(params.get('page'), 10) || 1;
  }

  /* ============================================================
     WRITE state → URL (without reload)
     ============================================================ */

  function syncURL() {
    var params = new URLSearchParams();
    if (state.query)    params.set('q',        state.query);
    if (state.sector)   params.set('sector',   state.sector);
    if (state.category) params.set('category', state.category);
    if (state.region)   params.set('region',   state.region);
    if (state.sort !== 'published') params.set('sort', state.sort);
    if (state.page > 1) params.set('page', state.page);

    var newURL = window.location.pathname +
      (params.toString() ? '?' + params.toString() : '');

    window.history.replaceState(null, '', newURL);
  }

  /* ============================================================
     FILL INPUTS FROM STATE
     ============================================================ */

  function fillInputsFromState() {
    var searchInput = document.getElementById('job-search-input') ||
                      document.querySelector('[data-jobmap-search]');
    if (searchInput && state.query) {
      searchInput.value = state.query;
    }

    /* Sector pills */
    document.querySelectorAll('[data-filter-pill="sector"]').forEach(function (btn) {
      var active = btn.dataset.value === state.sector;
      btn.classList.toggle('btn--pill-active',   active);
      btn.classList.toggle('btn--pill-inactive', !active);
      btn.setAttribute('aria-pressed', String(active));
    });

    /* Selects */
    ['sector','category','region','sort'].forEach(function (key) {
      var sel = document.querySelector('[data-filter="' + key + '"]');
      if (sel && state[key]) sel.value = state[key];
    });
  }

  /* ============================================================
     APPLY FILTERS → allResults
     ============================================================ */

  function applyFilters() {
    var api = window.TrabahoJobs;

    /* Start with search or getAll */
    if (state.query && state.query.trim()) {
      allResults = api.search(state.query, {
        sector:   state.sector   || null,
        category: state.category || null,
        includeArchived: false
      });
    } else {
      allResults = api.getAll({
        sector:   state.sector   || null,
        category: state.category || null,
        region:   state.region   || null,
        sort:     state.sort     || 'published',
        openOnly: false
      });
    }

    /* Region filter (when using search) */
    if (state.region && state.query) {
      allResults = allResults.filter(function (j) {
        return j.region === state.region;
      });
    }

    /* Sort */
    if (state.sort === 'deadline') {
      allResults.sort(function (a, b) {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      });
    } else if (state.sort === 'salary') {
      allResults.sort(function (a, b) {
        return (b.salary || b.salaryMin || 0) -
               (a.salary || a.salaryMin || 0);
      });
    }

    return allResults;
  }

  /* ============================================================
     BUILD JOB CARD HTML
     ============================================================ */

  function buildJobCard(job) {
    var salary       = buildSalaryText(job);
    var deadline     = formatDeadline(job.deadline);
    var isUrgent     = job.isUrgent;
    var sectorBadge  = {
      government: '<span class="badge badge--gov">Gov</span>',
      private:    '<span class="badge badge--private">Private</span>',
      ofw:        '<span class="badge badge--ofw">OFW</span>'
    }[job.sector] || '';

    var statusBadge = job.isArchived
      ? '<span class="badge badge--archived">Archived</span>'
      : job.isPaused
        ? '<span class="badge badge--paused">Paused</span>'
        : job.isUrgent
          ? '<span class="badge badge--urgent">Closing Soon</span>'
          : '<span class="badge badge--open">Open</span>';

    return [
      '<a href="', esc(job.url), '" ',
      'class="card job-card" ',
      'aria-label="', esc(job.title), ' at ', esc(job.agency), '">',

        '<div class="job-card__header">',
          '<div style="flex:1;min-width:0;">',
            '<h3 class="job-card__title">', esc(job.title), '</h3>',
            '<p class="job-card__agency">', esc(job.agency), '</p>',
          '</div>',
          statusBadge,
        '</div>',

        '<div style="display:flex;gap:var(--space-2);flex-wrap:wrap;',
            'margin-top:var(--space-2);">',
          sectorBadge,
          job.category
            ? '<span class="badge" style="font-size:10px;">' +
              esc(job.category) + '</span>'
            : '',
        '</div>',

        '<div class="job-card__meta">',

          salary
            ? '<p class="job-card__salary">' + salary + '</p>'
            : '',

          job.location
            ? '<p class="job-card__location">' +
              '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"' +
              ' stroke-width="2" aria-hidden="true">' +
              '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>' +
              '<circle cx="12" cy="10" r="3"/></svg>' +
              esc(job.location) + '</p>'
            : '',

          deadline
            ? '<p class="' +
              (isUrgent
                ? 'job-card__deadline job-card__deadline--urgent'
                : 'job-card__deadline') +
              '">' +
              '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"' +
              ' stroke-width="2" aria-hidden="true">' +
              '<rect x="3" y="4" width="18" height="18" rx="2"/>' +
              '<line x1="3" y1="10" x2="21" y2="10"/></svg>' +
              esc(deadline) + '</p>'
            : '',

        '</div>',

      '</a>'
    ].join('');
  }

  /* ============================================================
     BUILD EMPTY STATE
     ============================================================ */

  function buildEmptyState() {
    var hasFilters = state.query || state.sector ||
                     state.category || state.region;

    return [
      '<div class="empty-state">',
        '<div class="empty-state__icon">',
          '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="1.5">',
            '<circle cx="11" cy="11" r="8"/>',
            '<path d="m21 21-4.35-4.35"/>',
          '</svg>',
        '</div>',
        '<h2 class="empty-state__title">No jobs found</h2>',
        '<p class="empty-state__message">',
          hasFilters
            ? 'No results match your filters. Try adjusting your search or clearing the filters.'
            : 'No job listings are available right now. Check back soon.',
        '</p>',
        '<div style="display:flex;gap:var(--space-3);justify-content:center;flex-wrap:wrap;">',
          hasFilters
            ? '<button class="btn btn--primary" id="clear-all-btn" type="button">Clear All Filters</button>'
            : '',
          '<a href="/pages/submit-job.html" class="btn btn--ghost">Submit a Job</a>',
        '</div>',
      '</div>'
    ].join('');
  }

  /* ============================================================
     RENDER RESULTS TO GRID
     ============================================================ */

  function renderResults() {
    var grid = document.getElementById('jobs-grid');
    if (!grid) return;

    /* Pagination slice */
    var startIndex = (state.page - 1) * state.perPage;
    var endIndex   = startIndex + state.perPage;
    currentJobs    = allResults.slice(0, endIndex);

    grid.setAttribute('aria-busy', 'false');

    if (allResults.length === 0) {
      grid.innerHTML = buildEmptyState();

      /* Show empty state overlay */
      var emptyOverlay = document.getElementById('filter-empty-state');
      if (emptyOverlay) emptyOverlay.style.display = 'block';

      hideLoadMore();
      return;
    }

    /* Hide empty state overlay */
    var emptyOverlay = document.getElementById('filter-empty-state');
    if (emptyOverlay) emptyOverlay.style.display = 'none';

    /* Render cards */
    grid.innerHTML = currentJobs.map(buildJobCard).join('');

    /* Animate in */
    requestAnimationFrame(function () {
      grid.querySelectorAll('.job-card').forEach(function (card, i) {
        card.style.opacity    = '0';
        card.style.transform  = 'translateY(10px)';
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        setTimeout(function () {
          card.style.opacity   = '1';
          card.style.transform = 'translateY(0)';
        }, i * 40);
      });
    });

    /* Load more button */
    if (allResults.length > endIndex) {
      showLoadMore(allResults.length - endIndex);
    } else {
      hideLoadMore();
    }
  }

  /* ============================================================
     UPDATE RESULTS COUNT
     ============================================================ */

  function updateResultsCount() {
    var countEl = document.querySelector(
      '[data-results-count], .results-header__count'
    );
    if (!countEl) return;

    var total = allResults.length;
    if (total === 0) {
      countEl.textContent = 'No results found';
    } else if (total === 1) {
      countEl.textContent = '1 job found';
    } else {
      countEl.textContent = total.toLocaleString('en-PH') + ' jobs found';
    }
  }

  /* ============================================================
     ACTIVE FILTER TAGS
     ============================================================ */

  function buildActiveTags() {
    var container = document.getElementById('active-filter-tags');
    if (!container) return;

    var tags = [];

    if (state.query) {
      tags.push({
        label: 'Search: "' + state.query + '"',
        clear: function () { state.query = ''; }
      });
    }

    if (state.sector) {
      tags.push({
        label: 'Sector: ' + state.sector,
        clear: function () { state.sector = ''; }
      });
    }

    if (state.category) {
      tags.push({
        label: 'Category: ' + state.category,
        clear: function () { state.category = ''; }
      });
    }

    if (state.region) {
      tags.push({
        label: 'Region: ' + state.region,
        clear: function () { state.region = ''; }
      });
    }

    if (tags.length === 0) {
      container.innerHTML = '';
      container.style.display = 'none';
      return;
    }

    container.style.display = 'flex';
    container.innerHTML = tags.map(function (tag, i) {
      return [
        '<span style="display:inline-flex;align-items:center;gap:var(--space-1);',
            'padding:3px 10px;background:rgba(22,72,150,0.1);',
            'color:var(--color-primary);border-radius:var(--radius-full);',
            'font-size:var(--text-xs);font-weight:var(--font-semibold);">',
          esc(tag.label),
          '<button type="button" ',
              'data-tag-index="' + i + '" ',
              'aria-label="Remove ' + esc(tag.label) + ' filter" ',
              'style="border:none;background:none;cursor:pointer;',
              'color:inherit;padding:0;margin-left:2px;',
              'display:flex;align-items:center;">',
            '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"',
                ' stroke-width="2.5" width="12" height="12" aria-hidden="true">',
              '<line x1="18" y1="6" x2="6" y2="18"/>',
              '<line x1="6" y1="6" x2="18" y2="18"/>',
            '</svg>',
          '</button>',
        '</span>'
      ].join('');
    }).join('');

    /* Bind remove buttons */
    container.querySelectorAll('[data-tag-index]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.dataset.tagIndex, 10);
        tags[idx].clear();
        state.page = 1;
        run();
      });
    });
  }

  /* ============================================================
     POPULAR SEARCHES
     ============================================================ */

  var POPULAR_SEARCHES = [
    { label: 'Teacher I',        q: 'Teacher I',    sector: 'government' },
    { label: 'Nurse I',          q: 'Nurse I',       sector: 'government' },
    { label: 'BPO / Call Center',q: 'BPO',           sector: 'private'    },
    { label: 'Saudi Arabia',     q: 'Saudi',         sector: 'ofw'        },
    { label: 'Japan Care Worker',q: 'care worker',   sector: 'ofw'        },
    { label: 'Software Developer', q: 'developer',  sector: 'private'    },
    { label: 'LGU Admin',        q: 'Admin',         sector: 'government' },
    { label: 'Canada Nurse',     q: 'Canada',        sector: 'ofw'        }
  ];

  function buildPopularSearches() {
    var container = document.getElementById('popular-searches');
    if (!container) return;

    container.innerHTML = POPULAR_SEARCHES.map(function (item) {
      return [
        '<button type="button" ',
            'class="btn btn--pill btn--pill-inactive btn--sm" ',
            'data-popular-q="', esc(item.q), '" ',
            'data-popular-sector="', esc(item.sector), '" ',
            'aria-label="Search for ', esc(item.label), '">',
          esc(item.label),
        '</button>'
      ].join('');
    }).join('');

    container.querySelectorAll('[data-popular-q]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.query  = btn.dataset.popularQ;
        state.sector = btn.dataset.popularSector || '';
        state.page   = 1;

        /* Update search input */
        var searchInput = document.querySelector('[data-jobmap-search]');
        if (searchInput) searchInput.value = state.query;

        run();
      });
    });
  }

  /* ============================================================
     SHOW / HIDE LOAD MORE
     ============================================================ */

  function showLoadMore(remaining) {
    var container = document.getElementById('load-more-container');
    var btn       = document.getElementById('load-more-btn');
    if (!container || !btn) return;
    container.style.display = 'block';
    btn.textContent = 'Load More (' + remaining + ' remaining)';
  }

  function hideLoadMore() {
    var container = document.getElementById('load-more-container');
    if (container) container.style.display = 'none';
  }

  /* ============================================================
     MAIN RUN — apply filters + render
     ============================================================ */

  function run() {
    var grid = document.getElementById('jobs-grid');
    if (grid) grid.setAttribute('aria-busy', 'true');

    applyFilters();
    updateResultsCount();
    buildActiveTags();
    syncURL();
    renderResults();
  }

  /* ============================================================
     BIND SEARCH INPUT
     ============================================================ */

  function bindSearch() {
    var input = document.getElementById('job-search-input') ||
                document.querySelector('[data-jobmap-search]');
    if (!input) return;

    var timer;
    input.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        state.query = input.value.trim();
        state.page  = 1;
        run();
      }, 300);
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        clearTimeout(timer);
        state.query = input.value.trim();
        state.page  = 1;
        run();
      }
    });
  }

  /* ============================================================
     BIND FILTER CONTROLS
     ============================================================ */

  function bindFilters() {

    /* Sector pill buttons */
    document.querySelectorAll('[data-filter-pill="sector"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.sector = btn.dataset.value || '';
        state.page   = 1;

        /* Update pill states */
        document.querySelectorAll('[data-filter-pill="sector"]').forEach(function (b) {
          var active = b.dataset.value === state.sector;
          b.classList.toggle('btn--pill-active',   active);
          b.classList.toggle('btn--pill-inactive', !active);
          b.setAttribute('aria-pressed', String(active));
        });

        run();
      });
    });

    /* Generic pill buttons (type, etc.) */
    document.querySelectorAll('[data-filter-pill]:not([data-filter-pill="sector"])').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filterKey = btn.dataset.filterPill;
        state[filterKey] = btn.dataset.value || '';
        state.page = 1;

        /* Update sibling pills */
        document.querySelectorAll('[data-filter-pill="' + filterKey + '"]').forEach(function (b) {
          var active = b.dataset.value === state[filterKey];
          b.classList.toggle('btn--pill-active',   active);
          b.classList.toggle('btn--pill-inactive', !active);
          b.setAttribute('aria-pressed', String(active));
        });

        run();
      });
    });

    /* Select dropdowns */
    document.querySelectorAll('[data-filter]').forEach(function (sel) {
      sel.addEventListener('change', function () {
        var key = sel.dataset.filter;
        if (key in state) {
          state[key] = sel.value;
          state.page = 1;
          run();
        }
      });
    });

    /* Clear filters button */
    var clearBtn = document.getElementById('clear-filters-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        state.query    = '';
        state.sector   = '';
        state.category = '';
        state.region   = '';
        state.sort     = 'published';
        state.page     = 1;
        fillInputsFromState();
        run();
      });
    }

    /* Clear all button (inside empty state) */
    document.addEventListener('click', function (e) {
      if (e.target && e.target.id === 'clear-all-btn') {
        state.query    = '';
        state.sector   = '';
        state.category = '';
        state.region   = '';
        state.sort     = 'published';
        state.page     = 1;
        fillInputsFromState();
        run();
      }
    });
  }

  /* ============================================================
     BIND LOAD MORE
     ============================================================ */

  function bindLoadMore() {
    var btn = document.getElementById('load-more-btn');
    if (!btn) return;

    btn.addEventListener('click', function () {
      state.page++;

      /* Append new cards */
      var grid       = document.getElementById('jobs-grid');
      var startIndex = (state.page - 1) * state.perPage;
      var endIndex   = startIndex + state.perPage;
      var newJobs    = allResults.slice(startIndex, endIndex);

      newJobs.forEach(function (job) {
        var temp = document.createElement('div');
        temp.innerHTML = buildJobCard(job);
        var card = temp.firstElementChild;
        card.style.opacity   = '0';
        card.style.transform = 'translateY(10px)';
        card.style.transition= 'opacity 0.3s ease, transform 0.3s ease';
        grid.appendChild(card);

        requestAnimationFrame(function () {
          card.style.opacity   = '1';
          card.style.transform = 'translateY(0)';
        });
      });

      /* Update load more */
      var remaining = allResults.length - endIndex;
      if (remaining > 0) {
        showLoadMore(remaining);
      } else {
        hideLoadMore();
      }

      syncURL();
    });
  }

  /* ============================================================
     RESTORE SCROLL POSITION (sessionStorage)
     ============================================================ */

  function saveScrollPosition() {
    window.addEventListener('beforeunload', function () {
      sessionStorage.setItem(
        'jobmap-scroll',
        JSON.stringify({ y: window.scrollY, query: state.query })
      );
    });
  }

  function restoreScrollPosition() {
    try {
      var saved = JSON.parse(sessionStorage.getItem('jobmap-scroll') || 'null');
      if (saved && saved.query === state.query && saved.y > 0) {
        setTimeout(function () {
          window.scrollTo({ top: saved.y, behavior: 'instant' });
        }, 100);
        sessionStorage.removeItem('jobmap-scroll');
      }
    } catch (e) { /* ignore */ }
  }

  /* ============================================================
     MAIN INIT
     ============================================================ */

  function init() {
    var page = document.body.dataset.page;
    if (page !== 'job-map') return;

    readURLParams();

    waitForJobs().then(function () {

      /* Fill inputs from URL state */
      fillInputsFromState();

      /* Bind controls */
      bindSearch();
      bindFilters();
      bindLoadMore();

      /* Build popular searches widget */
      buildPopularSearches();

      /* Initial render */
      run();

      /* Restore scroll */
      restoreScrollPosition();
      saveScrollPosition();

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

}());