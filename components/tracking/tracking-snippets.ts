import { TRACKING } from "@/config/tracking";

export const HOPI_FIRST_PARTY_SCRIPT = String.raw`
(function () {
  try {
    function getParameterByName(name) {
      var match = new RegExp('[?&]' + name.replace(/[[\]]/g, '\\$&') + '=([^&#]*)').exec(window.location.search);
      return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : '';
    }

    function getCookieDomain() {
      var host = window.location.hostname;
      if (!host || host === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(host)) return '';
      var parts = host.split('.');
      if (parts.length < 2) return '';
      return '; domain=.' + parts.slice(-2).join('.');
    }

    function setFirstPartyCookie(name, value, days) {
      var expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie =
        name +
        '=' +
        encodeURIComponent(value) +
        '; expires=' +
        expires.toUTCString() +
        '; path=/' +
        getCookieDomain() +
        '; SameSite=Lax';
    }

    var hopiid = getParameterByName('hopiid') || getParameterByName('hopiId') || getParameterByName('hopi_id');
    if (hopiid) {
      setFirstPartyCookie('${TRACKING.hopiCookieName}', hopiid, ${TRACKING.hopiCookieDays});
    }
  } catch (e) {}
})();
`;

export const VWO_SMARTCODE = `
window._vwo_code || (function () {
  var account_id = ${TRACKING.vwoAccountId},
    version = 2.1,
    settings_tolerance = 2000,
    hide_element = 'body',
    hide_element_style = 'opacity:0 !important;filter:alpha(opacity=0) !important;background:none !important;transition:none !important;',
    f = false, w = window, d = document, v = d.querySelector('#vwoCode'), cK = '_vwo_' + account_id + '_settings', cc = {};
  try {
    var c = JSON.parse(localStorage.getItem('_vwo_' + account_id + '_config'));
    cc = c && typeof c === 'object' ? c : {};
  } catch (e) {}
  var stT = cc.stT === 'session' ? w.sessionStorage : w.localStorage;
  var code = {
    nonce: v && v.nonce,
    use_existing_jquery: function () { return typeof use_existing_jquery !== 'undefined' ? use_existing_jquery : undefined },
    library_tolerance: function () { return typeof library_tolerance !== 'undefined' ? library_tolerance : undefined },
    settings_tolerance: function () { return cc.sT || settings_tolerance },
    hide_element_style: function () { return '{' + (cc.hES || hide_element_style) + '}' },
    hide_element: function () {
      if (performance.getEntriesByName('first-contentful-paint')[0]) { return '' }
      return typeof cc.hE === 'string' ? cc.hE : hide_element
    },
    getVersion: function () { return version },
    finish: function (e) {
      if (!f) {
        f = true;
        var t = d.getElementById('_vis_opt_path_hides');
        if (t) t.parentNode.removeChild(t);
        if (e) (new Image).src = 'https://dev.visualwebsiteoptimizer.com/ee.gif?a=' + account_id + e
      }
    },
    finished: function () { return f },
    addScript: function (e) {
      var t = d.createElement('script');
      t.type = 'text/javascript';
      if (e.src) { t.src = e.src } else { t.text = e.text }
      v && t.setAttribute('nonce', v.nonce);
      d.getElementsByTagName('head')[0].appendChild(t)
    },
    load: function (e, t) {
      var n = this.getSettings(), i = d.createElement('script'), r = this;
      t = t || {};
      if (n) {
        i.textContent = n;
        d.getElementsByTagName('head')[0].appendChild(i);
        if (!w.VWO || VWO.caE) { stT.removeItem(cK); r.load(e) }
      } else {
        var o = new XMLHttpRequest;
        o.open('GET', e, true);
        o.withCredentials = !t.dSC;
        o.responseType = t.responseType || 'text';
        o.onload = function () {
          if (t.onloadCb) { return t.onloadCb(o, e) }
          if (o.status === 200 || o.status === 304) { _vwo_code.addScript({ text: o.responseText }) }
          else { _vwo_code.finish('&e=loading_failure:' + e) }
        };
        o.onerror = function () {
          if (t.onerrorCb) { return t.onerrorCb(e) }
          _vwo_code.finish('&e=loading_failure:' + e)
        };
        o.send()
      }
    },
    getSettings: function () {
      try {
        var e = stT.getItem(cK);
        if (!e) { return }
        e = JSON.parse(e);
        if (Date.now() > e.e) { stT.removeItem(cK); return }
        return e.s
      } catch (e) { return }
    },
    init: function () {
      if (d.URL.indexOf('__vwo_disable__') > -1) return;
      var e = this.settings_tolerance();
      w._vwo_settings_timer = setTimeout(function () { _vwo_code.finish(); stT.removeItem(cK) }, e);
      var t;
      if (this.hide_element() !== 'body') {
        t = d.createElement('style');
        var n = this.hide_element(), i = n ? n + this.hide_element_style() : '', r = d.getElementsByTagName('head')[0];
        t.setAttribute('id', '_vis_opt_path_hides');
        v && t.setAttribute('nonce', v.nonce);
        t.setAttribute('type', 'text/css');
        if (t.styleSheet) t.styleSheet.cssText = i;
        else t.appendChild(d.createTextNode(i));
        r.appendChild(t)
      } else {
        t = d.getElementsByTagName('head')[0];
        var hideLayer = d.createElement('div');
        hideLayer.style.cssText = 'z-index: 2147483647 !important;position: fixed !important;left: 0 !important;top: 0 !important;width: 100% !important;height: 100% !important;background: white !important;display: block !important;';
        hideLayer.setAttribute('id', '_vis_opt_path_hides');
        hideLayer.classList.add('_vis_hide_layer');
        t.parentNode.insertBefore(hideLayer, t.nextSibling)
      }
      var o = window._vis_opt_url || d.URL, s = 'https://dev.visualwebsiteoptimizer.com/j.php?a=' + account_id + '&u=' + encodeURIComponent(o) + '&vn=' + version;
      if (w.location.search.indexOf('_vwo_xhr') !== -1) { this.addScript({ src: s }) }
      else { this.load(s + '&x=true') }
    }
  };
  w._vwo_code = code;
  code.init();
})();
`;

