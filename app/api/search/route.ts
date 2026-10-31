import { discover } from '@/lib/search';
import { bad, limited } from '@/lib/guard';
import type { Mode } from '@/lib/types';
export const maxDuration = 60;
export async function POST(req: Request) {
  if (limited(req)) return bad('Too many requests. Please wait a minute.', 429);
  const b = (await req.json().catch(() => null)) as { query?: unknown; mode?: unknown; urls?: unknown } | null;
  const q = typeof b?.query === 'string' ? b.query.trim() : '';
  if (q.length < 8 || q.length > 500) return bad('Enter a research question of 8–500 characters.');
  if (!['quick', 'deep', 'official'].includes(String(b?.mode))) return bad('Invalid research mode.');
  const urls = Array.isArray(b?.urls) ? (b.urls as unknown[]).filter((u): u is string => typeof u === 'string').slice(0, 5) : [];
  if (!process.env.TAVILY_API_KEY && !process.env.BRAVE_API_KEY && !urls.length) return bad('No search provider configured. Set TAVILY_API_KEY or BRAVE_API_KEY in .env.local.', 503);
  try {
    const r = await discover(q, b!.mode as Mode, urls);
    if (!r.sources.length) return bad(`No sources retrieved. ${r.warnings.join('; ')}`, 502);
    return Response.json(r);
  } catch (e) { return bad((e as Error).message, 502); }
}
