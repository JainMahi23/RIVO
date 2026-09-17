import { Check } from 'lucide-react';

export default function Stepper({ steps, current }) {
  return (
    <div className="flex items-center w-full">
      {steps.map((step, i) => {
        const isDone = i < current;
        const isActive = i === current;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
                  isDone
                    ? 'bg-forest border-forest text-cream'
                    : isActive
                    ? 'border-gold text-gold-dark bg-gold/10'
                    : 'border-ink/15 text-ink/35'
                }`}
              >
                {isDone ? <Check size={16} /> : i + 1}
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap ${
                  isActive ? 'text-forest' : isDone ? 'text-forest/70' : 'text-ink/40'
                }`}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 flex-1 mx-2 mb-5 rounded ${isDone ? 'bg-forest' : 'bg-ink/10'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
