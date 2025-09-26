import React, { useEffect, useRef, useState } from "react";

/**
 * AnxietyEaseGame.jsx
 *
 * A hyper-realistic breathing mini-game built with plain React (JSX).
 * - Smooth, frame-accurate animations (requestAnimationFrame)
 * - Sound (WebAudio) + optional vibration feedback
 * - User interaction: press/tap when inhale/exhale starts to score accuracy
 * - Configurable cycle structure (inhale/hold/exhale/hold), difficulty presets
 * - Accessible labels, keyboard controls (Space = action, P = pause)
 * - Call `onComplete(score)` when a session ends (score 0-100)
 *
 * Props:
 * - onComplete(score)  => callback when session finishes
 * - cycles (number)    => how many breathing cycles (default 6)
 * - preset (string)    => 'relax' | 'box' | 'energize' (default 'relax')
 *
 * Uses plain CSS injected via a <style> tag the first time the component mounts.
 */

const DEFAULT_PRESETS = {
  relax: { inhale: 4.0, hold1: 2.0, exhale: 6.0, hold2: 2.0 },    // calming long exhale
  box:   { inhale: 4.0, hold1: 4.0, exhale: 4.0, hold2: 4.0 },    // box breathing
  energize:{ inhale: 2.5, hold1: 1.0, exhale: 2.5, hold2: 1.0 },  // faster
};

let styleInjected = false;

