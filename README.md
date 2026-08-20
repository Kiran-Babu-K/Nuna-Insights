# Nuna Insights — Data → Presentation Workspace
"Intelligence that understands."

## Run
npm install
node server.js
→ open http://localhost:3000

## UI
Notion-style sidebar workspace (Data · Design · Ask Nuna · Statistics ·
Generate & Export · Training · Compare). Data-entry uses a Gamma-style
segmented mode-selector (Upload / Paste / Sample, with checkmark cards);
Ask Nuna uses a Julius-style centered hero question + chat feed. A
Jira-style status badge in the top bar always shows how many decks
Nuna has learned from and their average rating.

## Feature parity additions (vs Genspark / Gamma / Julius)
- Ask Nuna: rule-based query engine — top/bottom N, average, total,
  trend, forecast (linear regression), correlation (Pearson), outlier
  detection (z-score), segment comparisons — all offline, no API key.
- Visible multi-agent pipeline (Data Intelligence AI → Business Analyst
  AI → KPI Engine → Visualization AI → Infographic AI → Storytelling AI
  → Design Engine → Brand AI → PPT Builder → Quality AI) shown as a
  live stepper before export.
- 3 export formats: native editable .pptx, a self-contained offline
  HTML "web deck", and a structured JSON data contract.
- Compare tab: honest, factual feature comparison vs Genspark, Gamma,
  and Julius AI.

## Training loop
Every export is recorded server-side (data profile + all design
choices) in training.json; rating a deck 1–5 weights those choices.
/api/learned returns rating-weighted defaults per data profile and
auto-applies them next time similar data is loaded.

## API
POST /api/train | POST /api/rate | GET /api/learned | GET /api/stats | POST /api/reset
