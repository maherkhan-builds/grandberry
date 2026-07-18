"use client";

import Link from "next/link";
import { useState } from "react";

const questions = [
  {
    id: "sleep",
    shortLabel: "Sleep",
    prompt: "How did you sleep last night?",
    hint: "Choose the answer that feels closest.",
    options: ["Very well", "Pretty well", "Not so well", "Hardly at all"],
  },
  {
    id: "mood",
    shortLabel: "Mood",
    prompt: "How are you feeling this morning?",
    hint: "There is no wrong answer.",
    options: ["Great", "Good", "Just okay", "Low or worried"],
  },
  {
    id: "comfort",
    shortLabel: "Physical comfort",
    prompt: "How comfortable does your body feel?",
    hint: "Think about any aches, pain, or discomfort.",
    options: ["Comfortable", "A little uncomfortable", "Very uncomfortable", "Something else"],
    allowsNote: true,
  },
  {
    id: "water",
    shortLabel: "Water",
    prompt: "Have you had some water this morning?",
    hint: "A few sips count.",
    options: ["Yes", "Not yet", "I do not remember"],
  },
  {
    id: "meal",
    shortLabel: "Breakfast or first meal",
    prompt: "Have you eaten breakfast or your first meal?",
    hint: "Choose what is true right now.",
    options: ["Yes", "Not yet", "I am not planning to eat"],
  },
  {
    id: "medication",
    shortLabel: "Medication",
    prompt: "Have you taken your morning medication?",
    hint: "Only answer for medication normally taken this morning.",
    options: ["Yes", "Not yet", "No medication this morning", "I do not remember"],
  },
] as const;

type QuestionId = (typeof questions)[number]["id"];
type Answers = Partial<Record<QuestionId, string>>;
type Screen = "questions" | "review" | "complete";