export const META_PIXEL_SCRIPT = `
!(function (f, b, e, v, n, t, s) {
  if (f.fbq) return;
  n = f.fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  };
  if (!f._fbq) f._fbq = n;
  n.push = n;
  n.loaded = !0;
  n.version = '2.0';
  n.queue = [];
  t = b.createElement(e);
  t.async = !0;
  t.src = v;
  s = b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t, s);
})(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${TRACKING.metaPixelId}');
fbq('track', 'PageView');
`;

export const GTM_SCRIPT = `
(function (w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  var f = d.getElementsByTagName(s)[0],
    j = d.createElement(s),
    dl = l != 'dataLayer' ? '&l=' + l : '';
  j.async = true;
  j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
  f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', '${TRACKING.gtmId}');
`;

export const TIKTOK_PIXEL_SCRIPT = `
!(function (w, d, t) {
  w.TiktokAnalyticsObject = t;
  var ttq = (w[t] = w[t] || []);
  ttq.methods = [
    'page',
    'track',
    'identify',
    'instances',
    'debug',
    'on',
    'off',
    'once',
    'ready',
    'alias',
    'group',
    'enableCookie',
    'disableCookie',
    'holdConsent',
    'revokeConsent',
    'grantConsent',
  ];
  ttq.setAndDefer = function (t, e) {
    t[e] = function () {
      t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
    };
  };
  for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
  ttq.instance = function (t) {
    for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]);
    return e;
  };
  ttq.load = function (e, n) {
    var r = 'https://analytics.tiktok.com/i18n/pixel/events.js',
      o = n && n.partner;
    ttq._i = ttq._i || {};
    ttq._i[e] = [];
    ttq._i[e]._u = r;
    ttq._t = ttq._t || {};
    ttq._t[e] = +new Date();
    ttq._o = ttq._o || {};
    ttq._o[e] = n || {};
    n = document.createElement('script');
    n.type = 'text/javascript';
    n.async = !0;
    n.src = r + '?sdkid=' + e + '&lib=' + t;
    e = document.getElementsByTagName('script')[0];
    e.parentNode.insertBefore(n, e);
  };
  ttq.load('${TRACKING.tiktokPixelId}');
  tt/q.page();
})(window, document, 'ttq');
`;

