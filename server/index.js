import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'parv2026';
const ADMIN_TOKEN = 'mbp_admin_secret_token_2026';

const DATA_DIR = path.join(__dirname, 'data');
const LINKS_FILE = path.join(DATA_DIR, 'links.json');
const SERIES_FILE = path.join(DATA_DIR, 'series.json');
const DIST_DIR = path.join(__dirname, '..', 'dist');

app.use(cors());
app.use(express.json());

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DEFAULT_SERIES_EPISODES = [
  {
    id: 'hack-1',
    hackNumber: 1,
    title: 'Tech Hack Part 1',
    youtubeUrl: 'https://youtube.com/shorts/6FGk_FJiTB8',
    embedUrl: 'https://www.youtube.com/embed/6FGk_FJiTB8',
    description: 'Tech Hacks : You Didn\'t Know You Needed - Part 1 by @MadeByParv',
  },
  {
    id: 'hack-2',
    hackNumber: 2,
    title: 'Tech Hack Part 2',
    youtubeUrl: 'https://youtube.com/shorts/xaOCGT6Ixmw',
    embedUrl: 'https://www.youtube.com/embed/xaOCGT6Ixmw',
    description: 'Tech Hacks : You Didn\'t Know You Needed - Part 2 by @MadeByParv',
  },
  {
    id: 'hack-3',
    hackNumber: 3,
    title: 'Tech Hack Part 3',
    youtubeUrl: 'https://youtube.com/shorts/MI0IwIkfF1o',
    embedUrl: 'https://www.youtube.com/embed/MI0IwIkfF1o',
    description: 'Tech Hacks : You Didn\'t Know You Needed - Part 3 by @MadeByParv',
  },
  {
    id: 'hack-4',
    hackNumber: 4,
    title: 'Tech Hack Part 4',
    youtubeUrl: 'https://youtube.com/shorts/U98i77exyDI',
    embedUrl: 'https://www.youtube.com/embed/U98i77exyDI',
    description: 'Tech Hacks : You Didn\'t Know You Needed - Part 4 by @MadeByParv',
  },
  {
    id: 'hack-5',
    hackNumber: 5,
    title: 'Tech Hack Part 5',
    youtubeUrl: 'https://youtube.com/shorts/9STJyvFlI_M',
    embedUrl: 'https://www.youtube.com/embed/9STJyvFlI_M',
    description: 'Tech Hacks : You Didn\'t Know You Needed - Part 5 by @MadeByParv',
  },
  {
    id: 'hack-6',
    hackNumber: 6,
    title: 'Tech Hack Part 6',
    youtubeUrl: 'https://youtube.com/shorts/TSDw34nD9Hw',
    embedUrl: 'https://www.youtube.com/embed/TSDw34nD9Hw',
    description: 'Tech Hacks : You Didn\'t Know You Needed - Part 6 by @MadeByParv',
  },
  {
    id: 'hack-7',
    hackNumber: 7,
    title: 'Tech Hack Part 7',
    youtubeUrl: 'https://youtube.com/shorts/jJzb2UlK_L0',
    embedUrl: 'https://www.youtube.com/embed/jJzb2UlK_L0',
    description: 'Tech Hacks : You Didn\'t Know You Needed - Part 7 by @MadeByParv',
  },
  {
    id: 'hack-8',
    hackNumber: 8,
    title: 'Tech Hack Part 8',
    youtubeUrl: 'https://youtube.com/shorts/DGzOJPVGKgs',
    embedUrl: 'https://www.youtube.com/embed/DGzOJPVGKgs',
    description: 'Tech Hacks : You Didn\'t Know You Needed - Part 8 by @MadeByParv',
  },
];

