/* ============================================================
   APP.JS � Haute Fighting Gears
   v4.0 | 2026-07-20
   Merged: mobile-fixes + main + products-engine + animations
   Production build � hautefightinggears.com
   ============================================================ */

// ============================================================
// MOBILE-FIXES.JS — Haute Fighting Gears
// v2 — GitHub Pages + mobile + security + performance fixes
// Does NOT change layout, design, colors, or structure.
// ============================================================

(function () {
  'use strict';

  // ── GITHUB PAGES BASE PATH ───────────────────────────────────
  // Computed once, used by products-engine for JSON + image paths.
  // Works for:
  //   - GitHub Pages with repo subdirectory: username.github.io/repo-name/
  //   - GitHub Pages with custom domain:     yourdomain.com/  (no subdir)
  //   - Local Live Server:                   localhost:5500/
  //   - Local from /pages/ depth:            localhost:5500/pages/
  (function computeBasePath() {
    // Simple: base is always the site root origin.
    // All paths in this project are absolute (start with /).
    window.HFG_BASE = window.location.origin;
  })();


  // ── 1. INJECT GLOBAL CSS FIXES ──────────────────────────────
  var style = document.createElement('style');
  style.textContent = [

    /* Box model + overflow */
    /* overflow-x:hidden on body breaks position:fixed in iOS Safari — apply to html only */
    'html{overflow-x:hidden !important;max-width:100vw !important;}',
    'body{max-width:100vw !important;}',
    '*{box-sizing:border-box;}',

    /* Images always scale */
    'img{max-width:100% !important;height:auto;}',

    /* Remove iOS tap flash, add manipulation */
    'a,button{-webkit-tap-highlight-color:transparent;touch-action:manipulation;}',

    /* WhatsApp links always tappable */
    'a[href*="wa.me"]{min-height:44px !important;display:inline-flex !important;align-items:center !important;}',

    /* External links — security handled in JS below */

    /* ── MOBILE ONLY ── */
    '@media(max-width:767px){',

    /* Navbar */
    'header nav{padding-left:16px !important;padding-right:16px !important;}',

    /* Mobile menu button */
    '#mobile-menu-btn{min-width:44px !important;min-height:44px !important;',
    'display:flex !important;align-items:center !important;justify-content:center !important;}',

    /* Mobile nav drawer */
    '#mobile-nav{position:relative !important;z-index:9999 !important;',
    'width:100% !important;left:0 !important;right:0 !important;',
    'box-shadow:0 8px 24px rgba(0,0,0,0.15) !important;}',

    /* Menu links */
    '#mobile-nav a{min-height:44px !important;display:flex !important;',
    'align-items:center !important;padding-top:12px !important;',
    'padding-bottom:12px !important;font-size:15px !important;}',

    /* All buttons tap size */
    'button,a[class*="py-"],a[class*="px-"]{min-height:44px !important;}',

    /* Section padding */
    'section,[class*="px-5"],[class*="md:px-\\[64px\\]"]{',
    'padding-left:16px !important;padding-right:16px !important;}',

    /* Hero */
    'section.min-h-screen{min-height:100svh !important;}',
    '#hero-content{padding-left:16px !important;padding-right:16px !important;padding-bottom:48px !important;}',
    '#hero-content h1{font-size:clamp(32px,9vw,64px) !important;line-height:1.05 !important;}',

    /* Grids */
    '#what-we-make-grid{grid-template-columns:1fr !important;}',
    '#featured-grid{grid-template-columns:repeat(2,1fr) !important;gap:12px !important;}',
    '#samples-grid{grid-template-columns:repeat(2,1fr) !important;gap:12px !important;}',
    '#related-grid{grid-template-columns:repeat(2,1fr) !important;gap:12px !important;}',

    /* Filter bar */
    '#filter-bar-wrap{width:100% !important;max-width:100vw !important;overflow-x:auto !important;}',
    '#filter-bar{flex-wrap:nowrap !important;overflow-x:auto !important;',
    '-webkit-overflow-scrolling:touch !important;scrollbar-width:none !important;',
    'padding-left:16px !important;padding-right:16px !important;}',
    '#filter-bar::-webkit-scrollbar{display:none;}',

    /* Typography */
    '.text-display-md,[class*="text-display"]{font-size:clamp(32px,9vw,64px) !important;line-height:1.05 !important;}',
    '.text-headline-lg,[class*="text-headline-lg"]{font-size:clamp(26px,7vw,48px) !important;}',

    /* Body text min size */
    'p,li,label{font-size:max(15px,1em) !important;}',

    /* iOS input zoom prevention */
    'input[type="text"],input[type="tel"],input[type="email"],',
    'input[type="number"],select,textarea{',
    'width:100% !important;font-size:16px !important;min-height:44px !important;}',

    /* Product page stacking */
    '.md\\:col-span-6{grid-column:span 12 !important;}',

    /* Footer */
    'footer .grid{grid-template-columns:1fr !important;}',

    /* Cookie popup */
    '#hfg-cookie-popup{width:calc(100vw - 24px) !important;',
    'left:12px !important;right:12px !important;bottom:12px !important;padding:20px !important;}',

    '}', /* end mobile */

    /* Very small screens */
    '@media(max-width:399px){',
    '#featured-grid,#samples-grid,#related-grid{grid-template-columns:1fr !important;}',
    '}'

  ].join('');
  document.head.appendChild(style);


  // ── 2. MOBILE MENU — ROBUST TOGGLE ──────────────────────────
  // injectNavbar() replaces #navbar-placeholder with outerHTML,
  // so we must attach listeners AFTER it runs. Poll for the button.
  function attachMobileMenu() {
    var btn = document.getElementById('mobile-menu-btn');
    var nav = document.getElementById('mobile-nav');
    if (!btn || !nav || btn.dataset.mfInit) return;
    btn.dataset.mfInit = '1';

    // Toggle open/close
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = nav.style.display === 'block';
      nav.style.display = open ? 'none' : 'block';
      // Scroll lock
      document.body.style.overflow = open ? '' : 'hidden';
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (nav.style.display !== 'block') return;
      if (!btn.contains(e.target) && !nav.contains(e.target)) {
        nav.style.display = 'none';
        document.body.style.overflow = '';
      }
    });

    // Close when a menu link is tapped
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.style.display = 'none';
        document.body.style.overflow = '';
      });
    });
  }

  // Poll until navbar is injected (max 5s)
  document.addEventListener('DOMContentLoaded', function () {
    var attempts = 0;
    var poll = setInterval(function () {
      attempts++;
      if (document.getElementById('mobile-menu-btn')) {
        clearInterval(poll);
        attachMobileMenu();
      }
      if (attempts > 100) clearInterval(poll); // 5s timeout
    }, 50);
  });


  // ── 3. EXTERNAL LINK SECURITY ───────────────────────────────
  // Add rel="noopener noreferrer" to all _blank links
  document.addEventListener('DOMContentLoaded', function () {
    // Run once now and re-run after dynamic content loads
    function fixExternalLinks() {
      document.querySelectorAll('a[target="_blank"]').forEach(function (a) {
        var rel = a.getAttribute('rel') || '';
        if (!rel.includes('noopener')) {
          a.setAttribute('rel', (rel + ' noopener noreferrer').trim());
        }
      });
      // WhatsApp links: ensure target + rel, and add GA4 click tracking
      document.querySelectorAll('a[href*="wa.me"]').forEach(function (a) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
        // Add tracking only once
        if (!a.dataset.hfgWaTracked) {
          a.dataset.hfgWaTracked = '1';
          a.addEventListener('click', function () {
            if (typeof gtag === 'function') {
              gtag('event', 'whatsapp_click', { event_category: 'contact', event_label: 'WhatsApp' });
            }
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({ event: 'whatsapp_click' });
          });
        }
      });
    }
    fixExternalLinks();
    // Re-run after dynamic content (footer, navbar) is injected
    setTimeout(fixExternalLinks, 500);
    setTimeout(fixExternalLinks, 2000);
  });


  // ── 4. IMAGE LAZY LOADING ────────────────────────────────────
  // Add loading="lazy" to all non-hero images not already marked
  document.addEventListener('DOMContentLoaded', function () {
    function applyLazyLoad() {
      document.querySelectorAll('img:not([loading])').forEach(function (img) {
        // Skip the hero background image (above the fold)
        if (img.id === 'hero-bg-img') return;
        img.setAttribute('loading', 'lazy');
      });
    }
    applyLazyLoad();
    // Re-run after dynamic grids populate
    setTimeout(applyLazyLoad, 1000);
    setTimeout(applyLazyLoad, 3000);
  });


  // ── 5. PRODUCT GRID FALLBACK (loading timeout) ───────────────
  // If a grid still shows "Loading" text after 10s, show a
  // helpful message instead of an infinite spinner.
  document.addEventListener('DOMContentLoaded', function () {
    ['samples-grid', 'featured-grid', 'what-we-make-grid'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      setTimeout(function () {
        var txt = (el.textContent || '').trim();
        if (txt === '' || txt.toLowerCase().includes('loading')) {
          el.innerHTML =
            '<div style="grid-column:1/-1;text-align:center;padding:48px 20px;opacity:0.45">' +
            '<p style="font-family:Anton,sans-serif;font-size:18px;text-transform:uppercase;' +
            'letter-spacing:0.1em;color:#1b1b1b">Products unavailable</p>' +
            '<p style="font-family:\'Hanken Grotesk\',sans-serif;font-size:14px;margin-top:8px;color:#707070">' +
            'Please visit the live site or open with a local server.</p>' +
            '</div>';
        }
      }, 10000);
    });
  });


  // ── 6. iOS VIEWPORT HEIGHT FIX ──────────────────────────────
  function setVH() {
    document.documentElement.style.setProperty('--vh', (window.innerHeight * 0.01) + 'px');
  }
  setVH();
  window.addEventListener('resize', setVH, { passive: true });
  window.addEventListener('orientationchange', setVH, { passive: true });


  // ── 7. SMOOTH ANCHOR SCROLL (offset for fixed header) ────────
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href').slice(1);
    var target = id ? document.getElementById(id) : null;
    if (!target) return;
    e.preventDefault();
    var navH = (document.querySelector('header') || { offsetHeight: 72 }).offsetHeight;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - navH - 8,
      behavior: 'smooth'
    });
  });


  // ── 8. DOM RENDER OPTIMISATION ──────────────────────────────
  // Patch DOMContentLoaded timing: if injectNavbar/injectFooter
  // are called before DOM is ready, defer them safely.
  // (They're currently called right after script tags at bottom of
  //  body, which is safe — but this guards against edge cases.)
  var _origInjectNavbar = null;
  var _origInjectFooter = null;
  document.addEventListener('DOMContentLoaded', function () {
    // Re-run navbar/footer injection if placeholders still exist
    var nbPlaceholder = document.getElementById('navbar-placeholder');
    var ftPlaceholder = document.getElementById('footer-placeholder');
    // If they were already replaced, these won't exist — nothing to do.
    // If still present after DOMContentLoaded, the inline script didn't run yet.
    // (This is an extra safety net — normally not needed.)
  });


  // ── 9. DATA SANITISATION HELPER ──────────────────────────────
  // Expose a safe text-escape function for use in product renders
  window.HFG_esc = function (str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

})();


/* ============================================================ */

// ============================================================
// MAIN.JS � Haute Fighting Gears
// Shared utilities: navbar, footer, toast, scroll reveal
// ============================================================

const WHATSAPP_NUMBER = '923148968805';

// -- Newsletter subscribe � global, called from footer onclick -
// NOTE: This function is intentionally left as a stub here.
// The real implementation lives in forms.js which is loaded on pages
// that have newsletter forms (contact, etc.). On pages that only load
// main.js (index, about, products), this stub handles the footer form.
var HFG_FORMS_URL = 'https://script.google.com/macros/s/AKfycbzw0mkThpAoQDI5WZ4EpRQwEnA-jNHIHkrgpk1AzMuUU9IpIfFyqHSmjw0SiFVbCmNx/exec';

function subscribeNewsletter() {
  var el = document.getElementById('newsletterEmail') ||
    document.getElementById('newsletter-email');
  var email = el ? el.value.trim() : '';
  if (!email) { _hfgToast('Please enter your email address.', 'error'); if (el) el.focus(); return; }
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) { _hfgToast('Please enter a valid email address.', 'error'); if (el) el.focus(); return; }
  var btn = document.querySelector('[onclick="subscribeNewsletter()"]');
  var originalBtnText = btn ? btn.innerHTML : '';
  if (el) el.disabled = true;
  if (btn) { btn.disabled = true; btn.innerHTML = 'Sending...'; }
  var fd = new FormData();
  fd.append('type', 'newsletter');
  fd.append('email', email);
  // Google Apps Script: treat any resolved fetch as success (response is always HTML redirect)
  fetch(HFG_FORMS_URL, { method: 'POST', body: fd })
    .then(function () {
      _hfgToast('Successfully subscribed to newsletter!', 'success');
      if (el) { el.value = ''; el.disabled = false; }
      if (btn) { btn.disabled = false; btn.innerHTML = originalBtnText; }
    })
    .catch(function (err) {
      console.error('[main] Newsletter network error:', err.message);
      if (el) el.disabled = false;
      if (btn) { btn.disabled = false; btn.innerHTML = originalBtnText; }
      _hfgToast('Could not connect. Please check your connection and try again.', 'error');
    });
}

