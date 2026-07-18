"use client";

import Link from "next/link";
import { useState } from "react";
import { FamilyCorner } from "@/components/family-corner";

type CheckInStatus = "completed" | "not-yet" | "missed";

const statusDetails = {
  completed: {
    label: "Completed",
    description: "Margaret completed her usual morning check-in.",
    completionTime: "Today at 8:42 AM",
    lastActivity: "Morning check-in · Today at 8:42 AM",
  },
  "not-yet": {
    label: "Not yet completed",
    description: "Margaret’s usual check-in window is still open.",
    completionTime: "Not completed yet",
    lastActivity: "Viewed a family note · Yesterday at 7:18 PM",
  },
  missed: {
    label: "Missed",
    description: "Today’s usual check-in window has passed without a check-in.",
    completionTime: "No check-in reported today",
    lastActivity: "Morning check-in · Yesterday at 8:35 AM",
  },
} as const;

const completedAnswers = [
  { label: "Sleep", answer: "Pretty well", detail: "Reported" },
  { label: "Mood", answer: "Good", detail: "Reported" },
  { label: "Physical comfort", answer: "Comfortable", detail: "Reported" },
  { label: "Water", answer: "Yes", detail: "Confirmed" },
  { label: "Breakfast or first meal", answer: "Yes", detail: "Confirmed" },
  { label: "Medication confirmation", answer: "Yes", detail: "Confirmed" },
] as const;

const priorDays = [
  { day: "Thu", date: "Jul 17", status: "Completed", time: "8:35 AM" },
  { day: "Wed", date: "Jul 16", status: "Completed", time: "8:51 AM" },
  { day: "Tue", date: "Jul 15", status: "Missed", time: "—" },
  { day: "Mon", date: "Jul 14", status: "Completed", time: "8:28 AM" },
  { day: "Sun", date: "Jul 13", status: "Completed", time: "9:04 AM" },
  { day: "Sat", date: "Jul 12", status: "Completed", time: "8:47 AM" },
] as const;

function StatusIcon({ status }: { status: CheckInStatus | "Completed" | "Missed" }) {
  if (status === "completed" || status === "Completed") {
    return <span aria-hidden="true">✓</span>;
  }
  if (status === "missed" || status === "Missed") {
    return <span aria-hidden="true">—</span>;
  }
  return <span aria-hidden="true">○</span>;
}

