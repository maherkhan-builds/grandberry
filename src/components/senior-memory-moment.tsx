"use client";

import { useEffect, useRef, useState } from "react";
import { addFamilyMemory, MEMORY_PROMPT, useFamilyMemories } from "@/lib/family-memory-store";

const MAX_RECORDING_SECONDS = 90;
type RecorderStatus = "idle" | "requesting" | "recording" | "recorded";

function formatElapsed(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export function SeniorMemoryMoment() {
  const { memories } = useFamilyMemories();
  const sharedCount = memories.filter((memory) => !memory.isDemo).length;
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const draftUrlRef = useRef<string | null>(null);
  const addedUrlRef = useRef<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const limitRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reachedLimitRef = useRef(false);
  const mountedRef = useRef(true);

  function clearTimers() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (limitRef.current) clearTimeout(limitRef.current);
    intervalRef.current = null;
    limitRef.current = null;
  }

  function stopTracks() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  function clearDraft() {
    if (draftUrlRef.current && draftUrlRef.current !== addedUrlRef.current) {
      URL.revokeObjectURL(draftUrlRef.current);
    }
    draftUrlRef.current = null;
    setRecordedUrl(null);
  }

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      clearTimers();
      if (recorderRef.current?.state === "recording") recorderRef.current.stop();
      stopTracks();
      if (draftUrlRef.current && draftUrlRef.current !== addedUrlRef.current) {
        URL.revokeObjectURL(draftUrlRef.current);
      }
    };
  }, []);

  function stopRecording(reachedLimit = false) {
    reachedLimitRef.current = reachedLimit;
    clearTimers();
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    stopTracks();
    if (mountedRef.current) setStatus("requesting");
  }

  async function startRecording() {
    setErrorMessage("");
    setStatusMessage("");
    setConfirmation("");
    setElapsedSeconds(0);

    if (!("MediaRecorder" in window) || !navigator.mediaDevices?.getUserMedia) {
      setErrorMessage("Voice recording is not supported in this browser.");
      return;
    }

    clearDraft();
    setStatus("requesting");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!mountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      chunksRef.current = [];
      reachedLimitRef.current = false;
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const recording = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        if (recording.size === 0) {
          if (mountedRef.current) {
            setStatus("idle");
            setErrorMessage("No audio was captured. Please try recording again.");
          }
          return;
        }

        const url = URL.createObjectURL(recording);
        if (!mountedRef.current) {
          URL.revokeObjectURL(url);
          return;
        }
        draftUrlRef.current = url;
        setRecordedUrl(url);
        setStatus("recorded");
        if (reachedLimitRef.current) {
          setStatusMessage("The 90-second maximum length was reached, so recording stopped automatically.");
        }
      };

      recorder.start();
      setStatus("recording");
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((current) => Math.min(current + 1, MAX_RECORDING_SECONDS));
      }, 1000);
      limitRef.current = setTimeout(() => stopRecording(true), MAX_RECORDING_SECONDS * 1000);
    } catch (error) {
      clearTimers();
      stopTracks();
      setStatus("idle");
      if (error instanceof DOMException && (error.name === "NotAllowedError" || error.name === "SecurityError")) {
        setErrorMessage("Microphone permission was not granted. You can allow microphone access in your browser settings and try again.");
      } else if (error instanceof DOMException && error.name === "NotFoundError") {
        setErrorMessage("No microphone was found. Please connect a microphone and try again.");
      } else {
        setErrorMessage("The microphone could not be started. Please check your browser settings and try again.");
      }
    }
  }

  function recordAgain() {
    clearTimers();
    stopTracks();
    clearDraft();
    setElapsedSeconds(0);
    setStatus("idle");
    setErrorMessage("");
    setStatusMessage("");
    setConfirmation("");
  }

  function addToFamilyMemories() {
    if (!recordedUrl) return;
    addFamilyMemory(recordedUrl);
    addedUrlRef.current = recordedUrl;
    draftUrlRef.current = null;
    setRecordedUrl(null);
    setElapsedSeconds(0);
    setStatus("idle");
    setStatusMessage("");
    setConfirmation("Your story was added to the temporary Williams family memory collection.");
  }

  return (
    <section className="senior-memory-moment" aria-labelledby="memory-moment-title">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-sage">A story for your family</p>
      <h2 id="memory-moment-title" className="mt-2 font-display text-3xl font-semibold text-ink sm:text-5xl">Memory Moment</h2>
      <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-muted">Take your time. Your family would love to hear this story in your own voice.</p>

      <article className="memory-prompt-card">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-berry">Today&apos;s prompt</p>
        <p className="mt-3 font-display text-2xl font-semibold leading-snug text-ink sm:text-4xl">{MEMORY_PROMPT}</p>
      </article>

      <div className="memory-recorder-panel">
        <p className="memory-privacy-message">Your story stays in this temporary browser demo. Grandberry does not upload, transcribe, analyze, or permanently save this recording.</p>

        {status === "recording" && (
          <div className="memory-recording-live" role="status">
            <span aria-hidden="true" />
            <strong>Recording now</strong>
            <time aria-label={`${elapsedSeconds} seconds elapsed`}>{formatElapsed(elapsedSeconds)} / 1:30</time>
          </div>
        )}
        {status === "requesting" && <p className="memory-preparing" role="status">Preparing your story…</p>}
        {errorMessage && <p className="recording-error" role="alert">{errorMessage}</p>}
        {statusMessage && <p className="memory-limit-message" role="status">{statusMessage}</p>}

        <div className="memory-recording-controls">
          {status === "idle" && <button type="button" onClick={startRecording} className="memory-primary-button">● Start my story</button>}
          {status === "recording" && <button type="button" onClick={() => stopRecording(false)} className="memory-stop-button">■ Stop recording</button>}
          {status === "recorded" && recordedUrl && (
            <>
              <p className="text-lg font-bold text-ink">Play my story</p>
              <audio controls src={recordedUrl} className="memory-audio" aria-label="Play my story" />
              <div className="memory-recorded-actions">
                <button type="button" onClick={recordAgain} className="memory-secondary-button">Record again</button>
                <button type="button" onClick={addToFamilyMemories} className="memory-primary-button">Add to family memories</button>
              </div>
            </>
          )}
        </div>

        {confirmation && <p className="memory-confirmation" role="status">✓ {confirmation}</p>}
      </div>

      {sharedCount > 0 && (
        <div className="senior-memory-added" aria-label="Stories added during this demo">
          <h3 className="font-display text-2xl font-semibold text-ink">Added during this demo</h3>
          <p className="mt-2 text-lg text-muted">{sharedCount} {sharedCount === 1 ? "story" : "stories"} in the temporary family collection.</p>
        </div>
      )}
    </section>
  );
}
