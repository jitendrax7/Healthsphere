import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="bg-white text-gray-800 scroll-smooth">

      {/* ================= NAVBAR ================= */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl font-bold text-blue-900">
            HealthSphere
          </h1>

          <div className="hidden md:flex space-x-8 font-medium">
            <a href="#about" className="hover:text-blue-700 transition">
              About
            </a>
            <a href="#features" className="hover:text-blue-700 transition">
              Features
            </a>
            <a href="#technology" className="hover:text-blue-700 transition">
              Technology
            </a>
          </div>

          <div className="space-x-4">
            <Link
              to="/login"
              className="px-5 py-2 rounded-lg text-blue-900 font-medium hover:bg-gray-100 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-900 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>


      {/* ================= HERO ================= */}
      <section className="pt-40 pb-28 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600 text-white text-center px-6">
        <div className="max-w-4xl mx-auto">

          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            Smart Healthcare.
            <br />
            Powered by AI.
          </h2>

          <p className="mt-8 text-lg md:text-xl text-blue-100">
            An integrated healthcare ecosystem that provides disease risk
            prediction, prescription decoding, AI chatbot assistance,
            medicine reminders, and more — all in one secure platform.
          </p>

          <div className="mt-10 flex justify-center gap-6">
            <Link
              to="/user/dashboard"
              className="bg-white text-blue-900 px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
            >
              Get Started
            </Link>

            <a
              href="#features"
              className="border border-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-900 transition"
            >
              Explore Features
            </a>
          </div>
        </div>
      </section>


      {/* ================= ABOUT ================= */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-8">
            About HealthSphere
          </h3>

          <p className="text-lg text-gray-600 leading-relaxed">
            HealthSphere is designed to bridge the gap between healthcare
            accessibility and digital intelligence. Especially in rural and
            semi-urban areas, people often rely on unsafe self-medication
            or internet searches. HealthSphere provides structured,
            AI-assisted guidance while encouraging professional consultation.
          </p>
        </div>
      </section>


      {/* ================= PROBLEM SECTION ================= */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-14">
            Why It Matters
          </h3>

          <div className="grid md:grid-cols-3 gap-10">

            <ProblemCard
              title="Limited Medical Access"
              desc="Many regions lack immediate healthcare facilities, causing delays in treatment."
            />

            <ProblemCard
              title="Unsafe Self-Medication"
              desc="People often depend on internet searches, leading to wrong medical decisions."
            />

            <ProblemCard
              title="Fragmented Solutions"
              desc="Most platforms offer isolated features instead of an integrated ecosystem."
            />

          </div>
        </div>
      </section>


      {/* ================= FEATURES ================= */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-16">
            Core Modules
          </h3>

          <div className="grid md:grid-cols-3 gap-8">

            <Feature title="🩺 Disease Risk Prediction" />
            <Feature title="🤖 AI Health Chatbot" />
            <Feature title="📄 Prescription OCR" />
            <Feature title="🧴 Skin Disease Detection" />
            <Feature title="⏰ Medicine Reminder" />
            <Feature title="📍 Hospital Locator" />
            <Feature title="📅 Appointment Scheduling" />
            <Feature title="🩸 Blood Donation" />
            <Feature title="📊 Health Records" />

          </div>
        </div>
      </section>


      {/* ================= TECHNOLOGY ================= */}
      <section id="technology" className="bg-gray-50 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-10">
            Built With Modern Technologies
          </h3>

          <p className="text-lg text-gray-600">
            MERN Stack (MongoDB, Express, React, Node.js) integrated with
            Python-based Machine Learning models using Scikit-learn.
            Enhanced with Google Maps API, OCR services, LLM APIs,
            and secure JWT authentication.
          </p>
        </div>
      </section>


      {/* ================= CTA ================= */}
      <section className="py-24 bg-blue-900 text-white text-center px-6">
        <h3 className="text-4xl font-bold mb-8">
          Start Your Smart Health Journey Today
        </h3>

        <Link
          to="/register"
          className="bg-white text-blue-900 px-10 py-4 rounded-xl font-semibold hover:bg-gray-200 transition"
        >
          Create Free Account
        </Link>
      </section>


      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-gray-400 py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">

          <div>
            <h4 className="text-white font-bold text-lg mb-4">
              HealthSphere
            </h4>
            <p>
              AI-Powered Integrated Healthcare Ecosystem focused on
              awareness, accessibility, and digital health management.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-4">
              Navigation
            </h4>
            <ul className="space-y-3">
              <li><a href="#about" className="hover:text-white">About</a></li>
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="#technology" className="hover:text-white">Technology</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-4">
              Contact
            </h4>
            <p>Jitendra</p>
            <p>Email: support@healthsphere.com</p>
          </div>

        </div>

        <div className="text-center mt-12 text-sm text-gray-500">
          © 2026 HealthSphere. All rights reserved.
        </div>
      </footer>

    </div>
  );
};


const Feature = ({ title }) => {
  return (
    <div className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 border">
      <h4 className="font-semibold text-lg">{title}</h4>
    </div>
  );
};

const ProblemCard = ({ title, desc }) => {
  return (
    <div className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition border">
      <h4 className="font-semibold text-lg mb-3">{title}</h4>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
};

export default Landing;