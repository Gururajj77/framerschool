/**
 * Latest uploads from the FramerSchool YouTube channel, read from the public
 * channel feed at build time (no API key). New videos appear on the next build.
 */

const CHANNEL_ID = 'UCjP5YOY35UqSsvxA1dNhL5g';
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

export interface Video {
  id: string;
  title: string;
  description: string;
  published: Date;
  url: string;
  thumbnail: string;
}

/** Snapshot used when the feed can't be reached, so a build never ships without videos. */
const FALLBACK: Array<Omit<Video, 'url' | 'thumbnail'>> = [
  {
    id: 'LsyZ6GAoxlY',
    title: 'How to setup Notion Framer Sync',
    description: 'Update your Framer site from Notion, without opening Framer.',
    published: new Date('2026-10-05T12:30:05Z'),
  },
  {
    id: 'okZpH_xBMKQ',
    title: 'Framer tutorial for beginners',
    description:
      'Learn Framer from zero. Build the blocks every website is made of by hand, with the reason behind each one.',
    published: new Date('2026-09-30T12:30:20Z'),
  },
  {
    id: 'LaNjplbId-U',
    title: 'How to build a website using Framer',
    description: '',
    published: new Date('2026-09-05T13:41:26Z'),
  },
];

const decode = (text: string) =>
  text
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

const pick = (entry: string, tag: string) =>
  decode(entry.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`))?.[1]?.trim() ?? '');

function withLinks(video: Omit<Video, 'url' | 'thumbnail'>): Video {
  return {
    ...video,
    url: `https://www.youtube.com/watch?v=${video.id}`,
    thumbnail: `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`,
  };
}

async function fetchFeed(): Promise<Video[]> {
  const response = await fetch(FEED_URL);
  if (!response.ok) throw new Error(`YouTube feed returned ${response.status}`);
  const xml = await response.text();

  const videos = xml
    .split('<entry>')
    .slice(1)
    .filter((entry) => !entry.includes('/shorts/'))
    .map((entry) =>
      withLinks({
        id: pick(entry, 'yt:videoId'),
        title: pick(entry, 'title'),
        description: pick(entry, 'media:description'),
        published: new Date(pick(entry, 'published')),
      }),
    )
    .filter((video) => video.id && video.title);

  if (!videos.length) throw new Error('YouTube feed had no videos');
  return videos;
}

let cache: Promise<Video[]> | undefined;

export function getLatestVideos(limit = 3): Promise<Video[]> {
  cache ??= fetchFeed().catch((error) => {
    console.warn(`[youtube] Using the saved video list: ${error.message}`);
    return FALLBACK.map(withLinks);
  });
  return cache.then((videos) => videos.slice(0, limit));
}
