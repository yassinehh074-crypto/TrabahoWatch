/**
 * TrabahoWatch Service Worker
 * Strategy: Cache-first for assets, Network-first for pages and data
 * Version: 1.0.0
 */

'use strict';

/* ================================================================
   CACHE CONFIGURATION
   ================================================================ */

var CACHE_VERSION   = 'tw-v1';
var STATIC_CACHE    = CACHE_VERSION + '-static';
var PAGES_CACHE     = CACHE_VERSION + '-pages';
var DATA_CACHE      = CACHE_VERSION + '-data';
var IMAGE_CACHE     = CACHE_VERSION + '-images';

var ALL_CACHES = [STATIC_CACHE, PAGES_CACHE, DATA_CACHE, IMAGE_CACHE];

/* ================================================================
   ASSETS TO PRE-CACHE ON INSTALL
   ================================================================ */

var STATIC_ASSETS = [
  /* Core CSS */
  '/assets/css/variables.css',
  '/assets/css/reset.css',
  '/assets/css/base.css',
  '/assets/css/layout.css',
  '/assets/css/animations.css',
  '/assets/css/utilities.css',
  '/assets/css/responsive.css',
  '/assets/css/components/header.css',
  '/assets/css/components/footer.css',
  '/assets/css/components/cards.css',
  '/assets/css/components/buttons.css',
  '/assets/css/components/forms.css',
  '/assets/css/components/badges.css',
  '/assets/css/components/toast.css',

  /* Core JS */
  '/assets/js/core/theme.js',
  '/assets/js/core/app.js',
  '/assets/js/core/router.js',
  '/assets/js/utils/string.js',
  '/assets/js/utils/date.js',
  '/assets/js/utils/dom.js',

  /* UI JS */
  '/assets/js/ui/scroll-top.js',
  '/assets/js/ui/filters.js',
  '/assets/js/ui/search.js',

  /* Data */
  '/data/jobs/gov-jobs.js',
  '/data/jobs/private-jobs.js',
  '/data/jobs/ofw-jobs.js',
  '/data/jobs/index.js',
  '/data/salary-grades.json',
  '/data/regions.json',
  '/data/categories.json',

  /* Components */
  '/components/header.html',
  '/components/footer.html',
  '/components/sidebar.html',

  /* Offline fallback */
  '/pages/404.html'
];

var PAGES_TO_PRECACHE = [
  '/',
  '/government/',
  '/government/salary-grade.html',
  '/government/csc-exams.html',
  '/private/',
  '/ofw/',
  '/jobs/job-map.html'
];

/* ================================================================
   INSTALL — Pre-cache static assets
   ================================================================ */

self.addEventListener('install', function (event) {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(function (cache) {
        return cache.addAll(STATIC_ASSETS).catch(function (err) {
          console.warn('[SW] Some static assets failed to cache:', err);
        });
      }),
      caches.open(PAGES_CACHE).then(function (cache) {
        return cache.addAll(PAGES_TO_PRECACHE).catch(function (err) {
          console.warn('[SW] Some pages failed to cache:', err);
        });
      })
    ]).then(function () {
      /* Activate immediately — don't wait for old SW to expire */
      return self.skipWaiting();
    })
  );
});

/* ================================================================
   ACTIVATE — Clean up old caches
   ================================================================ */

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (name) {
          if (ALL_CACHES.indexOf(name) === -1) {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(function () {
      /* Take control of all open clients immediately */
      return self.clients.claim();
    })
  );
});

/* ================================================================
   FETCH — Routing strategies
   ================================================================ */

self.addEventListener('fetch', function (event) {
  var request = event.request;
  var url     = new URL(request.url);

  /* Only handle same-origin GET requests */
  if (request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

  /* ── Strategy 1: Cache-first for static assets ── */
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  /* ── Strategy 2: Cache-first for images ── */
  if (isImage(url.pathname)) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  /* ── Strategy 3: Network-first for data files ── */
  if (isDataFile(url.pathname)) {
    event.respondWith(networkFirst(request, DATA_CACHE, 3000));
    return;
  }

  /* ── Strategy 4: Stale-while-revalidate for HTML pages ── */
  if (isPage(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request, PAGES_CACHE));
    return;
  }

  /* Default: network with cache fallback */
  event.respondWith(networkWithFallback(request));
});

/* ================================================================
   ROUTING HELPERS
   ================================================================ */

function isStaticAsset(pathname) {
  return (
    pathname.startsWith('/assets/css/') ||
    pathname.startsWith('/assets/js/')  ||
    pathname.startsWith('/assets/fonts/')
  );
}

function isImage(pathname) {
  return /\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(pathname);
}

function isDataFile(pathname) {
  return (
    pathname.startsWith('/data/')       ||
    pathname.startsWith('/components/')
  );
}

function isPage(pathname) {
  return (
    pathname === '/'                    ||
    pathname.endsWith('.html')          ||
    pathname.endsWith('/')
  );
}

/* ================================================================
   CACHE STRATEGIES
   ================================================================ */

/**
 * Cache-First: Return cached version immediately.
 * Update cache in background if online.
 */
function cacheFirst(request, cacheName) {
  return caches.open(cacheName).then(function (cache) {
    return cache.match(request).then(function (cached) {
      if (cached) {
        /* Refresh cache in background */
        fetchAndCache(request, cache);
        return cached;
      }
      return fetchAndCache(request, cache);
    });
  });
}

/**
 * Network-First: Try network first (with timeout).
 * Fall back to cache if network is slow or offline.
 */
