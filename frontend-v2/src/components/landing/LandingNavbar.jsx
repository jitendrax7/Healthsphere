import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';

const NAV_LINKS = [
  ['#who', 'For You'],
  ['#services', 'Services'],
  ['#doctors', 'Doctors'],
  ['#hospitals', 'Hospitals'],
];

const LandingNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <nav
      style={{
        background: scrolled ? 'rgba(255,255,255,.97)' : 'white',
        boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,.09)' : 'none',
        borderBottom: scrolled ? '1px solid #e8f5e9' : '1px solid #f0f0f0',
      }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(135deg,#2e7d32,#66bb6a)' }}>
            <Heart size={17} className="text-white" />
          </div>
          <span className="text-xl font-black" style={{ color: '#2e7d32' }}>HealthSphere</span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(([href, label]) => (
            <a key={label} href={href} className="text-sm font-bold text-gray-500 hover:text-green-700 transition-colors">{label}</a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-sm font-bold text-gray-500 hover:text-green-700 px-4 py-2">Sign In</Link>
          <Link to="/register" className="btn-green text-sm">Get Started Free</Link>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2" style={{ color: '#2e7d32' }}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-green-100 px-6 py-4 space-y-3">
          {NAV_LINKS.slice(0, 3).map(([href, label]) => (
            <a key={label} href={href} onClick={() => setMenuOpen(false)} className="block text-gray-600 font-bold py-2">{label}</a>
          ))}
          <div className="flex gap-3 pt-2">
            <Link to="/login" className="flex-1 text-center border-2 border-green-700 text-green-700 font-bold py-2.5 rounded-full text-sm">Sign In</Link>
            <Link to="/register" className="flex-1 text-center text-white font-bold py-2.5 rounded-full text-sm" style={{ background: '#2e7d32' }}>Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingNavbar;
