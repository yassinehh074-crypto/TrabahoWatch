/* ============================================================
   ASSETS/JS/PAGES/HUB.JS — Hub and category page renderer
   Reads data-sector / data-category from <body>
   Fills stats, job grids, and jump bar
   TrabahoWatch v1.0
   ============================================================ */

'use strict';

(function () {

  /* ============================================================
     WAIT FOR JOBS DATA
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
     ESCAPE HTML — prevent XSS
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
     FORMAT PESO
     ============================================================ */

  function formatPeso(amount) {
    if (!amount) return '';
    return '₱' + Number(amount).toLocaleString('en-PH');
  }

  /* ============================================================
     FORMAT DEADLINE
     ============================================================ */

  function formatDeadline(dateStr) {
    if (!dateStr) return '';
    var d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';

    var now  = new Date();
    var diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));

    if (diff < 0)  return 'Deadline passed';
    if (diff === 0) return 'Closes today';
    if (diff === 1) return 'Closes tomorrow';
    if (diff <= 7)  return 'Closes in ' + diff + ' days';

    return 'Deadline: ' + d.toLocaleDateString('en-PH', {
      month: 'short',
      day:   'numeric',
      year:  'numeric'
    });
  }

  /* ============================================================
     BUILD STATUS BADGE HTML
     ============================================================ */

  function buildStatusBadge(job) {
    if (job.isArchived) {
      return '<span class="badge badge--archived">Archived</span>';
    }
    if (job.isPaused) {
      return '<span class="badge badge--paused">Paused</span>';
    }
    if (job.isUrgent) {
      return '<span class="badge badge--urgent">Closing Soon</span>';
    }
    if (job.isOpen) {
      return '<span class="badge badge--open">Open</span>';
    }
    return '<span class="badge badge--closed">Closed</span>';
  }

  /* ============================================================
     BUILD SECTOR BADGE HTML
     ============================================================ */

  function buildSectorBadge(sector) {
    var map = {
      government: '<span class="badge badge--gov">Government</span>',
      private:    '<span class="badge badge--private">Private</span>',
      ofw:        '<span class="badge badge--ofw">OFW</span>'
    };
    return map[sector] || '';
  }

  /* ============================================================
     BUILD SALARY TEXT
     ============================================================ */

  function buildSalaryText(job) {
    if (job.salaryText) return esc(job.salaryText);
    if (job.salary)     return formatPeso(job.salary) + '/month';
    if (job.salaryMin && job.salaryMax) {
      return formatPeso(job.salaryMin) + ' – ' + formatPeso(job.salaryMax) + '/month';
    }
    if (job.sg) return 'SG ' + job.sg;
    return 'Salary not specified';
  }

  /* ============================================================
     BUILD SINGLE JOB CARD HTML
     ============================================================ */

  function buildJobCard(job) {
    var deadlineText  = formatDeadline(job.deadline);
    var isUrgent      = job.isUrgent;
    var deadlineClass = isUrgent
      ? 'job-card__deadline job-card__deadline--urgent'
      : 'job-card__deadline';

    return [
      '<a href="', esc(job.url), '" ',
      'class="card job-card" ',
      'aria-label="', esc(job.title), ' at ', esc(job.agency), '">',

        /* Header */
        '<div class="job-card__header">',
          '<div>',
            '<h3 class="job-card__title">', esc(job.title), '</h3>',
            '<p class="job-card__agency">', esc(job.agency), '</p>',
          '</div>',
          buildStatusBadge(job),
        '</div>',

        /* Sector badge */
        buildSectorBadge(job.sector),

        /* Meta */
        '<div class="job-card__meta">',

          /* Salary */
          '<p class="job-card__salary">',
            buildSalaryText(job),
          '</p>',

          /* Location */
          job.location
            ? '<p class="job-card__location">' +
              '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" aria-hidden="true">' +
              '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>' +
              '<circle cx="12" cy="10" r="3"/></svg>' +
              esc(job.location) + '</p>'
            : '',

          /* Deadline */
          deadlineText
            ? '<p class="' + deadlineClass + '">' +
              '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" aria-hidden="true">' +
              '<rect x="3" y="4" width="18" height="18" rx="2"/>' +
              '<line x1="3" y1="10" x2="21" y2="10"/>' +
              '<line x1="8" y1="2" x2="8" y2="6"/>' +
              '<line x1="16" y1="2" x2="16" y2="6"/></svg>' +
              esc(deadlineText) + '</p>'
            : '',

        '</div>',

      '</a>'
    ].join('');
  }

  /* ============================================================
     BUILD EMPTY STATE HTML
     ============================================================ */

  function buildEmptyState(sector) {
    var label = sector
      ? sector.charAt(0).toUpperCase() + sector.slice(1)
      : '';

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
          'No ', esc(label), ' listings are available right now. ',
          'New jobs are added regularly — check back soon.',
        '</p>',
        '<a href="/pages/submit-job.html" class="btn btn--ghost">',
          'Know a vacancy? Submit it →',
        '</a>',
      '</div>'
    ].join('');
  }

  /* ============================================================
     FILL STATS BAR
     [data-stat="total|open|urgent"]
     ============================================================ */

  function fillStats(sector) {
    var stats = window.TrabahoJobs.getStats(sector || undefined);

    document.querySelectorAll('[data-stat]').forEach(function (el) {
      var type = el.dataset.stat;
      if (stats[type] !== undefined) {
        /* Animate count up */
        animateCount(el, stats[type]);
      }
    });

    /* Also fill [data-job-count] badges in section headers */
    document.querySelectorAll('[data-job-count]').forEach(function (el) {
      var section  = el.closest('[data-category]');
      var category = section ? section.dataset.category : null;
      if (!category) return;

      var catJobs = window.TrabahoJobs.getByCategory(category, sector);
      var open    = catJobs.filter(function (j) { return j.isOpen; }).length;
      el.textContent = open > 0 ? open + ' open' : 'Coming soon';
    });
  }

  /* ============================================================
     ANIMATE COUNT UP
     ============================================================ */

  function animateCount(el, target) {
    target = parseInt(target, 10) || 0;
    if (target === 0) { el.textContent = '0'; return; }

    var start    = 0;
    var duration = 800;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var value    = Math.floor(progress * target);
      el.textContent = value;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(step);
  }

  /* ============================================================
     FILL CATEGORY GRID
     [data-category-grid="category-name"]
     ============================================================ */

  function fillCategoryGrid(gridEl, sector) {
    var category = gridEl.dataset.categoryGrid;
    var jobs;

    if (category === sector || category === 'all') {
      /* Show all jobs in this sector */
      jobs = window.TrabahoJobs.getBySector(sector);
    } else {
      /* Show jobs in specific category */
      jobs = window.TrabahoJobs.getByCategory(category, sector);
    }

    /* Sort: open first, then by published */
    jobs = jobs.sort(function (a, b) {
      if (a.isOpen && !b.isOpen) return -1;
      if (!a.isOpen && b.isOpen) return 1;
      if (!a.published) return 1;
      if (!b.published) return -1;
      return new Date(b.published) - new Date(a.published);
    });

    /* Mark as loaded */
    gridEl.setAttribute('aria-busy', 'false');

    if (jobs.length === 0) {
      gridEl.innerHTML = buildEmptyState(category);
      return;
    }

    /* Build cards */
    gridEl.innerHTML = jobs.map(buildJobCard).join('');

    /* Trigger reveal animation */
    requestAnimationFrame(function () {
      gridEl.querySelectorAll('.reveal').forEach(function (el, i) {
        setTimeout(function () {
          el.classList.add('revealed');
        }, i * 60);
      });
    });
  }

  /* ============================================================
     FILL ALL CATEGORY GRIDS ON PAGE
     ============================================================ */

  function fillAllGrids(sector) {
    var grids = document.querySelectorAll('[data-category-grid]');

    grids.forEach(function (grid) {
      /* Remove skeletons */
      grid.querySelectorAll('.skeleton-wave').forEach(function (sk) {
        sk.remove();
      });

      fillCategoryGrid(grid, sector);
    });
  }

  /* ============================================================
     BUILD JUMP BAR
     Detects all [data-category] sections and builds a nav bar
     ============================================================ */

  function buildJumpBar() {
    var sections = document.querySelectorAll('[data-category]');
    if (sections.length < 2) return;

    var bar = document.createElement('div');
    bar.className = 'jump-bar';
    bar.setAttribute('role', 'navigation');
    bar.setAttribute('aria-label', 'Jump to section');
    bar.style.cssText = [
      'display:flex',
      'gap:var(--space-2)',
      'flex-wrap:wrap',
      'padding:var(--space-3) 0',
      'border-bottom:1px solid var(--border-color)',
      'margin-bottom:var(--space-6)'
    ].join(';');

    sections.forEach(function (section) {
      var category = section.dataset.category;
      var heading  = section.querySelector('h2');
      var label    = heading
        ? heading.textContent.replace(/\d+\s*(open)?/g, '').trim()
        : category;

      var link = document.createElement('a');
      link.href = '#section-' + category;
      link.className = 'btn btn--pill btn--pill-inactive btn--sm';
      link.textContent = label;
      link.setAttribute('aria-label', 'Jump to ' + label);

      /* Smooth scroll */
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.getElementById('section-' + category);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });

      bar.appendChild(link);
    });

    /* Insert bar after breadcrumb or before first section */
    var firstSection = sections[0];
    if (firstSection && firstSection.parentNode) {
      firstSection.parentNode.insertBefore(bar, firstSection);
    }
  }

  /* ============================================================
     HANDLE FILTER CHANGES
     Listens to trabahoFilters:change from filters.js
     ============================================================ */

  function listenToFilters(sector) {
    window.addEventListener('trabahoFilters:change', function (e) {
      var filters = e.detail || {};

      /* Get all jobs for this sector */
      var jobs = window.TrabahoJobs.getAll({
        sector:  sector || null,
        sort:    filters.sort || 'published'
      });

      /* Apply search query */
      if (filters.q && filters.q.trim()) {
        jobs = window.TrabahoJobs.search(filters.q, {
          sector: sector || null
        });
      }

      /* Apply region filter */
      if (filters.region) {
        jobs = jobs.filter(function (j) {
          return j.region === filters.region;
        });
      }

      /* Apply type filter */
      if (filters.type && filters.type !== 'all') {
        jobs = jobs.filter(function (j) {
          return j.status === filters.type ||
                 j.type   === filters.type;
        });
      }

      /* Update results count */
      var countEl = document.querySelector('[data-results-count]');
      if (countEl) {
        countEl.textContent = jobs.length + ' ' +
          (jobs.length === 1 ? 'result' : 'results') + ' found';
      }

      /* Re-render the main jobs grid */
      var mainGrid = document.getElementById('jobs-grid');
      if (!mainGrid) return;

      mainGrid.setAttribute('aria-busy', 'true');

      if (jobs.length === 0) {
        mainGrid.innerHTML = buildEmptyState(sector);
        /* Show clear button */
        var emptyState = document.getElementById('filter-empty-state');
        if (emptyState) emptyState.style.display = 'block';
        return;
      }

      var emptyState = document.getElementById('filter-empty-state');
      if (emptyState) emptyState.style.display = 'none';

      mainGrid.innerHTML = jobs.map(buildJobCard).join('');
      mainGrid.setAttribute('aria-busy', 'false');

      /* Re-trigger reveal */
      requestAnimationFrame(function () {
        mainGrid.querySelectorAll('.card').forEach(function (el, i) {
          el.style.opacity = '0';
          el.style.transform = 'translateY(10px)';
          el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          setTimeout(function () {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, i * 40);
        });
      });
    });
  }

  /* ============================================================
     INIT REVEAL ANIMATION
     Uses IntersectionObserver for scroll-triggered reveal
     ============================================================ */

  function initReveal() {
    if (!window.IntersectionObserver) {
      /* Fallback: show all immediately */
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('revealed');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ============================================================
     MAIN INIT
     ============================================================ */

  function init() {
    var body   = document.body;
    var sector = body.dataset.sector || null;
    var page   = body.dataset.page   || '';

    /* Only run on hub pages */
    if (!page.includes('hub') && page !== 'home') return;

    waitForJobs().then(function () {

      /* 1. Fill stats */
      fillStats(sector);

      /* 2. Fill all job grids */
      fillAllGrids(sector);

      /* 3. Build jump bar (hub pages only) */
      if (page.includes('hub')) {
        buildJumpBar();
      }

      /* 4. Listen for filter changes */
      listenToFilters(sector);

      /* 5. Init reveal animations */
      setTimeout(initReveal, 100);

    });
  }

  /* ============================================================
     BOOT — wait for DOM
     ============================================================ */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Expose for external use */
  window.TrabahoHub = {
    fillStats:    function (s) { fillStats(s); },
    fillAllGrids: function (s) { fillAllGrids(s); },
    buildJobCard: buildJobCard
  };

}());