function networkFirst(request, cacheName, timeout) {
  return caches.open(cacheName).then(function (cache) {
    var networkPromise = fetch(request.clone()).then(function (response) {
      if (response && response.status === 200) {
        cache.put(request, response.clone());
      }
      return response;
    });

    var timeoutPromise = new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error('Network timeout'));
      }, timeout || 3000);
    });

    return Promise.race([networkPromise, timeoutPromise])
      .catch(function () {
        return cache.match(request).then(function (cached) {
          return cached || offlineFallback(request);
        });
      });
  });
}

/**
 * Stale-While-Revalidate: Return cache immediately,
 * update cache from network in background.
 */
function staleWhileRevalidate(request, cacheName) {
  return caches.open(cacheName).then(function (cache) {
    return cache.match(request).then(function (cached) {
      var fetchPromise = fetch(request.clone()).then(function (response) {
        if (response && response.status === 200) {
          cache.put(request, response.clone());
        }
        return response;
      }).catch(function () {
        return null;
      });

      return cached || fetchPromise || offlineFallback(request);
    });
  });
}

/**
 * Network with cache fallback.
 */
function networkWithFallback(request) {
  return fetch(request.clone()).then(function (response) {
    if (response && response.status === 200) {
      caches.open(PAGES_CACHE).then(function (cache) {
        cache.put(request, response.clone());
      });
    }
    return response;
  }).catch(function () {
    return caches.match(request).then(function (cached) {
      return cached || offlineFallback(request);
    });
  });
}

/**
 * Helper: Fetch and store in given cache.
 */
function fetchAndCache(request, cache) {
  return fetch(request.clone()).then(function (response) {
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(function () {
    return cache.match(request);
  });
}

/**
 * Offline fallback — serve 404 page for HTML requests.
 */
function offlineFallback(request) {
  var url = new URL(request.url);
  if (isPage(url.pathname)) {
    return caches.match('/pages/404.html');
  }
  /* Return empty 503 response for non-page requests */
  return new Response('Service Unavailable', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: new Headers({ 'Content-Type': 'text/plain' })
  });
}

/* ================================================================
   BACKGROUND SYNC — for form submissions when offline
   ================================================================ */

self.addEventListener('sync', function (event) {
  if (event.tag === 'sync-contact-form') {
    event.waitUntil(syncContactForms());
  }
  if (event.tag === 'sync-job-submit') {
    event.waitUntil(syncJobSubmissions());
  }
});

function syncContactForms() {
  return self.clients.matchAll().then(function (clients) {
    clients.forEach(function (client) {
      client.postMessage({ type: 'SYNC_COMPLETE', form: 'contact' });
    });
  });
}

function syncJobSubmissions() {
  return self.clients.matchAll().then(function (clients) {
    clients.forEach(function (client) {
      client.postMessage({ type: 'SYNC_COMPLETE', form: 'job-submit' });
    });
  });
}

/* ================================================================
   PUSH NOTIFICATIONS — job alerts (future feature)
   ================================================================ */

self.addEventListener('push', function (event) {
  if (!event.data) return;

  var data = {};
  try {
    data = event.data.json();
  } catch (e) {
    data = { title: 'TrabahoWatch', body: event.data.text() };
  }

  var options = {
    body:    data.body    || 'New job listings available.',
    icon:    data.icon    || '/assets/img/pwa/icon-192.png',
    badge:   data.badge   || '/assets/img/pwa/icon-72.png',
    image:   data.image   || null,
    tag:     data.tag     || 'trabahowatch-job-alert',
    renotify: true,
    requireInteraction: false,
    data: {
      url: data.url || '/',
      dateOfArrival: Date.now()
    },
    actions: [
      { action: 'view',    title: 'View Jobs' },
      { action: 'dismiss', title: 'Dismiss'   }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'TrabahoWatch — New Jobs',
      options
    )
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  if (event.action === 'dismiss') return;

  var targetUrl = (event.notification.data && event.notification.data.url)
    ? event.notification.data.url
    : '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function (clientList) {
        /* Focus existing tab if open */
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url === targetUrl && 'focus' in client) {
            return client.focus();
          }
        }
        /* Open new tab */
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});

/* ================================================================
   MESSAGE HANDLER — from main thread
   ================================================================ */

self.addEventListener('message', function (event) {
  if (!event.data) return;

  switch (event.data.type) {

    /* Force SW update and reload all clients */
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    /* Clear all caches on demand (e.g., user logout, data reset) */
    case 'CLEAR_CACHES':
      event.waitUntil(
        caches.keys().then(function (names) {
          return Promise.all(names.map(function (n) {
            return caches.delete(n);
          }));
        }).then(function () {
          if (event.source) {
            event.source.postMessage({ type: 'CACHES_CLEARED' });
          }
        })
      );
      break;

    /* Report cached URLs for debugging */
    case 'GET_CACHE_STATUS':
      event.waitUntil(
        caches.keys().then(function (names) {
          return Promise.all(
            names.map(function (name) {
              return caches.open(name).then(function (cache) {
                return cache.keys().then(function (keys) {
                  return { name: name, count: keys.length };
                });
              });
            })
          );
        }).then(function (status) {
          if (event.source) {
            event.source.postMessage({ type: 'CACHE_STATUS', status: status });
          }
        })
      );
      break;
  }
});

/* ================================================================
   SW READY LOG
   ================================================================ */

console.log('[TrabahoWatch SW] v' + CACHE_VERSION + ' loaded.');