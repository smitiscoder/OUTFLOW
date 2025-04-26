export function Input({ value, onChange, placeholder, type = "text", className = "" }) {
    return (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 ${className}`}
      />
    );
  }
  