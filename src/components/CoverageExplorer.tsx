"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight, Check, Package, ShieldCheck, Truck } from "lucide-react";
import {
  coverageExplorerItems,
  coverageExplorerQuoteHref,
  type CoverageExplorerId,
} from "@/lib/coverageExplorer";
import styles from "./CoverageExplorer.module.css";

const icons = { truck: Truck, cargo: Package, liability: ShieldCheck };

export default function CoverageExplorer() {
  const [selected, setSelected] = useState<CoverageExplorerId>("truck");
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (event.key) {
      case "ArrowRight":
        next = (index + 1) % coverageExplorerItems.length;
        break;
      case "ArrowLeft":
        next = (index + coverageExplorerItems.length - 1) % coverageExplorerItems.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = coverageExplorerItems.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    setSelected(coverageExplorerItems[next].id);
    tabs.current[next]?.focus();
  }

  return (
    <div className={styles.explorer}>
      <div className={styles.visual}>
        <div className={styles.tabs} role="tablist" aria-label="Insurance coverage">
          {coverageExplorerItems.map((item, index) => {
            const Icon = icons[item.id];
            return (
              <button
                type="button"
                role="tab"
                id={`coverage-tab-${item.id}`}
                aria-controls={`coverage-panel-${item.id}`}
                aria-selected={selected === item.id}
                tabIndex={selected === item.id ? 0 : -1}
                ref={(element) => { tabs.current[index] = element; }}
                key={item.id}
                onClick={() => setSelected(item.id)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
              >
                <Icon size={19} aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </div>
        <div className={styles.scene} data-coverage={selected}>
          <Image
            src="/images/coverage-truck-studio.webp"
            alt="Side view of a silver semi truck and white dry van trailer"
            width={1536}
            height={1024}
            priority
            sizes="(min-width: 1240px) 696px, (min-width: 961px) 58vw, calc(100vw - 32px)"
          />
          <div className={styles.equipmentLine} aria-hidden="true" />
          <div className={styles.cargoOutline} aria-hidden="true" />
          <div className={styles.liabilityLine} aria-hidden="true" />
          {coverageExplorerItems.map((item) => {
            const Icon = icons[item.id];
            return (
              <button
                key={item.id}
                type="button"
                className={styles.hotspot}
                data-point={item.id}
                aria-label={`${item.label}: ${item.title}`}
                aria-pressed={selected === item.id}
                aria-controls={`coverage-panel-${item.id}`}
                onClick={() => setSelected(item.id)}
              >
                <Icon size={19} aria-hidden="true" />
                <span className={styles.tooltip}>{item.title}</span>
              </button>
            );
          })}
          <p className={styles.sceneCaption} aria-live="polite" aria-atomic="true">
            {coverageExplorerItems.find((item) => item.id === selected)?.subject}
          </p>
        </div>
        <p className={styles.visualNote}>Different risks. Different layers of coverage.</p>
      </div>

      <div className={styles.panels}>
        {coverageExplorerItems.map((item, index) => (
          <div
            className={styles.panel}
            key={item.id}
            id={`coverage-panel-${item.id}`}
            role="tabpanel"
            aria-labelledby={`coverage-tab-${item.id}`}
            aria-hidden={selected !== item.id}
            inert={selected !== item.id}
            tabIndex={selected === item.id ? 0 : -1}
            data-active={selected === item.id}
          >
            <div className={styles.panelEyebrow}>
              <span>{item.subject}</span>
              <span aria-hidden="true">0{index + 1} / 03</span>
            </div>
            <h2>{item.title}</h2>
            <p className={styles.description}>{item.description}</p>
            <ul className={styles.examples}>
              {item.examples.map((example) => (
                <li key={example}><Check size={17} aria-hidden="true" />{example}</li>
              ))}
            </ul>
            <p className={styles.distinction}>{item.distinction}</p>
            <div className={styles.actions}>
              <Link href={coverageExplorerQuoteHref(item.id)} className="button-primary">
                Get a quote for this coverage
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              {item.detailHref ? (
                <Link href={item.detailHref} className="text-link">
                  {item.detailLabel}<ArrowRight size={15} aria-hidden="true" />
                </Link>
              ) : (
                <a href="tel:+13609367196" className="text-link">Talk with an agent</a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
