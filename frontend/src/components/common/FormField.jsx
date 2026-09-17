export default function FormField({ label, error, hint, children }) {
  return (
    <div>
      {label && <label className="label">{label}</label>}
      {children}
      {hint && !error && <p className="mt-1 text-xs text-ink/45">{hint}</p>}
      {error && <p className="mt-1 text-xs text-terracotta-dark font-medium">{error}</p>}
    </div>
  );
}

export function TextInput(props) {
  return <input className="input" {...props} />;
}

export function SelectInput({ children, ...props }) {
  return (
    <select className="input" {...props}>
      {children}
    </select>
  );
}
