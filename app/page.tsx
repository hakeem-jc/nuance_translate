"use client";

import { useState } from "react";

const DIALECTS = [
  "Spanish (Spain)",
  "Spanish (Caribbean)",
  "Mexican Spanish",
  "Argentinian Spanish",
  "Colombian Spanish",
  "Jamaican Patois",
];

export default function TranslatorPage() {
  const [text, setText] = useState("");
  const [from, setFrom] = useState("English");
  const [to, setTo] = useState("Spanish");
  const [dialect, setDialect] = useState("");
  const [tone, setTone] = useState<"formal" | "informal" | "">("");
  const [plurality, setPlurality] = useState<"singular" | "plural" | "">("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function swapLanguages() {
    setFrom(to);
    setTo(from);
  }

  async function handleTranslate() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          from,
          to,
          options: {
            dialect: dialect || undefined,
            tone: tone || undefined,
            plurality: plurality || undefined,
          },
        }),
      });

      if (!res.ok) throw new Error("Translation failed");

      const data = await res.json();
      setResult(data.translation);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-slate-900 rounded-2xl shadow-xl p-8 space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold">Nuance Translator</h1>
          <p className="text-slate-400 text-sm">
            Precise translation with control over tone, plurality, and dialect.
          </p>
        </header>

        <textarea
          className="w-full h-32 rounded-lg bg-slate-800 border border-slate-700 p-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
          placeholder="Enter text to translate"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
          <input
            className="rounded-lg bg-slate-800 border border-slate-700 p-2"
            placeholder="From"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />

          <button
            onClick={swapLanguages}
            className="rounded-full border border-slate-700 px-3 py-2 hover:bg-slate-800"
            title="Swap languages"
          >
            ⇄
          </button>

          <input
            className="rounded-lg bg-slate-800 border border-slate-700 p-2"
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            className="rounded-lg bg-slate-800 border border-slate-700 p-2"
            value={dialect}
            onChange={(e) => setDialect(e.target.value)}
          >
            <option value="">Dialect (optional)</option>
            {DIALECTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            className="rounded-lg bg-slate-800 border border-slate-700 p-2"
            value={tone}
            onChange={(e) => setTone(e.target.value as any)}
          >
            <option value="">Tone (optional)</option>
            <option value="formal">Formal</option>
            <option value="informal">Informal</option>
          </select>

          <select
            className="rounded-lg bg-slate-800 border border-slate-700 p-2"
            value={plurality}
            onChange={(e) => setPlurality(e.target.value as any)}
          >
            <option value="">Plurality (optional)</option>
            <option value="singular">Singular</option>
            <option value="plural">Plural</option>
          </select>
        </div>

        <button
          onClick={handleTranslate}
          disabled={!text || loading}
          className="w-full rounded-lg bg-indigo-600 py-3 font-medium hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? "Translating..." : "Translate"}
        </button>

        {error && <p className="text-sm text-red-400">{error}</p>}

        {result && (
          <div className="bg-slate-800 rounded-lg p-4">
            <h2 className="text-sm font-semibold mb-2 text-slate-300">Translation</h2>
            <p className="whitespace-pre-wrap">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}
