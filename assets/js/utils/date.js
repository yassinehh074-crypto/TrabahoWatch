/* ============================================================
   ASSETS/JS/UTILS/DATE.JS — Date and time utilities
   All dates treated as Philippine Time (UTC+8)
   TrabahoWatch v1.0
   ============================================================ */

'use strict';

(function () {

  var PH_OFFSET_MS = 8 * 60 * 60 * 1000; /* UTC+8 */

  /* ── Get current time in PHT ─────────────────────────────── */
  function nowPHT() {
    return new Date(Date.now() + PH_OFFSET_MS);
  }

  /* ── Parse a date string ─────────────────────────────────── */
  function parseDate(dateStr) {
    if (!dateStr) return null;
    var d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
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

  /* ── Is expired? ─────────────────────────────────────────── */
  function isExpired(dateStr) {
    var d = parseDate(dateStr);
    if (!d) return false;
    return d < new Date();
  }

  /* ── Is urgent (closing within N days)? ─────────────────── */
  function isUrgent(dateStr, days) {
    var d = parseDate(dateStr);
    if (!d) return false;
    days = days || 7;
    var now  = new Date();
    var diff = (d - now) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= days;
  }

  /* ── Days remaining ──────────────────────────────────────── */
  function daysRemaining(dateStr) {
    var d = parseDate(dateStr);
    if (!d) return null;
    var now  = new Date();
    var diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
    return diff;
  }

  /* ── CSC Exam dates 2026 ─────────────────────────────────── */
  var CSC_EXAM_DATES = [
    {
      name:  'CSC PPT — March 2026',
      date:  '2026-03-15T08:00:00+08:00',
      type:  'PPT'
    },
    {
      name:  'CSC PPT — August 2026',
      date:  '2026-08-16T08:00:00+08:00',
      type:  'PPT'
    },
    {
      name:  'CSC PPT — November 2026',
      date:  '2026-11-29T08:00:00+08:00',
      type:  'PPT'
    }
  ];

  /* ── Get next CSC exam ───────────────────────────────────── */
  function getNextCSCExam() {
    var now = new Date();
    for (var i = 0; i < CSC_EXAM_DATES.length; i++) {
      var exam = CSC_EXAM_DATES[i];
      var d    = new Date(exam.date);
      if (d > now) return exam;
    }
    return null;
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

  /* ── Expose globally ─────────────────────────────────────── */
  window.TrabahoDate = {
    nowPHT:             nowPHT,
    parseDate:          parseDate,
    formatDeadline:     formatDeadline,
    formatDeadlineShort:formatDeadlineShort,
    formatRelative:     formatRelative,
    formatPublished:    formatPublished,
    formatPublishedShort: formatPublishedShort,
    isExpired:          isExpired,
    isUrgent:           isUrgent,
    daysRemaining:      daysRemaining,
    getCountdown:       getCountdown,
    isNew:              isNew,
    getNextCSCExam:     getNextCSCExam,
    CSC_EXAM_DATES:     CSC_EXAM_DATES
  };

}());
  /* ----------------------------------------------------------
     FORMAT PUBLISHED DATE
     Shows "X days ago" for recent posts, date for older.
     Examples:
       "Today"
       "Yesterday"
       "3 days ago"
       "Posted Aug 16, 2026"
  ---------------------------------------------------------- */
  function formatPublishedDate(input) {
    const d   = parseDate(input);
    if (!d)   return '';

    const now   = nowPH();
    const diff  = now.getTime() - d.getTime();
    const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours   < 1)   return 'Just now';
    if (hours   < 24)  return hours + ' hour'  + (hours  !== 1 ? 's' : '') + ' ago';
    if (days    === 1) return 'Yesterday';
    if (days    <= 6)  return days  + ' days ago';
    if (days    <= 13) return '1 week ago';
    if (days    <= 29) return Math.ceil(days / 7) + ' weeks ago';

    return 'Posted ' + formatDateShort(d);
  }


  /* ----------------------------------------------------------
     FORMAT TIME REMAINING
     Breaks down milliseconds into days/hours/minutes/seconds.
     Used by countdown.js.
  ---------------------------------------------------------- */
  function formatTimeRemaining(ms) {
    if (ms <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0,
               totalDays: 0, totalHours: 0, totalMinutes: 0,
               isExpired: true };
    }

    const totalSeconds  = Math.floor(ms / 1000);
    const totalMinutes  = Math.floor(totalSeconds / 60);
    const totalHours    = Math.floor(totalMinutes / 60);
    const totalDays     = Math.floor(totalHours   / 24);

    return {
      days:         totalDays,
      hours:        totalHours   % 24,
      minutes:      totalMinutes % 60,
      seconds:      totalSeconds % 60,
      totalDays:    totalDays,
      totalHours:   totalHours,
      totalMinutes: totalMinutes,
      totalSeconds: totalSeconds,
      isExpired:    false
    };
  }


  /* ============================================================
     STATUS / COMPARISON
     ============================================================ */

  /* ----------------------------------------------------------
     IS DEADLINE URGENT
     Returns true if deadline is within URGENT_DAYS and not passed.
  ---------------------------------------------------------- */
  function isDeadlineUrgent(input) {
    const d   = parseDate(input);
    if (!d)   return false;
    const diff = d.getTime() - nowPH().getTime();
    return diff > 0 && diff < URGENT_DAYS * 24 * 60 * 60 * 1000;
  }


  /* ----------------------------------------------------------
     IS DEADLINE SOON
     Returns true if deadline is within SOON_DAYS and not passed.
  ---------------------------------------------------------- */
  function isDeadlineSoon(input) {
    const d   = parseDate(input);
    if (!d)   return false;
    const diff = d.getTime() - nowPH().getTime();
    return diff > 0 && diff < SOON_DAYS * 24 * 60 * 60 * 1000;
  }


  /* ----------------------------------------------------------
     IS DEADLINE PASSED
     Returns true if deadline has passed.
  ---------------------------------------------------------- */
  function isDeadlinePassed(input) {
    const d   = parseDate(input);
    if (!d)   return false;
    return d.getTime() < nowPH().getTime();
  }


  /* ----------------------------------------------------------
     DAYS UNTIL DEADLINE
     Returns number of full days remaining.
     Returns 0 if passed, null if no deadline.
  ---------------------------------------------------------- */
  function daysUntilDeadline(input) {
    const d   = parseDate(input);
    if (!d)   return null;
    const diff = d.getTime() - nowPH().getTime();
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }


  /* ----------------------------------------------------------
     GET DEADLINE STATUS
     Returns a status object used across the site.
  ---------------------------------------------------------- */
  function getDeadlineStatus(input) {
    if (!input) {
      return {
        status:  'open',
        label:   'Open',
        badge:   'badge--open',
        urgent:  false,
        passed:  false,
        text:    'Open until filled'
      };
    }

    const d    = parseDate(input);
    if (!d)    return getDeadlineStatus(null);

    const diff  = d.getTime() - nowPH().getTime();
    const days  = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (diff <= 0) {
      return {
        status:  'archived',
        label:   'Closed',
        badge:   'badge--closed',
        urgent:  false,
        passed:  true,
        text:    'Deadline passed'
      };
    }

    if (days <= URGENT_DAYS) {
      return {
        status:  'urgent',
        label:   'Closing Soon',
        badge:   'badge--urgent',
        urgent:  true,
        passed:  false,
        text:    formatRelative(d),
        days:    days
      };
    }

    if (days <= SOON_DAYS) {
      return {
        status:  'soon',
        label:   'Opening Soon',
        badge:   'badge--soon',
        urgent:  false,
        passed:  false,
        text:    formatRelative(d),
        days:    days
      };
    }

    return {
      status:  'open',
      label:   'Open',
      badge:   'badge--open',
      urgent:  false,
      passed:  false,
      text:    formatDeadline(d),
      days:    days
    };
  }


  /* ----------------------------------------------------------
     GET JOB CARD STATUS CLASS
     Returns CSS class for job card status badge.
  ---------------------------------------------------------- */
  function getJobStatusClass(job) {
    if (!job) return 'job-card__status--open';
    if (job.status === 'archived') return 'job-card__status--closed';
    if (isDeadlineUrgent(job.deadline)) return 'job-card__status--soon';
    return 'job-card__status--open';
  }


  /* ----------------------------------------------------------
     GET JOB STATUS LABEL
     Returns display label for job card status badge.
  ---------------------------------------------------------- */
  function getJobStatusLabel(job) {
    if (!job) return 'Open';
    if (job.status === 'archived') return 'Closed';
    if (isDeadlineUrgent(job.deadline)) return 'Closing Soon';
    return 'Open';
  }


  /* ============================================================
     CSC EXAM DATES
     Centralized exam date registry.
     Update annually.
     ============================================================ */

  const CSC_EXAM_DATES = [
    {
      date:   '2026-08-16',
      label:  'August 2026 CSC PPT Exam',
      type:   'PPT',          // Professional/Sub-professional
      region: 'National'
    },
    {
      date:   '2027-03-21',
      label:  'March 2027 CSC PPT Exam',
      type:   'PPT',
      region: 'National'
    }
  ];

  /* ----------------------------------------------------------
     GET NEXT CSC EXAM
     Returns the next upcoming CSC exam date object.
  ---------------------------------------------------------- */
  function getNextCSCExam() {
    const now = nowPH();
    return CSC_EXAM_DATES.find(function (exam) {
      const d = parseDate(exam.date);
      return d && d > now;
    }) || null;
  }


  /* ----------------------------------------------------------
     GET DAYS UNTIL CSC EXAM
  ---------------------------------------------------------- */
  function getDaysUntilCSCExam() {
    const exam = getNextCSCExam();
    if (!exam) return null;
    return daysUntilDeadline(exam.date);
  }


  /* ============================================================
     READ TIME
     ============================================================ */

  /* ----------------------------------------------------------
     ESTIMATE READ TIME
     Calculates reading time from job object content.
     Returns minutes as integer.
  ---------------------------------------------------------- */
  function estimateReadTime(job) {
    if (!job) return 3;

    // If explicitly set, trust it
    if (job.readTime && !isNaN(parseInt(job.readTime, 10))) {
      return parseInt(job.readTime, 10);
    }

    // Concatenate all text content
    const textFields = [
      job.description        || '',
      job.aboutAgency        || '',
      job.aboutCompany       || '',
      job.whyThisJobMatters  || '',
      (job.requirements || []).map(function (r) {
        return typeof r === 'string' ? r : (r.text || '');
      }).join(' '),
      (job.documentsRequired || []).map(function (d) {
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

    const wordCount = textFields
      .replace(/<[^>]*>/g, ' ')    // strip any HTML
      .split(/\s+/)
      .filter(function (w) { return w.length > 0; })
      .length;

    const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);

    // Clamp: min 2 min, max 15 min
    return Math.min(Math.max(minutes, 2), 15);
  }


  /* ============================================================
     SORTING HELPERS
     ============================================================ */

  /* ----------------------------------------------------------
     SORT BY DEADLINE
     Sorts jobs: open first by deadline ASC, then archived.
  ---------------------------------------------------------- */
  function sortByDeadline(jobs) {
    return jobs.slice().sort(function (a, b) {
      const aArchived = a.status === 'archived';
      const bArchived = b.status === 'archived';

      // Archived go last
      if (aArchived !== bArchived) return aArchived ? 1 : -1;

      const aDate = parseDate(a.deadline);
      const bDate = parseDate(b.deadline);

      if (!aDate && !bDate) return 0;
      if (!aDate) return 1;
      if (!bDate) return -1;

      return aDate.getTime() - bDate.getTime();
    });
  }


  /* ----------------------------------------------------------
     SORT BY PUBLISHED DATE
     Newest first.
  ---------------------------------------------------------- */
  function sortByPublishedDate(jobs) {
    return jobs.slice().sort(function (a, b) {
      const aDate = parseDate(a.publishedDate);
      const bDate = parseDate(b.publishedDate);

      if (!aDate && !bDate) return 0;
      if (!aDate) return 1;
      if (!bDate) return -1;

      return bDate.getTime() - aDate.getTime();
    });
  }


  /* ----------------------------------------------------------
     SORT BY URGENCY THEN DATE
     Urgent → Soon → Open → Archived, then by deadline ASC.
  ---------------------------------------------------------- */
  function sortByUrgency(jobs) {
    function urgencyScore(job) {
      if (job.status === 'archived')        return 4;
      if (isDeadlinePassed(job.deadline))   return 3;
      if (isDeadlineUrgent(job.deadline))   return 1;
      if (isDeadlineSoon(job.deadline))     return 2;
      return 2;
    }

    return jobs.slice().sort(function (a, b) {
      const scoreDiff = urgencyScore(a) - urgencyScore(b);
      if (scoreDiff !== 0) return scoreDiff;

      // Same urgency — sort by deadline
      const aDate = parseDate(a.deadline);
      const bDate = parseDate(b.deadline);
      if (!aDate && !bDate) return 0;
      if (!aDate) return 1;
      if (!bDate) return -1;
      return aDate.getTime() - bDate.getTime();
    });
  }


  /* ============================================================
     DATE RANGE HELPERS
     ============================================================ */

  /* ----------------------------------------------------------
     IS SAME DAY
  ---------------------------------------------------------- */
  function isSameDay(a, b) {
    const da = parseDate(a);
    const db = parseDate(b);
    if (!da || !db) return false;
    return da.getFullYear() === db.getFullYear() &&
           da.getMonth()    === db.getMonth()    &&
           da.getDate()     === db.getDate();
  }


  /* ----------------------------------------------------------
     IS TODAY
  ---------------------------------------------------------- */
  function isToday(input) {
    return isSameDay(input, nowPH());
  }


  /* ----------------------------------------------------------
     IS THIS WEEK
  ---------------------------------------------------------- */
  function isThisWeek(input) {
    const d    = parseDate(input);
    if (!d)    return false;
    const diff = Math.abs(d.getTime() - nowPH().getTime());
    return diff < 7 * 24 * 60 * 60 * 1000;
  }


  /* ----------------------------------------------------------
     IS THIS MONTH
  ---------------------------------------------------------- */
  function isThisMonth(input) {
    const d   = parseDate(input);
    const now = nowPH();
    if (!d)   return false;
    return d.getFullYear() === now.getFullYear() &&
           d.getMonth()    === now.getMonth();
  }


  /* ----------------------------------------------------------
     GET DATE RANGE LABEL
     Returns "Today", "This Week", "This Month", or date string.
  ---------------------------------------------------------- */
  function getDateRangeLabel(input) {
    if (isToday(input))      return 'Today';
    if (isThisWeek(input))   return 'This Week';
    if (isThisMonth(input))  return 'This Month';
    return formatDateShort(input);
  }


  /* ============================================================
     VALIDATION
     ============================================================ */

  /* ----------------------------------------------------------
     IS VALID DATE
  ---------------------------------------------------------- */
  function isValidDate(input) {
    const d = parseDate(input);
    return d !== null;
  }


  /* ----------------------------------------------------------
     IS FUTURE DATE
  ---------------------------------------------------------- */
  function isFutureDate(input) {
    const d = parseDate(input);
    if (!d) return false;
    return d.getTime() > nowPH().getTime();
  }


  /* ============================================================
     PUBLIC API
     window.TrabahoDate

     Usage:
       TrabahoDate.formatDeadline('2026-08-16')
       → "Deadline: Aug 16, 2026"

       TrabahoDate.isDeadlineUrgent('2026-05-11')
       → true

       TrabahoDate.getDeadlineStatus(job.deadline)
       → { status: 'urgent', label: 'Closing Soon', ... }

       TrabahoDate.getNextCSCExam()
       → { date: '2026-08-16', label: '...', type: 'PPT' }

       TrabahoDate.estimateReadTime(job)
       → 5

       TrabahoDate.sortByUrgency(jobs)
       → sorted array
   ============================================================ */
  window.TrabahoDate = {

    // Parsing
    parse:              parseDate,
    parsePH:            parsePHDate,
    now:                nowPH,

    // Formatting
    format:             formatDate,
    formatShort:        formatDateShort,
    formatLong:         formatDateLong,
    formatMonthYear:    formatMonthYear,
    formatDeadline:     formatDeadline,
    formatRelative:     formatRelative,
    formatPublished:    formatPublishedDate,
    formatRemaining:    formatTimeRemaining,

    // Status / comparison
    isUrgent:           isDeadlineUrgent,
    isSoon:             isDeadlineSoon,
    isPassed:           isDeadlinePassed,
    daysUntil:          daysUntilDeadline,
    getStatus:          getDeadlineStatus,
    getStatusClass:     getJobStatusClass,
    getStatusLabel:     getJobStatusLabel,

    // CSC exam
    getNextCSCExam:     getNextCSCExam,
    daysUntilCSC:       getDaysUntilCSCExam,
    cscExamDates:       CSC_EXAM_DATES,

    // Read time
    estimateReadTime:   estimateReadTime,

    // Sorting
    sortByDeadline:     sortByDeadline,
    sortByPublished:    sortByPublishedDate,
    sortByUrgency:      sortByUrgency,

    // Range helpers
    isToday:            isToday,
    isThisWeek:         isThisWeek,
    isThisMonth:        isThisMonth,
    getRangeLabel:      getDateRangeLabel,

    // Validation
    isValid:            isValidDate,
    isFuture:           isFutureDate,

    // Constants
    URGENT_DAYS:        URGENT_DAYS,
    SOON_DAYS:          SOON_DAYS

  };

}());
