import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateEmail, validatePassword } from '../utils/validation';
import { hashPassword } from '../utils/crypto';
import { authService } from '../services/authService';
import Field from '../components/Field';

interface LoginErrors {
  email?: string;
  password?: string;
}

export default function Login() {
  const { setAuth } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const errs: LoginErrors = {};
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    if (emailErr) errs.email = emailErr;
    if (passErr) errs.password = passErr;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const hashedPassword = await hashPassword(password);
      const data = await authService.login(email, hashedPassword);
      setAuth({ username: data.username, email: data.email }, data.accessToken);
      addToast('Logged in successfully!', 'success');
      navigate('/');
    } catch (err) {
      setPassword('');
      const msg = axios.isAxiosError(err)
        ? (err.response?.data as { error?: string })?.error ?? 'Login failed'
        : 'Something went wrong. Please try again.';
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: 420, padding: '2.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Welcome back</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>Log in to your account</p>
        </div>
        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
          <Field label="Email" error={errors.email}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={`input${errors.email ? ' input--error' : ''}`}
              autoComplete="email"
            />
          </Field>
          <Field label="Password" error={errors.password}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={`input${errors.password ? ' input--error' : ''}`}
              autoComplete="current-password"
            />
          </Field>
          <button type="submit" disabled={loading} className="btn btn-primary btn-full" style={{ marginTop: '0.25rem', padding: '0.7rem' }}>
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>
        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
          Don’t have an account?{' '}
          <Link to="/register" style={{ color: '#6366f1', fontWeight: 500, textDecoration: 'none' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}
