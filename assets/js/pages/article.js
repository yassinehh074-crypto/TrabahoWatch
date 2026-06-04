/* ============================================================
   ASSETS/JS/PAGES/ARTICLE.JS — Single job article renderer
   Reads job ID from URL, fetches from TrabahoJobs API,
   renders full article content dynamically
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

  function formatPeso(amount) {
    if (!amount) return '';
    return '₱' + Number(amount).toLocaleString('en-PH');
  }

  /* ============================================================
     EXTRACT JOB ID FROM URL
     Supports:
       /jobs/deped-teacher-i-ncr-2026/
       /jobs/deped-teacher-i-ncr-2026
       /jobs/article.html?id=deped-teacher-i-ncr-2026
     ============================================================ */

  function extractJobId() {
    var pathname = window.location.pathname;
    var search   = window.location.search;

    /* ?id= param (fallback) */
    var params = new URLSearchParams(search);
    if (params.get('id')) return params.get('id');

    /* /jobs/job-id/ pattern */
    var match = pathname.match(/\/jobs\/([^\/]+)\/?$/);
    if (match && match[1] && match[1] !== 'article.html') {
      return match[1];
    }

    return null;
  }

  /* ============================================================
     FORMAT DATE
     ============================================================ */

  function formatDate(dateStr) {
    if (!dateStr) return '';
    var d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-PH', {
      year:  'numeric',
      month: 'long',
      day:   'numeric'
    });
  }

  /* ============================================================
     FORMAT DEADLINE
     ============================================================ */

  function formatDeadline(dateStr) {
    if (!dateStr) return '';
    var d   = new Date(dateStr);
    var now = new Date();
    if (isNaN(d.getTime())) return '';

    var diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));

    if (diff < 0)   return 'Deadline passed (' + formatDate(dateStr) + ')';
    if (diff === 0) return 'Closes TODAY — ' + formatDate(dateStr);
    if (diff === 1) return 'Closes TOMORROW — ' + formatDate(dateStr);
    if (diff <= 7)  return 'Closes in ' + diff + ' days — ' + formatDate(dateStr);

    return formatDate(dateStr);
  }

  /* ============================================================
     BUILD SALARY BREAKDOWN TABLE
     ============================================================ */

  function buildSalaryTable(job) {
    var basic = job.salary || job.salaryMin || 0;
    if (!basic) return '';

    var pera        = 2000;
    var gsis        = Math.round(basic * 0.09);
    var philhealth  = Math.round(basic * 0.025);
    var pagibig     = 100;
    var totalDeduct = gsis + philhealth + pagibig;
    var grossMonthly= basic + pera;
    var takeHome    = basic - totalDeduct;
    var totalAnnual = (basic * 15) + pera * 12 + 10000 + 6000;

    return [
      '<div style="overflow-x:auto;">',
      '<table style="width:100%;border-collapse:collapse;font-size:var(--text-sm);">',
        '<thead>',
          '<tr>',
            '<th style="background:var(--color-primary);color:white;',
                'padding:10px 14px;text-align:left;',
                'border-radius:var(--radius-md) 0 0 0;">',
              'Component',
            '</th>',
            '<th style="background:var(--color-primary);color:white;',
                'padding:10px 14px;text-align:right;',
                'border-radius:0 var(--radius-md) 0 0;">',
              'Monthly',
            '</th>',
          '</tr>',
        '</thead>',
        '<tbody>',

          '<tr>',
            '<td style="padding:9px 14px;border-bottom:1px solid var(--border-color);">',
              'Basic Salary',
              job.sg ? ' <span class="badge badge--gov">SG ' + esc(String(job.sg)) + '</span>' : '',
            '</td>',
            '<td style="padding:9px 14px;text-align:right;',
                'border-bottom:1px solid var(--border-color);',
                'font-weight:var(--font-semibold);">',
              formatPeso(basic),
            '</td>',
          '</tr>',

          '<tr style="background:var(--bg-surface-2);">',
            '<td style="padding:9px 14px;border-bottom:1px solid var(--border-color);">',
              'PERA Allowance',
            '</td>',
            '<td style="padding:9px 14px;text-align:right;',
                'border-bottom:1px solid var(--border-color);',
                'color:var(--color-success);">',
              '+ ' + formatPeso(pera),
            '</td>',
          '</tr>',

          '<tr>',
            '<td style="padding:9px 14px;border-bottom:1px solid var(--border-color);',
                'font-weight:var(--font-bold);">',
              'Gross Monthly',
            '</td>',
            '<td style="padding:9px 14px;text-align:right;',
                'border-bottom:1px solid var(--border-color);',
                'font-weight:var(--font-bold);">',
              formatPeso(grossMonthly),
            '</td>',
          '</tr>',

          '<tr style="background:var(--bg-surface-2);">',
            '<td style="padding:9px 14px;border-bottom:1px solid var(--border-color);',
                'color:var(--text-muted);">',
              'GSIS (9%)',
            '</td>',
            '<td style="padding:9px 14px;text-align:right;',
                'border-bottom:1px solid var(--border-color);',
                'color:#dc2626;">',
              '- ' + formatPeso(gsis),
            '</td>',
          '</tr>',

          '<tr>',
            '<td style="padding:9px 14px;border-bottom:1px solid var(--border-color);',
                'color:var(--text-muted);">',
              'PhilHealth (2.5%)',
            '</td>',
            '<td style="padding:9px 14px;text-align:right;',
                'border-bottom:1px solid var(--border-color);',
                'color:#dc2626;">',
              '- ' + formatPeso(philhealth),
            '</td>',
          '</tr>',

          '<tr style="background:var(--bg-surface-2);">',
            '<td style="padding:9px 14px;border-bottom:1px solid var(--border-color);',
                'color:var(--text-muted);">',
              'Pag-IBIG',
            '</td>',
            '<td style="padding:9px 14px;text-align:right;',
                'border-bottom:1px solid var(--border-color);',
                'color:#dc2626;">',
              '- ' + formatPeso(pagibig),
            '</td>',
          '</tr>',

          '<tr>',
            '<td style="padding:9px 14px;',
                'font-weight:var(--font-bold);',
                'font-size:var(--text-base);">',
              'Est. Take-Home Pay',
            '</td>',
            '<td style="padding:9px 14px;text-align:right;',
                'font-weight:var(--font-bold);',
                'font-size:var(--text-base);',
                'color:var(--color-success);">',
              '~ ' + formatPeso(takeHome),
            '</td>',
          '</tr>',

        '</tbody>',
      '</table>',
      '</div>',
      '<p style="font-size:var(--text-xs);color:var(--text-muted);',
          'margin-top:var(--space-2);">',
        '* Estimates based on SSL VI Tranche 3. ',
        'Actual deductions may vary. ',
        '<a href="/government/salary-grade.html">Use the Salary Calculator →</a>',
      '</p>'
    ].join('');
  }

  /* ============================================================
     BUILD REQUIREMENTS SECTION
     ============================================================ */

  function buildRequirements(job) {
    if (!job.requirements || job.requirements.length === 0) return '';

    var items = job.requirements.map(function (req) {
      return [
        '<li class="requirements-list__item requirements-list__item--required">',
          '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"',
              ' stroke-width="2" width="18" height="18" aria-hidden="true">',
            '<polyline points="20 6 9 17 4 12"/>',
          '</svg>',
          '<span>', esc(req), '</span>',
        '</li>'
      ].join('');
    }).join('');

    return '<ul class="requirements-list">' + items + '</ul>';
  }

  /* ============================================================
     BUILD HOW TO APPLY SECTION
     ============================================================ */

  function buildHowToApply(job) {
    var steps = job.howToApply || [
      {
        title: 'Monitor Official Announcements',
        body:  'Check the official agency website and the CSC Job Portal for the latest vacancy announcements.'
      },
      {
        title: 'Prepare Your Documents',
        body:  'Prepare your CSC Form 212 (PDS), TOR, Diploma, NBI Clearance, and other required documents.'
      },
      {
        title: 'Submit Before the Deadline',
        body:  'Submit your complete application to the agency\'s Human Resource Management Office (HRMO) before the deadline.'
      },
      {
        title: 'Wait for the Assessment',
        body:  'Shortlisted applicants will be notified for assessment, demo, or panel interview.'
      }
    ];

    var stepsHtml = steps.map(function (step, i) {
      return [
        '<div class="apply-step">',
          '<div class="apply-step__number" aria-hidden="true">', (i + 1), '</div>',
          '<div class="apply-step__content">',
            '<h4 class="apply-step__title">', esc(step.title), '</h4>',
            '<p class="apply-step__body">', esc(step.body), '</p>',
          '</div>',
        '</div>'
      ].join('');
    }).join('');

    return '<div class="apply-steps">' + stepsHtml + '</div>';
  }

  /* ============================================================
     BUILD RELATED JOBS
     ============================================================ */

  function buildRelatedJobs(job) {
    var related = window.TrabahoJobs.getRelated(job.id, 3);
    if (related.length === 0) return '';

    var cards = related.map(function (r) {
      var salary = r.salary
        ? formatPeso(r.salary) + '/mo'
        : r.sg ? 'SG ' + r.sg : '';

      return [
        '<a href="', esc(r.url), '" class="card related-card">',
          '<div class="related-card__body">',
            '<h4 class="related-card__title">', esc(r.title), '</h4>',
            '<p class="related-card__agency">', esc(r.agency), '</p>',
            salary
              ? '<p class="related-card__salary">' + esc(salary) + '</p>'
              : '',
          '</div>',
        '</a>'
      ].join('');
    }).join('');

    return [
      '<section class="related-jobs" aria-labelledby="related-heading">',
        '<div class="related-jobs__header">',
          '<h2 class="related-jobs__title" id="related-heading">',
            'Similar Positions',
          '</h2>',
          '<a href="/jobs/job-map.html" class="related-jobs__view-all">',
            'View all →',
          '</a>',
        '</div>',
        '<div class="related-jobs__grid">',
          cards,
        '</div>',
      '</section>'
    ].join('');
  }

  /* ============================================================
     BUILD SHARE BAR
     ============================================================ */

  function buildShareBar() {
    return [
      '<div class="share-bar" aria-label="Share this job">',
        '<span class="share-bar__label">Share:</span>',

        '<a href="#" class="share-btn share-btn--facebook"',
            ' id="share-fb" aria-label="Share on Facebook">',
          '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"',
              ' stroke-width="2" width="18" height="18" aria-hidden="true">',
            '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
          '</svg>',
          '<span>Facebook</span>',
        '</a>',

        '<a href="#" class="share-btn share-btn--whatsapp"',
            ' id="share-wa" aria-label="Share on WhatsApp">',
          '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"',
              ' stroke-width="2" width="18" height="18" aria-hidden="true">',
            '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7',
                ' 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8',
                ' 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
          '</svg>',
          '<span>WhatsApp</span>',
        '</a>',

        '<button class="share-btn share-btn--copy"',
            ' id="share-copy" type="button" aria-label="Copy link">',
          '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"',
              ' stroke-width="2" width="18" height="18" aria-hidden="true">',
            '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>',
            '<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
          '</svg>',
          '<span>Copy Link</span>',
        '</button>',

      '</div>'
    ].join('');
  }

  /* ============================================================
     INIT SHARE BUTTONS
     ============================================================ */

  function initShareButtons(job) {
    var url   = window.location.href;
    var title = job.title + ' at ' + job.agency + ' — TrabahoWatch';
    var text  = 'Check out this job: ' + job.title + ' at ' + job.agency;

    /* Facebook */
    var fbBtn = document.getElementById('share-fb');
    if (fbBtn) {
      fbBtn.href = 'https://www.facebook.com/sharer/sharer.php?u=' +
                   encodeURIComponent(url);
      fbBtn.target = '_blank';
      fbBtn.rel    = 'noopener noreferrer';
    }

    /* WhatsApp */
    var waBtn = document.getElementById('share-wa');
    if (waBtn) {
      waBtn.href = 'https://wa.me/?text=' +
                   encodeURIComponent(text + '\n' + url);
      waBtn.target = '_blank';
      waBtn.rel    = 'noopener noreferrer';
    }

    /* Copy link */
    var copyBtn = document.getElementById('share-copy');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        if (navigator.share) {
          navigator.share({ title: title, text: text, url: url })
            .catch(function () {});
          return;
        }
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(function () {
            copyBtn.querySelector('span').textContent = 'Copied!';
            setTimeout(function () {
              copyBtn.querySelector('span').textContent = 'Copy Link';
            }, 2000);
          });
        }
      });
    }
  }

  /* ============================================================
     UPDATE META TAGS
     ============================================================ */

  function updateMeta(job) {
    /* Title */
    document.title = esc(job.title) + ' — ' +
                     esc(job.agency) + ' | TrabahoWatch';

    /* Description */
    var desc = job.description ||
      (job.title + ' at ' + job.agency + '. ' +
       (job.salaryText || '') + '. Apply before ' +
       (formatDate(job.deadline) || 'deadline'));

    setMeta('description', desc);
    setMeta('og:title', job.title + ' — ' + job.agency + ' | TrabahoWatch');
    setMeta('og:description', desc);
    setMeta('og:url', window.location.href);
    setMeta('twitter:title', job.title + ' — TrabahoWatch');
    setMeta('twitter:description', desc);

    /* Canonical */
    var canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = window.location.href;
  }

  function setMeta(name, content) {
    var el = document.querySelector(
      'meta[name="' + name + '"],meta[property="' + name + '"]'
    );
    if (el) {
      el.content = content;
    }
  }

  /* ============================================================
     UPDATE SCHEMA.ORG
     ============================================================ */

  function updateSchema(job) {
    var schemaEl = document.getElementById('job-schema') ||
                   document.querySelector('script[type="application/ld+json"]');
    if (!schemaEl) return;

    var schema = {
      '@context': 'https://schema.org',
      '@type':    'JobPosting',
      'title':    job.title,
      'description': job.description || job.title + ' at ' + job.agency,
      'datePosted':  job.published   || '',
      'validThrough': job.deadline   || '',
      'employmentType': 'FULL_TIME',
      'hiringOrganization': {
        '@type': 'Organization',
        'name':  job.agency,
        'sameAs': job.sourceUrl || ''
      },
      'jobLocation': {
        '@type': 'Place',
        'address': {
          '@type':           'PostalAddress',
          'addressLocality': job.location || '',
          'addressCountry':  'PH'
        }
      }
    };

    if (job.salary) {
      schema.baseSalary = {
        '@type':    'MonetaryAmount',
        'currency': 'PHP',
        'value': {
          '@type':    'QuantitativeValue',
          'value':    job.salary,
          'unitText': 'MONTH'
        }
      };
    }

    schemaEl.textContent = JSON.stringify(schema, null, 2);
  }

  /* ============================================================
     RENDER ARCHIVED BANNER
     ============================================================ */

  function renderArchivedBanner() {
    var banner = document.createElement('div');
    banner.className = 'info-box info-box--warning';
    banner.setAttribute('role', 'alert');
    banner.style.marginBottom = 'var(--space-6)';
    banner.innerHTML = [
      '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"',
          ' stroke-width="2" aria-hidden="true">',
        '<path d="m10.29 3.86-8.19 14.2A1 1 0 0 0 3 20h18a1 1 0 0 0 .9-1.45',
            'L13.7 3.86a1 1 0 0 0-1.79.01z"/>',
        '<line x1="12" y1="9"  x2="12" y2="13"/>',
        '<line x1="12" y1="17" x2="12.01" y2="17"/>',
      '</svg>',
      '<span>',
        '<strong>This listing has closed.</strong> ',
        'The deadline for this position has passed. ',
        'The information below is kept for reference. ',
        '<a href="/jobs/job-map.html">Browse open jobs →</a>',
      '</span>'
    ].join('');
    return banner;
  }

  /* ============================================================
     RENDER FULL ARTICLE
     ============================================================ */

  function renderArticle(job) {
    var main = document.getElementById('main-content');
    if (!main) return;

    /* Update page metadata */
    updateMeta(job);
    updateSchema(job);

    /* Update breadcrumb */
    var breadcrumbCurrent = document.querySelector('.breadcrumb__item--current');
    if (breadcrumbCurrent) {
      breadcrumbCurrent.textContent = job.title;
    }

    /* Find or create article container */
    var articleWrap = main.querySelector('.article-wrap');
    if (!articleWrap) {
      articleWrap = document.createElement('div');
      articleWrap.className = 'article-wrap';
      main.querySelector('.container')
        ? main.querySelector('.container').appendChild(articleWrap)
        : main.appendChild(articleWrap);
    }

    /* Clear loading state */
    articleWrap.innerHTML = '';

    /* Archived banner */
    if (job.isArchived) {
      articleWrap.appendChild(renderArchivedBanner());
    }

    /* ── Article Header ─── */
    var headerEl = document.createElement('header');
    headerEl.className = 'article-header';
    headerEl.innerHTML = [
      /* Badges */
      '<div style="display:flex;gap:var(--space-2);flex-wrap:wrap;margin-bottom:var(--space-4);">',
        buildSectorBadge(job.sector),
        job.category
          ? '<span class="badge">' + esc(job.category) + '</span>'
          : '',
        job.tier === 1
          ? '<span class="article-header__tier article-header__tier--1">⭐ Complete Guide</span>'
          : job.tier === 2
            ? '<span class="article-header__tier">🟦 Standard Guide</span>'
            : '<span class="article-header__tier">⚪ Essential Info</span>',
      '</div>',

      /* Title */
      '<h1 class="article-header__title">', esc(job.title), '</h1>',

      /* Byline */
      '<div class="article-header__byline">',
        '<span class="article-header__byline-item">',
          '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"',
              ' stroke-width="2" width="14" height="14" aria-hidden="true">',
            '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
          '</svg>',
          esc(job.agency),
        '</span>',
        job.location
          ? '<span class="article-header__byline-item">' +
            '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"' +
            ' stroke-width="2" width="14" height="14" aria-hidden="true">' +
            '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>' +
            '<circle cx="12" cy="10" r="3"/></svg>' +
            esc(job.location) + '</span>'
          : '',
        job.deadline
          ? '<span class="article-header__byline-item">' +
            '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"' +
            ' stroke-width="2" width="14" height="14" aria-hidden="true">' +
            '<rect x="3" y="4" width="18" height="18" rx="2"/>' +
            '<line x1="3" y1="10" x2="21" y2="10"/></svg>' +
            esc(formatDeadline(job.deadline)) + '</span>'
          : '',
      '</div>',
    ].join('');
    articleWrap.appendChild(headerEl);

    /* ── Salary Section ─── */
    if (job.salary || job.salaryMin || job.sg) {
      var salarySection = document.createElement('section');
      salarySection.className = 'article-section';
      salarySection.id = 'salary';
      salarySection.setAttribute('aria-labelledby', 'salary-heading');
      salarySection.innerHTML = [
        '<h2 class="article-section__title" id="salary-heading">',
          '<div class="article-section__title-icon" aria-hidden="true">',
            '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">',
              '<line x1="12" y1="1" x2="12" y2="23"/>',
              '<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
            '</svg>',
          '</div>',
          'Salary Breakdown',
        '</h2>',
        '<div class="article-section__body">',
          buildSalaryTable(job),
        '</div>'
      ].join('');
      articleWrap.appendChild(salarySection);
    }

    /* ── Requirements Section ─── */
    if (job.requirements && job.requirements.length > 0) {
      var reqSection = document.createElement('section');
      reqSection.className = 'article-section';
      reqSection.id = 'requirements';
      reqSection.setAttribute('aria-labelledby', 'req-heading');
      reqSection.innerHTML = [
        '<h2 class="article-section__title" id="req-heading">',
          '<div class="article-section__title-icon" aria-hidden="true">',
            '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">',
              '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>',
              '<polyline points="22 4 12 14.01 9 11.01"/>',
            '</svg>',
          '</div>',
          'Requirements',
        '</h2>',
        '<div class="article-section__body">',
          buildRequirements(job),
        '</div>'
      ].join('');
      articleWrap.appendChild(reqSection);
    }

    /* ── How to Apply Section ─── */
    var applySection = document.createElement('section');
    applySection.className = 'article-section';
    applySection.id = 'how-to-apply';
    applySection.setAttribute('aria-labelledby', 'apply-heading');
    applySection.innerHTML = [
      '<h2 class="article-section__title" id="apply-heading">',
        '<div class="article-section__title-icon" aria-hidden="true">',
          '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">',
            '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>',
            '<polyline points="22 4 12 14.01 9 11.01"/>',
          '</svg>',
        '</div>',
        'How to Apply',
      '</h2>',
      '<div class="article-section__body">',
        buildHowToApply(job),
      '</div>',

      /* Source link */
      job.sourceUrl
        ? '<div style="margin-top:var(--space-5);">' +
          '<a href="' + esc(job.sourceUrl) + '" ' +
          'target="_blank" rel="noopener noreferrer" ' +
          'class="btn btn--primary">' +
          'View Official Announcement ↗' +
          '</a></div>'
        : ''

    ].join('');
    articleWrap.appendChild(applySection);

    /* ── Share Bar ─── */
    var shareDiv = document.createElement('div');
    shareDiv.innerHTML = buildShareBar();
    articleWrap.appendChild(shareDiv.firstElementChild);
    initShareButtons(job);

    /* ── Related Jobs ─── */
    var relatedDiv = document.createElement('div');
    relatedDiv.innerHTML = buildRelatedJobs(job);
    if (relatedDiv.firstElementChild) {
      articleWrap.appendChild(relatedDiv.firstElementChild);
    }

    /* ── Source note ─── */
    var noteDiv = document.createElement('div');
    noteDiv.className = 'info-box';
    noteDiv.setAttribute('role', 'note');
    noteDiv.style.marginTop = 'var(--space-8)';
    noteDiv.innerHTML = [
      '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"',
          ' stroke-width="2" aria-hidden="true">',
        '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
      '</svg>',
      '<span>',
        '<strong>Data source:</strong> ',
        'Information sourced from official agency announcements. ',
        'Salary data based on SSL VI Tranche 3 (EO No. 64, 2026). ',
        '<a href="/pages/methodology.html">Our methodology →</a>',
      '</span>'
    ].join('');
    articleWrap.appendChild(noteDiv);
  }

  /* ============================================================
     BUILD SECTOR BADGE (local helper)
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
     RENDER 404 / NOT FOUND
     ============================================================ */

  function renderNotFound(id) {
    var main = document.getElementById('main-content');
    if (!main) return;

    document.title = 'Job Not Found — TrabahoWatch';

    main.innerHTML = [
      '<div class="container">',
        '<div style="text-align:center;padding:var(--space-16) var(--space-4);">',
          '<div style="font-size:64px;margin-bottom:var(--space-4);">🔍</div>',
          '<h1 style="margin-bottom:var(--space-3);">Job Not Found</h1>',
          '<p style="color:var(--text-secondary);margin-bottom:var(--space-6);">',
            'The job listing <strong>', esc(id || ''), '</strong> ',
            'does not exist or has been removed.',
          '</p>',
          '<div style="display:flex;gap:var(--space-3);',
              'justify-content:center;flex-wrap:wrap;">',
            '<a href="/jobs/job-map.html" class="btn btn--primary">',
              'Browse All Jobs',
            '</a>',
            '<a href="/" class="btn btn--ghost">Go to Home</a>',
          '</div>',
        '</div>',
      '</div>'
    ].join('');
  }

  /* ============================================================
     MAIN INIT
     ============================================================ */

  function init() {
    var page = document.body.dataset.page;
    if (page !== 'article') return;

    var jobId = extractJobId();

    if (!jobId) {
      renderNotFound(null);
      return;
    }

    waitForJobs().then(function () {
      var job = window.TrabahoJobs.getById(jobId);

      if (!job) {
        renderNotFound(jobId);
        return;
      }

      renderArticle(job);

      /* Reading progress bar */
      var progressBar = document.getElementById('reading-progress');
      if (progressBar) {
        window.addEventListener('scroll', function () {
          var doc    = document.documentElement;
          var top    = doc.scrollTop || document.body.scrollTop;
          var height = doc.scrollHeight - doc.clientHeight;
          var pct    = height > 0 ? Math.round((top / height) * 100) : 0;
          progressBar.style.width = pct + '%';
          progressBar.setAttribute('aria-valuenow', pct);
        }, { passive: true });
      }
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

}());se as a checklist!';
    container.after(note);
  }


  /* ----------------------------------------------------------
     HOW TO APPLY (All tiers)
  ---------------------------------------------------------- */
  function renderHowToApply(job) {
    const container = document.querySelector('.apply-steps');
    if (!container) return;

    const steps = job.howToApply || [];

    if (!steps.length) {
      container.closest('.article-section') &&
        (container.closest('.article-section').style.display = 'none');
      return;
    }

    container.innerHTML = steps.map(function (step, i) {
      return '<div class="apply-step">' +
        '<div class="apply-step__number" aria-hidden="true">' +
          (i + 1) +
        '</div>' +
        '<div class="apply-step__content">' +
          '<h4 class="apply-step__title">' + escapeHtml(step.title) + '</h4>' +
          '<p class="apply-step__body">' + escapeHtml(step.body) + '</p>' +
        '</div>' +
      '</div>';
    }).join('');

    // Official link CTA
    if (job.officialLink) {
      const cta = document.createElement('a');
      cta.href      = job.officialLink;
      cta.target    = '_blank';
      cta.rel       = 'noopener noreferrer';
      cta.className = 'apply-cta';
      cta.innerHTML =
        '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"' +
            ' stroke-width="2" width="18" height="18" aria-hidden="true">' +
          '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>' +
          '<polyline points="15 3 21 3 21 9"/>' +
          '<line x1="10" y1="14" x2="21" y2="3"/>' +
        '</svg>' +
        'View Official Announcement';
      container.appendChild(cta);
    }
  }


  /* ----------------------------------------------------------
     GENERAL TIPS (Tier 3 only)
  ---------------------------------------------------------- */
  function renderGeneralTips(job) {
    const container = document.querySelector('.general-tips');
    if (!container) return;

    // Load from shared-content.js
    const key = 'generalTips' + capitalise(job.sector || 'entry');

    if (window.TrabahoSharedContent && TrabahoSharedContent[key]) {
      const tips = TrabahoSharedContent[key];

      container.innerHTML =
        '<p class="general-tips__label">' +
          '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"' +
              ' stroke-width="2" width="16" height="16" aria-hidden="true">' +
            '<circle cx="12" cy="12" r="10"/>' +
            '<line x1="12" y1="8" x2="12" y2="12"/>' +
            '<line x1="12" y1="16" x2="12.01" y2="16"/>' +
          '</svg>' +
          'General Tips for ' + escapeHtml(getSectorName(job.sector)) + ' Applicants' +
        '</p>' +

        '<ul class="general-tips__list">' +
          tips.map(function (tip) {
            return '<li class="general-tips__item">' + escapeHtml(tip) + '</li>';
          }).join('') +
        '</ul>';
    } else {
      container.closest('.article-section') &&
        (container.closest('.article-section').style.display = 'none');
    }
  }


  /* ============================================================
     SHARE BAR
     ============================================================ */

  function renderShareBar(job) {
    const container = document.querySelector('.share-bar');
    if (!container) return;

    container.innerHTML =
      '<span class="share-bar__label">Share this job:</span>' +

      '<a href="#" class="share-btn share-btn--facebook"' +
         ' aria-label="Share on Facebook">' +
        getFacebookIcon() +
        '<span>Facebook</span>' +
      '</a>' +

      '<a href="#" class="share-btn share-btn--whatsapp"' +
         ' aria-label="Share on WhatsApp">' +
        getWhatsAppIcon() +
        '<span>WhatsApp</span>' +
      '</a>' +

      '<button class="share-btn share-btn--copy"' +
              ' aria-label="Copy link">' +
        getLinkIcon() +
        '<span>Copy Link</span>' +
      '</button>' +

      '<button class="share-btn share-btn--print"' +
              ' aria-label="Print or save as PDF">' +
        getPrintIcon() +
        '<span>Print / PDF</span>' +
      '</button>';
  }


  /* ============================================================
     RELATED JOBS
     ============================================================ */

  function renderRelatedJobs(job, allJobs) {
    const container = document.querySelector('.related-jobs__grid');
    if (!container) return;

    const related = getRelatedJobs(job, allJobs);
    state.related  = related;

    if (!related.length) {
      container.closest('.related-jobs') &&
        (container.closest('.related-jobs').style.display = 'none');
      return;
    }

    container.innerHTML = related.map(function (rel) {
      const hasImg = rel.images && rel.images.length > 0;
      const salary = rel.salaryAmount || rel.salaryRange || '';

      return '<a href="/jobs/' + escapeHtml(rel.id) + '/"' +
          ' class="card related-card">' +

          '<div class="related-card__image">' +
            (hasImg
              ? '<img src="' + escapeHtml(rel.images[0]) + '"' +
                    ' alt="' + escapeHtml(rel.title) + '"' +
                    ' loading="lazy">'
              : '') +
          '</div>' +

          '<div class="related-card__body">' +
            '<h4 class="related-card__title">' +
              escapeHtml(rel.title) +
            '</h4>' +
            '<p class="related-card__agency">' +
              escapeHtml(rel.agency || rel.company || '') +
            '</p>' +
            (salary
              ? '<p class="related-card__salary">' +
                  CURRENCY + escapeHtml(salary) +
                '</p>'
              : '') +
          '</div>' +

        '</a>';
    }).join('');
  }

  /* ----------------------------------------------------------
     GET RELATED JOBS
     Cascade: manual IDs → same sector+diff category
             → same category → same region → random
  ---------------------------------------------------------- */
  function getRelatedJobs(job, allJobs) {
    const exclude  = job.id;
    const active   = allJobs.filter(function (j) {
      return j.id !== exclude && j.status !== 'archived';
    });

    // 1. Manual related IDs
    if (job.relatedJobs && job.relatedJobs.length) {
      const manual = job.relatedJobs.slice(0, RELATED_COUNT).map(function (id) {
        return active.find(function (j) { return j.id === id; });
      }).filter(Boolean);

      if (manual.length === RELATED_COUNT) return manual;
    }

    // 2. Same sector, different category
    const sameSectorDiffCat = active.filter(function (j) {
      return j.sector === job.sector && j.category !== job.category;
    }).slice(0, RELATED_COUNT);

    if (sameSectorDiffCat.length >= RELATED_COUNT) return sameSectorDiffCat;

    // 3. Same category
    const sameCat = active.filter(function (j) {
      return j.category === job.category;
    }).slice(0, RELATED_COUNT);

    if (sameCat.length >= RELATED_COUNT) return sameCat;

    // 4. Same region
    if (job.region) {
      const sameRegion = active.filter(function (j) {
        return j.region === job.region;
      }).slice(0, RELATED_COUNT);

      if (sameRegion.length >= RELATED_COUNT) return sameRegion;
    }

    // 5. Random fallback
    return shuffleArray(active).slice(0, RELATED_COUNT);
  }


  /* ============================================================
     TIER-AWARE RENDER ORCHESTRATOR
     ============================================================ */

  function renderAll(job, allJobs) {
    const tier = job.tier || 2;

    // Always render
    renderBreadcrumb(job);
    renderArticleHeader(job);
    renderMetaBar(job);
    renderSourceBlock(job);
    renderImageGallery(job);
    renderDescription(job);
    renderRequirements(job);
    renderDocumentsRequired(job);
    renderHowToApply(job);
    renderShareBar(job);
    renderRelatedJobs(job, allJobs);

    // Tier 1 + 2
    if (shouldRender('aboutAgency', tier)) {
      renderAboutAgency(job);
      renderWhyMatters(job);
      renderCareerPath(job);
      renderHowToStandOut(job);
    }

    // Tier 1 only
    if (shouldRender('salaryBreakdown', tier)) {
      renderSalaryBreakdown(job);
    }
    if (shouldRender('dayInTheLife', tier)) {
      renderDayInLife(job);
    }

    // Tier 3 only
    if (shouldRender('generalTips', tier)) {
      renderGeneralTips(job);
    }

    // Update meta tags
    updateMetaTags(job);

    // Inject schema
    injectSchema(job);

    // Notify other scripts
    document.dispatchEvent(new CustomEvent('article:rendered', {
      detail: { job: job, tier: tier }
    }));

    // Init countdown after render
    document.dispatchEvent(new CustomEvent('countdown:init'));
  }


  /* ============================================================
     HELPERS
     ============================================================ */

  function renderParagraphs(text) {
    if (!text) return '';
    return text.split('\n\n').map(function (para) {
      return '<p>' + escapeHtml(para.trim()) + '</p>';
    }).join('');
  }

  function truncate(str, max) {
    if (!str || str.length <= max) return str || '';
    return str.slice(0, max) + '…';
  }

  function capitalise(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString('en-PH', {
      year:  'numeric',
      month: 'long',
      day:   'numeric'
    });
  }

  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
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

  function getSectorPath(sector) {
    const paths = {
      government: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>' +
                  '<polyline points="9 22 9 12 15 12 15 22"/>',
      private:    '<rect x="2" y="7" width="20" height="14" rx="2"/>' +
                  '<path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>',
      ofw:        '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>' +
                  '<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10' +
                          ' 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>'
    };
    return paths[sector] || paths.private;
  }

  function getSectorIcon(sector, size) {
    size = size || 14;
    return '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"' +
      ' stroke-width="2" width="' + size + '" height="' + size + '"' +
      ' aria-hidden="true">' + getSectorPath(sector) + '</svg>';
  }

  function getClockIcon()    { return '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" width="14" height="14" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'; }
  function getCalendarIcon() { return '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" width="14" height="14" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'; }
  function getCheckIcon()    { return '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2.5" width="14" height="14" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>'; }
  function getLinkIcon()     { return '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" width="18" height="18" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>'; }
  function getPrintIcon()    { return '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" width="18" height="18" aria-hidden="true"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>'; }
  function getFacebookIcon()  { return '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" width="18" height="18" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>'; }
  function getWhatsAppIcon()  { return '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" width="18" height="18" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>'; }


  /* ============================================================
     MAIN INIT
     ============================================================ */

  function init() {
    if (!window.TrabahoRouter) {
      showErrorState('Router not available. Please refresh.');
      return;
    }

    const jobId = TrabahoRouter.getJobId();

    if (!jobId) {
      TrabahoRouter.redirectTo404();
      return;
    }

    // Show loading skeleton
    showLoadingState();

    TrabahoRouter.waitForData()
      .then(function (jobs) {

        const job = jobs.getJobById(jobId);

        if (!job) {
          TrabahoRouter.redirectTo404('Job not found: ' + jobId);
          return;
        }

        state.job = job;

        // Render everything
        renderAll(job, jobs.allJobs || []);

        // Hide loading
        hideLoadingState();

      })
      .catch(function (err) {
        console.error('[article.js] Failed to load:', err);
        showErrorState('Could not load job details. Please try again.');
      });
  }


  /* ----------------------------------------------------------
     LOADING / ERROR STATES
  ---------------------------------------------------------- */

  function showLoadingState() {
    const main = document.getElementById(MAIN_ID);
    if (!main) return;

    const skeletons = [
      'style="height:32px;width:60%;"',
      'style="height:48px;width:90%;"',
      'style="height:18px;width:40%;"'
    ];

    const header = document.createElement('div');
    header.id        = 'article-skeleton';
    header.className = 'article-header';
    header.innerHTML =
      skeletons.map(function (s) {
        return '<div class="skeleton skeleton-wave" ' + s + '></div>';
      }).join('') +

      '<div class="meta-bar" style="margin-top:24px;">' +
        Array(6).fill(
          '<div class="skeleton-wave" style="height:60px;border-radius:8px;"></div>'
        ).join('') +
      '</div>';

    main.prepend(header);
  }

  function hideLoadingState() {
    const skeleton = document.getElementById('article-skeleton');
    if (skeleton) skeleton.remove();
  }

  function showErrorState(message) {
    hideLoadingState();
    const main = document.getElementById(MAIN_ID);
    if (!main) return;

    const el = document.createElement('div');
    el.className = 'empty-state';
    el.innerHTML =
      '<div class="empty-state__icon">' +
        '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"' +
            ' stroke-width="1.5">' +
          '<circle cx="12" cy="12" r="10"/>' +
          '<line x1="12" y1="8" x2="12" y2="12"/>' +
          '<line x1="12" y1="16" x2="12.01" y2="16"/>' +
        '</svg>' +
      '</div>' +
      '<h2 class="empty-state__title">Could not load job</h2>' +
      '<p class="empty-state__message">' + escapeHtml(message) + '</p>' +
      '<a href="/" class="btn btn--primary mt-4">Back to Home</a>';

    main.prepend(el);
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
     window.TrabahoArticle
  ---------------------------------------------------------- */
  window.TrabahoArticle = {
    getJob:        function () { return state.job;     },
    getRelated:    function () { return state.related; },
    rerender:      function () {
      if (state.job && window.TrabahoRouter) {
        TrabahoRouter.waitForData().then(function (jobs) {
          renderAll(state.job, jobs.allJobs || []);
        });
      }
    }
  };

}());