import scenes from "./regionScenes.json" with { type: "json" };

export type RegionScene = (typeof scenes)[number];
export const regionScenes = [...scenes].sort((a, b) => a.name.localeCompare(b.name));

export function findRegionScene(code: unknown): RegionScene | null {
  if (typeof code !== "string" || !/^[A-Z]{2}$/.test(code)) return null;
  return regionScenes.find(scene => scene.code === code) ?? null;
}

export function regionFromHeaders(headers: Headers): RegionScene | null {
  if (headers.get("x-vercel-ip-country") !== "US") return null;
  return findRegionScene(headers.get("x-vercel-ip-country-region"));
}

export function regionIsServed(scene: RegionScene) {
  return scene.code !== "AK" && scene.code !== "HI";
}

export function regionalHeadline(scene: RegionScene | null) {
  return scene && regionIsServed(scene)
    ? `Trucking insurance for ${scene.name} businesses`
    : "For the business behind the wheel";
}
