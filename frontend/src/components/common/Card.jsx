export default function Card({ title, action, children, className = '', bodyClassName = '' }) {
  return (
    <div className={`card ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className="text-base font-semibold text-forest font-sans">{title}</h3>}
          {action}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
