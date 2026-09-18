import type { Metadata } from "next";
import { regionScenes } from "@/lib/regionalHero";

export const metadata: Metadata = {
  title: "Image Credits | Supreme Trucking Insurance",
  alternates: { canonical: "/image-credits" },
  robots: { index: false, follow: true },
};

export default function ImageCreditsPage() {
  return <section className="site-section"><div className="site-container">
    <h1 className="section-heading">Image credits</h1>
    <p className="section-description mt-5">Regional photographs are credited below and remain available under their listed licenses. Photographs are resized, displayed cropped, and combined on screen with a separate AI-prepared truck foreground. These illustrative scenes do not represent Supreme office locations.</p>
    <div className="mt-10">
      {regionScenes.map(scene => <section key={scene.code} id={scene.code} className="scroll-mt-28 border-t border-gray-200 py-6">
        <h2 className="text-lg font-bold">{scene.name}: {scene.landmark}</h2>
        <p className="mt-2 max-w-3xl break-words text-sm">Photo: {scene.author}</p>
        <p className="mt-2 max-w-3xl break-words text-sm"><a className="underline" href={scene.source} target="_blank" rel="noopener noreferrer">{scene.title.replace(/^File:/, "")}</a></p>
        <p className="mt-2 text-sm"><a className="underline" href={scene.licenseUrl} target="_blank" rel="noopener noreferrer">{scene.license}</a>{" · "}<a className="underline" href={scene.original} target="_blank" rel="noopener noreferrer">Original photograph</a></p>
      </section>)}
    </div>
  </div></section>;
}
