/* ============================================================
   ASSETS/JS/UI/SIDEBAR.JS — Sidebar widgets
   TOC, Latest Jobs, SG Quick Ref, CSC Countdown
   TrabahoWatch v1.0
   ============================================================ */

'use strict';

(function () {

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
     FORMAT PESO
     ============================================================ */

  function formatPeso(n) {
    if (!n) return '';
    return '₱' + Number(n).toLocaleString('en-PH');
  }

  /* ============================================================
     1. TABLE OF CONTENTS WIDGET
     Scans article sections and builds a clickable TOC
     ============================================================ */

  function buildTOC() {
    var tocContainer = document.getElementById('sidebar-toc') ||
                       document.querySelector('[data-sidebar-toc]');
    if (!tocContainer) return;

    /* Find all article section headings */
    var headings = document.querySelectorAll(
      '.article-section h2[id], .article-section__title[id], h2[id]'
    );

    if (headings.length < 2) {
      tocContainer.style.display = 'none';
      return;
    }

    var items = Array.from(headings).map(function (h) {
      var id    = h.id;
      var text  = h.textContent
        .replace(/^\s*[\u2600-\u26FF\uD83C-\uDBFF\uDC00-\uDFFF]\s*/u, '')
        .trim();

      return [
        '<li>',
          '<a href="#', esc(id), '" ',
              'class="toc-link" ',
              'data-toc-id="', esc(id), '">',
            esc(text),
          '</a>',
        '</li>'
      ].join('');
    }).join('');

    tocContainer.innerHTML = [
      '<div class="sidebar-widget">',
        '<h3 class="sidebar-widget__title">',
          '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"',
              ' stroke-width="2" width="16" height="16" aria-hidden="true">',
            '<line x1="8" y1="6"  x2="21" y2="6"/>',
            '<line x1="8" y1="12" x2="21" y2="12"/>',
            '<line x1="8" y1="18" x2="21" y2="18"/>',
            '<line x1="3" y1="6"  x2="3.01" y2="6"/>',
            '<line x1="3" y1="12" x2="3.01" y2="12"/>',
            '<line x1="3" y1="18" x2="3.01" y2="18"/>',
          '</svg>',
          'In This Article',
        '</h3>',
        '<nav aria-label="Table of contents">',
          '<ul class="toc-list">', items, '</ul>',
        '</nav>',
      '</div>'
    ].join('');

    /* Smooth scroll on click */
    tocContainer.querySelectorAll('.toc-link').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var id     = link.dataset.tocId;
        var target = document.getElementById(id);
        if (target) {
          var headerH = parseInt(
            getComputedStyle(document.documentElement)
              .getPropertyValue('--header-height') || '64', 10
          );
          var top = target.getBoundingClientRect().top +
                    window.scrollY - headerH - 16;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });

    /* Highlight active section on scroll */
    initTOCHighlight(headings, tocContainer);
  }

  /* ── Active TOC highlight ─────────────────────────────────── */

  function initTOCHighlight(headings, tocContainer) {
    if (!window.IntersectionObserver) return;

    var activeId = null;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          activeId = entry.target.id;

          /* Update active link */
          tocContainer.querySelectorAll('.toc-link').forEach(function (link) {
            var isActive = link.dataset.tocId === activeId;
            link.classList.toggle('toc-link--active', isActive);
            link.style.color = isActive
              ? 'var(--color-primary)'
              : '';
            link.style.fontWeight = isActive
              ? 'var(--font-bold)'
              : '';
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -70% 0px',
      threshold:  0
    });

    Array.from(headings).forEach(function (h) {
      observer.observe(h);
    });
  }

  /* ============================================================
     2. LATEST JOBS WIDGET
     Shows 3 most recent open jobs
     ============================================================ */

  function buildLatestJobs() {
    var container = document.getElementById('sidebar-latest-jobs') ||
                    document.querySelector('[data-sidebar-latest]');
    if (!container) return;

    if (!window.TrabahoJobs) return;

    var page   = document.body.dataset.page   || '';
    var sector = document.body.dataset.sector || null;

    /* Get latest jobs, excluding current if on article page */
    var currentId = null;
    if (page === 'article') {
      var path  = window.location.pathname;
      var match = path.match(/\/jobs\/([^\/]+)\/?$/);
      if (match) currentId = match[1];
    }

    var jobs = window.TrabahoJobs.getLatest(6, sector)
      .filter(function (j) { return j.id !== currentId; })
      .slice(0, 3);

    if (jobs.length === 0) {
      container.style.display = 'none';
      return;
    }

    var items = jobs.map(function (job) {
      var salary = job.salary
        ? formatPeso(job.salary) + '/mo'
        : job.sg ? 'SG ' + job.sg : '';

      return [
        '<a href="', esc(job.url), '" class="sidebar-job-item">',
          '<div class="sidebar-job-item__content">',
            '<p class="sidebar-job-item__title">', esc(job.title), '</p>',
            '<p class="sidebar-job-item__agency">', esc(job.agency), '</p>',
            salary
              ? '<p class="sidebar-job-item__salary">' + esc(salary) + '</p>'
              : '',
          '</div>',
          job.isUrgent
            ? '<span class="badge badge--urgent" style="font-size:10px;flex-shrink:0;">Soon</span>'
            : '',
        '</a>'
      ].join('');
    }).join('');

    container.innerHTML = [
      '<div class="sidebar-widget">',
        '<div class="sidebar-widget__header">',
          '<h3 class="sidebar-widget__title">',
            '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"',
                ' stroke-width="2" width="16" height="16" aria-hidden="true">',
              '<rect x="2" y="7" width="20" height="14" rx="2"/>',
              '<path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>',
            '</svg>',
            'Latest Jobs',
          '</h3>',
          '<a href="/jobs/job-map.html" ',
              'class="sidebar-widget__link">',
            'View all →',
          '</a>',
        '</div>',
        '<div class="sidebar-jobs-list">', items, '</div>',
      '</div>'
    ].join('');
  }

  /* ============================================================
     3. SALARY GRADE QUICK REFERENCE WIDGET
     ============================================================ */

  var SG_QUICK_REF = [
    { sg:  1, label: 'Admin Aide I',      salary: 14634  },
    { sg:  3, label: 'Admin Aide III',    salary: 15651  },
    { sg:  5, label: 'Admin Aide V',      salary: 16756  },
    { sg: 10, label: 'Admin Officer I',   salary: 29668  },
    { sg: 11, label: 'Teacher I / PO1',   salary: 31705  },
    { sg: 12, label: 'Teacher II',        salary: 33947  },
    { sg: 15, label: 'Nurse I',           salary: 42178  },
    { sg: 18, label: 'Master Teacher I',  salary: 53818  },
    { sg: 24, label: 'Director III',      salary: 116975 },
    { sg: 33, label: 'President',         salary: 449157 }
  ];

  function buildSGQuickRef() {
    var container = document.getElementById('sidebar-sg-ref') ||
                    document.querySelector('[data-sidebar-sg]');
    if (!container) return;

    var rows = SG_QUICK_REF.map(function (item) {
      return [
        '<tr>',
          '<td style="padding:6px 8px;font-weight:var(--font-bold);',
              'color:var(--color-primary);font-size:var(--text-xs);">',
            'SG ', item.sg,
          '</td>',
          '<td style="padding:6px 8px;font-size:var(--text-xs);',
              'color:var(--text-secondary);">',
            esc(item.label),
          '</td>',
          '<td style="padding:6px 8px;text-align:right;',
              'font-size:var(--text-xs);font-weight:var(--font-semibold);',
              'color:var(--color-success);white-space:nowrap;">',
            formatPeso(item.salary),
          '</td>',
        '</tr>'
      ].join('');
    }).join('');

    container.innerHTML = [
      '<div class="sidebar-widget">',
        '<div class="sidebar-widget__header">',
          '<h3 class="sidebar-widget__title">',
            '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"',
                ' stroke-width="2" width="16" height="16" aria-hidden="true">',
              '<line x1="12" y1="1" x2="12" y2="23"/>',
              '<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
            '</svg>',
            'Salary Grades 2026',
          '</h3>',
          '<a href="/government/salary-grade.html" ',
              'class="sidebar-widget__link">',
            'Full table →',
          '</a>',
        '</div>',
        '<div style="overflow-x:auto;">',
          '<table style="width:100%;border-collapse:collapse;">',
            '<thead>',
              '<tr>',
                '<th style="padding:5px 8px;text-align:left;',
                    'font-size:10px;color:var(--text-muted);',
                    'font-weight:var(--font-semibold);',
                    'border-bottom:1px solid var(--border-color);">SG</th>',
                '<th style="padding:5px 8px;text-align:left;',
                    'font-size:10px;color:var(--text-muted);',
                    'font-weight:var(--font-semibold);',
                    'border-bottom:1px solid var(--border-color);">Position</th>',
                '<th style="padding:5px 8px;text-align:right;',
                    'font-size:10px;color:var(--text-muted);',
                    'font-weight:var(--font-semibold);',
                    'border-bottom:1px solid var(--border-color);">Step 1</th>',
              '</tr>',
            '</thead>',
            '<tbody>', rows, '</tbody>',
          '</table>',
        '</div>',
        '<p style="font-size:10px;color:var(--text-muted);',
            'margin-top:var(--space-2);text-align:center;">',
          'SSL VI Tranche 3 · Jan 1, 2026',
        '</p>',
      '</div>'
    ].join('');
  }

  /* ============================================================
     4. CSC EXAM COUNTDOWN WIDGET
     ============================================================ */

  function buildCSCCountdown() {
    var container = document.getElementById('sidebar-csc-countdown') ||
                    document.querySelector('[data-sidebar-csc]');
    if (!container) return;

    /* Next CSC exam date */
    var NEXT_CSC = '2026-08-16T08:00:00+08:00';
    var examDate = new Date(NEXT_CSC);
    var now      = new Date();

    if (examDate < now) {
      container.style.display = 'none';
      return;
    }

    var diff  = examDate - now;
    var days  = Math.floor(diff / (1000 * 60 * 60 * 24));

    container.innerHTML = [
      '<div class="sidebar-widget sidebar-widget--csc">',
        '<h3 class="sidebar-widget__title">',
          '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"',
              ' stroke-width="2" width="16" height="16" aria-hidden="true">',
            '<rect x="3" y="4" width="18" height="18" rx="2"/>',
            '<line x1="3" y1="10" x2="21" y2="10"/>',
            '<line x1="8" y1="2" x2="8" y2="6"/>',
            '<line x1="16" y1="2" x2="16" y2="6"/>',
          '</svg>',
          'Next CSC Exam',
        '</h3>',
        '<div style="text-align:center;padding:var(--space-3) 0;">',
          '<p style="font-size:var(--text-2xl);font-weight:var(--font-bold);',
              'color:var(--color-primary);line-height:1;" ',
              'id="sidebar-csc-days">',
            days,
          '</p>',
          '<p style="font-size:var(--text-xs);color:var(--text-muted);',
              'margin-top:2px;">days remaining</p>',
          '<p style="font-size:var(--text-xs);color:var(--text-secondary);',
              'margin-top:var(--space-2);font-weight:var(--font-semibold);">',
            'August 16, 2026',
          '</p>',
        '</div>',
        '<a href="/government/csc-exams.html" ',
            'class="btn btn--primary" ',
            'style="width:100%;justify-content:center;',
            'font-size:var(--text-xs);">',
          'CSC Exam Guide →',
        '</a>',
      '</div>'
    ].join('');

    /* Update days counter */
    var daysEl = document.getElementById('sidebar-csc-days');
    if (daysEl) {
      setInterval(function () {
        var remaining = Math.floor((examDate - new Date()) / (1000 * 60 * 60 * 24));
        if (remaining >= 0) daysEl.textContent = remaining;
      }, 60000); /* Update every minute */
    }
  }

  /* ============================================================
     5. SHARE WIDGET
     ============================================================ */

  function buildShareWidget() {
    var container = document.getElementById('sidebar-share') ||
                    document.querySelector('[data-sidebar-share]');
    if (!container) return;

    container.innerHTML = [
      '<div class="sidebar-widget">',
        '<h3 class="sidebar-widget__title">',
          '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"',
              ' stroke-width="2" width="16" height="16" aria-hidden="true">',
            '<circle cx="18" cy="5" r="3"/>',
            '<circle cx="6" cy="12" r="3"/>',
            '<circle cx="18" cy="19" r="3"/>',
            '<line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>',
            '<line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>',
          '</svg>',
          'Share This Page',
        '</h3>',
        '<div style="display:flex;gap:var(--space-2);flex-wrap:wrap;">',

          '<a href="#" class="share-btn share-btn--facebook" data-share="facebook" ',
              'aria-label="Share on Facebook">',
            '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"',
                ' stroke-width="2" width="16" height="16" aria-hidden="true">',
              '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
            '</svg>',
            '<span>Facebook</span>',
          '</a>',

          '<a href="#" class="share-btn share-btn--whatsapp" data-share="whatsapp" ',
              'aria-label="Share on WhatsApp">',
            '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"',
                ' stroke-width="2" width="16" height="16" aria-hidden="true">',
              '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7',
                  ' 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8',
                  ' 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
            '</svg>',
            '<span>WhatsApp</span>',
          '</a>',

          '<button type="button" class="share-btn share-btn--copy" data-share="copy" ',
              'aria-label="Copy link">',
            '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"',
                ' stroke-width="2" width="16" height="16" aria-hidden="true">',
              '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>',
              '<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
            '</svg>',
            '<span>Copy</span>',
          '</button>',

        '</div>',
      '</div>'
    ].join('');
  }

  /* ============================================================
     6. QUICK LINKS WIDGET
     ============================================================ */

  function buildQuickLinks() {
    var container = document.getElementById('sidebar-quick-links') ||
                    document.querySelector('[data-sidebar-links]');
    if (!container) return;

    var links = [
      { href: '/government/salary-grade.html', label: 'Salary Grade Table 2026' },
      { href: '/government/csc-exams.html',    label: 'CSC Exam Guide'           },
      { href: '/government/deped-jobs.html',   label: 'DepEd Teacher Jobs'       },
      { href: '/government/doh-jobs.html',     label: 'DOH Nurse Jobs'           },
      { href: '/ofw/',                          label: 'OFW Opportunities'        },
      { href: '/jobs/job-map.html',            label: 'Search All Jobs'          }
    ];

    var items = links.map(function (link) {
      return [
        '<li>',
          '<a href="', esc(link.href), '" ',
              'class="sidebar-quick-link">',
            '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"',
                ' stroke-width="2" width="14" height="14" aria-hidden="true">',
              '<path d="m9 18 6-6-6-6"/>',
            '</svg>',
            esc(link.label),
          '</a>',
        '</li>'
      ].join('');
    }).join('');

    container.innerHTML = [
      '<div class="sidebar-widget">',
        '<h3 class="sidebar-widget__title">',
          '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"',
              ' stroke-width="2" width="16" height="16" aria-hidden="true">',
            '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
          '</svg>',
          'Quick Links',
        '</h3>',
        '<ul style="list-style:none;padding:0;display:flex;',
            'flex-direction:column;gap:var(--space-1);">',
          items,
        '</ul>',
      '</div>'
    ].join('');
  }

  /* ============================================================
     INJECT SIDEBAR WIDGET STYLES
     ============================================================ */

  function injectSidebarStyles() {
    if (document.getElementById('sidebar-widget-styles')) return;

    var style = document.createElement('style');
    style.id  = 'sidebar-widget-styles';
    style.textContent = [

      /* Widget base */
      '.sidebar-widget {',
      '  background: var(--bg-surface);',
      '  border: 1px solid var(--border-color);',
      '  border-radius: var(--radius-xl);',
      '  padding: var(--space-5);',
      '  margin-bottom: var(--space-4);',
      '}',

      '.sidebar-widget--csc {',
      '  border-color: rgba(22,72,150,0.3);',
      '  background: rgba(22,72,150,0.03);',
      '}',

      '.sidebar-widget__header {',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: space-between;',
      '  margin-bottom: var(--space-4);',
      '}',

      '.sidebar-widget__title {',
      '  font-size: var(--text-sm);',
      '  font-weight: var(--font-bold);',
      '  color: var(--text-primary);',
      '  display: flex;',
      '  align-items: center;',
      '  gap: var(--space-2);',
      '  margin: 0 0 var(--space-4);',
      '}',

      '.sidebar-widget__header .sidebar-widget__title {',
      '  margin-bottom: 0;',
      '}',

      '.sidebar-widget__link {',
      '  font-size: var(--text-xs);',
      '  color: var(--color-primary);',
      '  text-decoration: none;',
      '  font-weight: var(--font-semibold);',
      '  white-space: nowrap;',
      '}',

      'html.dark .sidebar-widget__link {',
      '  color: var(--text-link);',
      '}',

      /* TOC */
      '.toc-list {',
      '  list-style: none;',
      '  padding: 0;',
      '  display: flex;',
      '  flex-direction: column;',
      '  gap: 2px;',
      '}',

      '.toc-link {',
      '  display: block;',
      '  font-size: var(--text-xs);',
      '  color: var(--text-secondary);',
      '  text-decoration: none;',
      '  padding: var(--space-2) var(--space-3);',
      '  border-radius: var(--radius-md);',
      '  border-left: 2px solid transparent;',
      '  transition: all var(--transition-fast);',
      '  line-height: 1.4;',
      '}',

      '.toc-link:hover {',
      '  color: var(--color-primary);',
      '  background: rgba(22,72,150,0.06);',
      '  border-left-color: var(--color-primary);',
      '}',

      '.toc-link--active {',
      '  color: var(--color-primary) !important;',
      '  font-weight: var(--font-bold) !important;',
      '  background: rgba(22,72,150,0.08);',
      '  border-left-color: var(--color-primary);',
      '}',

      'html.dark .toc-link:hover,',
      'html.dark .toc-link--active {',
      '  color: var(--text-link) !important;',
      '  border-left-color: var(--text-link);',
      '  background: rgba(96,165,250,0.08);',
      '}',

      /* Latest jobs */
      '.sidebar-jobs-list {',
      '  display: flex;',
      '  flex-direction: column;',
      '  gap: var(--space-2);',
      '}',

      '.sidebar-job-item {',
      '  display: flex;',
      '  align-items: center;',
      '  gap: var(--space-3);',
      '  padding: var(--space-3);',
      '  border-radius: var(--radius-lg);',
      '  text-decoration: none;',
      '  transition: background var(--transition-fast);',
      '  border: 1px solid var(--border-color);',
      '}',

      '.sidebar-job-item:hover {',
      '  background: var(--bg-surface-2);',
      '  border-color: var(--color-primary);',
      '}',

      'html.dark .sidebar-job-item:hover {',
      '  border-color: var(--text-link);',
      '}',

      '.sidebar-job-item__content {',
      '  flex: 1;',
      '  min-width: 0;',
      '}',

      '.sidebar-job-item__title {',
      '  font-size: var(--text-xs);',
      '  font-weight: var(--font-bold);',
      '  color: var(--text-primary);',
      '  white-space: nowrap;',
      '  overflow: hidden;',
      '  text-overflow: ellipsis;',
      '  line-height: 1.3;',
      '}',

      '.sidebar-job-item__agency {',
      '  font-size: 10px;',
      '  color: var(--text-muted);',
      '  margin-top: 1px;',
      '}',

      '.sidebar-job-item__salary {',
      '  font-size: 10px;',
      '  font-weight: var(--font-bold);',
      '  color: var(--color-success);',
      '  margin-top: 2px;',
      '}',

      /* Quick links */
      '.sidebar-quick-link {',
      '  display: flex;',
      '  align-items: center;',
      '  gap: var(--space-2);',
      '  font-size: var(--text-xs);',
      '  color: var(--text-secondary);',
      '  text-decoration: none;',
      '  padding: var(--space-2) var(--space-2);',
      '  border-radius: var(--radius-md);',
      '  transition: all var(--transition-fast);',
      '}',

      '.sidebar-quick-link:hover {',
      '  color: var(--color-primary);',
      '  background: rgba(22,72,150,0.06);',
      '}',

      'html.dark .sidebar-quick-link:hover {',
      '  color: var(--text-link);',
      '  background: rgba(96,165,250,0.08);',
      '}',

      '.sidebar-quick-link svg {',
      '  flex-shrink: 0;',
      '  color: var(--text-muted);',
      '  transition: transform var(--transition-fast);',
      '}',

      '.sidebar-quick-link:hover svg {',
      '  transform: translateX(2px);',
      '  color: var(--color-primary);',
      '}'

    ].join('\n');

    document.head.appendChild(style);
  }

  /* ============================================================
     INIT ALL SIDEBAR WIDGETS
     ============================================================ */

  function init() {
    var sidebar = document.getElementById('site-sidebar');
    if (!sidebar) return;

    /* Only on pages with sidebar */
    var wrapper = document.querySelector('.page-wrapper');
    if (wrapper && wrapper.classList.contains('no-sidebar')) return;

    /* Inject styles */
    injectSidebarStyles();

    /* Build static widgets immediately */
    buildTOC();
    buildCSCCountdown();
    buildSGQuickRef();
    buildShareWidget();
    buildQuickLinks();

    /* Build data-dependent widgets after jobs load */
    waitForJobs().then(function () {
      buildLatestJobs();
    });
  }

  /* ============================================================
     BOOT
     Wait for sidebar HTML to be injected by app.js first
     ============================================================ */

  window.addEventListener('trabahoApp:ready', function () {
    init();
  });

  /* Fallback if app:ready already fired */
  if (document.readyState !== 'loading') {
    setTimeout(init, 200);
  }

  /* ============================================================
     PUBLIC API
     ============================================================ */

  window.TrabahoSidebar = {
    buildTOC:          buildTOC,
    buildLatestJobs:   buildLatestJobs,
    buildSGQuickRef:   buildSGQuickRef,
    buildCSCCountdown: buildCSCCountdown,
    buildShareWidget:  buildShareWidget,
    buildQuickLinks:   buildQuickLinks
  };

}());