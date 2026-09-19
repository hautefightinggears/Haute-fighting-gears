/* ============================================================
   I18N.JS — Haute Fighting Gears
   Multi-language support: English + Spanish
   - Language persists across pages via localStorage
   - Auto-detects Spanish-speaking country via geolocation API
   - Translates all data-i18n="key" elements
   - Translates placeholders via data-i18n-placeholder="key"
   ============================================================ */

(function () {
  'use strict';

  // ── SPANISH-SPEAKING COUNTRIES (ISO 3166-1 alpha-2) ──────────
  var SPANISH_COUNTRIES = [
    'MX','ES','AR','CO','PE','VE','CL','EC','GT','CU',
    'BO','DO','HN','PY','SV','NI','CR','PA','UY','GQ','PR'
  ];

  // ── SUPPORTED LANGUAGES ──────────────────────────────────────
  var LANGS = {
    en: { label: 'EN', dir: 'ltr', name: 'English' },
    es: { label: 'ES', dir: 'ltr', name: 'Español' }
  };

  // ── TRANSLATIONS ─────────────────────────────────────────────
  var T = {

    en: {
      // Nav
      'nav.home':     'Home',
      'nav.products': 'Products',
      'nav.inquiry':  'Inquiry',
      'nav.about':    'About Us',
      'nav.contact':  'Contact',

      // Footer
      'footer.navigate':          'Navigate',
      'footer.support':           'Support',
      'footer.newsletter':        'Newsletter',
      'footer.newsletter.sub':    'Get updates on new products and offers.',
      'footer.email.placeholder': 'EMAIL ADDRESS',
      'footer.subscribe':         'Subscribe',
      'footer.privacy':           'Privacy Policy',
      'footer.terms':             'Terms & Conditions',
      'footer.shipping':          'Shipping Info',
      'footer.contact':           'Contact',
      'footer.whatsapp':          'WhatsApp Us',
      'footer.copyright':         '© 2026 Haute Fighting Gears. All rights reserved.',
      'footer.tagline':           'Custom fight gear manufacturer for boxing, MMA, and training brands.',

      // Inquiry page
      'inquiry.hero.label':       '',
      'inquiry.hero.title':       'INQUIRY',
      'inquiry.hero.sub':         'For manufacturing orders of 20+ units. Submit your requirements and our team will respond within 24 hours with pricing, lead times, and full production details.',
      'inquiry.form.title':       'MANUFACTURING INQUIRY',
      'inquiry.name':             'Full Name',
      'inquiry.email':            'Email Address',
      'inquiry.phone':            'Phone / WhatsApp',
      'inquiry.product':          'Product',
      'inquiry.qty':              'Quantity',
      'inquiry.description':      'Description & Requirements',
      'inquiry.description.opt':  '(optional)',
      'inquiry.file.label':       'Reference Image / File',
      'inquiry.file.opt':         '(optional)',
      'inquiry.file.hint':        'Drop file here or click to browse',
      'inquiry.file.types':       'JPG, PNG, WEBP, PDF · Max 10 MB',
      'inquiry.submit':           'Submit Inquiry',
      'inquiry.submit.note':      'Our team will respond within 24 hours with pricing and production details.',
      'inquiry.success.title':    'Inquiry Submitted!',
      'inquiry.success.sub':      'Your manufacturing inquiry has been received. Our team will contact you within 24 hours.',
      'inquiry.success.btn1':     'View Products',
      'inquiry.success.btn2':     'Back to Home',
      'inquiry.why.title':        'WHY WORK WITH US?',
      'inquiry.why.1':            'Better pricing for large manufacturing orders',
      'inquiry.why.2':            'Priority production scheduling',
      'inquiry.why.3':            'Full custom branding: logos, colors, design',
      'inquiry.why.4':            'Worldwide shipping available',
      'inquiry.std.title':        'MANUFACTURING STANDARDS',
      'inquiry.std.material':     'Material',
      'inquiry.std.custom':       'Customization',
      'inquiry.std.moq':          'Minimum order',
      'inquiry.std.lead':         'Lead time',
      'inquiry.product.select':   'Select a product',
      'inquiry.sending':          'Sending…',

      // Contact page
      'contact.hero.label':       '',
      'contact.hero.title':       'CONTACT',
      'contact.form.title':       'SEND A MESSAGE',
      'contact.name':             'Your Name',
      'contact.contact':          'Contact Info',
      'contact.message':          'Message',
      'contact.send':             'Send Message',
      'contact.name.ph':          'Full name',
      'contact.contact.ph':       'WhatsApp number or email address',
      'contact.message.ph':       'How can we help you?',

      // Products page
      'products.hero.label':      '',
      'products.hero.title':      'PRODUCTS',
      'products.inquiry.btn':     'Send Inquiry',

      // Home page
      'home.categories.label':    '',
      'home.categories.title':    'WHAT WE MAKE',
      'home.howitworks.label':    '',
      'home.howitworks.title':    'HOW IT WORKS',
      'home.featured.label':      '',
      'home.featured.title':      'FEATURED PRODUCTS',
      'home.tiktok.label':        '',
      'home.tiktok.title':        'Latest From TikTok',
      'home.cta.label':           '',
      'home.cta.title':           'START YOUR FIGHT GEAR BRAND',

      // Shared
      'btn.view.products':        'View Products',
      'btn.send.inquiry':         'Send Inquiry',
      'btn.back.home':            'Back to Home',
      'btn.whatsapp':             'WhatsApp Us',
      'btn.view.all':             'View All',

      // Toasts
      'toast.success.inquiry':    'Inquiry submitted! We\'ll respond within 24 hours.',
      'toast.success.message':    'Message sent! We\'ll get back to you soon.',
      'toast.error.connect':      'Could not connect. Please try WhatsApp instead.',
      'toast.file.type':          'Invalid file type. Use JPG, PNG, WEBP or PDF.',
      'toast.file.size':          'File too large. Maximum size is 10 MB.',
      'toast.newsletter.ok':      'Successfully subscribed!',

      // Geo banner
      'geo.banner':               'Do you prefer Spanish? Switch language:',
      'geo.switch':               'Switch to Spanish',
      'geo.dismiss':              '✕',
    },

    es: {
      // Nav
      'nav.home':     'Inicio',
      'nav.products': 'Productos',
      'nav.inquiry':  'Consulta',
      'nav.about':    'Nosotros',
      'nav.contact':  'Contacto',

      // Footer
      'footer.navigate':          'Navegar',
      'footer.support':           'Soporte',
      'footer.newsletter':        'Boletín',
      'footer.newsletter.sub':    'Recibe actualizaciones de productos y ofertas.',
      'footer.email.placeholder': 'CORREO ELECTRÓNICO',
      'footer.subscribe':         'Suscribirse',
      'footer.privacy':           'Política de Privacidad',
      'footer.terms':             'Términos y Condiciones',
      'footer.shipping':          'Info de Envío',
      'footer.contact':           'Contacto',
      'footer.whatsapp':          'WhatsApp',
      'footer.copyright':         '© 2026 Haute Fighting Gears. Todos los derechos reservados.',
      'footer.tagline':           'Fabricante de equipos de combate personalizados para boxeo, MMA y marcas de entrenamiento.',

      // Inquiry page
      'inquiry.hero.label':       '',
      'inquiry.hero.title':       'CONSULTA',
      'inquiry.hero.sub':         'Para pedidos de fabricación de 20+ unidades. Envía tus requisitos y nuestro equipo responderá en 24 horas con precios, plazos y detalles completos de producción.',
      'inquiry.form.title':       'CONSULTA DE FABRICACIÓN',
      'inquiry.name':             'Nombre Completo',
      'inquiry.email':            'Correo Electrónico',
      'inquiry.phone':            'Teléfono / WhatsApp',
      'inquiry.product':          'Producto',
      'inquiry.qty':              'Cantidad',
      'inquiry.description':      'Descripción y Requisitos',
      'inquiry.description.opt':  '(opcional)',
      'inquiry.file.label':       'Imagen o Archivo de Referencia',
      'inquiry.file.opt':         '(opcional)',
      'inquiry.file.hint':        'Arrastra el archivo aquí o haz clic para buscar',
      'inquiry.file.types':       'JPG, PNG, WEBP, PDF · Máx. 10 MB',
      'inquiry.submit':           'Enviar Consulta',
      'inquiry.submit.note':      'Nuestro equipo responderá en 24 horas con precios y detalles de producción.',
      'inquiry.success.title':    '¡Consulta Enviada!',
      'inquiry.success.sub':      'Tu consulta de fabricación fue recibida. Nuestro equipo te contactará en 24 horas.',
      'inquiry.success.btn1':     'Ver Productos',
      'inquiry.success.btn2':     'Volver al Inicio',
      'inquiry.why.title':        '¿POR QUÉ TRABAJAR CON NOSOTROS?',
      'inquiry.why.1':            'Mejores precios para pedidos grandes de fabricación',
      'inquiry.why.2':            'Programación de producción prioritaria',
      'inquiry.why.3':            'Marca completamente personalizada: logos, colores, diseño',
      'inquiry.why.4':            'Envío mundial disponible',
      'inquiry.std.title':        'ESTÁNDARES DE FABRICACIÓN',
      'inquiry.std.material':     'Material',
      'inquiry.std.custom':       'Personalización',
      'inquiry.std.moq':          'Pedido mínimo',
      'inquiry.std.lead':         'Tiempo de entrega',
      'inquiry.product.select':   'Selecciona un producto',
      'inquiry.sending':          'Enviando…',

      // Contact page
      'contact.hero.label':       '',
      'contact.hero.title':       'CONTACTO',
      'contact.form.title':       'ENVIAR MENSAJE',
      'contact.name':             'Tu Nombre',
      'contact.contact':          'Información de Contacto',
      'contact.message':          'Mensaje',
      'contact.send':             'Enviar Mensaje',
      'contact.name.ph':          'Nombre completo',
      'contact.contact.ph':       'Número de WhatsApp o correo electrónico',
      'contact.message.ph':       '¿Cómo podemos ayudarte?',

      // Products page
      'products.hero.label':      '',
      'products.hero.title':      'PRODUCTOS',
      'products.inquiry.btn':     'Enviar Consulta',

      // Home page
      'home.categories.label':    '',
      'home.categories.title':    'LO QUE FABRICAMOS',
      'home.howitworks.label':    '',
      'home.howitworks.title':    'CÓMO FUNCIONA',
      'home.featured.label':      '',
      'home.featured.title':      'PRODUCTOS DESTACADOS',
      'home.tiktok.label':        '',
      'home.tiktok.title':        'Lo Último en TikTok',
      'home.cta.label':           '',
      'home.cta.title':           'COMIENZA TU MARCA DE EQUIPOS DE COMBATE',

      // Shared
      'btn.view.products':        'Ver Productos',
      'btn.send.inquiry':         'Enviar Consulta',
      'btn.back.home':            'Volver al Inicio',
      'btn.whatsapp':             'WhatsApp',
      'btn.view.all':             'Ver Todo',

      // Toasts
      'toast.success.inquiry':    '¡Consulta enviada! Responderemos en 24 horas.',
      'toast.success.message':    '¡Mensaje enviado! Te contactaremos pronto.',
      'toast.error.connect':      'No se pudo conectar. Intenta por WhatsApp.',
      'toast.file.type':          'Tipo de archivo no válido. Usa JPG, PNG, WEBP o PDF.',
      'toast.file.size':          'Archivo muy grande. Máximo 10 MB.',
      'toast.newsletter.ok':      '¡Suscrito correctamente!',

      // Geo banner
      'geo.banner':               '¿Prefieres inglés? Cambia el idioma:',
      'geo.switch':               'Cambiar a inglés',
      'geo.dismiss':              '✕',
    }
  };

  // ── STORAGE KEYS ─────────────────────────────────────────────
  var LS_LANG    = 'hfg_lang';
  var LS_GEO_DIS = 'hfg_geo_dismissed'; // user dismissed geo banner

  // ── GET / SET CURRENT LANGUAGE ────────────────────────────────
  function getLang() {
    var saved = localStorage.getItem(LS_LANG);
    return (saved && LANGS[saved]) ? saved : 'en';
  }

  function setLang(code) {
    if (!LANGS[code]) return;
    localStorage.setItem(LS_LANG, code);
    applyLang(code);
    updateSwitcher(code);
    hidGeoBanner();
  }

  // ── TRANSLATE A SINGLE KEY ────────────────────────────────────
  function t(key) {
    var lang = getLang();
    return (T[lang] && T[lang][key]) || (T['en'] && T['en'][key]) || key;
  }

  // ── APPLY LANGUAGE TO PAGE ────────────────────────────────────
  function applyLang(code) {
    if (!LANGS[code]) return;
    document.documentElement.setAttribute('lang', code);
    document.documentElement.setAttribute('dir', LANGS[code].dir);

    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      var val = (T[code] && T[code][key]) || (T['en'] && T['en'][key]);
      if (val !== undefined) el.textContent = val;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-placeholder');
      var val = (T[code] && T[code][key]) || (T['en'] && T['en'][key]);
      if (val !== undefined) el.setAttribute('placeholder', val);
    });
  }

  // ── UPDATE SWITCHER BUTTON STATE ──────────────────────────────
  function updateSwitcher(code) {
    document.querySelectorAll('.hfg-lang-btn').forEach(function(btn) {
      var isActive = btn.getAttribute('data-lang') === code;
      // Use white for the homepage overlay nav (dark/transparent bg),
      // dark (#1b1b1b) for the regular white header and mobile drawer.
      var inOverlay = !!btn.closest('#hfg-hero-lang');
      var inactiveColor = inOverlay ? '#ffffff' : '#1b1b1b';
      btn.style.opacity    = isActive ? '1'           : '0.45';
      btn.style.fontWeight = isActive ? '700'         : '500';
      btn.style.color      = isActive ? '#E10600'     : inactiveColor;
    });
  }

  // ── BUILD LANGUAGE SWITCHER HTML ──────────────────────────────
  function buildSwitcher() {
    var current = getLang();
    var buttons = Object.keys(LANGS).map(function(code) {
      var isActive = code === current;
      return '<button class="hfg-lang-btn" data-lang="' + code + '" '
        + 'onclick="HFG_I18N.setLang(\'' + code + '\')" '
        + 'style="background:none;border:none;cursor:pointer;'
        + 'font-family:\'Hanken Grotesk\',sans-serif;'
        + 'font-size:11px;letter-spacing:.1em;text-transform:uppercase;'
        + 'padding:4px 6px;min-height:32px;'
        + 'color:' + (isActive ? '#E10600' : '#1b1b1b') + ';'
        + 'font-weight:' + (isActive ? '700' : '500') + ';'
        + 'opacity:' + (isActive ? '1' : '0.45') + ';'
        + 'transition:opacity .2s,color .2s">'
        + LANGS[code].label
        + '</button>';
    }).join('<span style="opacity:.25;font-size:10px">|</span>');

    return '<div style="display:flex;align-items:center;gap:0">' + buttons + '</div>';
  }

  // ── GEO DETECTION ─────────────────────────────────────────────
  // Uses free ipapi.co — no API key needed, 1000 req/day free
  function detectGeo() {
    // Skip if user already chose a language manually or dismissed banner
    if (localStorage.getItem(LS_LANG) || localStorage.getItem(LS_GEO_DIS)) return;

    fetch('https://ipapi.co/json/')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        var country = (data.country_code || '').toUpperCase();
        if (SPANISH_COUNTRIES.indexOf(country) !== -1) {
          // Auto-switch to Spanish silently
          localStorage.setItem(LS_LANG, 'es');
          applyLang('es');
          updateSwitcher('es');
          // Also show a small dismissible banner so user knows
          showGeoBanner('es');
        }
      })
      .catch(function() { /* silent — geo is best-effort */ });
  }

  // ── GEO BANNER ────────────────────────────────────────────────
  function showGeoBanner(detectedLang) {
    if (document.getElementById('hfg-geo-banner')) return;

    var otherLang = detectedLang === 'es' ? 'en' : 'es';
    var bannerText = T[detectedLang]['geo.banner'] || '';
    var switchText = T[detectedLang]['geo.switch'] || '';
    var dismissText = T[detectedLang]['geo.dismiss'] || '✕';

    var banner = document.createElement('div');
    banner.id = 'hfg-geo-banner';
    banner.style.cssText = [
      'position:fixed;top:72px;left:0;right:0;z-index:9998;',
      'background:#1b1b1b;color:#fff;',
      'display:flex;align-items:center;justify-content:center;gap:12px;',
      'padding:10px 20px;font-family:\'Hanken Grotesk\',sans-serif;',
      'font-size:13px;font-weight:500;',
      'animation:hfg-slide-down .3s ease;',
      'border-bottom:2px solid #E10600;'
    ].join('');

    banner.innerHTML =
      '<span>' + bannerText + '</span>'
      + '<button onclick="HFG_I18N.setLang(\'' + otherLang + '\')" '
      + 'style="background:#E10600;color:#fff;border:none;cursor:pointer;'
      + 'padding:5px 14px;font-size:12px;font-weight:700;text-transform:uppercase;'
      + 'letter-spacing:.08em;font-family:inherit">' + switchText + '</button>'
      + '<button onclick="HFG_I18N.dismissGeoBanner()" '
      + 'style="background:none;border:none;color:rgba(255,255,255,.5);'
      + 'cursor:pointer;font-size:16px;padding:0 4px;line-height:1">' + dismissText + '</button>';

    // Inject slide-down animation
    if (!document.getElementById('hfg-geo-anim')) {
      var s = document.createElement('style');
      s.id = 'hfg-geo-anim';
      s.textContent = '@keyframes hfg-slide-down{from{transform:translateY(-100%);opacity:0}to{transform:translateY(0);opacity:1}}';
      document.head.appendChild(s);
    }

    document.body.appendChild(banner);
  }

  function hidGeoBanner() {
    var b = document.getElementById('hfg-geo-banner');
    if (b) b.remove();
  }

  function dismissGeoBanner() {
    localStorage.setItem(LS_GEO_DIS, '1');
    hidGeoBanner();
  }

  // ── INJECT SWITCHER INTO NAVBAR ───────────────────────────────
  function injectSwitcherIntoNav() {
    // Desktop header slot — created by injectNavbar in app.js
    var slot = document.getElementById('hfg-lang-switcher');
    if (slot && !slot.querySelector('.hfg-lang-btn')) {
      if (slot.classList.contains('hfg-lang-home') && window.innerWidth <= 767) return;
      slot.innerHTML = buildSwitcher();
    }
  }

  // ── INIT ──────────────────────────────────────────────────────
  function init() {
    var lang = getLang();
    applyLang(lang);

    // Re-apply after navbar/footer injected dynamically
    // Multiple passes to ensure all dynamic content is caught
    [100, 300, 600, 1200, 2500].forEach(function(delay) {
      setTimeout(function() {
        applyLang(getLang());
        updateSwitcher(getLang());
        injectSwitcherIntoNav();
      }, delay);
    });

    // After the timed passes above, do one final translation pass on window load
    // (catches anything injected after 2500ms — product grids, etc.)
    // No persistent MutationObserver needed: the timed chain covers nav/footer,
    // and setLang() re-applies translations on explicit language change.
    window.addEventListener('load', function() {
      applyLang(getLang());
      updateSwitcher(getLang());
      injectSwitcherIntoNav();
    }, { once: true });

    // Geo detection — only if no saved preference
    detectGeo();
  }

  // ── PUBLIC API ────────────────────────────────────────────────
  window.HFG_I18N = {
    t:                t,
    setLang:          setLang,
    getLang:          getLang,
    applyLang:        applyLang,
    buildSwitcher:    buildSwitcher,
    dismissGeoBanner: dismissGeoBanner,
    langs:            LANGS
  };

  // ── BOOT ──────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
