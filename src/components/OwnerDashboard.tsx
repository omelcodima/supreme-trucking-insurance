/* Session transitions must discard all private React state. */
/* eslint-disable @next/next/no-location-assign-relative-destination */
import Head from "next/head";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  BarChart3,
  Inbox,
  ShieldCheck,
  Ban,
  History,
  LogOut,
  Search,
  Download,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import type { OwnerAnalytics } from "@/lib/ownerAnalytics";
import styles from "./OwnerDashboard.module.css";

type Tab = "analytics" | "leads" | "consent" | "suppressions" | "audit";
type Lead = {
  id: string;
  source: string;
  created_at: string;
  contact_name: string;
  company: string;
  phone: string;
  email: string;
  home_state: string;
  contact_requested: boolean;
  sms_mobile: string | null;
  suppressed: boolean;
  call_suppressed: boolean;
};
type LeadData = {
  leads: Lead[];
  total: number;
  page: number;
  summary: {
    requests: number;
    indications: number;
    contact_requests: number;
    sms_opt_ins: number;
  };
};
type Evidence = {
  lead: {
    id: string;
    company: string;
    contact_name: string;
    request: Record<string, string>;
  };
  events: {
    id: string;
    kind: string;
    digest: string;
    integrity: string;
    evidence: Record<string, unknown>;
  }[];
};
type HistoryRow = {
  id?: string;
  created_at: string;
  actor?: string;
  action?: string;
  target?: string;
  mobile?: string;
  kind?: string;
  evidence?: { method?: string; note?: string };
};
const sourceName = (source: string) =>
  ({
    quick_quote: "Quick quote",
    full_application: "Full application",
    instant_indication: "Instant indication",
  })[source] || source;
const date = (value: string) =>
  new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
const count = (value?: number) =>
  value == null ? "--" : value.toLocaleString("en-US");
const gaUrl =
  "https://analytics.google.com/analytics/web/#/p553019966/reports/intelligenthome";
