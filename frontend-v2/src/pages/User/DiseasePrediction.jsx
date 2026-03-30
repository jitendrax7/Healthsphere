import { useState, useEffect } from 'react';
import { Brain, Heart, Droplets, ArrowLeft, ChevronRight, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { diseaseApi } from '../../api/axios';
import HeartPredictionWizard from '../../components/user/HeartPredictionWizard';

const DISEASE_CARDS = [
  { id: 'heart',    icon: Heart,    title: 'Heart Disease',    desc: 'Predict cardiovascular disease risk using clinical parameters.',        color: 'from-accent-pink to-accent-orange' },
  { id: 'diabetes', icon: Droplets, title: 'Diabetes',         desc: 'Assess diabetes risk based on health metrics and lifestyle factors.',  color: 'from-primary-500 to-accent-cyan' },
  { id: 'skin',     icon: Brain,    title: 'Skin Disease',      desc: 'Upload a skin image for AI-based condition awareness analysis.',       color: 'from-accent-green to-accent-cyan' },
];

const DiseasePrediction = () => {
  const [tab, setTab]               = useState('predict');
  const [disease, setDisease]       = useState(null);
  const [gender, setGender]         = useState(null);
  const [history, setHistory]       = useState([]);
  const [histLoading, setHLoading]  = useState(false);

  useEffect(() => {
    if (tab === 'history') {
      setHLoading(true);
      diseaseApi.getHistory()
        .then(r => setHistory(r.data.data || []))
        .catch(() => {})
        .finally(() => setHLoading(false));
    }
  }, [tab]);

  const reset = () => { setDisease(null); setGender(null); };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Disease Prediction</h1>
        <p className="text-white/40">AI-powered health risk assessment</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 glass rounded-xl w-fit">
        {['predict', 'history'].map(t => (
          <button key={t} onClick={() => { setTab(t); reset(); }}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
              tab === t ? 'bg-primary-600 text-white shadow-glow-primary' : 'text-white/50 hover:text-white'
            }`}>
            {t === 'predict' ? '🔬 Predict' : '📊 History'}
          </button>
        ))}
      </div>

      {/* PREDICT TAB */}
      {tab === 'predict' && (
        <div className="space-y-6">
          {/* Back button */}
          {(disease || gender) && (
            <button onClick={reset} className="flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors">
              <ArrowLeft size={16} /> Back to Selection
            </button>
          )}

          {/* Disease selection grid */}
          {!disease && (
            <div className="grid sm:grid-cols-3 gap-5">
              {DISEASE_CARDS.map(({ id, icon: Icon, title, desc, color }) => (
                <button key={id} onClick={() => setDisease(id)}
                  className="glass p-6 rounded-2xl text-left group hover:-translate-y-1 hover:border-white/20 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
                  <div className="flex items-center gap-1 mt-4 text-primary-400 text-sm font-medium">
                    Start Assessment <ChevronRight size={14} />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Gender selection for diabetes */}
          {disease === 'diabetes' && !gender && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Select Gender for Diabetes Prediction</h3>
              <div className="grid sm:grid-cols-2 gap-4 max-w-lg">
                {['Male','Female'].map(g => (
                  <button key={g} onClick={() => setGender(g.toLowerCase())}
                    className="glass p-6 rounded-xl text-center hover:border-primary-500/40 transition-all">
                    <p className="text-2xl mb-2">{g === 'Male' ? '👨' : '👩'}</p>
                    <p className="font-semibold text-white">{g}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Forms */}
          {disease === 'heart'    && <HeartPredictionWizard onComplete={() => { setTab('history'); reset(); }} />}
          {disease === 'diabetes' && gender && <DiseaseForm type="diabetes" gender={gender} />}
          {disease === 'skin'     && <SkinForm />}
        </div>
      )}

      {/* HISTORY TAB */}
      {tab === 'history' && (
        <div className="space-y-4">
          {histLoading && (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {!histLoading && history.length === 0 && (
            <div className="glass p-12 rounded-2xl text-center text-white/40">
              <Brain size={40} className="mx-auto mb-3 opacity-30" />
              <p>No prediction history found.</p>
            </div>
          )}
          {history.map((item, i) => (
            <div key={i} className="glass p-5 rounded-xl hover:border-white/20 transition-all">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h4 className="font-semibold text-white">{item.disease}</h4>
                  <p className="text-white/40 text-xs mt-1 flex items-center gap-1.5"><Clock size={11} />{item.date} • {item.time}</p>
                </div>
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                  item.prediction === 1 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'
                }`}>
                  {item.prediction === 1 ? <XCircle size={12} /> : <CheckCircle2 size={12} />}
                  {item.riskLevel}
                </span>
              </div>
              <div className="mt-3 flex gap-6 text-sm">
                <div><span className="text-white/40">Prediction: </span><span className="text-white font-medium">{item.prediction}</span></div>
                <div><span className="text-white/40">Probability: </span><span className="text-white font-medium">{item.probability}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Generic Field Form ── */
const DiseaseForm = ({ type, gender }) => {
  const maleFields  = ['Pregnancies','Glucose','BloodPressure','SkinThickness','Insulin','BMI','DiabetesPedigreeFunction','Age'];
  const femaleFields= ['Glucose','BloodPressure','SkinThickness','Insulin','BMI','DiabetesPedigreeFunction','Age'];
  const fields = type === 'heart' ? heartFields : gender === 'female' ? femaleFields : maleFields;

  const [form, setForm]     = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoad]  = useState(false);
  const [error, setError]   = useState('');

  const handleSubmit = async e => {
    e.preventDefault(); setLoad(true); setError(''); setResult(null);
    try {
      const fn  = type === 'heart' ? diseaseApi.predictHeart : diseaseApi.predictDiabetes;
      const res = await fn({ gender, ...form });
      setResult(res.data);
    } catch (err) { setError(err.response?.data?.message || 'Prediction failed.'); }
    finally { setLoad(false); }
  };

  return (
    <div className="glass p-6 rounded-2xl max-w-2xl">
      <h3 className="font-semibold text-white mb-5 capitalize">{type} Prediction Form {gender ? `(${gender})` : ''}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {fields.map(f => (
            <div key={f}>
              <label className="block text-xs font-medium text-white/50 mb-1">{f}</label>
              <input type="number" step="any" required placeholder="0"
                onChange={e => setForm(p => ({ ...p, [f]: parseFloat(e.target.value) }))}
                className="input-dark text-sm py-2" />
            </div>
          ))}
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {result && (
          <div className={`p-4 rounded-xl border ${result.prediction === 1 ? 'border-red-500/30 bg-red-500/10 text-red-400' : 'border-green-500/30 bg-green-500/10 text-green-400'}`}>
            <p className="font-semibold">{result.message || (result.prediction === 1 ? 'High Risk Detected' : 'Low Risk')}</p>
            {result.riskLevel && <p className="text-sm mt-1">Risk: {result.riskLevel} | Probability: {result.probability}</p>}
          </div>
        )}
        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
          {loading ? 'Analyzing...' : '🔬 Run Prediction'}
        </button>
      </form>
    </div>
  );
};

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
    <div className="glass p-6 rounded-2xl max-w-lg">
      <h3 className="font-semibold text-white mb-5">Skin Disease Detection</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-primary-500/40 transition-all cursor-pointer"
          onClick={() => document.getElementById('skin-img')?.click()}>
          <input id="skin-img" type="file" accept="image/*" className="hidden"
            onChange={e => setFile(e.target.files[0])} />
          {file
            ? <><div className="text-4xl mb-2">🖼️</div><p className="text-white/70 text-sm">{file.name}</p></>
            : <><div className="text-4xl mb-2">📸</div><p className="text-white/50 text-sm">Click to upload skin image</p></>
          }
        </div>
        {result && <div className="p-4 rounded-xl bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-sm">{result.message || JSON.stringify(result)}</div>}
        <button type="submit" disabled={!file || loading} className="btn-primary flex items-center gap-2">
          {loading ? 'Analyzing Image...' : '🧴 Analyze Skin'}
        </button>
      </form>
    </div>
  );
};

export default DiseasePrediction;
