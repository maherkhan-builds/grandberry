"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { HandLandmarker } from "@mediapipe/tasks-vision";

const colors = [
  { name: "Warm", value: "#ffd39a" }, { name: "Cool", value: "#eaf6ff" },
  { name: "Sun", value: "#ffe45c" }, { name: "Blue", value: "#5ea7ff" },
  { name: "Pink", value: "#ff6fb7" }, { name: "Violet", value: "#9f7cff" },
  { name: "Mint", value: "#64f5b2" }, { name: "Red", value: "#ff5b5f" },
];
const defaults = { brightness: 82, glow: 58, beam: 44, softness: 72, distance: 62 };

export default function GlowPoint() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const trackerRef = useRef<HandLandmarker | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef(-1);
  const smoothTipRef = useRef({ x: 76, y: 44 });
  const [cameraOn, setCameraOn] = useState(false);
  const [permission, setPermission] = useState<"idle" | "denied" | "granted">("idle");
  const [color, setColor] = useState(colors[0].value);
  const [controls, setControls] = useState(defaults);
  const [beamOn, setBeamOn] = useState(true);
  const [mode, setMode] = useState<"focus" | "ambient">("focus");
  const [recording, setRecording] = useState(false);
  const [panel, setPanel] = useState(false);
  const [flash, setFlash] = useState(false);
  const [tip, setTip] = useState({ x: 76, y: 44 });
  const [beamAngle, setBeamAngle] = useState(-19);
  const [handVisible, setHandVisible] = useState(false);
  const [notice, setNotice] = useState("Point to paint with light");

  const startCamera = useCallback(async () => {
    try {
      setNotice("Loading on-device hand tracking…");
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();

      const { FilesetResolver, HandLandmarker } = await import("@mediapipe/tasks-vision");
      const vision = await FilesetResolver.forVisionTasks("/mediapipe-wasm");
      trackerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: "/models/hand_landmarker.task", delegate: "GPU" },
        runningMode: "VIDEO",
        numHands: 1,
        minHandDetectionConfidence: 0.55,
        minHandPresenceConfidence: 0.55,
        minTrackingConfidence: 0.55,
      });

      setCameraOn(true); setPermission("granted"); setNotice("Show one hand and point your index finger");

      const track = () => {
        const activeVideo = videoRef.current;
        const tracker = trackerRef.current;
        if (!activeVideo || !tracker) return;

        if (activeVideo.readyState >= 2 && activeVideo.currentTime !== lastVideoTimeRef.current) {
          lastVideoTimeRef.current = activeVideo.currentTime;
          const result = tracker.detectForVideo(activeVideo, performance.now());
          const landmarks = result.landmarks[0];

          if (landmarks && cameraRef.current) {
            const indexTip = landmarks[8];
            const indexPip = landmarks[6];
            const indexMcp = landmarks[5];
            const palmWidth = Math.hypot(landmarks[5].x - landmarks[17].x, landmarks[5].y - landmarks[17].y);
            const fingerLength = Math.hypot(indexTip.x - indexMcp.x, indexTip.y - indexMcp.y);
            const pointingClearly = fingerLength > palmWidth * 0.72;

            const cameraRect = cameraRef.current.getBoundingClientRect();
            const videoWidth = activeVideo.videoWidth || cameraRect.width;
            const videoHeight = activeVideo.videoHeight || cameraRect.height;
            const coverScale = Math.max(cameraRect.width / videoWidth, cameraRect.height / videoHeight);
            const renderedWidth = videoWidth * coverScale;
            const renderedHeight = videoHeight * coverScale;
            const cropX = (cameraRect.width - renderedWidth) / 2;
            const cropY = (cameraRect.height - renderedHeight) / 2;
            const mapToPreview = (point: { x: number; y: number }) => ({
              x: cropX + (1 - point.x) * renderedWidth,
              y: cropY + point.y * renderedHeight,
            });

            const mappedTip = mapToPreview(indexTip);
            const mappedPip = mapToPreview(indexPip);
            const vectorX = mappedTip.x - mappedPip.x;
            const vectorY = mappedTip.y - mappedPip.y;
            const vectorLength = Math.max(1, Math.hypot(vectorX, vectorY));
            const unitX = vectorX / vectorLength;
            const unitY = vectorY / vectorLength;
            const magicTip = { x: mappedTip.x + unitX * 7, y: mappedTip.y + unitY * 7 };
            const next = { x: (magicTip.x / cameraRect.width) * 100, y: (magicTip.y / cameraRect.height) * 100 };
            const previous = smoothTipRef.current;
            const smoothed = { x: previous.x + (next.x - previous.x) * 0.48, y: previous.y + (next.y - previous.y) * 0.48 };
            smoothTipRef.current = smoothed;
            setTip(smoothed);

            setBeamAngle(Math.atan2(vectorY, vectorX) * (180 / Math.PI));
            setHandVisible(true);
            setNotice(pointingClearly ? "Index fingertip locked · move your hand" : "Straighten your index finger to aim the beam");
          } else {
            setHandVisible(false);
            setNotice("No hand detected · hold one hand inside the frame");
          }
        }
        frameRef.current = requestAnimationFrame(track);
      };
      frameRef.current = requestAnimationFrame(track);
    } catch { setPermission("denied"); setNotice("Camera permission denied · demo mode active"); }
  }, []);

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    trackerRef.current?.close();
    (videoRef.current?.srcObject as MediaStream | null)?.getTracks().forEach((track) => track.stop());
  }, []);
  const change = (key: keyof typeof controls, value: number) => setControls((current) => ({ ...current, [key]: value }));
  const capture = () => { setFlash(true); setNotice("Glow shot captured · kept on this device"); window.setTimeout(() => setFlash(false), 180); };
  const moveLight = (event: React.PointerEvent<HTMLDivElement>) => {
    if (cameraOn || event.buttons !== 1) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setTip({ x: Math.max(10, Math.min(90, ((event.clientX - rect.left) / rect.width) * 100)), y: Math.max(12, Math.min(75, ((event.clientY - rect.top) / rect.height) * 100)) });
  };

  return (
    <main className="gp-shell">
      <section className="gp-app" aria-label="GlowPoint live camera studio">
        <div ref={cameraRef} className="gp-camera" onPointerMove={moveLight}>
          <img className={`gp-demo ${cameraOn ? "is-hidden" : ""}`} src="/glowpoint-demo.jpg" alt="A person pointing a glowing fingertip in a dim room" />
          <video ref={videoRef} className={`gp-video ${cameraOn ? "is-live" : ""}`} autoPlay muted playsInline />
          <div className="gp-vignette" />
          {beamOn && (!cameraOn || handVisible) && <div className={`gp-beam ${mode}`} style={{ left: `${tip.x}%`, top: `${tip.y}%`, width: `${22 + controls.distance * 0.48}%`, height: `${7 + controls.beam * 0.13}%`, color, opacity: 0.12 + controls.brightness / 500, filter: `blur(${2 + controls.softness / 25}px)`, transform: `translate(0, -50%) rotate(${beamAngle}deg)` }} />}
          {(!cameraOn || handVisible) && <button className="gp-light" aria-label="Tracked index fingertip light" style={{ left: `${tip.x}%`, top: `${tip.y}%`, color, transform: `translate(-50%, -50%) scale(${0.7 + controls.glow / 150})`, opacity: 0.55 + controls.brightness / 220 }}><span /></button>}
          {(!cameraOn || handVisible) && <div className="gp-face-light" style={{ background: color, opacity: controls.brightness / 1500, WebkitMaskImage: `radial-gradient(circle at ${tip.x}% ${tip.y}%, black 0%, black 4%, transparent ${18 + controls.glow / 5}%)`, maskImage: `radial-gradient(circle at ${tip.x}% ${tip.y}%, black 0%, black 4%, transparent ${18 + controls.glow / 5}%)` }} />}
          {flash && <div className="gp-flash" />}
          <header className="gp-topbar">
            <div className="gp-brand"><span className="gp-logo">✦</span><span>GlowPoint</span></div>
            <div className="gp-top-actions"><button className="gp-icon" aria-label="Reset settings" onClick={() => { setControls(defaults); setColor(colors[0].value); setBeamOn(true); setMode("focus"); setNotice("Settings reset"); }}>↻</button><button className="gp-icon" aria-label="Open settings" onClick={() => setPanel((value) => !value)}>•••</button></div>
          </header>
          <div className="gp-status"><span className={permission === "denied" ? "warn" : ""} />{notice}</div>
          <aside className="gp-rail">
            <button className={`gp-tool ${beamOn ? "active" : ""}`} onClick={() => setBeamOn((value) => !value)}><b>⌁</b><small>Beam</small></button>
            <button className={`gp-tool ${mode === "ambient" ? "active" : ""}`} onClick={() => setMode((value) => value === "focus" ? "ambient" : "focus")}><b>☼</b><small>{mode === "focus" ? "Focus" : "Ambient"}</small></button>
            <button className={`gp-tool ${panel ? "active" : ""}`} onClick={() => setPanel((value) => !value)}><b>≡</b><small>Tune</small></button>
          </aside>
          {panel && <div className="gp-tune-panel">
            <div className="gp-panel-title"><span>Light lab</span><button onClick={() => setPanel(false)}>×</button></div>
            {(Object.keys(controls) as (keyof typeof controls)[]).map((key) => <label key={key}><span>{key === "glow" ? "Glow size" : key === "beam" ? "Beam width" : key}<output>{controls[key]}%</output></span><input type="range" value={controls[key]} onChange={(e) => change(key, Number(e.target.value))} style={{ accentColor: color }} /></label>)}
          </div>}
          <div className="gp-bottom">
            <div className="gp-mode-row"><button className={mode === "focus" ? "selected" : ""} onClick={() => setMode("focus")}>Spotlight</button><button className={mode === "ambient" ? "selected" : ""} onClick={() => setMode("ambient")}>Ambient</button></div>
            <div className="gp-colors" aria-label="Light colors">
              {colors.map((item) => <button key={item.name} aria-label={`${item.name} light`} className={color === item.value ? "selected" : ""} onClick={() => setColor(item.value)}><span style={{ background: item.value }} /></button>)}
              <label className="gp-custom" aria-label="Custom light color">＋<input type="color" value={color} onChange={(e) => setColor(e.target.value)} /></label>
            </div>
            <div className="gp-capture-row"><button className="gp-gallery" aria-label="Recent captures"><span /></button><button className={`gp-shutter ${recording ? "recording" : ""}`} aria-label="Capture photo" onClick={capture}><span /></button><button className="gp-record" aria-label={recording ? "Stop recording" : "Record video"} onClick={() => { setRecording((value) => !value); setNotice(recording ? "Video saved locally" : "Recording glow clip…"); }}><span /></button></div>
          </div>
        </div>
        {!cameraOn && <div className="gp-camera-prompt"><div><span>◉</span><p><b>{permission === "denied" ? "Demo mode" : "Light up the real world"}</b><small>{permission === "denied" ? "Camera access is off. You can still explore every control." : "Your camera stays on this device. Nothing is uploaded."}</small></p></div><button onClick={startCamera}>{permission === "denied" ? "Try camera again" : "Use my camera"}</button></div>}
      </section>
      <p className="gp-privacy"><span>●</span> On-device preview · your moments stay yours</p>
    </main>
  );
}
