import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { authApi, userSettingsApi, doctorApi, hospitalApi } from '../api/axios';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { i18n }                = useTranslation();
  const [user, setUser]         = useState(null);
  const [loading, setLoading]   = useState(true);

  // Global UI states
  const [theme, setTheme]       = useState(localStorage.getItem('theme') || 'dark');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  const [notificationCount, setNotificationCount] = useState(0);

  // Doctor-specific context flags
  const [doctorCtx, setDoctorCtx] = useState({
    newUser: false,
    doctorProfileComplete: true,
    bookingEnabled: true,
  });

  // Hospital-specific state — driven entirely by /api/hospital/status
  const [hospitalCtx, setHospitalCtx] = useState({
    // 'create_profile' | 'complete_profile' | 'verification_pending' | 'approved' | 'rejected' | null
    onboardingStep:     null,
    profileComplete:    false,
    verificationStatus: null,
    hospital:           null,
    account:            null,
    statusLoading:      true,
    statusError:        false,   // true when status fetch fails outright
  });

  const hospitalStatusIntervalRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    // Remove all theme classes first, then apply the correct one
    document.body.classList.remove('light-mode', 'health-theme');
    if (theme === 'light')  document.body.classList.add('light-mode');
    if (theme === 'health') document.body.classList.add('health-theme');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
    if (i18n && i18n.language !== language) i18n.changeLanguage(language);
  }, [language, i18n]);

  const fetchMeOnly = async () => {
    const meRes = await authApi.me();
    const userData = meRes.data.user;

    const count = userData.notificationCount ?? meRes.data.notificationCount;
    if (count !== undefined) setNotificationCount(count);

    setUser(prev => ({ ...(prev?.location ? { location: prev.location } : {}), ...userData }));
    return userData?.role;
  };

  // ── Hospital status – THE single source of truth for hospital state ──
  const fetchHospitalStatus = async () => {
    setHospitalCtx(prev => prev.onboardingStep === null ? { ...prev, statusLoading: true, statusError: false } : prev);
    try {
      const res = await hospitalApi.getStatus();
      const { success, onboardingStep, profileExists, hospital, account } = res.data;

      if (!success) throw new Error('API returned success:false');

      setHospitalCtx({
        onboardingStep:     onboardingStep     ?? null,
        profileComplete:    profileExists      ?? false,
        verificationStatus: hospital?.verificationStatus ?? null,
        hospital:           hospital           ?? null,
        account:            account            ?? null,
        statusLoading:      false,
        statusError:        false,
      });

      return onboardingStep;
    } catch (err) {
      // Don't redirect to login here — let the 401 interceptor handle that
      // For all other errors, surface the error state so the Gate can show a retry
      setHospitalCtx(prev => ({
        ...prev,
        statusLoading: false,
        statusError: true,
      }));
      return null;
    }
  };

  // ── Context for non-hospital roles (doctor / user) ──
  const fetchContextOnly = async (role) => {
    // Hospital has its own dedicated status endpoint — skip the generic context call
    if (role === 'hospital') return;

    const contextFn =
      role === 'doctor' ? doctorApi.getContext : userSettingsApi.getContext;

    const ctxRes = await contextFn().catch(() => ({ data: {} }));
    const ctx = ctxRes.data;

    if (ctx.location) setUser(prev => prev ? { ...prev, location: ctx.location } : prev);
    if (ctx.theme)    setTheme(ctx.theme);
    if (ctx.language) setLanguage(ctx.language);
    if (ctx.notificationCount !== undefined && !('notificationCount' in (user || {}))) {
      setNotificationCount(ctx.notificationCount);
    }

    if (role === 'doctor') {
      setDoctorCtx({
        newUser:               ctx.newUser               ?? false,
        doctorProfileComplete: ctx.doctorProfileComplete ?? true,
        bookingEnabled:        ctx.bookingEnabled        ?? true,
      });
    }
  };

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    try {
      const role = await fetchMeOnly();

      if (role === 'hospital') {
        // Hospital: only call status, nothing else needed
        await fetchHospitalStatus();
      } else {
        await fetchContextOnly(role);
      }
    } catch {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

    // /me every 15 s (notification count)
    const meInterval = setInterval(() => {
      if (localStorage.getItem('token')) fetchMeOnly().catch(() => {});
    }, 15000);

    // Full context every 2 min
    const fullInterval = setInterval(() => {
      if (localStorage.getItem('token')) fetchUser();
    }, 120000);

    return () => {
      clearInterval(meInterval);
      clearInterval(fullInterval);
    };
  }, []);

  // ── Dedicated hospital status poll: every 2 min until approved ──
  useEffect(() => {
    if (user?.role !== 'hospital') return;
    if (hospitalCtx.onboardingStep === 'approved') {
      // Stop polling once approved
      clearInterval(hospitalStatusIntervalRef.current);
      return;
    }
    if (hospitalStatusIntervalRef.current) clearInterval(hospitalStatusIntervalRef.current);
    hospitalStatusIntervalRef.current = setInterval(() => {
      if (localStorage.getItem('token')) fetchHospitalStatus();
    }, 120000);
    return () => clearInterval(hospitalStatusIntervalRef.current);
  }, [user?.role, hospitalCtx.onboardingStep]);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setDoctorCtx({ newUser: false, doctorProfileComplete: true, bookingEnabled: true });
    setHospitalCtx({
      onboardingStep: null, profileComplete: false, verificationStatus: null,
      hospital: null, account: null, statusLoading: false, statusError: false,
    });
    clearInterval(hospitalStatusIntervalRef.current);
  };

  return (
    <AppContext.Provider value={{
      user, setUser, loading, setLoading, fetchUser, logout,
      theme, setTheme, language, setLanguage,
      notificationCount, setNotificationCount,
      doctorCtx, setDoctorCtx,
      hospitalCtx, setHospitalCtx, fetchHospitalStatus,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
export default AppContext;