// -- Inline toast � slides in from right bottom corner --------
function _hfgToast(msg, type) {
  var existing = document.getElementById('hfg-toast');
  if (existing) {
    clearTimeout(existing._hfgTimer);
    existing.remove();
  }

  // Strip leading emoji (? ?) from message
  var cleanMsg = msg.replace(/^[\u{1F300}-\u{1FAFF}\u2600-\u27BF]\s*/u, '').trim();

  var t = document.createElement('div');
  t.id = 'hfg-toast';

  var isSuccess = type === 'success';
  var accentColor = isSuccess ? '#ef4444' : '#ef4444';

  // Build inner HTML � left accent bar + message text
  t.innerHTML =
    '<div style="width:3px;background:' + accentColor + ';border-radius:2px;flex-shrink:0;align-self:stretch;"></div>' +
    '<span style="flex:1;line-height:1.45">' + cleanMsg + '</span>';

  Object.assign(t.style, {
    position: 'fixed',
    bottom: '28px',
    right: '28px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#111111',
    color: '#f5f5f5',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    padding: '14px 20px',
    fontSize: '13px',
    fontWeight: '500',
    fontFamily: 'inherit',
    letterSpacing: '0.01em',
    zIndex: '99999',
    minWidth: '260px',
    maxWidth: '360px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.55)',
    transform: 'translateX(calc(100% + 40px))',
    opacity: '0',
    transition: 'transform 0.38s cubic-bezier(0.22,1,0.36,1), opacity 0.28s ease'
  });

  document.body.appendChild(t);

  // Slide in
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      t.style.transform = 'translateX(0)';
      t.style.opacity = '1';
    });
  });

  // Slide out after 3.2s
  t._hfgTimer = setTimeout(function () {
    t.style.transform = 'translateX(calc(100% + 40px))';
    t.style.opacity = '0';
    setTimeout(function () { if (t.parentNode) t.remove(); }, 420);
  }, 3200);
}

// -- Mobile menu ----------------------------------------------
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const nav = document.getElementById('mobile-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => nav.classList.toggle('hidden'));
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !nav.contains(e.target)) nav.classList.add('hidden');
  });
}

// -- Scroll reveal --------------------------------------------
function initScrollReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('opacity-100', 'translate-y-0');
        e.target.classList.remove('opacity-0', 'translate-y-8');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('[data-reveal]').forEach(el => {
    el.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-8');
    obs.observe(el);
  });
}

// -- Toast ----------------------------------------------------
function showToast(message, type = 'success') {
  const old = document.getElementById('hfg-toast');
  if (old) old.remove();
  const t = document.createElement('div');
  t.id = 'hfg-toast';
  t.className = 'fixed bottom-6 right-6 z-[9999] px-6 py-4 font-label-bold uppercase tracking-widest text-white transition-all duration-300 translate-y-4 opacity-0 '
    + (type === 'success' ? 'bg-primary border-l-4 border-accent-red' : 'bg-accent-red');
  t.textContent = message;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.remove('translate-y-4', 'opacity-0'));
  setTimeout(() => {
    t.classList.add('translate-y-4', 'opacity-0');
    setTimeout(() => t.remove(), 300);
  }, 3000);
}

// -- Resolve relative path prefix from current page to site root --
function _getRootPfx() {
  return './';
}

// -- Format price ---------------------------------------------
function formatPrice(n) {
  if (n == null) return '';
  return '$' + parseFloat(n).toFixed(2);
}

// -- Send to WhatsApp ------------------------------------------
function sendToWhatsApp(message) {
  const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
  window.open(url, '_blank');
}

// -- Cart badge -----------------------------------------------
function updateCartBadge() {
  const count = (typeof Cart !== 'undefined') ? Cart.getCount() : 0;
  document.querySelectorAll('[data-cart-count]').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

// -- Init -----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // initMobileMenu() is intentionally not called here � navbar is injected
  // by injectNavbar() after DOMContentLoaded, so #mobile-menu-btn doesn't
  // exist yet. mobile-fixes.js handles mobile menu via its polling mechanism.
  initScrollReveal();
  // Cart functionality removed � using inquiry system instead
});

// -- Navbar ---------------------------------------------------
function injectNavbar(activePage) {
  const pages = [
    { key: 'home', label: 'Home', href: '/' },
    { key: 'samples', label: 'Products', href: '/products/' },
    { key: 'bulk', label: 'Inquiry', href: '/inquiry/' },
    { key: 'about', label: 'About Us', href: '/about/' },
    { key: 'contact', label: 'Contact', href: '/contact/' }
  ];

  // Desktop links � active gets red text + red underline, others are dark gray
  const dLinks = pages.map(p => {
    if (p.key === activePage) {
      return `<a href="${p.href}" style="color:#E10600;border-bottom:2px solid #E10600;padding-bottom:3px;font-size:13px;letter-spacing:0.12em;font-weight:700;text-transform:uppercase;text-decoration:none;white-space:nowrap">${p.label}</a>`;
    }
    return `<a href="${p.href}" style="color:#1b1b1b;font-size:13px;letter-spacing:0.12em;font-weight:600;text-transform:uppercase;text-decoration:none;white-space:nowrap" onmouseover="this.style.color='#E10600'" onmouseout="this.style.color='#1b1b1b'">${p.label}</a>`;
  }).join('');

  // Mobile links
  const mLinks = pages.map(p => {
    const activeStyle = p.key === activePage
      ? 'color:#E10600;border-left:3px solid #E10600;padding-left:16px;font-weight:700'
      : 'color:#1b1b1b;border-left:3px solid transparent;padding-left:16px;font-weight:600';
    return `<a href="${p.href}" style="${activeStyle};font-size:15px;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;display:flex;align-items:center;min-height:44px;padding-top:12px;padding-bottom:12px">${p.label}</a>`;
  }).join('');

  const html = `
<header style="position:fixed;width:100%;top:0;z-index:50;background:#ffffff;border-bottom:2px solid #1b1b1b">
  <nav style="display:flex;align-items:center;justify-content:space-between;padding:0 16px;max-width:1440px;margin:0 auto;height:72px">

    <!-- Logo -->
    <a href="/" style="text-decoration:none;flex-shrink:0;display:flex;align-items:center;height:72px">
      <img
        src="${window.HFG_BASE ? window.HFG_BASE + '/assets/images/logo.webp' : '/assets/images/logo.webp'}"
        alt="Haute Fighting Gears"
        style="height:28px;width:auto;display:block;object-fit:contain"
        onerror="this.style.display='none';this.nextElementSibling.style.display='block'"
      />
      <span style="display:none;font-size:22px;font-weight:900;letter-spacing:0.04em;text-transform:uppercase;color:#1b1b1b;font-family:Anton,sans-serif;white-space:nowrap">HAUTE FIGHTING GEARS</span>
    </a>

    <!-- Nav links: truly centered via absolute positioning -->
    <div style="position:absolute;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:32px" class="hfg-desktop-nav">
      ${dLinks}
    </div>

    <!-- Right: mobile toggle only (no cart) -->
    <div style="display:flex;align-items:center;gap:4px;flex-shrink:0">
      <button id="mobile-menu-btn" style="display:none;background:none;border:none;cursor:pointer;min-width:44px;min-height:44px;padding:8px;color:#1b1b1b;align-items:center;justify-content:center" class="hfg-mobile-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
    </div>

  </nav>

  <!-- Mobile nav drawer -->
  <div id="mobile-nav" style="display:none;background:#ffffff;border-top:1px solid #e5e5e5;padding:4px 16px 12px;position:relative;z-index:49;width:100%;box-shadow:0 8px 24px rgba(0,0,0,0.1)">
    ${mLinks}
  </div>
</header>

<style>
  @media (min-width: 768px) {
    header nav { padding-left: 48px !important; padding-right: 48px !important; }
  }
  @media (max-width: 767px) {
    .hfg-desktop-nav { display: none !important; }
    .hfg-mobile-btn  { display: flex !important; }
  }
</style>`;

  const el = document.getElementById('navbar-placeholder');
  if (el) el.outerHTML = html;
}

// -- Footer ---------------------------------------------------
function injectFooter() {

  const html = `
<footer class="w-full bg-primary border-t-4 border-accent-red">

  <style>
    /* -- FOOTER MOBILE ACCORDION � JS controls maxHeight via scrollHeight -- */
    /* CSS here handles only non-height concerns (cursor, arrow, border).     */
    /* The JS accordion injects its own style block for height + zoom effects. */
    @media (max-width: 768px) {

      /* Section separator */
      .hfg-footer-section {
        border-bottom: 1px solid rgba(255,255,255,0.08);
      }

      /* Heading tap target */
      .hfg-footer-title {
        display: flex !important;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        cursor: pointer;
        padding: 16px 0;
        margin-bottom: 0 !important;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
      }

      /* Arrow */
      .hfg-footer-arrow {
        font-size: 20px;
        transition: transform 0.3s ease;
        flex-shrink: 0;
        opacity: 0.7;
      }
    }

    /* -- DESKTOP � arrows hidden, content always visible -- */
    @media (min-width: 769px) {
      .hfg-footer-arrow {
        display: none !important;
      }
      .hfg-footer-title {
        margin-bottom: 1.5rem;
        cursor: default;
        pointer-events: none;
      }
      .hfg-footer-content {
        max-height: none !important;
        overflow: visible !important;
      }
    }

    /* -- SOCIAL ROW � copyright bar icons -- */
    .hfg-social-row {
      display: flex;
      gap: 18px;
      align-items: center;
    }
    .hfg-social-row a {
      color: rgba(198,198,198,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.25s ease, transform 0.25s ease;
      text-decoration: none;
      min-width: 7px;
      min-height: 7;
    }
    .hfg-social-row a:hover {
      color: #E10600;
      transform: translateY(-2px) scale(1.15);
    }
    @media (max-width: 768px) {
      .hfg-social-row {
        justify-content: center;
        margin-top: 0px;
      }
    }
  </style>

  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-5 md:px-[64px] py-[80px] max-w-[1440px] mx-auto text-on-primary">

    <!-- Brand � always visible, never collapses -->
    <div>
      <div class="mb-6">
        <img
          src="${window.HFG_BASE ? window.HFG_BASE + '/assets/images/logo.webp' : '/assets/images/logo.webp'}"
          alt="Haute Fighting Gears"
          style="height:36px;width:auto;object-fit:contain;filter:brightness(0) invert(1)"
          onerror="this.style.display='none';this.nextElementSibling.style.display='block'"
        />
        <div style="display:none">
          <div class="font-headline-lg text-headline-lg uppercase">HAUTE</div>
          <div class="font-headline-lg text-headline-lg uppercase text-accent-red">FIGHTING</div>
          <div class="font-headline-lg text-headline-lg uppercase">GEARS</div>
        </div>
      </div>
      <p class="text-primary-fixed-dim font-body-md opacity-80 mb-6 max-w-xs">
        Custom fight gear manufacturer for boxing, MMA, and training brands.
      </p>
      <a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank"
        class="inline-flex items-center gap-2 border-2 border-on-primary text-on-primary px-5 py-3 font-label-bold uppercase hover:bg-on-primary hover:text-primary transition-colors text-sm">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.998 2C6.477 2 2 6.477 2 12c0 1.99.574 3.844 1.567 5.403L2 22l4.759-1.538A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 11.998 2z"/></svg> WhatsApp Us
      </a>
    </div>

    <!-- Navigate � collapsible on mobile -->
    <div class="hfg-footer-section">
      <h5 class="hfg-footer-title font-label-bold uppercase text-accent-red">
        Navigate
        <svg class="hfg-footer-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0;opacity:0.7;transition:transform 0.3s ease"><path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </h5>
      <div class="hfg-footer-content">
        <ul class="flex flex-col gap-3">
          <li><a href="/"                    class="text-primary-fixed-dim opacity-80 hover:text-accent-red transition-colors font-body-md">Home</a></li>
          <li><a href="/products/"       class="text-primary-fixed-dim opacity-80 hover:text-accent-red transition-colors font-body-md">Products</a></li>
          <li><a href="/inquiry/"        class="text-primary-fixed-dim opacity-80 hover:text-accent-red transition-colors font-body-md">Inquiry</a></li>
          <li><a href="/about/"          class="text-primary-fixed-dim opacity-80 hover:text-accent-red transition-colors font-body-md">About Us</a></li>
          <li><a href="/contact/"        class="text-primary-fixed-dim opacity-80 hover:text-accent-red transition-colors font-body-md">Contact Us</a></li>
        </ul>
      </div>
    </div>

    <!-- Support � collapsible on mobile -->
    <div class="hfg-footer-section">
      <h5 class="hfg-footer-title font-label-bold uppercase text-accent-red">
        Support
        <svg class="hfg-footer-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0;opacity:0.7;transition:transform 0.3s ease"><path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </h5>
      <div class="hfg-footer-content">
        <ul class="flex flex-col gap-3">
          <li><a href="/privacy-policy/"  class="text-primary-fixed-dim opacity-80 hover:text-accent-red transition-colors font-body-md">Privacy Policy</a></li>
          <li><a href="/terms/"           class="text-primary-fixed-dim opacity-80 hover:text-accent-red transition-colors font-body-md">Terms &amp; Conditions</a></li>
          <li><a href="/shipping/"        class="text-primary-fixed-dim opacity-80 hover:text-accent-red transition-colors font-body-md">Shipping Info</a></li>
          <li><a href="/contact/"         class="text-primary-fixed-dim opacity-80 hover:text-accent-red transition-colors font-body-md">Contact</a></li>
        </ul>
      </div>
    </div>

    <!-- Newsletter � collapsible on mobile -->
    <div class="hfg-footer-section">
      <h5 class="hfg-footer-title font-label-bold uppercase text-accent-red">
        Newsletter
        <svg class="hfg-footer-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0;opacity:0.7;transition:transform 0.3s ease"><path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </h5>
      <div class="hfg-footer-content">
        <div>
          <p class="text-primary-fixed-dim font-body-md opacity-80 mb-5">Get updates on new products and offers.</p>
          <div class="flex flex-col gap-2">
            <input
              id="newsletter-email"
              type="email"
              placeholder="EMAIL ADDRESS"
              class="bg-transparent border border-on-primary/30 p-3 text-on-primary font-label-bold focus:border-accent-red focus:ring-0 w-full"
              style="font-size:13px;letter-spacing:0.08em"
            />
            <button
              onclick="subscribeNewsletter()"
              class="bg-on-primary text-primary py-3 font-label-bold uppercase hover:bg-accent-red hover:text-on-primary transition-colors"
              style="font-size:13px;letter-spacing:0.1em">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>

  <div class="border-t border-on-primary/10 py-2 px-2 md:px-[64px]">
    <div class="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
      <div class="text-primary-fixed-dim opacity-40 font-body-md text-sm">
        &copy; 2026 Haute Fighting Gears. All rights reserved.
      </div>
      <div class="hfg-social-row">
        <a href="https://www.instagram.com/hautefightinggears1/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
        </a>
        <a href="https://www.tiktok.com/@hautefightinggears" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.53V6.79a4.85 4.85 0 01-1.02-.1z"/></svg>
        </a>
        <a href="https://wa.me/923148968805" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </a>
      </div>
    </div>
  </div>
</footer>`;

  const el = document.getElementById('footer-placeholder');
  if (el) el.outerHTML = html;

  // -- Footer mobile accordion -------------------------------
  // Uses event delegation on document so it works regardless of when
  // the footer is injected and regardless of other click listeners.
  // Runs once per page � guarded by a flag on document.
  (function initFooterAccordion() {
    if (document._hfgFooterAccordion) return; // prevent duplicate binding
    document._hfgFooterAccordion = true;

    // -- CSS: inject zoom/lift effect for open sections (mobile only) --
    var style = document.createElement('style');
    style.textContent = [
      '@media (max-width: 768px) {',

      // Smooth height animation via JS-set maxHeight
      ' .hfg-footer-content {',
      '   max-height: 0;',
      '   overflow: hidden;',
      '   transition: max-height 0.32s cubic-bezier(0.22, 1, 0.36, 1);',
      ' }',

      // Zoom-over effect when section is open
      ' .hfg-footer-section {',
      '   transition: transform 0.3s ease, box-shadow 0.3s ease;',
      '   position: relative;',
      '   z-index: 1;',
      ' }',
      ' .hfg-footer-section.hfg-open {',
      '   z-index: 10;',
      '   transform: scale(1.02);',
      '   box-shadow: 0 8px 25px rgba(0,0,0,0.20);',
      ' }',

      // Arrow rotation
      ' .hfg-footer-section.hfg-open .hfg-footer-arrow {',
      '   transform: rotate(180deg);',
      ' }',

      '}'
    ].join('');
    document.head.appendChild(style);

    // -- Event delegation � catches clicks fired after dynamic injection --
    document.addEventListener('click', function (e) {
      // Only act on mobile
      if (window.innerWidth > 768) return;

      var title = e.target.closest('.hfg-footer-title');
      if (!title) return;

      // Stop the animations.js page-transition from intercepting this click
      e.stopImmediatePropagation();

      var section = title.closest('.hfg-footer-section');
      if (!section) return;

      var isOpen = section.classList.contains('hfg-open');
      var content = section.querySelector('.hfg-footer-content');

      // Close all open sections
      document.querySelectorAll('.hfg-footer-section').forEach(function (s) {
        if (s === section) return; // handle clicked one separately below
        s.classList.remove('hfg-open');
        var c = s.querySelector('.hfg-footer-content');
        if (c) c.style.maxHeight = null;
      });

      // Toggle the clicked section
      if (isOpen) {
        section.classList.remove('hfg-open');
        if (content) content.style.maxHeight = null;
      } else {
        section.classList.add('hfg-open');
        if (content) content.style.maxHeight = content.scrollHeight + 'px';
      }
    }, true); // useCapture: true � fires before any bubble-phase listeners

    // On resize to desktop: reset all states and inline heights
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) {
        document.querySelectorAll('.hfg-footer-section').forEach(function (s) {
          s.classList.remove('hfg-open');
          var c = s.querySelector('.hfg-footer-content');
          if (c) c.style.maxHeight = '';
        });
      }
    }, { passive: true });
  })();
}

