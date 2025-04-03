const InputField = ({ label, name, type = "text", value, onChange, required, placeholder, accept }) => (
    <div className="relative mb-4">
        <label htmlFor={name} className="text-gray-500 font-medium text-sm">{label}</label>
        {type === "textarea" ? (
            <textarea
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="border resize-none border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required={required}
            ></textarea>
        ) : type === "file" ? (
            <input
                type="file"
                name={name}
                id={name}
                accept={accept}
                value={value}
                onChange={onChange}
                className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
        ) : (
            <input
                type={type}
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required={required}
            />
        )}
    </div>
);

export default InputField;
