"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { chapterIds, type StoryState } from "./story";
import styles from "./Studio.module.css";

const StudioCanvas = dynamic(() => import("./StudioCanvas"), { ssr: false });

export default function Studio({
  surface = "preview",
}: {
  surface?: "home" | "preview";
}) {
  const story = useRef<StoryState>({
    phase: 0,
    pointerX: 0,
    pointerY: 0,
    mobile: false,
  });
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(true);
  const [chapter, setChapter] = useState(0);
  const currentChapter = useRef(0);
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => setFailed(true), []);

  useEffect(() => {
    if (ready || failed || !active) return;
    // Never leave the resume inaccessible if WebGL or the asset cannot load.
    const failTimer = window.setTimeout(() => setFailed(true), 20000);
    return () => {
      window.clearTimeout(failTimer);
    };
  }, [ready, failed, active]);

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () =>
      setPaused(
        media.matches ||
          document.documentElement.dataset.motionPaused === "true",
      );
    const visibility = () => setActive(!document.hidden);
    let landmarks: number[] = [];
    const measure = () => {
      story.current.mobile = innerWidth <= 800;
      const readingOffset = innerHeight * 0.32;
      landmarks = chapterIds.map((id, index) => {
        const section = document.getElementById(id);
        return index === 0
          ? 0
          : section
            ? Math.max(
                1,
                section.getBoundingClientRect().top + scrollY - readingOffset,
              )
            : Infinity;
      });
    };
    const update = () => {
      let index = 0;
      for (let i = 1; i < landmarks.length; i++)
        if (scrollY >= landmarks[i]) index = i;
      const end = landmarks[index + 1] ?? landmarks[index];
      const interval = Math.max(1, end - landmarks[index]);
      const progress = Math.min(
        1,
        Math.max(0, (scrollY - landmarks[index]) / interval),
      );
      const transition = Math.min(1, Math.max(0, (progress - 0.58) / 0.42));
      story.current.phase = Math.min(chapterIds.length - 1, index + transition);
      const displayed = Math.round(story.current.phase);
      if (currentChapter.current !== displayed) {
        currentChapter.current = displayed;
        setChapter(displayed);
      }
    };
    const resize = () => {
      measure();
      update();
    };
    const pointer = (event: PointerEvent) => {
      story.current.pointerX = (event.clientX / innerWidth) * 2 - 1;
      story.current.pointerY = (event.clientY / innerHeight) * 2 - 1;
    };
    updateMotion();
    visibility();
    measure();
    update();
    media.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", pointer, { passive: true });
    window.addEventListener("motion-preference-change", updateMotion);
    const observer = new ResizeObserver(resize);
    const main = document.getElementById("main");
    if (main) observer.observe(main);
    return () => {
      media.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", pointer);
      window.removeEventListener("motion-preference-change", updateMotion);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const id = chapterIds[chapter];
    document.documentElement.dataset.chapter = id;
    let theme = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    if (!theme) {
      theme = document.createElement("meta");
      theme.name = "theme-color";
      document.head.appendChild(theme);
    }
    theme.content = id === "skills" ? "#28242a" : "#f4ede3";
    return () => {
      delete document.documentElement.dataset.chapter;
    };
  }, [chapter]);

  return (
    <>
      <div
        className={styles.stage}
        data-surface={surface}
        data-chapter={chapterIds[chapter]}
      >
        <div className={styles.visual} aria-hidden="true">
          {!failed && (
            <StudioCanvas
              story={story}
              paused={paused}
              active={active}
              onReady={onReady}
              onFailure={onFailure}
            />
          )}
        </div>
      </div>
      {!ready && !failed && (
        <div
          className={styles.loadingScreen}
          role="status"
          aria-label="Preparing Iman's studio"
        >
          <div className={styles.computer} aria-hidden="true">
            <div className={styles.monitor}>
              <div className={styles.screen}>
                <div className={styles.screenTop}>
                  IMAN / STUDIO <span>01</span>
                </div>
                <div className={styles.terminal}>
                  <p>&gt; opening the studio</p>
                  <p>&gt; setting the scene</p>
                  <p>
                    &gt; ready to explore
                    <span className={styles.cursor}>_</span>
                  </p>
                </div>
              </div>
              <div className={styles.powerLight} />
            </div>
            <div className={styles.computerBase} />
          </div>
          <span className={styles.loadingLabel}>Preparing the studio</span>
        </div>
      )}
    </>
  );
}