// -- GA4 event helper -----------------------------------------
function _trackEvent(eventName, params) {
  try {
    if (typeof gtag === 'function') {
      gtag('event', eventName, params || {});
    }
    (window.dataLayer = window.dataLayer || []).push(
      Object.assign({ event: eventName }, params || {})
    );
  } catch (e) { /* silent */ }
}

// -- Track email + phone link clicks --------------------------
document.addEventListener('DOMContentLoaded', function () {
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href') || '';
    if (href.startsWith('mailto:')) {
      _trackEvent('email_click', { event_category: 'contact', event_label: href });
    } else if (href.startsWith('tel:')) {
      _trackEvent('phone_click', { event_category: 'contact', event_label: href });
    }
  });
});

// -- Contact / Question form -----------------------------------
function sendMessage() {
  var nameEl = document.getElementById('ct-name') || document.getElementById('name');
  var contactEl = document.getElementById('ct-contact') || document.getElementById('contact');
  var msgEl = document.getElementById('ct-msg') || document.getElementById('message');
  var name = nameEl ? nameEl.value.trim() : '';
  var contact = contactEl ? contactEl.value.trim() : '';
  var message = msgEl ? msgEl.value.trim() : '';
  if (!name) { _hfgToast('Please enter your name.', 'error'); if (nameEl) nameEl.focus(); return; }
  if (!contact) { _hfgToast('Please enter your contact info.', 'error'); if (contactEl) contactEl.focus(); return; }
  if (!message) { _hfgToast('Please enter your message.', 'error'); if (msgEl) msgEl.focus(); return; }
  var submitBtn = document.querySelector('#contact-form button[type="submit"]');
  if (submitBtn && submitBtn.disabled) return;
  var orig = submitBtn ? submitBtn.innerHTML : '';
  if (nameEl) nameEl.disabled = true;
  if (contactEl) contactEl.disabled = true;
  if (msgEl) msgEl.disabled = true;
  if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = 'Sending...'; }
  var isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
  var fd = new FormData();
  fd.append('type', 'message');
  fd.append('name', name);
  fd.append('email', isEmail ? contact : '');
  fd.append('contact', contact);
  fd.append('message', message);
  var reset = function () {
    if (nameEl) { nameEl.value = ''; nameEl.disabled = false; }
    if (contactEl) { contactEl.value = ''; contactEl.disabled = false; }
    if (msgEl) { msgEl.value = ''; msgEl.disabled = false; }
    if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = orig; }
  };
  fetch(HFG_FORMS_URL, { method: 'POST', body: fd })
    .then(function () {
      _trackEvent('contact_form_submit', { event_category: 'engagement', event_label: 'Contact Form' });
      _hfgToast('Message sent successfully! We\'ll get back to you soon.', 'success');
      reset();
    })
    .catch(function (err) {
      console.error('[forms] contact:', err.message);
      reset();
      _hfgToast('Could not connect. Please check your connection or contact us via WhatsApp.', 'error');
    });
}


// -- INQUIRY MODAL (merged from inquiry.js) ------------------
// INQUIRY.JS � Haute Fighting Gears
// Inquiry API � Order list sheet (Sheet1)
const INQUIRY_API_URL = 'https://script.google.com/macros/s/AKfycbyyE3jV4iLXrya3I168Tn6Iw8Sn-yiUU_4ftbgaYFlR4tTYrW02-uUIhTs0Z2HtQBLk/exec';

function showInquiryModal(productName) {
  productName = productName || '';
  var existing = document.getElementById('inquiry-modal');
  if (existing) existing.remove();
  var modal = document.createElement('div');
  modal.id = 'inquiry-modal';
  modal.innerHTML = '<div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;font-family:\'Hanken Grotesk\',sans-serif" id="inquiry-backdrop"><div style="background:white;border:2px solid #000;max-width:500px;width:100%;padding:32px;max-height:90vh;overflow-y:auto"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px"><h2 style="margin:0;font-size:28px;font-weight:900;text-transform:uppercase;letter-spacing:0.03em;font-family:Anton,sans-serif">REQUEST QUOTE</h2><button onclick="document.getElementById(\'inquiry-modal\').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;color:#1b1b1b;padding:0;width:32px;height:32px;display:flex;align-items:center;justify-content:center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6L18 18" stroke="#1b1b1b" stroke-width="2" stroke-linecap="round"/></svg></button></div><form id="inquiry-form" style="display:flex;flex-direction:column;gap:16px"><div><label style="display:block;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;color:#1b1b1b">Full Name *</label><input type="text" id="inquiry-name" placeholder="Your name" required style="width:100%;padding:12px;border:1px solid #ccc;font-size:14px;font-family:\'Hanken Grotesk\',sans-serif;box-sizing:border-box" /></div><div><label style="display:block;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;color:#1b1b1b">Email Address *</label><input type="email" id="inquiry-email" placeholder="your@email.com" required style="width:100%;padding:12px;border:1px solid #ccc;font-size:14px;font-family:\'Hanken Grotesk\',sans-serif;box-sizing:border-box" /></div><div><label style="display:block;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;color:#1b1b1b">Phone / WhatsApp *</label><input type="tel" id="inquiry-phone" placeholder="+92 3xx xxxx xxx" required style="width:100%;padding:12px;border:1px solid #ccc;font-size:14px;font-family:\'Hanken Grotesk\',sans-serif;box-sizing:border-box" /></div><div><label style="display:block;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;color:#1b1b1b">Product Name *</label><input type="text" id="inquiry-product" placeholder="e.g., Boxing Gloves" required value="' + productName + '" style="width:100%;padding:12px;border:1px solid #ccc;font-size:14px;font-family:\'Hanken Grotesk\',sans-serif;box-sizing:border-box" /></div><div><label style="display:block;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;color:#1b1b1b">Quantity *</label><input type="number" id="inquiry-quantity" placeholder="e.g., 100" min="1" required value="1" style="width:100%;padding:12px;border:1px solid #ccc;font-size:14px;font-family:\'Hanken Grotesk\',sans-serif;box-sizing:border-box" /></div><div><label style="display:block;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;color:#1b1b1b">Custom Requirements (Optional)</label><textarea id="inquiry-description" placeholder="Tell us about your custom requirements..." style="width:100%;padding:12px;border:1px solid #ccc;font-size:14px;font-family:\'Hanken Grotesk\',sans-serif;box-sizing:border-box;min-height:100px;resize:vertical"></textarea></div><button type="submit" id="inquiry-submit-btn" style="width:100%;background:#E10600;color:white;border:none;padding:16px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;cursor:pointer;font-family:\'Hanken Grotesk\',sans-serif;margin-top:8px" onmouseover="this.style.background=\'#000\'" onmouseout="this.style.background=\'#E10600\'">Submit Inquiry</button><button type="button" onclick="submitInquiryAsWhatsApp()" style="width:100%;background:transparent;color:#1b1b1b;border:2px solid #1b1b1b;padding:14px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;cursor:pointer;font-family:\'Hanken Grotesk\',sans-serif" onmouseover="this.style.background=\'#1b1b1b\';this.style.color=\'white\'" onmouseout="this.style.background=\'transparent\';this.style.color=\'#1b1b1b\'">Send via WhatsApp</button></form><p style="font-size:12px;color:#707070;text-align:center;margin-top:20px;margin-bottom:0">We\'ll respond within 24 hours.</p></div></div>';
  document.body.appendChild(modal);
  document.getElementById('inquiry-backdrop').addEventListener('click', function (e) { if (e.target === this) modal.remove(); });
  document.getElementById('inquiry-form').addEventListener('submit', function (e) { e.preventDefault(); submitInquiryToGoogleSheets(); });
  document.getElementById('inquiry-name').focus();
}

