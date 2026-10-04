import { useRef } from 'react';
import { type Contributor, contributors } from '../config/site';

function ContributorAvatar({
  contributor,
  index,
  setShifts,
}: {
  contributor: Contributor;
  index: number;
  setShifts: (activeIndex: number, phase: 'in') => void;
}) {
  if (!contributor.avatar) return null;

  const label = contributor.href
    ? `Visit ${contributor.name} on ${contributor.platform ?? 'their profile'}`
    : contributor.name;

  const avatar = (
    <img
      src={contributor.avatar}
      alt=""
      loading="lazy"
      decoding="async"
      className="size-5 rounded-full object-cover"
    />
  );

  return (
    <li
      className="t-avatar t-avatar-item rounded-full"
      onPointerEnter={() => setShifts(index, 'in')}
    >
      {contributor.href ? (
        <a
          href={contributor.href}
          target="_blank"
          rel="noreferrer"
          className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label={label}
          onFocus={() => setShifts(index, 'in')}
        >
          {avatar}
        </a>
      ) : (
        <span
          role="img"
          aria-label={label}
          className="inline-flex rounded-full"
        >
          {avatar}
        </span>
      )}
      <span aria-hidden="true" className="t-built-by-tooltip">
        {contributor.name}
      </span>
    </li>
  );
}

export function BuiltByChip() {
  const groupRef = useRef<HTMLUListElement>(null);

  function setShifts(activeIndex: number | null, phase: 'in' | 'out') {
    const root = groupRef.current;
    if (!root) return;

    const computed = getComputedStyle(document.documentElement);
    const numberToken = (name: string, fallback: number) => {
      const value = Number.parseFloat(computed.getPropertyValue(name));
      return Number.isFinite(value) ? value : fallback;
    };
    const stringToken = (name: string, fallback: string) =>
      computed.getPropertyValue(name).trim() || fallback;
    const lift = numberToken('--avatar-lift', -4);
    const falloff = numberToken('--avatar-falloff', 0.45);
    const scale = numberToken('--avatar-scale', 1.05);
    const timingFunction =
      phase === 'out'
        ? stringToken('--avatar-ease-out', 'cubic-bezier(0.22, 1, 0.36, 1)')
        : stringToken('--avatar-ease-in', 'cubic-bezier(0.22, 1, 0.36, 1)');

    root.querySelectorAll<HTMLElement>('.t-avatar').forEach((avatar, index) => {
      avatar.style.transitionTimingFunction = timingFunction;
      if (activeIndex === null) {
        avatar.style.setProperty('--shift', '0px');
        avatar.style.setProperty('--scale-active', '1');
        return;
      }

      const distance = Math.abs(index - activeIndex);
      avatar.style.setProperty(
        '--shift',
        `${(lift * falloff ** distance).toFixed(3)}px`,
      );
      avatar.style.setProperty(
        '--scale-active',
        index === activeIndex ? String(scale) : '1',
      );
    });
  }

  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-overlay/70 px-2.5 py-1 text-[0.6875rem] leading-none font-light text-on-overlay backdrop-blur-md">
      <span>Built by</span>
      <ul
        ref={groupRef}
        aria-label="Photon contributors"
        className="t-avatar-group inline-flex list-none items-center pl-1 -space-x-1.5"
        onPointerLeave={() => setShifts(null, 'out')}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setShifts(null, 'out');
          }
        }}
      >
        {contributors.map((contributor, index) => (
          <ContributorAvatar
            key={contributor.name}
            contributor={contributor}
            index={index}
            setShifts={setShifts}
          />
        ))}
      </ul>
    </div>
  );
}
