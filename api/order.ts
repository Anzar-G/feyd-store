import type { VercelRequest, VercelResponse } from '@vercel/node';

// Minimal serverless endpoint to capture orders and forward to Google Sheets/Airtable webhook
// Configure one of the following environment variables on Vercel:
// - SHEETS_WEBHOOK_URL (recommended; Google Apps Script WebApp URL / Sheet.best / Sheety)
// - AIRTABLE_API_URL (optional alternative) with AIRTABLE_TOKEN

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const SHEETS_WEBHOOK_URL = process.env.SHEETS_WEBHOOK_URL;
  const AIRTABLE_API_URL = process.env.AIRTABLE_API_URL;
  const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;

  if (!SHEETS_WEBHOOK_URL && !AIRTABLE_API_URL) {
    return res.status(501).json({ ok: false, error: 'No destination configured. Set SHEETS_WEBHOOK_URL or AIRTABLE_API_URL.' });
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const enriched = {
      ...payload,
      _meta: {
        ts: new Date().toISOString(),
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || '',
        ua: req.headers['user-agent'] || '',
      },
    };

    if (SHEETS_WEBHOOK_URL) {
      const r = await fetch(SHEETS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enriched),
      });
      const text = await r.text();
      if (!r.ok) throw new Error(`Sheets webhook failed: ${r.status} ${text}`);
      return res.status(200).json({ ok: true });
    }

    if (AIRTABLE_API_URL) {
      const r = await fetch(AIRTABLE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AIRTABLE_TOKEN || ''}`,
        },
        body: JSON.stringify({ records: [{ fields: enriched }] }),
      });
      const text = await r.text();
      if (!r.ok) throw new Error(`Airtable failed: ${r.status} ${text}`);
      return res.status(200).json({ ok: true });
    }

    return res.status(500).json({ ok: false, error: 'No route taken' });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err?.message || 'Unknown error' });
  }
}
