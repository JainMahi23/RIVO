import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, TrendingUp, Calculator } from 'lucide-react';
import LocationTab from './LocationTab.jsx';
import MarketTab from './MarketTab.jsx';
import FinanceTab from './FinanceTab.jsx';

const TABS = [
  { key: 'location', label: 'Location', icon: MapPin },
  { key: 'market', label: 'Market', icon: TrendingUp },
  { key: 'finance', label: 'Financial Calculator', icon: Calculator },
];

export default function MarketFinanceContainer() {
  const { assessmentId } = useParams();
  const [tab, setTab] = useState('location');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display text-forest">Market & finance</h1>
        <p className="text-sm text-ink/55 mt-1">Understand your local market and model the numbers.</p>
      </div>

      <div className="flex gap-1 bg-forest/5 rounded-pill p-1 w-fit">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-pill text-sm font-medium transition-colors ${
              tab === key ? 'bg-white shadow-soft text-forest' : 'text-ink/50 hover:text-forest'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {tab === 'location' && <LocationTab assessmentId={assessmentId} />}
      {tab === 'market' && <MarketTab assessmentId={assessmentId} />}
      {tab === 'finance' && <FinanceTab assessmentId={assessmentId} />}
    </div>
  );
}
