/* Accounts and saved progress.
   Uses Firebase (Authentication + Firestore) when firebase-config.js is filled in; otherwise a demo mode
   that keeps accounts in this browser only, so the sign-in screens can be tried before Firebase is set up.
   Both expose the same interface: window.EJUAuth. */
(function () {
  "use strict";

  var cfg = window.FIREBASE_CONFIG || {};
  var configured = !!(cfg.apiKey && cfg.projectId && cfg.appId);
  var SDK = "https://www.gstatic.com/firebasejs/10.12.2/";

  function err(code) { var e = new Error(code); e.code = code; return e; }
  function loadScript(src) {
    return new Promise(function (ok, bad) {
      var s = document.createElement("script");
      s.src = src; s.onload = ok;
      s.onerror = function () { bad(err("auth/sdk-load-failed")); };
      document.head.appendChild(s);
    });
  }

  /* ---------- Firebase ---------- */
  function firebaseBackend() {
    var auth, db, listener = function () {}, signingUp = false;
    function toUser(u) { return u ? { uid: u.uid, name: u.displayName || (u.email || "").split("@")[0], email: u.email || "" } : null; }
    var ready = loadScript(SDK + "firebase-app-compat.js").then(function () {
      return Promise.all([loadScript(SDK + "firebase-auth-compat.js"), loadScript(SDK + "firebase-firestore-compat.js")]);
    }).then(function () {
      window.firebase.initializeApp(cfg);
      auth = window.firebase.auth();
      db = window.firebase.firestore();
    });
    function stamp() { return window.firebase.firestore.FieldValue.serverTimestamp(); }
    return {
      mode: "firebase",
      onChange: function (cb) {
        listener = cb;
        ready.then(function () {
          /* while signing up, wait until the display name is saved before reporting the new user */
          auth.onAuthStateChanged(function (u) { if (!signingUp) listener(toUser(u)); });
        }).catch(function (e) { listener(null, e); });
      },
      signIn: function (email, pw) {
        return ready.then(function () { return auth.signInWithEmailAndPassword(email, pw); });
      },
      signUp: function (name, email, pw) {
        return ready.then(function () {
          signingUp = true;
          return auth.createUserWithEmailAndPassword(email, pw);
        }).then(function (cred) {
          return cred.user.updateProfile({ displayName: name });
        }).then(function () {
          signingUp = false;
          listener(toUser(auth.currentUser));
        }, function (e) {
          signingUp = false;
          if (auth && auth.currentUser) listener(toUser(auth.currentUser));
          throw e;
        });
      },
      signOut: function () { return ready.then(function () { return auth.signOut(); }); },
      resetPassword: function (email, lang) {
        return ready.then(function () { auth.languageCode = lang; return auth.sendPasswordResetEmail(email); });
      },
      loadProgress: function (uid) {
        return ready.then(function () { return db.collection("users").doc(uid).get(); })
          .then(function (d) { return d.exists ? d.data().progress || null : null; });
      },
      saveProgress: function (user, progress, doneCount) {
        return ready.then(function () {
          var b = db.batch();
          b.set(db.collection("users").doc(user.uid), { name: user.name, progress: progress, updated: stamp() }, { merge: true });
          b.set(db.collection("ranking").doc(user.uid), { name: user.name, done: doneCount, updated: stamp() });
          return b.commit();
        });
      },
      ranking: function () {
        return ready.then(function () { return db.collection("ranking").orderBy("done", "desc").limit(20).get(); })
          .then(function (qs) { return qs.docs.map(function (d) { var x = d.data(); return { uid: d.id, name: x.name, done: x.done }; }); });
      }
    };
  }

  /* ---------- Demo (this browser only) ---------- */
  function demoBackend() {
    var ACC = "eju-demo-accounts", SES = "eju-demo-session", RANK = "eju-demo-ranking", listener = function () {};
    function get(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } }
    function put(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
    function hash(s) {
      if (!(window.crypto && crypto.subtle && window.TextEncoder)) return Promise.resolve("plain:" + s);
      return crypto.subtle.digest("SHA-256", new TextEncoder().encode("eju-demo:" + s)).then(function (buf) {
        return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ("0" + b.toString(16)).slice(-2); }).join("");
      });
    }
    function current() {
      var uid = get(SES, null), accs = get(ACC, {});
      for (var email in accs) if (accs[email].uid === uid) return { uid: uid, name: accs[email].name, email: email };
      return null;
    }
    return {
      mode: "demo",
      onChange: function (cb) { listener = cb; setTimeout(function () { listener(current()); }, 0); },
      signIn: function (email, pw) {
        var acc = get(ACC, {})[email];
        if (!acc) return Promise.reject(err("auth/invalid-credential"));
        return hash(pw).then(function (h) {
          if (h !== acc.pw) throw err("auth/invalid-credential");
          put(SES, acc.uid); listener(current());
        });
      },
      signUp: function (name, email, pw) {
        var accs = get(ACC, {});
        if (accs[email]) return Promise.reject(err("auth/email-already-in-use"));
        return hash(pw).then(function (h) {
          var uid = "demo-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
          accs[email] = { uid: uid, name: name, pw: h };
          put(ACC, accs); put(SES, uid); listener(current());
        });
      },
      signOut: function () { try { localStorage.removeItem(SES); } catch (e) {} listener(null); return Promise.resolve(); },
      resetPassword: function () { return Promise.reject(err("demo/no-email")); },
      loadProgress: function () { return Promise.resolve(null); },
      saveProgress: function (user, progress, doneCount) {
        var r = get(RANK, {}); r[user.uid] = { name: user.name, done: doneCount }; put(RANK, r);
        return Promise.resolve();
      },
      ranking: function () {
        var r = get(RANK, {});
        return Promise.resolve(Object.keys(r).map(function (uid) { return { uid: uid, name: r[uid].name, done: r[uid].done }; })
          .sort(function (a, b) { return b.done - a.done; }).slice(0, 20));
      }
    };
  }

  window.EJUAuth = configured ? firebaseBackend() : demoBackend();
})();
