import { useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle2, AlertTriangle, Info, Activity } from 'lucide-react';
import { diseaseApi } from '../../api/axios';

const QUESTIONS = [
  {
    id: 'BMI',
    type: 'number',
    title: 'What is your BMI?',
    desc: 'Body Mass Index. A measure of body fat based on height and weight. Normal is typically 18.5 to 24.9.',
    placeholder: 'e.g., 22.5',
    min: 10,
    max: 100
  },
  {
    id: 'Sex',
    type: 'select',
    title: 'Biological Sex',
    desc: 'Your biological sex at birth.',
    options: [{ label: 'Select', value: '' }, { label: 'Male', value: 1 }, { label: 'Female', value: 0 }]
  },
  {
    id: 'AgeCategory',
    type: 'select',
    title: 'Age Category',
    desc: 'Select your age range.',
    options: [
      { label: 'Select', value: '' },
      { label: '18-24', value: '18-24' },
      { label: '25-29', value: '25-29' },
      { label: '30-34', value: '30-34' },
      { label: '35-39', value: '35-39' },
      { label: '40-44', value: '40-44' },
      { label: '45-49', value: '45-49' },
      { label: '50-54', value: '50-54' },
      { label: '55-59', value: '55-59' },
      { label: '60-64', value: '60-64' },
      { label: '65-69', value: '65-69' },
      { label: '70-74', value: '70-74' },
      { label: '75-79', value: '75-79' },
      { label: '80+', value: '80+' }
    ]
  },
  {
    id: 'Race',
    type: 'select',
    title: 'Race / Ethnicity',
    desc: 'Which of these groups best represents you?',
    options: [
      { label: 'Select', value: '' },
      { label: 'White', value: 'White' },
      { label: 'Black', value: 'Black' },
      { label: 'Asian', value: 'Asian' },
      { label: 'American Indian', value: 'American Indian' },
      { label: 'Other', value: 'Other' }
    ]
  },
  {
    id: 'GenHealth',
    type: 'select',
    title: 'General Health',
    desc: 'Would you say that in general your health is...',
    options: [
      { label: 'Select', value: '' },
      { label: 'Excellent', value: 'Excellent' },
      { label: 'Very Good', value: 'Very Good' },
      { label: 'Good', value: 'Good' },
      { label: 'Fair', value: 'Fair' },
      { label: 'Poor', value: 'Poor' }
    ]
  },
  {
    id: 'SleepTime',
    type: 'number',
    title: 'Sleep Time',
    desc: 'On average, how many hours of sleep do you get in a 24-hour period?',
    placeholder: 'e.g., 7',
    min: 0,
    max: 24
  },
  {
    id: 'PhysicalHealth',
    type: 'number',
    title: 'Physical Health (Days)',
    desc: 'Out of the past 30 days, how many days was your physical health not good? (0-30)',
    placeholder: '0 to 30',
    min: 0,
    max: 30
  },
  {
    id: 'MentalHealth',
    type: 'number',
    title: 'Mental Health (Days)',
    desc: 'Out of the past 30 days, how many days was your mental health not good? (0-30)',
    placeholder: '0 to 30',
    min: 0,
    max: 30
  },
  {
    id: 'Smoking',
    type: 'boolean',
    title: 'Smoking',
    desc: 'Have you smoked at least 100 cigarettes in your entire life?'
  },
  {
    id: 'AlcoholDrinking',
    type: 'boolean',
    title: 'Heavy Alcohol Drinking',
    desc: 'Adult men having more than 14 drinks/week or women having more than 7 drinks/week.'
  },
  {
    id: 'PhysicalActivity',
    type: 'boolean',
    title: 'Physical Activity',
    desc: 'Did you do physical activity or exercise during the past 30 days other than your regular job?'
  },
  {
    id: 'Diabetic',
    type: 'select',
    title: 'Diabetic Status',
    desc: 'Have you ever been told you have diabetes?',
    options: [
      { label: 'Select', value: '' },
      { label: 'No', value: 'No' },
      { label: 'Yes', value: 'Yes' },
      { label: 'Borderline', value: 'Borderline' },
      { label: 'During Pregnancy', value: 'During Pregnancy' }
    ]
  },
  {
    id: 'Stroke',
    type: 'boolean',
    title: 'Stroke History',
    desc: 'Have you ever been told you had a stroke?'
  },
  {
    id: 'DiffWalking',
    type: 'boolean',
    title: 'Difficulty Walking',
    desc: 'Do you have serious difficulty walking or climbing stairs?'
  },
  {
    id: 'Asthma',
    type: 'boolean',
    title: 'Asthma',
    desc: 'Have you ever been told you had asthma?'
  },
  {
    id: 'KidneyDisease',
    type: 'boolean',
    title: 'Kidney Disease',
    desc: 'Were you ever told you had kidney disease (excluding kidney stones/infections)?'
  },
  {
    id: 'SkinCancer',
    type: 'boolean',
    title: 'Skin Cancer',
    desc: 'Have you ever been told you had skin cancer?'
  }
];

