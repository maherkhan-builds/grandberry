"use client";

import { useSyncExternalStore } from "react";

export type FamilyMemory = {
  id: string;
  prompt: string;
  speaker: "Margaret";
  recordedAt: string;
  audioUrl: string | null;
  isDemo: boolean;
};

type FamilyMemorySnapshot = { memories: FamilyMemory[] };

export const MEMORY_PROMPT = "What is a family tradition that always makes you smile?";

const seededMemory: FamilyMemory = {
  id: "demo-memory-family-tradition",
  prompt: MEMORY_PROMPT,
  speaker: "Margaret",
  recordedAt: "Demo example",
  audioUrl: null,
  isDemo: true,
};

const serverSnapshot: FamilyMemorySnapshot = { memories: [seededMemory] };
let snapshot: FamilyMemorySnapshot = { memories: [seededMemory] };
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() { return snapshot; }
function getServerSnapshot() { return serverSnapshot; }

export function addFamilyMemory(audioUrl: string) {
  const recordedAt = `Today at ${new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date())}`;

  snapshot = {
    memories: [...snapshot.memories, {
      id: `memory-${Date.now()}`,
      prompt: MEMORY_PROMPT,
      speaker: "Margaret",
      recordedAt,
      audioUrl,
      isDemo: false,
    }],
  };
  listeners.forEach((listener) => listener());
}

export function useFamilyMemories() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
