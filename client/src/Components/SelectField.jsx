const SelectField = ({ label, name, options, value, onChange, required }) => (
    <div className="relative mb-4">
        <label htmlFor={name} className="block text-gray-500 text-sm font-medium mb-1">{label}</label>
        <select
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required={required}
        >
            <option value="">Select {label}</option>
            {options.map((option) => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
    </div>
);

export default SelectField;
