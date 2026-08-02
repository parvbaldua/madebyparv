import React, { useState, useEffect } from 'react';
import { X, ExternalLink, MessageSquare, Check, Sparkles, Plus } from 'lucide-react';
import { QUICK_LINKS, type QuickLink } from '../data/links';

interface LinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

export const LinksModal: React.FC<LinksModalProps> = ({ isOpen, onClose, onOpenAdmin }) => {
  const [links, setLinks] = useState<QuickLink[]>(QUICK_LINKS);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch live active links from database API whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      fetchLiveLinks();
    }
  }, [isOpen]);

  const fetchLiveLinks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/links');
      if (res.ok) {
        const data = await res.json();
        if (data.links && data.links.length > 0) {
          setLinks(data.links);
        }
      }
    } catch (err) {
      console.warn('Using local fallback links', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkClick = async (link: QuickLink) => {
    try {
      await fetch(`/api/links/${link.id}/click`, { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  const categories = ['All', ...Array.from(new Set(links.map(l => l.category || 'Other')))];

  const filteredLinks = selectedCategory === 'All'
    ? links
    : links.filter(l => l.category === selectedCategory);

  const handleCopyDm = (link: QuickLink) => {
    const textToCopy = link.dmKeyword ? `DM "${link.dmKeyword}"` : link.url;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(link.id);
    handleLinkClick(link);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-[#0C0C0C] border border-white/20 rounded-3xl p-6 sm:p-8 flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 border border-white/15">
              <Sparkles className="w-5 h-5 text-[#00F0FF]" />
            </div>
            <div>
              <h2 className="font-podium text-2xl sm:text-3xl text-white uppercase tracking-wider">
                Featured Links &amp; DM Resources
              </h2>
              <p className="text-xs text-white/60 font-inter">
                Direct resources, prompt kits, and keywords to DM on Instagram
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAdmin && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAdmin();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/40 text-[#00F0FF] hover:bg-[#00F0FF]/20 text-xs font-inter uppercase tracking-wider transition-colors cursor-pointer"
                title="Manage & Add Links in Admin"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add / Manage</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 py-4 overflow-x-auto shrink-0 border-b border-white/5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-inter uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-black font-semibold shadow-md'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Links Grid Container */}
        <div className="flex-1 overflow-y-auto pt-6 space-y-4 pr-1">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-white/40 font-inter">
              Loading latest links...
            </div>
          ) : filteredLinks.length === 0 ? (
            <div className="py-12 text-center text-xs text-white/40 font-inter">
              No links available in this category.
            </div>
          ) : (
            filteredLinks.map((link) => (
              <div
                key={link.id}
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/[0.08] transition-all"
              >
                {/* Left: Preview Image & Info */}
                <div className="flex items-start sm:items-center gap-4">
                  {link.previewImage && (
                    <img
                      src={link.previewImage}
                      alt={link.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-white/10 shrink-0"
                    />
                  )}

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#B600A8]/30 border border-[#B600A8]/50 text-[#00F0FF] text-[10px] font-semibold uppercase tracking-wider">
                        {link.label}
                      </span>
                      {link.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/80 text-[10px] font-medium uppercase tracking-wider">
                          {link.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-[#00F0FF] transition-colors font-inter">
                      {link.title}
                    </h3>

                    <p className="text-xs text-white/60 line-clamp-2 max-w-md font-inter">
                      {link.description}
                    </p>
                  </div>
                </div>

                {/* Right: Action Buttons */}
                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                  {link.dmKeyword && (
                    <button
                      onClick={() => handleCopyDm(link)}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-inter tracking-wider uppercase transition-colors cursor-pointer"
                    >
                      {copiedId === link.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-400" />
                          <span className="text-green-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <MessageSquare className="w-3.5 h-3.5 text-[#00F0FF]" />
                          <span>Copy Keyword</span>
                        </>
                      )}
                    </button>
                  )}

                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleLinkClick(link)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black hover:bg-white/90 text-xs font-semibold font-inter tracking-wider uppercase transition-colors"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/40 font-inter">
          <span>{filteredLinks.length} Active Links</span>
          <span>DM keywords directly on Instagram @MadeByParv</span>
        </div>
      </div>
    </div>
  );
};