const calendarDate = (value: string) =>
  new Date(`${value}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

async function api(body: Record<string, unknown>) {
  const response = await fetch("/api/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (response.status === 401) {
    window.location.assign("/admin/login");
    throw new Error("Sign in again.");
  }
  if (!response.ok)
    throw new Error((await response.json()).error || "Request unavailable.");
  return response;
}
function saveFile(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Breakdown({
  title,
  rows,
}: {
  title: string;
  rows?: { label: string; count: number }[];
}) {
  const max = Math.max(1, ...(rows ?? []).map((row) => row.count));
  return (
    <section className={styles.breakdown}>
      <h2>{title}</h2>
      {!rows?.length ? (
        <p className={styles.empty}>No measured data for this period.</p>
      ) : (
        <ul>
          {rows.map((row, index) => (
            <li key={`${row.label}-${index}`}>
              <div>
                <span>{row.label}</span>
                <strong>{count(row.count)}</strong>
              </div>
              <div className={styles.track}>
                <span style={{ width: `${(row.count / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function DailyTraffic({ rows }: { rows: NonNullable<OwnerAnalytics["daily"]> }) {
  const max = Math.max(0, ...rows.map((row) => row.count));
  return (
    <section className={styles.dailyTraffic} aria-labelledby="daily-traffic-heading">
      <h2 id="daily-traffic-heading">Daily sessions</h2>
      <figure className={styles.chart}>
        <div className={styles.chartScale} aria-hidden="true">{count(max)}</div>
        <div className={styles.chartBars} aria-hidden="true">
          {rows.map((row) => (
            <div
              key={row.date}
              title={`${calendarDate(row.date)}: ${count(row.count)} sessions`}
              className={styles.chartColumn}
            >
              <span style={{ height: `${(row.count / Math.max(1, max)) * 100}%` }} />
            </div>
          ))}
        </div>
        <figcaption className={styles.chartDates}>
          <span>{calendarDate(rows[0].date)}</span>
          <span>{calendarDate(rows[rows.length - 1].date)}</span>
        </figcaption>
      </figure>
      <details className={styles.dailyData}>
        <summary>Daily data</summary>
        <div className={styles.tableWrap}>
          <table>
            <caption className={styles.caption}>Sessions by date</caption>
            <thead><tr><th scope="col">Date</th><th scope="col">Sessions</th></tr></thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.date}>
                  <th scope="row">{calendarDate(row.date)}</th>
                  <td>{count(row.count)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}

export default function OwnerDashboard({
  ownerEmail,
  testEnvironment = false,
}: {
  ownerEmail: string;
  testEnvironment?: boolean;
}) {
  const [tab, setTab] = useState<Tab>("leads");
  const [days, setDays] = useState(28);
  const [source, setSource] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [leads, setLeads] = useState<LeadData | null>(null);
  const [analytics, setAnalytics] = useState<OwnerAnalytics | null>(null);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [evidence, setEvidence] = useState<Evidence | null>(null);
  const [suppression, setSuppression] = useState({
    mobile: "",
    channel: "sms",
    method: "phone",
    note: "",
  });
  const dialog = useRef<HTMLDialogElement>(null);
  const filter = { days, source, status, search: query, page };
  useEffect(() => {
    let current = true;
    const load = async () => {
      setLoading(true);
      setError("");
      setMessage("");
      try {
        const data = await (
          await api({
            action: tab === "consent" ? "leads" : tab,
            days,
            source,
            status,
            search: query,
            page,
          })
        ).json();
        if (!current) return;
        if (tab === "leads" || tab === "consent") setLeads(data);
        else if (tab === "analytics") setAnalytics(data);
        else setHistory(data);
      } catch (error) {
        if (current)
          setError(
            error instanceof Error ? error.message : "Data unavailable.",
          );
      } finally {
        if (current) setLoading(false);
      }
    };
    void load();
    return () => {
      current = false;
    };
  }, [tab, days, source, status, query, page, revision]);
  useEffect(() => {
    if (evidence) dialog.current?.showModal();
  }, [evidence]);

  async function inspect(id: string) {
    setBusy(true);
    setError("");
    try {
      setEvidence(await (await api({ action: "evidence", id })).json());
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Evidence unavailable.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function exportRecords() {
    setBusy(true);
    setError("");
    try {
      saveFile(
        await (await api({ action: "export", ...filter })).blob(),
        "supreme-current-page-records.csv",
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : "Export unavailable.");
    } finally {
      setBusy(false);
    }
  }
  async function addSuppression(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await api({ action: "suppress", ...suppression });
      setSuppression({ mobile: "", channel: "sms", method: "phone", note: "" });
      setHistory(await (await api({ action: "suppressions" })).json());
      setMessage("Suppression saved. No messages or calls were sent.");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not save the opt-out.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function signOut() {
    setBusy(true);
    try {
      const response = await fetch("/api/owner-auth/sign-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      if (!response.ok) throw new Error("Sign-out unavailable. Try again.");
      window.location.assign("/admin/login");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Sign-out unavailable.",
      );
      setBusy(false);
    }
  }
  const tabs = [
    { id: "analytics", name: "Traffic", icon: BarChart3 },
    { id: "leads", name: "Requests", icon: Inbox },
    { id: "consent", name: "SMS records", icon: ShieldCheck },
    { id: "suppressions", name: "Opt-outs", icon: Ban },
    { id: "audit", name: "Access log", icon: History },
  ] as const;
  const isLeads = tab === "leads" || tab === "consent";
  return (
    <div className={styles.app}>
      <Head>
        <title>Supreme Owner</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="referrer" content="no-referrer" />
      </Head>
      <aside className={styles.sidebar}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-compact.svg"
          alt="Supreme Trucking Insurance"
          width="218"
          height="68"
          className={styles.logo}
        />
        <p className={styles.eyebrow}>Owner workspace</p>
        <nav aria-label="Owner navigation">
          {tabs.map((item) => (
            <button
              key={item.id}
              className={tab === item.id ? styles.active : ""}
              aria-current={tab === item.id ? "page" : undefined}
              onClick={() => {
                setTab(item.id);
                setPage(0);
                setError("");
                setEvidence(null);
              }}
            >
              <item.icon size={18} />
              {item.name}
            </button>
          ))}
          <button onClick={() => window.location.assign("/admin/assessments")}>
            <ExternalLink size={18} />
            Applications & assessments
          </button>
          <button onClick={() => window.location.assign("/admin/design")}>
            <ExternalLink size={18} />
            Website design
          </button>
        </nav>
        <div className={styles.account}>
          <span>{ownerEmail}</span>
          <button onClick={signOut} disabled={busy}>
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>
      <main className={styles.main}>
        {testEnvironment && (
          <p className={styles.notice}>
            Local test environment. Synthetic records only.
          </p>
        )}
        <header className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>Supreme Trucking Insurance</p>
            <h1>{tabs.find((item) => item.id === tab)?.name}</h1>
          </div>
          <div className={styles.controls}>
            {tab !== "suppressions" && tab !== "audit" && (
              <select
                aria-label="Reporting period"
                value={days}
                onChange={(event) => {
                  setDays(Number(event.target.value));
                  setPage(0);
                }}
              >
                <option value={7}>Last 7 days</option>
                <option value={28}>Last 28 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            )}
            <button
              className={styles.iconButton}
              title="Refresh"
              aria-label="Refresh"
              onClick={() => setRevision((value) => value + 1)}
              disabled={loading}
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </header>
        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}
        {message && (
          <p role="status" className={styles.success}>
            {message}
          </p>
        )}
        <div aria-live="polite" className={styles.loadStatus}>
          {loading ? "Loading records..." : ""}
        </div>
        {isLeads && (
          <>
            <section className={styles.stats} aria-label="Request totals">
              {[
                ["Requests", leads?.summary.requests],
                ["Instant indications", leads?.summary.indications],
                ["Contact requested", leads?.summary.contact_requests],
                ["SMS numbers opted in", leads?.summary.sms_opt_ins],
              ].map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{count(value as number | undefined)}</strong>
                </div>
              ))}
            </section>
            {tab === "consent" && (
              <p className={styles.notice}>
                Recorded consent is not sending approval. Marketing calls have
                no permission recorded. SMS sending is not connected; provider
                opt-outs must also be checked.
              </p>
            )}
            <div className={styles.filters}>
              <form
                className={styles.search}
                onSubmit={(event) => {
                  event.preventDefault();
                  setQuery(search);
                  setPage(0);
                }}
              >
                <input
                  aria-label="Search requests"
                  placeholder="Name, company, phone or email"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <button title="Search" aria-label="Search">
                  <Search size={17} />
                </button>
              </form>
              <select
                aria-label="Request type"
                value={source}
                onChange={(event) => {
                  setSource(event.target.value);
                  setPage(0);
                }}
              >
                <option value="">All request types</option>
                <option value="quick_quote">Quick quote</option>
                <option value="full_application">Full application</option>
                <option value="instant_indication">Instant indication</option>
              </select>
              <select
                aria-label="SMS status"
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value);
                  setPage(0);
                }}
              >
                <option value="">All SMS statuses</option>
                <option value="opt_in">Opt-in recorded</option>
                <option value="none">No opt-in recorded</option>
                <option value="suppressed">Suppressed</option>
              </select>
              <button
                className={styles.iconButton}
                disabled={busy || loading || !leads?.leads.length}
                onClick={exportRecords}
                title="Export current page (up to 50 records)"
                aria-label="Export current page"
              >
                <Download size={18} />
              </button>
            </div>
            {!error && (
              <div className={styles.tableWrap} aria-busy={loading}>
                <table>
                  <thead>
                    <tr>
                      <th>Received</th>
                      <th>Company / contact</th>
                      <th>Request</th>
                      <th>Contact details</th>
                      <th>SMS record</th>
                      <th>
                        <span className={styles.srOnly}>Evidence</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads?.leads.map((lead) => (
                      <tr key={lead.id}>
                        <td>{date(lead.created_at)}</td>
                        <td>
                          <strong>
                            {lead.company || "Company not confirmed"}
                          </strong>
                          <span>{lead.contact_name || "No name provided"}</span>
                          {lead.home_state && (
                            <small>Company state: {lead.home_state}</small>
                          )}
                        </td>
                        <td>
                          {sourceName(lead.source)}
                          <span>
                            {lead.contact_requested
                              ? "Follow-up requested"
                              : "No callback requested"}
                          </span>
                          {lead.call_suppressed && <small className={styles.blocked}>Marketing call opt-out</small>}
                        </td>
                        <td>
                          {lead.phone || "No phone provided"}
                          <span>{lead.email || "No email provided"}</span>
                        </td>
                        <td>
                          <span
                            className={
                              lead.suppressed
                                ? styles.blocked
                                : lead.sms_mobile
                                  ? styles.recorded
                                  : styles.neutral
                            }
                          >
                            {lead.suppressed
                              ? "Suppressed"
                              : lead.sms_mobile
                                ? "Opt-in recorded"
                                : "No opt-in"}
                          </span>
                          {lead.sms_mobile && <small>{lead.sms_mobile}</small>}
                        </td>
                        <td>
                          <button
                            onClick={() => inspect(lead.id)}
                            disabled={busy}
                          >
                            Evidence
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!loading && !leads?.leads.length && (
                  <p className={styles.empty}>
                    No requests match this period and these filters.
                  </p>
                )}
              </div>
            )}
            <footer className={styles.pagination}>
              <span>{count(leads?.total)} matching records</span>
              <div>
                <button
                  className={styles.iconButton}
                  disabled={page === 0 || loading}
                  title="Previous page"
                  aria-label="Previous page"
                  onClick={() => setPage((value) => value - 1)}
                >
                  <ChevronLeft size={18} />
                </button>
                <span>Page {page + 1}</span>
                <button
                  className={styles.iconButton}
                  disabled={loading || (page + 1) * 50 >= (leads?.total ?? 0)}
                  title="Next page"
                  aria-label="Next page"
                  onClick={() => setPage((value) => value + 1)}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </footer>
            <p className={styles.caption}>
              Submitted requests, not identified website visitors. Email
              delivery is not confirmed here. Times shown in your device
              timezone. Older email-only records are not automatically imported.
            </p>
          </>
        )}
        {tab === "analytics" && analytics && (
          <>
            <p className={styles.notice}>
              GA4 measures visitors who allow analytics. Location is
              approximate. These reports do not identify individuals or match a
              search query to a specific customer.
            </p>
            {analytics.status !== "connected" ? (
              <section className={styles.empty}>
                <h2>
                  {analytics.status === "not_configured"
                    ? "Google reporting access is not connected"
                    : "Google reports are temporarily unavailable"}
                </h2>
                <p>
                  The existing website tag is separate from permission to read
                  reports.
                </p>
                <a href={gaUrl} target="_blank" rel="noreferrer">
                  Open Google Analytics
                  <ExternalLink size={16} />
                </a>
              </section>
            ) : (
              <>
                <section className={styles.stats}>
                  {["Active users", "Sessions", "Page views", "Key events"].map(
                    (label, index) => (
                      <div key={label}>
                        <span>{label}</span>
                        <strong>{count(analytics.totals?.[index])}</strong>
                      </div>
                    ),
                  )}
                </section>
                <p className={styles.caption}>
                  {analytics.startDate && analytics.endDate
                    ? `${calendarDate(analytics.startDate)} to ${calendarDate(analytics.endDate)}. `
                    : "Through yesterday. "}
                  GA4 timezone: {analytics.timeZone || "property timezone"}.
                  {" "}Google data may still be processing. Breakdowns show up to 25 rows.
                  {analytics.limited
                    ? " Google applied reporting limits or privacy thresholds."
                    : ""}
                </p>
                <a href={gaUrl} target="_blank" rel="noreferrer" className={styles.analyticsLink}>
                  Open Google Analytics <ExternalLink size={16} />
                </a>
                {!!analytics.daily?.length && <DailyTraffic rows={analytics.daily} />}
                <p className={styles.caption}>
                  ChatGPT and Claude referrals count sessions with those sources in GA4,
                  not AI mentions or recommendations. Visits without analytics consent
                  or an identifiable source may be missing.
                </p>
                <div className={styles.breakdowns}>
                  <Breakdown
                    title="ChatGPT and Claude / referral sessions"
                    rows={analytics.aiReferrals}
                  />
                  <Breakdown
                    title="Traffic channels / sessions"
                    rows={analytics.channels}
                  />
                  <Breakdown
                    title="Landing pages / sessions"
                    rows={analytics.pages}
                  />
                  <Breakdown
                    title="Countries and states / sessions"
                    rows={analytics.regions}
                  />
                  <Breakdown
                    title="Devices / sessions"
                    rows={analytics.devices}
                  />
                  <Breakdown
                    title="Clicks and form events"
                    rows={analytics.events}
                  />
                </div>
              </>
            )}
          </>
        )}
        {tab === "suppressions" && (
          <>
            <p className={styles.notice}>
              These are agency-recorded opt-outs. Automatic provider STOP
              synchronization is not connected. New form submissions never
              remove an existing suppression.
            </p>
            <form className={styles.suppressionForm} onSubmit={addSuppression}>
              <h2>Record an opt-out</h2>
              <div className={styles.fields}>
                <label>
                  Phone number
                  <input
                    type="tel"
                    required
                    value={suppression.mobile}
                    onChange={(e) =>
                      setSuppression({ ...suppression, mobile: e.target.value })
                    }
                  />
                </label>
                <label>
                  Channel
                  <select
                    value={suppression.channel}
                    onChange={(e) =>
                      setSuppression({
                        ...suppression,
                        channel: e.target.value,
                      })
                    }
                  >
                    <option value="sms">Marketing SMS</option>
                    <option value="call">Marketing calls</option>
                  </select>
                </label>
                <label>
                  Received through
                  <select
                    value={suppression.method}
                    onChange={(e) =>
                      setSuppression({ ...suppression, method: e.target.value })
                    }
                  >
                    <option value="phone">Phone conversation</option>
                    <option value="email">Email</option>
                    <option value="provider_stop">Provider STOP record</option>
                    <option value="other">Other request</option>
                  </select>
                </label>
              </div>
              <label>
                Evidence reference / note
                <textarea
                  required
                  maxLength={500}
                  value={suppression.note}
                  onChange={(e) =>
                    setSuppression({ ...suppression, note: e.target.value })
                  }
                />
              </label>
              <button disabled={busy}>
                <Ban size={16} />
                {busy ? "Saving..." : "Save opt-out"}
              </button>
            </form>
            <h2>Latest 100 opt-out records</h2>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>Recorded</th>
                    <th>Number</th>
                    <th>Channel</th>
                    <th>Source / reference</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((row) => (
                    <tr key={row.id}>
                      <td>{date(row.created_at)}</td>
                      <td>{row.mobile}</td>
                      <td>{row.kind === "sms_opt_out" ? "SMS" : "Calls"}</td>
                      <td>
                        {row.evidence?.method}
                        <span>{row.evidence?.note}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!history.length && !loading && (
                <p className={styles.empty}>
                  No agency opt-outs recorded yet. This does not mean the
                  provider has none.
                </p>
              )}
            </div>
          </>
        )}
        {tab === "audit" && (
          <>
            <h2>Latest 100 access events</h2>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Owner</th>
                    <th>Action</th>
                    <th>Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((row, index) => (
                    <tr key={index}>
                      <td>{date(row.created_at)}</td>
                      <td>{row.actor}</td>
                      <td>{row.action}</td>
                      <td>{row.target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!history.length && !loading && (
                <p className={styles.empty}>No access events recorded yet.</p>
              )}
            </div>
          </>
        )}
      </main>
      {evidence && (
        <dialog
          ref={dialog}
          className={styles.dialog}
          onClose={() => setEvidence(null)}
        >
          <header>
            <h2>Submission evidence</h2>
            <button
              className={styles.iconButton}
              title="Close"
              aria-label="Close evidence"
              onClick={() => dialog.current?.close()}
            >
              <X size={18} />
            </button>
          </header>
          <h3>{evidence.lead.company || "Company not provided"}</h3>
          <p>{evidence.lead.contact_name}</p>
          <p className={styles.caption}>Reference: {evidence.lead.id}</p>
          <p className={styles.notice}>
            Self-attested consent, not verified number ownership. A matching
            digest is an integrity check, not a legal certification. No
            marketing calls authorized and no SMS sending enabled.
          </p>
          {Object.entries(evidence.lead.request).length > 0 && (
            <dl>
              {Object.entries(evidence.lead.request).map(([key, value]) => (
                <div key={key}>
                  <dt>{key}</dt>
                  <dd>{value || "Not provided"}</dd>
                </div>
              ))}
            </dl>
          )}
          {evidence.events.map((event) => (
            <section key={event.id}>
              <h3>{event.kind.replaceAll("_", " ")}</h3>
              <p
                className={
                  event.integrity === "matches" ? styles.caption : styles.error
                }
              >
                Digest: {event.integrity}
              </p>
              <pre>{JSON.stringify(event.evidence, null, 2)}</pre>
              <small className={styles.hash}>{event.digest}</small>
            </section>
          ))}
          <button
            onClick={async () => {
              try {
                const response = await api({
                  action: "evidence",
                  id: evidence.lead.id,
                  download: true,
                });
                saveFile(
                  await response.blob(),
                  `supreme-evidence-${evidence.lead.id}.json`,
                );
              } catch {
                setError("Evidence export unavailable.");
              }
            }}
          >
            <Download size={16} />
            Download evidence
          </button>
        </dialog>
      )}
    </div>
  );
}
