const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.static("public"));

const DB = path.join(__dirname, "training.json");
function load() { try { return JSON.parse(fs.readFileSync(DB, "utf8")); } catch { return { records: [] }; } }
function save(d) { fs.writeFileSync(DB, JSON.stringify(d, null, 2)); }

app.post("/api/train", (req, res) => {
  const d = load();
  const r = req.body || {};
  r.ts = Date.now();
  d.records.push(r);
  save(d);
  res.json({ ok: true, total: d.records.length });
});

app.post("/api/rate", (req, res) => {
  const d = load();
  if (d.records.length) d.records[d.records.length - 1].rating = +req.body.rating || 0;
  save(d);
  res.json({ ok: true });
});

app.get("/api/learned", (req, res) => {
  const d = load();
  const profile = { isTime: req.query.isTime === "true", hasTarget: req.query.hasTarget === "true" };
  const matches = d.records.filter(r => r.profile &&
    r.profile.isTime === profile.isTime && r.profile.hasTarget === profile.hasTarget);
  const pool = matches.length ? matches : d.records;
  const best = (key) => {
    const score = {};
    pool.forEach(r => {
      if (r.choices && r.choices[key] != null) {
        const w = 1 + (r.rating || 3);
        score[r.choices[key]] = (score[r.choices[key]] || 0) + w;
      }
    });
    const top = Object.entries(score).sort((a, b) => b[1] - a[1])[0];
    return top ? top[0] : null;
  };
  const keys = ["template","cPrimary","cSecondary","cAccent","fHead","fBody","fSize","chMain","chShare","infStyle","infExtra"];
  const learned = {};
  keys.forEach(k => { const v = best(k); if (v != null) learned[k] = v; });
  res.json({
    learned,
    stats: {
      totalDecks: d.records.length,
      matchedProfile: matches.length,
      avgRating: d.records.filter(r=>r.rating).length
        ? (d.records.reduce((s,r)=>s+(r.rating||0),0) / d.records.filter(r=>r.rating).length).toFixed(2)
        : null
    }
  });
});

app.get("/api/stats", (req, res) => {
  const d = load();
  const tpl = {};
  d.records.forEach(r => { const t = r.choices?.template; if (t) tpl[t] = (tpl[t]||0)+1; });
  res.json({ totalDecks: d.records.length, templates: tpl,
    ratings: d.records.filter(r=>r.rating).map(r=>r.rating) });
});

app.post("/api/reset", (req, res) => { save({ records: [] }); res.json({ ok: true }); });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Nuna Insights → http://localhost:${PORT}`));