function submitInquiryToGoogleSheets() {
  var nameEl = document.getElementById('inquiry-name');
  var emailEl = document.getElementById('inquiry-email');
  var phoneEl = document.getElementById('inquiry-phone');
  var prodEl = document.getElementById('inquiry-product');
  var qtyEl = document.getElementById('inquiry-quantity');
  var descEl = document.getElementById('inquiry-description');

  var name = nameEl.value.trim();
  var email = emailEl.value.trim();
  var phone = phoneEl.value.trim();
  var prod = prodEl.value.trim();
  var qty = qtyEl.value.trim();
  var desc = descEl.value.trim();

  if (!name) { _hfgToast('Please enter your name.', 'error'); nameEl.focus(); return; }
  if (!email) { _hfgToast('Please enter your email.', 'error'); emailEl.focus(); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { _hfgToast('Please enter a valid email address.', 'error'); emailEl.focus(); return; }
  if (!phone) { _hfgToast('Please enter your phone number.', 'error'); phoneEl.focus(); return; }
  if (!prod) { _hfgToast('Please enter the product name.', 'error'); prodEl.focus(); return; }
  if (!qty || parseInt(qty) < 1) { _hfgToast('Please enter a valid quantity.', 'error'); qtyEl.focus(); return; }

  var btn = document.getElementById('inquiry-submit-btn');
  if (btn.disabled) return;
  var orig = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '? Sending...';
  btn.style.opacity = '0.7';
  [nameEl, emailEl, phoneEl, prodEl, qtyEl, descEl].forEach(function (el) { el.disabled = true; });

  var fd = new FormData();
  fd.append('name', name);
  fd.append('email', email);
  fd.append('phone', phone);
  fd.append('product', prod);
  fd.append('quantity', qty);
  fd.append('description', desc || 'N/A');

  fetch(INQUIRY_API_URL, { method: 'POST', body: fd })
    .then(function () {
      _trackEvent('inquiry_submit', { event_category: 'engagement', event_label: prod, value: parseInt(qty) || 1 });
      _hfgToast('Inquiry submitted successfully! We\'ll respond within 24 hours.', 'success');
      document.getElementById('inquiry-modal').remove();
    })
    .catch(function (err) {
      console.error('[inquiry] network error:', err.message);
      btn.disabled = false;
      btn.innerHTML = orig;
      btn.style.opacity = '1';
      [nameEl, emailEl, phoneEl, prodEl, qtyEl, descEl].forEach(function (el) { el.disabled = false; });
      _hfgToast('Could not connect. Please try WhatsApp instead.', 'error');
    });
}

function submitInquiryAsWhatsApp() {
  var name = (document.getElementById('inquiry-name').value || '').trim();
  var email = (document.getElementById('inquiry-email').value || '').trim();
  var phone = (document.getElementById('inquiry-phone').value || '').trim();
  var prod = (document.getElementById('inquiry-product').value || '').trim();
  var qty = (document.getElementById('inquiry-quantity').value || '').trim();
  var desc = (document.getElementById('inquiry-description').value || '').trim();
  if (!name || !email || !phone || !prod || !qty) { _hfgToast('Please fill in all required fields.', 'error'); return; }
  var msg = 'Hello! I want to inquire about:\n\nProduct: ' + prod + '\nQuantity: ' + qty +
    '\n\nName: ' + name + '\nEmail: ' + email + '\nPhone: ' + phone +
    (desc ? '\n\nRequirements:\n' + desc : '') + '\n\nPlease provide a quote.';
  window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg), '_blank');
  document.getElementById('inquiry-modal').remove();
}

function requestQuote(productName) { showInquiryModal(productName || ''); }

window.showInquiryModal = showInquiryModal;
window.requestQuote = requestQuote;
window.submitInquiryToGoogleSheets = submitInquiryToGoogleSheets;
window.submitInquiryAsWhatsApp = submitInquiryAsWhatsApp;


/* ============================================================ */

// ============================================================
// PRODUCTS-ENGINE.JS � Haute Fighting Gears
// Loads from products/products.json
// Works from ANY page depth (root, /pages/, etc.)
// Requires a local server (Live Server / localhost) � NOT file://
// ============================================================

// -- Note about file:// protocol ------------------------------
// Products will attempt to fetch from JSON, and fall back to
// inline data if the fetch fails (e.g. file:// or server issues).
if (window.location.protocol === 'file:') {
  console.warn('[products-engine] Running on file://. Products load from inline fallback data.');
}

// -- Category display name map � clean ecommerce labels -------
// Defined early so loadProducts() can reference it
const _categoryDisplayNames = {
  'street-fashion': 'Streetwear',
  'gym-fitness': 'Gym Wear',
  'mma': 'MMA',
  'boxing': 'Boxing Equipment',
  'sports': 'Sports Gear',
  'apparel': 'Apparel',
  'accessories': 'Accessories',
  'ring-equipment': 'Ring Equipment'
};

function _getCategoryLabel(cat) {
  return _categoryDisplayNames[cat.id] || cat.name;
}

