import { useCallback, useEffect, useState } from "react";
import { Lock, RefreshCw, Inbox, Heart, AlertTriangle } from "lucide-react";
import { supabase, isSupabaseConfigured, SUBMISSIONS_TABLE } from "@/lib/supabase";
import { FIELDS, type Submission } from "@/data/formFields";

const ADMIN_PASS = "abhishek@neha";
const REFRESH_MS = 5000;

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/** One submission rendered as a card that shows every field in full. */
function Card({ item }: { item: Submission }) {
  return (
    <article className="select-text rounded-2xl border border-white/70 bg-white/70 p-5 shadow-[0_12px_40px_-18px_rgba(173,92,130,0.35)]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 font-serif text-lg font-semibold text-plum">
          <Heart size={15} className="text-rose" fill="currentColor" />
          {item.data.yourName || "Someone"}
          {item.data.partnerName ? ` → ${item.data.partnerName}` : ""}
        </span>
        <time className="shrink-0 text-xs text-ink-soft">{fmtDate(item.created_at)}</time>
      </div>

      <dl className="space-y-2.5">
        {FIELDS.map((f) => {
          const value = (item.data[f.name] ?? "").toString().trim();
          return (
            <div key={f.name} className="grid grid-cols-1 gap-0.5 sm:grid-cols-[9rem_1fr] sm:gap-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-rose-gold-deep">
                {f.label}
              </dt>
              <dd className="whitespace-pre-wrap break-words text-sm text-ink">
                {value || <span className="text-ink-soft/50">—</span>}
              </dd>
            </div>
          );
        })}
      </dl>
    </article>
  );
}

/**
 * A separate, password-gated admin view (open it at <site>/#admin). Lists every
 * love-form submission, refreshing automatically every 5 seconds.
 */
export function AdminDashboard() {
  const [unlocked, setUnlocked] = useState(false);
  const [pass, setPass] = useState("");
  const [passError, setPassError] = useState(false);

  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from(SUBMISSIONS_TABLE)
      .select("id, created_at, data")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setError(null);
    setItems((data as Submission[]) ?? []);
    setLastUpdated(new Date());
  }, []);

  // Auto-refresh every 5s while unlocked.
  useEffect(() => {
    if (!unlocked || !isSupabaseConfigured) return;
    void load();
    const id = setInterval(() => void load(), REFRESH_MS);
    return () => clearInterval(id);
  }, [unlocked, load]);

  /* ---------- Password gate ---------- */
  if (!unlocked) {
    return (
      <div className="fixed inset-0 flex items-center justify-center overflow-y-auto bg-[linear-gradient(150deg,#fff5f8,#f0e8ff)] px-5 py-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pass === ADMIN_PASS) setUnlocked(true);
            else setPassError(true);
          }}
          className="w-full max-w-sm rounded-[1.5rem] border border-white/70 bg-white/70 p-8 text-center shadow-xl"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#f7a8b8,#c65f7b)] text-white shadow-lg">
            <Lock size={22} />
          </div>
          <h1 className="mt-4 font-serif text-2xl font-semibold text-plum">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-ink-soft">Enter the password to view submissions.</p>
          <input
            type="password"
            value={pass}
            onChange={(e) => {
              setPass(e.target.value);
              setPassError(false);
            }}
            placeholder="Password"
            autoComplete="off"
            className="mt-5 w-full rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-plum outline-none focus:border-rose"
          />
          {passError && <p className="mt-2 text-sm text-wine">Wrong password.</p>}
          <button
            type="submit"
            className="mt-5 w-full rounded-full bg-[linear-gradient(120deg,#f7a8b8,#c9b6f0)] px-6 py-3 font-medium text-white shadow-md transition hover:scale-[1.02]"
          >
            Unlock
          </button>
        </form>
      </div>
    );
  }

  /* ---------- Not configured yet ---------- */
  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto flex min-h-[100svh] max-w-lg flex-col items-center justify-center gap-3 px-6 text-center">
        <AlertTriangle className="text-rose-gold-deep" size={40} />
        <h1 className="font-serif text-2xl font-semibold text-plum">Backend not connected</h1>
        <p className="text-sm text-ink-soft">
          Add your Supabase keys (VITE_SUPABASE_URL &amp; VITE_SUPABASE_ANON_KEY) and
          rebuild. Setup steps are in <code>ADMIN_SETUP.md</code>.
        </p>
      </div>
    );
  }

  /* ---------- Dashboard ---------- */
  return (
    <div className="fixed inset-0 overflow-y-auto bg-[linear-gradient(160deg,#fff5f8,#f3ecff)] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 font-serif text-2xl font-semibold text-plum sm:text-3xl">
              <Inbox size={24} className="text-rose" /> Love Submissions
            </h1>
            <p className="mt-1 text-sm text-ink-soft">
              {items.length} total · auto-refreshes every 5s
              {lastUpdated ? ` · updated ${lastUpdated.toLocaleTimeString()}` : ""}
            </p>
          </div>
          <button
            onClick={() => void load()}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-4 py-2 text-sm text-plum shadow transition hover:-translate-y-0.5"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </header>

        {error && (
          <p className="mb-4 rounded-xl bg-rose/10 px-4 py-3 text-sm text-wine">{error}</p>
        )}

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-white/70 bg-white/60 py-16 text-center text-ink-soft">
            <Inbox size={32} className="opacity-50" />
            No submissions yet.
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
