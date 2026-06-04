/* ============================================================
   FILE: assets/js/pages/home.js
   PURPOSE: Homepage logic — hero search, sector cards,
            salary grade cards, latest jobs, stats counters,
            hero animation sequence.
   DEPENDS ON: app.js, router.js, filters.js
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
  const LATEST_JOBS_COUNT   = 6;     // 2 gov + 2 private + 2 OFW
  const SG_HIGHLIGHT_GROUPS = [
    { range: 'SG 1–5',   sgs: [1,2,3,4,5],       edu: 'High School Graduate',       color: '#16a34a' },
    { range: 'SG 6–10',  sgs: [6,7,8,9,10],       edu: 'Vocational / Some College',  color: '#0891b2' },
    { range: 'SG 11–15', sgs: [11,12,13,14,15],   edu: 'Bachelor\'s Degree',         color: '#164896' },
    { range: 'SG 16–20', sgs: [16,17,18,19,20],   edu: 'Licensed Professional',      color: '#7c3aed' },
    { range: 'SG 21–26', sgs: [21,22,23,24,25,26],edu: 'Supervisory / Managerial',   color: '#d97706' },
    { range: 'SG 27–33', sgs: [27,28,29,30,31,32,33], edu: 'Executive / Director',   color: '#dc2626' }
  ];


  /* ============================================================
     HERO SECTION
     ============================================================ */

  /* ----------------------------------------------------------
     INIT HERO ANIMATION
     Staggered entrance for title, subtitle, search bar.
     Respects prefers-reduced-motion.
  ---------------------------------------------------------- */
  function initHeroAnimation() {
    const hero = document.querySelector('.page-hero');
    if (!hero) return;

    // Respect user motion preference
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reduceMotion) {
      // Just make everything visible immediately
      hero.querySelectorAll('.page-hero__title, .page-hero__subtitle, .hero-search, .stats-bar')
        .forEach(function (el) {
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
      return;
    }

    // Add animation class — CSS handles the stagger
    hero.classList.add('hero-animate');
  }


  /* ----------------------------------------------------------
     INIT HERO SEARCH
     Handles search form submission and clear button.
     Actual redirect logic lives in router.js.
  ---------------------------------------------------------- */
  function initHeroSearch() {
    const form     = document.querySelector('.hero-search');
    const input    = document.querySelector('.hero-search__input');
    const clearBtn = document.querySelector('.hero-search__clear');
    const searchBtn= document.querySelector('.hero-search__btn');

    if (!form || !input) return;

    // Submit on Enter
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitSearch(input.value.trim());
      }
    });

    // Submit on button click
    if (searchBtn) {
      searchBtn.addEventListener('click', function () {
        submitSearch(input.value.trim());
      });
    }

    // Form submit
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submitSearch(input.value.trim());
    });

    // Show/hide clear button
    input.addEventListener('input', function () {
      form.classList.toggle('has-value', !!this.value);
    });

    // Clear button
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

    if (window.TrabahoRouter) {
      TrabahoRouter.redirectToSearch(query);
    } else {
      window.location.href = '/jobs/job-map.html?q=' +
        encodeURIComponent(query);
    }
  }


  /* ============================================================
     STATS BAR
     ============================================================ */

  /* ----------------------------------------------------------
     INIT STATS COUNTERS
     Animates numbers when stats bar enters viewport.
     Falls back to showing final numbers if no IntersectionObserver.
  ---------------------------------------------------------- */
  function initStatsCounters() {
    const statsBar = document.querySelector('.stats-bar');
    if (!statsBar) return;

    const counters = statsBar.querySelectorAll('[data-count]');
    if (!counters.length) return;

    // Reduce motion — show final numbers immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      counters.forEach(function (el) {
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        el.textContent = target.toLocaleString('en-PH') + suffix;
      });
      return;
    }

    if (!('IntersectionObserver' in window)) {
      // Fallback — show immediately
      counters.forEach(function (el) {
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        el.textContent = target.toLocaleString('en-PH') + suffix;
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        // Animate all counters in the bar
        counters.forEach(function (el) {
          animateCounter(el);
        });

        observer.unobserve(statsBar);
      });
    }, { threshold: 0.5 });

    observer.observe(statsBar);
  }

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-count'), 10);
    const suffix   = el.getAttribute('data-suffix') || '';
    const duration = 1500;
    const start    = performance.now();

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(eased * target);

      el.textContent = current.toLocaleString('en-PH') + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toLocaleString('en-PH') + suffix;
      }
    }

    requestAnimationFrame(tick);
  }


  /* ============================================================
     SECTOR NAVIGATION CARDS
     ============================================================ */

  /* ----------------------------------------------------------
     INIT SECTOR CARDS
     Renders sector navigation cards from categories.json.
  ---------------------------------------------------------- */
  function initSectorCards() {
    const container = document.querySelector('.sector-cards-grid');
    if (!container) return;

    fetch('/data/categories.json', { cache: 'force-cache' })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        renderSectorCards(container, data.sectors || []);
      })
      .catch(function () {
        // Fallback — use hardcoded sectors
        renderSectorCards(container, getDefaultSectors());
      });
  }

  function renderSectorCards(container, sectors) {
    const active = sectors.filter(function (s) {
      return s.status !== 'coming-soon';
    });

    container.innerHTML = active.map(function (sector) {
      return '<a href="' + escapeHtml(sector.url) + '"' +
        ' class="card category-card reveal"' +
        ' style="--icon-bg:' + escapeHtml(sector.iconBg) + ';' +
                '--icon-color:' + escapeHtml(sector.iconColor) + ';"' +
        ' aria-label="Browse ' + escapeHtml(sector.title) + ' jobs">' +

        '<div class="category-card__icon">' +
          sector.icon +   // SVG string from JSON
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

    // Trigger reveal animations
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

  /* ----------------------------------------------------------
     INIT SALARY GRADE CARDS
     Renders 6 SG group cards.
  ---------------------------------------------------------- */
  function initSalaryGradeCards() {
    const container = document.querySelector('.card-grid--sg');
    if (!container) return;

    // Show skeletons while loading
    container.innerHTML = Array(6).fill(
      '<div class="card sg-card skeleton-wave" style="min-height:140px;"></div>'
    ).join('');

    fetch('/data/salary-grades.json', { cache: 'force-cache' })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        renderSGCards(container, data.grades || []);
      })
      .catch(function () {
        renderSGCards(container, []);
      });
  }

  function renderSGCards(container, grades) {
    container.innerHTML = SG_HIGHLIGHT_GROUPS.map(function (group) {
      // Find min salary for this group
      const groupGrades = grades.filter(function (g) {
        return group.sgs.includes(g.sg);
      });

      const minSalary = groupGrades.length
        ? Math.min.apply(null, groupGrades.map(function (g) {
            return g.step1 || 0;
          }))
        : null;

      const maxSalary = groupGrades.length
        ? Math.max.apply(null, groupGrades.map(function (g) {
            return g.step1 || 0;
          }))
        : null;

      const salaryText = (minSalary && maxSalary)
        ? '₱' + formatSalary(minSalary) + ' – ₱' + formatSalary(maxSalary)
        : 'View salary table';

      // Example positions for this group
      const examples = groupGrades
        .slice(0, 2)
        .map(function (g) { return g.examplePosition || ''; })
        .filter(Boolean)
        .join(', ');

      return '<a href="/government/salary-grade.html#' +
            'sg-' + group.sgs[0] + '"' +
          ' class="card sg-card reveal"' +
          ' aria-label="' + escapeHtml(group.range) + ' salary grades"' +
          ' style="border-top: 3px solid ' + group.color + ';">' +

          '<div class="sg-card__range">' +
            escapeHtml(group.range) +
          '</div>' +

          '<div class="sg-card__label">Salary Grade</div>' +

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

    // Reveal animation
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

  /* ----------------------------------------------------------
     INIT LATEST JOBS
     Shows 2 gov + 2 private + 2 OFW in homepage grid.
  ---------------------------------------------------------- */
  function initLatestJobs() {
    const container = document.querySelector('.latest-jobs-grid');
    if (!container) return;

    // Show skeletons
    container.innerHTML = Array(6).fill(
      '<div class="card job-card skeleton-wave" style="min-height:260px;"></div>'
    ).join('');

    if (!window.TrabahoRouter) return;

    TrabahoRouter.waitForData()
      .then(function (jobs) {
        const latest = selectLatestJobs(jobs.allJobs || []);
        renderLatestJobs(container, latest);
      })
      .catch(function () {
        container.innerHTML =
          '<p class="text-muted text-center" style="grid-column:1/-1;">' +
            'Could not load latest jobs. Please refresh.' +
          '</p>';
      });
  }

  /* ----------------------------------------------------------
     SELECT LATEST JOBS
     Picks 2 most recent from each sector.
  ---------------------------------------------------------- */
  function selectLatestJobs(allJobs) {
    const sectors  = ['government', 'private', 'ofw'];
    const selected = [];

    sectors.forEach(function (sector) {
      const sectorJobs = allJobs
        .filter(function (j) {
          return j.sector === sector && j.status !== 'archived';
        })
        .sort(function (a, b) {
          return new Date(b.publishedDate) - new Date(a.publishedDate);
        })
        .slice(0, 2);

      selected.push.apply(selected, sectorJobs);
    });

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
      const hasImage = job.images && job.images.length > 0;
      const salary   = job.salaryAmount || job.salaryRange || '';
      const isUrgent = isDeadlineUrgent(job.deadline);

      const imageHtml = hasImage
        ? '<img src="' + escapeHtml(job.images[0]) + '"' +
            ' alt="' + escapeHtml(job.title) + '"' +
            ' loading="lazy">'
        : '<div class="job-card__image--no-img">' +
            getSectorFallbackIcon(job.sector) +
          '</div>';

      return '<article class="card job-card reveal"' +
          ' style="--reveal-delay:' + (i * 75) + 'ms">' +
        '<a href="/jobs/' + escapeHtml(job.id) + '/">' +

          '<div class="job-card__image">' +
            imageHtml +
            '<span class="job-card__sector-badge badge--' +
              escapeHtml(job.sector) + '">' +
              escapeHtml(job.sector) +
            '</span>' +
            '<span class="job-card__status ' + getStatusClass(job) + '">' +
              getStatusLabel(job) +
            '</span>' +
          '</div>' +

          '<div class="job-card__body">' +

            '<div class="job-card__meta-top">' +
              '<span class="job-card__employment-type">' +
                escapeHtml(job.employmentType || 'Full-time') +
              '</span>' +
              '<span class="job-card__read-time">' +
                (job.readTime || '3') + ' min' +
              '</span>' +
            '</div>' +

            '<h3 class="job-card__title">' +
              escapeHtml(job.title) +
            '</h3>' +

            '<p class="job-card__agency">' +
              escapeHtml(job.agency || job.company || '') +
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
                    '₱' + escapeHtml(salary) +
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

    // Trigger reveal
    requestAnimationFrame(function () {
      container.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('revealed');
      });
    });
  }


  /* ============================================================
     QUICK LINKS BAR
     ============================================================ */

  /* ----------------------------------------------------------
     INIT QUICK LINKS
     Marks active quick link based on current page.
  ---------------------------------------------------------- */
  function initQuickLinks() {
    const bar = document.querySelector('.quick-links-bar');
    if (!bar) return;

    const path  = window.location.pathname;
    const links = bar.querySelectorAll('.btn--quick-link');

    links.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href && path.startsWith(href) && href !== '/') {
        link.classList.add('active');
      }
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
    if (job.status === 'archived')      return 'job-card__status--closed';
    if (isDeadlineUrgent(job.deadline)) return 'job-card__status--soon';
    return 'job-card__status--open';
  }

  function getStatusLabel(job) {
    if (job.status === 'archived')      return 'Closed';
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
    const icons = {
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
    initStatsCounters();
    initSectorCards();
    initSalaryGradeCards();
    initLatestJobs();
    initQuickLinks();
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
     window.TrabahoHome
  ---------------------------------------------------------- */
  window.TrabahoHome = {
    refresh: initLatestJobs,
    init:    init
  };

}());