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
    id: 'link-1785701458370',
    title: 'Claude AI Chat',
    label: 'Link',
    dmKeyword: '',
    description: 'Claude AI Chat Assistant',
    url: 'https://claude.ai/chat/eef2e3f7-6160-445f-ac60-2410a9094a2b',
    category: 'Free Resource',
  },
];
