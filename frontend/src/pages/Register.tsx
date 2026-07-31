import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { validateEmail, validateUsername, validatePassword, validateConfirmPassword } from '../utils/validation';
import { hashPassword } from '../utils/crypto';
import { authService } from '../services/authService';
import Field from '../components/Field';

interface RegisterErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function Register() {
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const errs: RegisterErrors = {};
    const usernameErr = validateUsername(username);
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(password, confirmPassword);
    if (usernameErr) errs.username = usernameErr;
    if (emailErr) errs.email = emailErr;
    if (passErr) errs.password = passErr;
    if (confirmErr) errs.confirmPassword = confirmErr;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const hashedPassword = await hashPassword(password);
      await authService.register(username, email, hashedPassword);
      addToast('Account created! Please log in.', 'success');
      navigate('/login');
    } catch (err) {
      setPassword('');
      setConfirmPassword('');
      const msg = axios.isAxiosError(err)
        ? (err.response?.data as { error?: string })?.error ?? 'Registration failed'
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Create account</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>Start summarizing text with AI</p>
        </div>
        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
          <Field label="Username" error={errors.username}>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className={`input${errors.username ? ' input--error' : ''}`}
              autoComplete="username"
            />
          </Field>
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
              autoComplete="new-password"
            />
          </Field>
          <Field label="Confirm password" error={errors.confirmPassword}>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className={`input${errors.confirmPassword ? ' input--error' : ''}`}
              autoComplete="new-password"
            />
          </Field>
          <button type="submit" disabled={loading} className="btn btn-primary btn-full" style={{ marginTop: '0.25rem', padding: '0.7rem' }}>
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>
        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#6366f1', fontWeight: 500, textDecoration: 'none' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
