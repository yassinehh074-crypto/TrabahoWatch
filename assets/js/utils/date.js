/* ============================================================
   ASSETS/JS/UTILS/DATE.JS — Date and time utilities
   All dates treated as Philippine Time (UTC+8)
   TrabahoWatch v1.0
   ============================================================ */

'use strict';

(function () {

  var PH_OFFSET_MS    = 8 * 60 * 60 * 1000; /* UTC+8 */
  var URGENT_DAYS     = 7;
  var SOON_DAYS       = 30;
  var WORDS_PER_MINUTE = 200;

  /* ── Get current time in PHT ─────────────────────────────── */
  function nowPH() {
    return new Date(Date.now() + PH_OFFSET_MS);
  }

  /* ── Parse a date string ─────────────────────────────────── */
  function parseDate(dateStr) {
    if (!dateStr) return null;
    if (dateStr instanceof Date) {
      return isNaN(dateStr.getTime()) ? null : dateStr;
    }
    var d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  }

  /* ── Parse PH-localized date (alias) ─────────────────────── */
  function parsePHDate(dateStr) {
    return parseDate(dateStr);
  }

  /* ── Format: "Aug 16, 2026" ───────────────────────────────── */
  function formatDateShort(input) {
    var d = parseDate(input);
    if (!d) return '';
    return d.toLocaleDateString('en-PH', {
      month: 'short',
      day:   'numeric',
      year:  'numeric'
    });
  }

  /* ── Format: "August 16, 2026" ───────────────────────────── */
  function formatDateLong(input) {
    var d = parseDate(input);
    if (!d) return '';
    return d.toLocaleDateString('en-PH', {
      year:  'numeric',
      month: 'long',
      day:   'numeric'
    });
  }

  /* ── Format generic (alias for short) ────────────────────── */
  function formatDate(input) {
    return formatDateShort(input);
  }

  /* ── Format: "August 2026" ───────────────────────────────── */
  function formatMonthYear(input) {
    var d = parseDate(input);
    if (!d) return '';
    return d.toLocaleDateString('en-PH', {
      month: 'long',
      year:  'numeric'
    });
  }

  /* ── Format: "June 30, 2026" ─────────────────────────────── */
  function formatDeadline(dateStr) {
    var d = parseDate(dateStr);
    if (!d) return '';
    return d.toLocaleDateString('en-PH', {
      year:  'numeric',
      month: 'long',
      day:   'numeric'
    });
  }

  /* ── Format: "June 30" (short) ───────────────────────────── */
  function formatDeadlineShort(dateStr) {
    var d = parseDate(dateStr);
    if (!d) return '';
    return d.toLocaleDateString('en-PH', {
      month: 'short',
      day:   'numeric'
    });
  }

  /* ── Format relative: "3 days left", "Closes today" ─────── */
  function formatRelative(dateStr) {
    var d = parseDate(dateStr);
    if (!d) return '';

    var now  = new Date();
    var diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));

    if (diff < 0)   return 'Deadline passed';
    if (diff === 0) return 'Closes today';
    if (diff === 1) return 'Closes tomorrow';
    if (diff <= 7)  return 'Closes in ' + diff + ' days';
    if (diff <= 30) return 'Closes in ' + Math.ceil(diff / 7) + ' weeks';

    return formatDeadlineShort(dateStr);
  }

  /* ── Format published date: "3 days ago" / "Posted Aug 16, 2026" ── */
  function formatPublishedDate(input) {
    var d = parseDate(input);
    if (!d) return '';

    var now   = nowPH();
    var diff  = now.getTime() - d.getTime();
    var days  = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1)    return 'Just now';
    if (hours < 24)   return hours + ' hour' + (hours !== 1 ? 's' : '') + ' ago';
    if (days === 1)   return 'Yesterday';
    if (days <= 6)    return days + ' days ago';
    if (days <= 13)   return '1 week ago';
    if (days <= 29)   return Math.ceil(days / 7) + ' weeks ago';

    return 'Posted ' + formatDateShort(d);
  }

  /* ── Format published: "Published May 12, 2026" ─────────── */
  function formatPublished(dateStr) {
    var d = parseDate(dateStr);
    if (!d) return '';
    return 'Published ' + d.toLocaleDateString('en-PH', {
      year:  'numeric',
      month: 'long',
      day:   'numeric'
    });
  }

  /* ── Format published short: "May 12" ───────────────────── */
  function formatPublishedShort(dateStr) {
    var d = parseDate(dateStr);
    if (!d) return '';
    return d.toLocaleDateString('en-PH', {
      month: 'short',
      day:   'numeric'
    });
  }

  /* ── Format time remaining (for countdown.js) ────────────── */
  function formatTimeRemaining(ms) {
    if (ms <= 0) {
      return {
        days: 0, hours: 0, minutes: 0, seconds: 0,
        totalDays: 0, totalHours: 0, totalMinutes: 0,
        isExpired: true
      };
    }

    var totalSeconds = Math.floor(ms / 1000);
    var totalMinutes = Math.floor(totalSeconds / 60);
    var totalHours   = Math.floor(totalMinutes / 60);
    var totalDays    = Math.floor(totalHours / 24);

    return {
      days:         totalDays,
      hours:        totalHours % 24,
      minutes:      totalMinutes % 60,
      seconds:      totalSeconds % 60,
      totalDays:    totalDays,
      totalHours:   totalHours,
      totalMinutes: totalMinutes,
      totalSeconds: totalSeconds,
      isExpired:    false
    };
  }

  /* ── Is expired? ─────────────────────────────────────────── */
  function isExpired(dateStr) {
    var d = parseDate(dateStr);
    if (!d) return false;
    return d < new Date();
  }

  /* ── Is deadline passed (alias) ──────────────────────────── */
  function isDeadlinePassed(input) {
    var d = parseDate(input);
    if (!d) return false;
    return d.getTime() < nowPH().getTime();
  }

  /* ── Is urgent (closing within N days)? ─────────────────── */
  function isUrgent(dateStr, days) {
    var d = parseDate(dateStr);
    if (!d) return false;
    days = days || URGENT_DAYS;
    var now  = new Date();
    var diff = (d - now) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= days;
  }

  /* ── Is deadline soon (within SOON_DAYS) ─────────────────── */
  function isDeadlineSoon(input) {
    var d = parseDate(input);
    if (!d) return false;
    var diff = d.getTime() - nowPH().getTime();
    return diff > 0 && diff < SOON_DAYS * 24 * 60 * 60 * 1000;
  }

  /* ── Days remaining ──────────────────────────────────────── */
  function daysRemaining(dateStr) {
    var d = parseDate(dateStr);
    if (!d) return null;
    var now  = new Date();
    var diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
    return diff;
  }

  /* ── Days until deadline (0 if passed, null if none) ─────── */
  function daysUntilDeadline(input) {
    var d = parseDate(input);
    if (!d) return null;
    var diff = d.getTime() - nowPH().getTime();
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  /* ── Get deadline status object ──────────────────────────── */
  function getDeadlineStatus(input) {
    if (!input) {
      return {
        status: 'open', label: 'Open', badge: 'badge--open',
        urgent: false, passed: false, text: 'Open until filled'
      };
    }

    var d = parseDate(input);
    if (!d) return getDeadlineStatus(null);

    var diff = d.getTime() - nowPH().getTime();
    var days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (diff <= 0) {
      return {
        status: 'archived', label: 'Closed', badge: 'badge--closed',
        urgent: false, passed: true, text: 'Deadline passed'
      };
    }

    if (days <= URGENT_DAYS) {
      return {
        status: 'urgent', label: 'Closing Soon', badge: 'badge--urgent',
        urgent: true, passed: false, text: formatRelative(d), days: days
      };
    }

    if (days <= SOON_DAYS) {
      return {
        status: 'soon', label: 'Open', badge: 'badge--soon',
        urgent: false, passed: false, text: formatRelative(d), days: days
      };
    }

    return {
      status: 'open', label: 'Open', badge: 'badge--open',
      urgent: false, passed: false, text: formatDeadline(d), days: days
    };
  }

  /* ── Get job status CSS class ────────────────────────────── */
  function getJobStatusClass(job) {
    if (!job) return 'job-card__status--open';
    if (job.status === 'archived') return 'job-card__status--closed';
    if (isUrgent(job.deadline)) return 'job-card__status--soon';
    return 'job-card__status--open';
  }

  /* ── Get job status label ────────────────────────────────── */
  function getJobStatusLabel(job) {
    if (!job) return 'Open';
    if (job.status === 'archived') return 'Closed';
    if (isUrgent(job.deadline)) return 'Closing Soon';
    return 'Open';
  }

  /* ── CSC Exam dates 2026 ─────────────────────────────────── */
  var CSC_EXAM_DATES = [
    {
      date:   '2026-03-15',
      label:  'March 2026 CSC PPT Exam',
      name:   'CSC PPT — March 2026',
      type:   'PPT',
      region: 'National'
    },
    {
      date:   '2026-08-16',
      label:  'August 2026 CSC PPT Exam',
      name:   'CSC PPT — August 2026',
      type:   'PPT',
      region: 'National'
    },
    {
      date:   '2026-11-29',
      label:  'November 2026 CSC PPT Exam',
      name:   'CSC PPT — November 2026',
      type:   'PPT',
      region: 'National'
    }
  ];

  /* ── Get next CSC exam ───────────────────────────────────── */
  function getNextCSCExam() {
    var now = nowPH();
    for (var i = 0; i < CSC_EXAM_DATES.length; i++) {
      var d = parseDate(CSC_EXAM_DATES[i].date);
      if (d && d > now) return CSC_EXAM_DATES[i];
    }
    return null;
  }

  /* ── Get days until next CSC exam ────────────────────────── */
  function getDaysUntilCSCExam() {
    var exam = getNextCSCExam();
    if (!exam) return null;
    return daysUntilDeadline(exam.date);
  }

  /* ── Format countdown object ─────────────────────────────── */
  function getCountdown(dateStr) {
    var d   = parseDate(dateStr);
    var now = new Date();
    if (!d) return null;

    var total = d - now;
    if (total <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    return {
      days:    Math.floor(total / (1000 * 60 * 60 * 24)),
      hours:   Math.floor((total / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((total / (1000 * 60)) % 60),
      seconds: Math.floor((total / 1000) % 60),
      expired: false
    };
  }

  /* ── Is within N days of publishing (new)? ───────────────── */
  function isNew(publishedStr, days) {
    var d = parseDate(publishedStr);
    if (!d) return false;
    days = days || 7;
    var now  = new Date();
    var diff = (now - d) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= days;
  }

  /* ── Estimate read time (minutes) ────────────────────────── */
  function estimateReadTime(job) {
    if (!job) return 3;

    if (job.readTime && !isNaN(parseInt(job.readTime, 10))) {
      return parseInt(job.readTime, 10);
    }

    var textFields = [
      job.description       || '',
      job.aboutAgency        || '',
      job.aboutCompany       || '',
      job.whyThisJobMatters  || '',
      (job.requirements || []).map(function (r) {
        return typeof r === 'string' ? r : (r.text || '');
      }).join(' '),
      (job.documentsRequired || job.documents || []).map(function (d) {
        return typeof d === 'string' ? d : (d.name || '');
      }).join(' '),
      (job.howToApply || []).map(function (s) {
        return (s.title || '') + ' ' + (s.body || '');
      }).join(' '),
      (job.careerPath || []).map(function (s) {
        return s.title || '';
      }).join(' '),
      (job.howToStandOut || []).map(function (t) {
        return (t.title || '') + ' ' + (t.body || '');
      }).join(' ')
    ].join(' ');

    var wordCount = textFields
      .replace(/<[^>]*>/g, ' ')
      .split(/\s+/)
      .filter(function (w) { return w.length > 0; })
      .length;

    var minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
    return Math.min(Math.max(minutes, 2), 15);
  }

  /* ── Sort by deadline (open first, ASC) ──────────────────── */
  function sortByDeadline(jobs) {
    return jobs.slice().sort(function (a, b) {
      var aArchived = a.status === 'archived';
      var bArchived = b.status === 'archived';
      if (aArchived !== bArchived) return aArchived ? 1 : -1;

      var aDate = parseDate(a.deadline);
      var bDate = parseDate(b.deadline);
      if (!aDate && !bDate) return 0;
      if (!aDate) return 1;
      if (!bDate) return -1;
      return aDate.getTime() - bDate.getTime();
    });
  }

  /* ── Sort by published date (newest first) ───────────────── */
  function sortByPublishedDate(jobs) {
    return jobs.slice().sort(function (a, b) {
      var aDate = parseDate(a.published || a.publishedDate);
      var bDate = parseDate(b.published || b.publishedDate);
      if (!aDate && !bDate) return 0;
      if (!aDate) return 1;
      if (!bDate) return -1;
      return bDate.getTime() - aDate.getTime();
    });
  }

  /* ── Sort by urgency then date ───────────────────────────── */
  function sortByUrgency(jobs) {
    function urgencyScore(job) {
      if (job.status === 'archived')      return 4;
      if (isDeadlinePassed(job.deadline)) return 3;
      if (isUrgent(job.deadline))         return 1;
      if (isDeadlineSoon(job.deadline))   return 2;
      return 2;
    }

    return jobs.slice().sort(function (a, b) {
      var scoreDiff = urgencyScore(a) - urgencyScore(b);
      if (scoreDiff !== 0) return scoreDiff;

      var aDate = parseDate(a.deadline);
      var bDate = parseDate(b.deadline);
      if (!aDate && !bDate) return 0;
      if (!aDate) return 1;
      if (!bDate) return -1;
      return aDate.getTime() - bDate.getTime();
    });
  }

  /* ── Date range helpers ───────────────────────────────────── */
  function isSameDay(a, b) {
    var da = parseDate(a);
    var db = parseDate(b);
    if (!da || !db) return false;
    return da.getFullYear() === db.getFullYear() &&
           da.getMonth()    === db.getMonth()    &&
           da.getDate()     === db.getDate();
  }

  function isToday(input) {
    return isSameDay(input, nowPH());
  }

  function isThisWeek(input) {
    var d = parseDate(input);
    if (!d) return false;
    var diff = Math.abs(d.getTime() - nowPH().getTime());
    return diff < 7 * 24 * 60 * 60 * 1000;
  }

  function isThisMonth(input) {
    var d   = parseDate(input);
    var now = nowPH();
    if (!d) return false;
    return d.getFullYear() === now.getFullYear() &&
           d.getMonth()    === now.getMonth();
  }

  function getDateRangeLabel(input) {
    if (isToday(input))     return 'Today';
    if (isThisWeek(input))  return 'This Week';
    if (isThisMonth(input)) return 'This Month';
    return formatDateShort(input);
  }

  /* ── Validation ───────────────────────────────────────────── */
  function isValidDate(input) {
    return parseDate(input) !== null;
  }

  function isFutureDate(input) {
    var d = parseDate(input);
    if (!d) return false;
    return d.getTime() > nowPH().getTime();
  }

  /* ── Expose globally ─────────────────────────────────────── */
  window.TrabahoDate = {

    /* Parsing */
    parse:               parseDate,
    parsePH:             parsePHDate,
    nowPHT:              nowPH,
    now:                 nowPH,

    /* Formatting */
    format:              formatDate,
    formatShort:         formatDateShort,
    formatLong:          formatDateLong,
    formatMonthYear:     formatMonthYear,
    formatDeadline:      formatDeadline,
    formatDeadlineShort: formatDeadlineShort,
    formatRelative:      formatRelative,
    formatPublished:     formatPublished,
    formatPublishedShort:formatPublishedShort,
    formatPublishedDate: formatPublishedDate,
    formatRemaining:     formatTimeRemaining,

    /* Status / comparison */
    isExpired:           isExpired,
    isUrgent:            isUrgent,
    isSoon:              isDeadlineSoon,
    isPassed:            isDeadlinePassed,
    daysRemaining:       daysRemaining,
    daysUntil:           daysUntilDeadline,
    getStatus:           getDeadlineStatus,
    getStatusClass:      getJobStatusClass,
    getStatusLabel:      getJobStatusLabel,
    getCountdown:        getCountdown,
    isNew:               isNew,

    /* CSC exam */
    getNextCSCExam:      getNextCSCExam,
    daysUntilCSC:        getDaysUntilCSCExam,
    cscExamDates:        CSC_EXAM_DATES,
    CSC_EXAM_DATES:      CSC_EXAM_DATES,

    /* Read time */
    estimateReadTime:    estimateReadTime,

    /* Sorting */
    sortByDeadline:      sortByDeadline,
    sortByPublished:     sortByPublishedDate,
    sortByUrgency:       sortByUrgency,

    /* Range helpers */
    isToday:             isToday,
    isThisWeek:          isThisWeek,
    isThisMonth:         isThisMonth,
    getRangeLabel:       getDateRangeLabel,

    /* Validation */
    isValid:             isValidDate,
    isFuture:            isFutureDate,

    /* Constants */
    URGENT_DAYS:         URGENT_DAYS,
    SOON_DAYS:           SOON_DAYS

  };

}());
