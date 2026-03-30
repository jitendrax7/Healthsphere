import {
  XCircle, AlertTriangle, Trash2, RotateCcw,
  LogOut, Shield, Clock, Building2, FileText,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const HospitalRejected = () => {
  const { hospitalCtx, logout } = useApp();
  const { hospital } = hospitalCtx;
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-5">

        {/* Rejection card */}
        <div className="glass rounded-2xl p-8 text-center border border-red-500/15">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-red-500/10 animate-pulse" />
            <div className="relative w-20 h-20 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center">
              <XCircle size={38} className="text-red-400" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <XCircle size={12} /> Application Rejected
          </div>

          <h1 className="text-2xl font-bold text-white">Verification Unsuccessful</h1>
          <p className="text-white/50 text-sm mt-2 max-w-sm mx-auto">
            Unfortunately, your hospital verification application did not meet our requirements.
            Please review the information below carefully.
          </p>

          {hospital?.hospitalName && (
            <div className="flex items-center gap-2 mt-5 bg-red-500/8 border border-red-500/15 rounded-xl p-3 text-left">
              <Building2 size={16} className="text-red-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">{hospital.hospitalName}</p>
                <p className="text-xs text-red-400/70 mt-0.5">Verification rejected</p>
              </div>
            </div>
          )}
        </div>

        {/* What you can do */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle size={14} className="text-amber-400" /> Your Options
          </h2>

          {/* Option 1 – Reattempt */}
          <button
            onClick={() => navigate('/hospital/onboarding')}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-violet-500/30 bg-violet-500/8 hover:bg-violet-500/15 transition-all duration-200 text-left group mb-3"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
              <RotateCcw size={18} className="text-violet-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Re-apply with Corrected Information</p>
              <p className="text-xs text-white/40 mt-0.5">
                Submit a new application with corrected details and updated documents.
              </p>
            </div>
            <ChevronRight size={16} className="text-white/30 group-hover:text-white/60 transition-colors" />
          </button>

          {/* Option 2 – Accept deletion */}
          <div className="flex items-start gap-4 p-4 rounded-xl border border-white/8 bg-white/3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Trash2 size={18} className="text-red-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Do Nothing</p>
              <p className="text-xs text-white/40 mt-0.5 leading-relaxed">
                If you choose not to re-apply, all uploaded documents and hospital information
                associated with this application will be <strong className="text-white/60">automatically and permanently deleted
                within 24–48 hours</strong>. This is part of our data privacy commitment.
              </p>
            </div>
          </div>
        </div>

        {/* Common rejection reasons */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <FileText size={14} className="text-violet-400" /> Common Rejection Reasons
          </h2>
          <ul className="space-y-2.5 text-xs text-white/50 leading-relaxed">
            <li className="flex items-start gap-2"><span className="text-red-400 font-bold mt-0.5">•</span> Documents were blurry, expired, or not clearly legible</li>
            <li className="flex items-start gap-2"><span className="text-red-400 font-bold mt-0.5">•</span> Hospital registration number did not match official records</li>
            <li className="flex items-start gap-2"><span className="text-red-400 font-bold mt-0.5">•</span> Required licenses (PCPNDT/Medical License) were missing or invalid</li>
            <li className="flex items-start gap-2"><span className="text-red-400 font-bold mt-0.5">•</span> Hospital name or address did not match the registration certificate</li>
            <li className="flex items-start gap-2"><span className="text-red-400 font-bold mt-0.5">•</span> Application was flagged as incomplete or containing inconsistent information</li>
          </ul>
        </div>

        {/* Data policy */}
        <div className="glass rounded-2xl p-6 border border-red-500/10">
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Shield size={14} className="text-blue-400" /> Data Deletion Policy
          </h2>
          <div className="flex items-start gap-3 bg-red-500/8 border border-red-500/15 rounded-xl px-4 py-3 mb-3">
            <Clock size={15} className="text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-white/60 leading-relaxed">
              <strong className="text-white/80">Automatic Deletion Notice:</strong> All data submitted as part of
              a rejected application — including hospital profile information, uploaded documents, and registration
              details — will be <strong className="text-white/80">permanently deleted within 24–48 hours</strong> from
              the time of rejection, in accordance with HealthSphere's data minimization policy (DPDP Act, 2023).
            </p>
          </div>
          <ul className="space-y-2 text-xs text-white/40 leading-relaxed">
            <li>• You will receive a confirmation email once data deletion is complete</li>
            <li>• Re-applying after deletion requires submitting all information and documents again</li>
            <li>• HealthSphere does not retain copies of deleted documents</li>
            <li>• For further assistance, contact <strong className="text-white/60">support@healthsphere.in</strong></li>
          </ul>
        </div>

        <button onClick={handleLogout}
          className="flex items-center gap-2 mx-auto text-sm text-white/40 hover:text-white/60 transition-colors">
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </div>
  );
};

export default HospitalRejected;
