import { useState } from 'react';
import { Sparkles, Calculator, CheckCircle2 } from 'lucide-react';
import Button from '../../components/common/Button.jsx';

function Row({ label, value }) {
  return (
    <div className="flex justify-between py-2 border-b border-forest/5 last:border-0 text-sm">
      <span className="text-ink/60">{label}</span>
      <span className="font-semibold text-forest text-right">{value || '—'}</span>
    </div>
  );
}

export default function ReviewStep({ data, onBack, onSubmit }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { personal = {}, business = {} } = data;

  const projectCost = Number(business.projectCost || 0);
  const ownContribution = Number(business.ownContribution || 0);
  const estimatedLoanGap = Math.max(0, projectCost - ownContribution);

  const submit = async () => {
    setError('');
    setSubmitting(true);
    try {
      await onSubmit();
    } catch (err) {
      setError(err.message || 'Could not submit assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-forest/10 pb-4">
        <div>
          <h2 className="font-semibold text-lg text-forest">Review your business assessment</h2>
          <p className="text-xs text-ink/60 mt-0.5">Check your inputs before submitting for ML market & financial forecasting.</p>
        </div>
        <span className="badge-gold text-xs">
          <Sparkles size={13} /> ML Pre-check Ready
        </span>
      </div>

      {/* Auto-Calculated Summary Card */}
      <div className="bg-forest/5 rounded-xl p-4 border border-forest/15 grid sm:grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-ink/50 font-medium">Total Project Cost</p>
          <p className="font-display text-lg text-forest mt-0.5">₹{projectCost.toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-xs text-ink/50 font-medium">Owner Contribution</p>
          <p className="font-display text-lg text-forest-light mt-0.5">₹{ownContribution.toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-xs text-ink/50 font-medium">Est. Loan Requirement</p>
          <p className="font-display text-lg text-gold-dark mt-0.5">₹{estimatedLoanGap.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-xl p-4 border border-forest/10">
          <p className="text-xs font-semibold uppercase tracking-wider text-gold-dark mb-2 flex items-center gap-1.5">
            <CheckCircle2 size={14} /> Personal Information
          </p>
          <Row label="Full Name" value={`${personal.firstName || ''} ${personal.lastName || ''}`.trim()} />
          <Row label="Current Skill/Trade" value={personal.incomeSkill} />
          <Row label="Funding Goal" value={personal.fundingNeeded ? `₹${Number(personal.fundingNeeded).toLocaleString('en-IN')}` : ''} />
          <Row label="Key Expertise" value={personal.skills} />
        </div>

        <div className="bg-white rounded-xl p-4 border border-forest/10">
          <p className="text-xs font-semibold uppercase tracking-wider text-forest mb-2 flex items-center gap-1.5">
            <Calculator size={14} /> Business & Financial Setup
          </p>
          <Row label="Business Category" value={business.businessType} />
          <Row label="Operational Scale" value={business.scale} />
          <Row label="Project Cost" value={business.projectCost ? `₹${Number(business.projectCost).toLocaleString('en-IN')}` : ''} />
          <Row label="Own Capital" value={business.ownContribution ? `₹${Number(business.ownContribution).toLocaleString('en-IN')}` : ''} />
          <Row label="Existing Liabilities" value={business.existingLiabilities ? `₹${Number(business.existingLiabilities).toLocaleString('en-IN')}` : '₹0'} />
          <Row label="Business Vision" value={business.description} />
        </div>
      </div>

      {error && <p className="text-sm text-terracotta-dark font-medium">{error}</p>}

      <div className="flex items-center justify-between pt-3 border-t border-forest/10">
        <Button variant="ghost" onClick={onBack}>Back to Business Setup</Button>
        <Button onClick={submit} loading={submitting} icon={Sparkles}>
          Generate ML Feasibility Report
        </Button>
      </div>
    </div>
  );
}
