import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error("User fetch error");
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="space-y-12">

      {/* ================= WELCOME ================= */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800">
          Welcome back{user ? `, ${user.Name}` : ""} 👋
        </h2>
        <p className="text-gray-500 mt-2">
          Your complete AI-powered healthcare ecosystem.
        </p>
      </div>


      {/* ================= HEALTH OVERVIEW ================= */}
      <div className="grid md:grid-cols-4 gap-6">

        <OverviewCard title="Predictions" value="12" />
        <OverviewCard title="Health Records" value="5" />
        <OverviewCard title="Reminders" value="2" />
        <OverviewCard title="Appointments" value="1" />

      </div>


      {/* ================= CORE SERVICES ================= */}
      <div>
        <h3 className="text-xl font-semibold mb-6 text-gray-800">
          Core Health Services
        </h3>

        <div className="grid md:grid-cols-3 gap-6">

          <ServiceCard
            title="🩺 Disease Risk Prediction"
            desc="Check symptom-based risk levels instantly."
          />

          <ServiceCard
            title="🧴 Skin Disease Detection"
            desc="Upload image for basic skin condition awareness."
          />

          <ServiceCard
            title="📄 Prescription Decoder"
            desc="Extract medicine details using OCR."
          />

          <ServiceCard
            title="⏰ Medicine Reminder"
            desc="Never miss your scheduled medicines."
          />

          <ServiceCard
            title="📅 Appointment Scheduler"
            desc="Book and manage doctor appointments."
          />

          <ServiceCard
            title="🤖 AI Health Chatbot"
            desc="Ask health-related questions safely."
          />

        </div>
      </div>


      {/* ================= COMMUNITY & LOCATION ================= */}
      <div>
        <h3 className="text-xl font-semibold mb-6 text-gray-800">
          Community & Support Services
        </h3>

        <div className="grid md:grid-cols-3 gap-6">

          <ServiceCard
            title="📍 Hospital & Pharmacy Locator"
            desc="Find nearby healthcare facilities instantly."
          />

          <ServiceCard
            title="🩸 Blood Donation"
            desc="Register or find blood donation opportunities."
          />

          <ServiceCard
            title="🏥 Healthcare Camps"
            desc="Explore upcoming medical camps."
          />

        </div>
      </div>


      {/* ================= SMART INSIGHT SECTION ================= */}
      <div className="bg-blue-900 text-white p-8 rounded-2xl">
        <h3 className="text-2xl font-bold mb-3">
          Smart Health Insight
        </h3>
        <p className="text-blue-100 mb-6">
          Based on your profile, maintaining regular checkups and
          updating health records improves prediction accuracy.
        </p>

        <button onClick={() => navigate("/user/setup-profile")} className="bg-white text-blue-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition">
          Update Profile
        </button>
      </div>

    </div>
  );
};


/* ================= COMPONENTS ================= */

const OverviewCard = ({ title, value }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition border">
      <h4 className="text-sm text-gray-500">{title}</h4>
      <p className="text-3xl font-bold text-blue-900 mt-2">
        {value}
      </p>
    </div>
  );
};


const ServiceCard = ({ title, desc }) => {
  return (
    <div className="bg-white cursor-pointer p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border flex flex-col justify-between">

      <div>
        <h4 className="font-semibold text-gray-800 text-lg mb-3">
          {title}
        </h4>

        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          {desc}
        </p>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <span className="text-blue-900 font-medium text-sm">
          Explore
        </span>

        <ArrowRight
          size={18}
          className="text-blue-900 group-hover:translate-x-1 transition"
        />
      </div>

    </div>
  );
};

export default Home;