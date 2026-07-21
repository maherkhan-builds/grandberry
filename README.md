<div align="center">

![GlowPoint animated header](https://capsule-render.vercel.app/api?type=waving&height=280&color=gradient&customColorList=12,20,24,30&text=GlowPoint&fontColor=ffffff&fontSize=82&fontAlignY=38&desc=Point.%20Glow.%20Create.&descAlignY=60&animation=fadeIn)

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Space+Grotesk&weight=700&size=24&pause=900&color=FFB98C&center=true&vCenter=true&width=760&lines=Your+fingertip+is+the+light+source+%E2%9C%A6;Paint+the+real+world+with+light;A+privacy-first+camera+experience)](https://git.io/typing-svg)

<p><strong>A cinematic camera playground that turns a pointing fingertip into a responsive virtual light.</strong></p>

![Next.js](https://img.shields.io/badge/Next.js_16-09090D?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-111827?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-17131D?style=for-the-badge&logo=typescript&logoColor=7CA9FF)
![Privacy](https://img.shields.io/badge/Privacy-On_Device-19151F?style=for-the-badge&logo=shield&logoColor=64F5B2)
![Status](https://img.shields.io/badge/Status-Interactive_Prototype-FF8A7A?style=for-the-badge)

[Live Demo](https://glowpoint.vercel.app) · [Features](#-what-it-can-do) · [Quick Start](#-run-it-locally) · [How It Works](#-how-it-works)

</div>

---

## ✨ Meet GlowPoint

GlowPoint explores a tiny bit of sci-fi magic: what if pointing at something could light it up?

It wraps a live device-camera experience in a tactile, social-ready interface. Choose a color, shape the beam, tune the softness, and capture the moment—without sending the camera feed to a server. The current release uses Google MediaPipe in the browser to detect 21 hand landmarks, attach the glow to index landmark 8, and aim the beam from the index-finger joint toward the fingertip.

![GlowPoint social preview](public/og.jpg)

## 🔗 Live demo

### **[Launch GlowPoint →](https://glowpoint.vercel.app)**

The production experience is hosted on Vercel with HTTPS enabled for browser camera access.

## 💫 What it can do

| Experience | What it feels like |
|---|---|
| **Live camera mode** | Opens the front camera with a privacy-first permission flow. |
| **Fingertip glow** | A bright, layered light source with natural-looking bloom and falloff. |
| **Projected beam** | Toggle a soft directional beam and adjust its width and softness. |
| **Light lab** | Tune brightness, glow size, beam width, softness, and distance in real time. |
| **Color carousel** | Jump between warm, cool, yellow, blue, pink, purple, green, and red. |
| **Custom color** | Pick literally any glow color. Main-character lighting unlocked. |
| **Spotlight / Ambient** | Switch from a focused beam to a wide, dreamy wash. |
| **Capture moments** | Photo-flash feedback and short-video recording states. |
| **Safe fallback** | Camera-denied demo mode keeps every control explorable. |
| **One-tap reset** | Return the entire light setup to its original look. |

## 📸 Inside the app

<div align="center">
  <img src="public/glowpoint-demo.jpg" alt="GlowPoint warm fingertip light demo" width="390" />
  <p><em>A warm fingertip light with believable face and wall illumination.</em></p>
</div>

## 🫶 How to use it

1. Open GlowPoint on a phone or webcam-enabled computer.
2. Tap **Use my camera** and allow camera access.
3. Hold one hand in frame and point your index finger—the glow follows the real fingertip.
4. Swipe through the color carousel or tap **＋** for a custom shade.
5. Use **Beam**, **Focus/Ambient**, and **Tune** to shape the lighting.
6. Tap the center shutter for a glow shot or the red control for a short clip.
7. Hit **↻** whenever you want the original setup back.

> Camera access requires HTTPS in production or `localhost` during development. GlowPoint does not upload the camera feed or automatically save captures.

## 🧠 How it works

```text
Device camera
     ↓
Local video preview
     ↓
Fingertip position → smoothed tracking point
     ↓
Glow core + bloom + directional beam + scene tint
     ↓
Interactive controls → final camera composition
```

The interface is a client-side React experience. `getUserMedia()` provides the live camera stream, while MediaPipe Hand Landmarker runs locally in `VIDEO` mode. A smoothing filter stabilizes index landmark 8, and the vector from landmark 6 to landmark 8 controls beam direction. Layered CSS lighting builds the luminous core, bloom, beam, face tint, falloff, and ambient modes. No backend is required.

### Computer-vision pipeline

- Detect one hand and its 21 normalized landmarks in each camera frame.
- Track the index-finger tip and infer direction from the PIP-to-tip vector.
- Apply confidence gating when no hand or unclear pointing is detected.
- Smooth coordinates to suppress jitter while preserving responsive motion.
- Mirror the coordinates to match the front-camera preview.
- Keep inference, video, and interaction data on the device.

## 🛠️ Built with

- **Next.js 16 App Router** for the application shell and production build
- **React 19** for interactive camera and lighting state
- **TypeScript** for predictable controls and browser-media APIs
- **Tailwind CSS 4 + custom CSS** for responsive glassmorphism and layered light
- **MediaDevices API** for local camera access
- **CSS blend modes, masks, gradients, filters, and animation** for the glow engine
- **Vercel** for HTTPS hosting and camera-safe delivery

## 🚀 Run it locally

```bash
git clone https://github.com/maherkhan-builds/grandberry.git
cd grandberry
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), then allow camera access. For a production check:

```bash
npm run build
npm start
```

## 🔐 Privacy by design

- Camera processing stays in the browser whenever possible.
- The prototype does not upload camera frames.
- Nothing is saved unless the user explicitly chooses to save it.
- Denied camera access automatically falls back to an explorable demo.
- The experience is designed for future fully on-device landmark detection.

## 🗺️ Roadmap

- [ ] MediaPipe index-fingertip landmark tracking
- [ ] Confidence-aware hand and pointing messages
- [ ] One Euro filter for low-latency motion smoothing
- [ ] WebGL/WebGPU scene relighting and segmentation
- [ ] Local photo and MediaRecorder video export
- [ ] Rear-camera switch and mobile PWA install
- [ ] Accessibility and reduced-motion controls

## 🔎 Keywords

`computer vision` · `hand tracking` · `finger tracking` · `index fingertip detection` · `MediaPipe` · `camera app` · `real-time lighting` · `virtual light` · `augmented reality` · `AR camera` · `WebGL` · `WebGPU` · `Next.js` · `React` · `TypeScript` · `glassmorphism` · `Gen Z UI` · `creative technology` · `privacy-first` · `on-device AI` · `social camera` · `interactive lighting`

---

<div align="center">
  <h3>Built for the moment when your finger becomes the sun ☀️</h3>
  <p>If GlowPoint sparks an idea, drop the repo a ⭐</p>
</div>

![GlowPoint footer](https://capsule-render.vercel.app/api?type=waving&height=150&section=footer&color=gradient&customColorList=12,20,24,30&animation=twinkling)
