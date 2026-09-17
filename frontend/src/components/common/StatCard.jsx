import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StatCard({ icon: Icon, label, value, sub, tone = 'forest', to, links }) {
  const toneClasses = {
    forest: 'bg-forest/10 text-forest',
    gold: 'bg-gold/15 text-gold-dark',
    terracotta: 'bg-terracotta/15 text-terracotta-dark',
  };

  return (
    <div className="card flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between">
        <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${toneClasses[tone]}`}>
          <Icon size={18} strokeWidth={2.25} />
        </span>
        {to && (
          <Link to={to} className="text-ink/30 hover:text-forest transition-colors">
            <ChevronRight size={18} />
          </Link>
        )}
      </div>
      <div>
        <p className="text-xs font-medium text-ink/50">{label}</p>
        {value && <p className="text-xl font-display text-forest mt-0.5">{value}</p>}
        {sub && <p className="text-xs text-ink/45 mt-0.5">{sub}</p>}
      </div>
      {links && (
        <ul className="mt-1 space-y-1.5 border-t border-forest/10 pt-2">
          {links.map((l) => (
            <li key={l.label}>
              <Link
                to={l.to}
                className="flex items-center justify-between text-sm text-ink/70 hover:text-forest transition-colors"
              >
                {l.label}
                <ChevronRight size={14} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
