export default function ScoreGauge({ score = 0, size = 180, label }) {
  const radius = (size - 20) / 2;
  const circumference = Math.PI * radius; // half circle
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference - (clamped / 100) * circumference;

  const tone = clamped >= 70 ? '#18432F' : clamped >= 45 ? '#D49B35' : '#C86D51';
  const verdict = clamped >= 70 ? 'Feasible' : clamped >= 45 ? 'Moderate' : 'High Risk';

  return (
    <div className="flex flex-col items-center" style={{ width: size }}>
      <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
        <path
          d={`M 10 ${size / 2 + 10} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2 + 10}`}
          fill="none"
          stroke="#EBE4D0"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d={`M 10 ${size / 2 + 10} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2 + 10}`}
          fill="none"
          stroke={tone}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="-mt-6 text-center">
        <p className="text-4xl font-display font-semibold" style={{ color: tone }}>
          {clamped}%
        </p>
        <p className="text-sm font-semibold tracking-wide" style={{ color: tone }}>
          {label || verdict}
        </p>
      </div>
    </div>
  );
}
