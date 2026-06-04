/* ============================================================
   FILE: assets/js/pages/salary-grade.js
   PURPOSE: Salary Grade page — renders full SG table
            (SG1-SG33 × 8 steps), salary calculator,
            position lookup, hash navigation, schema.org.
   DEPENDS ON: app.js, router.js
   LOAD ORDER: <script src="/assets/js/pages/salary-grade.js" defer>
   NOTE: Only runs on salary-grade.html
   ============================================================ */


(function () {

  'use strict';


  /* ----------------------------------------------------------
     GUARD
  ---------------------------------------------------------- */
  function isSalaryGradePage() {
    return window.location.pathname.includes('salary-grade');
  }

  if (!isSalaryGradePage()) return;


  /* ----------------------------------------------------------
     CONSTANTS
  ---------------------------------------------------------- */
  const JSON_URL         = '/data/salary-grades.json';
  const TABLE_ID         = 'sg-table';
  const CALC_FORM_ID     = 'sg-calculator';
  const SEARCH_INPUT_ID  = 'sg-position-search';
  const RESULTS_ID       = 'sg-search-results';
  const CHUNK_SIZE       = 5;       // SG rows per animation frame
  const STEP_INCREASE    = 0.03;    // 3% per step


  /* ----------------------------------------------------------
     STATE
  ---------------------------------------------------------- */
  const state = {
    grades:      [],    // full salary grade data
    positions:   [],    // all positions with SG mapping
    activeFilter:null,  // current education filter
    searchTimer: null
  };


  /* ============================================================
     DATA LOADING
     ============================================================ */

  function loadData() {
    showTableSkeleton();

    return fetch(JSON_URL, { cache: 'no-cache' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        state.grades    = data.grades    || [];
        state.positions = data.positions || [];
        return data;
      });
  }


  /* ============================================================
     SG TABLE
     ============================================================ */

  /* ----------------------------------------------------------
     SHOW TABLE SKELETON
  ---------------------------------------------------------- */
  function showTableSkeleton() {
    const container = document.getElementById(TABLE_ID);
    if (!container) return;

    container.innerHTML =
      '<div style="overflow-x:auto;">' +
        '<table style="width:100%;min-width:600px;">' +
          '<thead>' +
            '<tr>' +
              ['SG', 'Step 1', 'Step 2', 'Step 3', 'Step 4',
               'Step 5', 'Step 6', 'Step 7', 'Step 8'].map(function (h) {
                return '<th class="skeleton-wave" style="height:40px;padding:8px;">' +
                  h + '</th>';
              }).join('') +
            '</tr>' +
          '</thead>' +
          '<tbody>' +
            Array(10).fill(
              '<tr>' +
                Array(9).fill(
                  '<td class="skeleton-wave" style="height:36px;"></td>'
                ).join('') +
              '</tr>'
            ).join('') +
          '</tbody>' +
        '</table>' +
      '</div>';
  }


  /* ----------------------------------------------------------
     BUILD FULL SG TABLE
     Renders in chunks to avoid blocking.
  ---------------------------------------------------------- */
  function buildSGTable(grades) {
    const container = document.getElementById(TABLE_ID);
    if (!container) return Promise.resolve();

    return new Promise(function (resolve) {
      // Build table structure
      const wrapper = document.createElement('div');
      wrapper.style.overflowX = 'auto';

      const table = document.createElement('table');
      table.className = 'sg-full-table';
      table.setAttribute('aria-label', 'Philippine Government Salary Grade Table 2026');

      // Header
      const thead = document.createElement('thead');
      thead.innerHTML =
        '<tr>' +
          '<th scope="col" style="width:60px;">SG</th>' +
          [1,2,3,4,5,6,7,8].map(function (s) {
            return '<th scope="col">Step ' + s + '</th>';
          }).join('') +
        '</tr>';
      table.appendChild(thead);

      // Body — built in chunks
      const tbody = document.createElement('tbody');
      table.appendChild(tbody);
      wrapper.appendChild(table);
      container.innerHTML = '';
      container.appendChild(wrapper);

      let index = 0;

      function renderChunk() {
        const end = Math.min(index + CHUNK_SIZE, grades.length);

        for (let i = index; i < end; i++) {
          const grade = grades[i];
          const row   = buildSGRow(grade);
          tbody.appendChild(row);
        }

        index = end;

        if (index < grades.length) {
          requestAnimationFrame(renderChunk);
        } else {
          // All rows rendered
          bindTableInteractions(table, grades);
          checkHashAfterRender();
          resolve();
        }
      }

      requestAnimationFrame(renderChunk);
    });
  }


  /* ----------------------------------------------------------
     BUILD SINGLE SG ROW
  ---------------------------------------------------------- */
  function buildSGRow(grade) {
    const row = document.createElement('tr');
    row.id = 'sg-' + grade.sg;
    row.setAttribute('data-sg', grade.sg);
    row.className = 'sg-row';

    // Education level class for filtering
    row.setAttribute('data-edu-level', grade.eduLevel || 'any');

    // SG number cell
    const sgCell = document.createElement('th');
    sgCell.scope     = 'row';
    sgCell.className = 'sg-row__number';
    sgCell.innerHTML =
      '<a href="#sg-' + grade.sg + '" class="sg-anchor">' +
        'SG ' + grade.sg +
      '</a>';
    row.appendChild(sgCell);

    // Step cells
    const step1 = grade.step1 || 0;

    [1,2,3,4,5,6,7,8].forEach(function (step) {
      const td   = document.createElement('td');
      const amount = step === 1
        ? step1
        : Math.round(step1 * Math.pow(1 + STEP_INCREASE, step - 1));

      td.className        = 'sg-row__salary';
      td.setAttribute('data-step', step);
      td.setAttribute('data-amount', amount);
      td.textContent      = '₱' + formatSalary(amount);

      // Highlight step 1 (most commonly referenced)
      if (step === 1) td.classList.add('sg-row__salary--step1');

      row.appendChild(td);
    });

    return row;
  }


  /* ----------------------------------------------------------
     BIND TABLE INTERACTIONS
     Hover highlight, click to calculate.
  ---------------------------------------------------------- */
  function bindTableInteractions(table, grades) {
    // Click on any salary cell — populate calculator
    table.addEventListener('click', function (e) {
      const cell = e.target.closest('[data-amount]');
      if (!cell) return;

      const row    = cell.closest('.sg-row');
      const sg     = parseInt(row.getAttribute('data-sg'),  10);
      const step   = parseInt(cell.getAttribute('data-step'), 10);
      const amount = parseInt(cell.getAttribute('data-amount'), 10);

      populateCalculator(sg, step, amount);

      // Highlight selected cell
      table.querySelectorAll('.sg-row__salary--selected').forEach(
        function (el) { el.classList.remove('sg-row__salary--selected'); }
      );
      cell.classList.add('sg-row__salary--selected');

      // Scroll to calculator
      const calc = document.getElementById(CALC_FORM_ID);
      if (calc) {
        const top = calc.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });

    // SG anchor links — smooth scroll with offset
    table.querySelectorAll('.sg-anchor').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const id = link.getAttribute('href').slice(1);
        scrollToSG(id);
      });
    });
  }


  /* ----------------------------------------------------------
     SCROLL TO SG ROW
  ---------------------------------------------------------- */
  function scrollToSG(id) {
    const target = document.getElementById(id);
    if (!target) return;

    const headerH = parseInt(
      getComputedStyle(document.documentElement)
        .getPropertyValue('--header-height'), 10
    ) || 64;

    const top = target.getBoundingClientRect().top
              + window.scrollY - headerH - 16;

    window.scrollTo({ top: top, behavior: 'smooth' });

    // Highlight row briefly
    target.classList.add('sg-row--highlight');
    setTimeout(function () {
      target.classList.remove('sg-row--highlight');
    }, 2000);

    try {
      history.replaceState(null, '', '#' + id);
    } catch (e) {
      // Fail silently
    }
  }


  /* ----------------------------------------------------------
     CHECK HASH AFTER RENDER
     Handles deep links like #sg-11
  ---------------------------------------------------------- */
  function checkHashAfterRender() {
    const hash = window.location.hash;
    if (!hash) return;

    const id = hash.replace('#', '');
    if (!id.startsWith('sg-')) return;

    setTimeout(function () {
      scrollToSG(id);
    }, 100);
  }


  /* ============================================================
     EDUCATION FILTER
     Filters table rows by education requirement.
     ============================================================ */

  function initEducationFilter() {
    const filterBtns = document.querySelectorAll('[data-edu-filter]');
    if (!filterBtns.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const level = btn.getAttribute('data-edu-filter');

        // Update active button
        filterBtns.forEach(function (b) {
          b.classList.toggle('btn--pill-active',   b === btn);
          b.classList.toggle('btn--pill-inactive', b !== btn);
        });

        filterRows(level);
        state.activeFilter = level;
      });
    });
  }

  function filterRows(eduLevel) {
    const rows = document.querySelectorAll('.sg-row');
    let  count = 0;

    rows.forEach(function (row) {
      const rowLevel = row.getAttribute('data-edu-level') || 'any';
      const show     = !eduLevel || eduLevel === 'all' || rowLevel === eduLevel;

      row.style.display = show ? '' : 'none';
      if (show) count++;
    });

    // Update count display
    const countEl = document.querySelector('[data-filtered-count]');
    if (countEl) {
      countEl.textContent = count + ' salary grade' + (count !== 1 ? 's' : '');
    }
  }


  /* ============================================================
     SALARY CALCULATOR
     ============================================================ */

  /* ----------------------------------------------------------
     INIT CALCULATOR
  ---------------------------------------------------------- */
  function initCalculator() {
    const form = document.getElementById(CALC_FORM_ID);
    if (!form) return;

    const sgInput   = form.querySelector('[name="sg"]');
    const stepInput = form.querySelector('[name="step"]');
    const resultEl  = document.querySelector('[data-calc-result]');

    if (!sgInput || !stepInput || !resultEl) return;

    function calculate() {
      const sg   = parseInt(sgInput.value,   10);
      const step = parseInt(stepInput.value, 10);

      if (isNaN(sg) || sg < 1 || sg > 33)   return;
      if (isNaN(step) || step < 1 || step > 8) return;

      const grade = state.grades.find(function (g) { return g.sg === sg; });
      if (!grade) return;

      const step1  = grade.step1 || 0;
      const salary = step === 1
        ? step1
        : Math.round(step1 * Math.pow(1 + STEP_INCREASE, step - 1));

      renderCalcResult(resultEl, { sg, step, salary, grade });
    }

    sgInput.addEventListener('input',   calculate);
    stepInput.addEventListener('input', calculate);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      calculate();
    });
  }

  /* ----------------------------------------------------------
     POPULATE CALCULATOR FROM TABLE CLICK
  ---------------------------------------------------------- */
  function populateCalculator(sg, step, amount) {
    const form = document.getElementById(CALC_FORM_ID);
    if (!form) return;

    const sgInput   = form.querySelector('[name="sg"]');
    const stepInput = form.querySelector('[name="step"]');

    if (sgInput)   sgInput.value   = sg;
    if (stepInput) stepInput.value = step;

    const grade = state.grades.find(function (g) { return g.sg === sg; });
    const resultEl = document.querySelector('[data-calc-result]');

    if (resultEl && grade) {
      renderCalcResult(resultEl, { sg, step, salary: amount, grade });
    }
  }

  /* ----------------------------------------------------------
     RENDER CALCULATOR RESULT
  ---------------------------------------------------------- */
  function renderCalcResult(container, data) {
    const { sg, step, salary, grade } = data;

    // Monthly deductions estimate (Philippine standard)
    const gsis       = Math.round(salary * 0.09);     // 9% GSIS
    const pagibig    = Math.min(Math.round(salary * 0.02), 100); // 2% or ₱100 max
    const philhealth = Math.round(salary * 0.025);    // 2.5% PhilHealth
    const tax        = estimateWithholdingTax(salary);
    const totalDeduct = gsis + pagibig + philhealth + tax;
    const takeHome    = salary - totalDeduct;

    // All 8 steps for this SG
    const allSteps = [1,2,3,4,5,6,7,8].map(function (s) {
      const amount = s === 1
        ? (grade.step1 || 0)
        : Math.round((grade.step1 || 0) * Math.pow(1 + STEP_INCREASE, s - 1));
      return { step: s, amount: amount };
    });

    container.innerHTML =

      // Headline
      '<div class="calc-result__headline">' +
        '<div class="calc-result__sg">SG ' + sg + ' — Step ' + step + '</div>' +
        '<div class="calc-result__salary">₱' + formatSalary(salary) + '/month</div>' +
        (grade.examplePosition
          ? '<div class="calc-result__position">' +
              escapeHtml(grade.examplePosition) +
            '</div>'
          : '') +
      '</div>' +

      // Breakdown table
      '<div class="calc-result__breakdown">' +
        '<h4 class="calc-result__breakdown-title">Estimated Monthly Breakdown</h4>' +
        '<table class="calc-breakdown-table">' +
          '<tbody>' +
            '<tr class="calc-breakdown-table__row">' +
              '<td>Basic Salary</td>' +
              '<td>₱' + formatSalary(salary) + '</td>' +
            '</tr>' +
            '<tr class="calc-breakdown-table__row calc-breakdown-table__row--deduct">' +
              '<td>GSIS Contribution (9%)</td>' +
              '<td>− ₱' + formatSalary(gsis) + '</td>' +
            '</tr>' +
            '<tr class="calc-breakdown-table__row calc-breakdown-table__row--deduct">' +
              '<td>Pag-IBIG (2%)</td>' +
              '<td>− ₱' + formatSalary(pagibig) + '</td>' +
            '</tr>' +
            '<tr class="calc-breakdown-table__row calc-breakdown-table__row--deduct">' +
              '<td>PhilHealth (2.5%)</td>' +
              '<td>− ₱' + formatSalary(philhealth) + '</td>' +
            '</tr>' +
            (tax > 0
              ? '<tr class="calc-breakdown-table__row calc-breakdown-table__row--deduct">' +
                  '<td>Withholding Tax (est.)</td>' +
                  '<td>− ₱' + formatSalary(tax) + '</td>' +
                '</tr>'
              : '') +
            '<tr class="calc-breakdown-table__row calc-breakdown-table__row--total">' +
              '<td><strong>Estimated Take-Home Pay</strong></td>' +
              '<td><strong>₱' + formatSalary(takeHome) + '</strong></td>' +
            '</tr>' +
          '</tbody>' +
        '</table>' +
        '<p class="calc-result__note">' +
          '* Estimates only. Actual deductions may vary by agency and personal circumstances.' +
        '</p>' +
      '</div>' +

      // Step progression for this SG
      '<div class="calc-result__steps">' +
        '<h4 class="calc-result__steps-title">' +
          'All Steps for SG ' + sg +
          ' <span style="font-weight:400;font-size:.85em;opacity:.7">' +
            '(+3% per step)' +
          '</span>' +
        '</h4>' +
        '<div class="calc-steps-grid">' +
          allSteps.map(function (s) {
            return '<div class="calc-step' +
              (s.step === step ? ' calc-step--current' : '') + '">' +
              '<span class="calc-step__label">Step ' + s.step + '</span>' +
              '<span class="calc-step__amount">₱' + formatSalary(s.amount) + '</span>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</div>';

    container.style.display = '';
  }

  /* ----------------------------------------------------------
     ESTIMATE WITHHOLDING TAX (BIR 2023+ rates)
     Simplified bracket calculation.
  ---------------------------------------------------------- */
  function estimateWithholdingTax(monthlyBasic) {
    const annual = monthlyBasic * 12;

    // BIR graduated rates (simplified)
    let annualTax = 0;

    if      (annual <= 250000)  annualTax = 0;
    else if (annual <= 400000)  annualTax = (annual - 250000) * 0.15;
    else if (annual <= 800000)  annualTax = 22500  + (annual - 400000) * 0.20;
    else if (annual <= 2000000) annualTax = 102500 + (annual - 800000) * 0.25;
    else if (annual <= 8000000) annualTax = 402500 + (annual - 2000000) * 0.30;
    else                        annualTax = 2202500+ (annual - 8000000) * 0.35;

    return Math.round(annualTax / 12);
  }


  /* ============================================================
     POSITION SEARCH
     Allows users to look up a job title and find its SG.
     ============================================================ */

  function initPositionSearch() {
    const input     = document.getElementById(SEARCH_INPUT_ID);
    const resultsEl = document.getElementById(RESULTS_ID);

    if (!input || !resultsEl) return;

    input.addEventListener('input', function () {
      clearTimeout(state.searchTimer);
      const query = this.value.trim();

      if (!query || query.length < 2) {
        resultsEl.innerHTML = '';
        resultsEl.style.display = 'none';
        return;
      }

      state.searchTimer = setTimeout(function () {
        searchPositions(query, resultsEl);
      }, 250);
    });

    // Close on click outside
    document.addEventListener('click', function (e) {
      if (!input.contains(e.target) && !resultsEl.contains(e.target)) {
        resultsEl.style.display = 'none';
      }
    });
  }

  function searchPositions(query, resultsEl) {
    const q       = query.toLowerCase();
    const matches = state.positions.filter(function (pos) {
      return pos.title.toLowerCase().includes(q);
    }).slice(0, 8);

    if (!matches.length) {
      resultsEl.innerHTML =
        '<div class="sg-search-empty">' +
          'No positions found for "' + escapeHtml(query) + '"' +
        '</div>';
      resultsEl.style.display = 'block';
      return;
    }

    resultsEl.innerHTML = matches.map(function (pos) {
      return '<a href="#sg-' + pos.sg + '"' +
          ' class="sg-search-result"' +
          ' data-sg="' + pos.sg + '">' +
          '<span class="sg-search-result__title">' +
            escapeHtml(pos.title) +
          '</span>' +
          '<span class="sg-search-result__sg">SG ' + pos.sg + '</span>' +
          '<span class="sg-search-result__salary">' +
            getSalaryForSG(pos.sg) +
          '</span>' +
        '</a>';
    }).join('');

    resultsEl.style.display = 'block';

    // Bind result clicks
    resultsEl.querySelectorAll('.sg-search-result').forEach(function (item) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        const sg = item.getAttribute('data-sg');
        scrollToSG('sg-' + sg);
        resultsEl.style.display = 'none';

        const input = document.getElementById(SEARCH_INPUT_ID);
        if (input) input.value = '';
      });
    });
  }

  function getSalaryForSG(sg) {
    const grade = state.grades.find(function (g) { return g.sg === sg; });
    if (!grade || !grade.step1) return '';
    return '₱' + formatSalary(grade.step1) + '/mo';
  }


  /* ============================================================
     SG GROUP CARDS
     Overview cards (SG1-5, SG6-10...) at top of page.
     ============================================================ */

  function buildSGGroupCards(grades) {
    const container = document.querySelector('[data-sg-groups]');
    if (!container) return;

    const groups = [
      { range: [1,5],   label: 'SG 1–5',   edu: 'High School Graduate',     color: 'var(--color-success)'  },
      { range: [6,10],  label: 'SG 6–10',  edu: 'Vocational / Some College', color: 'var(--color-info)'     },
      { range: [11,15], label: 'SG 11–15', edu: 'Bachelor\'s Degree',        color: 'var(--color-primary)'  },
      { range: [16,20], label: 'SG 16–20', edu: 'Licensed Professional',     color: 'var(--sector-ofw-color)'},
      { range: [21,26], label: 'SG 21–26', edu: 'Supervisory / Managerial',  color: 'var(--color-warning)'  },
      { range: [27,33], label: 'SG 27–33', edu: 'Executive / Director',      color: 'var(--color-accent)'   }
    ];

    container.innerHTML = groups.map(function (group) {
      const groupGrades = grades.filter(function (g) {
        return g.sg >= group.range[0] && g.sg <= group.range[1];
      });

      const minSalary = groupGrades.length
        ? Math.min.apply(null, groupGrades.map(function (g) { return g.step1 || 0; }))
        : 0;

      const maxSalary = groupGrades.length
        ? Math.max.apply(null, groupGrades.map(function (g) { return g.step1 || 0; }))
        : 0;

      return '<a href="#sg-' + group.range[0] + '"' +
        ' class="card sg-card reveal"' +
        ' style="border-top:3px solid ' + group.color + ';">' +
        '<div class="sg-card__range">' + escapeHtml(group.label) + '</div>' +
        '<div class="sg-card__label">Salary Grade</div>' +
        '<div class="sg-card__salary">' +
          '₱' + formatSalary(minSalary) + ' – ₱' + formatSalary(maxSalary) +
        '</div>' +
        '<div class="sg-card__edu">' + escapeHtml(group.edu) + '</div>' +
      '</a>';
    }).join('');

    // Reveal
    requestAnimationFrame(function () {
      container.querySelectorAll('.reveal').forEach(function (el, i) {
        setTimeout(function () { el.classList.add('revealed'); }, i * 80);
      });
    });
  }


  /* ============================================================
     SCHEMA.ORG
     ============================================================ */

  function injectSchema(grades) {
    const existing = document.getElementById('sg-schema');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.type        = 'application/ld+json';
    script.id          = 'sg-schema';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type':    'WebPage',
      'name':     'Philippine Government Salary Grade Table 2026',
      'url':      window.location.href,
      'description':
        'Complete Philippine Government Salary Grade (SG) table for 2026. ' +
        'Shows monthly salary for all 33 grades across 8 steps. ' +
        'Includes salary calculator and position lookup.',
      'dateModified': new Date().toISOString().split('T')[0]
    });

    document.head.appendChild(script);
  }


  /* ============================================================
     STYLES
     ============================================================ */

  function injectStyles() {
    if (document.getElementById('sg-styles')) return;

    const style = document.createElement('style');
    style.id    = 'sg-styles';
    style.textContent = `

      /* Full SG table */
      .sg-full-table {
        width:           100%;
        border-collapse: collapse;
        font-size:       var(--text-sm);
      }

      .sg-full-table thead th {
        background:    var(--color-primary);
        color:         white;
        padding:       var(--space-3) var(--space-4);
        text-align:    center;
        font-weight:   var(--font-semibold);
        white-space:   nowrap;
        position:      sticky;
        top:           calc(var(--header-height, 64px));
        z-index:       var(--z-raised, 10);
      }

      .sg-full-table thead th:first-child {
        text-align: left;
        border-radius: var(--radius-md) 0 0 0;
      }

      .sg-full-table thead th:last-child {
        border-radius: 0 var(--radius-md) 0 0;
      }

      .sg-row {
        border-bottom:  1px solid var(--border-color);
        transition:     background var(--transition-fast);
      }

      .sg-row:hover { background: var(--bg-surface-2); }

      .sg-row:nth-child(even) { background: var(--bg-surface-2); }
      .sg-row:nth-child(even):hover { background: var(--bg-surface-3); }

      .sg-row--highlight {
        background: rgba(22,72,150,0.12) !important;
        animation:  skeleton-pulse 0.5s ease 3;
      }

      .sg-row__number {
        padding:     var(--space-3) var(--space-4);
        font-weight: var(--font-bold);
        white-space: nowrap;
      }

      .sg-anchor {
        color:           var(--color-primary);
        text-decoration: none;
        font-size:       var(--text-sm);
      }

      html.dark .sg-anchor { color: var(--text-link); }

      .sg-anchor:hover { text-decoration: underline; }

      .sg-row__salary {
        padding:    var(--space-3) var(--space-4);
        text-align: center;
        cursor:     pointer;
        white-space:nowrap;
        transition: all var(--transition-fast);
      }

      .sg-row__salary:hover {
        background: rgba(22,72,150,0.1);
        color:      var(--color-primary);
      }

      .sg-row__salary--step1 {
        font-weight: var(--font-semibold);
      }

      .sg-row__salary--selected {
        background: var(--color-primary) !important;
        color:      white !important;
        font-weight:var(--font-bold);
      }

      /* Calculator result */
      [data-calc-result] {
        display:       none;
        margin-top:    var(--space-6);
        background:    var(--bg-surface);
        border:        1px solid var(--border-color);
        border-radius: var(--radius-xl);
        overflow:      hidden;
      }

      .calc-result__headline {
        background:  var(--color-primary);
        color:       white;
        padding:     var(--space-5) var(--space-6);
        text-align:  center;
      }

      .calc-result__sg {
        font-size:   var(--text-sm);
        opacity:     0.85;
        margin-bottom: var(--space-1);
      }

      .calc-result__salary {
        font-size:   var(--text-3xl);
        font-weight: var(--font-bold);
        line-height: 1;
      }

      .calc-result__position {
        font-size:  var(--text-sm);
        opacity:    0.8;
        margin-top: var(--space-2);
      }

      .calc-result__breakdown,
      .calc-result__steps {
        padding: var(--space-5) var(--space-6);
      }

      .calc-result__breakdown {
        border-bottom: 1px solid var(--border-color);
      }

      .calc-result__breakdown-title,
      .calc-result__steps-title {
        font-size:     var(--text-base);
        font-weight:   var(--font-bold);
        margin-bottom: var(--space-4);
        color:         var(--text-primary);
      }

      .calc-breakdown-table {
        width:      100%;
        font-size:  var(--text-sm);
      }

      .calc-breakdown-table__row td {
        padding:       var(--space-2) var(--space-3);
        border-bottom: 1px solid var(--border-color);
      }

      .calc-breakdown-table__row td:last-child {
        text-align:  right;
        font-weight: var(--font-medium);
      }

      .calc-breakdown-table__row--deduct td {
        color: var(--color-accent);
      }

      .calc-breakdown-table__row--total td {
        background:  var(--bg-surface-2);
        font-weight: var(--font-bold);
        color:       var(--color-success);
        font-size:   var(--text-base);
        border-top:  2px solid var(--border-color);
      }

      .calc-result__note {
        font-size:  var(--text-xs);
        color:      var(--text-muted);
        margin-top: var(--space-3);
      }

      /* Steps grid */
      .calc-steps-grid {
        display:               grid;
        grid-template-columns: repeat(4, 1fr);
        gap:                   var(--space-2);
      }

      @media (min-width: 640px) {
        .calc-steps-grid { grid-template-columns: repeat(8, 1fr); }
      }

      .calc-step {
        text-align:    center;
        padding:       var(--space-2);
        background:    var(--bg-surface-2);
        border-radius: var(--radius-md);
        font-size:     var(--text-xs);
      }

      .calc-step--current {
        background:   var(--color-primary);
        color:        white;
        font-weight:  var(--font-bold);
      }

      .calc-step__label {
        display:    block;
        opacity:    0.7;
        font-size:  10px;
      }

      .calc-step__amount {
        display:     block;
        font-weight: var(--font-semibold);
        margin-top:  2px;
      }

      /* Position search */
      #${RESULTS_ID} {
        position:      absolute;
        z-index:       var(--z-dropdown, 100);
        background:    var(--bg-surface);
        border:        1px solid var(--border-color);
        border-radius: var(--radius-lg);
        box-shadow:    var(--shadow-xl);
        max-height:    280px;
        overflow-y:    auto;
        display:       none;
        width:         100%;
        top:           calc(100% + 4px);
        left:          0;
      }

      .sg-search-result {
        display:         flex;
        align-items:     center;
        gap:             var(--space-3);
        padding:         var(--space-3) var(--space-4);
        text-decoration: none;
        color:           inherit;
        border-bottom:   1px solid var(--border-color);
        transition:      background var(--transition-fast);
      }

      .sg-search-result:hover { background: var(--bg-surface-2); }
      .sg-search-result:last-child { border-bottom: none; }

      .sg-search-result__title {
        flex:      1;
        font-size: var(--text-sm);
        color:     var(--text-primary);
      }

      .sg-search-result__sg {
        font-size:   var(--text-xs);
        font-weight: var(--font-bold);
        color:       var(--color-primary);
        white-space: nowrap;
      }

      html.dark .sg-search-result__sg { color: var(--text-link); }

      .sg-search-result__salary {
        font-size:   var(--text-xs);
        color:       var(--color-success);
        font-weight: var(--font-semibold);
        white-space: nowrap;
      }

      .sg-search-empty {
        padding:   var(--space-4);
        font-size: var(--text-sm);
        color:     var(--text-muted);
        text-align:center;
      }

    `;

    document.head.appendChild(style);
  }


  /* ============================================================
     HELPERS
     ============================================================ */

  function formatSalary(num) {
    if (!num) return '0';
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


  /* ============================================================
     MAIN INIT
     ============================================================ */

  function init() {
    injectStyles();

    loadData()
      .then(function (data) {
        buildSGGroupCards(data.grades);
        return buildSGTable(data.grades);
      })
      .then(function () {
        initEducationFilter();
        initCalculator();
        initPositionSearch();
        injectSchema(state.grades);
      })
      .catch(function (err) {
        console.error('[salary-grade.js] Failed:', err);
        const container = document.getElementById(TABLE_ID);
        if (container) {
          container.innerHTML =
            '<div class="empty-state">' +
              '<p class="empty-state__title">Could not load salary data</p>' +
              '<p class="empty-state__message">Please refresh the page.</p>' +
            '</div>';
        }
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
     window.TrabahoSalaryGrade
  ---------------------------------------------------------- */
  window.TrabahoSalaryGrade = {
    calculate:   populateCalculator,
    scrollToSG:  scrollToSG,
    getGrade:    function (sg) {
      return state.grades.find(function (g) { return g.sg === sg; });
    }
  };

}());