export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Missing url' });

  try {
    const apiKey = process.env.PRIMEAPI_KEY; // simpan key di .env.local atau Vercel secret

    const resp = await fetch(`https://api.primeapi.co/download-video?url=${encodeURIComponent(url)}`, {
      headers: {
        'X-PrimeAPI-Key': `${apiKey}`
      }
    });

    const data = await resp.json();

    if (!data.play) {
      return res.status(500).json({ error: 'No video link', raw: data });
    }

    return res.status(200).json({
      video: data.play,
      video_watermark: data.play_watermark,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Fetch failed', details: err.message });
  }
}