export default function AnxietyEaseGame({ onComplete = () => {}, cycles = 6, preset = "relax" }) {
  // game / session states
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [phase, setPhase] = useState("idle"); // "inhale" | "hold1" | "exhale" | "hold2" | "complete" | "idle"
  const [timeInPhase, setTimeInPhase] = useState(0); // seconds elapsed in current phase
  const [score, setScore] = useState(0); // 0..100
  const [userAttempts, setUserAttempts] = useState([]); // { when, phase, accuracy }
  const [soundOn, setSoundOn] = useState(true);
  const [vibrateOn, setVibrateOn] = useState(true);
  const [difficulty, setDifficulty] = useState(preset); // string -> use presets table
  const [targetScale, setTargetScale] = useState(1); // visual scale of breathing circle

  // refs for animation loop & audio
  const rafRef = useRef(null);
  const lastTimestampRef = useRef(null);
  const phaseDurationRef = useRef({}); // current durations
  const sessionStartRef = useRef(null);
  const audioCtxRef = useRef(null);
  const oscillatorRef = useRef(null);
  const scoringRef = useRef({ perfectWindow: 0.6, goodWindow: 1.2 }); // seconds tolerance
  const totalPhasesRef = useRef(4 * cycles);

  // initialize CSS once
  useEffect(() => {
    if (styleInjected) return;
    styleInjected = true;
    const css = `
      .ae-game-root { font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; color: #0f172a; }
      .ae-container { max-width: 900px; margin: 20px auto; padding: 20px; }
      .ae-hero { display:flex; gap:24px; align-items:center; justify-content:center; flex-wrap:wrap; }
      .ae-circle-wrap { width: 360px; height:360px; display:flex; align-items:center; justify-content:center; position:relative; }
      .ae-circle {
        width: 180px; height:180px; border-radius:9999px;
        display:flex; align-items:center; justify-content:center;
        box-shadow: 0 10px 30px rgba(14, 165, 233, 0.12), inset 0 -6px 18px rgba(0,0,0,0.06);
        background: radial-gradient(circle at 30% 30%, rgba(99,102,241,0.12), rgba(99,102,241,0.04));
        transition: box-shadow 0.2s ease;
      }
      .ae-halo {
        position:absolute; width:420px; height:420px; border-radius:9999px; filter: blur(36px);
        background: conic-gradient(from 180deg at 50% 50%, rgba(99,102,241,0.12), rgba(99,102,241,0.06), rgba(99,102,241,0.08));
        opacity: 0.9; transform: translateZ(0);
      }
      .ae-text { text-align:center; }
      .ae-phase { font-weight:700; font-size:20px; margin-bottom:8px; }
      .ae-sub { color: #475569; font-size:14px; margin-bottom:12px; }
      .ae-controls { display:flex; gap:8px; align-items:center; justify-content:center; flex-wrap:wrap; margin-top:12px; }
      .ae-btn { background:#0f172a; color:white; padding:10px 14px; border-radius:10px; border:none; cursor:pointer; }
      .ae-btn.ghost { background:transparent; color:#0f172a; border:1px solid rgba(15,23,42,0.08); }
      .ae-score { margin-top:12px; text-align:center; font-weight:700; }
      .ae-info { margin-top:16px; display:flex; gap:10px; flex-wrap:wrap; justify-content:center; color:#64748b; font-size:13px; }
      .ae-progress { height:8px; background:#e6eefc; border-radius:9999px; overflow:hidden; width:100%; max-width:680px; margin:10px auto; }
      .ae-progress > i { display:block; height:100%; background:linear-gradient(90deg,#6366f1,#06b6d4); width:0%; transition:width 0.2s linear; }
      .ae-difficulty { display:flex; gap:6px; }
      @media (max-width:640px) {
        .ae-circle-wrap { width:260px; height:260px; }
        .ae-circle { width:140px; height:140px; }
      }
    `;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }, []);

  // helper: get preset durations
  function getPresetDurations(name) {
    return DEFAULT_PRESETS[name] || DEFAULT_PRESETS.relax;
  }

  // helper: start audio beep for a brief cue (ramp for soft sound)
  function playBeep(frequency = 440, duration = 0.18) {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtxRef.current;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = frequency;
      g.gain.value = 0;
      o.connect(g);
      g.connect(ctx.destination);
      const now = ctx.currentTime;
      // quick ramp in/out for pleasant tone
      g.gain.linearRampToValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.15, now + 0.01);
      o.start(now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      o.stop(now + duration + 0.02);
      oscillatorRef.current = o;
    } catch (e) {
      // audio may be blocked - ignore silently
    }
  }

  // vibration helper
  function vibrate(ms = 60) {
    if (!vibrateOn) return;
    if (navigator.vibrate) navigator.vibrate(ms);
  }

  // user "action" to register timing hit (spacebar or tap)
  function registerAction() {
    if (!isRunning) {
      // start a fresh session on first action
      startSession();
      return;
    }
    if (isPaused) return;

    const when = performance.now();
    const t = timeInPhase; // seconds
    const dur = phaseDurationRef.current[phase] || 0.001;
    // compute distance to phase start (we want user to hit near phase start)
    const deltaFromPhaseStart = t; // seconds since phase start
    // scoring: closer to 0 is better; measure absolute difference
    const perfectWindow = scoringRef.current.perfectWindow;
    const goodWindow = scoringRef.current.goodWindow;

    let accuracy = Math.abs(deltaFromPhaseStart);
    let points = 0;
    if (accuracy <= perfectWindow) points = 10;
    else if (accuracy <= goodWindow) points = 6;
    else if (accuracy <= goodWindow * 2) points = 3;
    else points = 0;

    // slightly reward pressing on expected phase transitions (when phase is inhale/exhale)
    if (phase === "inhale" || phase === "exhale") {
      // small bonus if within 0.12s of start
      if (accuracy <= 0.12) points += 4;
    }

    setUserAttempts((prev) => [...prev, { when, phase, accuracy, points }]);
    setScore((s) => Math.min(100, s + points));
    if (soundOn) playBeep(440 + (points * 30), 0.12);
    vibrate(points > 0 ? 40 : 18);
  }

  // keyboard handlers
  useEffect(() => {
    function onKey(e) {
      if (e.code === "Space") {
        e.preventDefault();
        registerAction();
      } else if (e.key.toLowerCase() === "p") {
        togglePause();
      } else if (e.key.toLowerCase() === "r") {
        resetSession();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, phase, timeInPhase, isPaused, soundOn, vibrateOn]);

  // begin a session
  function startSession() {
    const durations = getPresetDurations(difficulty);
    phaseDurationRef.current = durations;
    totalPhasesRef.current = cycles * 4;
    setIsRunning(true);
    setIsPaused(false);
    setCurrentCycle(0);
    setPhase("inhale");
    setTimeInPhase(0);
    setScore(0);
    setUserAttempts([]);
    sessionStartRef.current = performance.now();
    lastTimestampRef.current = null;
    // start audio context on user gesture (will be done when playBeep called)
    if (soundOn) playBeep(680, 0.08);
    vibrate(30);
    // start loop
    rafRef.current = requestAnimationFrame(loop);
  }

  // pause/resume
  function togglePause() {
    if (!isRunning) return;
    if (!isPaused) {
      // pause
      setIsPaused(true);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      if (soundOn && audioCtxRef.current) audioCtxRef.current.suspend?.();
    } else {
      setIsPaused(false);
      lastTimestampRef.current = null;
      rafRef.current = requestAnimationFrame(loop);
      if (soundOn && audioCtxRef.current) audioCtxRef.current.resume?.();
    }
  }

  // reset
  function resetSession() {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentCycle(0);
    setPhase("idle");
    setTimeInPhase(0);
    setScore(0);
    setUserAttempts([]);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }
    oscillatorRef.current = null;
  }

  // high-level phase advance
  function advancePhase() {
    const order = ["inhale", "hold1", "exhale", "hold2"];
    const idx = order.indexOf(phase);
    const nextIdx = (idx + 1) % order.length;
    const nextPhase = order[nextIdx];
    // if moving from hold2 to inhale, increment cycle
    if (phase === "hold2") {
      setCurrentCycle((c) => {
        const nextCycle = c + 1;
        if (nextCycle >= cycles) {
          setPhase("complete");
          finishSession();
          return nextCycle;
        }
        return nextCycle;
      });
    } else {
      setPhase(nextPhase);
    }
    setTimeInPhase(0);
    // play subtle cue
    if (soundOn) {
      // inhale -> higher, exhale -> lower
      const freq = nextPhase === "inhale" ? 540 : nextPhase === "exhale" ? 420 : 480;
      playBeep(freq, 0.08);
    }
    vibrate(20);
  }

  // finish session
  function finishSession() {
    setIsRunning(false);
    setIsPaused(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    // compute final score normalization
    const baseScore = score;
    // reward consistent attempts (more attempts -> more engagement)
    const attempts = userAttempts.length;
    const engagementBonus = Math.min(10, Math.floor(attempts / 2));
    const finalScore = Math.max(0, Math.min(100, baseScore + engagementBonus));
    setScore(finalScore);
    // callback
    setTimeout(() => onComplete(finalScore), 250);
  }

  // main animation loop driving smooth scale and timing
  function loop(timestamp) {
    if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
    const dt = (timestamp - lastTimestampRef.current) / 1000; // seconds
    lastTimestampRef.current = timestamp;
    if (!isRunning || isPaused) return;

    // update time in phase
    setTimeInPhase((t) => {
      const newT = t + dt;
      const durations = phaseDurationRef.current;
      const dur = durations[phase] || 0.001;
      // compute smooth scale:
      // inhale  : scale grows from 0.72 -> 1.18 (ease)
      // hold    : hold scale stable
      // exhale  : scale shrinks 1.18 -> 0.72
      // hold2   : stable
      let scale = 1;
      if (phase === "inhale") {
        const p = Math.min(1, newT / dur);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - p, 3);
        scale = 0.72 + (1.18 - 0.72) * eased;
      } else if (phase === "exhale") {
        const p = Math.min(1, newT / dur);
        // easeInCubic
        const eased = Math.pow(p, 3);
        scale = 1.18 - (1.18 - 0.72) * eased;
      } else if (phase === "hold1" || phase === "hold2") {
        // keep at inhale max or exhale min depending on where we came from
        const prev = phase === "hold1" ? 1.18 : 0.72;
        scale = prev;
      } else {
        scale = 1;
      }
      setTargetScale(scale);

      // advance phase if needed
      if (newT >= dur) {
        // advance
        advancePhase();
        return 0;
      }
      return newT;
    });

    // update progress bar via DOM side-effect next paint
    rafRef.current = requestAnimationFrame(loop);
  }

  // update progress bar percentage
  const progressPercent = Math.min(
    100,
    (currentCycle / Math.max(1, cycles)) * 100 + (["inhale", "hold1", "exhale", "hold2"].indexOf(phase) / 4) * (100 / Math.max(1, cycles))
  );

  // hook: if running, ensure loop started
  useEffect(() => {
    if (isRunning && !rafRef.current && !isPaused) {
      lastTimestampRef.current = null;
      rafRef.current = requestAnimationFrame(loop);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, isPaused]);

  // small effect to update styles on circle (use inline transform)
  const circleStyle = {
    transform: `scale(${targetScale})`,
    transition: "transform 120ms linear", // small smoothing
  };

  // UI: computed subtext and nice timers
  const durations = getPresetDurations(difficulty);
  const phaseReadable = {
    inhale: "Inhale",
    hold1: "Hold",
    exhale: "Exhale",
    hold2: "Hold",
    idle: "Ready",
    complete: "Complete",
  }[phase] || phase;

  const timeLeft = Math.max(0, (phaseDurationRef.current[phase] || durations[phase] || 0) - timeInPhase);

  return (
    <div className="ae-game-root">
      <div className="ae-container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <h2 style={{ margin: 0 }}>AnxietyEase — Breath Trainer (Mini-Game)</h2>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }} className="ae-difficulty" aria-hidden>
              <button
                className={`ae-btn ghost`}
                onClick={() => setDifficulty("relax")}
                aria-pressed={difficulty === "relax"}
              >
                Relax
              </button>
              <button
                className={`ae-btn ghost`}
                onClick={() => setDifficulty("box")}
                aria-pressed={difficulty === "box"}
              >
                Box
              </button>
              <button
                className={`ae-btn ghost`}
                onClick={() => setDifficulty("energize")}
                aria-pressed={difficulty === "energize"}
              >
                Energize
              </button>
            </div>

            <button
              className="ae-btn ghost"
              onClick={() => setSoundOn((s) => !s)}
              aria-pressed={soundOn}
              title="Toggle sound cues"
            >
              {soundOn ? "Sound on" : "Sound off"}
            </button>
            <button
              className="ae-btn ghost"
              onClick={() => setVibrateOn((v) => !v)}
              aria-pressed={vibrateOn}
              title="Toggle vibration"
            >
              {vibrateOn ? "Vibrate on" : "Vibrate off"}
            </button>
          </div>
        </div>

        <div className="ae-hero" style={{ marginTop: 18 }}>
          <div
            className="ae-circle-wrap"
            role="button"
            aria-label="Breath circle. Tap or press Space to register action or start session."
            tabIndex={0}
            onClick={registerAction}
            onKeyDown={(e) => {
              if (e.key === "Enter") registerAction();
            }}
          >
            <div className="ae-halo" aria-hidden style={{ opacity: isRunning ? 1 : 0.5 }} />
            <div className="ae-circle" style={circleStyle}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{phaseReadable}</div>
                <div style={{ color: "#64748b", marginTop: 6 }}>{timeLeft.toFixed(1)}s</div>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 260 }}>
            <div className="ae-text">
              <div className="ae-phase">{isRunning ? `${phaseReadable} — Cycle ${Math.min(currentCycle + 1, cycles)}/${cycles}` : "Ready to begin"}</div>
              <div className="ae-sub">
                {isRunning
                  ? "Tap / press Space when a new breathe phase starts to score points."
                  : "Tap the circle or press Space to start. Press P to pause, R to reset."}
              </div>

              <div className="ae-controls" role="toolbar" aria-label="Controls">
                {!isRunning && (
                  <button className="ae-btn" onClick={startSession} aria-label="Start session">Start</button>
                )}
                {isRunning && (
                  <button className="ae-btn" onClick={togglePause} aria-label={isPaused ? "Resume" : "Pause"}>
                    {isPaused ? "Resume" : "Pause"}
                  </button>
                )}
                <button className="ae-btn ghost" onClick={resetSession} aria-label="Reset session">Reset</button>
                <button className="ae-btn ghost" onClick={() => registerAction()} aria-label="Register action">Tap</button>
              </div>

              <div className="ae-score" aria-live="polite">Score: {score} / 100</div>

              <div className="ae-progress" aria-hidden>
                <i style={{ width: `${progressPercent}%` }} />
              </div>

              <div className="ae-info">
                <div>Cycles: {cycles}</div>
                <div>Preset: {difficulty}</div>
                <div>Attempts: {userAttempts.length}</div>
              </div>

              <div style={{ marginTop: 12, color: "#475569", fontSize: 13 }}>
                Tip: aim to tap right at the start of inhale/exhale. The game rewards accurate timing and engagement.
              </div>
            </div>
          </div>
        </div>

        {/* end-of-session summary */}
        {phase === "complete" && (
          <div style={{ marginTop: 14, textAlign: "center" }}>
            <div style={{ fontWeight: 800, fontSize: 18 }}>Session complete</div>
            <div style={{ color: "#0f172a", marginTop: 8 }}>Final score: {score} / 100</div>
            <div style={{ marginTop: 10 }}>
              <button className="ae-btn" onClick={() => { resetSession(); startSession(); }}>Play again</button>
              <button className="ae-btn ghost" onClick={() => resetSession()} style={{ marginLeft: 8 }}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
