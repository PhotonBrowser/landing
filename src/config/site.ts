export const xLink = {
  label: 'X',
  href: 'https://x.com/photonbrowser',
  external: true,
  icon: 'x',
} as const;

export const siteLinks = [{ label: 'FAQ', href: '#faq' }, xLink] as const;

export const contributors = [
  {
    name: '@theo_slat',
    displayName: 'Theo',
    href: 'https://x.com/theo_slat',
    avatar: 'https://unavatar.io/x/theo_slat',
    platform: 'x',
  },
] as const;
