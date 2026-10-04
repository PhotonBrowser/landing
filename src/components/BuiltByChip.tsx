export function BuiltByChip() {
  return (
    <a
      href="https://ladybird.org"
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full bg-overlay/70 px-2.5 py-1 text-[0.6875rem] leading-none font-light text-on-overlay backdrop-blur-md transition-colors hover:bg-overlay focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      aria-label="Built on Ladybird. Visit ladybird.org"
    >
      <span>Built on Ladybird</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="size-3 fill-none stroke-current stroke-[1.5]"
      >
        <path
          d="m6 3 5 5-5 5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
