/* App (PWA) helper: keeps a copy of the website so it opens from the home-screen icon and the lesson text
   can be read without internet. Nothing to edit when adding lessons.

   - Files of this website (index.html, assets/, content/): always fetched fresh when online (so new lessons
     appear at once); the saved copy is used only when offline or when the network is very slow.
   - Fonts, MathJax and the Firebase library (fixed versions on other sites): saved once, reused.
   - YouTube, sign-in and saved progress (Firebase) are never touched: they need internet.

   Change VERSION only when this file's caching rules change; old saved copies are then removed. */
"use strict";

var VERSION = "v1";
var PAGES = "eju-pages-" + VERSION;
var LIBS = "eju-libs-" + VERSION;
var SLOW_MS = 4000;

var SHELL = [
  "index.html", "manifest.webmanifest", "firebase-config.js",
  "assets/style.css", "assets/app.js", "assets/auth.js", "assets/lesson-parser.js",
  "assets/icons/icon-192.png", "assets/icons/favicon-32.png",
  "content/courses.json", "content/site.json", "content/math-topics.json", "content/terms.md"
];

/* other sites whose files never change (version in the address) or rarely change */
function libKind(url) {
  if (url.hostname === "fonts.googleapis.com") return "refresh";
  if (url.hostname === "fonts.gstatic.com" || url.hostname === "cdn.jsdelivr.net") return "keep";
  if (url.hostname === "www.gstatic.com" && url.pathname.indexOf("/firebasejs/") === 0) return "keep";
  return null;
}

/* one saved copy per file: drop ?v=… and treat the folder address as index.html */
function keyOf(url) {
  var u = new URL(url);
  var path = u.pathname.replace(/\/$/, "/index.html");
  return u.origin + path;
}
function usable(res) { return res && (res.ok || res.type === "opaque"); }

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(PAGES).then(function (cache) {
    return Promise.all(SHELL.map(function (p) {
      var url = new URL(p, self.registration.scope).href;
      return fetch(url, { cache: "no-cache" }).then(function (res) {
        if (res.ok) return cache.put(keyOf(url), res);
      }).catch(function () {});
    }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (names) {
    return Promise.all(names.filter(function (n) {
      return /^eju-/.test(n) && n !== PAGES && n !== LIBS;
    }).map(function (n) { return caches.delete(n); }));
  }).then(function () { return self.clients.claim(); }));
});

/* lesson pictures are only requested when a lesson is opened: save them as soon as the lesson text arrives */
function savePictures(lessonUrl, text) {
  var re = /^!\[.*\]\(\s*([^\s)]+)\s*\)\s*$/gm, m, list = [];
  while ((m = re.exec(text))) {
    var src = m[1];
    if (/^https?:\/\//.test(src)) continue;
    if (!/^content\//.test(src)) src = "content/images/" + src;
    list.push(new URL(src, self.registration.scope).href);
  }
  if (!list.length) return Promise.resolve();
  return caches.open(PAGES).then(function (cache) {
    return Promise.all(list.map(function (url) {
      return cache.match(keyOf(url)).then(function (hit) {
        if (hit) return;
        return fetch(url).then(function (res) { if (res.ok) return cache.put(keyOf(url), res); });
      }).catch(function () {});
    }));
  });
}

function noop() {}

/* waitUntil must be called right away (not later), so the saving work is chained here and handed over at once */
function sameSite(e) {
  var req = e.request, key = keyOf(req.url);
  var net = fetch(req);
  var stored = net.then(function (res) {
    if (!res.ok) return;
    var copy = res.clone();
    var forPics = /\/content\/lessons\/[^\/]+\.md$/.test(key) ? res.clone() : null;
    return caches.open(PAGES).then(function (c) { return c.put(key, copy); }).then(function () {
      if (forPics) return forPics.text().then(function (t) { return savePictures(req.url, t); });
    });
  });
  e.waitUntil(stored.catch(noop));

  var saved = caches.open(PAGES).then(function (cache) {
    return cache.match(key).then(function (hit) {
      if (hit || req.mode !== "navigate") return hit;
      return cache.match(keyOf(new URL("index.html", self.registration.scope).href));
    });
  }).catch(noop);

  return new Promise(function (resolve, reject) {
    var done = false;
    function useSaved(orElse) {
      saved.then(function (hit) {
        if (done) return;
        if (hit) { done = true; resolve(hit); } else if (orElse) orElse();
      });
    }
    /* very slow network: show the saved copy (the fresh one is still saved for next time) */
    var timer = setTimeout(function () { useSaved(null); }, SLOW_MS);
    net.then(function (res) {
      clearTimeout(timer);
      if (done) return;
      if (res.ok || res.status === 404) { done = true; resolve(res); }
      else useSaved(function () { done = true; resolve(res); });
    }, function (err) {
      clearTimeout(timer);
      useSaved(function () { if (!done) { done = true; reject(err); } });
    });
  });
}

function otherSite(e, kind) {
  var req = e.request;
  var work = caches.open(LIBS).then(function (cache) {
    return cache.match(req.url).then(function (hit) {
      if (hit && kind === "keep") return { res: hit, saving: null };
      var net = fetch(req);
      var saving = net.then(function (res) {
        if (usable(res)) return cache.put(req.url, res.clone());
      });
      return { res: hit || net, saving: saving };
    });
  });
  e.waitUntil(work.then(function (w) { return w.saving; }).catch(noop));
  return work.then(function (w) { return w.res; });
}

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin === self.location.origin) {
    if (url.pathname.slice(-6) === "/sw.js") return;
    e.respondWith(sameSite(e));
    return;
  }
  var kind = libKind(url);
  if (kind) e.respondWith(otherSite(e, kind));
});
