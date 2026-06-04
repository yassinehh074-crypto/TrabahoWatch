/* ============================================================
   FILE: assets/js/core/router.js
   PURPOSE: URL parameter parsing, slug extraction,
            navigation helpers, and redirect logic.
            Used by article.js, hub.js, job-map.js
            to read current page context from the URL.
   DEPENDS ON: app.js
   LOAD ORDER: <script src="/assets/js/core/router.js" defer>
   ============================================================ */


(function () {

  'use strict';


  /* ----------------------------------------------------------
     CONSTANTS
  ---------------------------------------------------------- */
  const POLL_INTERVAL = 50;   // ms between TrabahoJobs checks
  const POLL_TIMEOUT  = 8000; // ms max wait for TrabahoJobs


  /* ----------------------------------------------------------
     SANITIZE
     Strips HTML tags from any string read from the URL.
     Prevents XSS injection from malicious query params.
  ---------------------------------------------------------- */
  function sanitize(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/[<>'"]/g, '')   // remove HTML chars
      .trim()
      .slice(0, 200);           // max length safety
  }


  /* ----------------------------------------------------------
     GET QUERY PARAM
     Reads ?key=value from current URL.
     Returns sanitized string or null.
  ---------------------------------------------------------- */
  function getParam(key) {
    try {
      const params = new URLSearchParams(window.location.search);
      const value  = params.get(key);
      return value ? sanitize(value) : null;
    } catch (e) {
      return null;
    }
  }


  /* ----------------------------------------------------------
     GET ALL PARAMS
     Returns all query params as a sanitized object.
  ---------------------------------------------------------- */
  function getAllParams() {
    const result = {};
    try {
      const params = new URLSearchParams(window.location.search);
      params.forEach(function (value, key) {
        result[sanitize(key)] = sanitize(value);
      });
    } catch (e) {
      // Return empty object on failure
    }
    return result;
  }


  /* ----------------------------------------------------------
     GET SLUG FROM PATH
     Extracts job ID from clean URL structure.

     Handles both URL formats:
       Production:  /jobs/deped-teacher1-qc-2026/
       Development: /jobs/article.html?id=deped-teacher1-qc-2026

     Returns: 'deped-teacher1-qc-2026' or null
  ---------------------------------------------------------- */
  function getSlugFromPath() {
    const path  = window.location.pathname;
    const parts = path.replace(/\/$/, '').split('/').filter(Boolean);

    // /jobs/deped-teacher1-qc-2026/ → ['jobs', 'deped-teacher1-qc-2026']
    if (parts.length >= 2 && parts[0] === 'jobs') {
      const slug = parts[1];
      // Valid slug — not 'article.html', 'feed.json', etc.
      if (slug && !slug.includes('.')) {
        return sanitize(slug);
      }
    }

    return null;
  }


  /* ----------------------------------------------------------
     GET JOB ID
     Resolves job ID from either URL format.
     Priority: clean path slug → ?id= param
  ---------------------------------------------------------- */
  function getJobId() {
    return getSlugFromPath() || getParam('id');
  }


  /* ----------------------------------------------------------
     GET SEARCH QUERY
     Reads ?q= from job-map.html
  ---------------------------------------------------------- */
  function getSearchQuery() {
    return getParam('q') || '';
  }


  /* ----------------------------------------------------------
     GET CATEGORY
     Reads ?cat= from hub pages
  ---------------------------------------------------------- */
  function getCategory() {
    return getParam('cat') || '';
  }


  /* ----------------------------------------------------------
     GET REGION
     Reads ?region= from filter
  ---------------------------------------------------------- */
  function getRegion() {
    return getParam('region') || '';
  }


  /* ----------------------------------------------------------
     GET SECTOR
     Reads ?sector= from filter
  ---------------------------------------------------------- */
  function getSector() {
    return getParam('sector') || '';
  }


  /* ----------------------------------------------------------
     GET PAGE NUMBER
     Reads ?page= for pagination
     Returns integer >= 1
  ---------------------------------------------------------- */
  function getPage() {
    const p = parseInt(getParam('page'), 10);
    return (!isNaN(p) && p >= 1) ? p : 1;
  }


  /* ----------------------------------------------------------
     BUILD URL
     Constructs a URL with query params cleanly.

     Usage:
       TrabahoRouter.buildUrl('/jobs/job-map.html', { q: 'nurse' })
       → '/jobs/job-map.html?q=nurse'
  ---------------------------------------------------------- */
  function buildUrl(base, params) {
    params = params || {};
    const entries = Object.entries(params).filter(
      function (e) { return e[1] !== '' && e[1] !== null && e[1] !== undefined; }
    );

    if (!entries.length) return base;

    const qs = entries.map(function (e) {
      return encodeURIComponent(e[0]) + '=' + encodeURIComponent(e[1]);
    }).join('&');

    return base + '?' + qs;
  }


  /* ----------------------------------------------------------
     NAVIGATE TO
     Programmatic navigation with History API.
     Falls back to window.location.href on failure.
  ---------------------------------------------------------- */
  function navigateTo(url, replace) {
    try {
      if (replace) {
        history.replaceState(null, '', url);
      } else {
        history.pushState(null, '', url);
      }
      // Dispatch event so other scripts know URL changed
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (e) {
      // Fallback for environments where History API fails
      if (replace) {
        window.location.replace(url);
      } else {
        window.location.href = url;
      }
    }
  }


  /* ----------------------------------------------------------
     REDIRECT TO 404
     Called when job ID not found or page is invalid.
     Preserves the bad URL as a query param for debugging.
  ---------------------------------------------------------- */
  function redirectTo404(reason) {
    const from = encodeURIComponent(window.location.href);
    window.location.replace('/pages/404.html?from=' + from);
  }


  /* ----------------------------------------------------------
     REDIRECT TO SEARCH
     Called from hero search bar.
     Navigates to job-map.html with ?q=
  ---------------------------------------------------------- */
  function redirectToSearch(query) {
    query = sanitize(query);
    if (!query) return;
    window.location.href = buildUrl('/jobs/job-map.html', { q: query });
  }


  /* ----------------------------------------------------------
     UPDATE URL PARAM
     Updates a single param in current URL without reload.
     Used by filters on hub pages.

     Usage:
       TrabahoRouter.updateParam('region', 'ncr')
       TrabahoRouter.updateParam('region', '')  // removes it
  ---------------------------------------------------------- */
  function updateParam(key, value) {
    try {
      const url    = new URL(window.location.href);
      const params = url.searchParams;

      if (value === '' || value === null) {
        params.delete(key);
      } else {
        params.set(key, sanitize(value));
      }

      // Reset to page 1 when filter changes
      if (key !== 'page') {
        params.delete('page');
      }

      navigateTo(url.pathname + (params.toString() ? '?' + params : ''));
    } catch (e) {
      // Fail silently — filters still work visually
    }
  }


  /* ----------------------------------------------------------
     WAIT FOR TRABAHODATA
     Polls until TrabahoJobs global is available.
     Resolves with the TrabahoJobs object.
     Rejects after POLL_TIMEOUT ms.

     Usage:
       TrabahoRouter.waitForData().then(function(jobs) {
         const job = jobs.getJobById('deped-teacher1');
       });
  ---------------------------------------------------------- */
  function waitForData() {
    return new Promise(function (resolve, reject) {

      // Already available
      if (window.TrabahoJobs) {
        resolve(window.TrabahoJobs);
        return;
      }

      let elapsed  = 0;

      const timer = setInterval(function () {
        elapsed += POLL_INTERVAL;

        if (window.TrabahoJobs) {
          clearInterval(timer);
          resolve(window.TrabahoJobs);
          return;
        }

        if (elapsed >= POLL_TIMEOUT) {
          clearInterval(timer);
          reject(new Error('[TrabahoRouter] TrabahoJobs not available after ' + POLL_TIMEOUT + 'ms'));
        }
      }, POLL_INTERVAL);

    });
  }


  /* ----------------------------------------------------------
     RESOLVE CURRENT PAGE
     Returns a context object describing the current page.

     Returns:
     {
       type:     'home' | 'article' | 'hub' | 'search' | 'static'
       jobId:    string | null
       query:    string
       category: string
       region:   string
       sector:   string
       page:     number
       path:     string
       params:   object
     }
  ---------------------------------------------------------- */
  function resolveCurrentPage() {
    const path   = window.location.pathname;
    const jobId  = getJobId();

    let type = 'static';

    if (path === '/' || path === '/index.html') {
      type = 'home';
    } else if (jobId || (path.includes('/jobs/') && !path.includes('job-map'))) {
      type = 'article';
    } else if (path.includes('/jobs/job-map')) {
      type = 'search';
    } else if (
      path.includes('/government/') ||
      path.includes('/private/')    ||
      path.includes('/ofw/')
    ) {
      type = 'hub';
    }

    return {
      type:     type,
      jobId:    jobId,
      query:    getSearchQuery(),
      category: getCategory(),
      region:   getRegion(),
      sector:   getSector(),
      page:     getPage(),
      path:     path,
      params:   getAllParams()
    };
  }


  /* ----------------------------------------------------------
     INIT SEARCH BAR
     Binds hero search form to redirectToSearch.
     Called automatically on DOMContentLoaded.
  ---------------------------------------------------------- */
  function initSearchBar() {
    // Hero search form
    const form = document.querySelector('.hero-search');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const input = form.querySelector('.hero-search__input');
        if (input && input.value.trim()) {
          redirectToSearch(input.value.trim());
        }
      });
    }

    // Hero search button (for non-form click)
    const btn = document.querySelector('.hero-search__btn');
    if (btn) {
      btn.addEventListener('click', function () {
        const input = document.querySelector('.hero-search__input');
        if (input && input.value.trim()) {
          redirectToSearch(input.value.trim());
        }
      });
    }

    // Header search overlay
    const overlayInput = document.querySelector('.search-overlay__input');
    if (overlayInput) {
      overlayInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && this.value.trim()) {
          redirectToSearch(this.value.trim());
        }
      });

      // Clear button
      const clearBtn = document.querySelector('.search-overlay__clear');
      if (clearBtn) {
        overlayInput.addEventListener('input', function () {
          const wrap = overlayInput.closest('.form-input-wrap');
          if (wrap) wrap.classList.toggle('has-value', !!this.value);
        });

        clearBtn.addEventListener('click', function () {
          overlayInput.value = '';
          overlayInput.focus();
          const wrap = overlayInput.closest('.form-input-wrap');
          if (wrap) wrap.classList.remove('has-value');
        });
      }
    }
  }


  /* ----------------------------------------------------------
     INIT HERO SEARCH CLEAR BUTTON
     Shows × when hero input has value.
  ---------------------------------------------------------- */
  function initHeroClear() {
    const input    = document.querySelector('.hero-search__input');
    const clearBtn = document.querySelector('.hero-search__clear');
    const wrap     = document.querySelector('.hero-search');

    if (!input || !clearBtn || !wrap) return;

    input.addEventListener('input', function () {
      wrap.classList.toggle('has-value', !!this.value);
    });

    clearBtn.addEventListener('click', function () {
      input.value = '';
      wrap.classList.remove('has-value');
      input.focus();
    });
  }


  /* ----------------------------------------------------------
     DOM READY — Auto init search bars
  ---------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initSearchBar();
    initHeroClear();
  });

  // Also init after components load (header search overlay)
  document.addEventListener('component:loaded', function (e) {
    if (e.detail.name === 'header') {
      initSearchBar();
    }
  });


  /* ----------------------------------------------------------
     PUBLIC API
     window.TrabahoRouter

     Usage:
       TrabahoRouter.getJobId()
       TrabahoRouter.getSearchQuery()
       TrabahoRouter.waitForData().then(fn)
       TrabahoRouter.redirectTo404()
       TrabahoRouter.redirectToSearch('nurse manila')
       TrabahoRouter.updateParam('region', 'ncr')
       TrabahoRouter.buildUrl('/jobs/job-map.html', { q: 'teacher' })
       TrabahoRouter.currentPage()
  ---------------------------------------------------------- */
  window.TrabahoRouter = {

    // Readers
    getJobId:       getJobId,
    getParam:       getParam,
    getAllParams:    getAllParams,
    getSearchQuery: getSearchQuery,
    getCategory:    getCategory,
    getRegion:      getRegion,
    getSector:      getSector,
    getPage:        getPage,

    // Navigation
    navigateTo:       navigateTo,
    redirectTo404:    redirectTo404,
    redirectToSearch: redirectToSearch,
    updateParam:      updateParam,
    buildUrl:         buildUrl,

    // Data sync
    waitForData: waitForData,

    // Context
    currentPage: resolveCurrentPage

  };

}());