// -- Resolve relative path prefix from current page to site root --
function _getRelativeRootPrefix() {
  const path = window.location.pathname;
  const cleaned = path.replace(/^\//, '').replace(/\/$/, '');
  const parts = cleaned.split('/').filter(Boolean);
  const depth = parts.length > 0 && parts[parts.length - 1].includes('.') ? parts.length - 1 : parts.length;
  return depth === 0 ? './' : '../'.repeat(depth);
}

// -- Resolve correct path to products.json from any page ------
function _getJsonPath() {
  return '/products/products.json';
}

// -- Relative fallback path (for file:// or sub-path deployments) --
function _getJsonPathRelative() {
  const root = _getRelativeRootPrefix();
  return root + 'products/products.json';
}

// -- Resolve correct path prefix for product page links -------
function _getPagePrefix() {
  return '/product/';
}

// -- Resolve correct path prefix for root-level links ---------
function _getRootPrefix() {
  return '/';
}

// Cache so we only fetch once per page load
let _productsCache = null;
let _categoriesCache = null;
let _rawDataCache = null;

// -- Inline product data � used as fallback when fetch fails --
// This guarantees products always show regardless of server setup.
const _INLINE_PRODUCT_DATA = { "categories": [{ "id": "boxing", "name": "Boxing Equipment", "products": [{ "id": "boxing-gloves", "name": "Boxing Gloves", "category": "Boxing Equipment", "image": "/assets/products/boxing-gloves/custom-boxing-gloves-cowhide-leather.webp", "images": ["/assets/products/boxing-gloves/custom-boxing-gloves-cowhide-leather.webp", "/assets/products/boxing-gloves/custom-boxing-gloves-pu-synthetic.webp", "/assets/products/boxing-gloves/custom-boxing-gloves-oem-manufacturer-sialkot.webp"], "description": "Professional-grade boxing gloves built for training, sparring, and competition. Choose your material and weight for the perfect fit.", "variants": [{ "id": "cowhide", "label": "Cowhide Leather" }, { "id": "cowhide-enhanced", "label": "Cowhide Enhanced Padding" }, { "id": "pu", "label": "PU Synthetic" }, { "id": "pu-molded", "label": "PU Hand Molded" }], "specs": { "Weight (oz)": ["8oz", "10oz", "12oz", "14oz", "16oz"], "Closure": ["Velcro", "Lace-Up"], "Color": ["Black", "Red", "Blue", "White", "Custom"] }, "seo": { "title": "Custom Boxing Gloves Manufacturer | Haute Fighting Gears", "description": "Private label custom boxing gloves manufactured in Sialkot, Pakistan. OEM, ODM, wholesale, custom colors, branding, worldwide shipping.", "slug": "boxing-gloves" } }, { "id": "boxing-head-guard", "name": "Boxing Head Guard", "category": "Boxing Equipment", "image": "/assets2/products/head-guard/boxing-head-guard-custom-sparring.webp", "images": ["/assets2/products/head-guard/boxing-head-guard-custom-sparring.webp", "/assets2/products/head-guard/boxing-head-guard-open-face-leather.webp", "/assets2/products/head-guard/boxing-head-guard-oem-manufacturer.webp"], "description": "Protective headgear designed for sparring with maximum safety, visibility, and comfort. Made from cowhide leather with high-density foam padding.", "variants": [{ "id": "open-face", "label": "Open Face" }, { "id": "nose-bar", "label": "Nose Bar" }], "specs": { "Size": ["S", "M", "L", "XL"], "Color": ["Black", "Red", "Blue", "White", "Custom"] }, "seo": { "title": "Custom Boxing Head Guard Manufacturer | Haute Fighting Gears", "description": "Private label boxing head guards manufactured in Sialkot, Pakistan. OEM, ODM, wholesale, custom colors, branding, worldwide shipping.", "slug": "boxing-head-guard" } }, { "id": "round-punching-mitt", "name": "Round Punching Mitt", "category": "Boxing Equipment", "image": "/assets2/products/round-punching-mitt/round-punching-mitt-custom-boxing.webp", "images": ["/assets2/products/round-punching-mitt/round-punching-mitt-custom-boxing.webp", "/assets2/products/round-punching-mitt/round-punching-mitt-cowhide-leather.webp", "/assets2/products/round-punching-mitt/round-punching-mitt-foam-padding.webp", "/assets2/products/round-punching-mitt/round-punching-mitt-coaching-training.webp", "/assets2/products/round-punching-mitt/round-punching-mitt-speed-combination.webp", "/assets2/products/round-punching-mitt/round-punching-mitt-pu-synthetic.webp", "/assets2/products/round-punching-mitt/round-punching-mitt-wholesale-sialkot.webp"], "description": "Professional round punching mitts manufactured for boxing, kickboxing, and MMA coaches. Lightweight construction with multi-layer padding provides superior shock absorption while allowing trainers to work on speed, precision, and combination drills. Fully customizable with your logo, colors, and branding.", "variants": [{ "id": "cowhide", "label": "Cowhide Leather" }, { "id": "pu", "label": "PU Synthetic" }], "specs": { "Color": ["Black", "Red", "Blue", "White", "Custom"], "Material": ["Cowhide Leather", "PU Synthetic"], "Hand": ["Left", "Right", "Pair"], "Logo": ["Yes", "No"] }, "seo": { "title": "Custom Round Punching Mitts Manufacturer | Haute Fighting Gears", "description": "Private label round punching mitts manufactured in Sialkot, Pakistan. OEM, ODM, wholesale, custom logo, colors, branding, worldwide shipping.", "slug": "round-punching-mitt" } }, { "id": "focus-mitt", "name": "Focus Mitt", "category": "Boxing Equipment", "image": "/assets/products/focus-mitt/focus-mitt-custom-boxing-coaching.webp", "images": ["/assets/products/focus-mitt/focus-mitt-custom-boxing-coaching.webp", "/assets/products/focus-mitt/focus-mitt-curved-leather-training.webp", "/assets/products/focus-mitt/focus-mitt-mma-muay-thai-kickboxing.webp", "/assets/products/focus-mitt/focus-mitt-high-density-foam-padding.webp", "/assets/products/focus-mitt/focus-mitt-pu-synthetic-oem.webp", "/assets/products/focus-mitt/focus-mitt-wholesale-private-label.webp"], "description": "Professional curved focus mitts manufactured for boxing, MMA, Muay Thai, and kickboxing coaching. High-density foam padding absorbs impact while maintaining lightweight performance for extended training sessions.", "variants": [{ "id": "cowhide", "label": "Cowhide Leather" }, { "id": "pu", "label": "PU Synthetic" }], "specs": { "Color": ["Black", "Red", "Blue", "White", "Custom"], "Material": ["Cowhide Leather", "PU Synthetic"], "Hand": ["Left", "Right", "Pair"], "Logo": ["Yes", "No"] }, "seo": { "title": "Custom Focus Mitts Manufacturer | Haute Fighting Gears", "description": "Private label focus mitts manufactured in Sialkot, Pakistan. OEM, ODM, wholesale, custom logo, colors, branding, worldwide shipping.", "slug": "focus-mitt" } }, { "id": "bag-mitt", "name": "Bag Mitt", "category": "Boxing Equipment", "image": "/assets/products/bag-mitt/bag-mitt-custom-boxing-training.webp", "images": ["/assets/products/bag-mitt/bag-mitt-custom-boxing-training.webp", "/assets/products/bag-mitt/bag-mitt-leather-heavy-bag-gloves.webp", "/assets/products/bag-mitt/bag-mitt-oem-private-label.webp", "/assets/products/bag-mitt/bag-mitt-wrist-support-padding.webp", "/assets/products/bag-mitt/bag-mitt-wholesale-manufacturer-sialkot.webp"], "description": "Premium bag mitts manufactured for heavy bag training and conditioning. Ergonomic design with shock-absorbing padding offers comfort, wrist support, and durability during intense workouts.", "variants": [{ "id": "cowhide", "label": "Cowhide Leather" }, { "id": "pu", "label": "PU Synthetic" }], "specs": { "Size": ["S", "M", "L", "XL"], "Color": ["Black", "Red", "Blue", "White", "Custom"], "Material": ["Cowhide Leather", "PU Synthetic"], "Logo": ["Yes", "No"] }, "seo": { "title": "Custom Bag Mitts Manufacturer | Haute Fighting Gears", "description": "Private label bag mitts manufactured in Sialkot, Pakistan. OEM, ODM, wholesale, custom logo, colors, branding, worldwide shipping.", "slug": "bag-mitt" } }, { "id": "double-end-ball", "name": "Double End Ball", "category": "Boxing Equipment", "image": "/assets/products/double-end-ball/double-end-ball-custom-boxing-speed.webp", "images": ["/assets/products/double-end-ball/double-end-ball-custom-boxing-speed.webp", "/assets/products/double-end-ball/double-end-ball-leather-training.webp", "/assets/products/double-end-ball/double-end-ball-pu-synthetic.webp", "/assets/products/double-end-ball/double-end-ball-timing-rhythm-drill.webp", "/assets/products/double-end-ball/double-end-ball-oem-private-label.webp", "/assets/products/double-end-ball/double-end-ball-wholesale-manufacturer.webp"], "description": "Professional double-end punching ball manufactured for improving speed, timing, rhythm, and defensive movement. Constructed using durable leather or PU with reinforced bladder for long-lasting performance.", "variants": [{ "id": "leather", "label": "Genuine Leather" }, { "id": "pu", "label": "PU Synthetic" }], "specs": { "Size": ["Small", "Medium", "Large"], "Color": ["Black", "Red", "Blue", "White", "Custom"], "Material": ["Genuine Leather", "PU Synthetic"], "Logo": ["Yes", "No"] }, "seo": { "title": "Custom Double End Ball Manufacturer | Haute Fighting Gears", "description": "Private label double end punching balls manufactured in Sialkot, Pakistan. OEM, ODM, wholesale, custom logo, colors, branding, worldwide shipping.", "slug": "double-end-ball" } }, { "id": "belly-pad", "name": "Belly Pad", "category": "Boxing Equipment", "image": "/assets/products/belly-pad/belly-pad-custom-boxing-muay-thai.webp", "images": ["/assets/products/belly-pad/belly-pad-custom-boxing-muay-thai.webp", "/assets/products/belly-pad/belly-pad-foam-padding-trainer.webp", "/assets/products/belly-pad/belly-pad-oem-manufacturer-sialkot.webp"], "description": "Professional belly pads manufactured for boxing, Muay Thai, MMA, and kickboxing coaching. Ergonomic curved design distributes impact across the torso while multi-layer foam absorbs powerful kicks and punches. Adjustable harness system fits all trainer body types.", "variants": [{ "id": "cowhide", "label": "Cowhide Leather" }, { "id": "pu", "label": "PU Synthetic" }, { "id": "microfiber", "label": "Microfiber Leather" }], "specs": { "Training Type": ["Boxing", "Muay Thai", "MMA / Kickboxing", "Universal"], "Padding": ["Standard Foam", "High Density", "Multi-Layer EVA"], "Closure": ["Hook & Loop (Velcro)", "Buckle Strap", "Hybrid"], "Size": ["S/M", "L/XL"], "Color": ["Black", "Red", "Blue", "White", "Custom"], "Logo": ["Yes", "No"] }, "seo": { "title": "Custom Belly Pad Manufacturer | Haute Fighting Gears", "description": "Private label belly pads manufactured in Sialkot, Pakistan. Boxing, Muay Thai, MMA training. OEM, ODM, wholesale, custom branding.", "slug": "belly-pad" } }, { "id": "groin-guard", "name": "Groin Guard", "category": "Boxing Equipment", "image": "/assets2/products/groin-guard/groin-guard-custom-boxing-mma.webp", "images": ["/assets2/products/groin-guard/groin-guard-custom-boxing-mma.webp", "/assets2/products/groin-guard/groin-guard-cup-style-protection.webp", "/assets2/products/groin-guard/groin-guard-foam-padding-manufacturer.webp", "/assets2/products/groin-guard/groin-guard-oem-private-label-sialkot.webp"], "description": "Professional groin guards manufactured for boxing, MMA, Muay Thai, and kickboxing. Constructed with high-density shock-absorbing foam and premium outer shell for maximum protection. Available in cup, suspender, and compression short styles with full custom branding.", "variants": [{ "id": "cup-style", "label": "Cup Style" }, { "id": "suspender", "label": "Suspender Style" }, { "id": "foul-protector", "label": "Foul Protector / Trunks Style" }], "specs": { "Size": ["S", "M", "L", "XL", "XXL"], "Material": ["Cowhide Leather", "PU Synthetic", "Neoprene"], "Padding": ["Standard Foam", "High Density", "Multi-Layer EVA"], "Color": ["Black", "Red", "Blue", "White", "Custom"], "Logo": ["Yes", "No"] }, "seo": { "title": "Custom Groin Guard Manufacturer | Haute Fighting Gears", "description": "Private label groin guards manufactured in Sialkot, Pakistan. Boxing, MMA, Muay Thai protection. OEM, ODM, wholesale, custom branding.", "slug": "groin-guard" } }, { "id": "bjj-belt", "name": "BJJ Belt", "category": "Boxing Equipment", "image": "/assets/products/bjj-belt/bjj-belt-custom-brazilian-jiu-jitsu.webp", "images": ["/assets/products/bjj-belt/bjj-belt-custom-brazilian-jiu-jitsu.webp", "/assets/products/bjj-belt/bjj-belt-all-ranks-custom-embroidery.webp", "/assets/products/bjj-belt/bjj-belt-ibjjf-standard-wholesale.webp"], "description": "Official Brazilian Jiu-Jitsu belts manufactured to IBJJF standards. Available across all belt ranks in premium cotton and pearl weave construction. Reinforced center bar and double-stitched edges for durability. Fully customizable with embroidery, woven labels, and custom packaging for academies and brands.", "variants": [{ "id": "cotton", "label": "Premium Cotton" }, { "id": "pearl-weave", "label": "Pearl Weave" }, { "id": "ripstop", "label": "Ripstop Cotton" }], "specs": { "Belt Rank": ["White", "Blue", "Purple", "Brown", "Black", "Red & Black (Coral)", "Red & White", "Red"], "Size": ["A0", "A1", "A2", "A3", "A4", "A5", "M0", "M1", "M2"], "Stitch Color": ["White", "Black", "Gold", "Red", "Blue", "Custom"], "Branding": ["Embroidery", "Woven Label", "Screen Print", "No Branding"], "Packaging": ["Standard", "Custom Hang Tag", "Custom Polybag", "Gift Box"] }, "seo": { "title": "Custom BJJ Belt Manufacturer | Haute Fighting Gears", "description": "Private label BJJ belts manufactured in Sialkot, Pakistan. All ranks, IBJJF standard, custom embroidery, woven labels, wholesale orders.", "slug": "bjj-belt" } }] }, { "id": "mma", "name": "MMA", "products": [{ "id": "quick-hand-wrap", "name": "Quick Hand Wrap", "category": "MMA", "image": "/assets2/products/mma-grappling-glove/mma-grappling-gloves-open-finger-custom.webp", "images": ["/assets2/products/mma-grappling-glove/mma-grappling-gloves-open-finger-custom.webp", "/assets2/products/mma-grappling-glove/mma-grappling-gloves-quick-hand-wrap.webp"], "description": "Open-finger gloves designed for grappling and striking, offering flexibility and protection. Available in PU Sparring or Cowhide Competition grade.", "variants": [{ "id": "pu-sparring", "label": "PU Sparring" }, { "id": "cowhide-competition", "label": "Cowhide Competition" }], "specs": { "Size": ["S", "M", "L", "XL"], "Finger Style": ["Open Finger", "Pre-Curved"], "Color": ["Black", "Red", "Blue", "White", "Custom"] }, "seo": { "title": "Custom MMA Grappling Gloves Manufacturer | Haute Fighting Gears", "description": "Private label MMA grappling gloves manufactured in Sialkot, Pakistan. OEM, ODM, wholesale, custom colors, branding, worldwide shipping.", "slug": "quick-hand-wrap" } }, { "id": "mma-gloves", "name": "MMA Gloves", "category": "MMA", "image": "/assets2/products/mma-gloves/mma-gloves-custom-training-sparring.webp", "images": ["/assets2/products/mma-gloves/mma-gloves-custom-training-sparring.webp", "/assets2/products/mma-gloves/mma-gloves-cowhide-leather-competition.webp", "/assets2/products/mma-gloves/mma-gloves-pu-synthetic-grappling.webp", "/assets2/products/mma-gloves/mma-gloves-oem-private-label-sialkot.webp"], "description": "High-performance MMA gloves designed for sparring, competition, and training. Manufactured with premium leather or PU and multi-layer foam padding to deliver comfort, protection, and flexibility.", "variants": [{ "id": "cowhide", "label": "Cowhide Leather" }, { "id": "pu", "label": "PU Synthetic" }], "specs": { "Size": ["XS", "S", "M", "L", "XL"], "Color": ["Black", "Red", "Blue", "White", "Custom"], "Material": ["Cowhide Leather", "PU Synthetic"], "Logo": ["Yes", "No"] }, "seo": { "title": "Custom MMA Gloves Manufacturer | Haute Fighting Gears", "description": "Private label custom MMA gloves manufactured in Sialkot, Pakistan. OEM, ODM, wholesale, custom colors, branding, worldwide shipping.", "slug": "mma-gloves" } }, { "id": "ear-guard", "name": "Ear Guard", "category": "MMA", "image": "/assets/products/ear-guard/ear-guard-wrestling-grappling-mma.webp", "images": ["/assets/products/ear-guard/ear-guard-wrestling-grappling-mma.webp", "/assets/products/ear-guard/ear-guard-adjustable-custom-brand.webp", "/assets/products/ear-guard/ear-guard-oem-manufacturer-sialkot.webp"], "description": "Premium wrestling and grappling ear guards designed to protect athletes during training and competition. Adjustable straps provide a secure and comfortable fit while reducing the risk of ear injuries.", "variants": [{ "id": "junior", "label": "Junior" }, { "id": "senior", "label": "Senior" }], "specs": { "Size": ["Junior", "Senior"], "Color": ["Black", "Red", "Blue", "White", "Custom"], "Material": ["PU Synthetic", "Cowhide Leather"], "Logo": ["Yes", "No"] }, "seo": { "title": "Custom Ear Guards Manufacturer | Haute Fighting Gears", "description": "Private label wrestling and MMA ear guards manufactured in Sialkot, Pakistan. OEM, ODM, wholesale, custom colors, branding, worldwide shipping.", "slug": "ear-guard" } }, { "id": "chest-guard", "name": "Chest Guard", "category": "MMA", "image": "/assets/products/chest-guard/chest-guard-custom-mma-muay-thai.webp", "images": ["/assets/products/chest-guard/chest-guard-custom-mma-muay-thai.webp", "/assets/products/chest-guard/chest-guard-foam-padding-protection.webp", "/assets/products/chest-guard/chest-guard-taekwondo-kickboxing.webp", "/assets/products/chest-guard/chest-guard-adult-youth-sizes.webp", "/assets/products/chest-guard/chest-guard-oem-manufacturer-sialkot.webp"], "description": "Professional chest protectors manufactured for Taekwondo, Muay Thai, MMA, and kickboxing training and competition. Constructed with high-impact foam padding and reinforced outer shell for superior protection. Available in adult and youth sizing with full custom branding.", "variants": [{ "id": "adult", "label": "Adult" }, { "id": "youth", "label": "Youth / Junior" }, { "id": "female", "label": "Female Cut" }], "specs": { "Size": ["XS", "S", "M", "L", "XL", "XXL"], "Material": ["PU Synthetic", "Cowhide Leather", "Neoprene Shell"], "Padding": ["Standard Foam", "High Density EVA", "Multi-Layer"], "Closure": ["Hook & Loop Back Strap", "Full Zipper", "Side Buckles"], "Color": ["Black", "Red", "Blue", "White", "Custom"], "Logo": ["Yes", "No"] }, "seo": { "title": "Custom Chest Guard Manufacturer | Haute Fighting Gears", "description": "Private label chest guards manufactured in Sialkot, Pakistan. Taekwondo, Muay Thai, MMA. Adult and youth sizes. OEM, ODM, wholesale.", "slug": "chest-guard" } }] }, { "id": "apparel", "name": "Apparel", "products": [{ "id": "muay-thai-shorts", "name": "Muay Thai Shorts", "category": "Apparel", "image": "/assets2/products/muay-thai-shorts/muay-thai-shorts-custom-satin.webp", "images": ["/assets2/products/muay-thai-shorts/muay-thai-shorts-custom-satin.webp", "/assets2/products/muay-thai-shorts/muay-thai-shorts-sublimation-print.webp", "/assets2/products/muay-thai-shorts/muay-thai-shorts-polyester-lightweight.webp", "/assets2/products/muay-thai-shorts/muay-thai-shorts-oem-wholesale-sialkot.webp"], "description": "Premium Muay Thai shorts designed for unrestricted movement during training and competition. Manufactured using lightweight satin or polyester fabric with reinforced stitching and customizable sublimation or embroidery.", "variants": [{ "id": "satin", "label": "Satin" }, { "id": "polyester", "label": "Polyester" }], "specs": { "Size": ["XS", "S", "M", "L", "XL", "XXL"], "Color": ["Black", "Red", "Blue", "White", "Gold", "Custom"], "Material": ["Satin", "Polyester"], "Logo": ["Sublimation", "Embroidery", "No"] }, "seo": { "title": "Custom Muay Thai Shorts Manufacturer | Haute Fighting Gears", "description": "Private label custom Muay Thai shorts manufactured in Sialkot, Pakistan. OEM, ODM, wholesale, sublimation, embroidery, worldwide shipping.", "slug": "muay-thai-shorts" } }, { "id": "boxing-shoes", "name": "Boxing Shoes", "category": "Apparel", "image": "/assets/products/boxing-shoe/boxing-shoes-custom-professional.webp", "images": ["/assets/products/boxing-shoe/boxing-shoes-custom-professional.webp", "/assets/products/boxing-shoe/boxing-shoes-high-top-training.webp", "/assets/products/boxing-shoe/boxing-shoes-low-top-lightweight.webp", "/assets/products/boxing-shoe/boxing-shoes-sole-grip-detail.webp", "/assets/products/boxing-shoe/boxing-shoes-oem-manufacturer.webp", "/assets/products/boxing-shoe/boxing-shoes-private-label-sialkot.webp"], "description": "Professional boxing shoes engineered for agility, stability, and comfort inside the ring. Lightweight construction with durable sole provides superior grip and foot support during training and competition.", "variants": [{ "id": "low-top", "label": "Low Top" }, { "id": "high-top", "label": "High Top" }], "specs": { "Size": ["US 5", "US 6", "US 7", "US 8", "US 9", "US 10", "US 11", "US 12", "US 13"], "Color": ["Black", "Red", "Blue", "White", "Custom"], "Material": ["Synthetic Leather", "Genuine Leather"], "Logo": ["Yes", "No"] }, "seo": { "title": "Custom Boxing Shoes Manufacturer | Haute Fighting Gears", "description": "Private label boxing shoes manufactured in Sialkot, Pakistan. OEM, ODM, wholesale, custom colors, branding, worldwide shipping.", "slug": "boxing-shoes" } }, { "id": "boxing-robe", "name": "Boxing Robe", "category": "Apparel", "image": "/assets/products/boxing-robe/boxing-robe-custom-satin-ringwalk.webp", "images": ["/assets/products/boxing-robe/boxing-robe-custom-satin-ringwalk.webp", "/assets/products/boxing-robe/boxing-robe-embroidery-sublimation.webp", "/assets/products/boxing-robe/boxing-robe-hooded-custom-brand.webp", "/assets/products/boxing-robe/boxing-robe-full-length-private-label.webp", "/assets/products/boxing-robe/boxing-robe-wholesale-manufacturer-sialkot.webp"], "description": "Professional boxing robes manufactured for ring walk, competition, and team branding. Lightweight satin construction with optional hood, custom embroidery, and sublimation printing. Available in full-length and short cut styles for both men and women.", "variants": [{ "id": "satin", "label": "Satin" }, { "id": "polyester-satin", "label": "Polyester Satin" }, { "id": "lightweight-satin", "label": "Lightweight Satin" }], "specs": { "Size": ["XS", "S", "M", "L", "XL", "XXL", "Custom"], "Length": ["Short (Hip)", "Mid (Thigh)", "Full Length"], "Sleeve": ["Short Sleeve", "Long Sleeve"], "Hood": ["With Hood", "Without Hood"], "Color": ["Black", "Red", "Blue", "White", "Gold", "Custom"], "Trim Color": ["Gold", "Silver", "Contrast Color", "Custom"], "Branding": ["Embroidery", "Sublimation", "Screen Print", "Woven Label"] }, "seo": { "title": "Custom Boxing Robe Manufacturer | Haute Fighting Gears", "description": "Private label boxing robes manufactured in Sialkot, Pakistan. Satin, custom colors, hood options, embroidery and sublimation. OEM wholesale.", "slug": "boxing-robe" } }] }, { "id": "accessories", "name": "Accessories", "products": [{ "id": "boxing-gloves-keychain", "name": "Boxing Gloves Keychain", "category": "Accessories", "image": "/assets/products/boxing-gloves-keychain/boxing-gloves-keychain-custom-mini.webp", "images": ["/assets/products/boxing-gloves-keychain/boxing-gloves-keychain-custom-mini.webp", "/assets/products/boxing-gloves-keychain/boxing-gloves-keychain-pu-leather.webp", "/assets/products/boxing-gloves-keychain/boxing-gloves-keychain-wholesale-branded.webp"], "description": "Custom mini boxing glove keychains manufactured using durable synthetic leather. Perfect for promotional events, retail merchandise, gifts, and private label branding.", "variants": [{ "id": "pu", "label": "PU Synthetic" }, { "id": "cowhide", "label": "Cowhide Leather" }], "specs": { "Color": ["Black", "Red", "Blue", "White", "Custom"], "Material": ["PU Synthetic", "Cowhide Leather"], "Logo": ["Yes", "No"] }, "seo": { "title": "Custom Boxing Gloves Keychain Manufacturer | Haute Fighting Gears", "description": "Private label mini boxing glove keychains manufactured in Sialkot, Pakistan. OEM, ODM, wholesale, custom logo, colors, worldwide shipping.", "slug": "boxing-gloves-keychain" } }, { "id": "ufc-gloves-keychain", "name": "UFC Gloves Keychain", "category": "Accessories", "image": "/assets2/products/ufc-gloves-keychain/ufc-gloves-keychain-custom-mini.webp", "images": ["/assets2/products/ufc-gloves-keychain/ufc-gloves-keychain-custom-mini.webp", "/assets2/products/ufc-gloves-keychain/ufc-gloves-keychain-pu-leather.webp", "/assets2/products/ufc-gloves-keychain/ufc-gloves-keychain-branded-promotional.webp", "/assets2/products/ufc-gloves-keychain/ufc-gloves-keychain-sports-merchandise.webp", "/assets2/products/ufc-gloves-keychain/ufc-gloves-keychain-wholesale-oem.webp"], "description": "Miniature boxing-inspired keychain manufactured from premium synthetic leather. Ideal for promotional giveaways, gyms, sports brands, and merchandise collections. Fully customizable with logos and colors.", "variants": [{ "id": "pu", "label": "PU Synthetic" }, { "id": "cowhide", "label": "Cowhide Leather" }], "specs": { "Color": ["Black", "Red", "Blue", "White", "Custom"], "Material": ["PU Synthetic", "Cowhide Leather"], "Logo": ["Yes", "No"] }, "seo": { "title": "Custom UFC Gloves Keychain Manufacturer | Haute Fighting Gears", "description": "Private label UFC-style mini glove keychains manufactured in Sialkot, Pakistan. OEM, ODM, wholesale, custom logo, colors, worldwide shipping.", "slug": "ufc-gloves-keychain" } }] }, { "id": "gym-fitness", "name": "Gym & Fitness", "products": [{ "id": "inner-gloves", "name": "Hand Wraps", "category": "Gym & Fitness", "image": "/assets2/products/hand-wrap-gloves/hand-wraps-inner-gloves-boxing.webp", "images": ["/assets2/products/hand-wrap-gloves/hand-wraps-inner-gloves-boxing.webp", "/assets2/products/hand-wrap-gloves/hand-wraps-wrist-knuckle-protection.webp"], "description": "Durable hand wraps providing wrist stability and knuckle protection for training and fights. Available in Cotton/Nylon, Gel, or Quick Wrap styles.", "variants": [{ "id": "cotton", "label": "Cotton / Nylon" }, { "id": "gel", "label": "Gel Wrap" }, { "id": "quick-wrap", "label": "Quick Wrap" }], "specs": { "Length": ["1.5m", "3m", "4m", "4.5m"], "Color": ["Black", "Red", "Blue", "White", "Pink", "Custom"] }, "seo": { "title": "Custom Hand Wraps Manufacturer | Haute Fighting Gears", "description": "Private label hand wraps manufactured in Sialkot, Pakistan. OEM, ODM, wholesale, custom colors, branding, worldwide shipping.", "slug": "inner-gloves" } }, { "id": "hand-wrap", "name": "Hand Wrap", "category": "Gym & Fitness", "image": "/assets2/products/hand-wrap/hand-wrap-custom-boxing-muay-thai.webp", "images": ["/assets2/products/hand-wrap/hand-wrap-custom-boxing-muay-thai.webp", "/assets2/products/hand-wrap/hand-wrap-elastic-cotton-training.webp", "/assets2/products/hand-wrap/hand-wrap-quick-wrap-gel-style.webp", "/assets2/products/hand-wrap/hand-wrap-oem-wholesale-manufacturer.webp"], "description": "Professional hand wraps manufactured for boxing, Muay Thai, MMA, and kickboxing. Provides essential wrist support, knuckle protection, and hand stabilization during training and competition. Available in traditional cotton, elastic cotton, and quick-wrap styles with custom lengths and private label branding.", "variants": [{ "id": "cotton", "label": "Traditional Cotton" }, { "id": "elastic-cotton", "label": "Elastic Cotton" }, { "id": "quick-wrap", "label": "Quick Wrap / Gel" }, { "id": "semi-elastic", "label": "Semi-Elastic" }], "specs": { "Length": ["2.5m", "3m", "4m", "4.5m", "5m"], "Color": ["Black", "Red", "Blue", "White", "Pink", "Yellow", "Custom"], "Thumb Loop": ["Yes", "No"], "Closure": ["Hook-and-Loop Velcro", "Elastic Cuff"], "Label": ["Woven Label", "Printed Label", "Custom Branding"] }, "seo": { "title": "Custom Hand Wraps Manufacturer | Haute Fighting Gears", "description": "Private label hand wraps manufactured in Sialkot, Pakistan. Cotton, elastic, gel wraps in custom lengths, colors and branding. OEM wholesale.", "slug": "hand-wrap" } }] }, { "id": "ring-equipment", "name": "Ring Equipment", "products": [{ "id": "boxing-ring", "name": "Boxing Ring", "category": "Ring Equipment", "image": "/assets/products/boxing-ring/professional-boxing-ring-custom-manufacturer.webp", "images": ["/assets/products/boxing-ring/professional-boxing-ring-custom-manufacturer.webp", "/assets/products/boxing-ring/boxing-ring-rope-corner-pads-custom.webp", "/assets/products/boxing-ring/boxing-ring-oem-wholesale-sialkot.webp"], "description": "Professional boxing rings manufactured for gyms, promotions, training centers, and events. Fully custom built with your choice of ring size, rope colors, corner pad colors, canvas design, and complete branding. Flat-pack shipping worldwide with assembly instructions included.", "variants": [{ "id": "training", "label": "Training Ring" }, { "id": "competition", "label": "Competition Ring" }, { "id": "portable", "label": "Portable / Collapsible" }], "specs": { "Ring Size": ["14ft x 14ft", "16ft x 16ft", "18ft x 18ft", "20ft x 20ft", "22ft x 22ft", "Custom"], "Ropes": ["3 Ropes", "4 Ropes"], "Rope Color": ["Red / Blue / White", "Custom Colors"], "Corner Pad Color": ["Red", "Blue", "Black", "Custom"], "Frame Finish": ["Black Powder Coat", "Chrome", "Custom Color"], "Canvas": ["Printed Canvas", "Plain Canvas", "No Canvas"] }, "seo": { "title": "Custom Boxing Ring Manufacturer | Haute Fighting Gears", "description": "Professional boxing rings manufactured in Sialkot, Pakistan. Custom size, rope colors, canvas printing, OEM, ODM, wholesale, worldwide shipping.", "slug": "boxing-ring" } }, { "id": "ring-canvas", "name": "Ring Canvas", "category": "Ring Equipment", "image": "/assets2/products/ring-canvas/boxing-ring-canvas-custom-sublimation.webp", "images": ["/assets2/products/ring-canvas/boxing-ring-canvas-custom-sublimation.webp", "/assets2/products/ring-canvas/boxing-ring-canvas-vinyl-non-slip.webp", "/assets2/products/ring-canvas/boxing-ring-canvas-logo-branding.webp", "/assets2/products/ring-canvas/boxing-ring-canvas-reinforced-eyelets.webp", "/assets2/products/ring-canvas/boxing-ring-canvas-oem-manufacturer.webp"], "description": "Professional boxing ring canvas covers manufactured for competition and training rings. Heavy-duty vinyl construction with non-slip surface treatment and reinforced eyelets for secure ring attachment. Available in standard and custom sizes with full sublimation branding for gyms, promotions, and TV events.", "variants": [{ "id": "standard-vinyl", "label": "Standard Vinyl" }, { "id": "premium-vinyl", "label": "Premium Non-Slip Vinyl" }, { "id": "custom-sublimated", "label": "Custom Sublimated" }], "specs": { "Ring Size": ["16\ufffd16 ft", "18\ufffd18 ft", "20\ufffd20 ft", "22\ufffd22 ft", "24\ufffd24 ft", "Custom"], "Surface": ["Standard Grip", "Non-Slip Texture", "Competition Grade"], "Printing": ["Sublimation (Full Design)", "Screen Print (Logo)", "Plain / No Print"], "Eyelets": ["Standard Brass", "Reinforced Heavy Duty"], "Color": ["White", "Blue", "Grey", "Custom"] }, "seo": { "title": "Custom Ring Canvas Manufacturer | Haute Fighting Gears", "description": "Professional boxing ring canvas manufactured in Sialkot, Pakistan. Custom sizes, sublimation printing, reinforced edges. OEM, wholesale.", "slug": "ring-canvas" } }] }] };

// -- Core fetch � shared by loadProducts and loadCategories ---
async function _fetchProductData() {
  if (_rawDataCache) return _rawDataCache;

  // Try absolute path first (works on any proper server / GitHub Pages root)
  const urlAbsolute = _getJsonPath();
  // Try relative path second (works when site is in a subdirectory)
  const urlRelative = _getJsonPathRelative();

  const urlsToTry = [urlAbsolute];
  // Only add relative if it differs from absolute
  if (urlRelative !== urlAbsolute) urlsToTry.push(urlRelative);

  for (const url of urlsToTry) {
    try {
      const res = await fetch(url);
      if (!res.ok) { continue; }
      const data = await res.json();
      _rawDataCache = data;
      return _rawDataCache;
    } catch (e) { continue; }
  }
  _rawDataCache = _INLINE_PRODUCT_DATA;
  return _rawDataCache;
}

// -- Load all products (flattened array) -----------------------
async function loadProducts() {
  if (_productsCache) return _productsCache;
  try {
    const data = await _fetchProductData();
    _productsCache = [];
    (data.categories || []).forEach(cat => {
      (cat.products || []).forEach(p => {
        _productsCache.push({
          ...p,
          categoryId: cat.id,
          categoryName: _categoryDisplayNames[cat.id] || cat.name
        });
      });
    });
    return _productsCache;
  } catch (e) {
    console.error('[products-engine] Failed to load products:', e.message);
    _rawDataCache = null;
    return [];
  }
}

// -- Load ONLY the real sample products (have local images + specs) --
// Used by Samples page and Featured sections � NOT by Bulk/Custom dropdowns
const _REAL_PRODUCT_IDS = [
  'boxing-gloves', 'boxing-head-guard', 'inner-gloves', 'quick-hand-wrap',
  'round-punching-mitt', 'focus-mitt', 'bag-mitt', 'double-end-ball',
  'mma-gloves', 'ear-guard', 'muay-thai-shorts', 'boxing-shoes',
  'boxing-gloves-keychain', 'ufc-gloves-keychain',
  'bjj-belt', 'belly-pad', 'ring-canvas', 'groin-guard',
  'chest-guard', 'boxing-robe', 'hand-wrap', 'boxing-ring'
];

async function loadSampleProducts() {
  const all = await loadProducts();
  return all.filter(p => _REAL_PRODUCT_IDS.includes(p.id));
}

// -- Get tiered price for a product based on variant + quantity -
// variant: variant object from product.variants[], or null for legacy pricing
// qty: number
function getPrice(product, qty, variant) {
  qty = parseInt(qty) || 1;
  // Use variant pricing if provided
  const pricing = (variant && variant.pricing) ? variant.pricing
    : (product && product.pricing) ? product.pricing
      : null;
  if (!pricing) return null;
  if (qty >= 50) return pricing['50'];
  if (qty >= 25) return pricing['25'];
  return pricing['1'];
}

function getStartingPrice(product) {
  if (!product) return null;
  // Use first variant's pricing if variants exist
  if (product.variants && product.variants.length > 0) {
    return product.variants[0].pricing['1'];
  }
  if (product.pricing) return product.pricing['1'];
  return null;
}

function formatPrice(price) {
  if (price == null) return '';
  return '$' + parseFloat(price).toFixed(2);
}

// -- Load categories -------------------------------------------
async function loadCategories() {
  if (_categoriesCache) return _categoriesCache;
  try {
    const data = await _fetchProductData();
    _categoriesCache = data.categories;
    return _categoriesCache;
  } catch (e) {
    console.error('[products-engine] Failed to load categories:', e.message);
    return [];
  }
}

// -- Get single product by id ----------------------------------
async function getProductById(id) {
  const products = await loadProducts();
  return products.find(p => p.id === id) || null;
}

// -- Resolve image URL � always returns a valid image ---------
function _resolveImage(p, index) {
  index = index || 0;

  // If product has a local images array, use it
  if (p.images && p.images.length > index) {
    return _toAbsoluteProductPath(p.images[index]);
  }

  // If product has a single local image path (starts with ../ or ./)
  if (p.image && (p.image.startsWith('../') || p.image.startsWith('./'))) {
    return _toAbsoluteProductPath(p.image);
  }

  // Use the product's own image if it's a real external URL
  if (
    p.image &&
    p.image.startsWith('http') &&
    !p.image.includes('via.placeholder.com') &&
    !p.image.includes('data:image/svg')
  ) {
    return p.image;
  }

  // Category-level fallback images (Unsplash)
  const categoryImages = {
    'street-fashion': 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&h=400&fit=crop&auto=format',
    'gym-fitness': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format',
    'mma': 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400&h=400&fit=crop&auto=format',
    'boxing': 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400&h=400&fit=crop&auto=format',
    'sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop&auto=format'
  };

  return categoryImages[p.categoryId] ||
    'data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%22400%22 height%3D%22400%22%3E%3Crect width%3D%22400%22 height%3D%22400%22 fill%3D%22%231b1b1b%22%2F%3E%3C%2Fsvg%3E';
}

// Convert a product image path to the correct absolute URL
function _toAbsoluteProductPath(relativePath) {
  // Already absolute — return as-is
  if (relativePath.startsWith('/')) {
    return relativePath;
  }
  // Strip leading ../ or ./
  const clean = relativePath.replace(/^(\.\.\/|\.\/)+/, '');
  return '/' + clean;
}

// -- Build product dropdown options HTML -----------------------
async function buildProductOptions(selectedId) {
  const categories = await loadCategories();
  if (!categories || categories.length === 0) {
    return '<option value="">--- No products found ---</option>';
  }
  let html = '<option value="">--- Select a product ---</option>';
  categories.forEach(cat => {
    html += `<optgroup label="${cat.name}">`;
    cat.products.forEach(p => {
      if (!p.id || !p.name) return; // skip malformed entries
      const sel = p.id === selectedId ? ' selected' : '';
      html += `<option value="${p.id}"${sel}>${p.name}</option>`;
    });
    html += '</optgroup>';
  });
  return html;
}

// -- Render product grid ---------------------------------------
// filter: category id string, or 'all'
async function renderProductGrid(container, filter) {
  filter = filter || 'all';
  const products = await loadProducts();
  const list = filter === 'all' ? products : products.filter(p => p.categoryId === filter);

  if (list.length === 0) {
    container.innerHTML = '<div class="col-span-4 text-center py-20 font-label-bold uppercase opacity-40">No products found</div>';
    return;
  }

  const pagePrefix = _getPagePrefix();
  const rootPrefix = _getRootPrefix();

  container.innerHTML = list.map(p => {
    const img = _resolveImage(p, 0);

    const target = `/product/?id=${encodeURIComponent(p.id)}`;
    return `
        <a href="${target}" class="group border border-outline-variant bg-surface-container-lowest overflow-hidden flex flex-col" data-reveal style="text-decoration:none;color:inherit;display:flex">
            <div style="width:100%;background:#fff;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;aspect-ratio:1/1;border-bottom:1px solid #eee">
                <img
                    src="${img}"
                    alt="${p.name}"
                    loading="lazy"
                    class="transition-transform duration-500 group-hover:scale-105"
                    style="display:block;width:100%;height:auto;object-fit:contain;padding:8px"
                    onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%22400%22 height%3D%22400%22%3E%3Crect width%3D%22400%22 height%3D%22400%22 fill%3D%22%23eeeeee%22%2F%3E%3C%2Fsvg%3E'"
                />
            </div>
            <div class="p-5 flex flex-col flex-grow">
                <h3 class="font-headline-md text-headline-md uppercase mb-1 leading-tight" style="font-size:17px">${p.name}</h3>
                <p class="font-body-md text-neutral-gray mb-4" style="font-size:12px;font-weight:400;letter-spacing:0.04em">${p.categoryName || p.category || ''}</p>
                <div class="mt-auto">
                    <span class="w-full bg-accent-red text-on-primary py-3 font-label-bold uppercase flex items-center justify-center gap-2 text-center" style="pointer-events:none">
                        Send Inquiry
                    </span>
                </div>
            </div>
        </a>`;
  }).join('');

  if (typeof initScrollReveal === 'function') initScrollReveal();
}

// -- Build category filter buttons -----------------------------
async function buildCategoryFilters(container, activeId, onFilter) {
  const categories = await loadCategories();
  const allActive = (!activeId || activeId === 'all') ? 'bg-primary text-on-primary' : '';
  let html = `<button data-filter="all" class="filter-btn ${allActive} px-5 py-2 font-label-bold uppercase border-2 border-primary hover:bg-primary hover:text-on-primary transition-all">All Products</button>`;
  categories.forEach(cat => {
    const active = cat.id === activeId ? 'bg-primary text-on-primary' : '';
    html += `<button data-filter="${cat.id}" class="filter-btn ${active} px-5 py-2 font-label-bold uppercase border-2 border-primary hover:bg-primary hover:text-on-primary transition-all">${_getCategoryLabel(cat)}</button>`;
  });
  container.innerHTML = html;
  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('bg-primary', 'text-on-primary'));
      btn.classList.add('bg-primary', 'text-on-primary');
      if (typeof onFilter === 'function') onFilter(btn.dataset.filter);
    });
  });
}




