"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function StateFinder({
  states,
}: {
  states: { slug: string; name: string }[];
}) {
  const [state, setState] = useState("");
  return (
    <div className="state-finder">
      <label htmlFor="coverage-state">Where is your business based?</label>
      <div>
        <select
          id="coverage-state"
          value={state}
          onChange={(e) => setState(e.target.value)}
        >
          <option value="">Select your state</option>
          {states.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>
        <Link
          href={state ? `/trucking-insurance/${state}` : "/trucking-insurance"}
          className="button-primary"
        >
          Explore
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
      <Link href="/trucking-insurance" className="text-link mt-4">
        Browse all states
      </Link>
    </div>
  );
}
