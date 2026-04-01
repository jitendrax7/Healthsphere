import { useState, useEffect } from 'react';
import { Brain, Droplets, Heart, ArrowLeft, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { diseaseApi } from '../../api/axios';
import HeartPredictionWizard from '../../components/user/HeartPredictionWizard';
import DiseaseCard from '../../components/user/disease/DiseaseCard';
import DiseaseForm from '../../components/user/disease/DiseaseForm';
import SkinForm from '../../components/user/disease/SkinForm';

const DISEASE_CARDS = [
  { id: 'heart',    icon: Heart,    title: 'Heart Disease',  desc: 'Predict cardiovascular disease risk using clinical parameters.',       color: 'from-accent-pink to-accent-orange' },
  { id: 'diabetes', icon: Droplets, title: 'Diabetes',       desc: 'Assess diabetes risk based on health metrics and lifestyle factors.',  color: 'from-primary-500 to-accent-cyan'   },
  { id: 'skin',     icon: Brain,    title: 'Skin Disease',   desc: 'Upload a skin image for AI-based condition awareness analysis.',       color: 'from-accent-green to-accent-cyan'  },
];

const DiseasePrediction = () => {
  const [tab, setTab]             = useState('predict');
  const [disease, setDisease]     = useState(null);
  const [gender, setGender]       = useState(null);
  const [history, setHistory]     = useState([]);
  const [histLoading, setHLoading]= useState(false);

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
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Disease Prediction</h1>
        <p className="text-white/40 text-sm md:text-base">AI-powered health risk assessment</p>
      </div>

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

      {tab === 'predict' && (
        <div className="space-y-5">
          {(disease || gender) && (
            <button onClick={reset} className="flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors">
              <ArrowLeft size={16} /> Back to Selection
            </button>
          )}

          {!disease && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              {DISEASE_CARDS.map(card => (
                <DiseaseCard key={card.id} {...card} onSelect={setDisease} />
              ))}
            </div>
          )}

          {disease === 'diabetes' && !gender && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Select Gender for Diabetes Prediction</h3>
              <div className="grid grid-cols-2 gap-4 max-w-xs sm:max-w-sm">
                {['Male', 'Female'].map(g => (
                  <button key={g} onClick={() => setGender(g.toLowerCase())}
                    className="glass p-5 sm:p-6 rounded-xl text-center hover:border-primary-500/40 transition-all">
                    <p className="text-2xl mb-2">{g === 'Male' ? '👨' : '👩'}</p>
                    <p className="font-semibold text-white">{g}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {disease === 'heart'    && <HeartPredictionWizard onComplete={() => { setTab('history'); reset(); }} />}
          {disease === 'diabetes' && gender && <DiseaseForm type="diabetes" gender={gender} />}
          {disease === 'skin'     && <SkinForm />}
        </div>
      )}

      {tab === 'history' && (
        <div className="space-y-4">
          {histLoading && (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {!histLoading && history.length === 0 && (
            <div className="glass p-10 sm:p-12 rounded-2xl text-center text-white/40">
              <Brain size={40} className="mx-auto mb-3 opacity-30" />
              <p>No prediction history found.</p>
            </div>
          )}
          {history.map((item, i) => (
            <div key={i} className="glass p-4 sm:p-5 rounded-xl hover:border-white/20 transition-all">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h4 className="font-semibold text-white">{item.disease}</h4>
                  <p className="text-white/40 text-xs mt-1 flex items-center gap-1.5"><Clock size={11} />{item.date} • {item.time}</p>
                </div>
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                  item.prediction === 1 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'
                }`}>
                  {item.prediction === 1 ? <XCircle size={12} /> : <CheckCircle2 size={12} />}
                  {item.riskLevel}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 sm:gap-6 text-sm">
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

export default DiseasePrediction;
