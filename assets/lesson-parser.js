/* Reads one lesson file (content/lessons/*.md) and turns it into the lesson object the site renders.
   The file format is described in HUONG-DAN.md. Errors are thrown with a line number so the site can
   tell the author exactly where a file is wrong.
   Every Japanese line may be followed by a "VI:" line (Vietnamese) and/or an "EN:" line (English, optional). */
(function (root) {
  "use strict";

  function fail(msg, line) { var e = new Error(msg); e.line = line; throw e; }
  /* same markup as bi() in app.js */
  function bi(ja, vi, en) {
    return '<span class="lj' + (en ? " xe" : "") + (vi == null ? " nv" : "") + '">' + ja + "</span>" +
      (vi != null ? '<span class="lv sep">' + vi + "</span>" : "") + (en ? '<span class="le">' + en + "</span>" : "");
  }

  /* Section headings: any of these words (JP, VI or EN) in a "## ..." line selects the section. */
  var SECTIONS = [
    ["point", ["point", "ポイント", "điểm chính"]],
    ["rei", ["例題", "ví dụ", "example"]],
    ["pr", ["練習", "luyện tập", "practice"]],
    ["sum", ["まとめ", "tóm tắt", "summary"]],
    ["terms", ["用語", "thuật ngữ", "terms"]],
    ["words", ["単語", "từ vựng", "words"]]
  ];
  var META_KEYS = { title: "t", vi: "vi", en: "en", video: "video", video_kaisetsu: "videoKaisetsu", video_tango: "videoTango", duration: "dur", board: "board", kind: "kind" };
  var RE = {
    vi: /^(?:VI|vi|Vi)\s*[:：]\s?(.*)$/,
    en: /^(?:EN|en|En)\s*[:：]\s?(.*)$/,
    ja: /^(?:JA|ja|Ja|JP|jp)\s*[:：]\s?(.*)$/,
    answer: /^(?:答え|解答|正解|Đáp án|đáp án)\s*[:：]\s?(.*)$/,
    explain: /^(?:解説|Lời giải|lời giải|Giải thích|giải thích)\s*[:：]\s?(.*)$/,
    caption: /^(?:注|Chú thích|chú thích)\s*[:：]\s?(.*)$/,
    option: /^(\d{1,2})\s*[.)．）]\s+(.+)$/,
    check: /\s*[✓✔]\s*$/,
    item: /^[-・]\s+(.*)$/,
    box: /(?<!\\)\[([A-Z])\]/g
  };

  /* **term** → <b class="term">term</b> */
  /* !!important!! → red bold */
  function inline(s) { return s.replace(/!!(.+?)!!/g, '<b class="hl">$1</b>').replace(/\*\*(.+?)\*\*/g, '<b class="term">$1</b>'); }
  function stripJa(s) { var m = s.match(RE.ja); return m ? m[1] : s; }
  /* a translation line: { key: "vi" | "en", text } or null */
  function trLine(t) {
    var m = t.match(RE.vi);
    if (m) return { key: "vi", text: m[1] };
    m = t.match(RE.en);
    return m ? { key: "en", text: m[1] } : null;
  }
  var LANG_NAME = { vi: "VI:", en: "EN:" };
  /* a string when there is no translation, else [ja, vi, en] (vi may be null, en left out when missing) */
  function pair(ja, vi, en) {
    if (vi == null && en == null) return ja;
    var a = [ja, vi == null ? null : vi];
    if (en != null) a.push(en);
    return a;
  }
  /* attach a translation line to the object it belongs to */
  function setTr(target, tr, n, what) {
    if (!target) fail("Dòng " + LANG_NAME[tr.key] + " phải nằm ngay dưới " + what + ".", n);
    if (target[tr.key] != null) fail("Đã có một dòng " + LANG_NAME[tr.key] + " cho câu này rồi.", n);
    target[tr.key] = inline(tr.text);
  }

  function parse(text) {
    var lines = String(text).replace(/^﻿/, "").replace(/\r\n?/g, "\n").split("\n");
    var L = {}, i = 0;

    /* ---- front matter ---- */
    while (i < lines.length && !lines[i].trim()) i++;
    if (lines[i] === undefined || lines[i].trim() !== "---") fail("File phải bắt đầu bằng dòng --- rồi tới phần thông tin (title, vi, video...).", i + 1);
    i++;
    for (; i < lines.length && lines[i].trim() !== "---"; i++) {
      var raw = lines[i].trim();
      if (!raw || raw[0] === "#") continue;
      var m = raw.match(/^([A-Za-z_]+)\s*:\s?(.*)$/);
      if (!m) fail("Dòng thông tin phải có dạng  tên: giá trị  (ví dụ  title: 「平方完成」のやり方).", i + 1);
      var key = META_KEYS[m[1].toLowerCase()];
      if (!key) fail("Không hiểu thông tin \"" + m[1] + "\". Chỉ dùng: title, vi, en, video, video_kaisetsu, video_tango, duration, board, kind.", i + 1);
      L[key] = m[2].trim();
    }
    if (i >= lines.length) fail("Thiếu dòng --- đóng phần thông tin ở đầu file.", lines.length);
    i++;
    if (!L.t) fail("Thiếu dòng  title:  (tên bài tiếng Nhật) ở phần thông tin.", 1);
    L.vi = L.vi || "";
    if (!L.en) delete L.en;
    L.dur = L.dur || "";
    if (L.dur && !/^\d{1,3}:\d{2}$/.test(L.dur)) fail("duration phải có dạng phút:giây, ví dụ 08:35.", 1);
    L.board = L.board ? L.board.split(/\s+\|\s+/).map(function (s) { return s.trim(); }).filter(Boolean) : [L.t];
    if (!L.video) delete L.video;
    if (!L.videoKaisetsu) delete L.videoKaisetsu;
    if (!L.videoTango) delete L.videoTango;
    if (L.kind) {
      if (L.kind !== "vocab") fail("kind chỉ có một giá trị: vocab (bài từ vựng).", 1);
    } else delete L.kind;

    /* ---- body: split into sections ---- */
    var sec = null, body = {};
    for (; i < lines.length; i++) {
      var line = lines[i], t = line.trim();
      var h = t.match(/^##\s+(.+)$/);
      if (h) {
        var name = h[1].toLowerCase(), found = null;
        SECTIONS.forEach(function (s) { if (!found && s[1].some(function (w) { return name.indexOf(w) > -1; })) found = s[0]; });
        if (!found) fail("Không hiểu mục \"" + h[1] + "\". Các mục có thể dùng: ## Point, ## 例題, ## 練習, ## まとめ, ## 用語, ## 単語.", i + 1);
        if (body[found]) fail("Mục \"" + h[1] + "\" bị lặp lại hai lần.", i + 1);
        sec = found; body[sec] = [];
        continue;
      }
      if (!sec) {
        if (t) fail("Nội dung phải nằm dưới một mục, ví dụ  ## Point.", i + 1);
        continue;
      }
      body[sec].push({ t: t, n: i + 1 });
    }

    L.point = body.point ? parseBlocks(body.point) : [];
    if (body.rei) L.rei = parseRei(body.rei);
    L.pr = body.pr ? parsePractice(body.pr) : [];
    /* まとめ takes the same blocks as Point (lists, formulas, key-point boxes, sub-headings, figures) */
    L.sum = body.sum ? parseBlocks(body.sum) : [];
    L.terms = body.terms ? parseWords(body.terms) : [];
    if (body.words) L.words = parseWords(body.words);
    if (L.kind === "vocab" && !(L.words && L.words.length)) fail("Bài từ vựng (kind: vocab) cần có mục ## 単語 với ít nhất một từ.", lines.length);
    return L;
  }

  /* ---- ## Point ---- */
  function parseBlocks(rows) {
    var out = [], last = null, j, r;
    function push(b) { out.push(b); last = b; return b; }
    for (j = 0; j < rows.length; j++) {
      r = rows[j];
      var t = r.t, m, tr;
      if (!t) { if (last && last.type !== "table" && last.type !== "cmp") last = null; continue; }
      if ((tr = trLine(t))) { setTr(last && last.target, tr, r.n, "câu tiếng Nhật cần dịch"); continue; }
      if (t.indexOf("\\[") === 0 || t.indexOf("$$") === 0) {
        var f = t, start = r.n;
        while (!formulaClosed(f)) {
          j++;
          if (j >= rows.length) fail("Công thức chưa được đóng (thiếu \\] hoặc $$).", start);
          f += "\n" + rows[j].t;
        }
        push({ type: "f", text: f.replace(/\$\$([\s\S]+?)\$\$/g, "\\[ $1 \\]") });
        continue;
      }
      if ((m = t.match(/^>>\s?(.*)$/))) { push({ type: "line", text: inline(m[1]) }); continue; }
      if ((m = t.match(/^!\[(.*)\]\(\s*([^\s)]+)\s*\)$/))) {
        var src = m[2];
        if (!/^(https?:\/\/|content\/)/.test(src)) {
          if (!/^[A-Za-z0-9_.\/-]+$/.test(src)) fail("Tên file hình chỉ dùng chữ không dấu, số, - _ . (ví dụ k1-01-1.svg).", r.n);
          src = "content/images/" + src;
        }
        var cap = m[1].split(/\s+\|\s+/);
        push({ type: "img", src: src, ja: inline(cap[0] || ""), vi: cap[1] ? inline(cap[1]) : null, en: cap[2] ? inline(cap[2]) : null });
        continue;
      }
      if ((m = t.match(/^###\s+(.+)$/))) { var hd = push({ type: "h", ja: inline(m[1]) }); hd.target = hd; continue; }
      if ((m = t.match(/^[!！]\s+(.+)$/))) {
        var memo = last && last.type === "memo" ? last : push({ type: "memo", items: [] });
        var mi = { ja: inline(m[1]) };
        memo.items.push(mi);
        memo.target = mi;
        continue;
      }
      if ((m = t.match(RE.item))) {
        var ul = last && last.type === "ul" ? last : push({ type: "ul", items: [] });
        var it = { ja: inline(m[1]) };
        ul.items.push(it);
        ul.target = it;
        continue;
      }
      if (t[0] === "|") {
        var tb = last && last.type === "table" && !last.caption ? last : push({ type: "table", rows: [], n: r.n });
        if (!/^\|?[\s:|-]+\|?$/.test(t) || t.indexOf("-") < 0) tb.rows.push(splitRow(t));
        continue;
      }
      if ((m = t.match(RE.caption)) && last && last.type === "table") {
        last.caption = last.target = { ja: inline(m[1]) };
        continue;
      }
      if ((m = t.match(/^:::\s*(?:cot|cột|col)\s+(.+)$/i))) {
        var cmp = last && last.type === "cmp" ? last : push({ type: "cmp", cols: [] });
        var col = { hj: inline(m[1]), hv: "", ja: "", vi: "" }, head = {}, text = null, start2 = r.n;
        for (j++; j < rows.length && rows[j].t !== ":::"; j++) {
          var ct = rows[j].t, ctr = trLine(ct);
          if (!ct) continue;
          if (ctr) setTr(text || head, ctr, rows[j].n, "tiêu đề cột hoặc đoạn tiếng Nhật");
          else {
            if (text) fail("Mỗi cột so sánh chỉ có một đoạn tiếng Nhật (kèm VI: / EN:).", rows[j].n);
            text = { ja: inline(stripJa(ct)) };
          }
        }
        if (j >= rows.length) fail("Cột so sánh chưa được đóng bằng dòng :::", start2);
        col.hv = head.vi || ""; if (head.en) col.he = head.en;
        if (text) { col.ja = text.ja; col.vi = text.vi || ""; if (text.en) col.en = text.en; }
        cmp.cols.push(col);
        continue;
      }
      var p = push({ type: "p", ja: inline(stripJa(t)) });
      p.target = p;
    }
    return out.map(function (b) {
      if (b.type === "p") return b.vi == null && b.en == null ? ["p", b.ja] : b.en == null ? ["p", b.ja, b.vi] : ["p", b.ja, b.vi == null ? null : b.vi, b.en];
      if (b.type === "f") return ["f", b.text];
      if (b.type === "line") return ["line", b.text];
      if (b.type === "ul") return ["ul", b.items.map(function (x) { return pair(x.ja, x.vi, x.en); })];
      if (b.type === "cmp") return ["cmp", b.cols];
      if (b.type === "memo") return ["memo", b.items.map(function (x) { return pair(x.ja, x.vi, x.en); })];
      if (b.type === "h") return ["h", b.ja, b.vi == null ? null : b.vi, b.en == null ? null : b.en];
      if (b.type === "img") return ["img", b.src, b.ja, b.vi, b.en];
      return ["html", tableHTML(b)];
    });
  }
  function formulaClosed(f) {
    if (f.indexOf("$$") === 0) return (f.match(/\$\$/g) || []).length % 2 === 0;
    return /\\\]\s*$/.test(f);
  }
  function splitRow(t) {
    var cells = t.replace(/^\|/, "").replace(/\|\s*$/, "").split("|");
    return cells.map(function (c) {
      c = c.trim();
      var k = c.indexOf(" / ");
      return k > -1 ? { ja: inline(c.slice(0, k).trim()), vi: inline(c.slice(k + 3).trim()) } : { ja: inline(c) };
    });
  }
  function tableHTML(tb) {
    if (tb.rows.length < 2) fail("Bảng cần ít nhất một dòng tiêu đề và một dòng nội dung.", tb.n);
    var headRow = tb.rows[0], cols = headRow.length;
    var head = headRow.map(function (c) { return "<th>" + (c.vi != null ? bi(c.ja, c.vi) : c.ja) + "</th>"; }).join("");
    var rows = tb.rows.slice(1).map(function (row) {
      return "<tr>" + row.map(function (c, k) {
        if (k === 0) return '<td><span class="term">' + c.ja + "</span>" + (c.vi != null ? '<span class="lv">' + c.vi + "</span>" : "") + "</td>";
        if (c.vi == null && c.ja.length <= 2) return '<td class="mark' + (c.ja === "×" ? " no" : "") + '">' + c.ja + "</td>";
        return c.vi != null ? '<td><span class="lj">' + c.ja + '</span><span class="lv">' + c.vi + "</span></td>" : "<td>" + c.ja + "</td>";
      }).join("") + "</tr>";
    }).join("");
    var c = tb.caption;
    var cap = c ? '<p class="caption">' + (c.vi != null || c.en != null ? bi(c.ja, c.vi, c.en) : c.ja) + "</p>" : "";
    return '<div class="table-scroll"><table' + (cols >= 4 ? ' class="org"' : "") + "><thead><tr>" + head + "</tr></thead><tbody>" + rows + "</tbody></table></div>" + cap;
  }

  /* ---- ## 例題 ---- */
  function parseRei(rows) {
    var q = [], qtr = {}, a = null;
    rows.forEach(function (r) {
      var t = r.t, m, tr;
      if (!t) return;
      if ((m = t.match(RE.answer) || t.match(RE.explain))) { a = { ja: inline(m[1]) }; return; }
      if ((tr = trLine(t))) {
        if (a) setTr(a, tr, r.n, "dòng 解答:");
        else if (q.length) { if (qtr[tr.key] != null) fail("Đã có một dòng " + LANG_NAME[tr.key] + " cho đề bài rồi.", r.n); qtr[tr.key] = tr.text; }
        else fail("Dòng " + LANG_NAME[tr.key] + " phải nằm ngay dưới câu hỏi hoặc dưới dòng 解答:.", r.n);
        return;
      }
      if (a) fail("Sau dòng 解答: chỉ được có dòng VI: và EN:.", r.n);
      q.push(inline(stripJa(t)));
    });
    if (!q.length) fail("Mục ## 例題 cần có câu hỏi.", rows.length ? rows[0].n : 0);
    if (a == null) fail("Mục ## 例題 cần có dòng  解答: ...", rows[rows.length - 1].n);
    var rei = { q: q.join("<br>"), a: pair(a.ja, a.vi, a.en) };
    if (qtr.vi != null) rei.tr = qtr.vi;
    if (qtr.en != null) rei.tren = qtr.en;
    return rei;
  }

  /* ---- ## 練習 ---- */
  function parsePractice(rows) {
    var qs = [], cur = null;
    function finish() {
      if (!cur) return;
      var n = cur.n;
      if (!cur.q.length) fail("Câu hỏi chưa có đề.", n);
      var stem = cur.q.join("<br>");
      var out = { k: cur.o.length ? "mc" : "fill" };
      if (out.k === "mc") {
        var key = cur.o.reduce(function (acc, o, k) { return o.ok ? k + 1 : acc; }, 0);
        if (cur.ans != null) {
          var num = cur.ans.replace(/[①-⑥]/, function (c) { return String("①②③④⑤⑥".indexOf(c) + 1); });
          key = parseInt(num, 10);
        }
        if (!key || key < 1 || key > cur.o.length) fail("Câu trắc nghiệm chưa có đáp án đúng. Thêm dấu ✓ cuối đáp án đúng, hoặc dòng  答え: 2.", n);
        out.q = stem;
        out.o = cur.o.map(function (o) { return o.text; });
        out.a = key;
      } else {
        if (cur.ans == null) fail("Câu điền ô cần dòng  答え: A=5, B=3  (hoặc thêm các đáp án 1. 2. 3. nếu là câu trắc nghiệm).", n);
        var cells = cur.ans.split(/[,、，]/).map(function (s) { return s.trim(); }).filter(Boolean).map(function (s) {
          var m = s.match(/^([A-Z])\s*[=＝]\s*(.+)$/);
          if (!m) fail("Đáp án điền ô phải có dạng  A=5, B=3.", cur.ansLine);
          var v = m[2].trim().replace(/[０-９]/g, function (ch) { return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0); }).replace(/[−ー－‐—–]/g, "-");
          if (!/^[0-9-]$/.test(v)) fail("Mỗi ô chỉ chứa một chữ số hoặc dấu −. Ô " + m[1] + " đang là \"" + m[2].trim() + "\".", cur.ansLine);
          return [m[1], v];
        });
        var boxes = [];
        stem.replace(RE.box, function (_, b) { boxes.push(b); return _; });
        var names = cells.map(function (c) { return c[0]; });
        if (!boxes.length) fail("Câu điền ô cần có các ô [A], [B]... trong đề.", n);
        if (boxes.join(",") !== names.join(",")) fail("Các ô trong đề (" + boxes.join(", ") + ") không khớp với đáp án (" + names.join(", ") + ").", cur.ansLine);
        out.q = stem.replace(RE.box, '<i class="box">$1</i>');
        out.cells = cells;
      }
      if (cur.qtr.vi != null) out.tr = cur.qtr.vi;
      if (cur.qtr.en != null) out.tren = cur.qtr.en;
      if (cur.ex == null) fail("Câu hỏi cần dòng  解説: ...  (lời giải).", n);
      out.ex = pair(cur.ex.ja, cur.ex.vi, cur.ex.en);
      qs.push(out);
      cur = null;
    }
    rows.forEach(function (r) {
      var t = r.t, m, tr;
      if (/^###/.test(t)) { finish(); cur = { n: r.n, q: [], qtr: {}, o: [], ans: null, ex: null, last: "q" }; return; }
      if (!t) return;
      if (!cur) fail("Mỗi câu hỏi trong ## 練習 bắt đầu bằng một dòng ###.", r.n);
      if ((tr = trLine(t))) {
        if (cur.last === "q" && cur.q.length) { if (cur.qtr[tr.key] != null) fail("Đã có một dòng " + LANG_NAME[tr.key] + " cho đề bài rồi.", r.n); cur.qtr[tr.key] = tr.text; }
        else if (cur.last === "ex") setTr(cur.ex, tr, r.n, "dòng 解説:");
        else fail("Dòng " + LANG_NAME[tr.key] + " phải nằm ngay dưới đề bài hoặc dưới dòng 解説:.", r.n);
        return;
      }
      if ((m = t.match(RE.explain))) { cur.ex = { ja: inline(m[1]) }; cur.last = "ex"; return; }
      if ((m = t.match(RE.answer))) { cur.ans = m[1].trim(); cur.ansLine = r.n; cur.last = "ans"; return; }
      if ((m = t.match(RE.option)) && cur.q.length) {
        if (+m[1] !== cur.o.length + 1) fail("Đáp án phải đánh số liên tiếp 1. 2. 3. ...", r.n);
        if (cur.o.length >= 6) fail("Mỗi câu tối đa 6 đáp án.", r.n);
        var ok = RE.check.test(m[2]);
        cur.o.push({ text: inline(m[2].replace(RE.check, "")), ok: ok });
        cur.last = "o";
        return;
      }
      if (cur.last !== "q") fail("Đề bài phải nằm trước các đáp án và dòng 答え: / 解説:.", r.n);
      cur.q.push(inline(stripJa(t)));
    });
    finish();
    return qs;
  }

  /* ---- ## まとめ ---- */
  function parseItems(rows) {
    var items = [], last = null;
    rows.forEach(function (r) {
      var t = r.t, m, tr;
      if (!t) return;
      if ((tr = trLine(t))) { setTr(last, tr, r.n, "ý cần dịch"); return; }
      m = t.match(RE.item);
      last = { ja: inline(stripJa(m ? m[1] : t)) };
      items.push(last);
    });
    return items.map(function (x) { return pair(x.ja, x.vi, x.en); });
  }

  /* ---- ## 用語 / ## 単語: 漢字 | reading | Vietnamese [| English] ---- */
  function parseWords(rows) {
    var out = [];
    rows.forEach(function (r) {
      var t = r.t, m;
      if (!t) return;
      m = t.match(RE.item);
      var parts = (m ? m[1] : t).split("|").map(function (s) { return s.trim(); });
      if ((parts.length !== 3 && parts.length !== 4) || !parts[0] || !parts[2]) fail("Mỗi từ viết dạng  - 漢字 | cách đọc | nghĩa tiếng Việt  (cách đọc có thể để trống; có thể thêm  | nghĩa tiếng Anh).", r.n);
      if (parts.length === 4 && !parts[3]) parts.pop();
      out.push(parts);
    });
    return out;
  }

  /* A simple page (e.g. content/terms.md): "## 日本語 | Tiếng Việt | English" headings, then the same
     paragraphs, lists and VI:/EN: lines as ## Point. Returns [{ title: {ja, vi, en} | null, blocks }]. */
  function parseDoc(text) {
    var lines = String(text).replace(/^﻿/, "").replace(/\r\n?/g, "\n").split("\n"), secs = [], cur = null;
    lines.forEach(function (line, i) {
      var t = line.trim(), h = t.match(/^##\s+(.+)$/);
      if (h) {
        var p = h[1].split(/\s+\|\s+/);
        cur = { title: { ja: inline(p[0]), vi: p[1] ? inline(p[1]) : null, en: p[2] ? inline(p[2]) : null }, rows: [] };
        secs.push(cur);
        return;
      }
      if (/^#\s/.test(t) || t.indexOf("<!--") === 0) return;
      if (!cur) { if (!t) return; cur = { title: null, rows: [] }; secs.push(cur); }
      cur.rows.push({ t: t, n: i + 1 });
    });
    return secs.map(function (s) { return { title: s.title, blocks: parseBlocks(s.rows) }; });
  }

  var api = { parse: parse, parseDoc: parseDoc };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.EJULesson = api;
})(this);
