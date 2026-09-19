/**
 * ============================================================
 * Haute Fighting Gears — Configuration
 * config.js
 * 
 * This file contains environment-dependent configuration.
 * For GitHub Pages static deployment, update these values directly.
 * For server-side builds, use environment variables.
 * ============================================================
 */

window.HFG_CONFIG = {
  // Cloudinary configuration (unsigned upload preset)
  // Manage at: https://cloudinary.com/console
  cloudinary: {
    cloudName: 'zutt1n2e',       // Cloudinary cloud name (live)
    preset: 'hfg_inquiry',       // unsigned upload preset name (live)
    folder: 'hfg-inquiries'
  },

  // Google Apps Script endpoint (inquiry backend)
  // To update: re-deploy in Apps Script → New Deployment → copy new /exec URL here
  gas: {
    inquiryUrl: 'https://script.google.com/macros/s/AKfycbzoC1eoDKPJQTlOe4gZn9bv03lVNBOFoZYNWiZiyNMAmUIiA3xWqpS-Agr6NZRidMurTg/exec'
  },

  // File upload limits
  file: {
    maxSizeBytes: 10 * 1024 * 1024, // 10 MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
  },

  // Site metadata (for emails and branding)
  site: {
    name: 'Haute Fighting Gears',
    url: 'https://www.hautefightinggears.com',
    brandColor: '#E10600',
    whatsappNumber: '923148968805'
  }
};

// Provide helper to access config safely
window.getHFGConfig = function(path) {
  var keys = path.split('.');
  var obj = window.HFG_CONFIG;
  for (var i = 0; i < keys.length; i++) {
    obj = obj[keys[i]];
    if (!obj) return undefined;
  }
  return obj;
};