/* ============================================================ */

// ============================================================
// ANIMATIONS.JS � Haute Fighting Gears
// Nike / Adidas-style premium animation system
// Pure CSS + Vanilla JS � zero dependencies
// Safe: does NOT touch existing functionality
// ============================================================

(function () {
  'use strict';

  // -- 1. INJECT GLOBAL ANIMATION STYLES ----------------------
  const style = document.createElement('style');
  style.textContent = `

    /* -- Page enter ------------------------------------------- */
    @keyframes hfg-page-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    body { animation: hfg-page-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) both; }

    /* -- Navbar scroll transition ----------------------------- */
    header[data-hfg-nav] {
      transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1),
                  box-shadow 0.32s ease !important;
      will-change: transform;
    }
    header[data-hfg-nav].nav-hidden {
      transform: translateY(-100%) !important;
    }
    header[data-hfg-nav].nav-scrolled {
      box-shadow: 0 2px 24px rgba(0,0,0,0.10);
    }

    /* -- Scroll reveal ---------------------------------------- */
    .hfg-reveal {
      opacity: 0;
      transform: translateY(32px);
      transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                  transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
      will-change: opacity, transform;
    }
    .hfg-reveal.hfg-visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }

    /* -- Product card hover system ---------------------------- */
    .hfg-card {
      transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1),
                  box-shadow 0.32s cubic-bezier(0.22, 1, 0.36, 1) !important;
      will-change: transform;
    }
    .hfg-card:hover {
      transform: translateY(-8px) !important;
      box-shadow: 0 20px 48px rgba(0,0,0,0.15) !important;
    }

    /* -- CRITICAL: Product image color fix -------------------- */
    /* Default: FULL COLOR � no grayscale ever */
    .hfg-card img,
    .hfg-card .hfg-img {
      transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1) !important;
      filter: none !important;
      will-change: transform;
    }
    /* Hover: subtle zoom only */
    .hfg-card:hover img,
    .hfg-card:hover .hfg-img {
      transform: scale(1.05) !important;
    }
    /* Nuke any Tailwind grayscale that might be on the img element */
    #samples-grid img,
    #featured-grid img {
      filter: none !important;
      --tw-grayscale: grayscale(0%) !important;
    }

    /* -- Button micro-interactions ---------------------------- */
    .hfg-btn {
      transition: transform 0.18s cubic-bezier(0.22, 1, 0.36, 1),
                  background-color 0.2s ease,
                  color 0.2s ease !important;
      will-change: transform;
    }
    .hfg-btn:hover  { transform: scale(1.04) !important; }
    .hfg-btn:active { transform: scale(0.97) !important; }

    /* -- Staggered grid items --------------------------------- */
    .hfg-stagger {
      opacity: 0;
      transform: translateY(24px);
    }
    .hfg-stagger.hfg-visible {
      opacity: 1;
      transform: translateY(0);
      transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1),
                  transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    }

    /* -- Hero parallax ---------------------------------------- */
    .hfg-parallax-img { will-change: transform; }

    /* -- Page exit � opacity fade only, pointer-events untouched -- */
    body.hfg-exit {
      opacity: 0;
      transition: opacity 0.18s ease;
      /* pointer-events intentionally NOT set here � buttons must remain
         clickable during the brief fade to prevent blocking fast taps */
    }

    /* -- Category filter bar � clean rectangular style ------- */
    #filter-bar {
      display: flex !important;
      align-items: center !important;
      justify-content: flex-start !important;
      flex-wrap: nowrap !important;
      gap: 0 !important;
      padding: 0 !important;
      overflow-x: auto !important;
      scrollbar-width: none !important;
      border-bottom: none !important;
    }
    #filter-bar::-webkit-scrollbar { display: none; }
    #filter-bar .filter-btn {
      border-radius: 0 !important;
      padding: 16px 22px !important;
      font-size: 13px !important;
      letter-spacing: 0.1em !important;
      font-weight: 600 !important;
      border: none !important;
      border-bottom: 2px solid transparent !important;
      background: transparent !important;
      color: #707070 !important;
      cursor: pointer !important;
      white-space: nowrap !important;
      text-transform: uppercase !important;
      transition: color 0.2s ease, border-color 0.2s ease !important;
      box-shadow: none !important;
    }
    #filter-bar .filter-btn:hover {
      color: #1b1b1b !important;
      border-bottom-color: #1b1b1b !important;
      background: transparent !important;
      transform: none !important;
    }
    /* Active state � black text + red underline */
    #filter-bar .filter-btn.bg-primary,
    #filter-bar .filter-btn.text-on-primary {
      background: transparent !important;
      color: #1b1b1b !important;
      border-bottom: 2px solid #E10600 !important;
      box-shadow: none !important;
    }

    /* -- FAQ Accordion ---------------------------------------- */
    .hfg-faq-item {
      border-bottom: 1px solid #e5e5e5;
      overflow: hidden;
    }
    .hfg-faq-item:first-child { border-top: 1px solid #e5e5e5; }
    .hfg-faq-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 0;
      background: none;
      border: none;
      cursor: pointer;
      text-align: left;
      font-family: 'Hanken Grotesk', sans-serif;
      font-size: 15px;
      font-weight: 600;
      color: #1b1b1b;
      letter-spacing: 0.02em;
      transition: color 0.2s ease;
    }
    .hfg-faq-btn:hover { color: #E10600; }
    .hfg-faq-icon {
      flex-shrink: 0;
      width: 22px;
      height: 22px;
      border: 1.5px solid currentColor;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease, background 0.2s ease, color 0.2s ease;
      margin-left: 16px;
      font-size: 16px;
      line-height: 1;
    }
    .hfg-faq-item.open .hfg-faq-icon {
      transform: rotate(45deg);
      background: #E10600;
      border-color: #E10600;
      color: #fff;
    }
    .hfg-faq-body {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.38s cubic-bezier(0.22, 1, 0.36, 1),
                  padding 0.3s ease;
    }
    .hfg-faq-item.open .hfg-faq-body {
      max-height: 300px;
    }
    .hfg-faq-body-inner {
      padding: 0 0 20px 0;
      font-family: 'Hanken Grotesk', sans-serif;
      font-size: 15px;
      line-height: 1.7;
      color: #707070;
    }

  `;
  document.head.appendChild(style);


  // -- 2. NAVBAR SCROLL HIDE / SHOW ---------------------------
  // Direction-only detection � no position threshold
  // Works reliably at top, middle, and footer
  function initNavbarScroll() {
    let lastY = window.scrollY;
    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const header = document.querySelector('header');
        if (!header) { ticking = false; return; }

        header.setAttribute('data-hfg-nav', '');

        const y = window.scrollY;
        const delta = y - lastY;

        if (delta > 2) {
          if (y > 60) header.classList.add('nav-hidden');
        } else if (delta < -2) {
          header.classList.remove('nav-hidden');
        }

        header.classList.toggle('nav-scrolled', y > 8);

        lastY = y;
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }


  // -- 2b. CATEGORY BAR SCROLL HIDE / SHOW --------------------
  // Same direction logic as navbar � hides on scroll down, shows on scroll up
  // Bar stays in normal document flow (not fixed/sticky)
  function initCategoryBarScroll() {
    const wrap = document.getElementById('filter-bar-wrap');
    if (!wrap) return;

    let lastY = window.scrollY;
    let ticking = false;
    let isHidden = false;

    // Get the bar's natural top offset once it's rendered
    function getBarTop() {
      return wrap.getBoundingClientRect().top + window.scrollY;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY;
        const barTop = getBarTop();

        // Only start hiding once user has scrolled past the bar
        if (y > barTop + wrap.offsetHeight) {
          if (delta > 2 && !isHidden) {
            // Scrolling DOWN � slide bar up and out of view
            wrap.style.transform = 'translateY(-110%)';
            isHidden = true;
          } else if (delta < -2 && isHidden) {
            // Scrolling UP � slide bar back into view
            wrap.style.transform = 'translateY(0)';
            isHidden = false;
          }
        } else {
          // Above the bar's natural position � always show
          wrap.style.transform = 'translateY(0)';
          isHidden = false;
        }

        lastY = y;
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }


  // -- 3. SCROLL REVEAL ---------------------------------------
  function initScrollReveal() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => {
          el.classList.add('hfg-visible', 'opacity-100', 'translate-y-0');
          el.classList.remove('opacity-0', 'translate-y-8');
        }, delay);
        obs.unobserve(el);
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -32px 0px' });

    function observeAll() {
      document.querySelectorAll('[data-reveal], .hfg-reveal').forEach(el => {
        if (el.classList.contains('hfg-visible')) return;
        el.classList.add('hfg-reveal');
        obs.observe(el);
      });
    }

    observeAll();

    // Watch dynamic grids
    ['#samples-grid', '#featured-grid', '#product-grid'].forEach(sel => {
      const el = document.querySelector(sel);
      if (el) new MutationObserver(observeAll).observe(el, { childList: true });
    });
  }


  // -- 4. PRODUCT CARD ENHANCEMENTS ---------------------------
  function initProductCards() {
    function applyToCards() {
      const cards = document.querySelectorAll(
        '#samples-grid > div, #featured-grid > div, .group.border.border-outline-variant'
      );
      cards.forEach((card, i) => {
        if (card.dataset.hfgCard) return;
        card.dataset.hfgCard = '1';
        card.classList.add('hfg-card', 'hfg-stagger');
        card.dataset.delay = Math.min(i * 55, 380);
      });
    }

    applyToCards();

    ['#samples-grid', '#featured-grid'].forEach(sel => {
      const el = document.querySelector(sel);
      if (el) new MutationObserver(applyToCards).observe(el, { childList: true });
    });
  }


  // -- 5. BUTTON MICRO-INTERACTIONS ---------------------------
  function initButtons() {
    function applyToButtons() {
      document.querySelectorAll(
        'a[class*="bg-accent-red"], a[class*="bg-primary"]:not([class*="text-primary"]), ' +
        'button[type="submit"], button[class*="bg-accent-red"]'
      ).forEach(btn => {
        if (btn.dataset.hfgBtn) return;
        btn.dataset.hfgBtn = '1';
        btn.classList.add('hfg-btn');
      });
    }
    applyToButtons();
    new MutationObserver(applyToButtons).observe(document.body, { childList: true, subtree: true });
  }


  // -- 6. HERO PARALLAX ---------------------------------------
  function initParallax() {
    const hero = document.querySelector('section.relative.min-h-screen');
    if (!hero) return;
    const img = hero.querySelector('img.absolute');
    if (!img) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight * 1.4) {
          img.style.transform = `translateY(${y * 0.25}px)`;
        }
        ticking = false;
      });
    }, { passive: true });
  }


  // -- 7. PAGE TRANSITION -------------------------------------
  function initPageTransitions() {
    document.addEventListener('click', e => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('mailto') || href.startsWith('tel') ||
        href.startsWith('javascript') || link.target === '_blank') return;
      e.preventDefault();
      // Apply exit fade � pointer-events removed immediately after navigation starts
      // so fast taps / double-taps on other elements are never blocked
      document.body.classList.add('hfg-exit');
      const dest = href; // capture before timeout
      setTimeout(() => {
        document.body.style.pointerEvents = ''; // restore before navigating
        window.location.href = dest;
      }, 180);
    });
  }


  // -- 8. STAGGERED GRID REVEAL -------------------------------
  function initStaggeredGrid() {
    const gridObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const items = entry.target.querySelectorAll('.hfg-stagger:not(.hfg-visible)');
        items.forEach((item, i) => {
          setTimeout(() => item.classList.add('hfg-visible'), i * 60);
        });
        gridObs.unobserve(entry.target);
      });
    }, { threshold: 0.04 });

    function observeGrids() {
      document.querySelectorAll('#samples-grid, #featured-grid').forEach(g => {
        if (g && !g.dataset.hfgGridObs) {
          g.dataset.hfgGridObs = '1';
          gridObs.observe(g);
        }
      });
    }

    observeGrids();
    new MutationObserver(observeGrids).observe(document.body, { childList: true, subtree: true });
  }


  // -- 9. FAQ ACCORDION ---------------------------------------
  function initFaqAccordion() {
    // Find FAQ items � works with the upgraded Contact.html structure
    const items = document.querySelectorAll('.hfg-faq-item');
    if (!items.length) return;

    items.forEach(item => {
      const btn = item.querySelector('.hfg-faq-btn');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all
        items.forEach(i => i.classList.remove('open'));
        // Toggle clicked
        if (!isOpen) item.classList.add('open');
      });
    });
  }


  // -- BOOT ---------------------------------------------------
  initPageTransitions();

  function boot() {
    initNavbarScroll();
    initCategoryBarScroll();
    initScrollReveal();
    initProductCards();
    initButtons();
    initParallax();
    initStaggeredGrid();
    initFaqAccordion();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();


// -- HOME PAGE ANIMATIONS (merged from home-animations.js) --
// ============================================================
// HOME-ANIMATIONS.JS � Haute Fighting Gears
// Premium motion system for the homepage only
// Inspired by 23.html (About page) scroll style
// Pure CSS + Vanilla JS � zero dependencies
// ============================================================

(function () {
  'use strict';

  // -- 1. INJECT STYLES ---------------------------------------
  const style = document.createElement('style');
  style.textContent = `

    /* -- Hero text fade-in on load ---------------------------- */
    #hero-content {
      transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1),
                  transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
    }
    #hero-content.hp-visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }

    /* -- Hero image parallax + slow zoom ---------------------- */
    #hero-bg-img {
      transition: transform 0.05s linear;
      will-change: transform;
    }

    /* -- Section scroll reveal -------------------------------- */
    .hp-reveal {
      opacity: 0;
      transform: translateY(40px);
      transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1),
                  transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
      will-change: opacity, transform;
    }
    .hp-reveal.hp-visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* -- Stagger delays for process cards --------------------- */
    .hp-stagger-1 { transition-delay: 0ms !important; }
    .hp-stagger-2 { transition-delay: 80ms !important; }
    .hp-stagger-3 { transition-delay: 160ms !important; }
    .hp-stagger-4 { transition-delay: 240ms !important; }

    /* -- What We Make image hover ----------------------------- */
    .hp-img-hover {
      overflow: hidden;
    }
    .hp-img-hover img {
      transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1) !important;
    }
    .hp-img-hover:hover img {
      transform: scale(1.07) !important;
    }

    /* -- Marquee animation ------------------------------------ */
    @keyframes hfg-marquee {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
    .hfg-marquee-track {
      animation: hfg-marquee 28s linear infinite;
    }
    .hfg-marquee-wrap:hover .hfg-marquee-track {
      animation-play-state: paused;
    }

    /* -- Button scale on hover (homepage specific) ------------ */
    .hp-btn {
      transition: transform 0.18s cubic-bezier(0.22, 1, 0.36, 1),
                  background-color 0.2s ease,
                  color 0.2s ease,
                  border-color 0.2s ease !important;
    }
    .hp-btn:hover  { transform: scale(1.04) !important; }
    .hp-btn:active { transform: scale(0.97) !important; }

    /* -- Trust card hover lift -------------------------------- */
    .hp-trust-card {
      transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
                  box-shadow 0.28s ease,
                  border-color 0.2s ease !important;
    }
    .hp-trust-card:hover {
      transform: translateY(-6px) !important;
      box-shadow: 0 12px 32px rgba(0,0,0,0.10) !important;
      border-color: #1b1b1b !important;
    }

  `;
  document.head.appendChild(style);


  // -- 2. HERO TEXT FADE-IN ON LOAD ---------------------------
  function initHeroEntrance() {
    const content = document.getElementById('hero-content');
    if (!content) return;
    // Small delay so the page paint completes first
    setTimeout(() => content.classList.add('hp-visible'), 120);
  }


  // -- 3. HERO PARALLAX + SLOW ZOOM ---------------------------
  function initHeroParallax() {
    const img = document.getElementById('hero-bg-img');
    if (!img) return;

    // Disable on mobile for performance
    const isMobile = () => window.innerWidth < 768;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (isMobile() || ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight * 1.5) {
          // Parallax: image moves at 25% of scroll speed
          // Zoom: scale grows slightly as user scrolls in
          const scale = 1 + Math.min(y / window.innerHeight * 0.08, 0.08);
          img.style.transform = `translateY(${y * 0.25}px) scale(${scale})`;
        }
        ticking = false;
      });
    }, { passive: true });
  }


  // -- 4. SCROLL REVEAL WITH STAGGER --------------------------
  function initScrollReveal() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('hp-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    // Mark all sections and their children for reveal
    // Process cards get stagger delays
    const processCards = document.querySelectorAll(
      '.bg-surface-container .grid > div[data-reveal], ' +
      '.bg-surface-container .grid > div.bg-surface-container-lowest'
    );
    processCards.forEach((card, i) => {
      card.classList.add('hp-reveal', `hp-stagger-${Math.min(i + 1, 4)}`);
      obs.observe(card);
    });

    // All other [data-reveal] elements
    document.querySelectorAll('[data-reveal]').forEach(el => {
      if (!el.classList.contains('hp-reveal')) {
        el.classList.add('hp-reveal');
        obs.observe(el);
      }
    });

    // Trust cards
    document.querySelectorAll('.hp-trust-card').forEach(el => {
      if (!el.classList.contains('hp-reveal')) {
        el.classList.add('hp-reveal');
        obs.observe(el);
      }
    });
  }


  // -- 5. WHAT WE MAKE � image hover enhancement --------------
  function initProductImageHover() {
    // The 3 category tiles in "What We Make"
    document.querySelectorAll('section a.group.relative.aspect-\\[3\\/4\\]').forEach(el => {
      el.classList.add('hp-img-hover');
    });
  }


  // -- 6. TRUST CARDS -----------------------------------------
  function initTrustCards() {
    document.querySelectorAll('.flex.items-start.gap-5.p-6.border').forEach(card => {
      card.classList.add('hp-trust-card');
    });
  }


  // -- 7. BUTTON ENHANCEMENTS ---------------------------------
  function initButtons() {
    // Homepage hero buttons + CTA section buttons
    document.querySelectorAll(
      '#hero-content a, ' +
      '.bg-primary.border-y-4 a'
    ).forEach(btn => {
      if (!btn.dataset.hpBtn) {
        btn.dataset.hpBtn = '1';
        btn.classList.add('hp-btn');
      }
    });
  }


  // -- 8. FEATURED GRID � stagger on load ---------------------
  function initFeaturedGrid() {
    const grid = document.getElementById('featured-grid');
    if (!grid) return;

    const gridObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        // Stagger each card
        const cards = entry.target.querySelectorAll(':scope > div');
        cards.forEach((card, i) => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(28px)';
          card.style.transition = `opacity 0.55s cubic-bezier(0.16,1,0.3,1) ${i * 70}ms, transform 0.55s cubic-bezier(0.16,1,0.3,1) ${i * 70}ms`;
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 60 + i * 70);
        });
        gridObs.unobserve(entry.target);
      });
    }, { threshold: 0.05 });

    // Watch for when grid gets populated
    const mutObs = new MutationObserver(() => {
      if (grid.children.length > 0 && !grid.dataset.hpGridObs) {
        grid.dataset.hpGridObs = '1';
        gridObs.observe(grid);
      }
    });
    mutObs.observe(grid, { childList: true });

    // Also observe immediately if already populated
    if (grid.children.length > 0) {
      grid.dataset.hpGridObs = '1';
      gridObs.observe(grid);
    }
  }


  // -- BOOT ---------------------------------------------------
  function boot() {
    initHeroEntrance();
    initHeroParallax();
    initScrollReveal();
    initProductImageHover();
    initTrustCards();
    initButtons();
    initFeaturedGrid();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
