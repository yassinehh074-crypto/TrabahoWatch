/* ============================================================
   ASSETS/JS/UI/SHARE.JS — Social sharing and copy link
   Facebook, WhatsApp, Web Share API, clipboard copy
   TrabahoWatch v1.0
   ============================================================ */

'use strict';

(function () {

  /* ============================================================
     HELPERS
     ============================================================ */

  function esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getPageTitle() {
    return document.title || 'TrabahoWatch — Philippine Job Listings';
  }

  function getPageURL() {
    return window.location.href;
  }

  function getShareText() {
    var desc = document.querySelector('meta[name="description"]');
    return desc
      ? desc.getAttribute('content')
      : 'Check out this job listing on TrabahoWatch!';
  }

  /* ============================================================
     BUILD SHARE URLS
     ============================================================ */

  function buildFacebookURL(url) {
    return 'https://www.facebook.com/sharer/sharer.php?u=' +
           encodeURIComponent(url);
  }

  function buildWhatsAppURL(url, text) {
    return 'https://wa.me/?text=' +
           encodeURIComponent((text || '') + '\n' + url);
  }

  function buildTwitterURL(url, text) {
    return 'https://twitter.com/intent/tweet?url=' +
           encodeURIComponent(url) +
           '&text=' + encodeURIComponent(text || '');
  }

  function buildLinkedInURL(url) {
    return 'https://www.linkedin.com/sharing/share-offsite/?url=' +
           encodeURIComponent(url);
  }

  /* ============================================================
     OPEN SHARE WINDOW
     ============================================================ */

  function openShareWindow(shareURL) {
    window.open(
      shareURL,
      'share-window',
      'width=600,height=500,scrollbars=yes,resizable=yes'
    );
  }

  /* ============================================================
     COPY TO CLIPBOARD
     ============================================================ */

  function copyToClipboard(text, btn) {
    /* Modern API */
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text)
        .then(function () {
          showCopiedFeedback(btn);
        })
        .catch(function () {
          fallbackCopy(text, btn);
        });
    }

    /* Fallback */
    fallbackCopy(text, btn);
  }

  function fallbackCopy(text, btn) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.cssText = [
      'position:fixed',
      'top:-9999px',
      'left:-9999px',
      'opacity:0',
      'pointer-events:none'
    ].join(';');
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      var success = document.execCommand('copy');
      if (success) showCopiedFeedback(btn);
    } catch (e) {
      console.warn('[Share] Copy failed:', e);
    }

    document.body.removeChild(textarea);
  }

  /* ============================================================
     SHOW COPIED FEEDBACK
     ============================================================ */

  function showCopiedFeedback(btn) {
    if (!btn) return;

    var span = btn.querySelector('span');
    var original = span ? span.textContent : btn.textContent;

    if (span) {
      span.textContent = 'Copied!';
    } else {
      btn.textContent = 'Copied!';
    }

    btn.classList.add('share-btn--copied');
    btn.setAttribute('aria-label', 'Link copied to clipboard');

    /* Show toast if TrabahoApp is available */
    if (window.TrabahoApp && window.TrabahoApp.showToast) {
      window.TrabahoApp.showToast('Link copied to clipboard!', 'success', 2500);
    }

    setTimeout(function () {
      if (span) {
        span.textContent = original;
      } else {
        btn.textContent = original;
      }
      btn.classList.remove('share-btn--copied');
      btn.setAttribute('aria-label', 'Copy link');
    }, 2500);
  }

  /* ============================================================
     WEB SHARE API
     ============================================================ */

  function canUseWebShare() {
    return !!(navigator.share && typeof navigator.share === 'function');
  }

  function webShare(title, text, url) {
    return navigator.share({ title: title, text: text, url: url })
      .catch(function (err) {
        /* AbortError = user cancelled — not an error */
        if (err && err.name !== 'AbortError') {
          console.warn('[Share] Web Share failed:', err);
        }
      });
  }

  /* ============================================================
     BIND A SINGLE SHARE BUTTON
     ============================================================ */

  function bindShareButton(btn) {
    var type = btn.dataset.share ||
               (btn.classList.contains('share-btn--facebook')  ? 'facebook'  : '') ||
               (btn.classList.contains('share-btn--whatsapp')  ? 'whatsapp'  : '') ||
               (btn.classList.contains('share-btn--twitter')   ? 'twitter'   : '') ||
               (btn.classList.contains('share-btn--linkedin')  ? 'linkedin'  : '') ||
               (btn.classList.contains('share-btn--copy')      ? 'copy'      : '') ||
               (btn.id === 'share-fb'     ? 'facebook' : '') ||
               (btn.id === 'share-wa'     ? 'whatsapp' : '') ||
               (btn.id === 'share-copy'   ? 'copy'     : '') ||
               (btn.id === 'share-print'  ? 'print'    : '');

    if (!type) return;

    /* Remove existing href to prevent navigation */
    if (btn.tagName === 'A') {
      btn.href = '#';
      btn.rel  = 'noopener noreferrer';
    }

    btn.addEventListener('click', function (e) {
      e.preventDefault();

      var url   = getPageURL();
      var title = getPageTitle();
      var text  = getShareText();

      switch (type) {

        case 'facebook':
          openShareWindow(buildFacebookURL(url));
          break;

        case 'whatsapp':
          /* Use Web Share on mobile if available */
          if (canUseWebShare() && /Mobi|Android/i.test(navigator.userAgent)) {
            webShare(title, text, url);
          } else {
            window.open(buildWhatsAppURL(url, title), '_blank', 'noopener');
          }
          break;

        case 'twitter':
          openShareWindow(buildTwitterURL(url, title));
          break;

        case 'linkedin':
          openShareWindow(buildLinkedInURL(url));
          break;

        case 'copy':
          /* Try Web Share on mobile first */
          if (canUseWebShare() && /Mobi|Android/i.test(navigator.userAgent)) {
            webShare(title, text, url)
              .catch(function () {
                copyToClipboard(url, btn);
              });
          } else {
            copyToClipboard(url, btn);
          }
          break;

        case 'print':
          window.print();
          break;

        default:
          /* Custom: check href on btn */
          if (btn.dataset.shareUrl) {
            openShareWindow(btn.dataset.shareUrl);
          }
          break;
      }
    });
  }

  /* ============================================================
     BIND ALL SHARE BUTTONS ON PAGE
     ============================================================ */

  function bindAllShareButtons() {
    var selector = [
      '[data-share]',
      '.share-btn',
      '#share-fb',
      '#share-wa',
      '#share-copy',
      '#share-print',
      '#share-twitter',
      '#share-linkedin'
    ].join(', ');

    document.querySelectorAll(selector).forEach(function (btn) {
      /* Avoid double binding */
      if (btn.dataset.shareBound) return;
      btn.dataset.shareBound = 'true';
      bindShareButton(btn);
    });
  }

  /* ============================================================
     OBSERVE DOM FOR DYNAMICALLY ADDED SHARE BUTTONS
     (article.js renders share bar dynamically)
     ============================================================ */

  function observeDOMForShareBtns() {
    if (!window.MutationObserver) return;

    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return; /* Element nodes only */

          /* Check if node itself is a share button */
          if (node.classList &&
              (node.classList.contains('share-btn') ||
               node.dataset.share)) {
            if (!node.dataset.shareBound) {
              node.dataset.shareBound = 'true';
              bindShareButton(node);
            }
          }

          /* Check descendants */
          if (node.querySelectorAll) {
            node.querySelectorAll(
              '[data-share], .share-btn, #share-fb, #share-wa, #share-copy'
            ).forEach(function (btn) {
              if (!btn.dataset.shareBound) {
                btn.dataset.shareBound = 'true';
                bindShareButton(btn);
              }
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree:   true
    });
  }

  /* ============================================================
     PRINT SHORTCUT
     ============================================================ */

  function initPrintShortcut() {
    document.addEventListener('keydown', function (e) {
      /* Ctrl+P — already handled by browser, but we can enhance */
      if (e.ctrlKey && e.key === 'p') {
        /* Let default print dialog open */
        return;
      }
    });
  }

  /* ============================================================
     NATIVE SHARE BUTTON
     Shows Web Share button on supported devices
     ============================================================ */

  function injectNativeShareBtn() {
    if (!canUseWebShare()) return;

    /* Find share bars */
    document.querySelectorAll('.share-bar').forEach(function (bar) {
      /* Skip if already has native share */
      if (bar.querySelector('[data-share="native"]')) return;

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'share-btn share-btn--native';
      btn.dataset.share = 'native';
      btn.setAttribute('aria-label', 'Share this page');
      btn.innerHTML = [
        '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none"',
            ' stroke-width="2" width="18" height="18" aria-hidden="true">',
          '<circle cx="18" cy="5" r="3"/>',
          '<circle cx="6" cy="12" r="3"/>',
          '<circle cx="18" cy="19" r="3"/>',
          '<line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>',
          '<line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>',
        '</svg>',
        '<span>Share</span>'
      ].join('');

      btn.addEventListener('click', function (e) {
        e.preventDefault();
        webShare(getPageTitle(), getShareText(), getPageURL());
      });

      /* Insert before first share btn */
      var first = bar.querySelector('.share-btn');
      if (first) {
        bar.insertBefore(btn, first);
      } else {
        bar.appendChild(btn);
      }
    });
  }

  /* ============================================================
     INIT
     ============================================================ */

  function init() {
    bindAllShareButtons();
    observeDOMForShareBtns();
    injectNativeShareBtn();
    initPrintShortcut();
  }

  /* ============================================================
     BOOT
     ============================================================ */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ============================================================
     PUBLIC API
     ============================================================ */

  window.TrabahoShare = {
    share:    function (type, url, text) {
      var fns = {
        facebook: function () { openShareWindow(buildFacebookURL(url || getPageURL())); },
        whatsapp: function () { window.open(buildWhatsAppURL(url || getPageURL(), text), '_blank', 'noopener'); },
        twitter:  function () { openShareWindow(buildTwitterURL(url || getPageURL(), text)); },
        copy:     function () { copyToClipboard(url || getPageURL(), null); },
        native:   function () { webShare(getPageTitle(), text || getShareText(), url || getPageURL()); }
      };
      if (fns[type]) fns[type]();
    },
    copy:     function (text) { copyToClipboard(text || getPageURL(), null); },
    canNative: canUseWebShare
  };

}());