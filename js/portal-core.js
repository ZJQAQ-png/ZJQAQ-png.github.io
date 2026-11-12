(function (root) {
  'use strict';
  function publicUrl(value) {
    if (typeof value !== 'string' || !value.trim()) return '';
    try {
      const url = new URL(value.trim());
      const host = url.hostname.toLowerCase().replace(/\.$/, '');
      if (url.protocol !== 'https:' || url.username || url.password) return '';
      // Entry configuration is public. Never route visitors to their own LAN.
      if (!host.includes('.') || /(?:^|\.)(localhost|local|internal|test|invalid)$/.test(host) || host.includes(':')) return '';
      if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
        const [a, b] = host.split('.').map(Number);
        if (a === 0 || a === 10 || a === 127 || a >= 224 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127)) return '';
      }
      return url.href;
    } catch { return ''; }
  }
  function entryState(entry) {
    const url = entry.available ? publicUrl(entry.url) : '';
    return { url, status: !entry.available ? 'planned' : url ? 'configured' : 'pending' };
  }
  const api = { publicUrl, entryState };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PortalCore = api;
})(globalThis);
