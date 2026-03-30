import { useState } from 'react';
import { MapPin, Search, Building2, Pill, Stethoscope, Loader2 } from 'lucide-react';
import { nearbyApi } from '../../api/axios';

const TYPES = [
  { key: 'hospital', label: 'Hospitals',   icon: Building2    },
  { key: 'pharmacy', label: 'Pharmacies',  icon: Pill         },
  { key: 'clinic',   label: 'Clinics',     icon: Stethoscope  },
];

const NearbyFinderPage = () => {
  const [type, setType]       = useState('hospital');
  const [results, setResults] = useState([]);
  const [loading, setLoad]    = useState(false);
  const [searched, setSearch] = useState(false);

  const handleSearch = () => {
    setLoad(true);
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const res = await nearbyApi.find({ type, lat: coords.latitude, lng: coords.longitude });
        setResults(res.data.results || []);
      } catch { setResults([]); }
      finally { setLoad(false); setSearch(true); }
    }, () => { setLoad(false); alert('Please allow location access.'); });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Nearby Finder</h1>
        <p className="text-white/40">Find hospitals, pharmacies, and clinics near you</p>
      </div>

      <div className="glass p-6 rounded-2xl">
        <div className="flex flex-wrap gap-3 mb-5">
          {TYPES.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setType(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                type===key ? 'bg-accent-orange/20 border-accent-orange text-accent-orange' : 'border-white/10 text-white/50 hover:border-white/30'
              }`}>
              <Icon size={15}/> {label}
            </button>
          ))}
        </div>
        <button onClick={handleSearch} disabled={loading}
          className="btn-primary flex items-center gap-2 bg-gradient-to-r from-accent-orange to-accent-pink">
          {loading ? <><Loader2 size={15} className="animate-spin"/>Searching...</> : <><MapPin size={15}/>Find Nearby {TYPES.find(t=>t.key===type)?.label}</>}
        </button>
      </div>

      {searched && (
        <div className="space-y-4">
          {results.length === 0
            ? <div className="glass p-10 rounded-xl text-center text-white/40">
                <MapPin size={36} className="mx-auto mb-3 opacity-30" />
                <p>No {type}s found nearby.</p>
              </div>
            : results.map((r, i) => (
              <div key={i} className="glass p-5 rounded-xl hover:border-white/20 transition-all">
                <h4 className="font-medium text-white">{r.name}</h4>
                <p className="text-white/40 text-sm mt-1 flex items-center gap-1.5"><MapPin size={11}/>{r.address || r.vicinity}</p>
                {r.rating && <p className="text-accent-orange text-sm mt-1">⭐ {r.rating}</p>}
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
};

export default NearbyFinderPage;
