export default function HeroBackground() {
  return (
    <div className="fixed inset-0 z-0 hero-bg pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/75" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/15" />
    </div>
  );
}
