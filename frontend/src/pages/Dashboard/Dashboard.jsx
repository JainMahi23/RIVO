import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gauge, Wallet, Landmark, FileText, ArrowRight, Plus, Sparkles, Activity, Server, Cpu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import assessmentAPI from '../../services/assessmentAPI';
import { checkBackendHealth, checkMLHealth } from '../../services/apiClient';
import StatCard from '../../components/common/StatCard.jsx';
import { Loader, ErrorState, EmptyState } from '../../components/common/StateViews.jsx';
import Button from '../../components/common/Button.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | error | empty
  const [health, setHealth] = useState({ backend: true, ml: true, isFallback: false });

  const load = async () => {
    setStatus('loading');
    try {
      // Check system health
      const [backendOk, mlOk] = await Promise.all([checkBackendHealth(), checkMLHealth()]);
      setHealth({ backend: backendOk, ml: mlOk, isFallback: !backendOk || !mlOk });

      const res = await assessmentAPI.getActive();
      const assessment = res?.assessment || res;
      if (!assessment) {
        setStatus('empty');
      } else {
        setActive(assessment);
        setStatus('ready');
      }
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const firstName = (user?.name || user?.fullName || 'Entrepreneur').split(' ')[0];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-forest via-forest-light to-forest text-cream rounded-card p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="badge bg-gold/20 text-gold-light border-gold/30">
              <Sparkles size={13} className="text-gold" /> AI & ML Microservices Active
            </span>
            {health.isFallback && (
              <span className="badge bg-amber-500/20 text-amber-200 border-amber-400/30">
                Fallback Mode (Offline Dev)
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-display text-cream">Namaste, {firstName}!</h1>
          <p className="text-cream/80 mt-1 max-w-xl text-sm sm:text-base">
            Welcome to your Rivo Enterprise Dashboard. Monitor market scan insights, feasibility forecasts, and matched government schemes.
          </p>
        </div>
        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <Button onClick={() => navigate('/assessment')} icon={Plus} className="shadow-lg">
            New Assessment
          </Button>
          <Button onClick={() => navigate('/ai-assistant')} variant="secondary" icon={Sparkles}>
            AI Copilot
          </Button>
        </div>
        {/* Subtle decorative background circles */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-gold/10 blur-2xl pointer-events-none" />
      </div>

      {/* System Service Connectivity Bar */}
      <div className="bg-white/80 rounded-card p-3.5 border border-forest/10 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-ink/70">
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5">
            <Server size={14} className={health.backend ? 'text-emerald-600' : 'text-amber-500'} />
            Backend REST API: <strong className={health.backend ? 'text-emerald-700' : 'text-amber-600'}>{health.backend ? 'Connected' : 'Client Fallback'}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <Cpu size={14} className={health.ml ? 'text-emerald-600' : 'text-amber-500'} />
            ML Inference Engine: <strong className={health.ml ? 'text-emerald-700' : 'text-amber-600'}>{health.ml ? 'Active' : 'Client Fallback'}</strong>
          </span>
        </div>
        <Link to="/settings" className="text-forest hover:text-gold-dark flex items-center gap-1 underline underline-offset-2">
          <Activity size={13} /> View System Health
        </Link>
      </div>

      {status === 'loading' && <Loader label="Analyzing your active assessment dataset…" />}
      {status === 'error' && <ErrorState message="Could not load your active assessment." onRetry={load} />}

      {status === 'empty' && (
        <div className="card">
          <EmptyState
            title="No active assessment found"
            message="Start an assessment to generate market scan predictions, financial payback estimates, and government scheme recommendations."
            action={
              <Button onClick={() => navigate('/assessment')} icon={Plus}>
                Start New Assessment
              </Button>
            }
          />
        </div>
      )}

      {status === 'ready' && active && (
        <div className="card-hover bg-gradient-to-r from-white via-cream/30 to-white border-forest/15">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4">
              <span className="h-12 w-12 rounded-xl bg-gold/15 text-gold-dark flex items-center justify-center shrink-0">
                <FileText size={22} />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="badge-forest text-[10px]">Active Plan</span>
                  <span className="text-xs text-ink/50">Created {new Date(active.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
                <h3 className="font-semibold text-lg text-forest mt-0.5">
                  {active.businessName || active.businessType || 'Your Village Business Plan'}
                </h3>
                <p className="text-xs text-ink/60 mt-0.5">
                  Location: {active.personal?.district || 'Palampur'}, {active.personal?.state || 'HP'} · Feasibility Assessment
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Progress bar */}
              <div className="w-32 hidden md:block">
                <div className="flex justify-between text-xs mb-1 font-semibold">
                  <span className="text-ink/60">Progress</span>
                  <span className="text-forest">{active.completion ?? 85}%</span>
                </div>
                <div className="h-2 w-full bg-forest/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold rounded-full transition-all duration-500"
                    style={{ width: `${active.completion ?? 85}%` }}
                  />
                </div>
              </div>

              <Link
                to={`/assessment/${active.id}`}
                className="btn-secondary text-xs px-4 py-2 flex items-center gap-1.5"
              >
                Continue <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Feature Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={Gauge}
          label="Market Saturation"
          value="Low Saturation"
          sub="Est. 145 daily footfall in 3 km"
          tone="forest"
          to={active ? `/market-finance/${active.id}` : '/assessment'}
        />
        <StatCard
          icon={Wallet}
          label="Recommended Loan"
          value="₹2.5L"
          sub="Payback period: ~8 months"
          tone="gold"
          to={active ? `/feasibility/${active.id}` : '/assessment'}
        />
        <StatCard
          icon={Landmark}
          label="Top Matched Scheme"
          value="PMEGP Subsidy"
          sub="35% margin money eligible"
          tone="terracotta"
          to={active ? `/loan-schemes/${active.id}` : '/assessment'}
        />
        <StatCard
          icon={FileText}
          label="Download Reports"
          tone="forest"
          links={[
            { label: 'Executive Summary Report', to: active ? `/feasibility/${active.id}` : '/assessment' },
            { label: 'Market Footfall Analysis', to: active ? `/market-finance/${active.id}` : '/assessment' },
            { label: 'PMEGP Subsidy Matches', to: active ? `/loan-schemes/${active.id}` : '/assessment' },
          ]}
        />
      </div>
    </div>
  );
}
