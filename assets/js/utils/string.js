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

  /* ── Escape Regex ────────────────────────────────────────── */
  function escapeRegex(str) {
    if (!str) return '';
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /* ── Escape Attribute ────────────────────────────────────── */
  function escapeAttr(str) {
    return escapeHtml(str);
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

  /* ── Slug To Title ───────────────────────────────────────── */
  function slugToTitle(str) {
    if (!str) return '';
    return String(str)
      .split('-')
      .map(function (w) {
        return w.charAt(0).toUpperCase() + w.slice(1);
      })
      .join(' ');
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

  /* ── Capitalise ──────────────────────────────────────────── */
  function capitalise(str) {
    if (!str) return '';
    var s = String(str);
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  }

  /* ── Title Case ──────────────────────────────────────────── */
  function toTitleCase(str) {
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

  /* ── Truncate ────────────────────────────────────────────── */
  function truncate(str, maxLength, suffix) {
    if (!str) return '';
    suffix    = suffix !== undefined ? suffix : '…';
    maxLength = maxLength || 100;
    var s     = String(str).trim();
    if (s.length <= maxLength) return s;
    var cutPoint = s.lastIndexOf(' ', maxLength - suffix.length);
    var end      = cutPoint > 0 ? cutPoint : maxLength - suffix.length;
    return s.slice(0, end).trimEnd() + suffix;
  }

  /* ── Truncate Middle ─────────────────────────────────────── */
  function truncateMiddle(str, maxLength) {
    if (!str) return '';
    var s = String(str);
    if (s.length <= maxLength) return s;
    var keep = Math.floor((maxLength - 1) / 2);
    return s.slice(0, keep) + '…' + s.slice(-keep);
  }

  /* ── Strip HTML ──────────────────────────────────────────── */
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

  /* ── Count Words ─────────────────────────────────────────── */
  function countWords(str) {
    if (!str) return 0;
    return stripHtml(str)
      .split(/\s+/)
      .filter(function (w) { return w.length > 0; })
      .length;
  }

  /* ── Normalize Spaces ────────────────────────────────────── */
  function normalizeSpaces(str) {
    if (!str) return '';
    return String(str).replace(/\s+/g, ' ').trim();
  }

  /* ── Pad Number ──────────────────────────────────────────── */
  function padNumber(num, length) {
    return String(num).padStart(length || 2, '0');
  }

  /* ── Initials ────────────────────────────────────────────── */
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

  /* ── Pluralise ───────────────────────────────────────────── */
  function pluralise(count, singular, plural) {
    var p = plural || (singular + 's');
    return formatNumber(count) + ' ' + (count === 1 ? singular : p);
  }

  /* ── Clean Phone ─────────────────────────────────────────── */
  function cleanPhone(str) {
    if (!str) return '';
    var cleaned = String(str).replace(/[^\d+]/g, '');
    if (cleaned.startsWith('09')) {
      cleaned = '+63' + cleaned.slice(1);
    }
    return cleaned;
  }

  /* ── Is External URL ─────────────────────────────────────── */
  function isExternalUrl(url) {
    if (!url) return false;
    if (url.startsWith('/') || url.startsWith('#')) return false;
    try {
      return new URL(url).hostname !== window.location.hostname;
    } catch (e) {
      return false;
    }
  }

  /* ── Build URL Params ────────────────────────────────────── */
  function buildUrlParams(params) {
    if (!params) return '';
    return Object.keys(params)
      .filter(function (k) {
        return params[k] !== '' &&
               params[k] !== null &&
               params[k] !== undefined;
      })
      .map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
      })
      .join('&');
  }

  /* ── Format Number ───────────────────────────────────────── */
  function formatNumber(num) {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return Number(num).toLocaleString('en-PH');
  }

  /* ── Format Peso ─────────────────────────────────────────── */
  function formatPeso(amount, options) {
    if (amount === null || amount === undefined) return '₱0';
    var opts = options || {};
    var num  = Number(amount);
    if (isNaN(num)) return '₱0';

    if (opts.compact) {
      if (num >= 1000000) {
        return '₱' + (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
      }
      if (num >= 1000) {
        return '₱' + (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
      }
    }

    var formatted = '₱' + formatNumber(num);
    if (opts.code)           return formatted + ' PHP';
    if (opts.symbol === false) return formatNumber(num);
    if (opts.perMonth)       return formatted + '/mo';
    if (opts.perYear)        return formatted + '/yr';
    return formatted;
  }

  /* ── Format Salary Range ─────────────────────────────────── */
  function formatSalaryRange(min, max) {
    if (!min && !max) return 'Salary not specified';
    if (!min)         return 'Up to ' + formatPeso(max);
    if (!max || min === max) return formatPeso(min);
    return formatPeso(min) + ' – ' + formatPeso(max);
  }

  /* ── Parse Salary ────────────────────────────────────────── */
  function parseSalary(str) {
    if (!str) return 0;
    if (typeof str === 'number') return str;
    var s = String(str)
      .replace(/[₱,\s]/g, '')
      .replace(/PHP/gi, '')
      .trim();
    if (/k$/i.test(s)) return parseFloat(s) * 1000;
    if (/m$/i.test(s)) return parseFloat(s) * 1000000;
    return parseFloat(s) || 0;
  }

  /* ── Search Score ────────────────────────────────────────── */
  function searchScore(job, query) {
    if (!job || !query) return 0;
    var q = String(query).toLowerCase().trim();
    if (!q) return 0;

    var score = 0;
    var title = (job.title || '').toLowerCase();

    if (title === q)              score += 100;
    else if (title.indexOf(q) === 0) score += 50;
    else if (title.indexOf(q) > -1)  score += 30;

    if (contains(job.agency || job.company, q)) score += 20;
    if (contains(job.category, q))  score += 15;
    if ((job.tags || []).some(function (t) { return contains(t, q); })) {
      score += 10;
    }
    if (contains(job.location, q))  score += 8;
    if (contains(job.sector, q))    score += 5;
    if (job.tier === 1)             score += 2;

    return score;
  }

  /* ── Contains ────────────────────────────────────────────── */
  function contains(haystack, needle) {
    if (!haystack || !needle) return false;
    return String(haystack).toLowerCase()
      .indexOf(String(needle).toLowerCase().trim()) > -1;
  }

  /* ── Highlight ───────────────────────────────────────────── */
  function highlight(text, query) {
    if (!text)  return '';
    if (!query) return escapeHtml(text);
    var escaped  = escapeHtml(String(text));
    var escapedQ = escapeRegex(String(query));
    var re       = new RegExp('(' + escapedQ + ')', 'gi');
    return escaped.replace(re, '<mark>$1</mark>');
  }

  /* ── Interpolate ─────────────────────────────────────────── */
  function interpolate(template, data) {
    if (!template) return '';
    if (!data)     return template;
    return String(template).replace(/\{\{([^}]+)\}\}/g, function (match, key) {
      var value = data[key.trim()];
      if (value === undefined || value === null) return match;
      return escapeHtml(String(value));
    });
  }

  /* ── Interpolate Raw ─────────────────────────────────────── */
  function interpolateRaw(template, data) {
    if (!template) return '';
    if (!data)     return template;
    return String(template).replace(/\{\{([^}]+)\}\}/g, function (match, key) {
      var value = data[key.trim()];
      if (value === undefined || value === null) return match;
      return String(value);
    });
  }

  /* ── Build Job Meta Description ──────────────────────────── */
  function buildJobMetaDescription(job) {
    if (!job) return '';
    var parts = [job.title];
    if (job.agency || job.company) {
      parts.push('at ' + (job.agency || job.company));
    }
    if (job.location) parts.push('in ' + job.location);
    var salary = job.salaryAmount || job.salaryRange;
    if (salary)       parts.push('· ₱' + salary);
    parts.push('· Apply now on TrabahoWatch');
    return truncate(parts.join(' '), 155);
  }

  /* ── Build Job Page Title ────────────────────────────────── */
  function buildJobPageTitle(job) {
    if (!job) return 'TrabahoWatch — Philippine Job Information';
    var parts = [job.title];
    if (job.agency || job.company) {
      parts.push(job.agency || job.company);
    }
    parts.push('TrabahoWatch');
    return parts.join(' — ');
  }

  /* ── Expose globally ─────────────────────────────────────── */
  window.TrabahoString = {
    escape:          escapeHtml,
    escapeHtml:      escapeHtml,
    escapeAttr:      escapeAttr,
    escapeRegex:     escapeRegex,
    esc:             escapeHtml,
    toSlug:          toSlug,
    slugToTitle:     slugToTitle,
    buildJobId:      buildJobId,
    isExternal:      isExternalUrl,
    buildParams:     buildUrlParams,
    capitalise:      capitalise,
    titleCase:       toTitleCase,
    truncate:        truncate,
    truncateMiddle:  truncateMiddle,
    stripHtml:       stripHtml,
    countWords:      countWords,
    normalizeSpaces: normalizeSpaces,
    padNumber:       padNumber,
    initials:        initials,
    pluralise:       pluralise,
    cleanPhone:      cleanPhone,
    highlight:       highlight,
    contains:        contains,
    searchScore:     searchScore,
    formatNumber:    formatNumber,
    formatPeso:      formatPeso,
    formatRange:     formatSalaryRange,
    parseSalary:     parseSalary,
    interpolate:     interpolate,
    interpolateRaw:  interpolateRaw,
    buildMetaDesc:   buildJobMetaDescription,
    buildPageTitle:  buildJobPageTitle
  };

}());
