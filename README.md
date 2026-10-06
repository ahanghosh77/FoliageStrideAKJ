# FoliageStride AI 🏃‍♂️🍁

> **Scenic Autumn Run & Park Route Explorer — Powered by Google Gemma 2**  
> *Built for Hacktoberfest 2026 Open-Source AI Challenge Week 1: Touch Grass*

[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest-2026%20Week%201-orange.svg)](https://dev.to/challenges/hacktoberfest-week1-2026-10-05)
[![Model](https://img.shields.io/badge/Model-Google%20Gemma%202-purple.svg)](https://ai.google.dev/gemma)
[![Offline First](https://img.shields.io/badge/Inference-Local%20%2F%20Offline-success.svg)](#)
[![Zero Cloud Fees](https://img.shields.io/badge/API%20Costs-%240.00-blue.svg)](#)

---

## 🍃 Overview

Modern fitness apps trap runners in endless screen time: checking paces every 30 seconds, staring at turn-by-turn map screens, or running on treadmills staring at virtual displays.

**FoliageStride AI** flips the paradigm:
1. **Choose your distance (2 km, 5 km, 8 km)** and autumn terrain (Maple & Oak canopy, riverbank, park perimeter, hilltop ridge).
2. **Synthesize a scenic route** in < 15 seconds powered by **Google Gemma 2** (via local Ollama or built-in offline engine).
3. **Commit 3–4 visual landmark checkpoints** to memory (e.g. *The Century Red Oak Grove*, *Heron Creek Crossing*).
4. **Pocket your phone** and run free! Audio cadence chimes mark split checkpoints without needing to glance at a screen.
5. Log your run notes and outdoor streak into the offline **Stride Journal** upon returning home.

---

## 🌟 Key Features

- **Google Gemma 2 Local Inference**: Connects directly to `localhost:11434` running `gemma2:2b` or `gemma2:9b` with zero telemetry and zero server bills.
- **Graceful Offline Fallback Engine**: If Ollama is not installed or offline, the app seamlessly runs a deterministic autumn trail routing algorithm.
- **Elevation & Course Profile SVG**: Visualizes course gradient and foliage density for optimal pacing.
- **Hands-Free Pocket Stopwatch**: Features a Web Audio API synthesized cadence chime for mile/km splits so runners can keep their phone in their pocket.
- **Sensory Breathwork Coaching**: Provides natural breathing cadences (3:3 inhalation/exhalation) and tactile cues (the acoustic sound of fallen dry leaves underfoot).
- **Persistent Stride Journal**: Saves outdoor run sessions, kilometers completed, and streak count in browser `localStorage` with JSON export support.

---

## 🚀 Quick Start

### 1. Clone & Run Locally
```bash
git clone https://github.com/ahanghosh77/foliagestride-ai.git
cd foliagestride-ai
```
Simply double-click `index.html` or open it with any local web server (e.g., VS Code Live Server, `npx serve`, or Python `python -m http.server 3000`).

### 2. (Optional) Run with Local Google Gemma 2 via Ollama
Ensure you have [Ollama](https://ollama.ai) installed:
```bash
ollama run gemma2:2b
```
In FoliageStride AI, click **Model** in the navbar to confirm the endpoint `http://localhost:11434/api/generate`.

---

## 🏆 Hacktoberfest 2026 Submission

- **Challenge**: Hacktoberfest Open-Source AI Challenge Week 1: Touch Grass (October 5–11, 2026)
- **Target Category**: Best Use of Gemma ($200 USD)
- **Developer**: Antigravity Pair-Programming Team