export const HOTJAR_SCRIPT = `
(function (h, o, t, j, a, r) {
  h.hj =
    h.hj ||
    function () {
      (h.hj.q = h.hj.q || []).push(arguments);
    };
  h._hjSettings = { hjid: ${TRACKING.hotjarId}, hjsv: ${TRACKING.hotjarSv} };
  a = o.getElementsByTagName('head')[0];
  r = o.createElement('script');
  r.async = 1;
  r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
  a.appendChild(r);
})(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
`;

export const GTAG_SCRIPT = `
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', '${TRACKING.gaMeasurementId}');
`;

export const OPTINMONSTER_SCRIPT = `
(function (d, u, ac) {
  var s = d.createElement('script');
  s.type = 'text/javascript';
  s.src = 'https://a.omappapi.com/app/js/api.min.js';
  s.async = true;
  s.dataset.user = u;
  s.dataset.account = ac;
  d.getElementsByTagName('head')[0].appendChild(s);
})(document, ${TRACKING.optinMonsterUser}, ${TRACKING.optinMonsterAccount});
`;

export const LINKEDIN_PARTNER_SCRIPT = `
_linkedin_partner_id = "${TRACKING.linkedinPartnerId}";
window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push(_linkedin_partner_id);
`;

export const LINKEDIN_INSIGHT_SCRIPT = `
(function (l) {
  if (!l) {
    window.lintrk = function (a, b) { window.lintrk.q.push([a, b]) };
    window.lintrk.q = [];
  }
  var s = document.getElementsByTagName("script")[0];
  var b = document.createElement("script");
  b.type = "text/javascript";
  b.async = true;
  b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
  s.parentNode.insertBefore(b, s);
})(window.lintrk);
`;

export const CUSTOMER_IO_SCRIPT = `
!function () {
  var i = "cioanalytics", analytics = (window[i] = window[i] || []);
  if (!analytics.initialize)
    if (analytics.invoked) window.console && console.error && console.error("Snippet included twice.");
    else {
      analytics.invoked = !0;
      analytics.methods = ["trackSubmit", "trackClick", "trackLink", "trackForm", "pageview", "identify", "reset", "group", "track", "ready", "alias", "debug", "page", "once", "off", "on", "addSourceMiddleware", "addIntegrationMiddleware", "setAnonymousId", "addDestinationMiddleware"];
      analytics.factory = function (e) {
        return function () {
          var t = Array.prototype.slice.call(arguments);
          t.unshift(e);
          analytics.push(t);
          return analytics
        }
      };
      for (var e = 0; e < analytics.methods.length; e++) {
        var key = analytics.methods[e];
        analytics[key] = analytics.factory(key)
      }
      analytics.load = function (key, e) {
        var t = document.createElement("script");
        t.type = "text/javascript";
        t.async = !0;
        t.setAttribute("data-global-customerio-analytics-key", i);
        t.src = "https://cdp-eu.customer.io/v1/analytics-js/snippet/" + key + "/analytics.min.js";
        var n = document.getElementsByTagName("script")[0];
        n.parentNode.insertBefore(t, n);
        analytics._writeKey = key;
        analytics._loadOptions = e
      };
      analytics.SNIPPET_VERSION = "4.15.3";
      analytics.load("${TRACKING.customerIoWriteKey}");
      analytics.page();
    }
}();
`;
