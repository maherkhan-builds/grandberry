"use client";

import { useSyncExternalStore } from "react";

export type LoveNote = {
  id: string;
  sender: string;
  text: string;
  time: string;
};

export type VoiceReply = {
  id: string;
  audioUrl: string;
  sender: string;
  time: string;
};

type FamilyCornerSnapshot = {
  notes: LoveNote[];
  voiceReplies: VoiceReply[];
};

const seededNotes: LoveNote[] = [
  {
    id: "seeded-note-maya",
    sender: "Maya",
    text: "Good morning, Grandma! Thinking of you and sending a big hug. Love, Maya.",
    time: "Today at 9:05 AM",
  },
];

const serverSnapshot: FamilyCornerSnapshot = {
  notes: seededNotes,
  voiceReplies: [],
};

let snapshot: FamilyCornerSnapshot = {
  notes: seededNotes,
  voiceReplies: [],
};

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit() {
  listeners.forEach((listener) => listener());
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot() {
  return serverSnapshot;
}

function formatCurrentTime() {
  return `Today at ${new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date())}`;
}

export function addLoveNote(text: string) {
  const note: LoveNote = {
    id: `note-${Date.now()}`,
    sender: "Maya",
    text,
    time: formatCurrentTime(),
  };

  snapshot = { ...snapshot, notes: [...snapshot.notes, note] };
  emit();
}

export function addVoiceReply(audioUrl: string) {
  const reply: VoiceReply = {
    id: `reply-${Date.now()}`,
    audioUrl,
    sender: "Margaret",
    time: formatCurrentTime(),
  };

  snapshot = { ...snapshot, voiceReplies: [...snapshot.voiceReplies, reply] };
  emit();
}

export function useFamilyCorner() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
