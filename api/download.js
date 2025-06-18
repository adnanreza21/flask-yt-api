import { fetch } from 'undici';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { url } = req.body;

  if (!url || !url.includes('tiktok.com')) {
    return res.status(400).json({ error: 'TikTok URL is invalid or missing' });
  }

  try {
    // spoof User-Agent agar tidak ditolak TikTok
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
      },
    });

    const html = await response.text();

    // cari JSON metadata video
    const jsonString = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.+?)<\/script>/);

    if (!jsonString || jsonString.length < 2) {
      return res.status(500).json({ error: 'Failed to parse TikTok video page' });
    }

    const jsonData = JSON.parse(jsonString[1]);

    const videoData = jsonData.props.pageProps.itemInfo.itemStruct;
    const downloadUrl = videoData.video.downloadAddr;

    return res.status(200).json({
      title: videoData.desc,
      thumbnail: videoData.video.cover,
      author: videoData.author.nickname,
      download_url: downloadUrl,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
