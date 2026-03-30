import { useCallback, useEffect, useMemo, useState } from "react";
import { aiApi } from "../api/services";

const AUTO_REFRESH_MS = 900000;
const MIN_AUTO_CALL_GAP_MS = 180000;

const AiSummaryCard = ({ incidents }) => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastFetchedAt, setLastFetchedAt] = useState(0);

  const reports = useMemo(
    () => incidents
      .map((incident) => incident.description)
      .filter((description) => typeof description === "string" && description.trim().length > 0)
      .slice(0, 15),
    [incidents]
  );

  const fetchSummary = useCallback(async (force = false) => {
    if (!reports.length) {
      setSummary("No summary available yet.");
      setError("");
      return;
    }

    const now = Date.now();
    if (!force && lastFetchedAt > 0 && now - lastFetchedAt < MIN_AUTO_CALL_GAP_MS) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await aiApi.summarize({ reports });
      setSummary(data?.summary || "Unable to generate summary at the moment.");
      setLastFetchedAt(now);
    } catch (apiError) {
      setSummary("");
      setError(apiError?.response?.data?.message || "Unable to generate summary at the moment.");
    } finally {
      setLoading(false);
    }
  }, [lastFetchedAt, reports]);

  useEffect(() => {
    fetchSummary(false);
  }, [fetchSummary]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchSummary(false);
    }, AUTO_REFRESH_MS);

    return () => clearInterval(interval);
  }, [fetchSummary]);

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="font-semibold">AI Summary</h3>
        <button
          type="button"
          onClick={() => fetchSummary(true)}
          disabled={loading}
          className="px-3 py-1 text-sm rounded bg-blue-600 text-white disabled:opacity-60"
        >
          Refresh
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="inline-block h-4 w-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
          Generating summary...
        </div>
      )}

      {!loading && error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line">
          {summary || "No summary available yet."}
        </p>
      )}
    </div>
  );
};

export default AiSummaryCard;
