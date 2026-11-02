// Cloudflare Worker: forma xabarlarini Telegramga yuboradi (token saytda ko'rinmaydi).
// Sozlamalar (Settings → Variables): BOT_TOKEN (Secret), CHAT_ID, ORIGIN (faqat origin, yo'lsiz: https://devolopertoirov.github.io)
export default {
  async fetch(req, env) {
    const cors = { 'Access-Control-Allow-Origin': env.ORIGIN || '*', 'Access-Control-Allow-Headers': 'Content-Type' };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (req.method !== 'POST') return new Response('ok', { headers: cors });
    if (env.ORIGIN && req.headers.get('Origin') !== env.ORIGIN) return new Response('forbidden', { status: 403 });
    const d = await req.json().catch(() => null);
    if (!d || !d.msg) return new Response('bad', { status: 400, headers: cors });
    if (d.w) return new Response('sent', { headers: cors }); // honeypot: botlarga jim 'sent'
    const text = `📩 Portfolio\n${String(d.name || '-').slice(0, 60)}\n${String(d.contact || '-').slice(0, 80)}\n${String(d.msg).slice(0, 1000)}`;
    const r = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: env.CHAT_ID, text }) });
    return new Response(r.ok ? 'sent' : 'fail', { status: r.ok ? 200 : 502, headers: cors });
  }
};
