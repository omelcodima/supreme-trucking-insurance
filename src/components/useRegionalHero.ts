"use client";

import { useEffect, useRef, useState } from "react";
import { findRegionScene, type RegionScene } from "@/lib/regionalHero";

export const regionalForeground = "/images/hero-regional-foreground.webp";
const preferenceKey = "supreme-business-state-v1";

export function loadPhoto(src: string) {
  return new Promise<void>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => image.decode().then(resolve, reject);
    image.onerror = () => reject(new Error("Scene unavailable"));
    image.src = src;
  });
}

export default function useRegionalHero() {
  const [choice, setChoice] = useState("auto");
  const [detected, setDetected] = useState<RegionScene | null>(null);
  const [scene, setScene] = useState<RegionScene | null>(null);
  const manualChoice = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    async function suggest() {
      try {
        const value = sessionStorage.getItem(preferenceKey);
        const saved = findRegionScene(value);
        if (!manualChoice.current && (saved || value === "national")) setChoice(saved?.code || "national");
      } catch { /* Private browsing may disallow storage; selection still works. */ }
      try {
        const response = await fetch("/api/visitor-region", { cache: "no-store", signal: AbortSignal.any([controller.signal, AbortSignal.timeout(4000)]) });
        if (!response.ok) return;
        const data = await response.json();
        if (!controller.signal.aborted) setDetected(findRegionScene(data.state));
      } catch { /* Unknown location keeps the national homepage. */ }
    }
    void suggest();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function activate() {
      const next = choice === "auto" ? detected : findRegionScene(choice);
      try {
        if (next) await Promise.all([loadPhoto(next.asset), loadPhoto(regionalForeground)]);
        if (!cancelled) setScene(next);
      } catch {
        if (!cancelled) setScene(null);
      }
    }
    void activate();
    return () => { cancelled = true; };
  }, [choice, detected]);

  function choose(value: string) {
    if (value !== "auto" && value !== "national" && !findRegionScene(value)) return;
    manualChoice.current = true;
    setChoice(value);
    try {
      if (value === "auto") sessionStorage.removeItem(preferenceKey);
      else sessionStorage.setItem(preferenceKey, value);
    } catch { /* Preference storage is optional. */ }
  }
  return { choice, choose, scene };
}
