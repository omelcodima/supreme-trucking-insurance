"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import type { HeroSceneController } from "@/lib/createHeroScene";

export default function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<HeroSceneController | null>(null);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.closest<HTMLElement>(".home-hero");
    if (!canvas || !hero) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let request: AbortController | undefined;
    const update = () => {
      request?.abort();
      controllerRef.current = null;
      setReady(false);
      if (motion.matches) return;
      const activeRequest = new AbortController();
      request = activeRequest;
      import("@/lib/createHeroScene")
        .then(({ createHeroScene }) => {
          if (activeRequest.signal.aborted) return null;
          return createHeroScene(canvas, hero, activeRequest.signal, () =>
            setReady(false),
          );
        })
        .then((controller) => {
          if (!controller || activeRequest.signal.aborted) return;
          controllerRef.current = controller;
          setPaused(false);
          setReady(true);
        })
        .catch(() => {
          if (!activeRequest.signal.aborted) setReady(false);
        });
    };
    update();
    motion.addEventListener("change", update);
    return () => {
      request?.abort();
      motion.removeEventListener("change", update);
    };
  }, []);

  const label = paused
    ? "Resume interactive motion"
    : "Pause interactive motion";
  return (
    <>
      <div className="hero-scene" data-ready={ready} aria-hidden="true">
        <canvas ref={canvasRef} />
      </div>
      {ready && (
        <button
          type="button"
          className="hero-motion-control"
          aria-label={label}
          title={label}
          onClick={() => {
            controllerRef.current?.setPaused(!paused);
            setPaused(!paused);
          }}
        >
          {paused ? (
            <Play size={16} aria-hidden="true" />
          ) : (
            <Pause size={16} aria-hidden="true" />
          )}
        </button>
      )}
    </>
  );
}
