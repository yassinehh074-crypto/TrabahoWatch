/* ============================================================
   ASSETS/JS/UTILS/STRING.JS — String utilities
   TrabahoWatch v1.0
   ============================================================ */

'use strict';

(function () {

  /* ── Escape HTML ─────────────────────────────────────────── */
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ── To Slug ─────────────────────────────────────────────── */
  function toSlug(str) {
    if (!str) return '';
    return String(str)
      .toLowerCase()
      .trim()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ñ]/g, 'n')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /* ── Build Job ID ────────────────────────────────────────── */
  function buildJobId(title, agency, region, year) {
    var parts = [
      toSlug(title   || ''),
      toSlug(agency  || ''),
      toSlug(region  || ''),
      String(year || new Date().getFullYear())
    ].filter(Boolean);
    return parts.join('-');
  }

  /* ── Format Peso ─────────────────────────────────────────── */
  function formatPeso(amount, options) {
    if (amount === null || amount === undefined) return '';
    options = options || {};

    var num = Number(amount);
    if (isNaN(num)) return '';

    var formatted = '₱' + num.toLocaleString('en-PH', {
      minimumFractionDigits: options.decimals || 0,
      maximumFractionDigits: options.decimals || 0
    });

    if (options.perMonth) formatted += '/mo';
    if (options.perYear)  formatted += '/yr';

    return formatted;
  }

  /* ── Format Salary Range ─────────────────────────────────── */
  function formatSalaryRange(min, max, options) {
    if (!min && !max) return '';
    if (!max || min === max) return formatPeso(min, options);
    return formatPeso(min, options) + '–' + formatPeso(max, options);
  }

  /* ── Truncate ────────────────────────────────────────────── */
  function truncate(str, maxLength, suffix) {
    if (!str) return '';
    suffix = suffix !== undefined ? suffix : '…';
    maxLength = maxLength || 100;
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - suffix.length).trimEnd() + suffix;
  }

  /* ── Title Case ──────────────────────────────────────────── */
  function titleCase(str) {
    if (!str) return '';
    var small = ['a','an','the','and','but','or','for','nor',
                 'on','at','to','by','in','of','up','as'];
    return String(str)
      .toLowerCase()
      .split(' ')
      .map(function (word, i) {
        if (i === 0 || small.indexOf(word) === -1) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word;
      })
      .join(' ');
  }

  /* ── Search Score ────────────────────────────────────────── */
  function searchScore(query, text) {
    if (!query || !text) return 0;
    var q = query.toLowerCase().trim();
    var t = text.toLowerCase();

    if (t === q) return 100;
    if (t.startsWith(q)) return 80;
    if (t.includes(' ' + q)) return 60;
    if (t.includes(q)) return 40;

    /* Partial word match */
    var words = q.split(/\s+/);
    var matchCount = words.filter(function (w) {
      return t.includes(w);
    }).length;

    return Math.round((matchCount / words.length) * 30);
  }

  /* ── Strip HTML ──────────────────────────────────────────── */
  function stripHtml(str) {
    if (!str) return '';
    return String(str).replace(/<[^>]*>/g, '').trim();
  }

  /* ── Pluralize ───────────────────────────────────────────── */
  function pluralize(count, singular, plural) {
    plural = plural !== undefined ? plural : singular + 's';
    return count === 1 ? singular : plural;
  }

  /* ── Highlight Query in Text ─────────────────────────────── */
  function highlightQuery(text, query) {
    if (!query || !text) return escapeHtml(text);
    var escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var regex   = new RegExp('(' + escaped + ')', 'gi');
    return escapeHtml(text).replace(
      regex,
      '<mark style="background:rgba(22,72,150,0.15);' +
      'color:inherit;border-radius:2px;">$1</mark>'
    );
  }

  /* ── Expose globally ─────────────────────────────────────── */
  window.TrabahoString = {
    escapeHtml:        escapeHtml,
    toSlug:            toSlug,
    buildJobId:        buildJobId,
    formatPeso:        formatPeso,
    formatSalaryRange: formatSalaryRange,
    truncate:          truncate,
    titleCase:         titleCase,
    searchScore:       searchScore,
    stripHtml:         stripHtml,
    pluralize:         pluralize,
    highlightQuery:    highlightQuery,
    esc:               escapeHtml  /* alias */
  };

}());h, suffix) {
    if (!str) return '';
    if (suffix === undefined) suffix = '…';
    const s = String(str).trim();
    if (s.length <= maxLength) return s;

    // Find last space before maxLength
    const cutPoint = s.lastIndexOf(' ', maxLength - suffix.length);
    const end      = cutPoint > 0 ? cutPoint : maxLength - suffix.length;

    return s.slice(0, end).trimEnd() + suffix;
  }


  /* ----------------------------------------------------------
     TRUNCATE MIDDLE
     Keeps start and end of string, cuts middle.
     Used for long URLs.

     Example:
       truncateMiddle("https://www.deped.gov.ph/jobs/2026/teacher", 30)
       → "https://www.deped…teacher"
  ---------------------------------------------------------- */
  function truncateMiddle(str, maxLength) {
    if (!str) return '';
    const s = String(str);
    if (s.length <= maxLength) return s;

    const keep  = Math.floor((maxLength - 1) / 2);
    return s.slice(0, keep) + '…' + s.slice(-keep);
  }


  /* ----------------------------------------------------------
     STRIP HTML
     Removes all HTML tags from a string.
     Used when displaying content in meta tags.
  ---------------------------------------------------------- */
  function stripHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/<[^>]*>/g, '')
      .replace(/&amp;/g,  '&')
      .replace(/&lt;/g,   '<')
      .replace(/&gt;/g,   '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g,    ' ')
      .trim();
  }


  /* ----------------------------------------------------------
     COUNT WORDS
  ---------------------------------------------------------- */
  function countWords(str) {
    if (!str) return 0;
    return stripHtml(str)
      .split(/\s+/)
      .filter(function (w) { return w.length > 0; })
      .length;
  }


  /* ----------------------------------------------------------
     NORMALIZE WHITESPACE
     Collapses multiple spaces/newlines into single space.
  ---------------------------------------------------------- */
  function normalizeSpaces(str) {
    if (!str) return '';
    return String(str).replace(/\s+/g, ' ').trim();
  }


  /* ----------------------------------------------------------
     PAD NUMBER
     Left-pads a number with zeros.
     Example: padNumber(5, 2) → "05"
  ---------------------------------------------------------- */
  function padNumber(num, length) {
    return String(num).padStart(length || 2, '0');
  }


  /* ============================================================
     SEARCH & HIGHLIGHT
     ============================================================ */

  /* ----------------------------------------------------------
     HIGHLIGHT
     Wraps matching query text in <mark> tags.
     Safe — escapes input before highlighting.

     Example:
       highlight("Teacher I", "teach")
       → "Teacher I" with "Teach" wrapped in <mark>
  ---------------------------------------------------------- */
  function highlight(text, query) {
    if (!text  || text  === undefined) return '';
    if (!query || query === undefined) return escapeHtml(text);

    const escaped   = escapeHtml(String(text));
    const escapedQ  = escapeRegex(String(query));
    const re        = new RegExp('(' + escapedQ + ')', 'gi');

    return escaped.replace(re, '<mark>$1</mark>');
  }


  /* ----------------------------------------------------------
     CONTAINS (case-insensitive)
     Returns true if haystack contains needle.
  ---------------------------------------------------------- */
  function contains(haystack, needle) {
    if (!haystack || !needle) return false;
    return String(haystack).toLowerCase()
      .includes(String(needle).toLowerCase().trim());
  }


  /* ----------------------------------------------------------
     SEARCH SCORE
     Returns a relevance score for a job against a query.
     Higher = more relevant.
     Returns 0 if no match.
  ---------------------------------------------------------- */
  function searchScore(job, query) {
    if (!job || !query) return 0;

    const q = String(query).toLowerCase().trim();
    if (!q) return 0;

    let score = 0;

    // Title — highest weight
    const title = (job.title || '').toLowerCase();
    if (title === q)              score += 100;
    else if (title.startsWith(q)) score += 50;
    else if (title.includes(q))   score += 30;

    // Agency/company
    if (contains(job.agency || job.company, q)) score += 20;

    // Category
    if (contains(job.category, q))  score += 15;

    // Tags
    if ((job.tags || []).some(function (t) { return contains(t, q); })) {
      score += 10;
    }

    // Location
    if (contains(job.location, q))  score += 8;

    // Sector
    if (contains(job.sector, q))    score += 5;

    // Tier 1 boost
    if (job.tier === 1) score += 2;

    return score;
  }


  /* ============================================================
     NUMBER FORMATTING
     ============================================================ */

  /* ----------------------------------------------------------
     FORMAT NUMBER
     Adds thousand separators for Philippine locale.
     Example: 31705 → "31,705"
  ---------------------------------------------------------- */
  function formatNumber(num) {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return Number(num).toLocaleString('en-PH');
  }


  /* ----------------------------------------------------------
     FORMAT PESO
     Formats a number as Philippine Peso.

     Options:
       symbol:  true  → "₱31,705"   (default)
       symbol:  false → "31,705"
       code:    true  → "₱31,705 PHP"
       compact: true  → "₱31.7K"

     Examples:
       formatPeso(31705)              → "₱31,705"
       formatPeso(31705, {code:true}) → "₱31,705 PHP"
       formatPeso(1200000, {compact}) → "₱1.2M"
  ---------------------------------------------------------- */
  function formatPeso(amount, options) {
    if (amount === null || amount === undefined) return '₱0';

    const opts    = options || {};
    const num     = Number(amount);

    if (isNaN(num)) return '₱0';

    // Compact format for large numbers
    if (opts.compact) {
      if (num >= 1000000) {
        return '₱' + (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
      }
      if (num >= 1000) {
        return '₱' + (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
      }
    }

    const formatted = '₱' + formatNumber(num);
    if (opts.code) return formatted + ' PHP';
    if (opts.symbol === false) return formatNumber(num);
    return formatted;
  }


  /* ----------------------------------------------------------
     FORMAT SALARY RANGE
     Formats a salary range string from min/max.

     Example:
       formatSalaryRange(31705, 33611)
       → "₱31,705 – ₱33,611"
  ---------------------------------------------------------- */
  function formatSalaryRange(min, max) {
    if (!min && !max) return 'Salary not specified';
    if (!min)         return 'Up to ' + formatPeso(max);
    if (!max || min === max) return formatPeso(min);
    return formatPeso(min) + ' – ' + formatPeso(max);
  }


  /* ----------------------------------------------------------
     PARSE SALARY
     Extracts a numeric value from a salary string.

     Examples:
       parseSalary("₱31,705")       → 31705
       parseSalary("31,705 PHP")    → 31705
       parseSalary("31705")         → 31705
       parseSalary("₱31K")          → 31000
  ---------------------------------------------------------- */
  function parseSalary(str) {
    if (!str) return 0;
    if (typeof str === 'number') return str;

    let s = String(str)
      .replace(/[₱,\s]/g, '')   // remove peso sign, commas, spaces
      .replace(/PHP/gi, '')      // remove currency code
      .trim();

    // Handle K/M suffix
    if (/k$/i.test(s)) {
      return parseFloat(s) * 1000;
    }
    if (/m$/i.test(s)) {
      return parseFloat(s) * 1000000;
    }

    return parseFloat(s) || 0;
  }


  /* ============================================================
     TEMPLATE INTERPOLATION
     ============================================================ */

  /* ----------------------------------------------------------
     INTERPOLATE
     Replaces {{TOKEN}} placeholders in a template string.
     Used for n8n template generation.

     Example:
       interpolate("Hello {{NAME}}!", { NAME: "Juan" })
       → "Hello Juan!"
  ---------------------------------------------------------- */
  function interpolate(template, data) {
    if (!template) return '';
    if (!data)     return template;

    return String(template).replace(/\{\{([^}]+)\}\}/g, function (match, key) {
      const trimmed = key.trim();
      const value   = data[trimmed];
      if (value === undefined || value === null) return match; // keep token if no data
      return escapeHtml(String(value));
    });
  }


  /* ----------------------------------------------------------
     INTERPOLATE RAW
     Same as interpolate() but does NOT escape HTML.
     Use only for trusted data (internal JSON, not user input).
  ---------------------------------------------------------- */
  function interpolateRaw(template, data) {
    if (!template) return '';
    if (!data)     return template;

    return String(template).replace(/\{\{([^}]+)\}\}/g, function (match, key) {
      const trimmed = key.trim();
      const value   = data[trimmed];
      if (value === undefined || value === null) return match;
      return String(value);
    });
  }


  /* ============================================================
     TAGLINE / META HELPERS
     ============================================================ */

  /* ----------------------------------------------------------
     BUILD JOB META DESCRIPTION
     Generates a concise meta description from a job object.
     Max 160 chars for SEO.
  ---------------------------------------------------------- */
  function buildJobMetaDescription(job) {
    if (!job) return '';

    const parts = [job.title];
    if (job.agency || job.company) {
      parts.push('at ' + (job.agency || job.company));
    }
    if (job.location) parts.push('in ' + job.location);

    const salary = job.salaryAmount || job.salaryRange;
    if (salary)   parts.push('· ₱' + salary);

    parts.push('· Apply now on TrabahoWatch');

    return truncate(parts.join(' '), 155);
  }


  /* ----------------------------------------------------------
     BUILD JOB PAGE TITLE
     Generates `<title>` tag content for article pages.
  ---------------------------------------------------------- */
  function buildJobPageTitle(job) {
    if (!job) return 'TrabahoWatch — Philippine Job Information';

    const parts = [job.title];
    if (job.agency || job.company) {
      parts.push(job.agency || job.company);
    }
    parts.push('TrabahoWatch');

    return parts.join(' — ');
  }


  /* ----------------------------------------------------------
     PLURALISE
     Returns singular or plural form.
     Simple English rules — no library needed.

     Examples:
       pluralise(1,  'job')  → "1 job"
       pluralise(5,  'job')  → "5 jobs"
       pluralise(2,  'category', 'categories') → "2 categories"
  ---------------------------------------------------------- */
  function pluralise(count, singular, plural) {
    const p = plural || (singular + 's');
    return formatNumber(count) + ' ' + (count === 1 ? singular : p);
  }


  /* ----------------------------------------------------------
     INITIALS
     Returns initials from a name string.
     Example: "Department of Education" → "DE"
  ---------------------------------------------------------- */
  function initials(str, max) {
    if (!str) return '';
    max = max || 2;
    return String(str)
      .split(/\s+/)
      .filter(function (w) { return w.length > 0; })
      .slice(0, max)
      .map(function (w) { return w[0].toUpperCase(); })
      .join('');
  }


  /* ----------------------------------------------------------
     CLEAN PHONE
     Normalizes Philippine phone numbers.
     Example: "+63 917 123 4567" → "+639171234567"
  ---------------------------------------------------------- */
  function cleanPhone(str) {
    if (!str) return '';
    let cleaned = String(str).replace(/[^\d+]/g, '');
    // Convert local 09xx to international +639xx
    if (cleaned.startsWith('09')) {
      cleaned = '+63' + cleaned.slice(1);
    }
    return cleaned;
  }


  /* ----------------------------------------------------------
     IS EXTERNAL URL
     Returns true if URL is external (not same origin).
  ---------------------------------------------------------- */
  function isExternalUrl(url) {
    if (!url) return false;
    if (url.startsWith('/') || url.startsWith('#')) return false;
    try {
      return new URL(url).hostname !== window.location.hostname;
    } catch (e) {
      return false;
    }
  }


  /* ----------------------------------------------------------
     BUILD URL PARAMS
     Converts an object to URL query string.

     Example:
       buildUrlParams({ q: 'nurse', sector: 'government' })
       → "q=nurse&sector=government"
  ---------------------------------------------------------- */
  function buildUrlParams(params) {
    if (!params) return '';
    return Object.entries(params)
      .filter(function (e) {
        return e[1] !== '' && e[1] !== null && e[1] !== undefined;
      })
      .map(function (e) {
        return encodeURIComponent(e[0]) + '=' + encodeURIComponent(e[1]);
      })
      .join('&');
  }


  /* ============================================================
     PUBLIC API
     window.TrabahoString

     Usage:
       TrabahoString.escape('<script>')
       → "&lt;script&gt;"

       TrabahoString.toSlug('Teacher I')
       → "teacher-i"

       TrabahoString.formatPeso(31705)
       → "₱31,705"

       TrabahoString.truncate('Department of Education', 20)
       → "Department of…"

       TrabahoString.highlight('Teacher I', 'teach')
       → 'T<mark>each</mark>er I' (via escapeHtml first)

       TrabahoString.searchScore(job, 'nurse')
       → 30

       TrabahoString.interpolate('Hello {{NAME}}!', { NAME: 'Juan' })
       → 'Hello Juan!'
   ============================================================ */
  window.TrabahoString = {

    // Security
    escape:         escapeHtml,
    escapeAttr:     escapeAttr,
    escapeRegex:    escapeRegex,

    // Slug / URL
    toSlug:         toSlug,
    buildJobId:     buildJobId,
    slugToTitle:    slugToTitle,
    isExternal:     isExternalUrl,
    buildParams:    buildUrlParams,

    // Text manipulation
    capitalise:     capitalise,
    titleCase:      toTitleCase,
    truncate:       truncate,
    truncateMiddle: truncateMiddle,
    stripHtml:      stripHtml,
    countWords:     countWords,
    normalizeSpaces:normalizeSpaces,
    padNumber:      padNumber,
    initials:       initials,
    pluralise:      pluralise,
    cleanPhone:     cleanPhone,

    // Search
    highlight:      highlight,
    contains:       contains,
    searchScore:    searchScore,

    // Numbers / money
    formatNumber:   formatNumber,
    formatPeso:     formatPeso,
    formatRange:    formatSalaryRange,
    parseSalary:    parseSalary,

    // Templates
    interpolate:    interpolate,
    interpolateRaw: interpolateRaw,

    // Meta / SEO
    buildMetaDesc:  buildJobMetaDescription,
    buildPageTitle: buildJobPageTitle

  };

}());