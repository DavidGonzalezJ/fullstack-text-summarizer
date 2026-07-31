import { useState } from 'react';
import type { FormEvent, CSSProperties } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateEmail, validatePassword } from '../utils/validation';
import { hashPassword } from '../utils/crypto';
import { API_BASE } from '../utils/api';
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
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: hashedPassword }),
      });

      const data = await res.json() as {
        username: string;
        email: string;
        accessToken: string;
        refreshToken: string;
        error?: string;
      };

      if (!res.ok) {
        setPassword('');
        addToast(data.error ?? 'Login failed', 'error');
        return;
      }

      setAuth({ username: data.username, email: data.email }, data.accessToken, data.refreshToken);
      addToast('Logged in successfully!', 'success');
      navigate('/');
    } catch {
      setPassword('');
      addToast('Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <h1 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Login</h1>
      <form onSubmit={handleSubmit} noValidate style={formStyle}>
        <Field label="Email" error={errors.email}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle(!!errors.email)}
            autoComplete="email"
          />
        </Field>
        <Field label="Password" error={errors.password}>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={inputStyle(!!errors.password)}
            autoComplete="current-password"
          />
        </Field>
        <button type="submit" disabled={loading} style={submitBtn}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p style={{ marginTop: '1.25rem', textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

const container: CSSProperties = { maxWidth: '400px', margin: '4rem auto', padding: '0 1.5rem' };
const formStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '1rem' };
const inputStyle = (hasError: boolean): CSSProperties => ({
  padding: '0.6rem 0.75rem',
  fontSize: '0.95rem',
  borderRadius: '6px',
  border: `1px solid ${hasError ? '#ef4444' : '#ccc'}`,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
});
const submitBtn: CSSProperties = {
  padding: '0.65rem',
  backgroundColor: '#6366f1',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '1rem',
  cursor: 'pointer',
  marginTop: '0.25rem',
};
