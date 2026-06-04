/* ============================================================
   ASSETS/JS/CORE/THEME.JS — Blocking theme script
   Must be in <head> BEFORE any CSS or content renders
   Prevents Flash of Unstyled Content (FOUC)
   TrabahoWatch v1.0
   ============================================================ */

(function () {
  'use strict';

  /* ── Read saved preference ──────────────────────────────── */
  var saved = null;
  try {
    saved = localStorage.getItem('trabahowatch-theme');
  } catch (e) { /* localStorage blocked — ignore */ }

  /* ── Detect system preference ───────────────────────────── */
  var prefersDark = false;
  try {
    prefersDark = window.matchMedia &&
                  window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch (e) { /* matchMedia not supported */ }

  /* ── Decide theme ───────────────────────────────────────── */
  var theme;
  if (saved === 'dark' || saved === 'light') {
    theme = saved;
  } else if (prefersDark) {
    theme = 'dark';
  } else {
    theme = 'light';
  }

  /* ── Apply class to <html> IMMEDIATELY ─────────────────── */
  var html = document.documentElement;
  html.classList.remove('dark', 'light');
  html.classList.add(theme);

  /* ── Set color-scheme for browser UI ───────────────────── */
  html.style.colorScheme = theme;

  /* ── Expose for app.js ──────────────────────────────────── */
  window.__trabahoTheme = theme;

}());ly
    }
  }


  /* ----------------------------------------------------------
     GET SYSTEM PREFERENCE
     Returns: 'dark' | 'light'
  ---------------------------------------------------------- */
  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? THEME_DARK
      : THEME_LIGHT;
  }


  /* ----------------------------------------------------------
     RESOLVE ACTIVE THEME
     Combines saved preference + system preference.
     Returns: 'dark' | 'light'
  ---------------------------------------------------------- */
  function resolveTheme(saved) {
    if (saved === THEME_DARK)  return THEME_DARK;
    if (saved === THEME_LIGHT) return THEME_LIGHT;
    // 'system' or null — follow OS
    return getSystemTheme();
  }


  /* ----------------------------------------------------------
     APPLY THEME TO <html>
     Called immediately on load + on toggle.
  ---------------------------------------------------------- */
  function applyTheme(theme) {
    const html = document.documentElement;

    if (theme === THEME_DARK) {
      html.classList.add(DARK_CLASS);
      html.setAttribute('data-theme', THEME_DARK);
    } else {
      html.classList.remove(DARK_CLASS);
      html.setAttribute('data-theme', THEME_LIGHT);
    }
  }


  /* ----------------------------------------------------------
     UPDATE TOGGLE BUTTON
     Syncs the toggle icon state with current theme.
     Called after DOM is ready.
  ---------------------------------------------------------- */
  function updateToggleButton(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    const isDark = theme === THEME_DARK;

    btn.setAttribute('aria-label', isDark
      ? 'Switch to light mode'
      : 'Switch to dark mode'
    );

    btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    btn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  }


  /* ----------------------------------------------------------
     UPDATE MOBILE TOGGLE SWITCH
     The toggle switch inside the mobile menu.
  ---------------------------------------------------------- */
  function updateMobileSwitch(theme) {
    const checkbox = document.getElementById('theme-toggle-mobile');
    if (!checkbox) return;
    checkbox.checked = theme === THEME_DARK;
  }


  /* ----------------------------------------------------------
     TOGGLE THEME
     Called when user clicks the toggle button.
     Cycles: light → dark → light
     (System preference handled separately)
  ---------------------------------------------------------- */
  function toggleTheme() {
    const current   = document.documentElement.classList.contains(DARK_CLASS)
      ? THEME_DARK
      : THEME_LIGHT;
    const next      = current === THEME_DARK ? THEME_LIGHT : THEME_DARK;

    applyTheme(next);
    saveTheme(next);
    updateToggleButton(next);
    updateMobileSwitch(next);

    // Dispatch event — other scripts can listen
    window.dispatchEvent(new CustomEvent('themechange', {
      detail: { theme: next }
    }));
  }


  /* ----------------------------------------------------------
     SET THEME EXPLICITLY
     Called from mobile switch or external code.
     theme: 'dark' | 'light' | 'system'
  ---------------------------------------------------------- */
  function setTheme(theme) {
    const resolved = resolveTheme(
      theme === THEME_SYSTEM ? null : theme
    );

    applyTheme(resolved);
    saveTheme(theme); // Save the intent, not the resolved value
    updateToggleButton(resolved);
    updateMobileSwitch(resolved);

    window.dispatchEvent(new CustomEvent('themechange', {
      detail: { theme: resolved, preference: theme }
    }));
  }


  /* ----------------------------------------------------------
     WATCH SYSTEM PREFERENCE
     If user chose 'system', update when OS changes.
  ---------------------------------------------------------- */
  function watchSystemPreference() {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');

    mq.addEventListener('change', function (e) {
      const saved = getSavedTheme();

      // Only follow system if preference is 'system' or not set
      if (!saved || saved === THEME_SYSTEM) {
        const resolved = e.matches ? THEME_DARK : THEME_LIGHT;
        applyTheme(resolved);
        updateToggleButton(resolved);
        updateMobileSwitch(resolved);
      }
    });
  }


  /* ----------------------------------------------------------
     BIND TOGGLE BUTTON
     Called after DOM is ready.
  ---------------------------------------------------------- */
  function bindToggle() {
    // Header toggle button
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', toggleTheme);
    }

    // Mobile menu toggle switch
    const mobileSwitch = document.getElementById('theme-toggle-mobile');
    if (mobileSwitch) {
      mobileSwitch.addEventListener('change', function () {
        setTheme(this.checked ? THEME_DARK : THEME_LIGHT);
      });
    }
  }


  /* ----------------------------------------------------------
     PREVENT TRANSITION FLASH ON LOAD
     Temporarily disables CSS transitions while theme applies.
     Without this, colors animate on first load.
  ---------------------------------------------------------- */
  function disableTransitionsOnLoad() {
    const style = document.createElement('style');
    style.id    = 'no-transitions';
    style.textContent = '*, *::before, *::after { transition: none !important; }';
    document.head.appendChild(style);

    // Re-enable after first paint
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        const s = document.getElementById('no-transitions');
        if (s) s.remove();
      });
    });
  }


  /* ----------------------------------------------------------
     INIT — Runs immediately (IIFE body)
  ---------------------------------------------------------- */

  // 1. Disable transitions to prevent flash
  disableTransitionsOnLoad();

  // 2. Read saved preference
  const saved   = getSavedTheme();
  const resolved = resolveTheme(saved);

  // 3. Apply theme to <html> BEFORE render
  applyTheme(resolved);

  // 4. Watch for OS changes
  watchSystemPreference();

  // 5. Bind buttons after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      bindToggle();
      updateToggleButton(resolved);
      updateMobileSwitch(resolved);
    });
  } else {
    // DOM already ready
    bindToggle();
    updateToggleButton(resolved);
    updateMobileSwitch(resolved);
  }


  /* ----------------------------------------------------------
     PUBLIC API
     Exposed on window for other scripts to use.

     Usage:
       TrabahoTheme.toggle()
       TrabahoTheme.set('dark')
       TrabahoTheme.set('light')
       TrabahoTheme.set('system')
       TrabahoTheme.getCurrent()   → 'dark' | 'light'
       TrabahoTheme.getPreference() → 'dark' | 'light' | 'system'
  ---------------------------------------------------------- */
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