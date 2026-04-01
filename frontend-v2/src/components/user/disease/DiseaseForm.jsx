import { useState } from 'react';
import { diseaseApi } from '../../../api/axios';

const MALE_FIELDS   = ['Pregnancies','Glucose','BloodPressure','SkinThickness','Insulin','BMI','DiabetesPedigreeFunction','Age'];
const FEMALE_FIELDS = ['Glucose','BloodPressure','SkinThickness','Insulin','BMI','DiabetesPedigreeFunction','Age'];

const DiseaseForm = ({ type, gender }) => {
  const fields = gender === 'female' ? FEMALE_FIELDS : MALE_FIELDS;

  const [form, setForm]     = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoad]  = useState(false);
  const [error, setError]   = useState('');

  const handleSubmit = async e => {
    e.preventDefault(); setLoad(true); setError(''); setResult(null);
    try {
      const res = await diseaseApi.predictDiabetes({ gender, ...form });
      setResult(res.data);
    } catch (err) { setError(err.response?.data?.message || 'Prediction failed.'); }
    finally { setLoad(false); }
  };

  return (
    <div className="glass p-5 sm:p-6 rounded-2xl max-w-2xl">
      <h3 className="font-semibold text-white mb-5 capitalize">{type} Prediction Form {gender ? `(${gender})` : ''}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(f => (
            <div key={f}>
              <label className="block text-xs font-medium text-white/50 mb-1">{f}</label>
              <input
                type="number" step="any" required placeholder="0"
                onChange={e => setForm(p => ({ ...p, [f]: parseFloat(e.target.value) }))}
                className="input-dark text-sm py-2"
              />
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

export default DiseaseForm;
