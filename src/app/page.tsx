import Link from "next/link";

const roles = [
  {
    href: "/senior",
    label: "Continue as Senior",
    description: "Your simple, welcoming space to stay connected.",
    icon: "heart",
  },
  {
    href: "/family",
    label: "Continue as Family",
    description: "A thoughtful view of the people you care about.",
    icon: "home",
  },
] as const;

function RoleIcon({ icon }: { icon: (typeof roles)[number]["icon"] }) {
  return icon === "heart" ? (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-8 fill-none stroke-current" strokeWidth="1.8">
      <path d="M20.8 5.7a5.2 5.2 0 0 0-7.4 0L12 7.1l-1.4-1.4a5.2 5.2 0 0 0-7.4 7.4L12 22l8.8-8.9a5.2 5.2 0 0 0 0-7.4Z" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-8 fill-none stroke-current" strokeWidth="1.8">
      <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 sm:px-8">
      <div className="sun-glow" aria-hidden="true" />
      <div className="relative z-10 w-full max-w-5xl">
        <header className="mb-10 text-center sm:mb-12">
          <div className="brand-mark mx-auto mb-5" aria-hidden="true">
            <span>G</span>
          </div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-berry">Grandberry</p>
          <h1 className="font-display text-4xl font-semibold leading-tight text-ink sm:text-6xl">
            Love, close at hand.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-muted sm:text-xl">
            A gentle place for families to feel connected, every day.
          </p>
        </header>

        <section aria-labelledby="role-heading">
          <h2 id="role-heading" className="mb-5 text-center text-base font-semibold text-ink">
            How would you like to continue?
          </h2>
          <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-2">
            {roles.map((role) => (
              <Link key={role.href} href={role.href} className="role-card group">
                <span className="role-icon">
                  <RoleIcon icon={role.icon} />
                </span>
                <span className="flex-1">
                  <span className="block text-xl font-bold text-ink">{role.label}</span>
                  <span className="mt-1 block leading-6 text-muted">{role.description}</span>
                </span>
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6 shrink-0 text-berry transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            ))}
          </div>
        </section>

        <p className="mt-8 text-center text-sm text-muted">Demo household · The Williams Family</p>
      </div>
    </main>
  );
}
