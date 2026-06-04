/* ============================================================
   DATA/JOBS/INDEX.JS — Central job data API
   Merges gov + private + ofw data files
   Builds indexes, search, and stats
   Dispatches trabahoJobs:ready when done
   TrabahoWatch v1.0
   ============================================================ */

'use strict';

(function () {

  /* ============================================================
     WAIT FOR ALL DATA FILES TO LOAD
     ============================================================ */

  function waitForData() {
    return new Promise(function (resolve) {
      var checks = 0;
      var maxChecks = 100; /* 10 seconds max */

      function check() {
        var gov     = Array.isArray(window.__TrabahoGovJobs);
        var private_ = Array.isArray(window.__TrabahoPrivateJobs);
        var ofw     = Array.isArray(window.__TrabahoOFWJobs);

        if (gov && private_ && ofw) {
          resolve();
          return;
        }

        checks++;
        if (checks >= maxChecks) {
          console.warn('[TrabahoJobs] Data files took too long. Using what is available.');
          resolve();
          return;
        }

        setTimeout(check, 100);
      }

      check();
    });
  }

  /* ============================================================
     NORMALIZE A JOB OBJECT
     Ensures every job has all expected fields
     ============================================================ */

  function normalizeJob(job, sector) {
    return {
      /* Identity */
      id:          job.id          || '',
      sector:      job.sector      || sector || 'government',
      category:    job.category    || '',

      /* Display */
      title:       job.title       || '',
      agency:      job.agency      || job.company || '',
      location:    job.location    || '',
      region:      job.region      || '',
      description: job.description || '',

      /* Salary */
      salary:      job.salary      || null,
      salaryMin:   job.salaryMin   || null,
      salaryMax:   job.salaryMax   || null,
      salaryText:  job.salaryText  || '',
      sg:          job.sg          || null,

      /* Status */
      status:      job.status      || 'open',
      tier:        job.tier        || 3,
      deadline:    job.deadline    || null,
      published:   job.published   || null,

      /* Content */
      requirements: job.requirements || [],
      tags:          job.tags         || [],
      sourceUrl:     job.sourceUrl    || '',

      /* Computed */
      isOpen:    (job.status === 'open'),
      isUrgent:  isUrgentDeadline(job.deadline),
      isArchived:(job.status === 'archived' || job.status === 'closed'),
      isPaused:  (job.status === 'paused'),

      /* URL */
      url: '/jobs/' + (job.id || '') + '/'
    };
  }

  /* ============================================================
     HELPERS
     ============================================================ */

  function isUrgentDeadline(deadline, days) {
    if (!deadline) return false;
    days = days || 7;
    var now  = new Date();
    var end  = new Date(deadline);
    if (isNaN(end.getTime())) return false;
    if (end < now) return false;
    var diff = (end - now) / (1000 * 60 * 60 * 24);
    return diff <= days;
  }

  function isExpired(deadline) {
    if (!deadline) return false;
    var end = new Date(deadline);
    if (isNaN(end.getTime())) return false;
    return end < new Date();
  }

  /* Build a search-friendly string from a job */
  function buildSearchText(job) {
    return [
      job.title,
      job.agency,
      job.location,
      job.region,
      job.category,
      job.sector,
      job.salaryText,
      (job.tags || []).join(' '),
      (job.requirements || []).join(' ')
    ].join(' ').toLowerCase();
  }

  /* Simple relevance score for search */
  function searchScore(query, job) {
    var q    = query.toLowerCase().trim();
    var text = job._searchText || '';
    var score = 0;

    /* Exact title match */
    if (job.title.toLowerCase().includes(q)) score += 100;

    /* Agency match */
    if (job.agency.toLowerCase().includes(q)) score += 50;

    /* Category / sector match */
    if (job.category.toLowerCase().includes(q)) score += 40;
    if (job.sector.toLowerCase().includes(q)) score += 30;

    /* Location match */
    if (job.location.toLowerCase().includes(q)) score += 25;

    /* Tag match */
    if ((job.tags || []).some(function (t) {
      return t.toLowerCase().includes(q);
    })) score += 20;

    /* General text match */
    if (text.includes(q)) score += 10;

    /* Boost open jobs */
    if (job.isOpen) score += 5;

    /* Boost tier 1 */
    if (job.tier === 1) score += 3;

    return score;
  }

  /* ============================================================
     BUILD THE MAIN DATA STORE
     ============================================================ */

  function buildStore(allJobs) {

    /* Primary Map: id → job */
    var byId = new Map();

    /* Indexes */
    var bySector   = {};   /* { government: [], private: [], ofw: [] } */
    var byCategory = {};   /* { deped: [], doh: [], ... } */
    var byRegion   = {};   /* { ncr: [], region-1: [], ... } */
    var byStatus   = {
      open:     [],
      archived: [],
      paused:   [],
      urgent:   []
    };

    allJobs.forEach(function (job) {

      /* Store in Map */
      byId.set(job.id, job);

      /* Sector index */
      if (!bySector[job.sector]) bySector[job.sector] = [];
      bySector[job.sector].push(job);

      /* Category index */
      if (job.category) {
        if (!byCategory[job.category]) byCategory[job.category] = [];
        byCategory[job.category].push(job);
      }

      /* Region index */
      if (job.region) {
        if (!byRegion[job.region]) byRegion[job.region] = [];
        byRegion[job.region].push(job);
      }

      /* Status index */
      if (job.isArchived) {
        byStatus.archived.push(job);
      } else if (job.isPaused) {
        byStatus.paused.push(job);
      } else if (job.isOpen) {
        byStatus.open.push(job);
        if (job.isUrgent) byStatus.urgent.push(job);
      }

    });

    return {
      byId:       byId,
      bySector:   bySector,
      byCategory: byCategory,
      byRegion:   byRegion,
      byStatus:   byStatus,
      all:        allJobs
    };
  }

  /* ============================================================
     PUBLIC API
     ============================================================ */

  function createAPI(store) {

    /* ── getById ──────────────────────────────────────────────── */
    function getById(id) {
      if (!id) return null;
      return store.byId.get(id) || null;
    }

    /* ── getAll ───────────────────────────────────────────────── */
    function getAll(options) {
      options = options || {};
      var jobs = store.all.slice();

      /* Filter by sector */
      if (options.sector) {
        jobs = jobs.filter(function (j) {
          return j.sector === options.sector;
        });
      }

      /* Filter by category */
      if (options.category) {
        jobs = jobs.filter(function (j) {
          return j.category === options.category;
        });
      }

      /* Filter by region */
      if (options.region) {
        jobs = jobs.filter(function (j) {
          return j.region === options.region;
        });
      }

      /* Filter by status */
      if (options.status) {
        jobs = jobs.filter(function (j) {
          return j.status === options.status;
        });
      }

      /* Filter open only */
      if (options.openOnly) {
        jobs = jobs.filter(function (j) { return j.isOpen; });
      }

      /* Sort */
      var sort = options.sort || 'published';

      if (sort === 'deadline') {
        jobs.sort(function (a, b) {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline) - new Date(b.deadline);
        });
      } else if (sort === 'salary') {
        jobs.sort(function (a, b) {
          return (b.salaryMin || 0) - (a.salaryMin || 0);
        });
      } else if (sort === 'tier') {
        jobs.sort(function (a, b) { return a.tier - b.tier; });
      } else {
        /* Default: newest published first */
        jobs.sort(function (a, b) {
          if (!a.published) return 1;
          if (!b.published) return -1;
          return new Date(b.published) - new Date(a.published);
        });
      }

      /* Limit */
      if (options.limit && options.limit > 0) {
        jobs = jobs.slice(0, options.limit);
      }

      return jobs;
    }

    /* ── getByCategory ────────────────────────────────────────── */
    function getByCategory(category, sector) {
      var jobs = store.byCategory[category] || [];
      if (sector) {
        jobs = jobs.filter(function (j) { return j.sector === sector; });
      }
      return jobs;
    }

    /* ── getBySector ──────────────────────────────────────────── */
    function getBySector(sector) {
      return store.bySector[sector] || [];
    }

    /* ── getByRegion ──────────────────────────────────────────── */
    function getByRegion(region) {
      return store.byRegion[region] || [];
    }

    /* ── getRelated ───────────────────────────────────────────── */
    function getRelated(id, limit) {
      limit = limit || 3;
      var job = getById(id);
      if (!job) return [];

      /* Find jobs in same category or sector, excluding self */
      var candidates = store.all.filter(function (j) {
        return j.id !== id && j.isOpen;
      });

      /* Score by similarity */
      candidates = candidates.map(function (j) {
        var score = 0;
        if (j.category === job.category) score += 30;
        if (j.sector   === job.sector)   score += 20;
        if (j.region   === job.region)   score += 10;
        if (j.tier     === job.tier)     score += 5;
        return { job: j, score: score };
      });

      candidates.sort(function (a, b) { return b.score - a.score; });

      return candidates.slice(0, limit).map(function (c) { return c.job; });
    }

    /* ── search ───────────────────────────────────────────────── */
    function search(query, options) {
      options = options || {};

      if (!query || query.trim() === '') {
        return getAll(options);
      }

      var q = query.toLowerCase().trim();

      var results = store.all.filter(function (job) {
        /* Skip archived unless explicitly included */
        if (!options.includeArchived && job.isArchived) return false;

        var score = searchScore(q, job);
        job._score = score;
        return score > 0;
      });

      /* Sort by relevance */
      results.sort(function (a, b) {
        return (b._score || 0) - (a._score || 0);
      });

      /* Apply sector/category filter */
      if (options.sector) {
        results = results.filter(function (j) {
          return j.sector === options.sector;
        });
      }

      if (options.category) {
        results = results.filter(function (j) {
          return j.category === options.category;
        });
      }

      /* Limit */
      if (options.limit && options.limit > 0) {
        results = results.slice(0, options.limit);
      }

      return results;
    }

    /* ── getStats ─────────────────────────────────────────────── */
    function getStats(sector) {
      var jobs = sector ? (store.bySector[sector] || []) : store.all;

      var total   = jobs.length;
      var open    = jobs.filter(function (j) { return j.isOpen; }).length;
      var urgent  = jobs.filter(function (j) { return j.isUrgent; }).length;
      var archived= jobs.filter(function (j) { return j.isArchived; }).length;
      var paused  = jobs.filter(function (j) { return j.isPaused; }).length;

      return {
        total:    total,
        open:     open,
        urgent:   urgent,
        archived: archived,
        paused:   paused,
        closed:   archived
      };
    }

    /* ── getCategories ────────────────────────────────────────── */
    function getCategories(sector) {
      var categories = {};

      store.all.forEach(function (job) {
        if (sector && job.sector !== sector) return;
        if (!job.category) return;
        if (!categories[job.category]) {
          categories[job.category] = { id: job.category, count: 0, open: 0 };
        }
        categories[job.category].count++;
        if (job.isOpen) categories[job.category].open++;
      });

      return Object.values(categories);
    }

    /* ── getSectors ───────────────────────────────────────────── */
    function getSectors() {
      var sectors = {};
      store.all.forEach(function (job) {
        if (!sectors[job.sector]) {
          sectors[job.sector] = { id: job.sector, count: 0, open: 0 };
        }
        sectors[job.sector].count++;
        if (job.isOpen) sectors[job.sector].open++;
      });
      return Object.values(sectors);
    }

    /* ── getLatest ────────────────────────────────────────────── */
    function getLatest(limit, sector) {
      return getAll({
        sector:   sector || null,
        openOnly: true,
        sort:     'published',
        limit:    limit || 5
      });
    }

    /* ── getUrgent ────────────────────────────────────────────── */
    function getUrgent(limit) {
      return store.byStatus.urgent.slice(0, limit || 5);
    }

    return {
      getById:       getById,
      getAll:        getAll,
      getByCategory: getByCategory,
      getBySector:   getBySector,
      getByRegion:   getByRegion,
      getRelated:    getRelated,
      search:        search,
      getStats:      getStats,
      getCategories: getCategories,
      getSectors:    getSectors,
      getLatest:     getLatest,
      getUrgent:     getUrgent,

      /* Raw store access for advanced use */
      _store: store
    };
  }

  /* ============================================================
     INIT
     ============================================================ */

  waitForData().then(function () {

    /* Collect all jobs */
    var govJobs     = (window.__TrabahoGovJobs     || []).map(function (j) {
      return normalizeJob(j, 'government');
    });
    var privateJobs = (window.__TrabahoPrivateJobs || []).map(function (j) {
      return normalizeJob(j, 'private');
    });
    var ofwJobs     = (window.__TrabahoOFWJobs     || []).map(function (j) {
      return normalizeJob(j, 'ofw');
    });

    var allJobs = govJobs.concat(privateJobs).concat(ofwJobs);

    /* Build search text for each job */
    allJobs.forEach(function (job) {
      job._searchText = buildSearchText(job);
    });

    /* Remove duplicates by ID */
    var seen = {};
    allJobs = allJobs.filter(function (job) {
      if (!job.id || seen[job.id]) return false;
      seen[job.id] = true;
      return true;
    });

    /* Build store and API */
    var store = buildStore(allJobs);
    var api   = createAPI(store);

    /* Expose globally */
    window.TrabahoJobs = api;

    /* Dispatch ready event */
    window.dispatchEvent(new CustomEvent('trabahoJobs:ready', {
      detail: {
        total:   allJobs.length,
        sectors: Object.keys(store.bySector)
      }
    }));

    console.log(
      '[TrabahoJobs] Ready —',
      allJobs.length, 'jobs loaded.',
      'Gov:', govJobs.length,
      '| Private:', privateJobs.length,
      '| OFW:', ofwJobs.length
    );

  });

}());