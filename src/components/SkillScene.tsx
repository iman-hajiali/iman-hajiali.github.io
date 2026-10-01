"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { en } from "@/content/en";

const SkillCanvas = dynamic(() => import("./SkillCanvas"), {
  ssr: false,
  loading: () => <div className="scene-fallback">{en.skills.fallback}</div>,
});

export default function SkillScene() {
  const container = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [motion, setMotion] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setMotion(!query.matches);
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateMotion();
    updateVisibility();
    query.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    const warmup = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          warmup.disconnect();
        }
      },
      { rootMargin: "250px" },
    );
    const viewport = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    if (container.current) {
      warmup.observe(container.current);
      viewport.observe(container.current);
    }
    return () => {
      query.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
      warmup.disconnect();
      viewport.disconnect();
    };
  }, []);

  return (
    <div ref={container} className="skill-scene" aria-hidden="true">
      {entered && motion ? (
        <SkillCanvas active={visible && pageVisible} />
      ) : (
        <div className="scene-fallback">{en.skills.fallback}</div>
      )}
    </div>
  );
}
