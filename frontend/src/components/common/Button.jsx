// Single shared button so spacing/color/states stay consistent
// instead of every module re-implementing its own.
export default function Button({ children, variant = "primary", ...props }) {
  const base = "px-4 py-2 rounded text-sm font-medium transition-colors";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  };
  return (
    <button className={`${base} ${variants[variant] || variants.primary}`} {...props}>
      {children}
    </button>
  );
}
