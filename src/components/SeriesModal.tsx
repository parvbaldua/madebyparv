import React, { useState, useEffect } from 'react';
import { X, Play, Instagram, Youtube, Sparkles, ExternalLink, Flame } from 'lucide-react';

export interface SeriesEpisode {
  id: string;
  episodeNumber: number;
  title: string;
  platform: 'instagram' | 'youtube' | 'video';
  embedUrl: string;
  videoUrl: string;
  thumbnailUrl?: string;
  description?: string;
  dmKeyword?: string;
}

const DEFAULT_EPISODES: SeriesEpisode[] = [
  {
    id: 'ep-8',
    episodeNumber: 8,
    title: 'Automate 90% of Your Daily Content with AI',
    platform: 'instagram',
    embedUrl: 'https://www.instagram.com/p/C-X812345/',
    videoUrl: 'https://www.instagram.com/madebyparv',
    description: 'Learn how to generate 30 days of social media posts in 10 minutes using ChatGPT + Canva bulk create.',
    dmKeyword: 'AUTOMATE',
  },
  {
    id: 'ep-7',
    episodeNumber: 7,
    title: 'Secret Midjourney V6 Prompting Hack',
    platform: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoUrl: 'https://www.youtube.com/@MadeByParv',
    description: 'Unlock photorealistic 8K image quality with hidden stylize parameters.',
    dmKeyword: 'PROMPT',
  },
  {
    id: 'ep-6',
    episodeNumber: 6,
    title: 'Free AI Voice Cloning Tutorial for Reels',
    platform: 'instagram',
    embedUrl: 'https://www.instagram.com/madebyparv',
    videoUrl: 'https://www.instagram.com/madebyparv',
    description: 'Clone your voice for free using ElevenLabs in under 2 minutes.',
    dmKeyword: 'VOICE',
  },
];

interface SeriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SeriesModal: React.FC<SeriesModalProps> = ({ isOpen, onClose }) => {
  const [episodes, setEpisodes] = useState<SeriesEpisode[]>(DEFAULT_EPISODES);
  const [activeEpisode, setActiveEpisode] = useState<SeriesEpisode | null>(DEFAULT_EPISODES[0]);
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
          setActiveEpisode(data.episodes[0]);
        }
      }
    } catch (e) {
      console.warn('Using default series episodes fallback', e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in font-inter">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Modal Container */}
      <div className="relative z-10 w-full max-w-5xl max-h-[92vh] bg-[#0C0C0C] border border-white/20 rounded-3xl p-5 sm:p-8 flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[#B600A8]/30 to-[#00F0FF]/30 border border-[#00F0FF]/40">
              <Flame className="w-5 h-5 text-[#00F0FF]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-podium text-2xl sm:text-3xl text-white uppercase tracking-wider">
                  100 Tech Hacks Series
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#00F0FF]/20 border border-[#00F0FF]/40 text-[#00F0FF] text-[10px] font-bold uppercase tracking-wider">
                  {episodes.length}/100 Done
                </span>
              </div>
              <p className="text-xs text-white/60">
                Bite-sized AI hacks &amp; automation tutorials by @MadeByParv
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Layout: Left Player / Embed & Right Episode Selector */}
        <div className="flex flex-col lg:flex-row gap-6 pt-6 overflow-y-auto flex-1 pr-1">
          
          {/* Main Featured Video / Embed Player */}
          {activeEpisode && (
            <div className="flex-1 flex flex-col gap-4 bg-white/5 border border-white/10 p-4 sm:p-5 rounded-2xl">
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/10 flex items-center justify-center">
                {activeEpisode.platform === 'youtube' && activeEpisode.embedUrl.includes('youtube.com/embed') ? (
                  <iframe
                    src={activeEpisode.embedUrl}
                    title={activeEpisode.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-[#FF007A]/20 border border-[#FF007A]/40 flex items-center justify-center text-[#FF007A]">
                      {activeEpisode.platform === 'instagram' ? (
                        <Instagram className="w-8 h-8" />
                      ) : (
                        <Youtube className="w-8 h-8" />
                      )}
                    </div>
                    <h4 className="text-base font-semibold text-white max-w-sm">
                      {activeEpisode.title}
                    </h4>
                    <a
                      href={activeEpisode.videoUrl || activeEpisode.embedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B600A8] to-[#FF007A] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer"
                    >
                      <span>Watch Episode #{activeEpisode.episodeNumber} on {activeEpisode.platform === 'instagram' ? 'Instagram' : 'YouTube'}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>

              {/* Episode Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#00F0FF] font-semibold uppercase tracking-wider">
                    Episode #{activeEpisode.episodeNumber}
                  </span>
                  {activeEpisode.dmKeyword && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#B600A8]/30 border border-[#B600A8]/50 text-[#00F0FF] text-[10px] font-semibold uppercase">
                      DM "{activeEpisode.dmKeyword}" on Insta
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white font-podium uppercase tracking-wide">
                  {activeEpisode.title}
                </h3>
                {activeEpisode.description && (
                  <p className="text-xs text-white/70 leading-relaxed font-inter">
                    {activeEpisode.description}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Episode Selection Sidebar */}
          <div className="w-full lg:w-80 flex flex-col gap-3 shrink-0">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/80 pb-1 border-b border-white/10 flex items-center justify-between">
              <span>All Episodes ({episodes.length})</span>
              <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
            </h4>

            <div className="space-y-2.5 overflow-y-auto max-h-[50vh] lg:max-h-[60vh] pr-1">
              {episodes.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => setActiveEpisode(ep)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                    activeEpisode?.id === ep.id
                      ? 'bg-white/15 border-[#00F0FF]/60 shadow-lg'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-xs font-bold font-podium text-[#00F0FF] shrink-0">
                    #{ep.episodeNumber}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[10px] uppercase tracking-wider text-white/50 flex items-center gap-1">
                      {ep.platform === 'instagram' ? (
                        <Instagram className="w-3 h-3 text-[#FF007A]" />
                      ) : (
                        <Youtube className="w-3 h-3 text-[#FF0000]" />
                      )}
                      <span>{ep.platform}</span>
                    </span>
                    <h5 className="text-xs font-semibold text-white truncate mt-0.5">
                      {ep.title}
                    </h5>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
          <span>New episodes added weekly</span>
          <a
            href="https://www.instagram.com/madebyparv"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00F0FF] hover:underline flex items-center gap-1"
          >
            <span>Follow @madebyparv on Insta</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
