import { analyze } from '@/lib/analyze';
import { bad, limited } from '@/lib/guard';
import type { Mode, Source } from '@/lib/types';
export const maxDuration = 120;
export async function POST(req: Request) {
  if (limited(req)) return bad('Too many requests. Please wait a minute.', 429);
  const b = (await req.json().catch(() => null)) as { query?: string; mode?: Mode; sources?: Source[] } | null;
  if (!b || typeof b.query !== 'string' || b.query.length > 500 || !Array.isArray(b.sources) || !b.sources.length || b.sources.length > 20) return bad('Invalid request.');
  const sources = b.sources.map((s) => ({ ...s, content: String(s.content ?? '').slice(0, 5000) }));
  try { return Response.json(await analyze(b.query, b.mode ?? 'quick', sources)); }
  catch (e) { return bad((e as Error).message, 502); }
}