const HeartPredictionWizard = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    BMI: '',
    Sex: '',
    AgeCategory: '',
    Race: '',
    GenHealth: '',
    SleepTime: '',
    PhysicalHealth: '',
    MentalHealth: '',
    Smoking: null,
    AlcoholDrinking: null,
    PhysicalActivity: null,
    Diabetic: '',
    Stroke: null,
    DiffWalking: null,
    Asthma: null,
    KidneyDisease: null,
    SkinCancer: null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const currentQ = QUESTIONS[step];
  const progress = ((step) / QUESTIONS.length) * 100;

  const isCurrentStepValid = () => {
    const val = formData[currentQ.id];
    if (val === null || val === '') return false;
    if (currentQ.type === 'number') {
      const num = Number(val);
      if (isNaN(num)) return false;
      if (currentQ.min !== undefined && num < currentQ.min) return false;
      if (currentQ.max !== undefined && num > currentQ.max) return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (!isCurrentStepValid()) return;
    
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      await submitPrediction();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const submitPrediction = async () => {
    setLoading(true);
    setError('');
    
    // Format payload
    const payload = { ...formData };
    
    // Convert boolean nulls to actual format if needed (they should be 1/0 based on requirements)
    QUESTIONS.filter(q => q.type === 'boolean').forEach(q => {
      payload[q.id] = payload[q.id] === true ? 1 : 0;
    });
    // Ensure numbers are cast correctly
    QUESTIONS.filter(q => q.type === 'number').forEach(q => {
      payload[q.id] = Number(payload[q.id]);
    });

    try {
      const res = await diseaseApi.predictHeart(payload);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze heart data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (val) => {
    setFormData(prev => ({ ...prev, [currentQ.id]: val }));
  };

  if (result) {
    return (
      <div className="glass p-8 rounded-3xl max-w-2xl mx-auto animate-fade-in text-center shadow-xl">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-accent-pink to-accent-orange shadow-lg mb-6">
          <Activity size={36} className="text-white" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">{result.message || 'Prediction Complete'}</h2>
        
        {result.data && (
          <div className="mt-8 space-y-4 text-left">
            <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center py-10 transition-all ${
              result.data.prediction === 1 
                ? 'bg-red-500/10 border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.15)]' 
                : 'bg-green-500/10 border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.15)]'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                {result.data.prediction === 1 ? (
                  <AlertTriangle size={32} className="text-red-400" />
                ) : (
                  <CheckCircle2 size={32} className="text-green-400" />
                )}
                <h3 className={`text-2xl font-bold ${result.data.prediction === 1 ? 'text-red-400' : 'text-green-400'}`}>
                  {result.data.riskLevel || (result.data.prediction === 1 ? 'High Risk' : 'Low Risk')}
                </h3>
              </div>
              <p className="text-white/70 text-lg">
                Probability: <span className="font-semibold text-white">{result.data.probability || 'N/A'}</span>
              </p>
            </div>
            
             <div className="flex justify-between text-sm text-white/40 px-4 mt-8">
               <p>Date: {result.data.date}</p>
               <p>Time: {result.data.time}</p>
             </div>
          </div>
        )}

        <button 
          onClick={onComplete}
          className="mt-10 btn-primary w-full max-w-xs mx-auto text-lg py-3 rounded-xl"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="glass p-8 rounded-3xl max-w-2xl mx-auto shadow-xl relative overflow-hidden transition-all duration-300 min-h-[400px] flex flex-col">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
        <div 
          className="h-full bg-gradient-to-r from-accent-pink to-accent-orange transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between items-center mb-8 pt-2">
        <span className="text-sm font-medium text-white/40 tracking-wider">
          QUESTION {step + 1} OF {QUESTIONS.length}
        </span>
        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-accent-pink/20 to-accent-orange/20 text-accent-pink border border-accent-pink/20 text-xs font-semibold">
          Heart Health
        </span>
      </div>

      <div className="flex-1 min-h-[220px]">
        {/* Question Title & Desc */}
        <h2 className="text-3xl font-bold text-white mb-4 leading-tight">{currentQ.title}</h2>
        
        {currentQ.desc && (
          <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl mb-8 border border-white/10">
            <Info size={20} className="text-accent-cyan mt-0.5 shrink-0" />
            <p className="text-white/70 text-sm leading-relaxed">{currentQ.desc}</p>
          </div>
        )}

        {/* Inputs */}
        <div className="animate-fade-in-up w-full">
          {currentQ.type === 'number' && (
            <input
              type="number"
              value={formData[currentQ.id]}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={currentQ.placeholder}
              min={currentQ.min}
              max={currentQ.max}
              className="w-full bg-dark-800/50 border border-white/10 rounded-2xl px-6 py-4 text-xl text-white outline-none focus:border-accent-pink/50 focus:bg-dark-800 transition-all shadow-inner"
              autoFocus
            />
          )}

          {currentQ.type === 'select' && (
            <div className="relative">
              <select
                value={formData[currentQ.id]}
                onChange={(e) => handleChange(e.target.value)}
                className="w-full bg-dark-800/50 border border-white/10 rounded-2xl px-6 py-4 text-xl text-white outline-none focus:border-accent-pink/50 focus:bg-dark-800 transition-all appearance-none cursor-pointer"
              >
                {currentQ.options.map((opt, i) => (
                  <option key={i} value={opt.value} className="bg-dark-900 text-white py-2">
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                <ChevronRight size={20} className="rotate-90" />
              </div>
            </div>
          )}

          {currentQ.type === 'boolean' && (
            <div className="grid grid-cols-2 gap-4 h-full">
              <button
                onClick={() => handleChange(true)}
                className={`py-5 rounded-2xl text-xl font-medium transition-all duration-300 border ${
                  formData[currentQ.id] === true 
                    ? 'bg-accent-pink/20 border-accent-pink/50 text-white shadow-[0_0_20px_rgba(226,51,107,0.2)]' 
                    : 'bg-dark-800/50 border-white/10 text-white/60 hover:border-white/30 hover:bg-dark-800'
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => handleChange(false)}
                className={`py-5 rounded-2xl text-xl font-medium transition-all duration-300 border ${
                  formData[currentQ.id] === false 
                    ? 'bg-accent-orange/20 border-accent-orange/50 text-white shadow-[0_0_20px_rgba(249,115,22,0.2)]' 
                    : 'bg-dark-800/50 border-white/10 text-white/60 hover:border-white/30 hover:bg-dark-800'
                }`}
              >
                No
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-3">
          <AlertTriangle size={18} />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/10">
        <button
          onClick={handleBack}
          disabled={step === 0 || loading}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
            step === 0 ? 'opacity-0 pointer-events-none' : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <ChevronLeft size={18} /> Back
        </button>

        <button
          onClick={handleNext}
          disabled={!isCurrentStepValid() || loading}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 ${
            !isCurrentStepValid() 
              ? 'bg-white/5 text-white/30 cursor-not-allowed' 
              : 'bg-gradient-to-r from-accent-pink to-accent-orange text-white hover:shadow-[0_0_20px_rgba(226,51,107,0.4)] hover:-translate-y-0.5'
          }`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </span>
          ) : step === QUESTIONS.length - 1 ? (
            'Analyze'
          ) : (
            <>Next <ChevronRight size={18} /></>
          )}
        </button>
      </div>
    </div>
  );
};

export default HeartPredictionWizard;
