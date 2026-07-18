import Link from "next/link";
import { SeniorFamilyCorner } from "@/components/senior-family-corner";

export default function SeniorPage() {
  return (
    <main className="portal-shell">
      <div className="portal-panel">
        <header className="portal-header">
          <Link href="/" className="back-link">← Choose another role</Link>
          <span className="rounded-full bg-berry-soft px-3 py-1.5 text-sm font-bold text-berry-dark">
            Senior view
          </span>
        </header>

        <section className="px-6 py-12 text-center sm:px-10 sm:py-20">
          <div className="brand-mark mx-auto mb-7" aria-hidden="true"><span>G</span></div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-sage">The Williams Family</p>
          <h1 className="font-display text-4xl font-semibold text-ink sm:text-6xl">Good morning, Margaret.</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-muted">
            Take a quiet moment to share how your morning is going.
          </p>

          <Link href="/senior/check-in" className="primary-action mx-auto mt-10 max-w-xl">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-8 shrink-0 fill-none stroke-current" strokeWidth="2">
              <path d="M20.8 5.7a5.2 5.2 0 0 0-7.4 0L12 7.1l-1.4-1.4a5.2 5.2 0 0 0-7.4 7.4L12 22l8.8-8.9a5.2 5.2 0 0 0 0-7.4Z" />
            </svg>
            <span>Start my morning check-in</span>
            <span aria-hidden="true">→</span>
          </Link>

          <p className="mt-5 text-base text-muted">About 2 minutes · 6 simple questions</p>
        </section>

        <SeniorFamilyCorner />
      </div>
    </main>
  );
}
