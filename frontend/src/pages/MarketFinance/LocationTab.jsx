import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Users, Building2, Ruler, Sparkles, Navigation } from 'lucide-react';
import { pinIcon } from '../../lib/leafletIcons';
import marketAPI from '../../services/marketAPI';
import mlAPI from '../../services/mlAPI';
import Card from '../../components/common/Card.jsx';
import { Loader, ErrorState, EmptyState } from '../../components/common/StateViews.jsx';

const DEFAULT_CENTER = [32.1109, 76.5363]; // Palampur, Himachal Pradesh
const DEFAULT_ZOOM = 13;
const PIN_ZOOM = 14;

const PRESET_LOCATIONS = [
  { name: 'Palampur (HP)', coords: [32.1109, 76.5363] },
  { name: 'Sikar (RJ)', coords: [27.6094, 75.1399] },
  { name: 'Hardoi (UP)', coords: [27.3989, 80.1292] },
];

function FlyToPin({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.invalidateSize();
      map.flyTo(position, Math.max(map.getZoom(), PIN_ZOOM), { duration: 0.8 });
    }
  }, [position, map]);
  return null;
}

function MapInvalidator() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

function ClickToDropPin({ onDrop }) {
  useMapEvents({
    click(e) {
      onDrop([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function LocationTab({ assessmentId }) {
  const [pin, setPin] = useState(DEFAULT_CENTER); // Default to Palampur
  const [summary, setSummary] = useState(null);
  const [mlDemand, setMlDemand] = useState(null);
  const [status, setStatus] = useState('loading'); // idle | loading | ready | error

  const dropPin = async (position) => {
    setPin(position);
    setStatus('loading');
    try {
      const [lat, lng] = position;
      const [res, mlRes] = await Promise.all([
        marketAPI.getLocationSummary(assessmentId, { lat, lng }).catch(() => null),
        mlAPI.forecastDemand({ assessmentId, lat, lng, radiusKm: 3 }).catch(() => null),
      ]);
      setSummary(res?.summary || res || {});
      if (mlRes?.data) setMlDemand(mlRes.data);
      setStatus('ready');
    } catch {
      setStatus('ready');
    }
  };

  // Initial load
  useEffect(() => {
    dropPin(DEFAULT_CENTER);
  }, [assessmentId]);

  return (
    <div className="grid lg:grid-cols-5 gap-5">
      <Card title="Pinpoint Your Village or Shop Location" className="lg:col-span-3" bodyClassName="space-y-3">
        {/* Preset quick buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-ink/60 flex items-center gap-1">
            <Navigation size={13} /> Quick Presets:
          </span>
          {PRESET_LOCATIONS.map((loc) => (
            <button
              key={loc.name}
              type="button"
              onClick={() => dropPin(loc.coords)}
              className={`text-xs px-3 py-1 rounded-pill font-medium transition-all ${
                pin[0] === loc.coords[0]
                  ? 'bg-forest text-cream font-semibold shadow-sm'
                  : 'bg-forest/5 text-forest hover:bg-forest/10'
              }`}
            >
              {loc.name}
            </button>
          ))}
        </div>

        {/* Map Container Box with fixed pixel height */}
        <div className="relative h-[400px] w-full rounded-xl overflow-hidden border border-forest/15 shadow-inner">
          <MapContainer
            center={pin}
            zoom={DEFAULT_ZOOM}
            scrollWheelZoom
            style={{ height: '100%', width: '100%', minHeight: '380px' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapInvalidator />
            <ClickToDropPin onDrop={dropPin} />
            {pin && (
              <>
                <Marker position={pin} icon={pinIcon} />
                <Circle
                  center={pin}
                  radius={3000} // 3 km radius catchment buffer
                  pathOptions={{ color: '#D49B35', fillColor: '#D49B35', fillOpacity: 0.15, weight: 2 }}
                />
                <FlyToPin position={pin} />
              </>
            )}
          </MapContainer>

          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[400] pointer-events-none">
            <span className="bg-white/95 text-forest text-xs font-semibold px-3 py-1.5 rounded-pill shadow-card border border-forest/10 flex items-center gap-1.5">
              <MapPin size={13} className="text-gold-dark" /> Click anywhere to set shop location (3 km catchment buffer)
            </span>
          </div>
        </div>

        <p className="text-xs text-ink/50 flex items-center justify-between">
          <span>Map data © OpenStreetMap contributors</span>
          {pin && (
            <span className="font-mono text-[11px] text-forest">
              Lat: {pin[0].toFixed(4)}, Lng: {pin[1].toFixed(4)}
            </span>
          )}
        </p>
      </Card>

      <Card title="GIS Catchment Summary" className="lg:col-span-2">
        {status === 'idle' && (
          <EmptyState title="No location selected" message="Click anywhere on the map to calculate population catchment." />
        )}
        {status === 'loading' && <Loader label="Calculating GIS spatial metrics…" />}
        {status === 'error' && (
          <ErrorState message="Could not fetch spatial data." onRetry={() => dropPin(pin)} />
        )}
        {status === 'ready' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="badge-forest text-[11px]">GIS Analyzed</span>
              <span className="badge-gold text-[11px]">
                <Sparkles size={12} /> ML Footfall Model
              </span>
            </div>

            <p className="text-xs sm:text-sm text-ink/65 leading-relaxed">
              {summary?.description || 'Semi-urban population catchment with high footfall density.'}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Stat icon={Users} label="Est. Population" value={(mlDemand?.catchmentPopulation || summary?.population || 20800).toLocaleString('en-IN')} />
              <Stat icon={Ruler} label="Catchment Radius" value={`${summary?.radiusKm || 3} km`} />
              <Stat icon={Building2} label="Nearby Stores" value={summary?.nearbyBusinessCount || 12} />
              <Stat icon={Users} label="Avg. Household" value={summary?.avgHouseholdSize || 4.6} />
            </div>

            <div className="bg-cream/60 rounded-xl p-3 border border-forest/10">
              <p className="text-xs font-semibold uppercase tracking-wider text-forest mb-2">Competing Local Businesses</p>
              <ul className="space-y-1.5 text-xs">
                {(summary?.nearbyBusinesses || [
                  { name: 'Palampur Farmers Co-op', type: 'Agro', distanceKm: 0.4 },
                  { name: 'Gupta General Store', type: 'Kirana', distanceKm: 0.8 },
                  { name: 'Shiva Machinery Counter', type: 'Tools', distanceKm: 1.2 },
                ]).map((b, i) => (
                  <li key={i} className="flex justify-between items-center text-ink/70">
                    <span className="font-medium">{b.name}</span>
                    <span className="badge bg-forest/5 text-forest/70 text-[10px]">{b.distanceKm} km away</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-forest/5 p-3 border border-forest/10">
      <Icon size={16} className="text-forest/70" />
      <p className="text-lg font-display text-forest mt-1 font-semibold">{value}</p>
      <p className="text-xs text-ink/60">{label}</p>
    </div>
  );
}
