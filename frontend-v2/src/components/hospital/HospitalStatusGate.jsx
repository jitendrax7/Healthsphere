import { Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Loader2, RefreshCw, WifiOff } from 'lucide-react';

/**
 * HospitalStatusGate
 *
 * Reads hospitalCtx from AppContext (driven by /api/hospital/status) and gates
 * access to the hospital dashboard based on onboardingStep:
 *
 *   create_profile       → /hospital/onboarding
 *   verification_pending → /hospital/pending
 *   rejected             → /hospital/rejected
 *   approved             → render children (dashboard)
 *   statusError=true     → show retry UI (never silently fall through)
 *   statusLoading=true   → spinner
 */
const HospitalStatusGate = ({ children }) => {
  const { hospitalCtx, fetchHospitalStatus } = useApp();
  const { onboardingStep, statusLoading, statusError } = hospitalCtx;

  // ── Loading ──────────────────────────────────────────────────────
  if (statusLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center mx-auto">
          <Loader2 size={26} className="text-violet-400 animate-spin" />
        </div>
        <p className="text-white/50 text-sm">Checking hospital status…</p>
      </div>
    );
  }

  // ── API error – show retry, NEVER silently allow dashboard access ─
  if (statusError || onboardingStep === null) {
    return (
      <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center gap-5 px-4">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <WifiOff size={28} className="text-red-400" />
        </div>
        <div className="text-center max-w-sm">
          <h2 className="text-lg font-semibold text-white mb-2">Unable to reach server</h2>
          <p className="text-white/40 text-sm">
            Could not verify your hospital status. Please check your connection and try again.
          </p>
        </div>
        <button
          onClick={fetchHospitalStatus}
          className="flex items-center gap-2 btn-primary"
        >
          <RefreshCw size={15} /> Retry
        </button>
      </div>
    );
  }

  // ── Status-based routing ─────────────────────────────────────────
  if (onboardingStep === 'create_profile' || onboardingStep === 'complete_profile') {
    return <Navigate to="/hospital/onboarding" replace />;
  }
  if (onboardingStep === 'verification_pending')  return <Navigate to="/hospital/pending"    replace />;
  if (onboardingStep === 'rejected')              return <Navigate to="/hospital/rejected"   replace />;

  // approved → allow children
  if (onboardingStep === 'approved') return children;

  // Unknown step — treat as error (defensive)
  return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center gap-4 px-4">
      <p className="text-white/40 text-sm text-center">
        Unexpected account state: <code className="text-red-400">{onboardingStep}</code>
      </p>
      <button onClick={fetchHospitalStatus} className="btn-primary flex items-center gap-2">
        <RefreshCw size={15} /> Refresh
      </button>
    </div>
  );
};

export default HospitalStatusGate;
