// Vercel serverless function: receives the Start a project form and emails it through Resend.
// Environment variables (Vercel > Project > Settings > Environment Variables):
//   RESEND_API_KEY  required. Create one at resend.com.
//   CONTACT_TO      optional. Where enquiries are delivered. Defaults to david@opulencemediaagency.com.
//   CONTACT_FROM    optional. Sender, on a domain verified in Resend,
//                   for example "Opulence website <hello@opulencemediaagency.com>".

const clean = (v, max) => String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }
  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  // Honeypot: real visitors never fill this in.
  if (clean(body.fax, 200)) return res.status(200).json({ ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const company = clean(body.company, 160);
  const website = clean(body.website, 300);
  const service = clean(body.service, 80);
  const budget = clean(body.budget, 80);
  const message = clean(body.message, 5000);

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'Please add your name, a valid email and a message.' });
  }
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error('RESEND_API_KEY is not set, enquiry not delivered');
    return res.status(500).json({ ok: false, error: 'Email is not configured.' });
  }
  const to = process.env.CONTACT_TO || 'david@opulencemediaagency.com';
  const from = process.env.CONTACT_FROM || 'Opulence website <onboarding@resend.dev>';
  const text = [
    'New project enquiry from the website',
    '',
    'Name: ' + name,
    'Email: ' + email,
    'Company: ' + (company || 'Not given'),
    'Website: ' + (website || 'Not given'),
    'Service: ' + (service || 'Not given'),
    'Budget: ' + (budget || 'Not given'),
    '',
    message
  ].join('\n');

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: 'New project enquiry: ' + name + (company ? ' (' + company + ')' : ''),
        text
      })
    });
    if (!r.ok) {
      console.error('Resend error', r.status, await r.text());
      return res.status(502).json({ ok: false, error: 'Could not send.' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact handler failed', err);
    return res.status(502).json({ ok: false, error: 'Could not send.' });
  }
}
