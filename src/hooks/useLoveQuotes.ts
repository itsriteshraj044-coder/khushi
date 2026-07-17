import { useCallback, useEffect, useState } from "react";
import { QUOTES } from "@/data/quotes";
import type { Quote } from "@/types";

/**
 * Love quotes are fetched from the internet with a resilient cascade:
 *   1. QuoteSlate — a free, no-key API that filters by the "love" tag.
 *   2. DummyJSON — a very reliable, CORS-enabled quotes API; we keep only
 *      the love-themed lines.
 *   3. Curated originals (offline fallback) so the section is never empty.
 */

interface ApiQuote {
  id: number;
  quote: string;
  author: string;
}

/**
 * Only genuinely romantic lines are allowed through. We require a strong
 * romance keyword and reject quotes whose "love" is clearly non-romantic
 * (love of money, war, politics, religion, work, etc.).
 */
const ROMANTIC =
  /\b(romance|romantic|love(?:s|d|rs?|ly)?|beloved|sweetheart|darling|kiss(?:es|ed)?|adore[ds]?|adoring|affection(?:ate)?|passion(?:ate)?|embrace|soulmate|cherish(?:ed)?|heart(?:s)?|valentine|infatuat|desire|longing|tender(?:ness)?)\b/i;

const NOT_ROMANTIC =
  /\b(money|wealth|business|market|war|weapon|politic|nation|country|government|god|jesus|allah|religio|faith|success|career|work(?:place)?|productiv|science|hatred|self-love|humanity|mankind)\b/i;

const isRomantic = (text: string): boolean =>
  ROMANTIC.test(text) && !NOT_ROMANTIC.test(text);

const toQuote = (prefix: string, q: ApiQuote): Quote => ({
  id: `${prefix}-${q.id}`,
  text: q.quote.trim(),
  author: q.author?.trim() || "Unknown",
});

async function fromQuoteSlate(): Promise<Quote[]> {
  const res = await fetch(
    "https://quoteslate.vercel.app/api/quotes/random?tags=love&count=20&maxLength=170",
    { headers: { Accept: "application/json" } },
  );
  if (!res.ok) throw new Error(`QuoteSlate ${res.status}`);
  const data: ApiQuote[] | ApiQuote = await res.json();
  const arr = Array.isArray(data) ? data : [data];
  const mapped = arr
    .filter((q) => q?.quote?.trim() && isRomantic(q.quote))
    .slice(0, 12)
    .map((q) => toQuote("qs", q));
  if (mapped.length < 3) throw new Error("QuoteSlate too few romantic quotes");
  return mapped;
}

async function fromDummyJson(): Promise<Quote[]> {
  const skip = Math.floor(Math.random() * 1300);
  const res = await fetch(`https://dummyjson.com/quotes?limit=150&skip=${skip}`);
  if (!res.ok) throw new Error(`DummyJSON ${res.status}`);
  const data: { quotes?: ApiQuote[] } = await res.json();
  const love = (data.quotes ?? [])
    .filter((q) => q?.quote && isRomantic(q.quote))
    .slice(0, 10)
    .map((q) => toQuote("dj", q));
  if (love.length < 3) throw new Error("DummyJSON too few romantic quotes");
  return love;
}

interface UseLoveQuotes {
  quotes: Quote[];
  loading: boolean;
  /** true when the current quotes came live from the internet. */
  live: boolean;
  refetch: () => Promise<void>;
}

export function useLoveQuotes(): UseLoveQuotes {
  const [quotes, setQuotes] = useState<Quote[]>(QUOTES);
  const [loading, setLoading] = useState(false);
  const [live, setLive] = useState(false);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fromQuoteSlate().catch(() => fromDummyJson());
      setQuotes(result);
      setLive(true);
    } catch {
      // Offline / blocked / rate-limited — keep the curated originals.
      setQuotes(QUOTES);
      setLive(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { quotes, loading, live, refetch };
}
