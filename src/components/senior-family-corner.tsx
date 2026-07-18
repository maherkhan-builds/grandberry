"use client";

import { useEffect, useRef, useState } from "react";
import { addVoiceReply, useFamilyCorner } from "@/lib/family-corner-store";

type RecorderStatus = "idle" | "requesting" | "recording" | "recorded";

export function SeniorFamilyCorner() {
  const { notes } = useFamilyCorner();
  const latestNote = notes[notes.length - 1];
  const [recorderStatus, setRecorderStatus] = useState<RecorderStatus>("idle");
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [recordingError, setRecordingError] = useState("");
  const [speechMessage, setSpeechMessage] = useState("");
  const [replyConfirmation, setReplyConfirmation] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordedUrlRef = useRef<string | null>(null);
  const sentUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      window.speechSynthesis?.cancel();
      if (recordedUrlRef.current && recordedUrlRef.current !== sentUrlRef.current) {
        URL.revokeObjectURL(recordedUrlRef.current);
      }
    };
  }, []);

  function readNoteAloud() {
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      setSpeechMessage("Reading aloud is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(latestNote.text);
    utterance.rate = 0.9;
    utterance.onstart = () => setSpeechMessage("Reading Maya’s note aloud.");
    utterance.onend = () => setSpeechMessage("Finished reading the note.");
    utterance.onerror = () => setSpeechMessage("The note could not be read aloud. Please try again.");
    window.speechSynthesis.speak(utterance);
  }

  function clearUnsentRecording() {
    if (recordedUrlRef.current && recordedUrlRef.current !== sentUrlRef.current) {
      URL.revokeObjectURL(recordedUrlRef.current);
    }
    recordedUrlRef.current = null;
    setRecordedUrl(null);
  }

  async function startRecording() {
    setRecordingError("");
    setReplyConfirmation("");

    if (!("MediaRecorder" in window) || !navigator.mediaDevices?.getUserMedia) {
      setRecordingError("Voice recording is not supported in this browser. You can still read Maya’s note.");
      return;
    }

    clearUnsentRecording();
    setRecorderStatus("requesting");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const recording = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const url = URL.createObjectURL(recording);
        recordedUrlRef.current = url;
        setRecordedUrl(url);
        setRecorderStatus("recorded");
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };
      recorder.start();
      setRecorderStatus("recording");
    } catch (error) {
      setRecorderStatus("idle");
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;

      if (error instanceof DOMException && (error.name === "NotAllowedError" || error.name === "SecurityError")) {
        setRecordingError("Microphone permission was not granted. You can allow microphone access in your browser settings and try again.");
      } else if (error instanceof DOMException && error.name === "NotFoundError") {
        setRecordingError("No microphone was found. Please connect a microphone and try again.");
      } else {
        setRecordingError("The microphone could not be started. Please check your browser settings and try again.");
      }
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      setRecorderStatus("requesting");
    }
  }

  function reRecord() {
    clearUnsentRecording();
    setRecorderStatus("idle");
    setRecordingError("");
    setReplyConfirmation("");
  }

  function sendReply() {
    if (!recordedUrl) return;
    addVoiceReply(recordedUrl);
    sentUrlRef.current = recordedUrl;
    setRecordedUrl(null);
    recordedUrlRef.current = null;
    setRecorderStatus("idle");
    setReplyConfirmation("Your voice reply was sent to Maya.");
  }

  return (
    <section className="senior-family-corner" aria-labelledby="senior-family-corner-title">
      <div className="senior-note-alert" role="status">
        <span aria-hidden="true">♡</span> {latestNote.sender} sent you a note.
      </div>
      <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-berry">Family Corner</p>
      <h2 id="senior-family-corner-title" className="mt-2 font-display text-3xl font-semibold text-ink sm:text-5xl">A note from {latestNote.sender}</h2>

      <article className="senior-love-note">
        <p className="whitespace-pre-wrap">“{latestNote.text}”</p>
        <footer>— {latestNote.sender}, {latestNote.time}</footer>
      </article>

      <button type="button" onClick={readNoteAloud} className="senior-audio-button">
        <span aria-hidden="true">▶</span> Read it to me
      </button>
      {speechMessage && <p className="mt-3 font-bold text-sage" role="status">{speechMessage}</p>}

      <div className="voice-reply-panel">
        <h3 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Send a voice reply</h3>
        <p className="mt-2 text-lg leading-7 text-muted">Your recording stays on this device and is only kept for this demo.</p>

        {recorderStatus === "recording" && (
          <div className="recording-live" role="status"><span aria-hidden="true" /> Recording now…</div>
        )}
        {recorderStatus === "requesting" && <p className="mt-5 text-lg font-bold text-sage" role="status">Preparing your recording…</p>}
        {recordingError && <p className="recording-error" role="alert">{recordingError}</p>}

        <div className="voice-controls">
          {recorderStatus === "idle" && (
            <button type="button" onClick={startRecording} className="record-button">● Start recording</button>
          )}
          {recorderStatus === "recording" && (
            <button type="button" onClick={stopRecording} className="stop-recording-button">■ Stop recording</button>
          )}
          {recorderStatus === "recorded" && recordedUrl && (
            <>
              <p className="text-lg font-bold text-ink">Play your recording</p>
              <audio controls src={recordedUrl} className="w-full" aria-label="Your recorded voice reply" />
              <div className="recorded-actions">
                <button type="button" onClick={reRecord} className="secondary-button">Re-record</button>
                <button type="button" onClick={sendReply} className="send-reply-button">Send reply</button>
              </div>
            </>
          )}
        </div>

        {replyConfirmation && <p className="send-confirmation mt-5" role="status">✓ {replyConfirmation}</p>}
      </div>
    </section>
  );
}
