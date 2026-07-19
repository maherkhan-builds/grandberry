"use client";

import { useFamilyMemories } from "@/lib/family-memory-store";

export function FamilyMemoryLibrary() {
  const { memories } = useFamilyMemories();

  return (
    <section className="dashboard-section family-memory-library" aria-labelledby="family-memories-title">
      <div className="family-corner-heading">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-sage">Stories Margaret chose to share</p>
          <h2 id="family-memories-title" className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">Family Memories</h2>
          <p className="mt-2 leading-6 text-muted">Listen to familiar stories in Margaret&apos;s own voice.</p>
        </div>
        <div className="memory-book-icon" aria-hidden="true">♪</div>
      </div>

      <div className="memory-list">
        {[...memories].reverse().map((memory) => (
          <article key={memory.id} className={`memory-card ${memory.isDemo ? "memory-card-demo" : ""}`}>
            <div className="memory-card-meta">
              <span className={memory.isDemo ? "demo-memory-badge" : "shared-memory-badge"}>
                {memory.isDemo ? "Demo example" : "Shared memory"}
              </span>
              <span>{memory.recordedAt}</span>
            </div>
            <h3 className="memory-prompt">{memory.prompt}</h3>
            <p className="mt-3 font-bold text-ink">Story from {memory.speaker}</p>
            {memory.audioUrl ? (
              <audio controls src={memory.audioUrl} className="memory-audio" aria-label={`Family memory from ${memory.speaker}, ${memory.recordedAt}`} />
            ) : (
              <p className="demo-memory-note">This example shows how a shared story will appear. It does not contain fabricated audio.</p>
            )}
          </article>
        ))}
      </div>

      <p className="temporary-memory-note">
        New recordings remain only in this temporary browser demo and may disappear after refreshing or closing the page.
      </p>
    </section>
  );
}
