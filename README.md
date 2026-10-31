# Digital Dark Spot — Information Gap Detection Platform

Shinchan Online Hackathon 2026 (Devengers). Enter a question; the app retrieves multiple sources, extracts evidence-linked claims, and shows what is **missing, conflicting, outdated or unverified**.

Pipeline: question → multi-provider discovery → extraction → claim comparison → gaps → contradictions → freshness → verification checklist.

## Features
- Search adapters: Tavily and Brave, with automatic fallback; manual URLs read via Jina Reader. Results are deduplicated by canonical URL and ranked by source authority.
- Modes change real behavior: Quick (5 sources), Deep (12 sources), Official (gov/academic domain filter + official-first analysis prompt).
- Gemini analysis with a strict JSON contract, server-side validation, and untrusted-content/prompt-injection guard.
- Quotes are checked against retrieved text; unmatched excerpts are labeled, never presented as verified.
- Dashboard: overview, findings, source explorer (filter/sort), gap radar, contradictions, freshness, checklist, history. Dark/light theme, evidence drawer, responsive layout.
- Charts use only retrieved data. Absence in sources is always labeled a *potential* gap.

## Setup
```bash
npm install
cp .env.example .env.local   # add GEMINI_API_KEY and TAVILY_API_KEY and/or BRAVE_API_KEY
npm run dev                  # http://localhost:3000
npm run build && npm start
```
Deploy on Vercel: import the repo and add the same environment variables. Keys stay server-side.

## Limits (honest scope)
- Without API keys the app shows a configuration error; it never fakes research results.
- Session history and checklist state use browser localStorage (no Supabase yet).
- Respects provider terms; does not claim full internet coverage.
- Pages that block readers may fail; failures are shown as warnings.
- 
