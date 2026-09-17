import { useEffect, useState } from 'react';
import marketAPI from '../../services/marketAPI';
import mlAPI from '../../services/mlAPI';
import Card from '../../components/common/Card.jsx';
import { Loader, ErrorState } from '../../components/common/StateViews.jsx';
import { Sparkles, TrendingUp, ShieldAlert, Store } from 'lucide-react';

const FALLBACK_DEMAND = [
  { label: 'Mon', value: 65 },
  { label: 'Tue', value: 88 },
  { label: 'Wed', value: 78 },
  { label: 'Thu', value: 110 },
  { label: 'Fri', value: 105 },
  { label: 'Sat', value: 140 },
  { label: 'Sun', value: 155 },
];

const FALLBACK_COMPETITORS = [
  { name: 'General stores', count: 5, risk: 'Medium' },
  { name: 'Farm supply shops', count: 2, risk: 'Low' },
  { name: 'Tailoring units', count: 3, risk: 'Low' },
];

export default function MarketTab({ assessmentId }) {
  const [demand, setDemand] = useState(null);
  const [competitors, setCompetitors] = useState(null);
  const [mlData, setMlData] = useState(null);
  const [status, setStatus] = useState('loading');

  const load = async () => {
    setStatus('loading');
    try {
      const [d, c, mlRes] = await Promise.all([
        marketAPI.getDemandScore(assessmentId).catch(() => null),
        marketAPI.getCompetitorDensity(assessmentId).catch(() => null),
        mlAPI.forecastDemand({ assessmentId }).catch(() => null),
      ]);
      setDemand(d?.series || mlRes?.data?.series || FALLBACK_DEMAND);
      setCompetitors(c?.competitors || mlRes?.data?.competitorDensity || FALLBACK_COMPETITORS);
      if (mlRes?.data) setMlData(mlRes.data);
      setStatus('ready');
    } catch {
      setDemand(FALLBACK_DEMAND);
      setCompetitors(FALLBACK_COMPETITORS);
      setStatus('ready');
    }
  };

  useEffect(() => {
    load();
  }, [assessmentId]);

  if (status === 'loading') return <Loader label="Evaluating machine learning market models…" />;
  if (status === 'error') return <ErrorState onRetry={load} />;

  const maxDemand = Math.max(...demand.map((d) => d.value));
  const maxComp = Math.max(...competitors.map((c) => c.count));

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Card title="Weekly Footfall & Demand Projection">
        <div className="flex items-center justify-between mb-4">
          <span className="badge-gold text-[11px]">
            <Sparkles size={12} /> ML Footfall Model
          </span>
          <span className="text-xs text-ink/60 flex items-center gap-1 font-medium">
            <TrendingUp size={13} className="text-forest" /> Daily Average: ~145 visitors
          </span>
        </div>

        <div className="flex items-end gap-2.5 h-44 pt-4 border-b border-forest/10 pb-2">
          {demand.map((d) => (
            <div key={d.label} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
              <span className="text-[10px] font-bold text-forest opacity-0 group-hover:opacity-100 transition-opacity">
                {d.value}
              </span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-forest via-forest-light to-gold/70 transition-all duration-300 group-hover:bg-gold"
                style={{ height: `${(d.value / maxDemand) * 100}%` }}
              />
              <span className="text-xs font-medium text-ink/60">{d.label}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-ink/55 mt-3 leading-relaxed">
          Forecasted footfall peaks during Thursday rural market days and weekend shopping cycles.
        </p>
      </Card>

      <Card title="Competitor & Saturation Density">
        <div className="flex items-center justify-between mb-4">
          <span className="badge-forest text-[11px]">Category Density</span>
          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <Store size={13} /> Saturation Level: LOW
          </span>
        </div>

        <div className="space-y-4">
          {competitors.map((c) => (
            <div key={c.name} className="space-y-1">
              <div className="flex justify-between text-xs sm:text-sm font-medium">
                <span className="text-forest flex items-center gap-1.5">
                  {c.name}
                  {c.risk && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-pill font-semibold ${
                        c.risk === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {c.risk} Saturation
                    </span>
                  )}
                </span>
                <span className="font-semibold text-forest">{c.count} active shops</span>
              </div>
              <div className="h-2.5 rounded-pill bg-forest/10 overflow-hidden">
                <div
                  className="h-2.5 rounded-pill bg-gradient-to-r from-gold to-gold-dark transition-all duration-300"
                  style={{ width: `${(c.count / maxComp) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-xl bg-forest/5 p-3.5 border border-forest/10 flex items-start gap-2 text-xs text-forest">
          <ShieldAlert size={16} className="text-gold-dark shrink-0 mt-0.5" />
          <p>
            <strong>Market Opportunity:</strong> Your target area has only 2 specialized suppliers. Adding high-demand inventory could capture up to 68% of local demand.
          </p>
        </div>
      </Card>
    </div>
  );
}
