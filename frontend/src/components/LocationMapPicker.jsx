import { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { MapPin, Loader } from "lucide-react";

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const MapPickerContent = ({ position, setPosition, onLocationChange }) => {
  const map = useMapEvents({
    click(e) {
      const newPos = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
      onLocationChange(
        parseFloat(newPos[0].toFixed(6)),
        parseFloat(newPos[1].toFixed(6))
      );
    },
  });

  return position ? <Marker position={position} /> : null;
};

const LocationMapPicker = ({ latitude, longitude, onLocationChange }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [position, setPosition] = useState(
    latitude && longitude ? [parseFloat(latitude), parseFloat(longitude)] : null
  );
  const mapRef = useRef(null);

  // Use current location
  const handleUseCurrentLocation = () => {
    setError("");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (geoPosition) => {
        const newPos = [geoPosition.coords.latitude, geoPosition.coords.longitude];
        setPosition(newPos);
        onLocationChange(
          parseFloat(newPos[0].toFixed(6)),
          parseFloat(newPos[1].toFixed(6))
        );
        setLoading(false);

        // Center map on new location
        if (mapRef.current) {
          mapRef.current.setView(newPos, 15);
        }
      },
      (err) => {
        setError("Unable to fetch current location. Please allow location access or click on the map.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Remove the problematic useEffect that was causing infinite loop

  const defaultCenter = [20.5937, 78.9629]; // India center
  const mapCenter = position || defaultCenter;

  return (
    <div className="space-y-3">
      {/* Map Container */}
      <div className="rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-md">
        <MapContainer
          ref={mapRef}
          center={mapCenter}
          zoom={position ? 15 : 4}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <MapPickerContent position={position} setPosition={setPosition} onLocationChange={onLocationChange} />
        </MapContainer>
      </div>

      {/* Location Actions */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={loading}
          className="sn-btn-primary flex items-center justify-center gap-2 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader size={18} className="animate-spin" />
              Fetching location...
            </>
          ) : (
            <>
              <MapPin size={18} />
              Use Current Location
            </>
          )}
        </button>
      </div>

      {/* Instructions */}
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        Click on the map to select a location or use the button above
      </p>

      {/* Selected Coordinates Display */}
      {position && (
        <div className="sn-card">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Latitude
              </label>
              <p className="text-lg font-mono text-blue-600 dark:text-blue-400 mt-1">
                {position[0].toFixed(6)}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Longitude
              </label>
              <p className="text-lg font-mono text-blue-600 dark:text-blue-400 mt-1">
                {position[1].toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* No Location Selected Warning */}
      {!position && (
        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-sm">
          ⚠️ Please select a location to continue
        </div>
      )}
    </div>
  );
};

export default LocationMapPicker;
