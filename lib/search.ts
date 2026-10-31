import type { Mode, Source } from './types';

export const MAX_BY_MODE: Record<Mode, number> = { quick: 5, deep: 12, official: 8 };
const host = (u: string) => new URL(u).hostname.replace(/^www\./, '');
export function classify(d: string): string {
  if (/(^|\.)(gov|nic)\.in$|\.gov$|\.gov\.[a-z]{2}$/.test(d)) return 'Government';
  if (/\.ac\.in$|\.edu$|\.edu\.[a-z]{2}$/.test(d)) return 'Academic';
  if (/news|times|hindu|express|ndtv|today/.test(d)) return 'News';
  return 'Other / commercial';
}
export function canonical(u: string): string {
  const x = new URL(u); x.hash = '';
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid'].forEach((k) => x.searchParams.delete(k));
  return (x.hostname.replace(/^www\./, '') + x.pathname.replace(/\/$/, '') + x.search).toLowerCase();
}
const authority = (t: string) => (t === 'Government' ? 3 : t === 'Academic' ? 2 : t === 'News' ? 1 : 0);
const mk = (i: number, p: string, title: string, url: string, content: string, date?: string): Source => {
  const d = host(url);
  return { id: `S${i}`, title: title || d, url, domain: d, provider: p, type: classify(d), publishedDate: date || undefined, content: content.slice(0, 5000) };
};

async function tavily(q: string, n: number, mode: Mode): Promise<Source[]> {
  const key = process.env.TAVILY_API_KEY; if (!key) throw new Error('TAVILY_API_KEY not set');
  const body: Record<string, unknown> = { query: q, max_results: n, include_raw_content: 'text', search_depth: mode === 'quick' ? 'basic' : 'advanced' };
  if (mode === 'official') body.include_domains = ['gov.in', 'nic.in', 'ac.in', 'edu'];
  const r = await fetch('https://api.tavily.com/search', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`Tavily HTTP ${r.status}`);
  const j = (await r.json()) as { results?: { title: string; url: string; content: string; raw_content?: string; published_date?: string }[] };
  return (j.results ?? []).map((x, i) => mk(i, 'Tavily', x.title, x.url, x.raw_content || x.content || '', x.published_date));
}
async function brave(q: string, n: number, mode: Mode): Promise<Source[]> {
  const key = process.env.BRAVE_API_KEY; if (!key) throw new Error('BRAVE_API_KEY not set');
  const qq = mode === 'official' ? `${q} (site:gov.in OR site:nic.in OR site:ac.in)` : q;
  const r = await fetch(`https://api.search.brave.com/res/v1/web/search?count=${Math.min(n, 20)}&q=${encodeURIComponent(qq)}`, { headers: { 'X-Subscription-Token': key, Accept: 'application/json' } });
  if (!r.ok) throw new Error(`Brave HTTP ${r.status}`);
  const j = (await r.json()) as { web?: { results?: { title: string; url: string; description: string; page_age?: string }[] } };
  return (j.web?.results ?? []).map((x, i) => mk(i, 'Brave', x.title, x.url, x.description || '', x.page_age));
}
export async function readUrl(url: string): Promise<Source> {
  const u = new URL(url); if (!/^https?:$/.test(u.protocol)) throw new Error('Only http(s) URLs are allowed');
  const r = await fetch(`https://r.jina.ai/${u.toString()}`, { headers: { Accept: 'text/plain' }, signal: AbortSignal.timeout(20000) });
  if (!r.ok) throw new Error(`Could not read ${u.hostname} (HTTP ${r.status})`);
  const t = await r.text();
  const title = /^Title:\s*(.+)$/m.exec(t)?.[1] ?? u.hostname;
  const date = /^Published Time:\s*(.+)$/m.exec(t)?.[1];
  return mk(0, 'Manual URL', title, u.toString(), t.split('Markdown Content:')[1] ?? t, date);
}

export async function discover(q: string, mode: Mode, urls: string[]) {
  const n = MAX_BY_MODE[mode], warnings: string[] = [];
  let found: Source[] = [];
  for (const p of [tavily, brave]) {
    try { found = found.concat(await p(q, n, mode)); if (found.length >= n) break; }
    catch (e) { warnings.push(`${p.name}: ${(e as Error).message}`); }
  }
  const manual = await Promise.all(urls.map((u) => readUrl(u).catch((e) => { warnings.push(`${u}: ${(e as Error).message}`); return null; })));
  const seen = new Set<string>(); const out: Source[] = [];
  for (const s of [...manual.filter((x): x is Source => !!x), ...found]) {
    const k = canonical(s.url); if (seen.has(k)) continue; seen.add(k); out.push(s);
  }
  const ranked = out.slice(0, n + urls.length).sort((a, b) => authority(b.type) - authority(a.type));
  return { sources: ranked.map((s, i) => ({ ...s, id: `S${i + 1}` })), warnings };
}
