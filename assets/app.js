/* EJU learning site. Pages are drawn from the files in content/ (see HUONG-DAN.md). */
(function () {
  /* ================= LANGUAGE HELPERS ================= */
  /* Four modes: VI, JP+VI, JP, EN. Markup: .lj Japanese, .lv Vietnamese, .le English.
     In EN mode a Japanese part is hidden only when it has an English version (.xe), otherwise Japanese shows.
     A Japanese part with no Vietnamese version is marked .nv so it stays visible in VI mode. */
  var UI_EN = {
    "準備中": "Coming soon", "本": "lessons", "総学習時間": "Total study time", "時間": "h", "分": "min",
    "まだ視聴した授業はありません。": "You haven't watched any lessons yet.",
    "上のメニューから科目を選ぶか、下のおすすめの授業から始めましょう。": "Pick a subject from the menu above, or start with a recommended lesson below.",
    "おすすめの授業": "Recommended lessons", "まだデータがありません。": "No data yet.",
    "授業を見ると、よく学習している科目がここに表示されます。": "Once you watch lessons, your most-studied subjects will appear here.",
    "次の授業": "Next lesson", "前の授業": "Previous lesson",
    "このコースの授業をすべて完了しました。": "You've completed every lesson in this course.",
    "このコースは準備中です。": "This course is being prepared.",
    "このコースは準備中です。予定している章は次のとおりです。": "This course is being prepared. The planned chapters are listed below.",
    "この章の授業はすべて完了しました。": "You've completed every lesson in this chapter.",
    "この章は準備中です。": "This chapter is being prepared.",
    "学習状況": "My study", "表示": "Show", "すべて表示": "Show all",
    "この授業の動画は準備中です。": "The video for this lesson is being prepared.",
    "ブックマーク": "Saved", "完了": "Completed", "未完了": "Not completed", "解説": "Explanation",
    "この授業は完了しています。": "This lesson is completed.", "答え合わせ": "Check answers", "やり直す": "Try again",
    "未採点": "Not checked yet", "用語": "Terms", "意味": "Meaning", "例題": "Example",
    "解答は「解答」タブで確認しよう。": "See the solution in the Answers tab.", "練習": "Practice",
    "この授業のテキストは準備中です。": "The text for this lesson is being prepared.",
    "例題の解答": "Example solution", "練習の解答": "Practice answers", "答え": "Answer",
    "この授業には問題がありません。": "This lesson has no exercises.", "要点まとめ": "Summary",
    "まとめは準備中です。": "The summary is being prepared.", "単語リスト": "Word list",
    "「意味をかくす」で自分をテスト。灰色の部分をタップすると表示されます。": "Use Hide meanings to test yourself. Tap a grey cell to reveal it.",
    "意味をかくす": "Hide meanings", "意味を表示": "Show meanings", "テスト": "Test",
    "正しい意味を選ぼう。全問正解でこの単語セットは完了です。": "Choose the correct meaning. Get them all right to complete this word set.",
    "正解": "Correct", "未解答": "No answer", "不正解": "Incorrect", "得点": "Score",
    "この授業を完了しました！": "Lesson completed!", "ランキング": "Ranking",
    "会員どうしのランキングはログイン機能が必要なため、本番のサイトで表示されます。いまは、あなたがよく見た授業を表示しています。": "A ranking between members needs a login system and will come with the full site. For now, these are the lessons you've watched most.",
    "よく見た授業": "Most-watched lessons", "ブックマークした授業はありません。": "No saved lessons yet.",
    "動画のページで「☆ ブックマーク」を押すと、ここに保存されます。": "Press ☆ Save on a lesson page to keep it here.",
    "授業をいくつか見ると、ここが自動で更新されます。": "Watch a few lessons and this list will update itself.",
    "見つかりませんでした。": "No lessons found.",
    "別のキーワードで試してみよう（例：平方完成、mol、細胞）。": "Try another keyword, for example 平方完成, mol or cell.",
    "読み込み中…": "Loading lessons…",
    "最近よく学習している科目": "Most studied recently", "日本語": "Japanese", "数学": "Math", "理科": "Science",
    "社会": "Social studies", "単語": "Vocabulary", "視聴履歴": "Watch history",
    "ポイント": "Key points", "まとめ": "Summary", "テキスト": "Lesson", "解答": "Answers", "前後の授業": "Other lessons",
    "各ボックスに数字（または −）を1つずつ入れて、「答え合わせ」を押そう。": "Enter one digit (or −) in each box, then press Check answers.",
    "各問で1つ選んで、「答え合わせ」を押そう。": "Choose one answer for each question, then press Check answers."
  };
  function enOf(ja, en) { return en != null ? en : UI_EN[ja]; }
  function ljc(vi, en) { return "lj" + (en ? " xe" : "") + (vi == null ? " nv" : ""); }
  function bi(ja, vi, en) {
    en = enOf(ja, en);
    return '<span class="' + ljc(vi, en) + '">' + ja + "</span>" + (vi != null ? '<span class="lv sep">' + vi + "</span>" : "") + (en ? '<span class="le">' + en + "</span>" : "");
  }
  function stack(ja, vi, en) {
    en = enOf(ja, en);
    return '<span class="' + ljc(vi, en) + '">' + ja + "</span>" + (vi != null ? '<span class="lv">' + vi + "</span>" : "") + (en ? '<span class="le">' + en + "</span>" : "");
  }
  function bs(ja, vi, en) { return '<span class="bs">' + stack(ja, vi, en) + "</span>"; }
  function unit(ja, vi, en) {
    en = enOf(ja, en);
    return '<span class="' + ljc(vi, en) + '">' + ja + '</span><span class="lv u">' + vi + "</span>" + (en ? '<span class="le">&nbsp;' + en + "</span>" : "");
  }
  function jv(ja, vi, en) {
    en = enOf(ja, en);
    return '<span class="' + ljc(vi, en) + '">' + ja + '</span><span class="vo">' + vi + "</span>" + (en ? '<span class="le">' + en + "</span>" : "");
  }
  /* x: a string (same in every mode) or [ja, vi, en] where vi or en may be missing */
  function para(x) {
    if (typeof x === "string") return "<p>" + x + "</p>";
    var en = enOf(x[0], x[2]);
    return '<div class="bl"><p class="' + ljc(x[1], en) + '">' + x[0] + "</p>" + (x[1] != null ? '<p class="lv">' + x[1] + "</p>" : "") + (en ? '<p class="le">' + en + "</p>" : "") + "</div>";
  }
  function li(x) {
    if (typeof x === "string") return "<li>" + x + "</li>";
    return "<li>" + stack(x[0], x[1], x[2]) + "</li>";
  }
  /* a secondary line under a Japanese title: Vietnamese, plus English when there is one */
  function subs(cls, tag, vi, en) {
    return (vi ? "<" + tag + ' class="' + cls + ' lv">' + vi + "</" + tag + ">" : "") + (en ? "<" + tag + ' class="' + cls + ' le">' + en + "</" + tag + ">" : "");
  }
  /* plain text for places that cannot hold markup (select options, placeholders) */
  function langText(ja, vi, en) { return lang === "ja" ? ja : lang === "vi" ? vi : lang === "en" ? (en || ja) : ja + " · " + vi; }
  function blocks(arr) {
    return arr.map(function (b) {
      if (b[0] === "p") return para(b[2] == null && b[3] == null ? b[1] : [b[1], b[2], b[3]]);
      if (b[0] === "f") return '<div class="formula">' + b[1] + "</div>";
      if (b[0] === "line") return '<p class="formula-line">' + b[1] + "</p>";
      if (b[0] === "ul") return "<ul>" + b[1].map(li).join("") + "</ul>";
      if (b[0] === "html") return b[1];
      if (b[0] === "cmp") return '<div class="compare">' + b[1].map(function (c) {
        return "<div><h4>" + c.hj + subs("", "span", c.hv, c.he) + "</h4>" + para(c.vi || c.en ? [c.ja, c.vi || null, c.en || null] : c.ja) + "</div>";
      }).join("") + "</div>";
      return "";
    }).join("");
  }

  /* ================= DATA (loaded from content/) ================= */
  var SUBJECTS = [], SUBJ = {}, SERIES_VI = {}, SERIES_EN = {}, COURSES = [], CMAP = {}, V = {};
  var SITE = { student: { initial: "", name: "", lines: [] }, recommended: [], footer: [] };
  var CONTENT_ERRORS = [];

  function getText(url) {
    return fetch(url, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error(r.status === 404 ? "Không tìm thấy file này." : "Không tải được file (lỗi " + r.status + ").");
      return r.text();
    });
  }
  function getJSON(url) {
    return getText(url).then(function (t) {
      try { return JSON.parse(t.replace(/^﻿/, "")); }
      catch (e) { throw new Error("Sai cú pháp JSON (thường do thiếu dấu phẩy, dấu ngoặc hoặc dấu \"). " + e.message); }
    });
  }
  function contentError(file, msg, line) { CONTENT_ERRORS.push({ file: file, msg: msg, line: line }); }

  /* YouTube link (any common form) → embed URL, or null if it is not a YouTube link. */
  function ytEmbed(url) {
    var s = String(url || "").trim(), id = null, m;
    if (/^[A-Za-z0-9_-]{11}$/.test(s)) id = s;
    else if ((m = s.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/|live\/|v\/))([A-Za-z0-9_-]{11})/))) id = m[1];
    if (!id) return null;
    var start = 0, t = s.match(/[?&#](?:t|start)=([0-9hms]+)/);
    if (t) {
      if (/^\d+$/.test(t[1])) start = +t[1];
      else {
        var hh = t[1].match(/(\d+)h/), mm = t[1].match(/(\d+)m/), ss = t[1].match(/(\d+)s/);
        start = (hh ? +hh[1] * 3600 : 0) + (mm ? +mm[1] * 60 : 0) + (ss ? +ss[1] : 0);
      }
    }
    return "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0&playsinline=1" + (start ? "&start=" + start : "");
  }

  function loadContent() {
    var site = getJSON("content/site.json").catch(function (e) { contentError("content/site.json", e.message); return null; });
    var topicsFile = getJSON("content/math-topics.json").catch(function (e) { contentError("content/math-topics.json", e.message); return { topics: [] }; });
    return Promise.all([getJSON("content/courses.json"), site, topicsFile]).then(function (r) {
      var data = r[0];
      if (r[1]) Object.keys(r[1]).forEach(function (k) { SITE[k] = r[1][k]; });
      SUBJECTS = data.subjects || [];
      SUBJECTS.forEach(function (s) { SUBJ[s.id] = s; });
      SERIES_VI = data.series_vi || {};
      SERIES_EN = data.series_en || {};
      var seen = {};
      function takeIds(list, file) {
        return (list || []).filter(function (id) {
          if (!/^[A-Za-z0-9_-]+$/.test(id)) { contentError(file, "Tên bài \"" + id + "\" chỉ được dùng chữ không dấu, số, - và _."); return false; }
          if (seen[id]) { contentError(file, "Bài \"" + id + "\" được ghi ở hai chỗ. Mỗi bài chỉ khai báo một lần."); return false; }
          seen[id] = 1; return true;
        });
      }
      function plannedOf(list) { return (list || []).map(function (p) { return [p.ja || "", p.vi || "", p.en || ""]; }); }
      /* Math topics (content/math-topics.json): each topic is declared once, with its sections (1), (2)... and lessons,
         and becomes a chapter in every course that lists its number. */
      var TOPIC = {};
      (r[2].topics || []).forEach(function (tp) {
        TOPIC[tp.no] = { ja: tp.ja || "", vi: tp.vi || "", en: tp.en || "", tag: tp.tag || "", secs: (tp.sections || []).map(function (s, k) {
          var n = "(" + (k + 1) + ") ";
          return { t: [n + (s.ja || ""), s.vi ? n + s.vi : null, s.en ? n + s.en : null], v: takeIds(s.lessons, "content/math-topics.json"), p: plannedOf(s.planned) };
        }) };
      });
      function topicChapter(tp, n, showTag) {
        var tag = showTag && tp.tag ? "（" + tp.tag + "）" : "";
        return { t: ["第" + n + "章 " + tp.ja + tag, tp.vi ? "Chương " + n + ": " + tp.vi : "", tp.en ? "Chapter " + n + ": " + tp.en : ""],
          secs: tp.secs.map(function (s) { return { t: s.t, v: s.v.slice(), p: s.p }; }) };
      }
      COURSES = (data.courses || []).filter(function (c) {
        if (!c.id || !SUBJ[c.subject]) { contentError("content/courses.json", "Khóa \"" + (c.name || c.id) + "\" có subject \"" + c.subject + "\" không nằm trong danh sách subjects."); return false; }
        return true;
      }).map(function (c) {
        var chapters = c.topics ? c.topics.filter(function (no) {
          if (!TOPIC[no]) { contentError("content/courses.json", "Khóa \"" + c.name + "\" ghi chủ đề số " + no + " nhưng content/math-topics.json không có chủ đề này."); return false; }
          return true;
        }).map(function (no, i) { return topicChapter(TOPIC[no], i + 1, c.showTag); }) : (c.chapters || []).map(function (ch) {
          var o = { t: [ch.ja || "", ch.vi || "", ch.en || ""] };
          var ids = takeIds(ch.lessons, "content/courses.json");
          if (ids.length) o.v = ids;
          if (ch.planned && ch.planned.length) o.p = plannedOf(ch.planned);
          return o;
        });
        return { id: c.id, s: c.subject, series: c.series || "", name: c.name || "", vi: c.vi || "", en: c.en || "", ch: chapters };
      });
      return Promise.all(Object.keys(seen).map(function (id) {
        var file = "content/lessons/" + id + ".md";
        return getText(file).then(function (t) {
          var v = window.EJULesson.parse(t);
          ["video", "videoKaisetsu", "videoTango"].forEach(function (k) {
            if (v[k] && !ytEmbed(v[k])) { contentError(file, "Link video không phải link YouTube: " + v[k]); delete v[k]; }
          });
          V[id] = v;
        }).catch(function (e) { contentError(file, e.message, e.line); });
      }));
    }).then(function () {
      COURSES.forEach(function (c) {
        c.label = c.series + " " + c.name;
        c.seriesVi = SERIES_VI[c.series] || "";
        c.labelVi = c.vi + (c.seriesVi ? " · " + c.seriesVi : "");
        c.seriesEn = SERIES_EN[c.series] || "";
        c.labelEn = c.en ? c.en + (c.seriesEn ? " · " + c.seriesEn : "") : "";
        c.vids = [];
        c.ch.forEach(function (ch, i) {
          if (ch.secs) {
            /* a topic chapter: its lessons and planned cards are those of its sections, in order */
            ch.secs.forEach(function (s) { s.v = s.v.filter(function (id) { return V[id]; }); });
            ch.v = [].concat.apply([], ch.secs.map(function (s) { return s.v; }));
            ch.p = [].concat.apply([], ch.secs.map(function (s) { return s.p; }));
            if (!ch.p.length) delete ch.p;
          }
          if (ch.v) { ch.v = ch.v.filter(function (id) { return V[id]; }); if (!ch.v.length) delete ch.v; }
          /* a lesson of a shared topic sits in several courses: v.homes lists them, v.c / v.chi is the first */
          (ch.v || []).forEach(function (id) {
            var v = V[id];
            v.id = id;
            (v.homes = v.homes || []).push({ c: c.id, chi: i });
            if (v.c == null) { v.c = c.id; v.chi = i; }
            c.vids.push(id);
          });
        });
        CMAP[c.id] = c;
      });
      SITE.recommended = (SITE.recommended || []).filter(function (id) { return V[id]; });
      if (!SITE.recommended.length) SITE.recommended = Object.keys(V).slice(0, 4);
    });
  }

  /* ================= STATE ================= */
  /* Progress belongs to the signed-in account: cached in this browser under its uid and pushed to the
     account (Firebase) a moment after each change. "eju-site-v2" is the old, account-less progress. */
  var LEGACY_KEY = "eju-site-v2", LANG_KEY = "eju-lang";
  var user = null;
  function emptyState() { return { hist: [], done: {}, marks: {}, updated: 0 }; }
  function loadKey(k) {
    try { var d = JSON.parse(localStorage.getItem(k)); if (d && d.hist) return d; } catch (e) {}
    return null;
  }
  var st = emptyState();
  function cacheKey() { return "eju-progress:" + user.uid; }
  function doneCount() { return Object.keys(st.done).filter(function (id) { return st.done[id]; }).length; }
  var pushTimer = null;
  function pushProgress() {
    clearTimeout(pushTimer);
    if (user) window.EJUAuth.saveProgress(user, st, doneCount()).catch(function () {});
  }
  function save() {
    if (!user) return;
    st.updated = Date.now();
    try { localStorage.setItem(cacheKey(), JSON.stringify(st)); } catch (e) {}
    clearTimeout(pushTimer);
    pushTimer = setTimeout(pushProgress, 1500);
  }
  /* completed lessons and watch history add up; bookmarks follow the most recently changed copy */
  function mergeState(a, b) {
    var out = emptyState(), newer = (a && b) ? ((a.updated || 0) >= (b.updated || 0) ? a : b) : (a || b);
    [a, b].forEach(function (s) {
      if (!s) return;
      Object.keys(s.done || {}).forEach(function (k) { if (s.done[k]) out.done[k] = true; });
      (s.hist || []).forEach(function (h) { out.hist.push(h); });
    });
    if (newer) Object.keys(newer.marks || {}).forEach(function (k) { if (newer.marks[k]) out.marks[k] = true; });
    var seen = {};
    out.hist = out.hist.filter(function (h) { var k = h.id + "@" + h.t; if (seen[k]) return false; seen[k] = 1; return true; })
      .sort(function (x, y) { return x.t - y.t; }).slice(-300);
    out.updated = Math.max(a ? a.updated || 0 : 0, b ? b.updated || 0 : 0);
    return out;
  }

  var lang = "both";
  try { var savedLang = localStorage.getItem(LANG_KEY); if (savedLang === "ja" || savedLang === "vi" || savedLang === "both" || savedLang === "en") lang = savedLang; } catch (e) {}
  function applyLang(l) {
    lang = l;
    document.body.classList.toggle("lang-ja", l === "ja");
    document.body.classList.toggle("lang-vi", l === "vi");
    document.body.classList.toggle("lang-en", l === "en");
    document.documentElement.lang = l === "vi" ? "vi" : l === "en" ? "en" : "ja";
    /* texts that cannot hold markup carry their three versions in data attributes */
    document.querySelectorAll("[data-ja]").forEach(function (el) {
      var t = langText(el.dataset.ja, el.dataset.vi, el.dataset.en);
      if (el.tagName === "INPUT") el.placeholder = t; else el.textContent = t;
    });
    document.querySelectorAll(".langsw button").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.lang === l ? "true" : "false"); });
    try { localStorage.setItem(LANG_KEY, l); } catch (e) {}
  }
  /* delegated, so switches drawn later (sign-in screen) work too */
  document.addEventListener("click", function (e) {
    var b = e.target.closest(".langsw button");
    if (b) applyLang(b.dataset.lang);
  });
  function langSwitch() {
    return '<div class="langsw" role="group" aria-label="Ngôn ngữ · 言語 · Language">' + [["vi", "VI"], ["both", "JP+VI"], ["ja", "JP"], ["en", "EN"]].map(function (x) {
      return '<button type="button" data-lang="' + x[0] + '" aria-pressed="' + (lang === x[0]) + '">' + x[1] + "</button>";
    }).join("") + "</div>";
  }
  applyLang(lang);

  /* ================= HELPERS ================= */
  var app = document.getElementById("app");
  var CIRCLED = ["", "①", "②", "③", "④", "⑤", "⑥"];
  var ICON = {
    trophy: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 21h8M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0V4z" fill="currentColor" fill-opacity=".18"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/></svg>',
    check: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M7.5 12.5l3 3 6-6" fill="none" stroke="var(--band)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    tick: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    star: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2.5 15 8.6 21.7 9.5 16.8 14.2 18 20.9 12 17.7 6 20.9 7.2 14.2 2.3 9.5 9 8.6"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="7 4 20 12 7 20" fill="currentColor"/></svg>',
    playSm: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><polygon points="7 4 20 12 7 20" fill="currentColor"/></svg>',
    vol: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 0 1 0 7" stroke-linecap="round"/></svg>',
    full: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>'
  };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function ruby(w) { return w[1] ? "<ruby>" + w[0] + "<rt>" + w[1] + "</rt></ruby>" : w[0]; }
  function durSec(d) { if (!d) return 0; var p = d.split(":"); return (+p[0]) * 60 + (+p[1]); }
  function fmtDate(t) { var d = new Date(t); return d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate(); }
  function uniqueViews() {
    var seen = {}, out = [];
    for (var i = st.hist.length - 1; i >= 0; i--) {
      var h = st.hist[i];
      if (!seen[h.id] && V[h.id]) { seen[h.id] = 1; out.push(h); }
    }
    return out;
  }
  function viewCount(id) { return st.hist.filter(function (h) { return h.id === id; }).length; }
  function chapterDone(ch) { return !!(ch.v && ch.v.length && ch.v.every(function (id) { return st.done[id]; })); }
  function trophies(c) { return c.ch.filter(chapterDone).length; }
  function doneIn(c) { return c.vids.filter(function (id) { return st.done[id]; }).length; }
  function stats() {
    var uniq = uniqueViews();
    var done = Object.keys(st.done).filter(function (id) { return st.done[id] && V[id]; }).length;
    var troph = COURSES.reduce(function (a, c) { return a + trophies(c); }, 0);
    var sec = uniq.reduce(function (a, h) { return a + durSec(V[h.id].dur); }, 0);
    var xp = uniq.length * 10 + done * 40 + troph * 100;
    return { uniq: uniq, done: done, troph: troph, sec: sec, lv: 1 + Math.floor(xp / 200), into: xp % 200 };
  }

  /* MathJax */
  var mjReady = false;
  function typeset(el) { if (mjReady && el) { window.MathJax.typesetPromise([el]).then(function () { fitMath(el); }).catch(function () {}); } }
  /* in-line formulas cannot wrap; mark the ones wider than their line so CSS lets them scroll */
  function fitMath(root) {
    root.querySelectorAll('mjx-container:not([display="true"])').forEach(function (c) {
      c.classList.remove("mj-wide");
      var host = c.parentElement && c.parentElement.closest("p, li, td, div, h1, h2, h3, h4");
      if (host && c.getBoundingClientRect().width > host.clientWidth) c.classList.add("mj-wide");
    });
  }
  var fitTimer;
  window.addEventListener("resize", function () { clearTimeout(fitTimer); fitTimer = setTimeout(function () { if (mjReady) fitMath(app); }, 200); });
  function setHTML(el, html) {
    if (mjReady && window.MathJax.typesetClear) { try { window.MathJax.typesetClear([el]); } catch (e) {} }
    el.innerHTML = html;
    typeset(el);
  }
  window.MathJax = {
    tex: { inlineMath: [["\\(", "\\)"]], displayMath: [["\\[", "\\]"]] },
    svg: { fontCache: "global" },
    options: { enableMenu: false },
    startup: {
      typeset: false,
      ready: function () {
        window.MathJax.startup.defaultReady();
        window.MathJax.startup.promise.then(function () { mjReady = true; typeset(app); });
      }
    }
  };

  /* ================= PIECES ================= */
  function thumb(v) {
    var s = CMAP[v.c].s;
    return '<div class="thumb" data-subj="' + s + '"><div class="board"><span class="b-tag">' + (v.kind === "vocab" ? "単語" : "要点") + " | " + v.t + '</span><div class="b-lines">' +
      v.board.map(function (l) { return '<span class="b-line">' + l + "</span>"; }).join("") +
      '</div><span class="b-mark">' + SUBJ[s].ja + '</span></div>' + (v.dur ? '<span class="dur">' + v.dur + "</span>" : "") +
      (st.done[v.id] ? '<span class="donebadge" aria-label="完了 · Hoàn thành">' + ICON.tick + "</span>" : "") + "</div>";
  }
  function planThumb(title, s) {
    return '<div class="thumb plan" data-subj="' + s + '"><div class="board"><span class="b-tag">準備中</span><div class="b-lines"><span class="b-line small">' + title + "</span></div></div></div>";
  }
  function clabel(c) { return '<p class="clabel ' + ljc(c.labelVi, c.labelEn) + '">' + c.label + '</p><p class="clabel lv">' + c.labelVi + "</p>" + (c.labelEn ? '<p class="clabel le">' + c.labelEn + "</p>" : ""); }
  function vrow(id, meta) {
    var v = V[id], c = CMAP[v.c];
    return '<a class="vrow" href="#v-' + id + '" data-subj="' + c.s + '">' + thumb(v) + '<div class="vrow-body">' + clabel(c) + '<p class="vtitle">' + v.t +
      "</p>" + subs("vvi", "p", v.vi, v.en) + (meta ? '<p class="vmeta">' + meta + "</p>" : "") + "</div></a>";
  }
  function vcard(id) {
    var v = V[id];
    return '<a class="vcard" href="#v-' + id + '">' + thumb(v) + '<div><p class="vtitle">' + v.t + "</p>" + subs("vvi", "p", v.vi, v.en) + "</div></a>";
  }
  function pcard(p, s) {
    return '<div class="vcard is-plan" aria-disabled="true">' + planThumb(p[0], s) + '<div><p class="vtitle">' + p[0] + "</p>" + subs("vvi", "p", p[1], p[2]) + '<p class="vvi">' + bi("準備中", "Sắp có") + "</p></div></div>";
  }
  function crow(c) {
    var tot = c.vids.length, d = doneIn(c);
    return '<a class="crow" href="#c-' + c.id + '" data-subj="' + c.s + '"><div><p class="crow-series">' + bi(c.series, c.seriesVi, c.seriesEn) + '</p><p class="crow-name">' + c.name + "</p>" + subs("vvi", "p", c.vi, c.en) + '</div><div class="crow-side">' +
      (tot ? '<span class="crow-prog">' + d + " / " + tot + " " + unit("本", "bài") + '</span><span class="minibar"><span style="width:' + Math.round(d / tot * 100) + '%"></span></span>' : '<span class="tag-plan">' + bi("準備中", "Sắp có") + "</span>") +
      "</div></a>";
  }
  function emptyBox(title, body) {
    return '<div class="empty"><p class="empty-t">' + bi(title[0], title[1]) + "</p>" + (body ? '<div class="muted">' + para(body) + "</div>" : "") + "</div>";
  }

  /* ================= HOME ================= */
  var homeTab = "hist";
  var HOME_TABS = [["often", "最近よく学習している科目", "Môn học nhiều gần đây"], ["nihongo", "日本語", "Tiếng Nhật"], ["sugaku", "数学", "Toán"], ["rika", "理科", "Hóa · Sinh"], ["shakai", "社会", "Xã hội"], ["tango", "単語", "Từ mới"], ["hist", "視聴履歴", "Lịch sử xem"]];

  function renderHome() {
    var S = stats();
    var h = Math.floor(S.sec / 3600), m = Math.floor((S.sec % 3600) / 60);
    var html =
      '<section class="band"><div class="in band-in">' +
        '<div class="me"><div class="avatar-lg" aria-hidden="true">' + esc(initialOf(user.name)) + '</div><div><p class="me-name">' + esc(user.name) +
          /* the honorific belongs to the Japanese view only (hidden in VI and EN) */
          '<span class="lj xe"> さん</span></p>' +
          (SITE.member ? '<p class="me-sub">' + bi(SITE.member.ja, SITE.member.vi, SITE.member.en) + "</p>" : "") + "</div></div>" +
        '<div class="me-stats"><p class="st-row"><span class="st" title="完了した章 · Chương đã hoàn thành">' + ICON.trophy + "<b>" + S.troph + '</b></span><span class="st" title="完了した授業 · Bài đã hoàn thành">' + ICON.check + "<b>" + S.done + "</b></span></p>" +
          '<p class="st-time">' + bi("総学習時間", "Tổng thời gian học") + "<b>" + h + "</b>" + unit("時間", "giờ") + "<b>" + m + "</b>" + unit("分", "phút") + "</p></div>" +
        '<div class="me-level"><p class="lv-num">Lv<b>' + S.lv + '</b></p><div class="lvbar"><span style="width:' + (S.into / 2) + '%"></span></div>' +
          '<p class="lv-next">' + bi("次のレベルまであと " + (200 - S.into), "Còn " + (200 - S.into) + " điểm để lên cấp", (200 - S.into) + " points to the next level") + "</p></div>" +
      "</div></section>" +
      '<div class="tabsbar"><div class="in tabs-in" role="tablist" aria-label="Lịch sử học">' +
        HOME_TABS.map(function (t) { return '<button type="button" role="tab" class="htab" data-k="' + t[0] + '" aria-selected="' + (t[0] === homeTab) + '">' + bs(t[1], t[2]) + "</button>"; }).join("") +
      '</div></div><div class="in"><div class="home-list" id="homeList"></div></div>';
    setHTML(app, html);
    app.querySelectorAll(".htab").forEach(function (b) {
      b.addEventListener("click", function () {
        homeTab = b.dataset.k;
        app.querySelectorAll(".htab").forEach(function (x) { x.setAttribute("aria-selected", x === b ? "true" : "false"); });
        renderHomeList();
      });
    });
    renderHomeList();
  }

  function renderHomeList() {
    var box = document.getElementById("homeList");
    var html = "";
    if (homeTab === "hist") {
      var u = uniqueViews();
      if (u.length) {
        html = u.map(function (h) { return vrow(h.id, bi(fmtDate(h.t) + "に視聴", "Xem ngày " + fmtDate(h.t), "Watched " + fmtDate(h.t))); }).join("");
      } else {
        html = emptyBox(["まだ視聴した授業はありません。", "Bạn chưa xem bài nào."], ["上のメニューから科目を選ぶか、下のおすすめの授業から始めましょう。", "Chọn một môn trên thanh menu, hoặc bắt đầu với các bài gợi ý dưới đây."]) +
          '<p class="sec-label">' + bi("おすすめの授業", "Bài gợi ý") + "</p>" + SITE.recommended.map(function (id) { return vrow(id); }).join("");
      }
    } else if (homeTab === "often") {
      var counts = {};
      st.hist.forEach(function (x) { if (V[x.id]) { var s = CMAP[V[x.id].c].s; counts[s] = (counts[s] || 0) + 1; } });
      var used = SUBJECTS.filter(function (s) { return counts[s.id]; }).sort(function (a, b) { return counts[b.id] - counts[a.id]; });
      if (!used.length) {
        html = emptyBox(["まだデータがありません。", "Chưa có dữ liệu."], ["授業を見ると、よく学習している科目がここに表示されます。", "Khi bạn xem bài, các môn học nhiều nhất sẽ hiện ở đây."]);
      } else {
        html = used.map(function (s) {
          var seen = {};
          st.hist.forEach(function (x) { if (V[x.id] && CMAP[V[x.id].c].s === s.id) seen[V[x.id].c] = 1; });
          return '<div class="sblock" data-subj="' + s.id + '"><p class="sb-head"><span class="sb-name">' + s.ja + subs("", "small", s.vi, s.en) + '</span><span class="sb-count">' + bi(counts[s.id] + " 回視聴","Đã xem " + counts[s.id] + " lần", "Watched " + counts[s.id] + " times") + "</span></p>" +
            COURSES.filter(function (c) { return seen[c.id]; }).map(crow).join("") + "</div>";
        }).join("");
      }
    } else {
      var s = SUBJ[homeTab];
      html = '<div class="sblock" data-subj="' + s.id + '"><p class="sb-head"><span class="sb-name">' + s.ja + subs("", "small", s.vi, s.en) + "</span></p>" +
        COURSES.filter(function (c) { return c.s === s.id; }).map(crow).join("") + "</div>";
    }
    setHTML(box, html);
  }

  /* ================= COURSE ================= */
  var cState = { id: null, chap: "all", filter: "all" };

  function renderCourse(id) {
    var c = CMAP[id];
    if (!c) { renderHome(); return; }
    if (cState.id !== id) cState = { id: id, chap: "all", filter: "all" };
    lastCourse = id;
    var tot = c.vids.length, d = doneIn(c), tro = trophies(c);
    var next = c.vids.filter(function (x) { return !st.done[x]; })[0];
    var len = 2 * Math.PI * 52, pct = tot ? d / tot : 0;
    var ring = '<div class="ring" aria-label="Đã hoàn thành ' + d + " trên " + tot + ' bài"><svg viewBox="0 0 120 120" aria-hidden="true">' +
      '<circle cx="60" cy="60" r="52" fill="none" stroke="var(--hover)" stroke-width="12"/>' +
      (pct > 0 ? '<circle cx="60" cy="60" r="52" fill="none" stroke="var(--subj)" stroke-width="12" stroke-linecap="round" stroke-dasharray="' + (len * pct).toFixed(1) + " " + len.toFixed(1) + '"/>' : "") +
      '</svg><div class="ring-txt"><b>' + d + "</b><span>/ " + tot + "</span></div></div>";
    var nextLabel = '<p class="sec-label">' + bi("次の授業", "Bài tiếp theo") + "</p>";
    var nextHTML = next
      ? nextLabel + '<a class="next-link" href="#v-' + next + '">' + thumb(V[next]) + '<span><span class="vtitle">' + V[next].t + "</span><br>" + subs("vvi", "span", V[next].vi, V[next].en) + "</span></a>"
      : tot ? nextLabel + para(["このコースの授業をすべて完了しました。", "Bạn đã hoàn thành tất cả bài trong khóa này."]) : nextLabel + '<div class="muted">' + para(["このコースは準備中です。", "Khóa học đang được soạn."]) + "</div>";

    var chapters = c.ch.map(function (ch, i) { return { ch: ch, i: i }; }).filter(function (x) { return cState.chap === "all" || String(x.i) === cState.chap; });
    var mainHTML = (tot ? "" : '<div class="notice">' + para(["このコースは準備中です。予定している章は次のとおりです。", "Khóa học này đang được soạn. Dưới đây là các chương dự kiến."]) + "</div>") +
      chapters.map(function (x) {
        var ch = x.ch, body;
        if (ch.secs) {
          /* topic chapter: one heading per section (1), (2)… with its lessons and planned cards */
          var parts = ch.secs.map(function (s) {
            var sv = s.v.filter(function (vid) { return cState.filter === "all" || !st.done[vid]; });
            var sp = cState.filter === "all" ? s.p : [];
            if (!sv.length && !sp.length) return "";
            return '<div class="tsec"><h3 class="tsec-t">' + bi(s.t[0], s.t[1], s.t[2]) + '</h3><div class="vgrid">' + sv.map(vcard).join("") + sp.map(function (p) { return pcard(p, c.s); }).join("") + "</div></div>";
          }).join("");
          body = parts || '<div class="muted">' + para(["この章の授業はすべて完了しました。", "Đã hoàn thành tất cả bài trong chương này."]) + "</div>";
        } else if (ch.v || ch.p) {
          var vids = (ch.v || []).filter(function (vid) { return cState.filter === "all" || !st.done[vid]; });
          var plans = cState.filter === "all" ? (ch.p || []) : [];
          body = vids.length || plans.length
            ? '<div class="vgrid">' + vids.map(vcard).join("") + plans.map(function (p) { return pcard(p, c.s); }).join("") + "</div>"
            : '<div class="muted">' + para(["この章の授業はすべて完了しました。", "Đã hoàn thành tất cả bài trong chương này."]) + "</div>";
        } else {
          body = '<div class="muted">' + para(["この章は準備中です。", "Chương này đang được soạn."]) + "</div>";
        }
        return '<section class="chsec"><h2>' + stack(ch.t[0], ch.t[1], ch.t[2]) + "</h2>" + body + "</section>";
      }).join("");

    var html = '<div class="in page" data-subj="' + c.s + '">' +
      '<p class="crumb"><a href="#home">' + jv("学習状況", "Học tập") + "</a> › " + jv(SUBJ[c.s].ja, SUBJ[c.s].vi, SUBJ[c.s].en) + " › " + jv(c.label, c.labelVi, c.labelEn) + "</p>" +
      '<section class="chead"><div><p class="chead-series">' + bi(c.series, c.seriesVi, c.seriesEn) + '</p><h1 class="chead-name">' + c.name + "</h1>" + subs("chead-vi", "p", c.vi, c.en) + '<p class="troph-line">' + ICON.trophy + "<b>" + tro + "</b> / " + c.ch.length + "</p></div>" +
        ring + '<div class="chead-next">' + nextHTML + "</div></section>" +
      '<div class="cbody"><aside class="caside">' +
        '<label class="sel"><span>' + bi("表示", "Hiển thị", "Show") + '</span><select id="cfilter"><option value="all"' + (cState.filter === "all" ? " selected" : "") + ' data-ja="すべての授業" data-vi="Tất cả bài" data-en="All lessons">' + langText("すべての授業", "Tất cả bài", "All lessons") + '</option><option value="todo"' + (cState.filter === "todo" ? " selected" : "") + ' data-ja="未完了の授業" data-vi="Bài chưa xong" data-en="Unfinished lessons">' + langText("未完了の授業", "Bài chưa xong", "Unfinished lessons") + "</option></select></label>" +
        '<nav class="chlist" aria-label="Các chương"><button type="button" class="chbtn" data-ch="all" aria-current="' + (cState.chap === "all") + '">' + bs("すべて表示", "Hiện tất cả") + "</button>" +
        c.ch.map(function (ch, i) {
          return '<button type="button" class="chbtn" data-ch="' + i + '" aria-current="' + (cState.chap === String(i)) + '">' + ICON.trophy.replace('class="ic"', 'class="ic' + (chapterDone(ch) ? " gold" : "") + '"') + bs(ch.t[0], ch.t[1], ch.t[2]) + "</button>";
        }).join("") +
        "</nav></aside>" +
      '<div class="cmain">' + mainHTML + "</div></div></div>";
    setHTML(app, html);
    app.querySelectorAll(".chbtn").forEach(function (b) {
      b.addEventListener("click", function () { cState.chap = b.dataset.ch; renderCourse(id); });
    });
    document.getElementById("cfilter").addEventListener("change", function (e) { cState.filter = e.target.value; renderCourse(id); });
  }

  /* ================= VIDEO ================= */
  var vState = { id: null, tab: "text", c: null };
  var lastCourse = null;
  /* the course a lesson page belongs to: the course the learner came from if the lesson is in it, else its first course */
  function homeOf(v) {
    var homes = v.homes || [{ c: v.c, chi: v.chi }];
    return homes.filter(function (h) { return h.c === lastCourse; })[0] || homes[0];
  }
  var VIDEO_KINDS = [["video", "授業", "Bài giảng", "Lecture"], ["videoKaisetsu", "解説", "Chữa bài tập", "Worked solutions"], ["videoTango", "単語", "Từ vựng", "Vocabulary"]];

  function renderVideo(id) {
    var v = V[id];
    if (!v) { renderHome(); return; }
    var home = homeOf(v), c = CMAP[home.c], chi = home.chi;
    var isVocab = v.kind === "vocab";
    if (vState.id !== id) {
      vState = { id: id, tab: isVocab ? "list" : "text" };
      st.hist.push({ id: id, t: Date.now() });
      if (st.hist.length > 300) st.hist = st.hist.slice(-300);
      save();
    }
    vState.c = c.id;
    var idx = c.vids.indexOf(id), prev = c.vids[idx - 1], next = c.vids[idx + 1];
    var chips = isVocab ? [["単語", "Từ vựng", "list", null], ["テスト", "Kiểm tra", "test", null]]
      : [["ポイント", "Điểm chính", "text", "p-point", v.point.length], ["例題", "Ví dụ", "text", "p-rei", v.rei], ["練習", "Luyện tập", "text", "p-prac", v.pr.length], ["まとめ", "Tóm tắt", "sum", null, v.sum.length || v.terms.length]]
        .filter(function (x) { return x[4]; });
    var yt = v.video ? ytEmbed(v.video) : null;
    /* lecture / worked solutions / vocabulary videos: the buttons show only when there is more than the lecture */
    var kinds = VIDEO_KINDS.filter(function (k) { return v[k[0]]; });
    var vsw = kinds.length && !(kinds.length === 1 && kinds[0][0] === "video")
      ? '<div class="vsw" role="group" aria-label="動画 · Video">' + kinds.map(function (k, i) {
          return '<button type="button" data-v="' + k[0] + '" aria-pressed="' + (i === 0) + '">' + ICON.playSm + bs(k[1], k[2], k[3]) + "</button>";
        }).join("") + "</div>" : "";
    var tabs = isVocab ? [["list", "単語リスト", "Danh sách từ"], ["test", "テスト", "Kiểm tra"], ["near", "前後の授業", "Các bài khác"]]
      : [["text", "テキスト", "Bài giảng"], ["ans", "解答", "Lời giải"], ["sum", "要点まとめ", "Tóm tắt"], ["near", "前後の授業", "Các bài khác"]];
    var marked = !!st.marks[id];
    var n = viewCount(id);

    var html = '<div class="in page" data-subj="' + c.s + '">' +
      '<p class="crumb"><a href="#home">' + jv("学習状況", "Học tập") + '</a> › <a href="#c-' + c.id + '">' + jv(c.label, c.labelVi, c.labelEn) + "</a> › " + jv(c.ch[chi].t[0], c.ch[chi].t[1], c.ch[chi].t[2]) + "</p>" +
      '<div class="watch"><div class="wleft">' +
        '<div class="player" id="player"><div class="board"><span class="b-tag">' + (isVocab ? "単語" : "要点") + " | " + v.t + '</span><div class="b-lines">' +
          v.board.map(function (l) { return '<span class="b-line">' + l + "</span>"; }).join("") + '</div><span class="b-mark">' + SUBJ[c.s].ja + "</span></div>" +
          '<button type="button" class="play-btn" id="playBtn" aria-label="再生 · Phát video">' + ICON.play + "</button>" +
          '<div class="pnote" id="pnote" hidden>' + para(["この授業の動画は準備中です。", "Video của bài này đang được chuẩn bị."]) + "</div>" +
          '<div class="pbar" aria-hidden="true">' + ICON.playSm + ICON.vol + "<span>0:00 / " + (v.dur || "--:--") + '</span><span class="ptrack"></span><span>1x</span>' + ICON.full + "</div>" +
        "</div>" + vsw +
        '<div class="winfo">' + clabel(c) + '<h1 class="wtitle">' + v.t + "</h1>" + subs("vvi", "p", v.vi, v.en) +
          '<div class="chips">' + chips.map(function (x, i) { return '<button type="button" data-tab="' + x[2] + '"' + (x[3] ? ' data-target="' + x[3] + '"' : "") + ' aria-pressed="' + (i === 0) + '">' + bs(x[0], x[1]) + "</button>"; }).join("") + "</div>" +
          '<div class="wmeta"><button type="button" class="bm" id="bmBtn" aria-pressed="' + marked + '">' + ICON.star + bi("ブックマーク", "Lưu bài", "Save") + "</button>" +
            '<span class="wstatus" id="wstatus"></span><span class="wcount">' + bi("視聴 " + n + " 回", "Đã xem " + n + " lần", "Viewed " + n + (n === 1 ? " time" : " times")) + "</span></div>" +
          '<div class="prevnext">' + (prev ? '<a href="#v-' + prev + '">← ' + bi("前の授業", "Bài trước") + "</a>" : "<span></span>") + (next ? '<a href="#v-' + next + '">' + bi("次の授業", "Bài sau") + " →</a>" : "") + "</div>" +
        "</div>" +
      "</div>" +
      '<section class="panel" aria-label="Tài liệu bài học"><div class="ptabs" role="tablist">' +
        tabs.map(function (t) { return '<button type="button" role="tab" data-tab="' + t[0] + '" aria-selected="' + (t[0] === vState.tab) + '">' + bs(t[1], t[2]) + "</button>"; }).join("") +
      '</div><div class="pbody" id="pbody"></div></section>' +
      "</div></div>";
    setHTML(app, html);
    updateStatus();

    function playIn(url) {
      document.getElementById("player").innerHTML = '<iframe src="' + esc(url) + '" title="' + esc(v.t.replace(/<[^>]*>/g, "")) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
    }
    /* the big play button starts the selected video (the lecture unless another button was chosen) */
    var current = kinds.length ? kinds[0][0] : null;
    document.getElementById("playBtn").addEventListener("click", function () {
      /* a lesson with no exercises counts as done once its video is played */
      if (yt && !isVocab && !v.pr.length && !st.done[id]) { st.done[id] = true; save(); updateStatus(); }
      if (!current) { var note = document.getElementById("pnote"); note.hidden = !note.hidden; return; }
      playIn(ytEmbed(v[current]));
    });
    app.querySelectorAll(".vsw button").forEach(function (b) {
      b.addEventListener("click", function () {
        current = b.dataset.v;
        app.querySelectorAll(".vsw button").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        if (current === "video" && yt && !isVocab && !v.pr.length && !st.done[id]) { st.done[id] = true; save(); updateStatus(); }
        playIn(ytEmbed(v[current]));
      });
    });
    document.getElementById("bmBtn").addEventListener("click", function (e) {
      st.marks[id] = !st.marks[id]; save();
      e.currentTarget.setAttribute("aria-pressed", st.marks[id] ? "true" : "false");
    });
    app.querySelectorAll(".ptabs button").forEach(function (b) {
      b.addEventListener("click", function () { setTab(b.dataset.tab); });
    });
    app.querySelectorAll(".chips button").forEach(function (b) {
      b.addEventListener("click", function () {
        app.querySelectorAll(".chips button").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        if (vState.tab !== b.dataset.tab) setTab(b.dataset.tab);
        var target = (b.dataset.target && document.getElementById(b.dataset.target)) || document.querySelector(".panel");
        if (target) target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      });
    });
    renderPanel();
  }

  function updateStatus() {
    var el = document.getElementById("wstatus");
    if (!el) return;
    var done = !!st.done[vState.id];
    el.innerHTML = done ? "✓ " + bi("完了", "Hoàn thành") : bi("未完了", "Chưa xong");
    el.className = "wstatus" + (done ? " ok" : "");
  }

  function setTab(tab) {
    vState.tab = tab;
    app.querySelectorAll(".ptabs button").forEach(function (x) { x.setAttribute("aria-selected", x.dataset.tab === tab ? "true" : "false"); });
    renderPanel();
  }

  function trHTML(tr, en) { return (tr ? '<p class="tr lv">' + tr + "</p>" : "") + (en ? '<p class="tr le">' + en + "</p>" : ""); }
  function qHTML(pid, q, i) {
    var no = "問" + (i + 1);
    var head = '<p class="q-stem"><span class="q-no">' + no + "</span>" + q.q + "</p>" + trHTML(q.tr, q.tren);
    var tail = '<p class="q-result" aria-live="polite"></p><div class="kaisetsu" hidden><p class="k-label">' + bi("解説", "Lời giải") + "</p>" + para(q.ex) + "</div>";
    if (q.k === "fill") {
      return '<div class="q" data-kind="fill">' + head + '<div class="cells-row">' +
        q.cells.map(function (cl) { return '<label class="cell"><span>' + cl[0] + '</span><input id="' + pid + "-" + i + "-" + cl[0] + '" type="text" inputmode="numeric" autocomplete="off" maxlength="1" data-answer="' + cl[1] + '" aria-label="Ô ' + cl[0] + '"></label>'; }).join("") +
        "</div>" + tail + "</div>";
    }
    return '<div class="q" data-kind="mc" data-answer="' + q.a + '">' + head + '<div class="opts" role="radiogroup" aria-label="' + no + '">' +
      q.o.map(function (o, j) { return '<label class="opt"><input type="radio" name="' + pid + "-" + i + '" id="' + pid + "-" + i + "-" + (j + 1) + '" value="' + (j + 1) + '"><span class="oval">' + (j + 1) + '</span><span class="opt-text">' + o + "</span></label>"; }).join("") +
      "</div>" + tail + "</div>";
  }
  function doneNote() { return bi("この授業は完了しています。", "Bài này đã hoàn thành."); }
  function quizHTML(pid, qs) {
    return qs.map(function (q, i) { return qHTML(pid, q, i); }).join("") +
      '<div class="score-bar"><button type="button" class="btn btn-primary" data-grade>' + bi("答え合わせ", "Chấm điểm") + '</button><button type="button" class="btn btn-ghost" data-reset>' + bi("やり直す", "Làm lại") + '</button><p class="score-out" aria-live="polite">' +
      (st.done[vState.id] ? doneNote() : bi("未採点", "Chưa chấm")) + "</p></div>";
  }
  function vocabTable(words) {
    return '<div class="table-scroll"><table class="vocab"><thead><tr><th>' + bi("用語", "Thuật ngữ") + "</th><th>" + bi("意味", "Nghĩa") + "</th></tr></thead><tbody>" +
      words.map(function (w) { return "<tr><td>" + ruby(w) + '</td><td class="mean"><span>' + meaning(w) + "</span></td></tr>"; }).join("") + "</tbody></table></div>";
  }
  /* a word's meaning: Vietnamese, or English in EN mode when the word has one (4th column) */
  function meaning(w) { return w[3] ? '<span class="nle">' + w[2] + '</span><span class="le">' + w[3] + "</span>" : w[2]; }
  function vocabQs(words) {
    var n = words.length, k = Math.min(5, n), qs = [];
    for (var i = 0; i < k; i++) {
      var idx = Math.floor(i * n / k), w = words[idx], opts = [w];
      for (var d = 1; opts.length < 4 && d < n * 2; d++) {
        var cand = words[(idx + d * 2) % n];
        if (!opts.some(function (x) { return x[2] === cand[2]; })) opts.push(cand);
      }
      var rot = i % opts.length, o = opts.slice(rot).concat(opts.slice(0, rot));
      qs.push({ k: "mc", q: "「" + ruby(w) + "」の意味はどれか。", tr: "Từ này nghĩa là gì?", tren: "What does this word mean?", o: o.map(meaning), a: o.indexOf(w) + 1, ex: ruby(w) + ": " + meaning(w) + "." });
    }
    return qs;
  }
  function emptyPanel(msg) { return '<section class="psec"><div class="muted">' + para(msg) + "</div></section>"; }
  function ptitle(ja, vi, en) { return '<h2 class="ptitle">' + (vi ? bs(ja, vi, en) : ja) + "</h2>"; }

  function renderPanel() {
    var v = V[vState.id], c = CMAP[vState.c || v.c], tab = vState.tab, html = "";
    var pid = "q-" + v.id;
    if (tab === "text") {
      var hasFill = v.pr.some(function (q) { return q.k === "fill"; });
      var hint = hasFill ? ["各ボックスに数字（または −）を1つずつ入れて、「答え合わせ」を押そう。", "Điền mỗi ô một chữ số (hoặc dấu −), rồi bấm Chấm điểm."]
        : ["各問で1つ選んで、「答え合わせ」を押そう。", "Chọn một đáp án cho mỗi câu, rồi bấm Chấm điểm."];
      html = (v.point.length ? '<section class="psec" id="p-point">' + ptitle("Point") + blocks(v.point) + "</section>" : "") +
        (v.rei ? '<section class="psec" id="p-rei">' + ptitle("例題", "Ví dụ") + '<div class="prob"><p class="q-stem">' + v.rei.q + "</p>" + trHTML(v.rei.tr, v.rei.tren) + '</div><div class="muted small">' + para(["解答は「解答」タブで確認しよう。", "Lời giải xem ở tab Lời giải (解答)."]) + "</div></section>" : "") +
        (v.pr.length ? '<section class="psec quiz" id="p-prac">' + ptitle("練習", "Luyện tập") + '<div class="muted small">' + para(hint) + "</div>" + quizHTML(pid, v.pr) + "</section>" : "");
      if (!html) html = emptyPanel(["この授業のテキストは準備中です。", "Phần bài giảng dạng chữ của bài này đang được soạn."]);
    } else if (tab === "ans") {
      html = (v.rei ? '<section class="psec">' + ptitle("例題の解答", "Lời giải ví dụ") + '<div class="prob"><p class="q-stem">' + v.rei.q + "</p>" + trHTML(v.rei.tr, v.rei.tren) + "</div>" + para(v.rei.a) + "</section>" : "") +
        (v.pr.length ? '<section class="psec">' + ptitle("練習の解答", "Lời giải luyện tập") + v.pr.map(function (q, i) {
          var key = q.k === "fill" ? q.cells.map(function (cl) { return cl[0] + " = " + cl[1]; }).join(", ") : CIRCLED[q.a] + " " + q.o[q.a - 1];
          return '<div class="ansitem"><p class="q-stem"><span class="q-no">問' + (i + 1) + "</span>" + q.q + '</p><p class="ans-key">' + bi("答え", "Đáp án") + ": " + key + "</p>" + para(q.ex) + "</div>";
        }).join("") + "</section>" : "");
      if (!html) html = emptyPanel(["この授業には問題がありません。", "Bài này không có bài tập."]);
    } else if (tab === "sum") {
      html = (v.sum.length ? '<section class="psec">' + ptitle("要点まとめ", "Tóm tắt") + "<ul>" + v.sum.map(li).join("") + "</ul></section>" : "") +
        (v.terms.length ? '<section class="psec">' + ptitle("用語", "Thuật ngữ") + vocabTable(v.terms) + "</section>" : "");
      if (!html) html = emptyPanel(["まとめは準備中です。", "Phần tóm tắt đang được soạn."]);
    } else if (tab === "list") {
      html = '<section class="psec">' + ptitle("単語リスト", "Danh sách từ") + '<div class="vocab-bar">' + para(["「意味をかくす」で自分をテスト。灰色の部分をタップすると表示されます。", "Bấm Ẩn nghĩa để tự kiểm tra, chạm vào ô xám để xem lại."]) +
        '<button type="button" class="btn btn-ghost btn-small" id="hideVi" aria-pressed="false">' + bi("意味をかくす", "Ẩn nghĩa") + "</button></div>" + vocabTable(v.words) + "</section>";
    } else if (tab === "test") {
      html = '<section class="psec quiz" id="p-test">' + ptitle("テスト", "Kiểm tra") + '<div class="muted small">' + para(["正しい意味を選ぼう。全問正解でこの単語セットは完了です。", "Chọn nghĩa đúng của mỗi từ. Đúng hết là hoàn thành bộ từ này."]) + "</div>" + quizHTML(pid, vocabQs(v.words)) + "</section>";
    } else {
      html = '<section class="psec">' + ptitle(c.label, c.labelVi, c.labelEn) + c.ch.filter(function (ch) { return ch.v; }).map(function (ch) {
        return '<p class="near-ch">' + bi(ch.t[0], ch.t[1], ch.t[2]) + '</p><ol class="near">' + ch.v.map(function (x) {
          return '<li><a href="#v-' + x + '"' + (x === v.id ? ' aria-current="true"' : "") + '><span class="near-t"><span>' + V[x].t + "</span>" + subs("", "span", V[x].vi, V[x].en) + '</span><span class="near-d">' + V[x].dur + "</span>" + (st.done[x] ? '<span class="near-ok">' + bi("完了", "Xong", "Done") + "</span>" : "") + "</a></li>";
        }).join("") + "</ol>";
      }).join("") + "</section>";
    }
    var body = document.getElementById("pbody");
    setHTML(body, html);
    var quiz = body.querySelector(".quiz");
    if (quiz) bindQuiz(quiz);
    var hv = document.getElementById("hideVi");
    if (hv) {
      var table = body.querySelector(".vocab");
      hv.addEventListener("click", function () {
        var on = !table.classList.contains("hide-vi");
        table.classList.toggle("hide-vi", on);
        table.querySelectorAll("tr.peek").forEach(function (tr) { tr.classList.remove("peek"); });
        hv.setAttribute("aria-pressed", on ? "true" : "false");
        hv.innerHTML = on ? bi("意味を表示", "Hiện nghĩa") : bi("意味をかくす", "Ẩn nghĩa");
      });
      table.addEventListener("click", function (e) {
        var cell = e.target.closest("td.mean");
        if (cell && table.classList.contains("hide-vi")) cell.parentElement.classList.toggle("peek");
      });
    }
  }

  function bindQuiz(quiz) {
    var cells = Array.prototype.slice.call(quiz.querySelectorAll(".cell input"));
    cells.forEach(function (input, i) {
      input.addEventListener("input", function () {
        var val = input.value.replace(/[０-９]/g, function (ch) { return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0); })
          .replace(/[ー－‐—–]/g, "-").replace(/[^0-9-]/g, "");
        input.value = val.slice(-1);
        input.classList.remove("is-ok", "is-bad");
        if (input.value && cells[i + 1]) cells[i + 1].focus();
      });
      input.addEventListener("keydown", function (e) {
        if (e.key === "Backspace" && !input.value && cells[i - 1]) cells[i - 1].focus();
      });
    });
    function clearMarks() {
      quiz.querySelectorAll(".q").forEach(function (q) {
        q.classList.remove("is-ok", "is-bad", "is-blank");
        q.querySelector(".q-result").innerHTML = "";
        q.querySelector(".kaisetsu").hidden = true;
        q.querySelectorAll(".opt").forEach(function (o) { o.classList.remove("is-key", "is-wrong"); });
        q.querySelectorAll(".cell input").forEach(function (x) { x.classList.remove("is-ok", "is-bad"); });
      });
    }
    quiz.querySelector("[data-grade]").addEventListener("click", function () {
      clearMarks();
      var qs = quiz.querySelectorAll(".q"), score = 0;
      qs.forEach(function (q) {
        var correct = false, blank = false;
        if (q.dataset.kind === "fill") {
          correct = true;
          q.querySelectorAll(".cell input").forEach(function (x) {
            var ok = x.value === x.dataset.answer;
            if (!x.value) blank = true;
            if (!ok) correct = false;
            x.classList.add(ok ? "is-ok" : "is-bad");
          });
        } else {
          var picked = q.querySelector("input:checked");
          var key = q.querySelector('input[value="' + q.dataset.answer + '"]');
          blank = !picked;
          correct = !!picked && picked.value === q.dataset.answer;
          if (key) key.closest(".opt").classList.add("is-key");
          if (picked && !correct) picked.closest(".opt").classList.add("is-wrong");
        }
        if (correct) score++;
        q.classList.add(correct ? "is-ok" : (blank ? "is-blank" : "is-bad"));
        var circ = CIRCLED[+q.dataset.answer];
        var ans = q.dataset.kind === "mc" && !correct ? " · " + bi("正解は" + circ, "Đáp án " + circ, "Answer: " + circ) : "";
        q.querySelector(".q-result").innerHTML = (correct ? bi("正解", "Đúng") : (blank ? bi("未解答", "Bỏ trống") : bi("不正解", "Chưa đúng"))) + ans;
        q.querySelector(".kaisetsu").hidden = false;
      });
      if (mjReady) fitMath(quiz); /* explanations were hidden until now */
      var total = qs.length, perfect = score === total;
      if (perfect && !st.done[vState.id]) { st.done[vState.id] = true; save(); updateStatus(); }
      quiz.querySelector(".score-out").innerHTML = bi("得点", "Điểm") + " <strong>" + score + " / " + total + "</strong>" + (perfect ? " · " + bi("この授業を完了しました！", "Hoàn thành bài này!") : "");
    });
    quiz.querySelector("[data-reset]").addEventListener("click", function () {
      clearMarks();
      quiz.querySelectorAll(".cell input").forEach(function (x) { x.value = ""; });
      quiz.querySelectorAll('input[type="radio"]').forEach(function (r) { r.checked = false; });
      quiz.querySelector(".score-out").innerHTML = st.done[vState.id] ? doneNote() : bi("未採点", "Chưa chấm");
    });
  }

  /* ================= OTHER VIEWS ================= */
  function pageTitle(ja, vi, en) { return '<h1 class="page-t">' + bs(ja, vi, en) + "</h1>"; }
  function renderBookmarks() {
    var ids = Object.keys(st.marks).filter(function (id) { return st.marks[id] && V[id]; });
    setHTML(app, '<div class="in page">' + pageTitle("ブックマーク", "Bài đã lưu", "Saved lessons") + '<div class="home-list" style="padding-block:0">' +
      (ids.length ? ids.map(function (id) { return vrow(id); }).join("")
        : emptyBox(["ブックマークした授業はありません。", "Chưa có bài nào được lưu."], ["動画のページで「☆ ブックマーク」を押すと、ここに保存されます。", "Trong trang video, bấm ☆ Lưu bài để giữ lại bài muốn xem lại."])) +
      "</div></div>");
  }
  function renderRanking() {
    var counts = {};
    st.hist.forEach(function (h) { if (V[h.id]) counts[h.id] = (counts[h.id] || 0) + 1; });
    var top = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; }).slice(0, 10);
    setHTML(app, '<div class="in page">' + pageTitle("ランキング", "Xếp hạng") + '<div class="home-list" style="padding-block:0">' +
      (window.EJUAuth.mode === "demo" ? '<div class="notice">' + para(["お試しモードです。このブラウザで作ったアカウントだけがランキングに表示されます。", "Đang ở chế độ thử: bảng chỉ gồm các tài khoản tạo trên trình duyệt này.", "Demo mode: only accounts created in this browser are ranked."]) + "</div>" : "") +
      '<p class="sec-label">' + bi("完了した授業の数", "Số bài đã hoàn thành", "Lessons completed") + "</p>" +
      '<div id="rankBox"><p class="muted small">' + bi("読み込み中…", "Đang tải…", "Loading…") + "</p></div>" +
      '<p class="sec-label">' + bi("あなたがよく見た授業", "Bài bạn xem nhiều nhất", "Lessons you watch most") + "</p>" +
      (top.length ? '<ol class="rank">' + top.map(function (id, i) { return '<li><span class="rank-no">' + (i + 1) + "</span>" + vrow(id, bi(counts[id] + " 回視聴", "Đã xem " + counts[id] + " lần", "Watched " + counts[id] + (counts[id] === 1 ? " time" : " times"))) + "</li>"; }).join("") + "</ol>"
        : emptyBox(["まだデータがありません。", "Chưa có dữ liệu."], ["授業をいくつか見ると、ここが自動で更新されます。", "Xem vài bài học, bảng này sẽ tự cập nhật."])) +
      "</div></div>");
    var box = document.getElementById("rankBox");
    /* publish this account's latest count first so the list includes it */
    clearTimeout(pushTimer);
    window.EJUAuth.saveProgress(user, st, doneCount()).catch(function () {}).then(function () { return window.EJUAuth.ranking(); }).then(function (rows) {
      if (!document.body.contains(box)) return;
      box.innerHTML = rows.length ? '<ol class="rank">' + rows.map(function (r, i) {
        var me = user && r.uid === user.uid;
        return '<li><span class="rank-no">' + (i + 1) + '</span><div class="rrow' + (me ? " is-me" : "") + '"><span class="rr-av" aria-hidden="true">' + esc(initialOf(r.name)) + '</span><span class="rr-name">' + esc(r.name) +
          (me ? ' <span class="rr-you">' + bi("あなた", "Bạn", "You") + "</span>" : "") + '</span><span class="rr-done">' + r.done + " " + unit("本", "bài") + "</span></div></li>";
      }).join("") + "</ol>" : emptyBox(["まだデータがありません。", "Chưa có dữ liệu."]);
    }).catch(function () {
      if (document.body.contains(box)) box.innerHTML = '<div class="muted">' + para(["ランキングを読み込めませんでした。", "Không tải được bảng xếp hạng.", "Couldn't load the ranking."]) + "</div>";
    });
  }
  function renderSearch(q) {
    var ql = q.toLowerCase();
    var hits = Object.keys(V).filter(function (id) {
      var v = V[id], c = CMAP[v.c];
      return (v.t + " " + v.vi + " " + (v.en || "") + " " + c.label + " " + c.labelVi + " " + c.labelEn + " " + v.board.join(" ") + " " + (v.words ? v.words.map(function (w) { return w.join(" "); }).join(" ") : "") + " " + (v.terms ? v.terms.map(function (w) { return w.join(" "); }).join(" ") : "")).toLowerCase().indexOf(ql) > -1;
    });
    setHTML(app, '<div class="in page">' + pageTitle("「" + esc(q) + "」の検索結果", "Kết quả cho “" + esc(q) + "”", "Results for “" + esc(q) + "”") + '<div class="home-list" style="padding-block:0">' +
      '<p class="muted small">' + bi(hits.length + " 件", hits.length + " bài", hits.length + (hits.length === 1 ? " lesson" : " lessons")) + "</p>" +
      (hits.length ? hits.map(function (id) { return vrow(id); }).join("")
        : emptyBox(["見つかりませんでした。", "Không tìm thấy bài nào."], ["別のキーワードで試してみよう（例：平方完成、mol、細胞）。", "Thử từ khóa khác, ví dụ: 平方完成, mol, tế bào."])) +
      "</div></div>");
  }

  /* ================= MENU ================= */
  var head = document.querySelector(".site-head");
  var menu = document.getElementById("menu");
  var gnav = document.getElementById("gnav");
  var menuFor = null, hideTimer = null;
  var canHover = window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches;

  function openMenu(btn) {
    clearTimeout(hideTimer);
    var s = btn.dataset.subj;
    if (menuFor === s && !menu.hidden) return;
    menuFor = s;
    menu.setAttribute("data-subj", s);
    menu.innerHTML = '<p class="menu-head">' + SUBJ[s].ja + subs("", "span", SUBJ[s].vi, SUBJ[s].en) + "</p>" +
      COURSES.filter(function (c) { return c.s === s; }).map(function (c) {
        return '<a class="menu-item" href="#c-' + c.id + '">' + bs(c.label, c.labelVi, c.labelEn) + (c.vids.length ? "" : '<span class="tag-plan">' + bi("準備中", "Sắp có") + "</span>") + "</a>";
      }).join("");
    menu.hidden = false;
    gnav.querySelectorAll("button[data-subj]").forEach(function (b) { b.setAttribute("aria-expanded", b === btn ? "true" : "false"); });
    placeMenu(btn);
  }
  function placeMenu(btn) {
    var hr = head.getBoundingClientRect(), br = btn.getBoundingClientRect();
    menu.style.top = (br.bottom - hr.top + 2) + "px";
    if (window.innerWidth < 640) {
      menu.style.left = "12px"; menu.style.right = "12px"; menu.style.width = "auto";
    } else {
      var w = 360, left = Math.min(br.left - hr.left, hr.width - w - 12);
      menu.style.left = Math.max(12, left) + "px"; menu.style.right = "auto"; menu.style.width = w + "px";
    }
  }
  function closeMenu() {
    menu.hidden = true; menuFor = null;
    gnav.querySelectorAll("button[data-subj]").forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
  }
  gnav.querySelectorAll("button[data-subj]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (menuFor === btn.dataset.subj && !menu.hidden) closeMenu(); else openMenu(btn);
    });
    if (canHover) btn.addEventListener("mouseenter", function () { openMenu(btn); });
  });
  gnav.addEventListener("scroll", function () {
    var open = gnav.querySelector('button[aria-expanded="true"]');
    if (open && !menu.hidden) placeMenu(open);
  }, { passive: true });
  if (canHover) {
    head.addEventListener("mouseleave", function () { hideTimer = setTimeout(closeMenu, 180); });
    head.addEventListener("mouseenter", function () { clearTimeout(hideTimer); });
  }
  document.addEventListener("click", function (e) {
    if (!menu.hidden && !menu.contains(e.target) && !e.target.closest("#gnav button[data-subj]")) closeMenu();
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(); });
  window.addEventListener("resize", closeMenu);

  /* ================= ACCOUNT MENU ================= */
  var acct = document.getElementById("acctMenu");
  var avatarBtn = document.getElementById("avatar");
  function initialOf(name) { var a = Array.from(String(name || "").trim()); return a.length ? a[0].toUpperCase() : "?"; }
  function openAcct() {
    acct.innerHTML = '<p class="menu-head acct-head">' + esc(user.name) + "<span>" + esc(user.email) + "</span></p>" +
      '<a class="menu-item" href="#home" data-hist>' + bs("学習状況", "Học tập") + "</a>" +
      '<a class="menu-item" href="#terms">' + bs("利用規約", "Điều khoản", "Terms") + "</a>" +
      '<button type="button" class="menu-item" id="logoutBtn">' + bs("ログアウト", "Đăng xuất", "Sign out") + "</button>";
    acct.hidden = false;
    avatarBtn.setAttribute("aria-expanded", "true");
    var hr = head.getBoundingClientRect(), br = avatarBtn.getBoundingClientRect();
    acct.style.top = (br.bottom - hr.top + 6) + "px";
    acct.style.right = Math.max(12, hr.right - br.right) + "px";
  }
  function closeAcct() { acct.hidden = true; avatarBtn.setAttribute("aria-expanded", "false"); }
  avatarBtn.addEventListener("click", function () { if (acct.hidden) { closeMenu(); openAcct(); } else closeAcct(); });
  acct.addEventListener("click", function (e) {
    if (e.target.closest("#logoutBtn")) {
      closeAcct();
      pushProgress();
      window.EJUAuth.signOut().then(function () { history.replaceState(null, "", location.pathname); route(); });
    } else if (e.target.closest("[data-hist]")) {
      homeTab = "hist"; closeAcct();
      if (location.hash === "#home") route();
    } else if (e.target.closest("a")) closeAcct();
  });
  document.addEventListener("click", function (e) {
    if (!acct.hidden && !acct.contains(e.target) && !avatarBtn.contains(e.target)) closeAcct();
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAcct(); });
  window.addEventListener("resize", closeAcct);

  /* ================= SIGN-IN SCREENS ================= */
  var gate = document.getElementById("gate");
  var gateNotice = null;
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var BAD_LOGIN = ["メールアドレスまたはパスワードが正しくありません。", "Email hoặc mật khẩu không đúng.", "Incorrect email or password."];
  var AUTH_MSG = {
    "auth/invalid-credential": BAD_LOGIN, "auth/invalid-login-credentials": BAD_LOGIN, "auth/wrong-password": BAD_LOGIN, "auth/user-not-found": BAD_LOGIN,
    "auth/email-already-in-use": ["このメールアドレスはすでに登録されています。", "Email này đã được đăng ký. Hãy đăng nhập.", "This email is already registered. Please log in."],
    "auth/weak-password": ["パスワードは6文字以上にしてください。", "Mật khẩu cần ít nhất 6 ký tự.", "Your password needs at least 6 characters."],
    "auth/invalid-email": ["メールアドレスの形式が正しくありません。", "Email không đúng định dạng.", "That email address isn't valid."],
    "auth/too-many-requests": ["試行回数が多すぎます。しばらくしてからもう一度お試しください。", "Thử quá nhiều lần. Hãy đợi một lúc rồi thử lại.", "Too many attempts. Wait a moment and try again."],
    "auth/network-request-failed": ["ネットワークに接続できません。", "Không kết nối được mạng.", "Can't connect to the network."],
    "auth/sdk-load-failed": ["ログイン機能を読み込めませんでした。ネットワークを確認してください。", "Không tải được chức năng đăng nhập. Hãy kiểm tra kết nối mạng.", "Couldn't load sign-in. Check your connection."],
    "auth/operation-not-allowed": ["メール/パスワードでのログインが有効になっていません。", "Firebase chưa bật đăng nhập bằng Email/Password (xem HUONG-DAN.md).", "Email/password sign-in isn't turned on in Firebase."],
    "auth/api-key-not-valid.-please-pass-a-valid-api-key.": ["Firebase の設定（apiKey）が正しくありません。", "Mã cấu hình Firebase (apiKey) không đúng. Kiểm tra lại file firebase-config.js.", "The Firebase setting (apiKey) is wrong. Check firebase-config.js."],
    "auth/configuration-not-found": ["Firebase でメール/パスワードのログインが有効になっていません。", "Firebase chưa bật đăng nhập bằng Email/Password (xem HUONG-DAN.md).", "Email/password sign-in isn't turned on in Firebase."],
    "auth/unauthorized-domain": ["このドメインは Firebase に登録されていません。", "Tên miền của website chưa được thêm vào Firebase (Authorized domains, xem HUONG-DAN.md).", "This website's domain isn't authorized in Firebase."],
    "demo/no-email": ["お試しモードでは再設定メールを送れません。", "Chế độ thử không gửi được email đặt lại mật khẩu.", "Demo mode can't send password reset emails."],
    "form/required": ["すべての項目を入力してください。", "Hãy nhập đủ các ô.", "Please fill in every field."],
    "form/name": ["名前は1〜20文字で入力してください。", "Tên hiển thị cần từ 1 đến 20 ký tự.", "Your name needs 1 to 20 characters."],
    "form/mismatch": ["パスワードが一致しません。", "Hai mật khẩu không giống nhau.", "The passwords don't match."],
    "form/agree": ["利用規約への同意が必要です。", "Bạn cần đồng ý với điều khoản sử dụng.", "Please agree to the terms of use."],
    _: ["エラーが発生しました。もう一度お試しください。", "Đã có lỗi. Hãy thử lại.", "Something went wrong. Try again."]
  };
  function authMsg(code) {
    var m = AUTH_MSG[code] || AUTH_MSG._;
    return bi(m[0], m[1], m[2]) + (AUTH_MSG[code] ? "" : ' <span class="small">(' + esc(code || "?") + ")</span>");
  }
  function field(id, type, label, ph, auto) {
    return '<label class="gate-field" for="' + id + '"><span class="gate-label">' + bi(label[0], label[1], label[2]) + "</span>" +
      '<input id="' + id + '" name="' + id + '" type="' + type + '" autocomplete="' + auto + '"' +
      (ph ? ' data-ja="' + esc(ph[0]) + '" data-vi="' + esc(ph[1]) + '" data-en="' + esc(ph[2]) + '" placeholder="' + esc(langText(ph[0], ph[1], ph[2])) + '"' : "") + "></label>";
  }
  var F_EMAIL = ["メールアドレス", "Email", "Email"], F_PW = ["パスワード", "Mật khẩu", "Password"];
  function gateHTML(view) {
    var back = '<a class="gate-back" href="#welcome">← ' + bi("戻る", "Quay lại", "Back") + "</a>";
    var err = '<p class="gate-err" role="alert"></p>';
    if (view === "login") return '<h1 class="gate-t">' + bs("ログイン", "Đăng nhập", "Log in") + "</h1>" +
      '<form class="gate-form" id="loginForm" novalidate>' + field("liEmail", "email", F_EMAIL, null, "email") + field("liPw", "password", F_PW, null, "current-password") + err +
      '<button type="submit" class="gate-btn">' + bi("ログイン", "Đăng nhập", "Log in") + "</button></form>" +
      '<p class="gate-alt"><a href="#reset">' + bi("パスワードを忘れた方", "Quên mật khẩu?", "Forgot your password?") + '</a></p><p class="gate-alt"><a href="#register">' + bi("アカウントをお持ちでない方は新規登録", "Chưa có tài khoản? Đăng ký", "No account yet? Sign up") + "</a></p>" + back;
    if (view === "register") return '<h1 class="gate-t">' + bs("新規登録", "Đăng ký", "Sign up") + "</h1>" +
      '<form class="gate-form" id="regForm" novalidate>' +
      field("rgName", "text", ["名前（表示名）", "Tên hiển thị", "Display name"], ["例：ミン", "Ví dụ: Minh", "e.g. Minh"], "nickname") +
      field("rgEmail", "email", F_EMAIL, null, "email") +
      field("rgPw", "password", F_PW, ["6文字以上", "Ít nhất 6 ký tự", "At least 6 characters"], "new-password") +
      field("rgPw2", "password", ["パスワード（確認）", "Nhập lại mật khẩu", "Confirm password"], null, "new-password") +
      '<label class="gate-check"><input type="checkbox" id="rgAgree"><span><a href="#terms" target="_blank" rel="noopener">' + bi("利用規約及びプライバシーポリシー", "Điều khoản sử dụng và chính sách riêng tư", "Terms of use and privacy policy") + "</a>" + bi("に同意する", "— tôi đồng ý", "— I agree") + "</span></label>" +
      err + '<button type="submit" class="gate-btn">' + bi("登録する", "Đăng ký", "Create account") + "</button></form>" +
      '<p class="gate-alt"><a href="#login">' + bi("アカウントをお持ちの方はログイン", "Đã có tài khoản? Đăng nhập", "Already have an account? Log in") + "</a></p>" + back;
    if (view === "reset") return '<h1 class="gate-t">' + bs("パスワードの再設定", "Đặt lại mật khẩu", "Reset password") + "</h1>" +
      '<div class="muted small">' + para(["登録したメールアドレスに、パスワード再設定用のリンクを送ります。", "Chúng tôi sẽ gửi link đặt lại mật khẩu tới email bạn đã đăng ký.", "We'll email you a link to reset your password."]) + "</div>" +
      '<form class="gate-form" id="resetForm" novalidate>' + field("rsEmail", "email", F_EMAIL, null, "email") + err +
      '<p class="gate-ok" role="status" hidden></p><button type="submit" class="gate-btn">' + bi("送信する", "Gửi email", "Send link") + "</button></form>" +
      '<p class="gate-alt"><a href="#login">' + bi("ログイン画面に戻る", "Quay lại đăng nhập", "Back to log in") + "</a></p>";
    if (view === "terms") return '<h1 class="gate-t">' + bs("利用規約及びプライバシーポリシー", "Điều khoản sử dụng và chính sách riêng tư", "Terms of use and privacy policy") + "</h1>" +
      '<div class="panel"><div class="pbody" id="termsBody"><p class="muted small">' + bi("読み込み中…", "Đang tải…", "Loading…") + "</p></div></div>" + back;
    return (gateNotice ? '<p class="gate-err">' + authMsg(gateNotice) + "</p>" : "") +
      '<div class="gate-actions"><a class="gate-btn" href="#login">' + bi("ログイン", "Đăng nhập", "Log in") + '</a><a class="gate-btn" href="#register">' + bi("新規登録", "Đăng ký", "Sign up") + "</a></div>" +
      '<p class="gate-alt"><a href="#terms">' + bi("利用規約及びプライバシーポリシー", "Điều khoản sử dụng và chính sách riêng tư", "Terms of use and privacy policy") + "</a></p>";
  }
  function renderGate(h) {
    var view = { login: 1, register: 1, reset: 1, terms: 1 }[h] ? h : "welcome";
    gate.innerHTML = '<div class="gate-top">' + langSwitch() + '</div><div class="gate-box' + (view === "terms" ? " is-wide" : "") + '">' +
      '<a class="gate-logo" href="#welcome" aria-label="Newmichi EJU"><span class="cells" aria-hidden="true"><b>E</b><b>J</b><b>U</b></span><span class="gate-name"><b>Newmichi EJU</b><small>With haiyen.1995</small></span></a>' +
      (window.EJUAuth.mode === "demo" ? '<div class="notice gate-demo">' + para(["お試しモード：Firebase が未設定のため、アカウントはこのブラウザにだけ保存されます。", "Chế độ thử: chưa kết nối Firebase, tài khoản chỉ lưu trên trình duyệt này.", "Demo mode: Firebase isn't set up yet, so accounts are saved in this browser only."]) + "</div>" : "") +
      gateHTML(view) + "</div>";
    bindGate(view);
    if (view === "terms") showTerms(document.getElementById("termsBody"));
    var first = gate.querySelector("input");
    if (first && view !== "welcome") first.focus();
    window.scrollTo(0, 0);
  }
  function bindGate(view) {
    var form = gate.querySelector("form");
    if (!form) return;
    var errBox = form.querySelector(".gate-err"), btn = form.querySelector("[type=submit]");
    function val(id) { var el = document.getElementById(id); return el ? el.value : ""; }
    function fail(code) { errBox.innerHTML = authMsg(code); btn.disabled = false; }
    form.addEventListener("input", function () { errBox.innerHTML = ""; });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      errBox.innerHTML = "";
      var call;
      if (view === "login") {
        var em = val("liEmail").trim().toLowerCase(), pw = val("liPw");
        if (!em || !pw) return fail("form/required");
        if (!EMAIL_RE.test(em)) return fail("auth/invalid-email");
        call = window.EJUAuth.signIn(em, pw);
      } else if (view === "register") {
        var name = val("rgName").trim().replace(/\s+/g, " "), em2 = val("rgEmail").trim().toLowerCase(), p1 = val("rgPw"), p2 = val("rgPw2");
        if (!name || !em2 || !p1 || !p2) return fail("form/required");
        if (Array.from(name).length > 20) return fail("form/name");
        if (!EMAIL_RE.test(em2)) return fail("auth/invalid-email");
        if (p1.length < 6) return fail("auth/weak-password");
        if (p1 !== p2) return fail("form/mismatch");
        if (!document.getElementById("rgAgree").checked) return fail("form/agree");
        call = window.EJUAuth.signUp(name, em2, p1);
      } else {
        var em3 = val("rsEmail").trim().toLowerCase(), ok = form.querySelector(".gate-ok");
        if (!em3) return fail("form/required");
        if (!EMAIL_RE.test(em3)) return fail("auth/invalid-email");
        call = window.EJUAuth.resetPassword(em3, lang === "both" ? "ja" : lang).then(function () {
          ok.innerHTML = bi("登録済みのアドレスであれば、再設定用のメールが届きます。迷惑メールフォルダも確認してください。", "Nếu email đã đăng ký, bạn sẽ nhận được thư đặt lại mật khẩu. Nhớ xem cả hộp thư rác.", "If that email is registered, a reset link is on its way. Check your spam folder too.");
          ok.hidden = false; btn.disabled = false;
        });
      }
      btn.disabled = true;
      call.catch(function (x) { fail(x && x.code); });
    });
  }

  /* ================= TERMS ================= */
  var termsCache = null;
  function showTerms(box) {
    if (!termsCache) termsCache = getText("content/terms.md").then(function (t) {
      return window.EJULesson.parseDoc(t).map(function (s) {
        return '<section class="psec">' + (s.title ? '<h2 class="ptitle">' + bs(s.title.ja, s.title.vi, s.title.en) + "</h2>" : "") + blocks(s.blocks) + "</section>";
      }).join("");
    });
    termsCache.then(function (html) { if (document.body.contains(box)) setHTML(box, html); }, function (e) {
      termsCache = null;
      if (document.body.contains(box)) box.innerHTML = '<div class="content-err"><p><code>content/terms.md</code>' + (e.line ? " · dòng " + e.line : "") + ": " + esc(e.message) + "</p></div>";
    });
  }
  function renderTermsPage() {
    setHTML(app, '<div class="in page">' + pageTitle("利用規約及びプライバシーポリシー", "Điều khoản sử dụng và chính sách riêng tư", "Terms of use and privacy policy") +
      '<section class="panel"><div class="pbody" id="termsBody"><p class="muted small">' + bi("読み込み中…", "Đang tải…", "Loading…") + "</p></div></section></div>");
    showTerms(document.getElementById("termsBody"));
  }

  /* ================= ROUTER ================= */
  var searchBox = document.getElementById("q");
  function markNav(key) {
    gnav.querySelectorAll("[data-nav]").forEach(function (a) { a.classList.toggle("is-on", a.dataset.nav === key); });
  }
  var ready = false, authKnown = false;
  var GATE_VIEWS = { welcome: 1, login: 1, register: 1, reset: 1 };
  var afterLogin = null;
  function route() {
    if (!authKnown) return;
    var h = (location.hash || "").slice(1);
    /* a shared link (e.g. #v-k1-01) opened while signed out: remember it and go there after signing in */
    if (!user) { if (h && !GATE_VIEWS[h] && h !== "terms") afterLogin = h; renderGate(h); return; }
    closeMenu();
    if (GATE_VIEWS[h]) { h = afterLogin || "home"; afterLogin = null; history.replaceState(null, "", "#" + h); }
    if (h === "terms") { renderTermsPage(); markNav(""); window.scrollTo(0, 0); return; }
    if (!ready) return;
    if (searchBox.value && h) searchBox.value = "";
    if (h.indexOf("c-") === 0 && CMAP[h.slice(2)]) { renderCourse(h.slice(2)); markNav(CMAP[h.slice(2)].s); }
    else if (h.indexOf("v-") === 0 && V[h.slice(2)]) { renderVideo(h.slice(2)); markNav(CMAP[V[h.slice(2)].c].s); }
    else if (h === "bookmark") { renderBookmarks(); markNav("bookmark"); }
    else if (h === "ranking") { renderRanking(); markNav("ranking"); }
    else { renderHome(); markNav("home"); }
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);
  var sTimer;
  searchBox.addEventListener("input", function () {
    clearTimeout(sTimer);
    sTimer = setTimeout(function () {
      var q = searchBox.value.trim();
      if (q) { renderSearch(q); markNav(""); } else route();
    }, 180);
  });

  /* ================= START ================= */
  function showContentErrors() {
    var box = document.getElementById("contentErr");
    if (!box || !CONTENT_ERRORS.length) return;
    box.innerHTML = '<div class="content-err" role="alert"><p><b>Có ' + CONTENT_ERRORS.length + " lỗi trong thư mục content/.</b> Các bài bị lỗi tạm thời được ẩn đi cho tới khi sửa xong.</p><ul>" +
      CONTENT_ERRORS.map(function (e) { return "<li><code>" + esc(e.file) + "</code>" + (e.line ? " · dòng " + e.line : "") + ": " + esc(e.msg) + "</li>"; }).join("") + "</ul></div>";
    box.hidden = false;
  }
  function showFooter() {
    var f = document.getElementById("siteFoot");
    if (f) f.innerHTML = (SITE.footer || []).map(function (x) { return "<p>" + bi(x.ja, x.vi, x.en) + "</p>"; }).join("");
  }
  function setScreen(cls) {
    document.body.classList.remove("auth-wait", "gated");
    if (cls) document.body.classList.add(cls);
  }
  /* called by EJUAuth whenever someone signs in or out */
  function onUser(u, e) {
    authKnown = true;
    closeAcct(); closeMenu();
    if (!u) {
      clearTimeout(pushTimer);
      user = null; st = emptyState();
      gateNotice = e ? e.code : null;
      app.innerHTML = "";
      setScreen("gated");
      route();
      return;
    }
    user = u;
    var local = loadKey(cacheKey()), legacy = loadKey(LEGACY_KEY);
    st = mergeState(local, legacy);
    if (legacy) { try { localStorage.removeItem(LEGACY_KEY); } catch (x) {} save(); }
    avatarBtn.textContent = initialOf(u.name);
    gate.innerHTML = "";
    setScreen("");
    route();
    window.EJUAuth.loadProgress(u.uid).then(function (remote) {
      if (!user || user.uid !== u.uid || !remote) return;
      st = mergeState(st, remote);
      try { localStorage.setItem(cacheKey(), JSON.stringify(st)); } catch (x) {}
      pushProgress();
      route();
    }).catch(function () {});
  }
  window.addEventListener("pagehide", function () { if (pushTimer) pushProgress(); });

  setHTML(app, '<div class="in load-msg">' + bi("読み込み中…", "Đang tải bài học…") + "</div>");
  loadContent().then(function () {
    ready = true;
    showFooter();
    showContentErrors();
    route();
  }).catch(function (e) {
    var local = location.protocol === "file:";
    setHTML(app, '<div class="in page"><div class="content-err" role="alert">' + (local
      ? "<p><b>Không mở được website bằng cách bấm đúp vào index.html.</b></p><p>Trình duyệt chặn đọc các file bài học khi mở trực tiếp từ ổ đĩa. Hãy bấm đúp vào file <code>xem-thu.bat</code> trong thư mục website, hoặc đưa website lên mạng (xem HUONG-DAN.md).</p>"
      : "<p><b>Không tải được content/courses.json.</b></p><p>" + esc(e.message) + "</p>") + "</div></div>");
  });
  window.EJUAuth.onChange(onUser);
})();
