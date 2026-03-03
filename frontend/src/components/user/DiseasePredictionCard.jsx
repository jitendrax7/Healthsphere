
const SelectionCard = ({ title, desc, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border cursor-pointer"
    >
      <h4 className="text-xl font-semibold text-gray-800 mb-3">
        {title}
      </h4>

      <p className="text-gray-500 text-sm">
        {desc}
      </p>

      <div className="mt-6 text-blue-900 font-medium text-sm">
        Start →
      </div>
    </div>
  );
};


export default SelectionCard;