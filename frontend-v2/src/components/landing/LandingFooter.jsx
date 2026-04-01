import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';

const FOOTER_COLS = [
  { title:'Patients',            links:[['#','Book Appointment'],['#services','AI Health Check'],['#','Blood Donation'],['#','Find Hospital']] },
  { title:'Doctors & Hospitals', links:[['#who','Register as Doctor'],['#who','Register Hospital'],['#','Manage Appointments'],['#','Healthcare Camps']] },
  { title:'Quick Links',         links:[['#services','Services'],['#doctors','Doctors'],['#hospitals','Hospitals'],['/login','Sign In']] },
];

const LandingFooter = () => (
  <footer style={{ background: '#0d3318' }} className="px-4 sm:px-6 pt-10 sm:pt-12 pb-6">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pb-8 border-b border-white/10">
        <div className="col-span-2 sm:col-span-2 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:'linear-gradient(135deg,#2e7d32,#66bb6a)' }}>
              <Heart size={16} className="text-white"/>
            </div>
            <span className="text-xl font-black text-white">HealthSphere</span>
          </Link>
          <p className="text-green-300/60 text-sm leading-relaxed">For Patients · Doctors · Hospitals. One platform for better healthcare across India.</p>
        </div>
        {FOOTER_COLS.map(col => (
          <div key={col.title}>
            <h4 className="text-white font-black mb-4 text-sm sm:text-base">{col.title}</h4>
            <ul className="space-y-2 sm:space-y-2.5">
              {col.links.map(([href, label]) => (
                <li key={label}><a href={href} className="text-green-300/60 text-xs sm:text-sm hover:text-green-300 transition-colors">{label}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
        <p className="text-green-300/35 text-xs sm:text-sm">© 2026 HealthSphere. All Rights Reserved.</p>
        <div className="flex gap-4 sm:gap-5">
          {['Home','About','Services','Contact'].map(l => (
            <a key={l} href="#" className="text-green-300/40 text-xs sm:text-sm hover:text-green-300 transition-colors">{l}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default LandingFooter;
