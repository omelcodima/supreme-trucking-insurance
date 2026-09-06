export const HERO_IMAGE_WIDTH = 2200;
export const HERO_IMAGE_HEIGHT = 1228;

export function normalizedPointer(
  position: number,
  origin: number,
  size: number,
) {
  if (size <= 0 || !Number.isFinite(position)) return 0;
  return Math.max(-1, Math.min(1, ((position - origin) / size) * 2 - 1));
}

export function coverScale(width: number, height: number, imageAspect: number) {
  return Math.max(width / imageAspect, height);
}

export function scrollProgress(top: number, height: number) {
  if (height <= 0) return 0;
  return Math.max(0, Math.min(1, -top / (height * 0.8)));
}

function smoothstep(low: number, high: number, value: number) {
  const t = Math.max(0, Math.min(1, (value - low) / (high - low)));
  return t * t * (3 - 2 * t);
}

// Soft photo-space depth keeps the vehicle, its shadow, and the road connected.
export function photoDepth(u: number, v: number) {
  const cab = Math.hypot((u - 0.3) / 0.17, (v - 0.49) / 0.31);
  const trailer = Math.hypot((u - 0.14) / 0.12, (v - 0.49) / 0.2);
  const truck = 1 - smoothstep(0.55, 1.15, Math.min(cab, trailer));
  const road = smoothstep(0.5, 1, v) * 0.06;
  return Math.max(truck * 0.13, road);
}
