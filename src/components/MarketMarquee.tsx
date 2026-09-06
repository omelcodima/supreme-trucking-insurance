"use client";

import Image from "next/image";
import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { carrierMarkets } from "@/lib/carrierMarkets";

export default function MarketMarquee() {
  const [paused, setPaused] = useState(false);
  const controlLabel = paused
    ? "Resume logo animation"
    : "Pause logo animation";

  return (
    <section className="market-band" aria-labelledby="market-heading">
      <div className="site-container">
        <div className="market-heading-row">
          <p id="market-heading">Trucking markets include</p>
          <button
            type="button"
            className="icon-button market-control"
            aria-label={controlLabel}
            title={controlLabel}
            aria-controls="market-track"
            onClick={() => setPaused((value) => !value)}
          >
            {paused ? (
              <Play size={16} aria-hidden="true" />
            ) : (
              <Pause size={16} aria-hidden="true" />
            )}
          </button>
        </div>
        <div className="market-viewport">
          <div id="market-track" className="market-track" data-paused={paused}>
            {[false, true].map((duplicate) => (
              <ul
                key={String(duplicate)}
                className="market-list"
                aria-hidden={duplicate || undefined}
                aria-label={duplicate ? undefined : "Insurance markets"}
              >
                {carrierMarkets.map((market) => (
                  <li
                    key={market.name}
                    className="market-logo"
                    title={market.name}
                  >
                    <Image
                      src={market.image}
                      alt={duplicate ? "" : market.name}
                      width={180}
                      height={64}
                      loading="eager"
                      className={
                        market.darkBackground ? "market-logo-dark" : undefined
                      }
                    />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        <small>
          Market access and eligibility depend on your operation, state, and
          underwriting.
        </small>
      </div>
    </section>
  );
}
