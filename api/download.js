export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Missing TikTok video URL' });
  }

  try {
    const tiktokRes = await fetch(`https://tiktok.sutanlab.id/api?url=${encodeURIComponent(url)}`);
    const data = await tiktokRes.json();

    if (!data || data.status !== 'success') {
      return res.status(500).json({ error: 'Failed to fetch from TikTok' });
    }

    return res.status(200).json({
      author: data.author,
      video_url: data.video,
      cover: data.cover,
      description: data.desc,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong', details: err.message });
  }
}