export default function MorningCheckInPage() {
  const [answers, setAnswers] = useState<Answers>({});
  const [comfortNote, setComfortNote] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [screen, setScreen] = useState<Screen>("questions");
  const [editingFromReview, setEditingFromReview] = useState(false);

  const question = questions[questionIndex];
  const selectedAnswer = answers[question.id];
  const canContinue = Boolean(selectedAnswer) && (
    question.id !== "comfort" || selectedAnswer !== "Something else" || comfortNote.trim().length > 0
  );

  function chooseAnswer(answer: string) {
    setAnswers((current) => ({ ...current, [question.id]: answer }));
  }

  function goNext() {
    if (!canContinue) return;

    if (editingFromReview || questionIndex === questions.length - 1) {
      setEditingFromReview(false);
      setScreen("review");
      return;
    }

    setQuestionIndex((current) => current + 1);
  }

  function goBack() {
    if (editingFromReview) {
      setEditingFromReview(false);
      setScreen("review");
      return;
    }

    if (questionIndex > 0) {
      setQuestionIndex((current) => current - 1);
    }
  }

  function editAnswer(index: number) {
    setQuestionIndex(index);
    setEditingFromReview(true);
    setScreen("questions");
  }

  function startAgain() {
    setAnswers({});
    setComfortNote("");
    setQuestionIndex(0);
    setEditingFromReview(false);
    setScreen("questions");
  }

  return (
    <main className="check-in-shell">
      <div className="check-in-panel">
        <header className="check-in-header">
          <Link href="/senior" className="back-link">← Senior home</Link>
          <span className="text-sm font-bold uppercase tracking-[0.16em] text-berry">Morning check-in</span>
        </header>

        {screen === "questions" && (
          <section className="check-in-content" aria-labelledby="question-title">
            <div className="mb-8">
              <div className="mb-3 flex items-center justify-between gap-4 text-base font-bold text-ink">
                <span>Question {questionIndex + 1} of {questions.length}</span>
                <span>{Math.round(((questionIndex + 1) / questions.length) * 100)}%</span>
              </div>
              <div
                className="h-3 overflow-hidden rounded-full bg-berry-soft"
                role="progressbar"
                aria-label={`Question ${questionIndex + 1} of ${questions.length}`}
                aria-valuemin={1}
                aria-valuemax={questions.length}
                aria-valuenow={questionIndex + 1}
              >
                <div className="h-full rounded-full bg-berry transition-[width]" style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} />
              </div>
            </div>

            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-sage">{question.shortLabel}</p>
            <h1 id="question-title" className="font-display text-3xl font-semibold leading-tight text-ink sm:text-5xl">
              {question.prompt}
            </h1>
            <p className="mt-4 text-lg leading-7 text-muted">{question.hint}</p>

            <fieldset className="mt-8 grid gap-3">
              <legend className="sr-only">Choose one answer</legend>
              {question.options.map((option) => {
                const isSelected = selectedAnswer === option;
                return (
                  <label key={option} className={`answer-option ${isSelected ? "answer-option-selected" : ""}`}>
                    <input
                      type="radio"
                      name={question.id}
                      value={option}
                      checked={isSelected}
                      onChange={() => chooseAnswer(option)}
                      className="sr-only"
                    />
                    <span className="answer-radio" aria-hidden="true">{isSelected && <span />}</span>
                    <span>{option}</span>
                  </label>
                );
              })}
            </fieldset>

            {question.id === "comfort" && selectedAnswer === "Something else" && (
              <div className="mt-5">
                <label htmlFor="comfort-note" className="mb-2 block text-lg font-bold text-ink">
                  Tell us what feels uncomfortable
                </label>
                <textarea
                  id="comfort-note"
                  value={comfortNote}
                  onChange={(event) => setComfortNote(event.target.value)}
                  placeholder="For example: My left knee feels sore"
                  rows={3}
                  className="check-in-textarea"
                />
              </div>
            )}

            <div className="check-in-controls">
              {questionIndex > 0 || editingFromReview ? (
                <button type="button" onClick={goBack} className="secondary-button">Back</button>
              ) : (
                <Link href="/senior" className="secondary-button">Back</Link>
              )}
              <button type="button" onClick={goNext} disabled={!canContinue} className="next-button">
                {editingFromReview ? "Save change" : questionIndex === questions.length - 1 ? "Review answers" : "Next"}
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </section>
        )}

        {screen === "review" && (
          <section className="check-in-content" aria-labelledby="review-title">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-sage">Almost finished</p>
            <h1 id="review-title" className="font-display text-3xl font-semibold text-ink sm:text-5xl">Review your answers</h1>
            <p className="mt-4 text-lg text-muted">Take a moment to make sure everything looks right.</p>

            <dl className="mt-8 grid gap-3">
              {questions.map((item, index) => (
                <div key={item.id} className="review-row">
                  <div>
                    <dt className="text-sm font-bold uppercase tracking-[0.12em] text-sage">{item.shortLabel}</dt>
                    <dd className="mt-1 text-xl font-bold text-ink">
                      {answers[item.id]}
                      {item.id === "comfort" && answers[item.id] === "Something else" && (
                        <span className="mt-1 block text-base font-normal text-muted">{comfortNote}</span>
                      )}
                    </dd>
                  </div>
                  <button type="button" onClick={() => editAnswer(index)} className="change-button" aria-label={`Change answer for ${item.shortLabel}`}>
                    Change
                  </button>
                </div>
              ))}
            </dl>

            <div className="check-in-controls">
              <button type="button" onClick={() => { setQuestionIndex(questions.length - 1); setScreen("questions"); }} className="secondary-button">
                Back
              </button>
              <button type="button" onClick={() => setScreen("complete")} className="next-button">
                Finish check-in <span aria-hidden="true">✓</span>
              </button>
            </div>
          </section>
        )}

        {screen === "complete" && (
          <section className="check-in-content py-14 text-center sm:py-20" aria-labelledby="complete-title">
            <div className="completion-mark mx-auto" aria-hidden="true">✓</div>
            <p className="mt-7 text-sm font-bold uppercase tracking-[0.18em] text-sage">Check-in complete</p>
            <h1 id="complete-title" className="mt-3 font-display text-4xl font-semibold text-ink sm:text-6xl">Thank you, Margaret.</h1>
            <p className="mx-auto mt-5 max-w-xl text-xl leading-8 text-muted">
              You finished your morning check-in. Your answers are only saved on this screen for now.
            </p>
            <div className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/senior" className="secondary-button">Return to senior home</Link>
              <button type="button" onClick={startAgain} className="next-button">Start again</button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
