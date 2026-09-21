"use client";

import { useEffect, useState } from "react";
import { findRegionScene, type RegionScene } from "@/lib/regionalHero";

export const regionalForeground = "/images/hero-regional-foreground.webp";

export function loadPhoto(src: string) {
  return new Promise<void>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => image.decode().then(resolve, reject);
    image.onerror = () => reject(new Error("Scene unavailable"));
    image.src = src;
  });
}

export default function useRegionalHero() {
  const [scene, setScene] = useState<RegionScene | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function activate() {
      try {
        const response = await fetch("/api/visitor-region", { cache: "no-store", signal: AbortSignal.any([controller.signal, AbortSignal.timeout(4000)]) });
        if (!response.ok) return;
        const data = await response.json();
        const next = findRegionScene(data?.state);
        if (!next || controller.signal.aborted) return;
        await Promise.all([loadPhoto(next.asset), loadPhoto(regionalForeground)]);
        if (!controller.signal.aborted) setScene(next);
      } catch { /* Unknown location keeps the national homepage. */ }
    }
    void activate();
    return () => controller.abort();
  }, []);
  return { scene };
}
