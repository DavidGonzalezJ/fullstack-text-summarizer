import { useState } from 'react';
import type { CSSProperties } from 'react';
import { useAuth } from '../context/AuthContext';

const MAX_CHARS = 5000;

export default function Home() {
  const { user, restoring } = useAuth();
  const [text, setText] = useState('');

  if (restoring) {
    return <div style={container}><p style={{ color: '#888' }}>Loading...</p></div>;
  }

  if (!user) {
    return (
      <div style={container}>
        <p style={{ color: '#888', fontSize: '1.1rem', textAlign: 'center', marginTop: '4rem' }}>
          You need to be logged in to use this functionality.
        </p>
      </div>
    );
  }

  return (
    <div style={container}>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Summarize text</h1>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        maxLength={MAX_CHARS}
        placeholder="Paste your text here..."
        style={{
          width: '100%',
          height: '280px',
          padding: '0.75rem',
          fontSize: '0.95rem',
          borderRadius: '8px',
          border: '1px solid #ccc',
          resize: 'vertical',
          boxSizing: 'border-box',
          fontFamily: 'inherit',
        }}
      />
      <div style={{
        textAlign: 'right',
        color: text.length > MAX_CHARS * 0.9 ? '#ef4444' : '#aaa',
        fontSize: '0.82rem',
        marginTop: '0.25rem',
      }}>
        {text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
      </div>
      <button style={summarizeBtn}>
        Summarize
      </button>
    </div>
  );
}

const container: CSSProperties = {
  maxWidth: '720px',
  margin: '3rem auto',
  padding: '0 1.5rem',
};

const summarizeBtn: CSSProperties = {
  marginTop: '1rem',
  padding: '0.6rem 2rem',
  backgroundColor: '#6366f1',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1rem',
  cursor: 'pointer',
};
