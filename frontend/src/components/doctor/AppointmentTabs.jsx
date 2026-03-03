const AppointmentTabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["Pending", "Confirmed", "History"];

  return (
    <div className="flex gap-3 mb-6 flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === tab
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default AppointmentTabs;