"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const colors = [
  { name: "Warm", value: "#ffd39a" }, { name: "Cool", value: "#eaf6ff" },
  { name: "Sun", value: "#ffe45c" }, { name: "Blue", value: "#5ea7ff" },
  { name: "Pink", value: "#ff6fb7" }, { name: "Violet", value: "#9f7cff" },
  { name: "Mint", value: "#64f5b2" }, { name: "Red", value: "#ff5b5f" },
];
const defaults = { brightness: 82, glow: 58, beam: 44, softness: 72, distance: 62 };

export default function GlowPoint() {
  const videoRef = useRef<HTMLVideoElement>(null);
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
  const [notice, setNotice] = useState("Point to paint with light");

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraOn(true); setPermission("granted"); setNotice("Hand locked · tracking smoothly");
    } catch { setPermission("denied"); setNotice("Camera permission denied · demo mode active"); }
  }, []);

  useEffect(() => () => { (videoRef.current?.srcObject as MediaStream | null)?.getTracks().forEach((track) => track.stop()); }, []);
  const change = (key: keyof typeof controls, value: number) => setControls((current) => ({ ...current, [key]: value }));
  const capture = () => { setFlash(true); setNotice("Glow shot captured · kept on this device"); window.setTimeout(() => setFlash(false), 180); };
  const moveLight = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.buttons !== 1) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setTip({ x: Math.max(10, Math.min(90, ((event.clientX - rect.left) / rect.width) * 100)), y: Math.max(12, Math.min(75, ((event.clientY - rect.top) / rect.height) * 100)) });
  };

  return (
    <main className="gp-shell">
      <section className="gp-app" aria-label="GlowPoint live camera studio">
        <div className="gp-camera" onPointerMove={moveLight}>
          <img className={`gp-demo ${cameraOn ? "is-hidden" : ""}`} src="/glowpoint-demo.jpg" alt="A person pointing a glowing fingertip in a dim room" />
          <video ref={videoRef} className={`gp-video ${cameraOn ? "is-live" : ""}`} autoPlay muted playsInline />
          <div className="gp-vignette" />
          {beamOn && <div className={`gp-beam ${mode}`} style={{ left: `${tip.x}%`, top: `${tip.y}%`, color, opacity: controls.beam / 100, filter: `blur(${controls.softness / 11}px)` }} />}
          <button className="gp-light" aria-label="Tracked fingertip light. Drag to preview tracking." style={{ left: `${tip.x}%`, top: `${tip.y}%`, color, transform: `translate(-50%, -50%) scale(${0.7 + controls.glow / 150})`, opacity: 0.55 + controls.brightness / 220 }} onPointerDown={(e) => e.currentTarget.setPointerCapture(e.pointerId)}><span /></button>
          <div className="gp-face-light" style={{ background: color, opacity: controls.brightness / 850 }} />
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
