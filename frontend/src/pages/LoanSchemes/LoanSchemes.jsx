import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import schemeAPI from '../../services/schemeAPI';
import mlAPI from '../../services/mlAPI';
import SchemeCard from './SchemeCard.jsx';
import { Loader, ErrorState } from '../../components/common/StateViews.jsx';
import { Sparkles, Filter, Landmark } from 'lucide-react';

const FALLBACK_SCHEMES = [
  {
    id: 'pmegp',
    name: 'PMEGP — Prime Minister Employment Generation Programme',
    category: 'Central Subsidy Scheme',
    matchPercent: 94,
    description: "Credit-linked margin money subsidy program for rural micro-enterprises up to ₹25L.",
    reasons: ['Project cost fits eligible rural cap', '35% margin money subsidy in rural districts', 'First-time entrepreneur'],
    subsidy: '25% - 35%',
    maxLoan: '₹25,00,000',
    documents: ['Aadhaar Card', 'Project DPR', 'EDP Certificate', 'Bank Passbook'],
    applicationUrl: 'https://www.kviconline.gov.in/pmegpeportal/',
  },
  {
    id: 'mudra',
    name: 'Pradhan Mantri MUDRA Yojana (Kishore Tier)',
    category: 'Collateral-Free Loan',
    matchPercent: 88,
    description: 'Tiered micro-credit for small business owners up to ₹5 Lakhs with zero collateral required.',
    reasons: ['Requested loan fits Kishore band (₹50k - ₹5L)', 'Zero collateral security required'],
    subsidy: 'Interest Subvention Eligible',
    maxLoan: '₹5,00,000',
    documents: ['Identity Proof', 'Business License', '6-Month Bank Statement'],
    applicationUrl: 'https://www.mudra.org.in/',
  },
  {
    id: 'standup-india',
    name: 'Stand-Up India Scheme',
    category: 'Women & SC/ST Enterprise',
    matchPercent: 82,
    description: 'Bank credit between ₹10L and ₹1Cr for women or SC/ST borrowers setting up greenfield enterprises.',
    reasons: ['Composite loan covering plant equipment & working capital', 'Low margin requirement'],
    subsidy: '15% Margin Money',
    maxLoan: '₹1,00,00,000',
    documents: ['Category Proof', 'Land/Lease Agreement', 'Rivo Detailed Project Report'],
    applicationUrl: 'https://www.standupmitra.in/',
  },
];

export default function LoanSchemes() {
  const { assessmentId } = useParams();
  const [schemes, setSchemes] = useState(null);
  const [filter, setFilter] = useState('ALL'); // ALL | SUBSIDY | COLLATERAL_FREE
  const [status, setStatus] = useState('loading');

  const load = async () => {
    setStatus('loading');
    try {
      const [res, mlRes] = await Promise.all([
        schemeAPI.getMatches(assessmentId).catch(() => null),
        mlAPI.rankSchemes({ assessmentId }).catch(() => null),
      ]);
      const matched = mlRes?.schemes || res?.schemes;
      setSchemes(matched?.length ? matched : FALLBACK_SCHEMES);
      setStatus('ready');
    } catch {
      setSchemes(FALLBACK_SCHEMES);
      setStatus('ready');
    }
  };

  useEffect(() => {
    load();
  }, [assessmentId]);

  if (status === 'loading') return <Loader label="Evaluating ML scheme recommendation engine…" />;
  if (status === 'error') return <ErrorState onRetry={load} />;

  const filteredSchemes = schemes.filter((s) => {
    if (filter === 'SUBSIDY') return s.category?.toLowerCase().includes('subsidy');
    if (filter === 'COLLATERAL_FREE') return s.category?.toLowerCase().includes('collateral');
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-forest/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-gold text-[11px]">
              <Sparkles size={12} /> ML Ranked Recommendations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display text-forest">Government Schemes & Subsidies</h1>
          <p className="text-xs sm:text-sm text-ink/60">
            Government credit schemes ranked by eligibility match score for your business profile.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-forest/5 p-1 rounded-pill w-fit text-xs font-semibold">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-pill transition-all ${
              filter === 'ALL' ? 'bg-white shadow-soft text-forest' : 'text-ink/60 hover:text-forest'
            }`}
          >
            All Matches ({schemes.length})
          </button>
          <button
            onClick={() => setFilter('SUBSIDY')}
            className={`px-3.5 py-1.5 rounded-pill transition-all ${
              filter === 'SUBSIDY' ? 'bg-white shadow-soft text-forest' : 'text-ink/60 hover:text-forest'
            }`}
          >
            Subsidy Schemes
          </button>
          <button
            onClick={() => setFilter('COLLATERAL_FREE')}
            className={`px-3.5 py-1.5 rounded-pill transition-all ${
              filter === 'COLLATERAL_FREE' ? 'bg-white shadow-soft text-forest' : 'text-ink/60 hover:text-forest'
            }`}
          >
            Collateral-Free
          </button>
        </div>
      </div>

      {/* Grid of Scheme Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSchemes.map((scheme) => (
          <SchemeCard key={scheme.id} scheme={scheme} assessmentId={assessmentId} />
        ))}
      </div>
    </div>
  );
}
