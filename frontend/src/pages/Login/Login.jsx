import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Wheat } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import authAPI from '../../services/authAPI';
import FormField, { TextInput } from '../../components/common/FormField.jsx';
import Button from '../../components/common/Button.jsx';

export default function Login() {
  const { login, verifyOtpLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [mode, setMode] = useState('otp'); // 'otp' | 'password'
  const [step, setStep] = useState('enter'); // 'enter' | 'otp-sent'
  const [mobile, setMobile] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const requestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authAPI.requestOtp(mobile);
      setStep('otp-sent');
    } catch (err) {
      setError(err.message || 'Could not send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const submitOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyOtpLogin(mobile, otp);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(identifier, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Could not log in. Check your details.');
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
          <h1 className="text-xl font-display text-forest text-center">Welcome back</h1>
          <p className="text-sm text-ink/50 text-center mt-1">Log in to continue your assessment</p>

          <div className="flex rounded-pill bg-forest/5 p-1 mt-6 text-sm font-medium">
            <button
              className={`flex-1 py-1.5 rounded-pill transition-colors ${mode === 'otp' ? 'bg-white shadow-soft text-forest' : 'text-ink/50'}`}
              onClick={() => {
                setMode('otp');
                setError('');
              }}
            >
              Mobile OTP
            </button>
            <button
              className={`flex-1 py-1.5 rounded-pill transition-colors ${mode === 'password' ? 'bg-white shadow-soft text-forest' : 'text-ink/50'}`}
              onClick={() => {
                setMode('password');
                setError('');
              }}
            >
              Email / Password
            </button>
          </div>

          {mode === 'otp' && step === 'enter' && (
            <form onSubmit={requestOtp} className="mt-6 space-y-4">
              <FormField label="Mobile number">
                <div className="flex gap-2">
                  <span className="input w-16 flex items-center justify-center px-0">+91</span>
                  <TextInput
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    placeholder="98765 43210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>
              </FormField>
              {error && <p className="text-sm text-terracotta-dark">{error}</p>}
              <Button type="submit" className="w-full" loading={loading}>
                Send OTP
              </Button>
            </form>
          )}

          {mode === 'otp' && step === 'otp-sent' && (
            <form onSubmit={submitOtp} className="mt-6 space-y-4">
              <FormField label={`6-digit OTP sent to +91 ${mobile}`} hint="Didn't get it? Check the number and try again.">
                <TextInput
                  required
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  placeholder="••••••"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </FormField>
              {error && <p className="text-sm text-terracotta-dark">{error}</p>}
              <Button type="submit" className="w-full" loading={loading}>
                Verify & log in
              </Button>
              <button
                type="button"
                onClick={() => setStep('enter')}
                className="text-xs text-ink/50 hover:text-forest w-full text-center"
              >
                Change mobile number
              </button>
            </form>
          )}

          {mode === 'password' && (
            <form onSubmit={submitPassword} className="mt-6 space-y-4">
              <FormField label="Mobile or email">
                <TextInput
                  required
                  placeholder="you@example.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </FormField>
              <FormField label="Password">
                <TextInput
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormField>
              {error && <p className="text-sm text-terracotta-dark">{error}</p>}
              <Button type="submit" className="w-full" loading={loading}>
                Log in
              </Button>
            </form>
          )}

          <p className="text-sm text-ink/55 text-center mt-6">
            New to Rivo?{' '}
            <Link to="/onboarding" className="font-semibold text-forest hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
