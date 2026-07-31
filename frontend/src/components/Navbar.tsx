import { Link, useNavigate } from 'react-router-dom';
import type { CSSProperties } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    addToast('Logged out successfully', 'success');
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={brandStyle}>Text Summarizer</Link>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        {user ? (
          <>
            <span style={{ color: '#a0a0b0', fontSize: '0.9rem' }}>Hi, {user.username}</span>
            <button onClick={handleLogout} style={outlineBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={outlineLinkBtn}>Login</Link>
            <Link to="/register" style={filledLinkBtn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const navStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.875rem 2rem',
  backgroundColor: '#1e1e2e',
  color: '#fff',
  borderBottom: '1px solid #2a2a3e',
};

const brandStyle: CSSProperties = {
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 700,
  fontSize: '1rem',
};

const outlineBtn: CSSProperties = {
  padding: '0.35rem 0.9rem',
  border: '1px solid #6366f1',
  borderRadius: '6px',
  background: 'transparent',
  color: '#6366f1',
  cursor: 'pointer',
  fontSize: '0.875rem',
};

const outlineLinkBtn: CSSProperties = {
  padding: '0.35rem 0.9rem',
  border: '1px solid #6366f1',
  borderRadius: '6px',
  color: '#6366f1',
  textDecoration: 'none',
  fontSize: '0.875rem',
};

const filledLinkBtn: CSSProperties = {
  padding: '0.35rem 0.9rem',
  border: '1px solid #6366f1',
  borderRadius: '6px',
  backgroundColor: '#6366f1',
  color: '#fff',
  textDecoration: 'none',
  fontSize: '0.875rem',
};
