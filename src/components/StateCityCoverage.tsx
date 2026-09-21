import Link from "next/link";
import { locationDirectory } from "@/lib/cityPages";

export default function StateCityCoverage({ stateSlug }: { stateSlug: string }) {
  const state = locationDirectory.find(item => item.slug === stateSlug);
  if (!state) return null;
  return <section className="site-section state-city-coverage" id="cities" aria-labelledby="state-cities-title">
    <div className="site-container">
      <h2 id="state-cities-title">Trucking insurance across {state.name}</h2>
      <p>We help businesses in these cities and elsewhere in {state.name}, subject to market availability. These are service areas, not separate branch offices.</p>
      <ul className="state-city-list">{state.cities.map(city => <li key={city.name}>{city.href ? <Link href={city.href}>{city.name} truck insurance</Link> : <span>{city.name}</span>}</li>)}</ul>
      <p>Use the actual business and truck garaging locations when requesting a quote, even if your loads go to another state.</p>
      <Link href="/trucking-insurance#states-and-cities" className="text-link mt-5">All states and cities</Link>
    </div>
  </section>;
}
