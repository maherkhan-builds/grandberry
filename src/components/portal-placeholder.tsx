import Link from "next/link";

type PortalPlaceholderProps = {
  role: "Senior" | "Family";
  greeting: string;
  description: string;
};

export function PortalPlaceholder({ role, greeting, description }: PortalPlaceholderProps) {
  return (
    <main className="portal-shell">
      <div className="portal-panel">
        <header className="portal-header">
          <Link href="/" className="back-link">← Choose another role</Link>
          <span className="rounded-full bg-berry-soft px-3 py-1.5 text-sm font-bold text-berry-dark">
            {role} view
          </span>
        </header>
        <section className="px-6 py-16 text-center sm:px-10 sm:py-24">
          <div className="brand-mark mx-auto mb-7" aria-hidden="true"><span>G</span></div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-sage">The Williams Family</p>
          <h1 className="font-display text-4xl font-semibold text-ink sm:text-6xl">{greeting}</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-muted">{description}</p>
          <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-dashed border-berry/30 bg-berry-soft/50 px-6 py-8">
            <p className="font-bold text-ink">Your Grandberry home is ready.</p>
            <p className="mt-2 text-muted">The connected features will arrive in the next approved milestone.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
