import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Lock,
  LogOut,
  BarChart2,
  Globe,
  AlertTriangle,
  Check,
  Smartphone,
  Search,
  X,
  Youtube,
  Layers,
  Film,
  TrendingUp,
  Save,
} from 'lucide-react';
import { DEFAULT_HACKS } from './SeriesModal';

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  label: string;
  dmKeyword?: string;
  description: string;
  previewImage?: string;
  category: string;
  badge?: string;
  active: boolean;
  sortOrder: number;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

export interface SeriesEpisode {
  id: string;
  hackNumber: number;
  title: string;
  youtubeUrl: string;
  embedUrl: string;
  description?: string;
}

interface AdminPageProps {
  onBackToSite: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onBackToSite }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'links' | 'series' | 'stats'>('links');

  // Links states
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Link Form states
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState<string>('');
  const [formUrl, setFormUrl] = useState<string>('');
  const [formDmKeyword, setFormDmKeyword] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('Free Resource');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formPreviewImage, setFormPreviewImage] = useState<string>('');
  const [formBadge, setFormBadge] = useState<string>('');

  const [formError, setFormError] = useState<string>('');
  const [duplicateWarning, setDuplicateWarning] = useState<boolean>(false);
  const [isFetchingMeta, setIsFetchingMeta] = useState<boolean>(false);

  // Series states
  const [series, setSeries] = useState<SeriesEpisode[]>(DEFAULT_HACKS);
  const [seriesSearchQuery, setSeriesSearchQuery] = useState<string>('');

  // Series Form states
  const [isSeriesFormOpen, setIsSeriesFormOpen] = useState<boolean>(false);
  const [editingSeriesId, setEditingSeriesId] = useState<string | null>(null);
  const [seriesFormTitle, setSeriesFormTitle] = useState<string>('');
  const [seriesFormHackNum, setSeriesFormHackNum] = useState<number | string>('');
  const [seriesFormYoutubeUrl, setSeriesFormYoutubeUrl] = useState<string>('');
  const [seriesFormDescription, setSeriesFormDescription] = useState<string>('');
  const [seriesFormError, setSeriesFormError] = useState<string>('');
  const [isFetchingSeriesMeta, setIsFetchingSeriesMeta] = useState<boolean>(false);

  // Stats / Counter states
  const [statsForm, setStatsForm] = useState({
    seriesCount: 8,
    seriesTotal: 100,
    instaFam: 125,
    youtubeSubs: 555,
  });
  const [isSavingStats, setIsSavingStats] = useState<boolean>(false);

  // Delete modal confirmations
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteSeriesConfirmId, setDeleteSeriesConfirmId] = useState<string | null>(null);

  // Success notification toast
  const [toastMessage, setToastMessage] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Check persistent login on mount
  useEffect(() => {
    const token = localStorage.getItem('mbp_admin_token');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminLinks();
      fetchAdminSeries();
      fetchAdminStats();
    }
  }, [isAuthenticated]);

  const verifyToken = async (token: string) => {
    try {
      const res = await fetch('/api/admin/verify', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setIsAuthenticated(true);
        fetchAdminLinks(token);
        fetchAdminSeries(token);
        fetchAdminStats(token);
      } else {
        localStorage.removeItem('mbp_admin_token');
        setIsAuthenticated(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('mbp_admin_token', data.token);
        setIsAuthenticated(true);
        fetchAdminLinks(data.token);
        fetchAdminSeries(data.token);
        fetchAdminStats(data.token);
        showToast('Logged in successfully');
      } else {
        setLoginError(data.error || 'Incorrect password');
      }
    } catch (e) {
      setLoginError('Server connection error. Ensure API server is running.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mbp_admin_token');
    setIsAuthenticated(false);
  };

  const fetchAdminLinks = async (token?: string) => {
    const authToken = token || localStorage.getItem('mbp_admin_token');
    try {
      const res = await fetch('/api/admin/links', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (res.ok) {
        setLinks(data.links || []);
      }
    } catch (e) {
      console.error('Failed to fetch admin links', e);
    }
  };

  const fetchAdminSeries = async (token?: string) => {
    const authToken = token || localStorage.getItem('mbp_admin_token');
    try {
      const res = await fetch('/api/admin/series', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.episodes) && data.episodes.length > 0) {
        setSeries(data.episodes);
      } else {
        setSeries(DEFAULT_HACKS);
      }
    } catch (e) {
      console.error('Failed to fetch admin series', e);
      setSeries(DEFAULT_HACKS);
    }
  };

  const fetchAdminStats = async (token?: string) => {
    const authToken = token || localStorage.getItem('mbp_admin_token');
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (res.ok && data.stats) {
        setStatsForm(data.stats);
      }
    } catch (e) {
      console.error('Failed to fetch admin stats', e);
    }
  };

  const handleSaveStats = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingStats(true);
    const token = localStorage.getItem('mbp_admin_token');
    try {
      const res = await fetch('/api/admin/stats', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(statsForm),
      });
      if (res.ok) {
        showToast('Live Counters & Stats Saved!');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingStats(false);
    }
  };

  // ── LINK MANAGERS ──

  const handleUrlChange = (newUrl: string) => {
    setFormUrl(newUrl);
    if (newUrl.trim()) {
      const exists = links.some(
        l => l.url.toLowerCase() === newUrl.trim().toLowerCase() && l.id !== editingId
      );
      setDuplicateWarning(exists);
    } else {
      setDuplicateWarning(false);
    }
  };

  const handleAutoFetchMeta = async () => {
    if (!formUrl.trim()) {
      setFormError('Please enter a URL first');
      return;
    }
    setIsFetchingMeta(true);
    setFormError('');
    try {
      const token = localStorage.getItem('mbp_admin_token');
      const res = await fetch(`/api/admin/fetch-meta?url=${encodeURIComponent(formUrl.trim())}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        if (data.title && !formTitle) setFormTitle(data.title);
        if (data.description && !formDescription) setFormDescription(data.description);
        if (data.previewImage && !formPreviewImage) setFormPreviewImage(data.previewImage);
        showToast('Webpage metadata fetched!');
      } else {
        setFormError('Could not auto-fetch page metadata. You can enter details manually.');
      }
    } catch (e) {
      setFormError('Metadata fetch timed out. Enter details manually.');
    } finally {
      setIsFetchingMeta(false);
    }
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormTitle('');
    setFormUrl('');
    setFormDmKeyword('');
    setFormCategory('Free Resource');
    setFormDescription('');
    setFormPreviewImage('');
    setFormBadge('');
    setFormError('');
    setDuplicateWarning(false);
    setIsFormOpen(true);
  };

  const openEditForm = (link: LinkItem) => {
    setEditingId(link.id);
    setFormTitle(link.title);
    setFormUrl(link.url);
    setFormDmKeyword(link.dmKeyword || '');
    setFormCategory(link.category || 'Free Resource');
    setFormDescription(link.description || '');
    setFormPreviewImage(link.previewImage || '');
    setFormBadge(link.badge || '');
    setFormError('');
    setDuplicateWarning(false);
    setIsFormOpen(true);
  };

  const handleSaveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formTitle.trim() || !formUrl.trim()) {
      setFormError('Title and URL are required.');
      return;
    }

    try {
      new URL(formUrl.trim());
    } catch (e) {
      setFormError('Invalid URL format. Please start with http:// or https://');
      return;
    }

    const token = localStorage.getItem('mbp_admin_token');

    const payload = {
      title: formTitle,
      url: formUrl,
      dmKeyword: formDmKeyword,
      label: formDmKeyword.trim() ? `DM "${formDmKeyword.trim()}"` : 'Link',
      category: formCategory,
      description: formDescription,
      previewImage: formPreviewImage,
      badge: formBadge,
    };

    try {
      const url = editingId
        ? `/api/admin/links/${editingId}`
        : '/api/admin/links';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setIsFormOpen(false);
        fetchAdminLinks();
        showToast(editingId ? 'Link updated!' : 'Link created!');
      } else {
        setFormError(data.error || 'Failed to save link.');
      }
    } catch (err) {
      setFormError('Server error while saving link.');
    }
  };

  const handleToggleActive = async (id: string) => {
    const token = localStorage.getItem('mbp_admin_token');
    try {
      const res = await fetch(`/api/admin/links/${id}/toggle`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchAdminLinks();
        showToast('Status updated');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === links.length - 1)
    ) {
      return;
    }

    const newLinks = [...links];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = newLinks[index];
    newLinks[index] = newLinks[targetIdx];
    newLinks[targetIdx] = temp;

    setLinks(newLinks);

    const token = localStorage.getItem('mbp_admin_token');
    const orderedIds = newLinks.map(l => l.id);

    try {
      await fetch('/api/admin/links/reorder', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderedIds }),
      });
      showToast('Order saved');
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('mbp_admin_token');
    try {
      const res = await fetch(`/api/admin/links/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setDeleteConfirmId(null);
        fetchAdminLinks();
        showToast('Link deleted');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ── SERIES MANAGERS ──

  const handleAutoFetchSeriesMeta = async () => {
    if (!seriesFormYoutubeUrl.trim()) {
      setSeriesFormError('Please enter a YouTube URL first');
      return;
    }
    setIsFetchingSeriesMeta(true);
    setSeriesFormError('');
    try {
      const token = localStorage.getItem('mbp_admin_token');
      const res = await fetch(`/api/admin/fetch-youtube-meta?url=${encodeURIComponent(seriesFormYoutubeUrl.trim())}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        if (data.title) {
          setSeriesFormTitle(data.title);
        }
        if (data.description) {
          setSeriesFormDescription(data.description);
        }
        showToast('YouTube video metadata fetched!');
      } else {
        setSeriesFormError('Could not auto-fetch video details. You can enter details manually.');
      }
    } catch (e) {
      setSeriesFormError('Metadata fetch timed out. Enter details manually.');
    } finally {
      setIsFetchingSeriesMeta(false);
    }
  };

  const openAddSeriesForm = () => {
    setEditingSeriesId(null);
    const nextNum = series.length > 0 ? Math.max(...series.map(s => Number(s.hackNumber) || 0)) + 1 : 1;
    setSeriesFormHackNum(nextNum);
    setSeriesFormTitle(`Tech Hack Part ${nextNum}`);
    setSeriesFormYoutubeUrl('');
    setSeriesFormDescription(`Tech Hacks : You Didn't Know You Needed - Part ${nextNum} by @MadeByParv`);
    setSeriesFormError('');
    setIsSeriesFormOpen(true);
  };

  const openEditSeriesForm = (item: SeriesEpisode) => {
    setEditingSeriesId(item.id);
    setSeriesFormHackNum(item.hackNumber);
    setSeriesFormTitle(item.title);
    setSeriesFormYoutubeUrl(item.youtubeUrl);
    setSeriesFormDescription(item.description || '');
    setSeriesFormError('');
    setIsSeriesFormOpen(true);
  };

  const handleSaveSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    setSeriesFormError('');

    if (!seriesFormYoutubeUrl.trim()) {
      setSeriesFormError('YouTube URL is required.');
      return;
    }

    const token = localStorage.getItem('mbp_admin_token');
    const payload = {
      hackNumber: Number(seriesFormHackNum) || series.length + 1,
      title: seriesFormTitle.trim() || `Tech Hack Part ${seriesFormHackNum}`,
      youtubeUrl: seriesFormYoutubeUrl.trim(),
      description: seriesFormDescription.trim(),
    };

    try {
      const url = editingSeriesId
        ? `/api/admin/series/${editingSeriesId}`
        : '/api/admin/series';
      const method = editingSeriesId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setIsSeriesFormOpen(false);
        fetchAdminSeries();
        fetchAdminStats(); // Update stats seriesCount
        showToast(editingSeriesId ? 'Series Part updated!' : 'New Series Part added!');
      } else {
        setSeriesFormError(data.error || 'Failed to save series part.');
      }
    } catch (err) {
      setSeriesFormError('Server error while saving series part.');
    }
  };

  const handleDeleteSeries = async (id: string) => {
    const token = localStorage.getItem('mbp_admin_token');
    try {
      const res = await fetch(`/api/admin/series/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setDeleteSeriesConfirmId(null);
        fetchAdminSeries();
        fetchAdminStats();
        showToast('Series Part deleted!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Filters for search
  const filteredLinks = links.filter(l =>
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.dmKeyword?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSeries = series.filter(s =>
    s.title.toLowerCase().includes(seriesSearchQuery.toLowerCase()) ||
    String(s.hackNumber).includes(seriesSearchQuery) ||
    (s.description && s.description.toLowerCase().includes(seriesSearchQuery.toLowerCase()))
  );

  const totalClicks = links.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
  const activeCount = links.filter(l => l.active).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] text-white flex items-center justify-center font-inter">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#00F0FF] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest text-white/60">Loading Admin...</span>
        </div>
      </div>
    );
  }

  // ── LOGIN SCREEN ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] text-white flex items-center justify-center p-4 font-inter">
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#B600A8]/20 border border-[#B600A8]/40 rounded-2xl">
                <Lock className="w-6 h-6 text-[#00F0FF]" />
              </div>
              <div>
                <h1 className="font-inter font-bold text-2xl uppercase tracking-wider text-white">Admin Login</h1>
                <p className="text-xs text-white/60">MadeByParv Dashboard</p>
              </div>
            </div>
            <button
              onClick={onBackToSite}
              className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-2 font-medium">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-4 py-3.5 rounded-2xl bg-black/60 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#00F0FF] transition-colors"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#B600A8] to-[#7621B0] hover:opacity-90 text-white text-xs font-semibold uppercase tracking-widest transition-all shadow-lg cursor-pointer"
            >
              Log In to Dashboard
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <button
              onClick={onBackToSite}
              className="text-xs text-white/60 hover:text-white transition-colors"
            >
              ← Back to Main Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── ADMIN DASHBOARD ──
  return (
    <div className="min-h-screen bg-[#0C0C0C] text-white font-inter pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl bg-[#00F0FF] text-black text-xs font-semibold shadow-2xl flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#0C0C0C]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToSite}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/80"
            title="Back to Site"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-inter font-bold text-xl sm:text-2xl text-white uppercase tracking-wider">
              Admin Dashboard
            </h1>
            <p className="text-[10px] text-white/60">Manage Links, Series &amp; Live Stats</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'links' && (
            <button
              onClick={openAddForm}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-black hover:bg-white/90 text-xs font-semibold uppercase tracking-wider shadow-lg cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Link</span>
              <span className="sm:hidden">Link</span>
            </button>
          )}

          {activeTab === 'series' && (
            <button
              onClick={openAddSeriesForm}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FF0000] text-white hover:bg-red-600 text-xs font-semibold uppercase tracking-wider shadow-lg cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Series Part</span>
              <span className="sm:hidden">Part</span>
            </button>
          )}

          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-white/60 border border-white/10 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Content Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-6">

        {/* ── TAB SWITCHER (LINKS vs SERIES vs STATS COUNTERS) ── */}
        <div className="flex items-center p-1.5 rounded-2xl bg-white/5 border border-white/10 gap-1.5 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setActiveTab('links')}
            className={`flex-1 py-3 px-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'links'
                ? 'bg-gradient-to-r from-[#B600A8] to-[#7621B0] text-white shadow-lg'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Links ({links.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('series')}
            className={`flex-1 py-3 px-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'series'
                ? 'bg-red-600 text-white shadow-lg'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Youtube className="w-4 h-4 text-[#FF0000]" />
            <span>Series ({series.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-3 px-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-gradient-to-r from-[#00F0FF] to-[#00A8FF] text-black shadow-lg font-bold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Live Counters</span>
          </button>
        </div>

        {/* ══════════════════════════════════════
           TAB 1: LINKS & DM RESOURCES
           ══════════════════════════════════════ */}
        {activeTab === 'links' && (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-white/50">Total Links</span>
                <span className="text-2xl sm:text-3xl font-bold font-podium text-white mt-1">{links.length}</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-white/50">Active</span>
                <span className="text-2xl sm:text-3xl font-bold font-podium text-[#00F0FF] mt-1">{activeCount}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#18011F]/60 border border-[#B600A8]/40 flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-[#00F0FF] flex items-center gap-1">
                  <BarChart2 className="w-3 h-3" />
                  Total Clicks
                </span>
                <span className="text-2xl sm:text-3xl font-bold font-podium text-white mt-1">{totalClicks}</span>
              </div>
            </div>

            {/* Search & Add Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search links, DM keywords..."
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#00F0FF]"
                />
              </div>
              <button
                onClick={openAddForm}
                className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#B600A8] to-[#7621B0] text-white text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add New Link</span>
              </button>
            </div>

            {/* Home Screen Shortcut Tip Card */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-white/70">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-[#00F0FF] shrink-0" />
                <span>Tip: Bookmark this URL on your phone or tap "Add to Home Screen" to open as a private app!</span>
              </div>
            </div>

            {/* Links List Header */}
            <div className="flex items-center justify-between pt-2">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white/80">
                Live Link Queue ({filteredLinks.length})
              </h2>
              <span className="text-[11px] text-white/40">Use ▲ ▼ to reorder</span>
            </div>

            {/* Link Cards List */}
            {filteredLinks.length === 0 ? (
              <div className="p-8 text-center bg-white/5 rounded-3xl border border-white/10 text-white/50 text-xs flex flex-col items-center gap-3">
                <span>No links found in queue.</span>
                <button
                  onClick={openAddForm}
                  className="px-5 py-2.5 rounded-xl bg-white text-black text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  + Create First Link
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLinks.map((link, idx) => (
                  <div
                    key={link.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      link.active
                        ? 'bg-white/5 border-white/10 hover:border-white/20'
                        : 'bg-black/40 border-white/5 opacity-60'
                    }`}
                  >
                    {/* Left Info */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Reorder Buttons */}
                      <div className="flex flex-col gap-1 shrink-0 pt-0.5">
                        <button
                          onClick={() => handleMove(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-20 text-white/80"
                          title="Move Up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMove(idx, 'down')}
                          disabled={idx === links.length - 1}
                          className="p-1 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-20 text-white/80"
                          title="Move Down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Image thumbnail */}
                      {link.previewImage ? (
                        <img
                          src={link.previewImage}
                          alt={link.title}
                          className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 text-white/40">
                          <Globe className="w-5 h-5" />
                        </div>
                      )}

                      {/* Title & Metadata */}
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full bg-[#B600A8]/30 border border-[#B600A8]/50 text-[#00F0FF] text-[9px] font-semibold uppercase">
                            {link.label}
                          </span>
                          {link.category && (
                            <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/70 text-[9px] uppercase">
                              {link.category}
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase ${
                            link.active ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                          }`}>
                            {link.active ? 'Active' : 'Paused'}
                          </span>
                        </div>

                        <h3 className="text-sm font-semibold text-white truncate mt-1">
                          {link.title}
                        </h3>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#00F0FF] hover:underline truncate max-w-xs"
                        >
                          {link.url}
                        </a>
                      </div>
                    </div>

                    {/* Right Controls: Clicks + Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10">
                      {/* Click Badge */}
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70">
                        <BarChart2 className="w-3.5 h-3.5 text-[#00F0FF]" />
                        <span>{link.clicks || 0} clicks</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleActive(link.id)}
                          className={`p-2.5 rounded-xl border transition-colors ${
                            link.active
                              ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20'
                              : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                          }`}
                          title={link.active ? 'Pause Link' : 'Activate Link'}
                        >
                          {link.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => openEditForm(link)}
                          className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/15 text-white/80 hover:text-white cursor-pointer"
                          title="Edit Link"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(link.id)}
                          className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 cursor-pointer"
                          title="Delete Link"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ══════════════════════════════════════
           TAB 2: SERIES PARTS (TECH HACKS EPISODES)
           ══════════════════════════════════════ */}
        {activeTab === 'series' && (
          <>
            {/* Series Header Stats & Add */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-red-950/40 via-[#0C0C0C] to-black border border-red-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-red-600/20 border border-red-500/40 text-[#FF0000]">
                  <Film className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                      Tech Hacks Series
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#00F0FF]/20 border border-[#00F0FF]/40 text-[#00F0FF] text-[10px] font-bold uppercase">
                      {series.length} Parts Total
                    </span>
                  </div>
                  <p className="text-xs text-white/60 mt-0.5">
                    Add unlimited YouTube Shorts or Video episodes to your Series Modal!
                  </p>
                </div>
              </div>

              <button
                onClick={openAddSeriesForm}
                className="py-3 px-5 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Series Part</span>
              </button>
            </div>

            {/* Search Bar for Series */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={seriesSearchQuery}
                onChange={e => setSeriesSearchQuery(e.target.value)}
                placeholder="Search Tech Hack parts by title, part number, description..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#FF0000]"
              />
            </div>

            {/* Series Parts List */}
            {filteredSeries.length === 0 ? (
              <div className="p-8 text-center bg-white/5 rounded-3xl border border-white/10 text-white/50 text-xs flex flex-col items-center gap-3">
                <span>No series parts found.</span>
                <button
                  onClick={openAddSeriesForm}
                  className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  + Add First Series Part
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSeries.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-all flex flex-col justify-between gap-3"
                  >
                    <div>
                      {/* Top Header Row */}
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/10">
                        <span className="px-2.5 py-0.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                          PART {item.hackNumber}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditSeriesForm(item)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/80 hover:text-white cursor-pointer"
                            title="Edit Series Part"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteSeriesConfirmId(item.id)}
                            className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 cursor-pointer"
                            title="Delete Series Part"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-sm font-bold text-white mt-2">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-white/60 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Footer YouTube Link */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      <a
                        href={item.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#FF0000] hover:underline truncate max-w-[240px] flex items-center gap-1.5"
                      >
                        <Youtube className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{item.youtubeUrl}</span>
                      </a>

                      <span className="text-[10px] text-white/40 uppercase">
                        ID: {item.id}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ══════════════════════════════════════
           TAB 3: LIVE STATS & COUNTERS MANAGER
           ══════════════════════════════════════ */}
        {activeTab === 'stats' && (
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="p-3 rounded-2xl bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF]">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                  Live Stats &amp; Counter Settings
                </h2>
                <p className="text-xs text-white/60 mt-0.5">
                  Edit your website counters (Instagram, YouTube, Series goal) in real-time!
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveStats} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Instagram Fam Counter */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-[#FF007A] font-bold flex items-center gap-1.5">
                    <span>Instagram Followers (Insta Fam)</span>
                  </label>
                  <input
                    type="number"
                    value={statsForm.instaFam}
                    onChange={e => setStatsForm({ ...statsForm, instaFam: Number(e.target.value) })}
                    placeholder="125"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-base font-bold focus:outline-none focus:border-[#FF007A]"
                    required
                  />
                  <span className="text-[10px] text-white/40 block">
                    Website counter will roll live from 10 numbers back ({Math.max(0, statsForm.instaFam - 10)} → {statsForm.instaFam}+)!
                  </span>
                </div>

                {/* YouTube Subscribers Counter */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-[#FF0000] font-bold flex items-center gap-1.5">
                    <span>YouTube Subscribers</span>
                  </label>
                  <input
                    type="number"
                    value={statsForm.youtubeSubs}
                    onChange={e => setStatsForm({ ...statsForm, youtubeSubs: Number(e.target.value) })}
                    placeholder="555"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-base font-bold focus:outline-none focus:border-[#FF0000]"
                    required
                  />
                  <span className="text-[10px] text-white/40 block">
                    Website counter will roll live from 10 numbers back ({Math.max(0, statsForm.youtubeSubs - 10)} → {statsForm.youtubeSubs}+)!
                  </span>
                </div>

                {/* Tech Hacks Current Parts */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-[#00F0FF] font-bold flex items-center gap-1.5">
                    <span>Tech Hacks Current Parts ({series.length} auto-synced)</span>
                  </label>
                  <input
                    type="number"
                    value={statsForm.seriesCount}
                    onChange={e => setStatsForm({ ...statsForm, seriesCount: Number(e.target.value) })}
                    placeholder="8"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-base font-bold focus:outline-none focus:border-[#00F0FF]"
                    required
                  />
                  <span className="text-[10px] text-white/40 block">
                    Display count (0 → {statsForm.seriesCount}/{statsForm.seriesTotal})
                  </span>
                </div>

                {/* Tech Hacks Series Goal */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-white/70 font-bold flex items-center gap-1.5">
                    <span>Tech Hacks Series Goal</span>
                  </label>
                  <input
                    type="number"
                    value={statsForm.seriesTotal}
                    onChange={e => setStatsForm({ ...statsForm, seriesTotal: Number(e.target.value) })}
                    placeholder="100"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-base font-bold focus:outline-none focus:border-white/40"
                    required
                  />
                  <span className="text-[10px] text-white/40 block">
                    Goal target (e.g. 100 parts)
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingStats}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#00F0FF] to-[#00A8FF] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl hover:opacity-90 transition-all cursor-pointer"
                >
                  {isSavingStats ? (
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Save Counters &amp; Live Stats</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

      {/* ── FLOATING MOBILE ACTION BUTTON (FAB) ── */}
      {activeTab !== 'stats' && (
        <button
          onClick={activeTab === 'links' ? openAddForm : openAddSeriesForm}
          className={`fixed bottom-6 right-6 z-40 p-4 rounded-full font-bold shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer ${
            activeTab === 'links'
              ? 'bg-gradient-to-r from-[#B600A8] to-[#00F0FF] text-black'
              : 'bg-red-600 text-white'
          }`}
          title={activeTab === 'links' ? 'Add Link' : 'Add Series Part'}
        >
          <Plus className="w-6 h-6 stroke-[3]" />
          <span className="text-xs uppercase font-podium tracking-wider pr-1">
            {activeTab === 'links' ? 'Add Link' : 'Add Part'}
          </span>
        </button>
      )}

      {/* ── ADD / EDIT LINK FORM MODAL ── */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="w-full max-w-lg bg-[#0C0C0C] border border-white/20 rounded-3xl p-6 sm:p-8 space-y-5 my-auto shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="font-podium text-2xl uppercase tracking-wider text-white">
                {editingId ? 'Edit Link' : 'Add New Link'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {duplicateWarning && (
              <div className="p-3 rounded-xl bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Warning: This URL is already in your link list.</span>
              </div>
            )}

            <form onSubmit={handleSaveLink} className="space-y-4 text-xs">
              {/* URL Input & Auto-Fetch Button */}
              <div>
                <label className="block uppercase tracking-wider text-white/70 mb-1.5 font-medium">
                  Destination URL *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formUrl}
                    onChange={e => handleUrlChange(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#00F0FF]"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleAutoFetchMeta}
                    disabled={isFetchingMeta}
                    className="px-3.5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-medium tracking-wider uppercase transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                  >
                    {isFetchingMeta ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
                    )}
                    <span>Auto-Fetch</span>
                  </button>
                </div>
              </div>

              {/* Title / Label */}
              <div>
                <label className="block uppercase tracking-wider text-white/70 mb-1.5 font-medium">
                  Link Title / Label *
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="e.g. Top 50 AI Prompts Starter Kit"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#00F0FF]"
                  required
                />
              </div>

              {/* DM Keyword & Tag */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider text-white/70 mb-1.5 font-medium">
                    DM Keyword (Instagram)
                  </label>
                  <input
                    type="text"
                    value={formDmKeyword}
                    onChange={e => setFormDmKeyword(e.target.value)}
                    placeholder="e.g. PROMPT"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-white/70 mb-1.5 font-medium">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#18011F] border border-white/15 text-white text-xs focus:outline-none focus:border-[#00F0FF]"
                  >
                    <option value="Free Resource">Free Resource</option>
                    <option value="Guide">Guide</option>
                    <option value="Course">Course</option>
                    <option value="Toolkit">Toolkit</option>
                    <option value="Software">Software</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block uppercase tracking-wider text-white/70 mb-1.5 font-medium">
                  Short Description
                </label>
                <textarea
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Short summary of what users get when they click/DM..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#00F0FF] resize-none"
                />
              </div>

              {/* Thumbnail Image URL */}
              <div>
                <label className="block uppercase tracking-wider text-white/70 mb-1.5 font-medium">
                  Preview Image URL (Optional)
                </label>
                <input
                  type="text"
                  value={formPreviewImage}
                  onChange={e => setFormPreviewImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-medium tracking-wider uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#B600A8] to-[#7621B0] hover:opacity-90 text-white text-xs font-semibold tracking-widest uppercase shadow-lg cursor-pointer"
                >
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ADD / EDIT SERIES PART FORM MODAL ── */}
      {isSeriesFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="w-full max-w-lg bg-[#0C0C0C] border border-red-500/30 rounded-3xl p-6 sm:p-8 space-y-5 my-auto shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-red-600/20 text-[#FF0000]">
                  <Youtube className="w-5 h-5" />
                </div>
                <h3 className="font-podium text-xl uppercase tracking-wider text-white">
                  {editingSeriesId ? 'Edit Series Part' : 'Add New Series Part'}
                </h3>
              </div>
              <button
                onClick={() => setIsSeriesFormOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {seriesFormError && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{seriesFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveSeries} className="space-y-4 text-xs">
              {/* Part Number & Title */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block uppercase tracking-wider text-white/70 mb-1.5 font-medium">
                    Part Number *
                  </label>
                  <input
                    type="number"
                    value={seriesFormHackNum}
                    onChange={e => {
                      const num = e.target.value;
                      setSeriesFormHackNum(num);
                      if (!editingSeriesId) {
                        setSeriesFormTitle(`Tech Hack Part ${num}`);
                      }
                    }}
                    placeholder="9"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FF0000]"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block uppercase tracking-wider text-white/70 mb-1.5 font-medium">
                    Part Title *
                  </label>
                  <input
                    type="text"
                    value={seriesFormTitle}
                    onChange={e => setSeriesFormTitle(e.target.value)}
                    placeholder="e.g. Tech Hack Part 9"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#FF0000]"
                    required
                  />
                </div>
              </div>

              {/* YouTube Video / Shorts URL */}
              <div>
                <label className="block uppercase tracking-wider text-white/70 mb-1.5 font-medium">
                  YouTube Shorts / Video URL *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={seriesFormYoutubeUrl}
                    onChange={e => setSeriesFormYoutubeUrl(e.target.value)}
                    placeholder="https://youtube.com/shorts/... or https://youtu.be/..."
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#FF0000]"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleAutoFetchSeriesMeta}
                    disabled={isFetchingSeriesMeta}
                    className="px-3.5 py-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-white text-[11px] font-medium tracking-wider uppercase transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                  >
                    {isFetchingSeriesMeta ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-[#FF0000]" />
                    )}
                    <span>Auto-Fetch</span>
                  </button>
                </div>
                <span className="text-[10px] text-white/40 mt-1 block">
                  Paste YouTube link &amp; click Auto-Fetch to automatically pull Title &amp; Description!
                </span>
              </div>

              {/* Description */}
              <div>
                <label className="block uppercase tracking-wider text-white/70 mb-1.5 font-medium">
                  Part Description
                </label>
                <textarea
                  value={seriesFormDescription}
                  onChange={e => setSeriesFormDescription(e.target.value)}
                  placeholder="Tech Hacks : You Didn't Know You Needed..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#FF0000] resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSeriesFormOpen(false)}
                  className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-medium tracking-wider uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold tracking-widest uppercase shadow-lg cursor-pointer"
                >
                  Save Series Part
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE LINK CONFIRMATION MODAL ── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm bg-[#0C0C0C] border border-red-500/40 rounded-3xl p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-podium text-xl uppercase tracking-wider text-white">Delete Link?</h3>
            <p className="text-xs text-white/60">
              Are you sure you want to permanently delete this link? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase tracking-wider shadow-lg cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE SERIES CONFIRMATION MODAL ── */}
      {deleteSeriesConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm bg-[#0C0C0C] border border-red-500/40 rounded-3xl p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-podium text-xl uppercase tracking-wider text-white">Delete Series Part?</h3>
            <p className="text-xs text-white/60">
              Are you sure you want to delete this episode/part from your Tech Hacks series?
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteSeriesConfirmId(null)}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteSeries(deleteSeriesConfirmId)}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase tracking-wider shadow-lg cursor-pointer"
              >
                Delete Part
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
