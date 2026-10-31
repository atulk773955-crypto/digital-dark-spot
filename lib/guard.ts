const hits = new Map<string, number[]>();
export function limited(req: Request, max = 8): boolean {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'local';
  const now = Date.now(); const h = (hits.get(ip) ?? []).filter((t) => now - t < 60000);
  h.push(now); hits.set(ip, h); return h.length > max;
}
export const bad = (error: string, status = 400) => Response.json({ error }, { status });
