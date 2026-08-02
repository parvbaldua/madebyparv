import React, { useState, useEffect } from 'react';
import { X, Play, Instagram, Youtube, Sparkles, ExternalLink, Grid, Flame, Bookmark, MessageSquare } from 'lucide-react';

export interface SeriesEpisode {
  id: string;
  episodeNumber: number;
  title: string;
  platform: 'instagram' | 'youtube';
  reelUrl: string;
  thumbnailUrl: string;
  viewsCount?: string;
  description: string;
  dmKeyword?: string;
}

const DEFAULT_EPISODES: SeriesEpisode[] = [
  {
    id: 'ep-8',
    episodeNumber: 8,
    title: 'Automate 90% of Content with AI',
    platform: 'instagram',
    reelUrl: 'https://www.instagram.com/madebyparv',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    viewsCount: '24.5K',
    description: 'Generate 30 days of social posts in 10 minutes using ChatGPT + Canva bulk create.',
    dmKeyword: 'AUTOMATE',
  },
  {
    id: 'ep-7',
    episodeNumber: 7,
    title: 'Secret Midjourney V6 Prompting Hack',
    platform: 'instagram',
    reelUrl: 'https://www.instagram.com/madebyparv',
    thumbnailUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80',
    viewsCount: '18.9K',
    description: 'Unlock photorealistic 8K image quality with hidden stylize parameters.',
    dmKeyword: 'PROMPT',
  },
  {
    id: 'ep-6',
    episodeNumber: 6,
    title: 'Free AI Voice Cloning for Reels',
    platform: 'instagram',
    reelUrl: 'https://www.instagram.com/madebyparv',
    thumbnailUrl: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=600&auto=format&fit=crop&q=80',
    viewsCount: '31.2K',
    description: 'Clone your voice for free using ElevenLabs in under 2 minutes.',
    dmKeyword: 'VOICE',
  },
  {
    id: 'ep-5',
    episodeNumber: 5,
    title: 'Build AI Agents Without Coding',
    platform: 'instagram',
    reelUrl: 'https://www.instagram.com/madebyparv',
    thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80',
    viewsCount: '15.4K',
    description: 'Create custom GPT web scrapers in Zapier Central.',
    dmKeyword: 'AGENTS',
  },
  {
    id: 'ep-4',
    episodeNumber: 4,
    title: 'Turn Any PDF Into AI Audio Podcast',
    platform: 'youtube',
    reelUrl: 'https://www.youtube.com/@MadeByParv',
    thumbnailUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80',
    viewsCount: '42.1K',
    description: 'Use NotebookLM to turn 50-page research documents into 2-host audio discussions.',
    dmKeyword: 'PODCAST',
  },
  {
    id: 'ep-3',
    episodeNumber: 3,
    title: 'High-Converting AI Thumbnail Formula',
    platform: 'instagram',
    reelUrl: 'https://www.instagram.com/madebyparv',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    viewsCount: '27.8K',
    description: 'Create 10M+ view YouTube thumbnails with FLUX AI model.',
    dmKeyword: 'THUMBNAIL',
  },
  {
    id: 'ep-2',
    episodeNumber: 2,
    title: 'Auto-Generate Subtitles & Captions',
    platform: 'instagram',
    reelUrl: 'https://www.instagram.com/madebyparv',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80',
    viewsCount: '19.3K',
    description: 'Animated viral captions like Alex Hormozi in 1-click.',
    dmKeyword: 'CAPTIONS',
  },
  {
    id: 'ep-1',
    episodeNumber: 1,
    title: 'Top 5 Essential AI Tools for 2026',
    platform: 'instagram',
    reelUrl: 'https://www.instagram.com/madebyparv',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    viewsCount: '53.6K',
    description: 'The exact AI stack we use to run MadeByParv agency.',
    dmKeyword: 'TOOLS',
  },
];

