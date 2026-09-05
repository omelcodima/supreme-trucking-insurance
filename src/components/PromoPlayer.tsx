"use client";
import { useRef, useState } from "react";
import { Play, X } from "lucide-react";

export default function PromoPlayer() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [playing, setPlaying] = useState(false);
  return (
    <>
      <button
        className="hero-play"
        type="button"
        onClick={() => {
          setPlaying(true);
          dialog.current?.showModal();
        }}
      >
        <Play size={16} aria-hidden="true" />
        Watch Supreme
      </button>
      <dialog
        ref={dialog}
        className="promo-dialog"
        onClose={() => setPlaying(false)}
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current.close();
        }}
        aria-label="Supreme Trucking Insurance introduction"
      >
        <div className="promo-dialog-head">
          <p>Supreme Trucking Insurance</p>
          <button
            type="button"
            className="icon-button"
            title="Close video"
            aria-label="Close video"
            onClick={() => dialog.current?.close()}
          >
            <X size={22} />
          </button>
        </div>
        {playing && (
          <iframe
            src="/supreme-promo.html"
            title="Supreme promotional video"
            allow="autoplay; fullscreen"
          />
        )}
      </dialog>
    </>
  );
}
