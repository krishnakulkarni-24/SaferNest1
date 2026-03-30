import { useCallback, useMemo, useState } from "react";
import { aiApi } from "../api/services";

const AiSummaryCard = ({ incidents }) => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reports = useMemo(
    () => incidents
      .map((incident) => incident.description)
      .filter((description) => typeof description === "string" && description.trim().length > 0)
      .slice(0, 15),
    [incidents]
  );

  const fetchSummary = useCallback(async () => {
    if (!reports.length) {
      setSummary("No summary available yet.");
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await aiApi.summarize({ reports });
      setSummary(data?.summary || "Unable to generate summary at the moment.");
    } catch (apiError) {
      setSummary("");
      setError(apiError?.response?.data?.message || "Unable to generate summary at the moment.");
    } finally {
      setLoading(false);
    }
  }, [reports]);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="text-base font-semibold text-[#111827] dark:text-slate-100">AI Summary</h3>
        <button
          type="button"
          onClick={fetchSummary}
          disabled={loading}
          className="sn-btn-primary px-3 py-1"
        >
          Refresh
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span className="inline-block h-4 w-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
          Generating summary...
        </div>
      )}

      {!loading && error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <p className="whitespace-pre-line text-sm text-slate-700 dark:text-slate-300">
          {summary || "No summary available yet."}
        </p>
      )}
    </div>
  );
};

export default AiSummaryCard;
