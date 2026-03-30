import { useState, useCallback } from "react";
import { incidentApi } from "../api/services";
import LocationMapPicker from "../components/LocationMapPicker";

const ReportIncidentPage = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    locationLat: "",
    locationLng: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleLocationChange = useCallback((lat, lng) => {
    setForm((prev) => ({
      ...prev,
      locationLat: lat,
      locationLng: lng,
    }));
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await incidentApi.create({
        ...form,
        locationLat: Number(form.locationLat),
        locationLng: Number(form.locationLng),
      });

      setMessage("Incident reported successfully.");
      setForm({ title: "", description: "", locationLat: "", locationLng: "" });
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Failed to report incident.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="sn-card">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Report Incident</h2>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Incident Title <span className="text-red-500">*</span>
              </label>
              <input
                className="sn-input"
                placeholder="e.g., Fire on Main Street, Flood near Hospital"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                className="sn-input"
                placeholder="Provide details about the incident..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                required
              />
            </div>

            {/* Location Selector */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Select Location <span className="text-red-500">*</span>
              </label>
              <LocationMapPicker
                latitude={form.locationLat}
                longitude={form.locationLng}
                onLocationChange={handleLocationChange}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!form.locationLat || !form.locationLng}
              className="sn-btn-primary w-full py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Incident Report
            </button>
          </form>

          {/* Success Message */}
          {message && (
            <div className="mt-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400">
              ✓ {message}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
              ✕ {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportIncidentPage;
