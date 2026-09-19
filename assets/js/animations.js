/* ============================================================
   ANIMATIONS.JS — Haute Fighting Gears
   Homepage cinematic opening interaction:
   - Full-screen hero with floating hamburger only
   - Hamburger lines animate into X
   - Navigation text slides in from RIGHT with NO background
   - Scroll arrow at bottom of hero
   - Smooth fade-in animations for sections
   ============================================================ */

(function () {
  'use strict';

  /* ── Only runs on the homepage ────────────────────────────── */
  if (!document.body.classList.contains('home-page')) return;

  /* ── Inject styles immediately (before header exists) ─────── */
  var css = document.createElement('style');
  css.id = 'hfg-anim-styles';
  css.textContent = [

    /* ── Header: hero-hidden state ─────────────────────────── */
    'header.hfg-hero-mode {',
    '  opacity: 0 !important;',
    '  pointer-events: none !important;',
    '  transform: translateY(-10px) !important;',
    '  transition:',
    '    opacity   0.52s cubic-bezier(0.22,1,0.36,1),',
    '    transform 0.52s cubic-bezier(0.22,1,0.36,1) !important;',
    '  will-change: transform, opacity;',
    '}',

    /* Visible state */
    'header.hfg-header-visible {',
    '  opacity: 1 !important;',
    '  pointer-events: all !important;',
    '  transform: translateY(0) !important;',
    '  transition:',
    '    opacity   0.52s cubic-bezier(0.22,1,0.36,1),',
    '    transform 0.52s cubic-bezier(0.22,1,0.36,1) !important;',
    '  will-change: transform, opacity;',
    '}',

    /* ── Floating hamburger ──────────────────────────────────── */
    '#hfg-hero-btn {',
    '  position: fixed;',
    '  top: 20px;',
    '  right: 16px;',
    '  z-index: 200;',
    '  width: 44px;',
    '  height: 44px;',
    '  background: transparent;',
    '  border: none;',
    '  cursor: pointer;',
    '  display: flex;',
    '  flex-direction: column;',
    '  align-items: center;',
    '  justify-content: center;',
    '  gap: 6px;',
    '  padding: 10px;',
    '  -webkit-tap-highlight-color: transparent;',
    '  touch-action: manipulation;',
    '  transition: opacity 0.38s ease, transform 0.38s ease;',
    '  will-change: opacity, transform;',
    '}',

    /* Hidden state */
    '#hfg-hero-btn.hfg-btn-hidden {',
    '  opacity: 0 !important;',
    '  pointer-events: none !important;',
    '  transform: scale(0.85) !important;',
    '}',

    /* ── Hamburger bars ─────────────────────────────────────── */
    '.hfg-bar {',
    '  display: block;',
    '  width: 24px;',
    '  height: 2px;',
    '  background: #ffffff;',
    '  border-radius: 1px;',
    '  transform-origin: center;',
    '  transition:',
    '    transform 0.38s cubic-bezier(0.22,1,0.36,1),',
    '    opacity   0.22s ease,',
    '    background 0.3s ease;',
    '  will-change: transform, opacity;',
    '}',

    /* Dark mode bars (on light sections) */
    '#hfg-hero-btn.hfg-dark .hfg-bar {',
    '  background: #000000 !important;',
    '}',

    /* Open: bars animate to X */
    '#hfg-hero-btn.hfg-open .hfg-bar:nth-child(1) {',
    '  transform: translateY(8px) rotate(45deg);',
    '}',
    '#hfg-hero-btn.hfg-open .hfg-bar:nth-child(2) {',
    '  opacity: 0;',
    '  transform: scaleX(0.2);',
    '}',
    '#hfg-hero-btn.hfg-open .hfg-bar:nth-child(3) {',
    '  transform: translateY(-8px) rotate(-45deg);',
    '}',

    /* ── Menu: transparent, slides from RIGHT ───────────────── */
    /* Base = desktop: original single horizontal row           */
    '#hfg-side-nav {',
    '  position: fixed;',
    '  top: 0;',
    '  right: 0;',
    '  width: 100%;',
    '  height: auto;',
    '  background: transparent;',
    '  z-index: 190;',
    '  display: flex;',
    '  flex-direction: row;',
    '  justify-content: flex-end;',
    '  align-items: center;',
    '  flex-wrap: nowrap;',
    '  gap: 28px;',
    '  padding: 24px 80px;',
    '  box-sizing: border-box;',
    '  transform: translateX(100%);',
    '  transition: transform 0.45s cubic-bezier(0.22,1,0.36,1);',
    '  will-change: transform;',
    '  pointer-events: none;',
    '  overflow: hidden;',
    '}',
    '#hfg-side-nav.hfg-nav-open {',
    '  transform: translateX(0);',
    '  pointer-events: all;',
    '}',

    /* Desktop nav links */
    '.hfg-side-link {',
    '  display: inline-block;',
    '  font-family: "Hanken Grotesk", sans-serif;',
    '  font-size: 14px;',
    '  font-weight: 600;',
    '  text-transform: none;',
    '  letter-spacing: 0.02em;',
    '  color: #ffffff;',
    '  text-decoration: none;',
    '  line-height: 1.4;',
    '  padding: 8px 0;',
    '  transition: color 0.2s ease;',
    '  cursor: pointer;',
    '  white-space: nowrap;',
    '}',
    '.hfg-side-link:hover { color: #E10600; }',
    '.hfg-side-link.hfg-link-active { color: #E10600; }',

    /* Desktop: row wrappers are invisible — children float into the flex row */
    '#hfg-side-nav-row1,',
    '#hfg-side-nav-row2 {',
    '  display: contents;',
    '}',

    /* Desktop: hide close button — hamburger handles open/close */
    '#hfg-side-nav-close { display: none; }',

    /* ── MOBILE ONLY: two-row layout ─────────────────────────── */
    '@media (max-width: 767px) {',

    '  #hfg-side-nav {',
    '    flex-direction: column !important;',
    '    justify-content: flex-start !important;',
    '    align-items: stretch !important;',
    '    gap: 0 !important;',
    '    padding-top: 12px !important;',
    '    padding-left: 0 !important;',
    '    padding-right: 0 !important;',
    '    padding-bottom: 0 !important;',
    '  }',

    /* Row 1: nav links + close button */
    '  #hfg-side-nav-row1 {',
    '    display: flex !important;',
    '    flex-direction: row !important;',
    '    align-items: center !important;',
    '    width: 100% !important;',
    '    padding: 0 16px !important;',
    '    box-sizing: border-box !important;',
    '  }',

    /* Nav links in row 1 */
    '  #hfg-side-nav-row1 .hfg-side-link {',
    '    flex: 1 !important;',
    '    min-width: 0 !important;',
    '    text-align: center !important;',
    '    display: flex !important;',
    '    align-items: center !important;',
    '    justify-content: center !important;',
    '    font-size: 11px !important;',
    '    font-weight: 700 !important;',
    '    letter-spacing: 0.08em !important;',
    '    text-transform: uppercase !important;',
    '    padding: 14px 4px !important;',
    '    white-space: nowrap !important;',
    '    overflow: hidden !important;',
    '    text-overflow: ellipsis !important;',
    '  }',

    /* Close button — visible on mobile only, right of row 1 */
    '  #hfg-side-nav-close {',
    '    display: flex !important;',
    '    flex-shrink: 0 !important;',
    '    background: none !important;',
    '    border: none !important;',
    '    cursor: pointer !important;',
    '    color: #ffffff !important;',
    '    padding: 12px 4px 12px 12px !important;',
    '    align-items: center !important;',
    '    justify-content: center !important;',
    '    min-width: 36px !important;',
    '    min-height: 44px !important;',
    '    transition: color 0.2s ease !important;',
    '    -webkit-tap-highlight-color: transparent !important;',
    '  }',
    '  #hfg-side-nav-close:hover { color: #E10600 !important; }',
    '  #hfg-side-nav-close svg { display: block !important; }',

    /* Row 2: EN|ES — aligned under About Us (offset by close button width) */
    '  #hfg-side-nav-row2 {',
    '    display: flex !important;',
    '    flex-direction: row !important;',
    '    align-items: center !important;',
    '    justify-content: flex-end !important;',
    '    padding: 2px 60px 2px 20px !important;',
    '  }',

    '}',

    /* Sub links — hidden on initial menu */
    '#hfg-side-sub {',
    '  display: none;',
    '}',

    /* ── Overlay: subtle semi-transparent behind nav ────────── */
    '#hfg-nav-overlay {',
    '  position: fixed;',
    '  inset: 0;',
    '  background: rgba(0,0,0,0.35);',
    '  z-index: 189;',
    '  opacity: 0;',
    '  pointer-events: none;',
    '  transition: opacity 0.4s ease;',
    '}',
    '#hfg-nav-overlay.hfg-overlay-visible {',
    '  opacity: 1;',
    '  pointer-events: all;',
    '}',

    /* ── Prevent body scroll when menu open ──────────────────── */
    'body.hfg-menu-open { overflow: hidden !important; }',

    /* ── Hide hero content (only in first section) ──────────── */
    'main > section:first-of-type #hero-content { display: none !important; }',

    /* ── Scroll down arrow (bottom of hero) ─────────────────── */
    '.hfg-scroll-arrow {',
    '  position: absolute;',
    '  bottom: 40px;',
    '  left: 50%;',
    '  transform: translateX(-50%);',
    '  z-index: 20;',
    '  cursor: pointer;',
    '  animation: hfg-bounce 2.5s ease-in-out infinite;',
    '  opacity: 0.8;',
    '  transition: opacity 0.3s ease;',
    '  background: transparent;',
    '  border: none;',
    '  padding: 0;',
    '  display: flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '}',
    '.hfg-scroll-arrow:hover { opacity: 1; }',
    '.hfg-scroll-arrow svg {',
    '  width: 32px;',
    '  height: 32px;',
    '  stroke: #ffffff;',
    '  fill: none;',
    '  stroke-width: 2;',
    '}',

    /* Bounce animation */
    '@keyframes hfg-bounce {',
    '  0%, 100% { transform: translateX(-50%) translateY(0); }',
    '  50% { transform: translateX(-50%) translateY(-8px); }',
    '}',

    /* ── Fade-in animations for sections ───────────────────── */
    '[data-reveal] {',
    '  opacity: 0;',
    '  transform: translateY(20px);',
    '  transition: opacity 0.6s ease, transform 0.6s ease;',
    '}',
    '[data-reveal].hfg-visible {',
    '  opacity: 1;',
    '  transform: translateY(0);',
    '}',

  ].join('\n');
  document.head.appendChild(css);


  /* ── Wait for the navbar to be injected by injectNavbar() ─── */
  function init() {
    var header = document.querySelector('header');
    if (!header) {
      var attempts = 0;
      var poll = setInterval(function () {
        attempts++;
        header = document.querySelector('header');
        if (header) { clearInterval(poll); setup(header); }
        if (attempts > 100) clearInterval(poll);
      }, 30);
      return;
    }
    setup(header);
  }


  /* ── Core setup ─────────────────────────────────────────────  */
  function setup(header) {

    /* 1. Hide the header in hero mode */
    header.classList.add('hfg-hero-mode');

    /* 2. Add scroll-down arrow to hero */
    var hero = document.querySelector('main > section:first-of-type');
    if (hero) {
      var arrow = document.createElement('button');
      arrow.className = 'hfg-scroll-arrow';
      arrow.setAttribute('aria-label', 'Scroll down');
      arrow.setAttribute('type', 'button');
      arrow.innerHTML = '<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>';
      arrow.addEventListener('click', function () {
        var nextSection = hero.nextElementSibling;
        if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth' });
      });
      hero.appendChild(arrow);
    }

    /* 3. Floating hamburger button */
    var btn = document.createElement('button');
    btn.id = 'hfg-hero-btn';
    btn.setAttribute('aria-label', 'Open navigation menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('type', 'button');
    btn.innerHTML =
      '<span class="hfg-bar"></span>' +
      '<span class="hfg-bar"></span>' +
      '<span class="hfg-bar"></span>';
    document.body.appendChild(btn);

    /* 4. Subtle overlay */
    var overlay = document.createElement('div');
    overlay.id = 'hfg-nav-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);

    /* 5. Side menu — text only, slides from right */
    var nav = document.createElement('nav');
    nav.id = 'hfg-side-nav';
    nav.setAttribute('aria-label', 'Site navigation');
    nav.setAttribute('aria-hidden', 'true');

    var pages = [
      { label: 'Home',     href: '/',          i18n: 'nav.home'     },
      { label: 'Products', href: '/products/', i18n: 'nav.products' },
      { label: 'Inquiry',  href: '/inquiry/',  i18n: 'nav.inquiry'  },
      { label: 'Contact',  href: '/contact/',  i18n: 'nav.contact'  },
      { label: 'About Us', href: '/about/',    i18n: 'nav.about'    }
    ];

    var currentPath = window.location.pathname;

    // All 5 links go into row 1 — equal width, uppercase, no overflow
    var primaryLinksHtml = pages.map(function (p) {
      var active = (p.href === '/' ? currentPath === '/' : currentPath.indexOf(p.href) === 0);
      return (
        '<a href="' + p.href + '"' +
        ' class="hfg-side-link' + (active ? ' hfg-link-active' : '') + '"' +
        ' data-i18n="' + p.i18n + '"' +
        (active ? ' aria-current="page"' : '') +
        '>' + p.label + '</a>'
      );
    }).join('');

    // Close button — lives inside row 1 on the right edge
    var closeBtnHtml = '<button id="hfg-side-nav-close" aria-label="Close navigation menu" type="button">'
      + '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">'
      + '<path d="M18 6L6 18M6 6l12 12"/>'
      + '</svg>'
      + '</button>';

    // Language switcher — white color scheme, left-aligned
    var langSwitcher = '<div id="hfg-hero-lang" style="display:flex;align-items:center;gap:0">'
      + '<button class="hfg-lang-btn" data-lang="en" onclick="HFG_I18N&&HFG_I18N.setLang(\'en\')" style="background:none;border:none;cursor:pointer;font-family:\'Hanken Grotesk\',sans-serif;font-size:12px;letter-spacing:.1em;text-transform:uppercase;padding:4px 8px;min-height:36px;color:#E10600;font-weight:700;opacity:1;transition:opacity .2s,color .2s">EN</button>'
      + '<span style="opacity:.35;font-size:11px;color:#ffffff;padding:0 2px">|</span>'
      + '<button class="hfg-lang-btn" data-lang="es" onclick="HFG_I18N&&HFG_I18N.setLang(\'es\')" style="background:none;border:none;cursor:pointer;font-family:\'Hanken Grotesk\',sans-serif;font-size:12px;letter-spacing:.1em;text-transform:uppercase;padding:4px 8px;min-height:36px;color:#ffffff;font-weight:500;opacity:.5;transition:opacity .2s,color .2s">ES</button>'
      + '</div>';

    nav.innerHTML =
      /* Row 1: nav links + close button */
      '<div id="hfg-side-nav-row1">' + primaryLinksHtml + closeBtnHtml + '</div>' +
      /* Row 2: language switcher, left-aligned */
      '<div id="hfg-side-nav-row2">' + langSwitcher + '</div>' +
      '<div id="hfg-side-sub" style="display:none">' +
        '<a href="/inquiry/"><span data-i18n="btn.send.inquiry">SEND INQUIRY</span></a>' +
        '<a href="https://wa.me/923148968805" target="_blank" rel="noopener noreferrer">WhatsApp</a>' +
      '</div>';

    document.body.appendChild(nav);

    // Wire up the close button inside the nav
    var navCloseBtn = nav.querySelector('#hfg-side-nav-close');
    if (navCloseBtn) {
      navCloseBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closeMenu();
      });
    }

    // Update lang switcher state based on current language
    setTimeout(function() {
      if (window.HFG_I18N) {
        var cur = window.HFG_I18N.getLang();
        nav.querySelectorAll('.hfg-lang-btn').forEach(function(b) {
          var isActive = b.getAttribute('data-lang') === cur;
          b.style.opacity = isActive ? '1' : '0.45';
          b.style.fontWeight = isActive ? '700' : '500';
          b.style.color = isActive ? '#E10600' : '#ffffff';
        });
      }
    }, 300);

    /* 6. Menu state */
    var menuOpen = false;

    function openMenu() {
      menuOpen = true;
      btn.classList.add('hfg-open');
      // On mobile, hide the floating hamburger — the × inside the nav handles close
      // On desktop, keep it visible as the animated X
      if (window.innerWidth <= 767) btn.classList.add('hfg-btn-hidden');
      btn.setAttribute('aria-expanded', 'true');
      nav.classList.add('hfg-nav-open');
      nav.setAttribute('aria-hidden', 'false');
      overlay.classList.add('hfg-overlay-visible');
      document.body.classList.add('hfg-menu-open');
      var firstLink = nav.querySelector('a');
      if (firstLink) setTimeout(function () { firstLink.focus(); }, 60);
    }

    function closeMenu() {
      menuOpen = false;
      btn.classList.remove('hfg-open', 'hfg-btn-hidden');
      btn.setAttribute('aria-expanded', 'false');
      nav.classList.remove('hfg-nav-open');
      nav.setAttribute('aria-hidden', 'true');
      overlay.classList.remove('hfg-overlay-visible');
      document.body.classList.remove('hfg-menu-open');
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      menuOpen ? closeMenu() : openMenu();
    });

    overlay.addEventListener('click', closeMenu);

    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { closeMenu(); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuOpen) closeMenu();
    });

    /* 7. Intersection Observer for fade-in animations ────────── */
    if (window.IntersectionObserver) {
      var revealElements = document.querySelectorAll('[data-reveal]');
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('hfg-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

      revealElements.forEach(function (el) {
        revealObserver.observe(el);
      });
    }

    /* 8. Scroll behavior ───────────────────────────────────── */
    var heroSection = document.querySelector('main > section:first-of-type');
    var navSections = Array.from(document.querySelectorAll('main > section[data-nav-color]'));
    var navFooter   = document.querySelector('footer');
    var ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;

        var scrollY = window.scrollY || window.pageYOffset;
        var heroH = heroSection ? heroSection.offsetHeight : window.innerHeight;
        var fadeStart = heroH * 0.30;
        var fadeEnd   = heroH * 0.50;

        /* Keep header hidden throughout entire homepage */
        header.classList.add('hfg-hero-mode');
        header.classList.add('nav-hidden');

        /* Fade button while in hero area */
        if (scrollY > fadeStart) {
          var t = Math.min(1, (scrollY - fadeStart) / (fadeEnd - fadeStart));
          btn.style.opacity = String(1 - t * 0.65);
        } else {
          btn.style.opacity = '';
        }

        /* Switch hamburger color based on scroll position vs sections */
        // If still in hero, always white bars
        if (scrollY < heroH * 0.9) {
          btn.classList.remove('hfg-dark');
        } else {
          // Below hero - use data-nav-color attribute on sections
          var btnRect = btn.getBoundingClientRect();
          var btnY = btnRect.top + btnRect.height / 2;
          /* navSections cached at setup() init */
          var needsDark = false;

          navSections.forEach(function (sec) {
            var rect = sec.getBoundingClientRect();
            if (rect.top <= btnY && rect.bottom >= btnY) {
              needsDark = sec.getAttribute('data-nav-color') === 'dark';
            }
          });

          // Also check footer
          if (navFooter) {
            var fRect = navFooter.getBoundingClientRect();
            if (fRect.top <= btnY && fRect.bottom >= btnY) {
              needsDark = false; // footer is dark bg = white bars
            }
          }

          if (needsDark) {
            btn.classList.add('hfg-dark');
          } else {
            btn.classList.remove('hfg-dark');
          }
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }


  /* ── Boot ─────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 0);
  }

})();
