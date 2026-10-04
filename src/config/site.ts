export const xLink = {
  label: 'X',
  href: 'https://x.com/photonbrowser',
  external: true,
  icon: 'x',
} as const;

export const siteLinks = [{ label: 'FAQ', href: '#faq' }, xLink] as const;

export type Contributor = {
  name: string;
  displayName: string;
  href?: string;
  avatar?: string;
  platform?: string;
};

export const contributors: readonly Contributor[] = [
  {
    name: '@theo_slat',
    displayName: 'Theo',
    href: 'https://x.com/theo_slat',
    avatar: 'https://unavatar.io/x/theo_slat',
    platform: 'x',
  },
  {
    name: '@ollie',
    displayName: 'Ollie',
  },
];
