"use client";

import { FormEvent, useState } from "react";
import { addLoveNote, useFamilyCorner } from "@/lib/family-corner-store";

const NOTE_LIMIT = 180;

export function FamilyCorner() {
  const { notes, voiceReplies } = useFamilyCorner();
  const [draft, setDraft] = useState("");
  const [confirmation, setConfirmation] = useState("");

  function sendNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.trim() || draft.length > NOTE_LIMIT) return;

    addLoveNote(draft);
    setDraft("");
    setConfirmation("Your note was sent to Margaret.");
  }

  return (
    <section className="dashboard-section family-corner-section" aria-labelledby="family-corner-title">
      <div className="family-corner-heading">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-berry">Family connection</p>
          <h2 id="family-corner-title" className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">Family Corner</h2>
          <p className="mt-2 leading-6 text-muted">Send Margaret a short note filled with everyday love.</p>
        </div>
        <div className="family-corner-heart" aria-hidden="true">♡</div>
      </div>

      <form onSubmit={sendNote} className="love-note-form">
        <label htmlFor="love-note" className="text-lg font-bold text-ink">Write a note to Margaret</label>
        <textarea
          id="love-note"
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            setConfirmation("");
          }}
          maxLength={NOTE_LIMIT}
          rows={4}
          placeholder="Thinking of you today, Grandma!"
          className="love-note-textarea"
        />
        <div className="note-form-footer">
          <span className="text-sm font-bold text-muted" aria-live="polite">{draft.length} of {NOTE_LIMIT} characters</span>
          <button type="submit" disabled={!draft.trim()} className="send-note-button">Send love note</button>
        </div>
        {confirmation && <p className="send-confirmation" role="status">✓ {confirmation}</p>}
      </form>

      <div className="connection-history">
        <h3 className="text-xl font-bold text-ink">Message history</h3>
        <div className="mt-4 grid gap-3">
          {[...notes].reverse().map((note) => (
            <article key={note.id} className="message-bubble message-bubble-family">
              <div className="message-meta"><strong>{note.sender}</strong><span>{note.time}</span></div>
              <p className="mt-2 whitespace-pre-wrap text-lg leading-7 text-ink">{note.text}</p>
            </article>
          ))}
          {[...voiceReplies].reverse().map((reply) => (
            <article key={reply.id} className="message-bubble message-bubble-senior">
              <div className="message-meta"><strong>{reply.sender}</strong><span>{reply.time}</span></div>
              <p className="mt-2 font-bold text-ink">Voice reply</p>
              <audio controls src={reply.audioUrl} className="mt-3 w-full" aria-label={`Voice reply from ${reply.sender}, ${reply.time}`} />
            </article>
          ))}
          {voiceReplies.length === 0 && (
            <p className="empty-reply-state">Margaret has not sent a voice reply yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
