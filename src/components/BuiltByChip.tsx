import { type CSSProperties, useState } from 'react';
import { contributors } from '../config/site';

type AvatarStyle = CSSProperties & {
  '--shift'?: string;
  '--scale-active'?: string;
};

export function BuiltByChip() {
  const [activeAvatar, setActiveAvatar] = useState<number | null>(null);

  return (
    <div
      className="t-built-by-group t-avatar-group relative"
      onPointerLeave={() => setActiveAvatar(null)}
    >
      <div className="t-built-by inline-flex items-center gap-2 rounded-full bg-overlay px-3 py-1 text-xs font-light text-on-overlay">
        <span>Built by</span>
        <span className="t-built-by-avatars">
          {contributors.map((contributor, index) => (
            <a
              key={contributor.name}
              href={contributor.href}
              target="_blank"
              rel="noreferrer"
              aria-label={contributor.name}
              className="t-avatar-item focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-overlay"
              onPointerEnter={() => setActiveAvatar(index)}
              onFocus={() => setActiveAvatar(index)}
              onBlur={() => setActiveAvatar(null)}
            >
              <img
                src={contributor.avatar}
                alt=""
                loading="lazy"
                decoding="async"
                className="t-avatar t-built-by-avatar t-built-by-avatar-primary"
                style={
                  {
                    '--shift': activeAvatar === index ? '-4px' : '0px',
                    '--scale-active': activeAvatar === index ? '1.05' : '1',
                    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                  } as AvatarStyle
                }
              />
              <span
                id={`built-by-tooltip-${index}`}
                role="tooltip"
                aria-hidden={activeAvatar !== index}
                className="t-built-by-tooltip"
              >
                {contributor.name}
              </span>
            </a>
          ))}
        </span>
      </div>
    </div>
  );
}
