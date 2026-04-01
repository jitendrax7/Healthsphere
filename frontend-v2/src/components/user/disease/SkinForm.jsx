import { useState } from 'react';
import { diseaseApi } from '../../../api/axios';

const SkinForm = () => {
  const [file, setFile]     = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoad]  = useState(false);

  const handleSubmit = async e => {
    e.preventDefault(); if (!file) return;
    setLoad(true);
    const fd = new FormData(); fd.append('image', file);
    try {
      const res = await diseaseApi.predictSkin(fd);
      setResult(res.data);
    } catch { }
    finally { setLoad(false); }
  };

  return (
    <div className="glass p-5 sm:p-6 rounded-2xl max-w-lg">
      <h3 className="font-semibold text-white mb-5">Skin Disease Detection</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div
          className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-primary-500/40 transition-all cursor-pointer"
          onClick={() => document.getElementById('skin-img')?.click()}
        >
          <input id="skin-img" type="file" accept="image/*" className="hidden"
            onChange={e => setFile(e.target.files[0])} />
          {file
            ? <><div className="text-4xl mb-2">🖼️</div><p className="text-white/70 text-sm">{file.name}</p></>
            : <><div className="text-4xl mb-2">📸</div><p className="text-white/50 text-sm">Click to upload skin image</p></>
          }
        </div>
        {result && (
          <div className="p-4 rounded-xl bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-sm">
            {result.message || JSON.stringify(result)}
          </div>
        )}
        <button type="submit" disabled={!file || loading} className="btn-primary flex items-center gap-2">
          {loading ? 'Analyzing Image...' : '🧴 Analyze Skin'}
        </button>
      </form>
    </div>
  );
};

export default SkinForm;
