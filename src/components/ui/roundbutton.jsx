export function RoundButton({ children, onClick, variant = "default", className = "" }) {
    const base =
      "rounded-2xl px-4 py-2 font-medium transition-all text-sm flex items-center justify-center gap-1";
    const variants = {
      default: "bg-yellow-500 text-white hover:bg-yellow-600",
      outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    };
  
    return (
      <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
        {children}
      </button>
    );
  }