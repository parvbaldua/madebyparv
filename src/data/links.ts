export type QuickLink = {
  id: string;
  title: string;
  label: string;
  dmKeyword?: string;
  description: string;
  url: string;
  previewImage?: string;
  category?: string;
  badge?: string;
};

export const QUICK_LINKS: QuickLink[] = [
  {
    id: '1',
    title: 'Top 50 AI Prompts Starter Kit',
    label: 'DM "PROMPT"',
    dmKeyword: 'PROMPT',
    description: 'The exact prompt templates used to build viral content and automate daily workflows.',
    url: 'https://www.youtube.com/@MadeByParv',
    previewImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    category: 'Free Resource',
    badge: 'Popular',
  },
  {
    id: '2',
    title: 'Tech Hacks & AI Workflows Guide',
    label: 'DM "HACKS"',
    dmKeyword: 'HACKS',
    description: 'Step-by-step breakdown of hidden AI features and digital productivity tools.',
    url: 'https://www.instagram.com',
    previewImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80',
    category: 'Guide',
    badge: 'New',
  },
  {
    id: '3',
    title: 'AI Video & Cinematic Creation Masterclass',
    label: 'DM "VIDEO"',
    dmKeyword: 'VIDEO',
    description: 'Learn how to generate cinematic AI visuals and consistent video characters.',
    url: 'https://www.youtube.com/@MadeByParv',
    previewImage: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600&auto=format&fit=crop&q=80',
    category: 'Course',
    badge: 'Featured',
  },
  {
    id: '4',
    title: 'Automated Creator Suite & Tools',
    label: 'DM "TOOLS"',
    dmKeyword: 'TOOLS',
    description: 'Curated list of the best AI software for short-form video and automation.',
    url: 'https://www.youtube.com/@MadeByParv',
    previewImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    category: 'Toolkit',
  },
];
