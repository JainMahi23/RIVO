import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import authAPI from '../../services/authAPI';
import { checkBackendHealth, checkMLHealth, BASE_API_URL, BASE_ML_URL } from '../../services/apiClient';
import Card from '../../components/common/Card.jsx';
import FormField, { TextInput, SelectInput } from '../../components/common/FormField.jsx';
import Button from '../../components/common/Button.jsx';
import { Server, Cpu, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी (Hindi)' },
];

export default function Settings() {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || user?.fullName || '',
    village: user?.village || '',
    district: user?.district || '',
    language: user?.language || 'en',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Health monitor state
  const [health, setHealth] = useState({ backend: null, ml: null, checking: false });

  const testConnection = async () => {
    setHealth((h) => ({ ...h, checking: true }));
    const [b, m] = await Promise.all([checkBackendHealth(), checkMLHealth()]);
    setHealth({ backend: b, ml: m, checking: false });
  };

  useEffect(() => {
    testConnection();
  }, []);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setError('');
    setSaved(false);
    setSaving(true);
    try {
      await authAPI.updateProfile(form);
      await refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || 'Could not save profile changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display text-forest">Settings & Service Integrations</h1>
        <p className="text-xs sm:text-sm text-ink/60 mt-1">Manage user preferences and monitor backend microservice endpoints.</p>
      </div>

      {/* Profile Settings */}
      <Card title="User Entrepreneur Profile">
        <form onSubmit={save} className="space-y-4">
          <FormField label="Full Name">
            <TextInput required value={form.name} onChange={update('name')} placeholder="Ramesh Kumar" />
          </FormField>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label="Village / Town">
              <TextInput value={form.village} onChange={update('village')} placeholder="Palampur" />
            </FormField>
            <FormField label="District">
              <TextInput value={form.district} onChange={update('district')} placeholder="Kangra" />
            </FormField>
          </div>
          <FormField label="Preferred Language">
            <SelectInput value={form.language} onChange={update('language')}>
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </SelectInput>
          </FormField>

          {error && <p className="text-xs text-terracotta-dark font-semibold">{error}</p>}
          {saved && <p className="text-xs text-emerald-700 font-semibold">✓ Profile settings saved successfully.</p>}

          <div className="flex justify-end pt-2">
            <Button type="submit" loading={saving}>Save Changes</Button>
          </div>
        </form>
      </Card>

      {/* Microservice Endpoint Health Monitor */}
      <Card title="Backend & ML Microservices Status">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-cream/40 rounded-xl border border-forest/10">
            <div className="flex items-center gap-3">
              <span className={`h-10 w-10 rounded-xl flex items-center justify-center ${health.backend ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                <Server size={20} />
              </span>
              <div>
                <p className="font-semibold text-forest text-sm">Main REST API Server</p>
                <p className="text-xs text-ink/50 font-mono">{BASE_API_URL}</p>
              </div>
            </div>
            <span className={`badge ${health.backend ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {health.backend ? 'Connected (200 OK)' : 'Fallback Mode Active'}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-cream/40 rounded-xl border border-forest/10">
            <div className="flex items-center gap-3">
              <span className={`h-10 w-10 rounded-xl flex items-center justify-center ${health.ml ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                <Cpu size={20} />
              </span>
              <div>
                <p className="font-semibold text-forest text-sm">ML & AI Microservice Engine</p>
                <p className="text-xs text-ink/50 font-mono">{BASE_ML_URL}</p>
              </div>
            </div>
            <span className={`badge ${health.ml ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {health.ml ? 'Active (200 OK)' : 'Fallback Mode Active'}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-ink/50">
              When microservices are offline, client fallback mode automatically provides simulated responses for seamless UI testing.
            </p>
            <Button variant="ghost" onClick={testConnection} loading={health.checking} icon={RefreshCw}>
              Probe Health
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
