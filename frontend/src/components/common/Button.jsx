const VARIANTS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
};

export default function Button({
  children,
  variant = 'primary',
  icon: Icon,
  loading = false,
  className = '',
  ...rest
}) {
  return (
    <button className={`${VARIANTS[variant]} ${className}`} disabled={loading} {...rest}>
      {loading ? (
        <span className="h-4 w-4 rounded-full border-2 border-current/30 border-t-current animate-spin" />
      ) : (
        Icon && <Icon size={16} strokeWidth={2.25} />
      )}
      {children}
    </button>
  );
}
