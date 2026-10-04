export const xLink = {
  label: 'X',
  href: 'https://x.com/photonbrowser',
  external: true,
  icon: 'x',
} as const;

export const siteLinks = [
  { label: 'About', href: '/about' },
  { label: 'Roadmap', href: '/roadmap' },
  { label: 'Privacy', href: '/privacy' },
  {
    label: 'GitHub',
    href: 'https://github.com/PhotonBrowser/landing',
    external: true,
  },
] as const;

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
];
