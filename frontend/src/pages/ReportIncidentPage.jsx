import { useState } from "react";
import { incidentApi } from "../api/services";

const ReportIncidentPage = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    locationLat: "",
    locationLng: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [locating, setLocating] = useState(false);

  const pickCurrentLocation = () => {
    setMessage("");
    setError("");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          locationLat: position.coords.latitude.toFixed(6),
          locationLng: position.coords.longitude.toFixed(6),
        }));
        setLocating(false);
      },
      () => {
        setError("Unable to fetch current location. Please allow location access.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

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
    <div className="max-w-2xl bg-white dark:bg-slate-800 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Report Incident</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full p-2 border rounded bg-transparent" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <textarea className="w-full p-2 border rounded bg-transparent" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} required />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="w-full p-2 border rounded bg-transparent" placeholder="Latitude" value={form.locationLat} onChange={(e) => setForm({ ...form, locationLat: e.target.value })} required />
          <input className="w-full p-2 border rounded bg-transparent" placeholder="Longitude" value={form.locationLng} onChange={(e) => setForm({ ...form, locationLng: e.target.value })} required />
        </div>
        <button type="button" onClick={pickCurrentLocation} className="px-4 py-2 rounded bg-slate-600 text-white">
          {locating ? "Fetching location..." : "Pick Current Location"}
        </button>

        <button className="px-4 py-2 rounded bg-blue-600 text-white">Submit</button>
      </form>
      {message && <p className="mt-3 text-green-600">{message}</p>}
      {error && <p className="mt-3 text-red-600">{error}</p>}
    </div>
  );
};

export default ReportIncidentPage;
