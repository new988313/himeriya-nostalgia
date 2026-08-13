const LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jaimin-d-24b30b278" },
];

export default function SocialLinks() {
  return (
    <nav aria-label="Social links" className="flex items-center gap-4 text-xs font-medium text-white/80">
      {LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md transition-all hover:bg-white/15 hover:text-white active:scale-95 text-amber-300"
        >
          <svg className="h-3.5 w-3.5 fill-current text-amber-400" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
          </svg>
          <span>{link.label}</span>
        </a>
      ))}
    </nav>
  );
}