interface SeriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SeriesModal: React.FC<SeriesModalProps> = ({ isOpen, onClose }) => {
  const [episodes, setEpisodes] = useState<SeriesEpisode[]>(DEFAULT_EPISODES);
  const [selectedEpisode, setSelectedEpisode] = useState<SeriesEpisode | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'reels' | 'youtube'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      fetchSeriesEpisodes();
    }
  }, [isOpen]);

  const fetchSeriesEpisodes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/series');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.episodes) && data.episodes.length > 0) {
          setEpisodes(data.episodes);
        }
      }
    } catch (e) {
      console.warn('Using default series fallback', e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredEpisodes = activeTab === 'all'
    ? episodes
    : episodes.filter(e => e.platform === (activeTab === 'reels' ? 'instagram' : 'youtube'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 animate-fade-in font-inter">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Modal Card (Instagram Profile Layout) */}
      <div className="relative z-10 w-full max-w-4xl max-h-[92vh] bg-[#0C0C0C] border border-white/20 rounded-3xl p-4 sm:p-7 flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <Instagram className="w-5 h-5 text-[#FF007A]" />
            <span className="font-podium text-lg sm:text-xl text-white uppercase tracking-wider">
              @madebyparv
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto pt-5 space-y-6 pr-1">

          {/* Instagram Profile Header Card */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 rounded-2xl bg-white/5 border border-white/10">
            {/* Avatar with IG Story Ring Gradient */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[3px] bg-gradient-to-tr from-[#FFB800] via-[#FF007A] to-[#B600A8] shadow-lg">
                <img
                  src="/logo-monogram.png"
                  alt="MadeByParv Avatar"
                  className="w-full h-full rounded-full object-cover bg-black p-1"
                />
              </div>
              <span className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#00F0FF] text-black text-[10px] font-bold">
                <Flame className="w-3.5 h-3.5 fill-black" />
              </span>
            </div>

            {/* Profile Bio & Counter Stats */}
            <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left gap-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h3 className="font-podium text-2xl uppercase tracking-wider text-white">
                  100 Tech Hacks Series
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#00F0FF]/20 border border-[#00F0FF]/40 text-[#00F0FF] text-[10px] font-bold uppercase tracking-wider">
                  8 / 100 Done
                </span>
              </div>

              <p className="text-xs text-white/70 max-w-lg leading-relaxed font-inter">
                Bite-sized AI hacks, prompt engineering secret formulas &amp; automation workflows. 
                <span className="text-[#00F0FF] font-semibold"> New hack released weekly!</span>
              </p>

              {/* Stats Bar */}
              <div className="flex items-center gap-6 pt-1 text-xs">
                <div>
                  <span className="font-bold text-white text-sm">{episodes.length}</span>{' '}
                  <span className="text-white/50">Episodes</span>
                </div>
                <div>
                  <span className="font-bold text-[#00F0FF] text-sm">125K+</span>{' '}
                  <span className="text-white/50">Reels Views</span>
                </div>
                <div>
                  <span className="font-bold text-[#FF007A] text-sm">100%</span>{' '}
                  <span className="text-white/50">Practical</span>
                </div>
              </div>
            </div>
          </div>

          {/* Instagram Tab Selector */}
          <div className="flex items-center justify-center border-b border-white/10 text-xs font-semibold uppercase tracking-widest gap-8 pt-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'border-white text-white font-bold'
                  : 'border-transparent text-white/40 hover:text-white/80'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>REELS GRID ({episodes.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('reels')}
              className={`pb-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'reels'
                  ? 'border-[#FF007A] text-[#FF007A] font-bold'
                  : 'border-transparent text-white/40 hover:text-white/80'
              }`}
            >
              <Instagram className="w-4 h-4" />
              <span>INSTAGRAM</span>
            </button>

            <button
              onClick={() => setActiveTab('youtube')}
              className={`pb-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'youtube'
                  ? 'border-[#FF0000] text-[#FF0000] font-bold'
                  : 'border-transparent text-white/40 hover:text-white/80'
              }`}
            >
              <Youtube className="w-4 h-4" />
              <span>YOUTUBE</span>
            </button>
          </div>

          {/* ── INSTAGRAM REELS 3-COLUMN CARD GRID ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 pb-4">
            {filteredEpisodes.map((ep) => (
              <div
                key={ep.id}
                onClick={() => setSelectedEpisode(ep)}
                className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-[#00F0FF]/60 transition-all shadow-lg cursor-pointer flex flex-col justify-between"
              >
                {/* Thumbnail Image */}
                <img
                  src={ep.thumbnailUrl}
                  alt={ep.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40 group-hover:from-black/95 transition-opacity" />

                {/* Top Badge: Episode Number + Platform Icon */}
                <div className="relative z-10 p-3 flex items-center justify-between">
                  <span className="px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/20 text-[#00F0FF] text-[10px] font-podium font-bold uppercase tracking-wider">
                    #{ep.episodeNumber}
                  </span>
                  <div className="p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white/80">
                    {ep.platform === 'instagram' ? (
                      <Instagram className="w-3.5 h-3.5 text-[#FF007A]" />
                    ) : (
                      <Youtube className="w-3.5 h-3.5 text-[#FF0000]" />
                    )}
                  </div>
                </div>

                {/* Bottom Overlay: Title & Views Count */}
                <div className="relative z-10 p-3 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] text-white/70">
                    <Play className="w-3 h-3 fill-white text-white" />
                    <span className="font-semibold">{ep.viewsCount || '10K+'}</span>
                  </div>

                  <h4 className="text-xs font-semibold text-white line-clamp-2 leading-snug font-inter group-hover:text-[#00F0FF] transition-colors">
                    {ep.title}
                  </h4>

                  {ep.dmKeyword && (
                    <div className="pt-1">
                      <span className="px-2 py-0.5 rounded-full bg-[#B600A8]/40 border border-[#B600A8]/60 text-[#00F0FF] text-[9px] font-semibold uppercase tracking-wider block text-center truncate">
                        DM "{ep.dmKeyword}"
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/40 shrink-0">
          <span>{filteredEpisodes.length} Episodes Published</span>
          <a
            href="https://www.instagram.com/madebyparv"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00F0FF] hover:underline flex items-center gap-1"
          >
            <span>Follow @madebyparv on Instagram</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* ── REEL / EPISODE PREVIEW MODAL ── */}
      {selectedEpisode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-fade-in">
          <div className="w-full max-w-md bg-[#0C0C0C] border border-white/20 rounded-3xl p-6 space-y-4 shadow-2xl relative text-center">
            <button
              onClick={() => setSelectedEpisode(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FF007A] to-[#B600A8] p-0.5 mx-auto flex items-center justify-center shadow-lg">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                {selectedEpisode.platform === 'instagram' ? (
                  <Instagram className="w-8 h-8 text-[#FF007A]" />
                ) : (
                  <Youtube className="w-8 h-8 text-[#FF0000]" />
                )}
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-[#00F0FF]/20 border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-bold font-podium uppercase tracking-wider inline-block">
              Episode #{selectedEpisode.episodeNumber}
            </span>

            <h3 className="font-podium text-xl uppercase tracking-wider text-white">
              {selectedEpisode.title}
            </h3>

            <p className="text-xs text-white/70 leading-relaxed">
              {selectedEpisode.description}
            </p>

            {selectedEpisode.dmKeyword && (
              <div className="p-3 rounded-2xl bg-[#18011F] border border-[#B600A8]/50 text-xs text-white/90 flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#00F0FF]" />
                <span>DM <strong className="text-[#00F0FF]">"{selectedEpisode.dmKeyword}"</strong> on Instagram to get free files</span>
              </div>
            )}

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setSelectedEpisode(null)}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium uppercase tracking-wider cursor-pointer"
              >
                Close
              </button>

              <a
                href={selectedEpisode.reelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#B600A8] to-[#FF007A] hover:opacity-90 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
              >
                <span>Watch Reel</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
