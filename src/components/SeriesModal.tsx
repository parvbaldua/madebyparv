import React, { useState, useEffect } from 'react';
import { X, Youtube, ExternalLink, Sparkles, Play } from 'lucide-react';

export interface TechHackVideo {
  id: string;
  hackNumber: number;
  title: string;
  youtubeUrl: string;
  embedUrl: string;
  description?: string;
}

const DEFAULT_HACKS: TechHackVideo[] = [
  {
    id: 'hack-1',
    hackNumber: 1,
    title: 'Automate 90% of Your Daily Content with AI',
    youtubeUrl: 'https://www.youtube.com/@MadeByParv',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Generate 30 days of social posts in 10 minutes using ChatGPT + Canva bulk create.',
  },
  {
    id: 'hack-2',
    hackNumber: 2,
    title: 'Secret Midjourney V6 Prompting Hack',
    youtubeUrl: 'https://www.youtube.com/@MadeByParv',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Unlock photorealistic 8K image quality with hidden stylize parameters.',
  },
  {
    id: 'hack-3',
    hackNumber: 3,
    title: 'Turn Any PDF Into AI Audio Podcast',
    youtubeUrl: 'https://www.youtube.com/@MadeByParv',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Use NotebookLM to turn 50-page research documents into 2-host audio discussions.',
  },
];

interface SeriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SeriesModal: React.FC<SeriesModalProps> = ({ isOpen, onClose }) => {
  const [hacks, setHacks] = useState<TechHackVideo[]>(DEFAULT_HACKS);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      fetchHacks();
    }
  }, [isOpen]);

  const fetchHacks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/series');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.episodes) && data.episodes.length > 0) {
          setHacks(data.episodes);
        }
      }
    } catch (e) {
      console.warn('Using fallback hacks', e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 animate-fade-in font-inter">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Modal Card */}
      <div className="relative z-10 w-full max-w-5xl max-h-[90vh] bg-[#0C0C0C] border border-white/20 rounded-3xl p-5 sm:p-8 flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-white/10 shrink-0">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-red-600/20 border border-red-500/40 rounded-2xl shrink-0 mt-0.5">
              <Youtube className="w-6 h-6 text-[#FF0000]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-podium text-2xl sm:text-3xl text-white uppercase tracking-wider">
                  Tech Hacks : You Didn't Know You Needed
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#00F0FF]/20 border border-[#00F0FF]/40 text-[#00F0FF] text-[10px] font-bold uppercase tracking-wider">
                  {hacks.length} Hacks
                </span>
              </div>
              <p className="text-xs text-white/60 mt-1 font-inter">
                Practical YouTube Shorts &amp; AI Hacks by @MadeByParv
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* ── RESPONSIVE YOUTUBE VIDEO GRID (1 col mobile, 2 col tablet, 3 col desktop) ── */}
        <div className="flex-1 overflow-y-auto pt-6 pr-1">
          {isLoading ? (
            <div className="py-16 text-center text-xs text-white/40 font-inter">
              Loading Tech Hacks...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {hacks.map((hack, idx) => (
                <div
                  key={hack.id || idx}
                  className="group flex flex-col rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-white/[0.08] transition-all overflow-hidden shadow-lg"
                >
                  {/* YouTube Video Player Embed / Container */}
                  <div className="relative aspect-video w-full bg-black border-b border-white/10 overflow-hidden">
                    {hack.embedUrl && hack.embedUrl.includes('embed') ? (
                      <iframe
                        src={hack.embedUrl}
                        title={hack.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <a
                        href={hack.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-black to-neutral-900 group-hover:from-red-950/40 group-hover:to-black transition-colors"
                      >
                        <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 fill-white ml-0.5" />
                        </div>
                        <span className="text-xs text-white/80 font-semibold mt-3 flex items-center gap-1 group-hover:text-[#00F0FF]">
                          <span>Watch on YouTube</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </span>
                      </a>
                    )}
                  </div>

                  {/* Info Card Content */}
                  <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-[#FF0000] text-[10px] font-bold uppercase tracking-wider">
                          Hack #{hack.hackNumber || idx + 1}
                        </span>
                        <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
                      </div>

                      <h3 className="text-base font-semibold text-white group-hover:text-[#00F0FF] transition-colors font-inter line-clamp-2">
                        {hack.title}
                      </h3>

                      {hack.description && (
                        <p className="text-xs text-white/60 line-clamp-2 font-inter leading-relaxed">
                          {hack.description}
                        </p>
                      )}
                    </div>

                    <a
                      href={hack.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/10 hover:bg-red-600 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <Youtube className="w-4 h-4 text-red-500 group-hover:text-white" />
                      <span>Open YouTube</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/40 shrink-0">
          <span>{hacks.length} Tech Hacks Listed</span>
          <a
            href="https://www.youtube.com/@MadeByParv"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00F0FF] hover:underline flex items-center gap-1"
          >
            <span>Subscribe on YouTube @MadeByParv</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