function getLinks() {
  try {
    if (!fs.existsSync(LINKS_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(LINKS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading links file:', err);
    return [];
  }
}

function saveLinks(links) {
  try {
    fs.writeFileSync(LINKS_FILE, JSON.stringify(links, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving links file:', err);
    return false;
  }
}

function getSeries() {
  try {
    if (!fs.existsSync(SERIES_FILE)) {
      fs.writeFileSync(SERIES_FILE, JSON.stringify(DEFAULT_SERIES_EPISODES, null, 2), 'utf-8');
      return DEFAULT_SERIES_EPISODES;
    }
    const raw = fs.readFileSync(SERIES_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading series file:', err);
    return DEFAULT_SERIES_EPISODES;
  }
}

const STATS_FILE = path.join(DATA_DIR, 'stats.json');

const DEFAULT_STATS = {
  seriesCount: 8,
  seriesTotal: 100,
  instaFam: 125,
  youtubeSubs: 555
};

function getStats() {
  try {
    if (!fs.existsSync(STATS_FILE)) {
      fs.writeFileSync(STATS_FILE, JSON.stringify(DEFAULT_STATS, null, 2), 'utf-8');
      return DEFAULT_STATS;
    }
    const raw = fs.readFileSync(STATS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading stats file:', err);
    return DEFAULT_STATS;
  }
}

function saveStats(stats) {
  try {
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving stats file:', err);
    return false;
  }
}

function saveSeries(episodes) {
  try {
    fs.writeFileSync(SERIES_FILE, JSON.stringify(episodes, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving series file:', err);
    return false;
  }
}

// Middleware: Admin Auth Check
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  const tokenHeader = req.headers['x-admin-token'];
  
  const token = (authHeader && authHeader.startsWith('Bearer '))
    ? authHeader.split(' ')[1]
    : tokenHeader;

  if (token === ADMIN_TOKEN) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized: Invalid admin token' });
}

// ── PUBLIC API ENDPOINTS ──

// 1. Get active public links
app.get('/api/links', (req, res) => {
  const links = getLinks();
  const activeLinks = links
    .filter(l => l.active !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  res.json({ links: activeLinks });
});

// 2. Track click on a link
app.post('/api/links/:id/click', (req, res) => {
  const links = getLinks();
  const index = links.findIndex(l => l.id === req.params.id);
  
  if (index !== -1) {
    links[index].clicks = (links[index].clicks || 0) + 1;
    saveLinks(links);
    return res.json({ success: true, clicks: links[index].clicks });
  }
  res.status(404).json({ error: 'Link not found' });
});

// 3. Get Tech Hacks Series Episodes
app.get('/api/series', (req, res) => {
  const episodes = getSeries();
  res.json({ episodes });
});

// ── ADMIN API ENDPOINTS ──

// 4. Admin Login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    return res.json({ success: true, token: ADMIN_TOKEN });
  }
  res.status(401).json({ error: 'Incorrect admin password' });
});

// 5. Verify Admin Session Token
app.get('/api/admin/verify', requireAdmin, (req, res) => {
  res.json({ valid: true });
});

// 6. Get all links
app.get('/api/admin/links', requireAdmin, (req, res) => {
  const links = getLinks().sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  res.json({ links });
});

// 7. Add a new link
app.post('/api/admin/links', requireAdmin, (req, res) => {
  const { title, url, label, dmKeyword, description, previewImage, category, badge } = req.body;

  if (!title || !url) {
    return res.status(400).json({ error: 'Title and URL are required' });
  }

  try {
    new URL(url);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid URL format. Please include http:// or https://' });
  }

  const links = getLinks();
  const isDuplicate = links.some(l => l.url.toLowerCase() === url.toLowerCase());

  const newLink = {
    id: `link-${Date.now()}`,
    title: title.trim(),
    url: url.trim(),
    label: label ? label.trim() : (dmKeyword ? `DM "${dmKeyword.trim()}"` : 'Link'),
    dmKeyword: dmKeyword ? dmKeyword.trim() : '',
    description: description ? description.trim() : '',
    previewImage: previewImage ? previewImage.trim() : '',
    category: category ? category.trim() : 'Resource',
    badge: badge ? badge.trim() : '',
    active: true,
    sortOrder: links.length + 1,
    clicks: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  links.push(newLink);
  saveLinks(links);

  res.json({ success: true, link: newLink, isDuplicate });
});

// 8. Edit existing link
app.put('/api/admin/links/:id', requireAdmin, (req, res) => {
  const links = getLinks();
  const index = links.findIndex(l => l.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Link not found' });
  }

  const { title, url, label, dmKeyword, description, previewImage, category, badge, active } = req.body;

  if (url) {
    try {
      new URL(url);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }
  }

  links[index] = {
    ...links[index],
    title: title !== undefined ? title.trim() : links[index].title,
    url: url !== undefined ? url.trim() : links[index].url,
    label: label !== undefined ? label.trim() : links[index].label,
    dmKeyword: dmKeyword !== undefined ? dmKeyword.trim() : links[index].dmKeyword,
    description: description !== undefined ? description.trim() : links[index].description,
    previewImage: previewImage !== undefined ? previewImage.trim() : links[index].previewImage,
    category: category !== undefined ? category.trim() : links[index].category,
    badge: badge !== undefined ? badge.trim() : links[index].badge,
    active: active !== undefined ? Boolean(active) : links[index].active,
    updatedAt: new Date().toISOString(),
  };

  saveLinks(links);
  res.json({ success: true, link: links[index] });
});

// 9. Toggle active/inactive status
app.patch('/api/admin/links/:id/toggle', requireAdmin, (req, res) => {
  const links = getLinks();
  const index = links.findIndex(l => l.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Link not found' });
  }

  links[index].active = !links[index].active;
  links[index].updatedAt = new Date().toISOString();

  saveLinks(links);
  res.json({ success: true, active: links[index].active });
});

// 10. Reorder links array
app.patch('/api/admin/links/reorder', requireAdmin, (req, res) => {
  const { orderedIds } = req.body;
  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ error: 'orderedIds array required' });
  }

  const links = getLinks();
  const linkMap = new Map(links.map(l => [l.id, l]));

  const reordered = [];
  orderedIds.forEach((id, idx) => {
    if (linkMap.has(id)) {
      const item = linkMap.get(id);
      item.sortOrder = idx + 1;
      item.updatedAt = new Date().toISOString();
      reordered.push(item);
      linkMap.delete(id);
    }
  });

  linkMap.forEach(item => {
    item.sortOrder = reordered.length + 1;
    reordered.push(item);
  });

  saveLinks(reordered);
  res.json({ success: true, links: reordered });
});

// 11. Delete a link
app.delete('/api/admin/links/:id', requireAdmin, (req, res) => {
  let links = getLinks();
  const initialLength = links.length;

  links = links.filter(l => l.id !== req.params.id);

  if (links.length === initialLength) {
    return res.status(404).json({ error: 'Link not found' });
  }

  links.forEach((l, idx) => {
    l.sortOrder = idx + 1;
  });

  saveLinks(links);
  res.json({ success: true });
});

// 12. Auto-fetch webpage metadata
app.get('/api/admin/fetch-meta', requireAdmin, async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).json({ error: 'url parameter required' });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(5000),
    });

    const html = await response.text();

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i) || html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) || html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
    const imageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);

    const title = titleMatch ? titleMatch[1].trim() : '';
    const description = descMatch ? descMatch[1].trim() : '';
    const previewImage = imageMatch ? imageMatch[1].trim() : '';

    res.json({ success: true, title, description, previewImage });
  } catch (err) {
    res.json({ success: false, message: 'Could not auto-fetch metadata from URL' });
  }
});

