from yt_dlp import YoutubeDL

def handler(request):
    try:
        body = request.json()
        url = body.get('url')

        if not url:
            return {
                "statusCode": 400,
                "body": {"error": "URL tidak diberikan"}
            }

        ydl_opts = {'quiet': True, 'skip_download': True}
        with YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            return {
                "statusCode": 200,
                "body": {
                    "title": info.get("title"),
                    "thumbnail": info.get("thumbnail"),
                    "video_url": info.get("url")
                }
            }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": {"error": str(e)}
        }
