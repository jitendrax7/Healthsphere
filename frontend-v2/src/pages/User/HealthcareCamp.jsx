import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tent, Calendar, Loader2, ArrowRight, Clock, MapPin,
  Navigation, X, Save, Radio,
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { campApi } from '../../api/axios';
import { useApp } from '../../context/AppContext';

// Fix default Leaflet marker icons (Vite asset pipeline issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom pulse marker for the search pin
const pulseIcon = L.divIcon({
  className: '',
  html: `
    <div style="position:relative;width:32px;height:32px;">
      <div style="
        position:absolute;inset:0;border-radius:50%;
        background:rgba(52,211,153,0.25);
        animation:ping 1.4s cubic-bezier(0,0,0.2,1) infinite;
      "></div>
      <div style="
        position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
        width:14px;height:14px;border-radius:50%;
        background:#34d399;border:2.5px solid #fff;
        box-shadow:0 2px 8px rgba(52,211,153,0.6);
      "></div>
    </div>
  `,
  iconSize:   [32, 32],
  iconAnchor: [16, 16],
});

// Component: listens to map click / drag and updates pin
function MapClickHandler({ onPositionChange }) {
  useMapEvents({
    click(e) {
      onPositionChange([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

// Component: flies map to a given center
function FlyTo({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 11, { animate: true, duration: 1.2 });
  }, [center, map]);
  return null;
}

// ─── Draggable marker that reports its final position ───────────────────────
function DraggableMarker({ position, onPositionChange }) {
  const markerRef = useRef(null);
  const eventHandlers = {
    dragend() {
      const m = markerRef.current;
      if (m) {
        const { lat, lng } = m.getLatLng();
        onPositionChange([lat, lng]);
      }
    },
  };
  return (
    <Marker
      draggable
      position={position}
      icon={pulseIcon}
      ref={markerRef}
      eventHandlers={eventHandlers}
    />
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
const HealthcareCamp = () => {
  const { user } = useApp();
  const navigate  = useNavigate();

  // User's saved location from context (populated by getContext endpoint)
  const savedLat = user?.location?.latitude;
  const savedLng = user?.location?.longitude;
  const defaultPos = (savedLat && savedLng)
    ? [parseFloat(savedLat), parseFloat(savedLng)]
    : [20.5937, 78.9629]; // centre of India fallback

  // State
  const [camps,       setCamps]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [mapOpen,     setMapOpen]     = useState(false);
  const [pinPos,      setPinPos]      = useState(defaultPos);
  const [flyCenter,   setFlyCenter]   = useState(null);
  const [gpsLoading,  setGpsLoading]  = useState(false);
  const [searchPos,   setSearchPos]   = useState(null); // last committed search location
  const [filterLabel, setFilterLabel] = useState(null); // text shown under header

  // ── Fetch camps (called on mount + after "Save") ────────────────────────
  const fetchCamps = useCallback((lat, lng) => {
    setLoading(true);
    const params = lat != null ? { lat, lng, radius: 150000 } : {};
    campApi.getAll(params)
      .then(r => setCamps(r.data.camps || []))
      .catch(() => setCamps([]))
      .finally(() => setLoading(false));
  }, []);

  // Initial load — use saved location if available
  useEffect(() => {
    if (savedLat && savedLng) {
      setSearchPos([parseFloat(savedLat), parseFloat(savedLng)]);
      setFilterLabel('your saved location');
      fetchCamps(savedLat, savedLng);
    } else {
      fetchCamps(); // no filter
    }
  }, []); // run once; user context is already loaded by the time this mounts

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleSave = () => {
    setSearchPos(pinPos);
    setFilterLabel(`${pinPos[0].toFixed(4)}°N, ${pinPos[1].toFixed(4)}°E`);
    setMapOpen(false);
    fetchCamps(pinPos[0], pinPos[1]);
  };

  const handleLiveGPS = () => {
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = [coords.latitude, coords.longitude];
        setPinPos(pos);
        setFlyCenter(pos);
        setGpsLoading(false);
      },
      () => setGpsLoading(false),
    );
  };

  const openMap = () => {
    // Pre-set pin to last searched position (or default)
    setPinPos(searchPos || defaultPos);
    setFlyCenter(null);
    setMapOpen(true);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5 animate-fade-in pb-12 relative">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Healthcare Camps</h1>
          <p className="text-white/40 text-sm md:text-base max-w-xl">
            {filterLabel && (
              <span className="ml-1 text-accent-green/80">
                Showing camps near <span className="font-medium text-accent-green">{filterLabel}</span>.
              </span>
            )}
          </p>
        </div>

        {/* Location picker button */}
        <button
          id="camp-location-picker-btn"
          onClick={openMap}
          title="Set search location"
          className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl
                     bg-accent-green/10 border border-accent-green/30 text-accent-green
                     hover:bg-accent-green/20 hover:border-accent-green/60
                     transition-all duration-200 text-sm font-medium"
        >
          <MapPin size={15} />
          <span className="hidden sm:inline">Set Location</span>
        </button>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-white/50 space-y-4">
          <Loader2 size={32} className="animate-spin text-accent-green" />
          <p>Loading nearby camps...</p>
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && camps.length === 0 && (
        <div className="glass p-10 sm:p-16 rounded-3xl text-center text-white/40 max-w-2xl mx-auto mt-10">
          <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-accent-green/10 flex items-center justify-center mx-auto mb-4 border border-accent-green/20">
            <Tent size={24} className="text-accent-green opacity-80" />
          </div>
          {searchPos ? (
            <>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">No Camps Nearby</h3>
              <p className="max-w-sm mx-auto text-sm sm:text-base mb-4">
                No camps found within 150 km of the selected pin. Move your search pin to explore a different area.
              </p>
              <button
                onClick={openMap}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-green/10 border border-accent-green/30 text-accent-green text-sm hover:bg-accent-green/20 transition-all"
              >
                <MapPin size={14} /> Move Search Pin
              </button>
            </>
          ) : (
            <>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">No Camps Scheduled</h3>
              <p className="max-w-sm mx-auto text-sm sm:text-base">
                There are currently no upcoming healthcare camps. Please check back later.
              </p>
            </>
          )}
        </div>
      )}

      {/* ── Camp cards grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {camps.map((camp) => (
          <div
            key={camp._id || camp.id}
            className="glass p-4 sm:p-5 rounded-2xl hover:border-accent-green/30 hover:-translate-y-1 transition-all duration-300 flex flex-col group overflow-hidden relative"
          >
            <div className="h-36 sm:h-40 -mx-4 sm:-mx-5 -mt-4 sm:-mt-5 mb-4 relative overflow-hidden bg-white/5 border-b border-white/5">
              {camp.posterImage ? (
                <img src={camp.posterImage.url || camp.posterImage} alt={camp.title} className="w-full h-full object-cover" />
              ) : (
                <Tent size={42} className="text-white/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/20 to-transparent" />
              <div className="absolute top-3 right-3">
                <span className="text-[10px] bg-black/40 backdrop-blur-md border border-white/10 text-white px-2.5 py-1 rounded-full font-medium uppercase tracking-widest shadow-lg">
                  {camp.campType?.replace('_', ' ')}
                </span>
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white mb-1 leading-tight line-clamp-2">{camp.title}</h3>
            {camp.hospital?.hospitalName && (
              <p className="text-accent-cyan text-[12px] font-medium mb-2">{camp.hospital.hospitalName}</p>
            )}
            {camp.description && (
              <p className="text-white/40 text-[13px] mb-4 line-clamp-2 leading-relaxed">{camp.description}</p>
            )}

            <div className="space-y-1.5 mt-auto pt-3 border-t border-white/5 mb-4">
              <p className="text-white/60 text-xs flex items-center gap-2">
                <Calendar size={12} className="text-accent-green" />
                <span className="font-medium text-white/80">{new Date(camp.startDate).toLocaleDateString()}</span>
              </p>
              <p className="text-white/60 text-xs flex items-center gap-2">
                <Clock size={12} className="text-amber-400" />
                {camp.startTime} - {camp.endTime}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-white/60 text-xs flex items-center gap-2">
                  <MapPin size={12} className="text-accent-cyan" />
                  {camp.location?.city}, {camp.location?.state}
                </p>
                <span className="text-white/40 text-[10px]">{camp.totalRegistrations} / {camp.maxParticipants} slots</span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/user/healthcarecamp/${camp._id || camp.id}`)}
              className="w-full py-2 sm:py-2.5 rounded-xl border border-white/10 bg-white/5 text-white/70 text-sm font-medium
                         hover:bg-white/10 hover:border-accent-green/30 hover:text-white transition-all
                         group-hover:bg-accent-green/10 group-hover:text-accent-green group-hover:border-accent-green
                         flex items-center justify-center gap-2"
            >
              View Details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MAP POPUP OVERLAY                                                   */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {mapOpen && (
        <div
          id="camp-map-overlay"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-6"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setMapOpen(false); }}
        >
          <div
            className="w-full sm:w-[420px] rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: 'rgba(15,23,42,0.96)',
              border: '1px solid rgba(52,211,153,0.25)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Map header bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-accent-green" />
                <span className="text-white text-sm font-semibold">Set Search Location</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Live GPS button */}
                <button
                  id="camp-map-gps-btn"
                  onClick={handleLiveGPS}
                  disabled={gpsLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                             bg-accent-green/15 border border-accent-green/40 text-accent-green
                             hover:bg-accent-green/25 transition-all text-xs font-medium"
                >
                  {gpsLoading
                    ? <Loader2 size={12} className="animate-spin" />
                    : <Radio size={12} />}
                  Live GPS
                </button>

                {/* Save button */}
                <button
                  id="camp-map-save-btn"
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                             bg-accent-green text-white font-semibold text-xs
                             hover:bg-green-400 transition-all shadow-md"
                >
                  <Save size={12} />
                  Save
                </button>

                {/* Close */}
                <button
                  id="camp-map-close-btn"
                  onClick={() => setMapOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-all"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Leaflet map */}
            <div style={{ height: 320, position: 'relative' }}>
              <MapContainer
                center={pinPos}
                zoom={7}
                style={{ height: '100%', width: '100%', background: '#0f172a' }}
                zoomControl={true}
                attributionControl={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution=""
                />
                <MapClickHandler onPositionChange={(pos) => { setPinPos(pos); setFlyCenter(null); }} />
                {flyCenter && <FlyTo center={flyCenter} />}
                {/* 150 km search-radius ring */}
                <Circle
                  center={pinPos}
                  radius={150000}
                  pathOptions={{
                    color: '#34d399',
                    fillColor: '#34d399',
                    fillOpacity: 0.08,
                    weight: 2,
                    dashArray: '6 4',
                  }}
                />
                <DraggableMarker position={pinPos} onPositionChange={setPinPos} />
              </MapContainer>

              {/* Hint overlay at bottom of map */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 8, left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 9999,
                  pointerEvents: 'none',
                  background: 'rgba(15,23,42,0.82)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(52,211,153,0.3)',
                  borderRadius: 24,
                  padding: '4px 14px',
                }}
              >
                <span style={{ color: '#34d399', fontSize: 12, fontWeight: 600 }}>
                  📍 {pinPos[0].toFixed(4)}°N, {pinPos[1].toFixed(4)}°E
                </span>
              </div>
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2.5 border-t border-white/5 flex items-center gap-2 text-white/35 text-[11px]">
              <Navigation size={11} />
              Tap the map or drag the pin to choose a location. Hit Save to search camps nearby.
            </div>
          </div>
        </div>
      )}

      {/* Keyframes for the ping animation used in pulseIcon */}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default HealthcareCamp;
