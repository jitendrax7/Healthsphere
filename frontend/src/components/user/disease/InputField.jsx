const InputField = ({ label, name, value, onChange }) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-600 mb-2">
        {label}
      </label>

      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        required
        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
};

export default InputField;