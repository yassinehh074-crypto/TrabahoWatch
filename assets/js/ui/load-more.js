/* ============================================================
   ASSETS/JS/UI/LOAD-MORE.JS — Load more / pagination
   Works with hub.js and job-map.js
   Saves and restores scroll position via sessionStorage
   TrabahoWatch v1.0
   ============================================================ */

'use strict';

(function () {

  /* ============================================================
     CONFIG
     ============================================================ */

  var STORAGE_KEY  = 'trabahowatch-loadmore';
  var PER_PAGE     = 12;

  /* ============================================================
     STATE
     ============================================================ */

  var state = {
    page:       1,
    perPage:    PER_PAGE,
    total:      0,
    loading:    false,
    gridId:     'jobs-grid',
    sector:     null,
    category:   null
  };

  /* ============================================================
     DOM REFERENCES
     ============================================================ */

  var btnEl        = null;
  var containerEl  = null;
  var countEl      = null;

  /* ============================================================
     RESOLVE DOM ELEMENTS
     ============================================================ */

  function resolveElements() {
    btnEl       = document.getElementById('load-more-btn');
    containerEl = document.getElementById('load-more-container');
    countEl     = document.querySelector(
      '[data-results-count], .results-header__count'
    );
  }

  /* ============================================================
     SHOW / HIDE CONTAINER
     ============================================================ */

  function show(remaining) {
    if (!containerEl || !btnEl) return;
    containerEl.style.display = 'block';

    if (remaining !== undefined) {
      var span = btnEl.querySelector('span') || btnEl;
      var text = remaining > 0
        ? 'Load More (' + remaining + ' more)'
        : 'Load More';

      if (btnEl.querySelector('span')) {
        btnEl.querySelector('span').textContent = text;
      } else {
        /* Rebuild button content */
        btnEl.innerHTML = [
          '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"',
              ' stroke-width="2" width="18" height="18" aria-hidden="true">',
            '<polyline points="1 4 1 10 7 10"/>',
            '<path d="M3.51 15a9 9 0 1 0 .49-3.52"/>',
          '</svg>',
          '<span>', text, '</span>'
        ].join('');
      }
    }
  }

  function hide() {
    if (containerEl) containerEl.style.display = 'none';
  }

  /* ============================================================
     SET LOADING STATE
     ============================================================ */

  function setLoading(loading) {
    state.loading = loading;
    if (!btnEl) return;

    btnEl.disabled = loading;

    if (loading) {
      btnEl.innerHTML = [
        '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"',
            ' stroke-width="2" width="18" height="18"',
            ' style="animation:spin 1s linear infinite;" aria-hidden="true">',
          '<path d="M21 12a9 9 0 1 1-6.219-8.56"/>',
        '</svg>',
        '<span>Loading…</span>'
      ].join('');
    } else {
      btnEl.innerHTML = [
        '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"',
            ' stroke-width="2" width="18" height="18" aria-hidden="true">',
          '<polyline points="1 4 1 10 7 10"/>',
          '<path d="M3.51 15a9 9 0 1 0 .49-3.52"/>',
        '</svg>',
        '<span>Load More</span>'
      ].join('');
      btnEl.disabled = false;
    }
  }

  /* ============================================================
     INJECT SPIN KEYFRAME (once)
     ============================================================ */

  function injectSpinStyle() {
    if (document.getElementById('loadmore-spin-style')) return;
    var style = document.createElement('style');
    style.id  = 'loadmore-spin-style';
    style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(style);
  }

  /* ============================================================
     BUILD A JOB CARD (delegates to TrabahoHub if available)
     ============================================================ */

  function buildCard(job) {
    /* Use TrabahoHub's builder if available */
    if (window.TrabahoHub && window.TrabahoHub.buildJobCard) {
      return window.TrabahoHub.buildJobCard(job);
    }

    /* Minimal fallback card */
    var salary = job.salary
      ? '₱' + Number(job.salary).toLocaleString('en-PH') + '/mo'
      : job.sg ? 'SG ' + job.sg : '';

    return [
      '<a href="', (job.url || '#'), '" class="card job-card">',
        '<div class="job-card__header">',
          '<div>',
            '<h3 class="job-card__title">', (job.title || ''), '</h3>',
            '<p class="job-card__agency">', (job.agency || ''), '</p>',
          '</div>',
        '</div>',
        salary
          ? '<div class="job-card__meta"><p class="job-card__salary">' + salary + '</p></div>'
          : '',
      '</a>'
    ].join('');
  }

  /* ============================================================
     APPEND CARDS TO GRID
     ============================================================ */

  function appendCards(jobs) {
    var grid = document.getElementById(state.gridId);
    if (!grid) return;

    var fragment = document.createDocumentFragment();

    jobs.forEach(function (job, i) {
      var temp     = document.createElement('div');
      temp.innerHTML = buildCard(job);
      var card     = temp.firstElementChild;
      if (!card) return;

      /* Entrance animation */
      card.style.opacity    = '0';
      card.style.transform  = 'translateY(12px)';
      card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';

      fragment.appendChild(card);

      /* Stagger animate */
      setTimeout(function () {
        card.style.opacity   = '1';
        card.style.transform = 'translateY(0)';
      }, i * 50);
    });

    grid.appendChild(fragment);
  }

  /* ============================================================
     LOAD NEXT PAGE
     ============================================================ */

  function loadMore() {
    if (state.loading) return;
    if (!window.TrabahoJobs) return;

    setLoading(true);

    /* Simulate async (data is already in memory) */
    setTimeout(function () {

      state.page++;

      var startIndex = (state.page - 1) * state.perPage;
      var endIndex   = startIndex + state.perPage;

      /* Get all results using current filter state */
      var filters    = window.TrabahoFilters
        ? window.TrabahoFilters.getState()
        : {};

      var allJobs;

      if (filters.q && filters.q.trim()) {
        allJobs = window.TrabahoJobs.search(filters.q, {
          sector:   filters.sector   || state.sector || null,
          category: filters.category || state.category || null
        });
      } else {
        allJobs = window.TrabahoJobs.getAll({
          sector:   filters.sector   || state.sector   || null,
          category: filters.category || state.category || null,
          region:   filters.region   || null,
          sort:     filters.sort     || 'published'
        });
      }

      state.total = allJobs.length;
      var newJobs = allJobs.slice(startIndex, endIndex);

      /* Append new cards */
      appendCards(newJobs);

      /* Update button */
      var remaining = state.total - endIndex;

      if (remaining > 0) {
        setLoading(false);
        show(remaining);
      } else {
        hide();
        showEndMessage();
      }

      /* Update results count */
      if (countEl) {
        countEl.textContent = state.total.toLocaleString('en-PH') + ' jobs found';
      }

      /* Save state to sessionStorage */
      saveState();

    }, 150); /* Small delay for UX feel */
  }

  /* ============================================================
     SHOW "END OF RESULTS" MESSAGE
     ============================================================ */

  function showEndMessage() {
    var grid = document.getElementById(state.gridId);
    if (!grid) return;

    var existing = document.getElementById('loadmore-end-msg');
    if (existing) return;

    var msg = document.createElement('p');
    msg.id  = 'loadmore-end-msg';
    msg.style.cssText = [
      'text-align:center',
      'color:var(--text-muted)',
      'font-size:var(--text-sm)',
      'padding:var(--space-6) 0',
      'grid-column:1 / -1'
    ].join(';');
    msg.textContent = '— All ' + state.total + ' jobs shown —';

    grid.after(msg);
  }

  /* ============================================================
     SAVE STATE TO SESSION STORAGE
     ============================================================ */

  function saveState() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        page:     state.page,
        scrollY:  window.scrollY,
        pathname: window.location.pathname,
        search:   window.location.search
      }));
    } catch (e) { /* ignore */ }
  }

  /* ============================================================
     RESTORE STATE FROM SESSION STORAGE
     Called on back navigation
     ============================================================ */

  function restoreState() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return false;

      var saved = JSON.parse(raw);

      /* Only restore if same page and URL */
      if (saved.pathname !== window.location.pathname) return false;
      if (saved.search   !== window.location.search)   return false;
      if (saved.page <= 1) return false;

      return saved;

    } catch (e) {
      return false;
    }
  }

  /* ============================================================
     LISTEN TO FILTER CHANGES
     Reset page when filters change
     ============================================================ */

  function listenToFilters() {
    window.addEventListener('trabahoFilters:change', function () {
      /* Reset page counter when filters change */
      state.page = 1;

      /* Clear end message */
      var msg = document.getElementById('loadmore-end-msg');
      if (msg) msg.remove();

      /* Hide load more until results render */
      hide();
    });
  }

  /* ============================================================
     LISTEN TO RESULTS RENDER
     hub.js and job-map.js dispatch this after rendering
     ============================================================ */

  window.addEventListener('trabahoResults:rendered', function (e) {
    var detail = (e && e.detail) || {};

    state.total    = detail.total    || 0;
    state.page     = detail.page     || 1;
    state.perPage  = detail.perPage  || PER_PAGE;
    state.sector   = detail.sector   || null;
    state.category = detail.category || null;

    var shown     = state.page * state.perPage;
    var remaining = state.total - shown;

    /* Clear end message */
    var msg = document.getElementById('loadmore-end-msg');
    if (msg) msg.remove();

    if (remaining > 0) {
      show(remaining);
    } else {
      hide();
    }
  });

  /* ============================================================
     BIND LOAD MORE BUTTON
     ============================================================ */

  function bindButton() {
    if (!btnEl) return;

    btnEl.addEventListener('click', function () {
      loadMore();

      /* Announce to screen readers */
      var announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.className = 'sr-only';
      announcement.textContent = 'Loading more jobs…';
      document.body.appendChild(announcement);
      setTimeout(function () {
        document.body.removeChild(announcement);
      }, 2000);
    });
  }

  /* ============================================================
     INFINITE SCROLL (optional — disabled by default)
     Enable by adding data-infinite-scroll to grid
     ============================================================ */

  function initInfiniteScroll() {
    var grid = document.getElementById(state.gridId);
    if (!grid || !grid.dataset.infiniteScroll) return;
    if (!window.IntersectionObserver) return;

    var sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    grid.after(sentinel);

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !state.loading && containerEl &&
            containerEl.style.display !== 'none') {
          loadMore();
        }
      });
    }, { rootMargin: '200px' });

    observer.observe(sentinel);
  }

  /* ============================================================
     INIT
     ============================================================ */

  function init() {
    var page = document.body.dataset.page || '';

    /* Only run on pages with a job grid */
    var hasGrid = document.getElementById('jobs-grid') ||
                  document.querySelector('[data-category-grid]');
    if (!hasGrid) return;

    injectSpinStyle();
    resolveElements();
    listenToFilters();
    bindButton();
    initInfiniteScroll();

    /* Read sector/category from body */
    state.sector   = document.body.dataset.sector   || null;
    state.category = document.body.dataset.category || null;
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

  window.TrabahoLoadMore = {
    show:      show,
    hide:      hide,
    loadMore:  loadMore,
    getState:  function () { return Object.assign({}, state); }
  };

}());function showEmptyState() {
    const grid = document.querySelector(GRID_SEL);
    if (!grid) return;

    grid.innerHTML =
      '<div class="empty-state" style="grid-column:1/-1;">' +
        '<div class="empty-state__icon">' +
          '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"' +
              ' stroke-width="1.5">' +
            '<rect x="2" y="7" width="20" height="14" rx="2"/>' +
            '<path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>' +
          '</svg>' +
        '</div>' +
        '<h3 class="empty-state__title">No jobs available</h3>' +
        '<p class="empty-state__message">' +
          'Check back soon — new jobs are added regularly.' +
        '</p>' +
      '</div>';
  }


  /* ----------------------------------------------------------
     SCROLL TO NEW CARDS
     Smooth scrolls to first newly added card.
  ---------------------------------------------------------- */
  function scrollToNewCards(previousCount) {
    const grid = document.querySelector(GRID_SEL);
    if (!grid) return;

    const cards = grid.querySelectorAll('.job-card');
    const firstNew = cards[previousCount];

    if (!firstNew) return;

    const headerHeight = parseInt(
      getComputedStyle(document.documentElement)
        .getPropertyValue('--header-height'),
      10
    ) || 64;

    const top = firstNew.getBoundingClientRect().top
              + window.scrollY
              - headerHeight
              - 24;

    window.scrollTo({ top: top, behavior: 'smooth' });
  }


  /* ============================================================
     INFINITE SCROLL (OPTIONAL)
     Activated via data-infinite-scroll attribute on button.
     ============================================================ */

  /* ----------------------------------------------------------
     INIT INFINITE SCROLL
     Replaces button with IntersectionObserver sentinel.
  ---------------------------------------------------------- */
  function initInfiniteScroll() {
    if (!('IntersectionObserver' in window)) {
      // Fallback to button
      return;
    }

    const btn = document.querySelector(BTN_SEL);
    if (!btn) return;

    // Create invisible sentinel below the grid
    const sentinel = document.createElement('div');
    sentinel.id          = 'load-more-sentinel';
    sentinel.style.height = '1px';
    sentinel.setAttribute('aria-hidden', 'true');

    const container = btn.closest('.load-more-container');
    if (container) {
      container.insertBefore(sentinel, btn);
      btn.style.display = 'none'; // hide button, use scroll instead
    }

    state.observerRef = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !state.isLoading) {
          loadMore();
        }
      });
    }, {
      rootMargin: '200px 0px',  // trigger 200px before sentinel
      threshold:  0
    });

    state.observerRef.observe(sentinel);
  }


  /* ============================================================
     ACCESSIBILITY ANNOUNCEMENT
     Screen reader notification after load.
     ============================================================ */

  function getOrCreateAnnouncer() {
    let el = document.getElementById(ANNOUNCE_ID);
    if (el) return el;

    el = document.createElement('div');
    el.id       = ANNOUNCE_ID;
    el.setAttribute('aria-live',   'polite');
    el.setAttribute('aria-atomic', 'true');
    el.style.cssText =
      'position:absolute;width:1px;height:1px;overflow:hidden;' +
      'clip:rect(0,0,0,0);white-space:nowrap;border:0;';

    document.body.appendChild(el);
    return el;
  }

  function updateAnnouncement(newCount, totalCount) {
    const el = getOrCreateAnnouncer();

    // Clear first — forces re-announcement
    el.textContent = '';

    requestAnimationFrame(function () {
      el.textContent = newCount + ' more jobs loaded. ' +
        'Showing ' + state.displayedCount + ' of ' +
        totalCount + ' total jobs.';
    });
  }


  /* ============================================================
     HELPERS
     ============================================================ */

  function isDeadlineUrgent(deadline) {
    if (!deadline) return false;
    const diff = new Date(deadline) - new Date();
    return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
  }

  function getStatusClass(job) {
    if (job.status === 'archived')   return 'job-card__status--closed';
    if (isDeadlineUrgent(job.deadline)) return 'job-card__status--soon';
    return 'job-card__status--open';
  }

  function getStatusLabel(job) {
    if (job.status === 'archived')   return 'Closed';
    if (isDeadlineUrgent(job.deadline)) return 'Closing Soon';
    return 'Open';
  }

  function formatDeadline(deadline) {
    if (!deadline) return '';
    const d = new Date(deadline);
    if (isNaN(d)) return '';
    return 'Deadline: ' + d.toLocaleDateString('en-PH', {
      month: 'short',
      day:   'numeric',
      year:  'numeric'
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g,  '&amp;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;')
      .replace(/"/g,  '&quot;')
      .replace(/'/g,  '&#039;');
  }


  /* ============================================================
     STYLES
     ============================================================ */

  function injectStyles() {
    if (document.getElementById('load-more-styles')) return;

    const style = document.createElement('style');
    style.id    = 'load-more-styles';
    style.textContent = `

      .load-more-container {
        text-align:  center;
        margin-top:  var(--space-10);
        padding-top: var(--space-4);
      }

      .load-more-complete {
        display:     inline-flex;
        align-items: center;
        gap:         var(--space-2);
        font-size:   var(--text-sm);
        color:       var(--text-muted);
        padding:     var(--space-3) var(--space-6);
        background:  var(--bg-surface-2);
        border-radius: var(--radius-full);
        border:      1px solid var(--border-color);
      }

      .load-more-complete svg {
        color: var(--color-success);
      }

    `;

    document.head.appendChild(style);
  }


  /* ============================================================
     MAIN INIT
     ============================================================ */

  function init() {
    if (shouldSkip()) return;

    injectStyles();

    const btn = document.querySelector(BTN_SEL);
    if (!btn) return;

    readConfig(btn);

    // Bind button click
    btn.addEventListener('click', function () {
      if (!state.isLoading) loadMore();
    });

    // Load data and render initial set
    if (!window.TrabahoRouter) {
      console.warn('[LoadMore] TrabahoRouter not found');
      return;
    }

    TrabahoRouter.waitForData()
      .then(function (jobs) {
        loadInitial(jobs);

        // Init infinite scroll if requested
        if (state.infiniteScroll) {
          initInfiniteScroll();
        }
      })
      .catch(function (err) {
        console.warn('[LoadMore] Data failed:', err);
        showEmptyState();
        hideButton();
      });
  }


  /* ----------------------------------------------------------
     DOM READY
  ---------------------------------------------------------- */
  if (window.TrabahoApp) {
    TrabahoApp.onReady(init);
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }


  /* ----------------------------------------------------------
     PUBLIC API
     window.TrabahoLoadMore
  ---------------------------------------------------------- */
  window.TrabahoLoadMore = {

    loadMore: loadMore,

    reset: function () {
      const grid = document.querySelector(GRID_SEL);
      if (grid) grid.innerHTML = '';
      state.displayedCount = 0;

      try {
        sessionStorage.removeItem(getSessionKey());
      } catch (e) {
        // Fail silently
      }

      if (window.TrabahoRouter) {
        TrabahoRouter.waitForData().then(loadInitial);
      }
    },

    getState: function () {
      return {
        displayed: state.displayedCount,
        total:     state.allJobs.length,
        remaining: state.allJobs.length - state.displayedCount
      };
    }

  };

}());