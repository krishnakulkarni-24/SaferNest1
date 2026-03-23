import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { incidentApi } from "../api/services";

const IncidentsPage = () => {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    incidentApi.list().then((response) => setIncidents(response.data));
  }, []);

  const mapCenter = useMemo(() => {
    if (incidents.length > 0) {
      return [incidents[0].locationLat, incidents[0].locationLng];
    }
    return [20.5937, 78.9629];
  }, [incidents]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-3 h-[500px]">
        <MapContainer center={mapCenter} zoom={5} className="h-full w-full rounded">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {incidents.map((incident) => (
            <Marker key={incident.id} position={[incident.locationLat, incident.locationLng]}>
              <Popup>
                <strong>{incident.title}</strong>
                <br />
                {incident.status}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 overflow-auto h-[500px]">
        <h2 className="font-bold text-lg mb-3">Incident List</h2>
        <div className="space-y-3">
          {incidents.map((incident) => (
            <div key={incident.id} className="p-3 rounded border border-slate-200 dark:border-slate-700">
              <p className="font-semibold">{incident.title}</p>
              <p className="text-sm text-slate-500">{incident.description}</p>
              <p className="text-sm mt-1">Status: {incident.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IncidentsPage;