export function FamilyDashboard() {
  const [status, setStatus] = useState<CheckInStatus>("completed");
  const [followUpPlanned, setFollowUpPlanned] = useState(false);
  const currentStatus = statusDetails[status];
  const sevenDays = [
    {
      day: "Today",
      date: "Jul 18",
      status: currentStatus.label,
      time: status === "completed" ? "8:42 AM" : "—",
    },
    ...priorDays,
  ];

  function selectDemoStatus(nextStatus: CheckInStatus) {
    setStatus(nextStatus);
    setFollowUpPlanned(false);
  }

  return (
    <main className="family-shell">
      <div className="family-dashboard">
        <header className="family-header">
          <div>
            <Link href="/" className="back-link">← Choose another role</Link>
            <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-sage">Williams family dashboard</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-5xl">Margaret Williams</h1>
          </div>
          <span className="rounded-full bg-berry-soft px-3 py-1.5 text-sm font-bold text-berry-dark">Family view</span>
        </header>

        <div className="family-content">
          <section className="demo-switcher" aria-labelledby="demo-state-title">
            <div>
              <p id="demo-state-title" className="font-bold text-ink">Demo today’s status</p>
              <p className="mt-1 text-sm text-muted">Switch views to test each family-dashboard state.</p>
            </div>
            <div className="demo-switcher-buttons" role="group" aria-label="Choose demonstration check-in status">
              {(["completed", "not-yet", "missed"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => selectDemoStatus(option)}
                  aria-pressed={status === option}
                  className={`demo-state-button ${status === option ? "demo-state-button-active" : ""}`}
                >
                  {statusDetails[option].label}
                </button>
              ))}
            </div>
          </section>

          <FamilyCorner />

          <section className="family-summary-grid" aria-label="Today’s check-in overview">
            <article className={`status-card status-${status}`}>
              <div className="status-card-icon"><StatusIcon status={status} /></div>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-muted">Today’s check-in</p>
                <h2 className="mt-1 text-2xl font-bold text-ink">{currentStatus.label}</h2>
                <p className="mt-2 leading-6 text-muted">{currentStatus.description}</p>
              </div>
            </article>

            <article className="family-detail-card">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-sage">Completion time</p>
              <p className="mt-2 text-xl font-bold text-ink">{currentStatus.completionTime}</p>
            </article>

            <article className="family-detail-card">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-sage">Last meaningful activity</p>
              <p className="mt-2 text-xl font-bold text-ink">{currentStatus.lastActivity}</p>
            </article>
          </section>

          {status === "missed" && (
            <section className="silence-card" aria-labelledby="silence-title">
              <div className="silence-icon" aria-hidden="true">♡</div>
              <div className="flex-1">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-berry-dark">Silence is a Signal</p>
                <h2 id="silence-title" className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">A gentle reason to connect</h2>
                <p className="mt-3 max-w-3xl text-lg leading-8 text-muted">
                  Margaret has not completed today’s usual check-in. This may simply mean she is busy or away from the device. Consider sending a note or giving her a call.
                </p>
                <button
                  type="button"
                  onClick={() => setFollowUpPlanned(true)}
                  disabled={followUpPlanned}
                  className="follow-up-button mt-5"
                >
                  {followUpPlanned ? "Follow-up planned ✓" : "I’ll follow up"}
                </button>
              </div>
            </section>
          )}

          <section className="dashboard-section" aria-labelledby="answers-title">
            <div className="section-heading-row">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-sage">Today</p>
                <h2 id="answers-title" className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">Reported check-in answers</h2>
              </div>
              {status !== "completed" && <span className="waiting-badge">Waiting for today’s check-in</span>}
            </div>

            <dl className="answer-summary-grid">
              {completedAnswers.map((item) => (
                <div key={item.label} className="answer-summary-card">
                  <dt className="text-sm font-bold uppercase tracking-[0.11em] text-sage">{item.label}</dt>
                  <dd className="mt-2 text-xl font-bold text-ink">{status === "completed" ? item.answer : "Not reported today"}</dd>
                  <p className="mt-1 text-sm text-muted">{status === "completed" ? `${item.detail} at 8:42 AM` : "No answer available"}</p>
                </div>
              ))}
            </dl>
          </section>

          <section className="dashboard-section" aria-labelledby="pattern-title">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-sage">Past seven days</p>
            <h2 id="pattern-title" className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">Check-in pattern</h2>
            <p className="mt-2 leading-6 text-muted">A simple record of whether Margaret completed her usual daily check-in.</p>

            <div className="seven-day-grid mt-6">
              {sevenDays.map((day) => {
                const dayStatus = day.status === "Not yet completed" ? "not-yet" : day.status.toLowerCase();
                return (
                  <article key={`${day.day}-${day.date}`} className="day-card">
                    <p className="text-sm font-bold text-muted">{day.day}</p>
                    <p className="text-xs text-muted">{day.date}</p>
                    <div className={`day-status day-status-${dayStatus}`}><StatusIcon status={day.status as CheckInStatus | "Completed" | "Missed"} /></div>
                    <p className="text-sm font-bold text-ink">{day.status}</p>
                    <p className="text-xs text-muted">{day.time}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <aside className="boundary-note">
            <strong>Grandberry supports family routines and connection.</strong> It does not provide medical advice, diagnosis, emergency monitoring, or guaranteed alerts.
          </aside>
        </div>
      </div>
    </main>
  );
}
