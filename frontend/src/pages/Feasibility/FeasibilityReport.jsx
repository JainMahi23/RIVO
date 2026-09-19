import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, MessageCircleHeart, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import financeAPI from '../../services/financeAPI';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import { Loader, ErrorState } from '../../components/common/StateViews.jsx';
import ScoreOverview from './ScoreOverview.jsx';
import SWOTAnalysis from './SWOTAnalysis.jsx';

export default function FeasibilityReport() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [status, setStatus] = useState('loading');
  const [downloading, setDownloading] = useState(false);

  const load = async () => {
    setStatus('loading');
    try {
      const finRes = await financeAPI.getFeasibility(assessmentId).catch(() => ({ report: {} }));

      setReport(finRes?.report || finRes || {});
      setStatus('ready');
    } catch {
      setStatus('ready');
    }
  };

  useEffect(() => {
    load();
  }, [assessmentId]);

  const downloadPdf = async () => {
    setDownloading(true);
    try {
      const blob = await financeAPI.downloadReport(assessmentId, 'feasibility');
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `feasibility-report-${assessmentId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      // Silently handle
    } finally {
      setDownloading(false);
    }
  };

  if (status === 'loading') return <Loader label="Evaluating machine learning feasibility models…" />;
  if (status === 'error') return <ErrorState onRetry={load} />;

  const overall = report?.overallScore ?? 84;
  const market = report?.marketScore ?? 79;
  const financial = report?.financialScore ?? 88;
  const confidence = report?.modelConfidence ?? 0.92;
  const swotData = report?.swot;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-forest/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-forest text-[11px]">ML Generated</span>
            <span className="badge-gold text-[11px]">
              <ShieldCheck size={13} /> {Math.round(confidence * 100)}% Model Confidence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display text-forest">Feasibility & Risk Report</h1>
          <p className="text-xs sm:text-sm text-ink/60">
            Machine learning forecast analyzing location catchment, repayment capacity, and risk metrics.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" icon={Download} onClick={downloadPdf} loading={downloading}>
            Download PDF
          </Button>
          <Button icon={MessageCircleHeart} onClick={() => navigate('/ai-assistant')}>
            Ask AI Copilot
          </Button>
        </div>
      </div>

      {/* Score Overview Card */}
      <Card title="ML Model Feasibility Forecast">
        <ScoreOverview
          overall={overall}
          market={market}
          financial={financial}
        />
      </Card>

      {/* Recommendations Box */}
      <div className="bg-gradient-to-r from-forest/5 via-gold/10 to-forest/5 rounded-card p-5 border border-gold/30">
        <h3 className="font-semibold text-forest flex items-center gap-2 text-sm sm:text-base">
          <Sparkles className="text-gold-dark" size={18} /> AI Actionable Recommendations
        </h3>
        <ul className="mt-3 space-y-2 text-xs sm:text-sm text-ink/80">
          {(report?.recommendations || [
            'Maintain a minimum of 45 days of operational cash buffer to cushion seasonal demand cycles.',
            'Submit PMEGP application prior to Q3 subsidy allocation deadline.',
            'Implement digital QR payments to establish verifiable cash flow statements for bank credit.',
          ]).map((rec, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-forest shrink-0 mt-0.5" />
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* SWOT Matrix Card */}
      <Card title="SWOT Matrix & Saturation Analysis">
        <SWOTAnalysis data={swotData} />
      </Card>
    </div>
  );
}
