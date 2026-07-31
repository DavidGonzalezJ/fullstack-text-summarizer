import { useState } from 'react';
import type { FormEvent, CSSProperties } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { validateEmail, validateUsername, validatePassword, validateConfirmPassword } from '../utils/validation';
import { hashPassword } from '../utils/crypto';
import { API_BASE } from '../utils/api';
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
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password: hashedPassword }),
      });

      const data = await res.json() as { error?: string };

      if (!res.ok) {
        setPassword('');
        setConfirmPassword('');
        addToast(data.error ?? 'Registration failed', 'error');
        return;
      }

      addToast('Account created! Please log in.', 'success');
      navigate('/login');
    } catch {
      setPassword('');
      setConfirmPassword('');
      addToast('Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <h1 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Register</h1>
      <form onSubmit={handleSubmit} noValidate style={formStyle}>
        <Field label="Username" error={errors.username}>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={inputStyle(!!errors.username)}
            autoComplete="username"
          />
        </Field>
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
            autoComplete="new-password"
          />
        </Field>
        <Field label="Confirm password" error={errors.confirmPassword}>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            style={inputStyle(!!errors.confirmPassword)}
            autoComplete="new-password"
          />
        </Field>
        <button type="submit" disabled={loading} style={submitBtn}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p style={{ marginTop: '1.25rem', textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>
        Already have an account? <Link to="/login">Login</Link>
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
