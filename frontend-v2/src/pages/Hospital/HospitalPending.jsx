import {
  Clock, Building2, FileText, Shield,
  RefreshCw, LogOut, CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const HospitalPending = () => {
  const { hospitalCtx, logout, fetchHospitalStatus } = useApp();
  const { hospital } = hospitalCtx;
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const handleRefresh = async () => {
    await fetchHospitalStatus();
  };

  const completion = hospital?.profileCompletion ?? 0;
  const docsUploaded = hospital?.documentsUploaded ?? 0;

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-5">

        {/* Status card */}
        <div className="glass rounded-2xl p-8 text-center">
          {/* Animated clock icon */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-amber-500/15 animate-ping" style={{ animationDuration: '2.5s' }} />
            <div className="relative w-20 h-20 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
              <Clock size={36} className="text-amber-400" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Verification Pending
          </div>

          <h1 className="text-2xl font-bold text-white">Application Under Review</h1>
          <p className="text-white/50 text-sm mt-2 max-w-sm mx-auto">
            Your hospital profile has been submitted successfully.
            Our admin team is currently reviewing your application and documents.
          </p>

          {/* Stats */}
          {hospital && (
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="glass rounded-xl p-4">
                <p className="text-2xl font-bold text-white">{completion}%</p>
                <p className="text-xs text-white/40 mt-0.5">Profile Completion</p>
                <div className="w-full h-1 bg-white/10 rounded-full mt-2">
                  <div
                    className="h-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-700"
                    style={{ width: `${completion}%` }}
                  />
                </div>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-2xl font-bold text-white">{docsUploaded}</p>
                <p className="text-xs text-white/40 mt-0.5">Documents Uploaded</p>
                <div className="flex gap-1 mt-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={`flex-1 h-1 rounded-full ${i < docsUploaded ? 'bg-violet-500' : 'bg-white/10'}`} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {hospital?.hospitalName && (
            <div className="flex items-center gap-2 mt-5 glass rounded-xl p-3 text-left">
              <Building2 size={16} className="text-violet-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">{hospital.hospitalName}</p>
                <p className="text-xs text-white/40">Submitted for verification</p>
              </div>
              <CheckCircle2 size={14} className="text-amber-400 ml-auto" />
            </div>
          )}

          <button onClick={handleRefresh}
            className="flex items-center gap-2 mx-auto mt-5 glass px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white transition-all">
            <RefreshCw size={14} /> Check Status
          </button>
        </div>

        {/* What happens next */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <FileText size={14} className="text-violet-400" /> What happens next?
          </h2>
          <div className="space-y-4">
            {[
              { step: '01', title: 'Document Review', desc: 'Our team verifies your uploaded registration and license documents for authenticity.' },
              { step: '02', title: 'Profile Check',   desc: 'Hospital details are cross-checked with official medical registry databases.' },
              { step: '03', title: 'Admin Approval',  desc: 'A HealthSphere admin approves your account and activates it on the platform.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center text-xs font-bold text-violet-400 flex-shrink-0 mt-0.5">
                  {step}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{title}</p>
                  <p className="text-xs text-white/40 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Policy note */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Shield size={14} className="text-blue-400" /> HealthSphere Verification Policy
          </h2>
          <ul className="space-y-2 text-xs text-white/50 leading-relaxed">
            <li>• Applications are typically reviewed within <strong className="text-white/70">2–5 business days</strong>.</li>
            <li>• You will receive an email notification once your application has been reviewed.</li>
            <li>• Ensure your registered email is active and accessible during this period.</li>
            <li>• Uploaded documents are stored securely with AES-256 encryption and are only accessible to authorized reviewers.</li>
            <li>• You may be contacted by our team if additional clarifications are needed.</li>
            <li>• Misrepresentation of hospital information may result in permanent account suspension.</li>
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

export default HospitalPending;
