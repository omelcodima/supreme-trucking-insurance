"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, X } from "lucide-react";
import { filterLocations, type LocationDirectoryEntry } from "@/lib/locationDirectory";

export default function LocationDirectory({ entries }: { entries: LocationDirectoryEntry[] }) {
  const [query, setQuery] = useState("");
  const matches = filterLocations(entries, query);
  return <section className="site-section location-directory" id="states-and-cities" aria-labelledby="location-directory-title">
    <div className="site-container">
      <div className="location-directory-heading">
        <div>
          <h2 id="location-directory-title">Commercial truck insurance by state and city</h2>
          <p>Find your business location. Coverage options depend on your operation and market availability.</p>
        </div>
        <div className="location-search">
          <label htmlFor="location-search">State or city</label>
          <div>
            <Search size={18} aria-hidden="true" />
            <input id="location-search" type="search" autoComplete="off" placeholder="Seattle, WA" value={query} onChange={event => setQuery(event.target.value)} />
            <button type="button" title="Clear location search" aria-label="Clear location search" disabled={!query} onClick={() => setQuery("")}><X size={18} aria-hidden="true" /></button>
          </div>
        </div>
      </div>
      <p className="location-count" role="status">{matches.length} {matches.length === 1 ? "state" : "states"}{query ? " found" : " served"}</p>
      <div className="location-grid">
        {matches.map(state => <div key={state.slug} className="location-group">
          <h3><Link href={`/trucking-insurance/${state.slug}`}>{state.name}<ArrowUpRight size={16} aria-hidden="true" /></Link></h3>
          <ul>{state.cities.map(city => <li key={city.name}>{city.href ? <Link href={city.href}>{city.name}</Link> : <span>{city.name}</span>}</li>)}</ul>
          <Link className="location-state-link" href={`/trucking-insurance/${state.slug}`}>Truck insurance in {state.abbreviation}</Link>
        </div>)}
      </div>
      {!matches.length && <p className="location-empty">No matching service area. We do not currently serve businesses based in Alaska or Hawaii. For another location, <a href="/contact">contact Supreme</a>.</p>}
    </div>
  </section>;
}
