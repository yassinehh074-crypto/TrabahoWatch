/* ============================================================
   FILE: assets/js/pages/home.js
   PURPOSE: Homepage logic — hero search, sector cards,
            salary grade cards, latest jobs, stats counters,
            hero animation sequence.
   DEPENDS ON: app.js, data/jobs/index.js (window.TrabahoJobs)
   LOAD ORDER: <script src="/assets/js/pages/home.js" defer>
   NOTE: Only runs on homepage (data-page="home")
   ============================================================ */


(function () {

  'use strict';


  /* ----------------------------------------------------------
     GUARD — Only run on homepage
  ---------------------------------------------------------- */
  function isHomePage() {
    return (
      document.body.getAttribute('data-page') === 'home' ||
      window.location.pathname === '/' ||
      window.location.pathname === '/index.html'
    );
  }

  if (!isHomePage()) return;


  /* ----------------------------------------------------------
     CONSTANTS
  ---------------------------------------------------------- */
  var SG_HIGHLIGHT_GROUPS = [
    { range: 'SG 1–5',   sgs: [1,2,3,4,5],            edu: 'High School Graduate',      color: '#16a34a' },
    { range: 'SG 6–10',  sgs: [6,7,8,9,10],           edu: 'Vocational / Some College', color: '#0891b2' },
    { range: 'SG 11–15', sgs: [11,12,13,14,15],       edu: "Bachelor's Degree",         color: '#164896' },
    { range: 'SG 16–20', sgs: [16,17,18,19,20],       edu: 'Licensed Professional',     color: '#7c3aed' },
    { range: 'SG 21–26', sgs: [21,22,23,24,25,26],    edu: 'Supervisory / Managerial',  color: '#d97706' },
    { range: 'SG 27–33', sgs: [27,28,29,30,31,32,33], edu: 'Executive / Director',      color: '#dc2626' }
  ];


  /* ============================================================
     HERO SECTION
     ============================================================ */

  function initHeroAnimation() {
    var hero = document.querySelector('.page-hero');
    if (!hero) return;

    var reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reduceMotion) {
      hero.querySelectorAll('.page-hero__title, .page-hero__subtitle, .hero-search')
        .forEach(function (el) {
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
      return;
    }

    hero.classList.add('hero-animate');
  }


  function initHeroSearch() {
    var form      = document.querySelector('.hero-search');
    var input     = document.querySelector('.hero-search__input');
    var clearBtn  = document.querySelector('.hero-search__clear');
    var searchBtn = document.querySelector('.hero-search__btn');

    if (!form || !input) return;

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitSearch(input.value.trim());
      }
    });

    if (searchBtn) {
      searchBtn.addEventListener('click', function () {
        submitSearch(input.value.trim());
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submitSearch(input.value.trim());
    });

    input.addEventListener('input', function () {
      form.classList.toggle('has-value', !!this.value);
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        input.value = '';
        form.classList.remove('has-value');
        input.focus();
      });
    }
  }

  function submitSearch(query) {
    if (!query) return;

    if (window.TrabahoRouter && typeof TrabahoRouter.redirectToSearch === 'function') {
      TrabahoRouter.redirectToSearch(query);
    } else {
      window.location.href = '/jobs/job-map.html?q=' +
        encodeURIComponent(query);
    }
  }


  /* ============================================================
     SECTOR NAVIGATION CARDS
     ============================================================ */

  function initSectorCards() {
    var container = document.querySelector('.sector-cards-grid');
    if (!container) return;

    fetch('/data/categories.json', { cache: 'force-cache' })
      .then(function (res) {
        if (!res.ok) throw new Error('not found');
        return res.json();
      })
      .then(function (data) {
        renderSectorCards(container, data.sectors || []);
      })
      .catch(function () {
        renderSectorCards(container, getDefaultSectors());
      });
  }

  function renderSectorCards(container, sectors) {
    var active = sectors.filter(function (s) {
      return s.status !== 'coming-soon';
    });

    if (!active.length) active = getDefaultSectors();

    container.innerHTML = active.map(function (sector) {
      return '<a href="' + escapeHtml(sector.url) + '"' +
        ' class="card category-card reveal"' +
        ' style="--icon-bg:' + escapeHtml(sector.iconBg) + ';' +
                '--icon-color:' + escapeHtml(sector.iconColor) + ';"' +
        ' aria-label="Browse ' + escapeHtml(sector.title) + ' jobs">' +

        '<div class="category-card__icon">' +
          sector.icon +
        '</div>' +

        '<div class="category-card__body">' +
          '<h3 class="category-card__title">' +
            escapeHtml(sector.title) +
          '</h3>' +
          '<p class="category-card__count">' +
            escapeHtml(sector.description) +
          '</p>' +
        '</div>' +

        '<svg class="category-card__arrow" viewBox="0 0 24 24"' +
            ' stroke="currentColor" fill="none" stroke-width="2">' +
          '<path d="m9 18 6-6-6-6"/>' +
        '</svg>' +

      '</a>';
    }).join('');

    requestAnimationFrame(function () {
      container.querySelectorAll('.reveal').forEach(function (el, i) {
        el.style.setProperty('--reveal-delay', (i * 100) + 'ms');
        setTimeout(function () {
          el.classList.add('revealed');
        }, i * 100);
      });
    });
  }

  function getDefaultSectors() {
    return [
      {
        title:       'Government Jobs',
        description: 'DepEd, DOH, LGU & more · SG1–SG33',
        url:         '/government/',
        iconBg:      'rgba(22,72,150,0.1)',
        iconColor:   '#164896',
        status:      'active',
        icon: '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="1.5">' +
              '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>' +
              '<polyline points="9 22 9 12 15 12 15 22"/>' +
              '</svg>'
      },
      {
        title:       'Private Sector',
        description: 'BPO, Tech, Healthcare & more',
        url:         '/private/',
        iconBg:      'rgba(124,58,237,0.1)',
        iconColor:   '#7c3aed',
        status:      'active',
        icon: '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="1.5">' +
              '<rect x="2" y="7" width="20" height="14" rx="2"/>' +
              '<path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>' +
              '</svg>'
      },
      {
        title:       'OFW Opportunities',
        description: 'Middle East, Asia, Europe & more',
        url:         '/ofw/',
        iconBg:      'rgba(8,145,178,0.1)',
        iconColor:   '#0891b2',
        status:      'active',
        icon: '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="1.5">' +
              '<circle cx="12" cy="12" r="10"/>' +
              '<line x1="2" y1="12" x2="22" y2="12"/>' +
              '<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10' +
                      ' 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>' +
              '</svg>'
      },
      {
        title:       'CSC Exam Guide',
        description: 'Schedules, tips & reviewer',
        url:         '/government/csc-exams.html',
        iconBg:      'rgba(234,179,8,0.1)',
        iconColor:   '#ca8a04',
        status:      'active',
        icon: '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="1.5">' +
              '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>' +
              '<polyline points="14 2 14 8 20 8"/>' +
              '<line x1="16" y1="13" x2="8" y2="13"/>' +
              '<line x1="16" y1="17" x2="8" y2="17"/>' +
              '</svg>'
      }
    ];
  }


  /* ============================================================
     SALARY GRADE CARDS
     ============================================================ */

  function initSalaryGradeCards() {
    var container = document.querySelector('.card-grid--sg');
    if (!container) return;

    fetch('/data/salary-grades.json', { cache: 'force-cache' })
      .then(function (res) {
        if (!res.ok) throw new Error('not found');
        return res.json();
      })
      .then(function (data) {
        renderSGCards(container, data.grades || []);
      })
      .catch(function () {
        renderSGCards(container, []);
      });
  }

  function renderSGCards(container, grades) {
    container.innerHTML = SG_HIGHLIGHT_GROUPS.map(function (group) {
      var groupGrades = grades.filter(function (g) {
        return group.sgs.indexOf(g.sg) !== -1;
      });

      var step1Values = groupGrades
        .map(function (g) {
          return (g.steps && g.steps[0]) ? g.steps[0] : 0;
        })
        .filter(function (v) { return v > 0; });

      var minSalary = step1Values.length ? Math.min.apply(null, step1Values) : null;
      var maxSalary = step1Values.length ? Math.max.apply(null, step1Values) : null;

      var salaryText = (minSalary && maxSalary)
        ? '₱' + formatSalary(minSalary) + ' – ₱' + formatSalary(maxSalary)
        : 'View salary table';

      var examples = groupGrades
        .slice(0, 2)
        .map(function (g) { return g.label || ''; })
        .filter(Boolean)
        .join(', ');

      return '<a href="/government/salary-grade.html#sg-' + group.sgs[0] + '"' +
          ' class="card sg-card reveal"' +
          ' aria-label="' + escapeHtml(group.range) + ' salary grades"' +
          ' style="border-top: 3px solid ' + group.color + ';">' +

          '<div class="sg-card__range">' +
            escapeHtml(group.range) +
          '</div>' +

          '<div class="sg-card__label">SALARY GRADE</div>' +

          '<div class="sg-card__salary">' +
            escapeHtml(salaryText) +
          '</div>' +

          '<div class="sg-card__edu">' +
            escapeHtml(group.edu) +
          '</div>' +

          (examples
            ? '<div class="sg-card__examples">' +
                escapeHtml(examples) +
              '</div>'
            : '') +

        '</a>';
    }).join('');

    requestAnimationFrame(function () {
      container.querySelectorAll('.reveal').forEach(function (el, i) {
        el.style.setProperty('--reveal-delay', (i * 80) + 'ms');
        setTimeout(function () {
          el.classList.add('revealed');
        }, i * 80);
      });
    });
  }


  /* ============================================================
     LATEST JOBS
     ============================================================ */

  function initLatestJobs() {
    var container = document.querySelector('.latest-jobs-grid');
    if (!container) return;

    /* If TrabahoJobs already ready, render immediately */
    if (window.TrabahoJobs) {
      renderLatestFromAPI(container);
      return;
    }

    /* Otherwise wait for the ready event (with timeout fallback) */
    var done = false;

    window.addEventListener('trabahoJobs:ready', function onReady() {
      if (done) return;
      done = true;
      window.removeEventListener('trabahoJobs:ready', onReady);
      renderLatestFromAPI(container);
    });

    /* Safety timeout in case event already fired before listener attached */
    setTimeout(function () {
      if (done) return;
      if (window.TrabahoJobs) {
        done = true;
        renderLatestFromAPI(container);
      } else {
        container.innerHTML =
          '<p class="text-muted text-center" style="grid-column:1/-1;">' +
            'Could not load latest jobs. Please refresh.' +
          '</p>';
      }
    }, 5000);
  }

  function renderLatestFromAPI(container) {
    var allJobs = window.TrabahoJobs.getAll({ openOnly: false });
    var latest  = selectLatestJobs(allJobs);
    renderLatestJobs(container, latest);
  }

  /* ----------------------------------------------------------
     SELECT LATEST JOBS
     Picks 2 most recent OPEN jobs from each sector.
  ---------------------------------------------------------- */
  function selectLatestJobs(allJobs) {
    var sectors  = ['government', 'private', 'ofw'];
    var selected = [];

    sectors.forEach(function (sector) {
      var sectorJobs = allJobs
        .filter(function (j) {
          return j.sector === sector && !j.isArchived;
        })
        .sort(function (a, b) {
          var da = a.published ? new Date(a.published).getTime() : 0;
          var db = b.published ? new Date(b.published).getTime() : 0;
          return db - da;
        })
        .slice(0, 2);

      selected.push.apply(selected, sectorJobs);
    });

    /* Fallback: if fewer than 6 (e.g. missing sector), fill with any open jobs */
    if (selected.length < 6) {
      var existingIds = selected.map(function (j) { return j.id; });
      var extra = allJobs
        .filter(function (j) {
          return !j.isArchived && existingIds.indexOf(j.id) === -1;
        })
        .slice(0, 6 - selected.length);
      selected.push.apply(selected, extra);
    }

    return selected;
  }

  /* ----------------------------------------------------------
     RENDER LATEST JOBS
  ---------------------------------------------------------- */
  function renderLatestJobs(container, jobs) {
    if (!jobs.length) {
      container.innerHTML =
        '<p class="text-muted text-center" style="grid-column:1/-1;">' +
          'No jobs available yet. Check back soon!' +
        '</p>';
      return;
    }

    container.innerHTML = jobs.map(function (job, i) {
      var salary  = job.salaryText || '';
      var isUrgent = job.isUrgent;

      return '<article class="card job-card reveal"' +
          ' style="--reveal-delay:' + (i * 75) + 'ms">' +
        '<a href="' + escapeHtml(job.url) + '">' +

          '<div class="job-card__image">' +
            '<div class="job-card__image--no-img">' +
              getSectorFallbackIcon(job.sector) +
            '</div>' +
            '<span class="job-card__sector-badge badge--' +
              escapeHtml(job.sector) + '">' +
              escapeHtml(sectorLabel(job.sector)) +
            '</span>' +
            '<span class="job-card__status ' + getStatusClass(job) + '">' +
              getStatusLabel(job) +
            '</span>' +
          '</div>' +

          '<div class="job-card__body">' +

            '<div class="job-card__meta-top">' +
              '<span class="job-card__employment-type">' +
                escapeHtml(categoryLabel(job)) +
              '</span>' +
            '</div>' +

            '<h3 class="job-card__title">' +
              escapeHtml(job.title) +
            '</h3>' +

            '<p class="job-card__agency">' +
              escapeHtml(job.agency || '') +
            '</p>' +

            '<div class="job-card__details">' +
              (job.location
                ? '<span class="job-card__detail">' +
                    getLocationIcon() +
                    escapeHtml(job.location) +
                  '</span>'
                : '') +
              (salary
                ? '<span class="job-card__detail job-card__salary">' +
                    escapeHtml(salary) +
                  '</span>'
                : '') +
            '</div>' +

            '<div class="job-card__footer">' +
              (job.deadline
                ? '<span class="job-card__deadline' +
                    (isUrgent ? ' job-card__deadline--urgent' : '') + '">' +
                    formatDeadline(job.deadline) +
                  '</span>'
                : '') +
            '</div>' +

          '</div>' +
        '</a>' +
      '</article>';
    }).join('');

    requestAnimationFrame(function () {
      container.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('revealed');
      });
    });
  }


  /* ============================================================
     QUICK LINKS BAR
     ============================================================ */

  function initQuickLinks() {
    var bar = document.querySelector('.quick-links-bar');
    if (!bar) return;

    var path  = window.location.pathname;
    var links = bar.querySelectorAll('.btn--quick-link');

    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href && href !== '/' && path.indexOf(href) === 0) {
        link.classList.add('active');
      }
    });
  }


  /* ============================================================
     HELPERS
     ============================================================ */

  function getStatusClass(job) {
    if (job.isArchived) return 'job-card__status--closed';
    if (job.isUrgent)   return 'job-card__status--soon';
    return 'job-card__status--open';
  }

  function getStatusLabel(job) {
    if (job.isArchived) return 'Closed';
    if (job.isPaused)   return 'Paused';
    if (job.isUrgent)   return 'Closing Soon';
    return 'Open';
  }

  function sectorLabel(sector) {
    if (sector === 'government') return 'Government';
    if (sector === 'private')    return 'Private';
    if (sector === 'ofw')        return 'OFW';
    return sector || '';
  }

  function categoryLabel(job) {
    if (job.category) {
      return job.category.replace(/-/g, ' ').replace(/\b\w/g, function (c) {
        return c.toUpperCase();
      });
    }
    return sectorLabel(job.sector);
  }

  function formatDeadline(deadline) {
    if (!deadline) return '';
    var d = new Date(deadline);
    if (isNaN(d.getTime())) return '';
    return 'Deadline: ' + d.toLocaleDateString('en-PH', {
      month: 'short',
      day:   'numeric',
      year:  'numeric'
    });
  }

  function formatSalary(num) {
    if (!num) return '–';
    return Number(num).toLocaleString('en-PH');
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

  function getLocationIcon() {
    return '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"' +
      ' stroke-width="2" width="14" height="14">' +
      '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>' +
      '<circle cx="12" cy="10" r="3"/>' +
    '</svg>';
  }

  function getSectorFallbackIcon(sector) {
    var icons = {
      government:
        '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"' +
            ' stroke-width="1.5" width="48" height="48">' +
          '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>' +
        '</svg>',
      private:
        '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"' +
            ' stroke-width="1.5" width="48" height="48">' +
          '<rect x="2" y="7" width="20" height="14" rx="2"/>' +
          '<path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>' +
        '</svg>',
      ofw:
        '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"' +
            ' stroke-width="1.5" width="48" height="48">' +
          '<circle cx="12" cy="12" r="10"/>' +
          '<line x1="2" y1="12" x2="22" y2="12"/>' +
          '<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10' +
                  ' 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>' +
        '</svg>'
    };
    return icons[sector] || icons.private;
  }


  /* ============================================================
     MAIN INIT
     ============================================================ */

  function init() {
    initHeroAnimation();
    initHeroSearch();
    initSectorCards();
    initSalaryGradeCards();
    initLatestJobs();
    initQuickLinks();
  }


  /* ----------------------------------------------------------
     DOM READY
  ---------------------------------------------------------- */
  if (window.TrabahoApp && typeof TrabahoApp.onReady === 'function') {
    TrabahoApp.onReady(init);
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }


  /* ----------------------------------------------------------
     PUBLIC API
     window.TrabahoHome
  ---------------------------------------------------------- */
  window.TrabahoHome = {
    refresh: initLatestJobs,
    init:    init
  };

}());
