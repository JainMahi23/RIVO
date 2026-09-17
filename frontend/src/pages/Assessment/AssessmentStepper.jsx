import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Stepper from '../../components/common/Stepper.jsx';
import PersonalStep from './PersonalStep.jsx';
import BusinessStep from './BusinessStep.jsx';
import ReviewStep from './ReviewStep.jsx';
import assessmentAPI from '../../services/assessmentAPI';
import { Loader, ErrorState } from '../../components/common/StateViews.jsx';

const STEPS = ['Personal', 'Business', 'Review'];

export default function AssessmentStepper() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [data, setData] = useState({ personal: {}, business: {} });
  const [assessmentId, setAssessmentId] = useState(id && id !== 'active' ? id : null);
  const [status, setStatus] = useState(id && id !== 'active' ? 'loading' : 'ready');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!assessmentId) return;
    assessmentAPI
      .getById(assessmentId)
      .then((res) => {
        const a = res?.assessment || res;
        setData({ personal: a?.personal || {}, business: a?.business || {} });
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [assessmentId]);

  const saveStep = async (stepKey, payload) => {
    setError('');
    setData((d) => ({ ...d, [stepKey]: payload }));
    try {
      if (!assessmentId) {
        const res = await assessmentAPI.create({ [stepKey]: payload });
        const created = res?.assessment || res;
        setAssessmentId(created?.id);
      } else {
        await assessmentAPI.updateStep(assessmentId, stepKey, payload);
      }
      setCurrent((c) => Math.min(c + 1, STEPS.length - 1));
    } catch (err) {
      setError(err.message || 'Could not save this step. Please try again.');
    }
  };

  const finish = async () => {
    setError('');
    try {
      await assessmentAPI.submit(assessmentId);
      navigate(`/market-finance/${assessmentId}`);
    } catch (err) {
      setError(err.message || 'Could not submit your assessment. Please try again.');
    }
  };

  if (status === 'loading') return <Loader label="Loading your assessment…" />;
  if (status === 'error') return <ErrorState message="Couldn't load this assessment." onRetry={() => window.location.reload()} />;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-display text-forest">Business assessment</h1>
        <p className="text-sm text-ink/55 mt-1">Tell us about yourself and your idea — this takes a few minutes.</p>
      </div>

      <Stepper steps={STEPS} current={current} />

      {error && <p className="text-sm text-terracotta-dark text-center">{error}</p>}

      <div className="card">
        {current === 0 && (
          <PersonalStep initial={data.personal} onNext={(payload) => saveStep('personal', payload)} />
        )}
        {current === 1 && (
          <BusinessStep
            initial={data.business}
            onBack={() => setCurrent(0)}
            onNext={(payload) => saveStep('business', payload)}
          />
        )}
        {current === 2 && (
          <ReviewStep data={data} onBack={() => setCurrent(1)} onSubmit={finish} />
        )}
      </div>
    </div>
  );
}
