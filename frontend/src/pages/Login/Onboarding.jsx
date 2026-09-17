import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wheat } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import FormField, { TextInput } from '../../components/common/FormField.jsx';
import Button from '../../components/common/Button.jsx';

export default function Onboarding() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', mobile: '', village: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Could not create your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12 bg-field-lines">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <Wheat size={22} className="text-gold-dark" />
          <span className="font-display text-xl text-forest">Rivo</span>
        </Link>

        <div className="card">
          <h1 className="text-xl font-display text-forest text-center">Create your account</h1>
          <p className="text-sm text-ink/50 text-center mt-1">Takes about two minutes</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <FormField label="Full name">
              <TextInput required value={form.fullName} onChange={update('fullName')} placeholder="Ramesh Kumar" />
            </FormField>
            <FormField label="Mobile number">
              <div className="flex gap-2">
                <span className="input w-16 flex items-center justify-center px-0">+91</span>
                <TextInput
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  value={form.mobile}
                  onChange={update('mobile')}
                  placeholder="98765 43210"
                />
              </div>
            </FormField>
            <FormField label="Village / town">
              <TextInput required value={form.village} onChange={update('village')} placeholder="Palampur, HP" />
            </FormField>
            <FormField label="Password" hint="At least 6 characters">
              <TextInput
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={update('password')}
                placeholder="••••••••"
              />
            </FormField>
            {error && <p className="text-sm text-terracotta-dark">{error}</p>}
            <Button type="submit" className="w-full" loading={loading}>
              Registration
            </Button>
          </form>

          <p className="text-sm text-ink/55 text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-forest hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
