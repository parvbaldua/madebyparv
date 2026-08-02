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
const DIST_DIR = path.join(__dirname, '..', 'dist');

app.use(cors());
app.use(express.json());

// Ensure data directory and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

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

// ── ADMIN API ENDPOINTS ──

// 3. Admin Login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    return res.json({ success: true, token: ADMIN_TOKEN });
  }
  res.status(401).json({ error: 'Incorrect admin password' });
});

// 4. Verify Admin Session Token
app.get('/api/admin/verify', requireAdmin, (req, res) => {
  res.json({ valid: true });
});

// 5. Get all links (active & inactive) with full analytics
app.get('/api/admin/links', requireAdmin, (req, res) => {
  const links = getLinks().sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  res.json({ links });
});

// 6. Add a new link
app.post('/api/admin/links', requireAdmin, (req, res) => {
  const { title, url, label, dmKeyword, description, previewImage, category, badge } = req.body;

  if (!title || !url) {
    return res.status(400).json({ error: 'Title and URL are required' });
  }

  // URL format validation
  try {
    new URL(url);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid URL format. Please include http:// or https://' });
  }

  const links = getLinks();

  // Check duplicate URL warning flag
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

// 7. Edit existing link
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

// 8. Toggle active/inactive status
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

// 9. Reorder links array
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

  // Append any remaining links not in orderedIds
  linkMap.forEach(item => {
    item.sortOrder = reordered.length + 1;
    reordered.push(item);
  });

  saveLinks(reordered);
  res.json({ success: true, links: reordered });
});

// 10. Delete a link
app.delete('/api/admin/links/:id', requireAdmin, (req, res) => {
  let links = getLinks();
  const initialLength = links.length;

  links = links.filter(l => l.id !== req.params.id);

  if (links.length === initialLength) {
    return res.status(404).json({ error: 'Link not found' });
  }

  // Re-index sort order
  links.forEach((l, idx) => {
    l.sortOrder = idx + 1;
  });

  saveLinks(links);
  res.json({ success: true });
});

// 11. Auto-fetch webpage metadata (Title, Description, Favicon/Image)
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
    res.send('MadeByParv API Server Running. Please run `npm run build` to generate frontend production files.');
  }
});

app.listen(PORT, () => {
  console.log(`✅ MadeByParv Server running at http://localhost:${PORT}`);
});