// Helper to construct YouTube embed URL
function getYouTubeEmbedUrl(url) {
  if (!url) return '';
  let videoId = '';
  if (url.includes('shorts/')) {
    videoId = url.split('shorts/')[1]?.split('?')[0]?.split('/')[0];
  } else if (url.includes('watch?v=')) {
    videoId = url.split('watch?v=')[1]?.split('&')[0];
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0];
  } else if (url.includes('embed/')) {
    return url;
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

// 13. Admin: Get all series episodes
app.get('/api/admin/series', requireAdmin, (req, res) => {
  const episodes = getSeries();
  res.json({ episodes });
});

// 14. Admin: Add a new series episode / part
app.post('/api/admin/series', requireAdmin, (req, res) => {
  const { title, hackNumber, youtubeUrl, description } = req.body;

  if (!youtubeUrl) {
    return res.status(400).json({ error: 'YouTube URL is required' });
  }

  const episodes = getSeries();
  const nextHackNum = hackNumber ? Number(hackNumber) : (episodes.length > 0 ? Math.max(...episodes.map(e => Number(e.hackNumber) || 0)) + 1 : 1);
  const partTitle = title ? title.trim() : `Tech Hack Part ${nextHackNum}`;
  const embedUrl = getYouTubeEmbedUrl(youtubeUrl.trim());

  const newEpisode = {
    id: `hack-${Date.now()}`,
    hackNumber: nextHackNum,
    title: partTitle,
    youtubeUrl: youtubeUrl.trim(),
    embedUrl,
    description: description ? description.trim() : `Tech Hacks : You Didn't Know You Needed - Part ${nextHackNum} by @MadeByParv`,
  };

  episodes.push(newEpisode);
  saveSeries(episodes);

  res.json({ success: true, episode: newEpisode });
});

// 15. Admin: Edit existing series episode
app.put('/api/admin/series/:id', requireAdmin, (req, res) => {
  const episodes = getSeries();
  const index = episodes.findIndex(e => e.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Series episode not found' });
  }

  const { title, hackNumber, youtubeUrl, description } = req.body;

  const current = episodes[index];
  const updatedYoutubeUrl = youtubeUrl !== undefined ? youtubeUrl.trim() : current.youtubeUrl;
  const updatedEmbedUrl = getYouTubeEmbedUrl(updatedYoutubeUrl);
  const updatedHackNum = hackNumber !== undefined ? Number(hackNumber) : current.hackNumber;

  episodes[index] = {
    ...current,
    hackNumber: updatedHackNum,
    title: title !== undefined ? title.trim() : current.title,
    youtubeUrl: updatedYoutubeUrl,
    embedUrl: updatedEmbedUrl,
    description: description !== undefined ? description.trim() : current.description,
  };

  saveSeries(episodes);
  res.json({ success: true, episode: episodes[index] });
});

// 16. Admin: Delete series episode
app.delete('/api/admin/series/:id', requireAdmin, (req, res) => {
  let episodes = getSeries();
  const initialLength = episodes.length;

  episodes = episodes.filter(e => e.id !== req.params.id);

  if (episodes.length === initialLength) {
    return res.status(404).json({ error: 'Series episode not found' });
  }

  saveSeries(episodes);
  res.json({ success: true });
});

// 17. Auto-fetch YouTube Shorts / Video metadata (Title, Description, Author)
app.get('/api/admin/fetch-youtube-meta', requireAdmin, async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).json({ error: 'url parameter required' });
  }

  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(targetUrl)}&format=json`;
    const response = await fetch(oembedUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      const data = await response.json();
      const title = data.title ? data.title.trim() : '';
      const author = data.author_name ? data.author_name.trim() : 'MadeByParv';
      const thumbnail = data.thumbnail_url || '';
      const description = title ? `${title} by @${author}` : '';

      return res.json({ success: true, title, description, thumbnail, author });
    }

    // Fallback: Webpage HTML scraping for og:title and og:description
    const htmlResponse = await fetch(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(5000),
    });

    const html = await htmlResponse.text();
    const titleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) || html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i) || html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);

    const title = titleMatch ? titleMatch[1].trim() : '';
    const description = descMatch ? descMatch[1].trim() : '';

    res.json({ success: true, title, description });
  } catch (err) {
    res.json({ success: false, message: 'Could not auto-fetch YouTube metadata' });
  }
});

// 18. Public API: Get site stats for homepage counters
app.get('/api/stats', (req, res) => {
  const stats = getStats();
  const episodes = getSeries();
  if (Array.isArray(episodes) && episodes.length > stats.seriesCount) {
    stats.seriesCount = episodes.length;
  }
  res.json({ success: true, stats });
});

// 19. Admin API: Get stats
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  const stats = getStats();
  const episodes = getSeries();
  if (Array.isArray(episodes) && episodes.length > stats.seriesCount) {
    stats.seriesCount = episodes.length;
  }
  res.json({ success: true, stats });
});

// 20. Admin API: Update stats
app.put('/api/admin/stats', requireAdmin, (req, res) => {
  const { seriesCount, seriesTotal, instaFam, youtubeSubs } = req.body;
  const current = getStats();

  const updated = {
    seriesCount: seriesCount !== undefined ? Number(seriesCount) : current.seriesCount,
    seriesTotal: seriesTotal !== undefined ? Number(seriesTotal) : current.seriesTotal,
    instaFam: instaFam !== undefined ? Number(instaFam) : current.instaFam,
    youtubeSubs: youtubeSubs !== undefined ? Number(youtubeSubs) : current.youtubeSubs,
  };

  saveStats(updated);
  res.json({ success: true, stats: updated });
});




// ── SERVE STATIC FRONTEND BUILD (VITE DIST) ──
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
}

// Fallback all non-API GET requests to index.html (SPA Client-Side Routing)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send('MadeByParv API Server Running.');
  }
});

app.listen(PORT, () => {
  console.log(`✅ MadeByParv Server running at http://localhost:${PORT}`);
});
