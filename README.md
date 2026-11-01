# 🕳️ Digital Dark Spot — AI-Powered Information Gap Detection Platform

A web app that finds what the internet doesn't tell you. It searches several sources, then shows what is **missing, conflicting, outdated or unverified**, with every finding traced to its evidence.

Built for **Shinchan Online Hackathon 2026 (Devengers)**.

## 🚩 Problem

Information is scattered across many websites. People can't easily tell what is missing, which pages are outdated, where sources contradict each other, or which claims have no official backing.

## 💡 Solution

Enter a question, pick a research mode, and get a verification report built from live sources.

- 🔎 **Discover:** Tavily and Brave search the live web, with automatic fallback
- 📄 **Extract:** page text is read and duplicate URLs are merged
- 🧠 **Analyze:** Gemini returns structured JSON from the retrieved text only
- ✅ **Validate:** the server checks the JSON and tests each quote against the source

## ✨ Key Features

- **Key Findings:** claims with source tags (S1, S2…) and quote checks
- **Gap Radar:** potential information gaps with priority and what to verify
- **Contradictions:** conflicting claims side by side with dates
- **Freshness:** source dates with outdated and undated warnings
- **Verification Checklist:** prioritized items you tick off yourself
- **Source Explorer:** filter and sort every retrieved page
- **Evidence drawer:** click any source tag to see the excerpt and link
- Research history, light/dark theme, mobile responsive

## 🎛️ Research Modes

| Mode | Sources | What it does |
|---|---|---|
| Quick Scan | 5 | Fast overview with the main gaps and conflicts |
| Deep Research | 12 | Cross-source comparison and a longer checklist |
| Official Verification | 8 | Government and academic domains first; unofficial claims flagged |

## 🛠️ Tech Stack

Next.js, React, TypeScript, Tavily API, Brave Search API, Jina Reader, Google Gemini API, deployed on Vercel.

## 🔒 Trust and Safety

- Missing information is labeled a **potential** gap, never proof
- Web content is treated as untrusted data (prompt-injection guard)
- API keys stay on the server; rate limiting and input validation included
- No fake results: without API keys the app shows an error

## 🚀 Running Locally

```bash
npm install
cp .env.example .env.local   # add GEMINI_API_KEY, TAVILY_API_KEY (and/or BRAVE_API_KEY)
npm run dev                  # http://localhost:3000
```

## 🔗 Live Demo

[Try it here](https://digital-dark-spot-three.vercel.app)

> Results depend on the sources a search finds and on AI analysis. Treat findings as things to verify, not as final answers.
