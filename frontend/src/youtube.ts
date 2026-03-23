export function toYouTubeEmbedUrl(videoUrl) {
  if (!videoUrl) return '';

  try {
    const url = new URL(videoUrl);

    // Short links: https://youtu.be/<id>
    if (url.hostname === 'youtu.be') {
      const id = url.pathname.replace('/', '');
      return `https://www.youtube.com/embed/${id}`;
    }

    // Standard watch links: https://www.youtube.com/watch?v=<id>
    if (url.hostname.includes('youtube.com')) {
      const v = url.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}`;

      // Already an embed link: https://www.youtube.com/embed/<id>
      const embedMatch = url.pathname.match(/^\/embed\/([^/?]+)/);
      if (embedMatch?.[1]) return videoUrl;

      // Shorts: https://www.youtube.com/shorts/<id>
      const shortsMatch = url.pathname.match(/^\/shorts\/([^/?]+)/);
      if (shortsMatch?.[1]) return `https://www.youtube.com/embed/${shortsMatch[1]}`;
    }
  } catch {
    // If parsing fails, fall back to the raw string.
  }

  return videoUrl;
}

