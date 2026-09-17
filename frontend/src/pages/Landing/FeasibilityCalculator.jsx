import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FeasibilityCalculator() {
  const [projectCost, setProjectCost] = useState(150000);
  const [ownContribution, setOwnContribution] = useState(30000);
  const navigate = useNavigate();

  const loanNeeded = Math.max(projectCost - ownContribution, 0);
  const estimatedEmi = useMemo(() => {
    const principal = loanNeeded;
    const monthlyRate = 0.105 / 12;
    const months = 60;
    if (principal <= 0) return 0;
    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  }, [loanNeeded]);

  return (
    <section id="feasibility-calculator" className="bg-forest text-cream">
      <div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-display">Get a quick feasibility check</h2>
          <p className="text-cream/70 mt-3 leading-relaxed max-w-md">
            Move the sliders to see roughly how much loan you'd need and what your monthly
            repayment could look like — no sign-up required.
          </p>

          <div className="mt-8 space-y-6 max-w-sm">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-cream/70">Project cost</span>
                <span className="font-semibold">₹{projectCost.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={20000}
                max={2000000}
                step={5000}
                value={projectCost}
                onChange={(e) => setProjectCost(Number(e.target.value))}
                className="w-full accent-gold"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-cream/70">Your own contribution</span>
                <span className="font-semibold">₹{ownContribution.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={0}
                max={projectCost}
                step={1000}
                value={ownContribution}
                onChange={(e) => setOwnContribution(Number(e.target.value))}
                className="w-full accent-gold"
              />
            </div>
          </div>
        </div>

        <div className="bg-cream text-ink rounded-card shadow-card p-6">
          <p className="text-xs font-medium text-ink/45 uppercase tracking-wide">Estimated results</p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-xs text-ink/50">Loan needed</p>
              <p className="text-2xl font-display text-forest mt-1">
                ₹{loanNeeded.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-xs text-ink/50">Estimated EMI / month</p>
              <p className="text-2xl font-display text-forest mt-1">
                ₹{estimatedEmi.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
          <p className="text-xs text-ink/40 mt-4">
            Based on a simple formula at 10.5% for 5 years — not a loan offer. Sign up for a full
            assessment with real projections.
          </p>
          <button onClick={() => navigate('/login')} className="btn-primary w-full mt-5">
            Get my full assessment
          </button>
        </div>
      </div>
    </section>
  );
}
