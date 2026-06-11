/* ============================================================
   ASSETS/JS/CORE/THEME.JS — Blocking theme script
   Must be in <head> BEFORE any CSS or content renders
   Prevents Flash of Unstyled Content (FOUC)
   TrabahoWatch v1.0
   ============================================================ */

(function () {
  'use strict';

  var STORAGE_KEY  = 'trabahowatch-theme';
  var THEME_DARK   = 'dark';
  var THEME_LIGHT  = 'light';
  var THEME_SYSTEM = 'system';
  var DARK_CLASS   = 'dark';

  /* ── Storage helpers ─────────────────────────────────────── */
  function getSavedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) { /* localStorage blocked — ignore */ }
  }

  /* ── Get system preference ───────────────────────────────── */
  function getSystemTheme() {
    try {
      return window.matchMedia &&
             window.matchMedia('(prefers-color-scheme: dark)').matches
        ? THEME_DARK
        : THEME_LIGHT;
    } catch (e) {
      return THEME_LIGHT;
    }
  }

  /* ── Resolve active theme ─────────────────────────────────── */
  function resolveTheme(saved) {
    if (saved === THEME_DARK)  return THEME_DARK;
    if (saved === THEME_LIGHT) return THEME_LIGHT;
    /* 'system' or null — follow OS */
    return getSystemTheme();
  }

  /* ── Apply theme to <html> ───────────────────────────────── */
  function applyTheme(theme) {
    var html = document.documentElement;

    html.classList.remove('dark', 'light');

    if (theme === THEME_DARK) {
      html.classList.add(DARK_CLASS);
      html.setAttribute('data-theme', THEME_DARK);
    } else {
      html.classList.add(THEME_LIGHT);
      html.setAttribute('data-theme', THEME_LIGHT);
    }

    html.style.colorScheme = theme;
    window.__trabahoTheme = theme;
  }

  /* ── Update toggle button ────────────────────────────────── */
  function updateToggleButton(theme) {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;

    var isDark = theme === THEME_DARK;

    btn.setAttribute('aria-label', isDark
      ? 'Switch to light mode'
      : 'Switch to dark mode'
    );
    btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    btn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  }

  /* ── Update mobile toggle switch ─────────────────────────── */
  function updateMobileSwitch(theme) {
    var checkbox = document.getElementById('theme-toggle-mobile');
    if (!checkbox) return;
    checkbox.checked = theme === THEME_DARK;
  }

  /* ── Toggle theme (light <-> dark) ───────────────────────── */
  function toggleTheme() {
    var current = document.documentElement.classList.contains(DARK_CLASS)
      ? THEME_DARK
      : THEME_LIGHT;
    var next = current === THEME_DARK ? THEME_LIGHT : THEME_DARK;

    applyTheme(next);
    saveTheme(next);
    updateToggleButton(next);
    updateMobileSwitch(next);

    window.dispatchEvent(new CustomEvent('themechange', {
      detail: { theme: next }
    }));
  }

  /* ── Set theme explicitly ─────────────────────────────────── */
  function setTheme(theme) {
    var resolved = resolveTheme(theme === THEME_SYSTEM ? null : theme);

    applyTheme(resolved);
    saveTheme(theme); /* save the intent, not the resolved value */
    updateToggleButton(resolved);
    updateMobileSwitch(resolved);

    window.dispatchEvent(new CustomEvent('themechange', {
      detail: { theme: resolved, preference: theme }
    }));
  }

  /* ── Watch system preference ─────────────────────────────── */
  function watchSystemPreference() {
    if (!window.matchMedia) return;
    var mq = window.matchMedia('(prefers-color-scheme: dark)');

    var handler = function (e) {
      var saved = getSavedTheme();
      if (!saved || saved === THEME_SYSTEM) {
        var resolved = e.matches ? THEME_DARK : THEME_LIGHT;
        applyTheme(resolved);
        updateToggleButton(resolved);
        updateMobileSwitch(resolved);
      }
    };

    if (mq.addEventListener) {
      mq.addEventListener('change', handler);
    } else if (mq.addListener) {
      mq.addListener(handler);
    }
  }

  /* ── Bind toggle button(s) ───────────────────────────────── */
  function bindToggle() {
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', toggleTheme);
    }

    var mobileSwitch = document.getElementById('theme-toggle-mobile');
    if (mobileSwitch) {
      mobileSwitch.addEventListener('change', function () {
        setTheme(this.checked ? THEME_DARK : THEME_LIGHT);
      });
    }
  }

  /* ── Prevent transition flash on load ────────────────────── */
  function disableTransitionsOnLoad() {
    var style = document.createElement('style');
    style.id  = 'no-transitions';
    style.textContent = '*, *::before, *::after { transition: none !important; }';
    document.head.appendChild(style);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        var s = document.getElementById('no-transitions');
        if (s) s.remove();
      });
    });
  }

  /* ============================================================
     INIT — Runs immediately
     ============================================================ */

  /* 1. Read saved preference + resolve */
  var saved    = getSavedTheme();
  var resolved = resolveTheme(saved);

  /* 2. Apply theme to <html> BEFORE render (prevents FOUC) */
  applyTheme(resolved);

  /* 3. Disable transitions during initial paint */
  disableTransitionsOnLoad();

  /* 4. Watch for OS theme changes */
  watchSystemPreference();

  /* 5. Bind buttons after DOM ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      bindToggle();
      updateToggleButton(resolved);
      updateMobileSwitch(resolved);
    });
  } else {
    bindToggle();
    updateToggleButton(resolved);
    updateMobileSwitch(resolved);
  }

  /* ============================================================
     PUBLIC API
     window.TrabahoTheme

     Usage:
       TrabahoTheme.toggle()
       TrabahoTheme.set('dark')
       TrabahoTheme.set('light')
       TrabahoTheme.set('system')
       TrabahoTheme.getCurrent()    → 'dark' | 'light'
       TrabahoTheme.getPreference() → 'dark' | 'light' | 'system'
       TrabahoTheme.isDark()        → true | false
     ============================================================ */
  window.TrabahoTheme = {

    toggle: toggleTheme,

    set: setTheme,

    getCurrent: function () {
      return document.documentElement.classList.contains(DARK_CLASS)
        ? THEME_DARK
        : THEME_LIGHT;
    },

    getPreference: function () {
      return getSavedTheme() || THEME_SYSTEM;
    },

    isDark: function () {
      return document.documentElement.classList.contains(DARK_CLASS);
    }

  };

}());
