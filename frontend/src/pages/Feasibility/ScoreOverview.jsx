import ScoreGauge from '../../components/common/ScoreGauge.jsx';

export default function ScoreOverview({ overall = 82, market = 78, financial = 86 }) {
  return (
    <div className="grid sm:grid-cols-3 gap-6 items-center">
      <div className="sm:col-span-1 flex justify-center">
        <ScoreGauge score={overall} size={200} />
      </div>
      <div className="sm:col-span-2 space-y-4">
        <SubScore label="Market sub-score" value={market} />
        <SubScore label="Financial sub-score" value={financial} />
        <p className="text-sm text-ink/55 leading-relaxed">
          Your idea scores well on both local demand and repayment capacity. The main risk is
          seasonal cash flow in the first two quarters — see the SWOT below.
        </p>
      </div>
    </div>
  );
}

function SubScore({ label, value }) {
  const tone = value >= 70 ? 'bg-forest' : value >= 45 ? 'bg-gold' : 'bg-terracotta';
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-ink/60">{label}</span>
        <span className="font-semibold text-forest">{value}%</span>
      </div>
      <div className="h-2.5 rounded-pill bg-forest/10">
        <div className={`h-2.5 rounded-pill ${tone}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
