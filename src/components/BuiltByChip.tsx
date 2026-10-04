import { useState } from 'react';
import { contributors } from '../config/site';

function ContributorBadge({
  contributor,
}: {
  contributor: (typeof contributors)[number];
}) {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const tooltipId = `built-by-tooltip-${contributor.name.replace(/[^a-z\d-]/gi, '-')}`;

  return (
    <div className="t-built-by-group relative">
      <div className="inline-flex items-center gap-2 rounded-full bg-overlay/70 px-3 py-1.5 text-xs font-light text-on-overlay backdrop-blur-md">
        <a
          href={contributor.href}
          target="_blank"
          rel="noreferrer"
          className="t-avatar-item focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-overlay"
          aria-label={`Visit ${contributor.name} on ${contributor.platform}`}
          aria-describedby={tooltipId}
          onPointerEnter={() => setIsTooltipVisible(true)}
          onPointerLeave={() => setIsTooltipVisible(false)}
          onFocus={() => setIsTooltipVisible(true)}
          onBlur={() => setIsTooltipVisible(false)}
        >
          <img
            src={contributor.avatar}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-6 rounded-full object-cover"
          />
          <span
            id={tooltipId}
            role="tooltip"
            aria-hidden={!isTooltipVisible}
            className="t-built-by-tooltip"
          >
            {contributor.name}
          </span>
        </a>
        <span>Built by {contributor.displayName}</span>
      </div>
    </div>
  );
}

export function BuiltByChip() {
  return (
    <div className="flex items-center gap-2">
      {contributors.map((contributor) => (
        <ContributorBadge key={contributor.name} contributor={contributor} />
      ))}
    </div>
  );
}
