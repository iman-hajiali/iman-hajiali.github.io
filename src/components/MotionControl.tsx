"use client";

import { useEffect, useState } from "react";

export default function MotionControl() {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let saved = false;
    try {
      saved = localStorage.getItem("iman-motion-paused") === "true";
    } catch {
      // Storage can be unavailable in private browsing; the control still works.
    }
    document.documentElement.dataset.motionPaused = String(saved);
    setPaused(saved);
    window.dispatchEvent(new Event("motion-preference-change"));
  }, []);

  const toggle = () => {
    const next = !paused;
    setPaused(next);
    document.documentElement.dataset.motionPaused = String(next);
    try {
      localStorage.setItem("iman-motion-paused", String(next));
    } catch {
      // Keep the in-memory preference for this visit.
    }
    window.dispatchEvent(new Event("motion-preference-change"));
  };

  return (
    <button
      className="motion-preference"
      type="button"
      onClick={toggle}
      aria-pressed={paused}
    >
      {paused ? "Resume animation" : "Reduce motion"}
    </button>
  );
}
