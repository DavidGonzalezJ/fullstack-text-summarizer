import { useState } from 'react';
import type { CSSProperties } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { API_BASE } from '../utils/api';

const MAX_CHARS = 5000;

export default function Home() {
  const { user, restoring, accessToken } = useAuth();
  const { addToast } = useToast();
  const [text, setText] = useState('');
  const [summary, setSummary] = useState<string | null>(null);
  const [summarizing, setSummarizing] = useState(false);

  const handleSummarize = async () => {
    if (!text.trim()) return;
    setSummarizing(true);
    setSummary(null);
    try {
      const res = await fetch(`${API_BASE}/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ text }),
      });
      const data = await res.json() as { summary?: string; error?: string };
      if (!res.ok) {
        addToast(data.error ?? 'Failed to summarize', 'error');
        return;
      }
      setSummary(data.summary ?? '');
    } catch {
      addToast('Something went wrong. Please try again.', 'error');
    } finally {
      setSummarizing(false);
    }
  };

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
      <button onClick={handleSummarize} disabled={summarizing || !text.trim()} style={summarizeBtn}>
        {summarizing ? 'Summarizing...' : 'Summarize'}
      </button>
      {summary !== null && (
        <div style={summaryBox}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#444' }}>Summary</h2>
          <p style={{ margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{summary}</p>
        </div>
      )}
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

const summaryBox: CSSProperties = {
  marginTop: '1.5rem',
  padding: '1rem 1.25rem',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  backgroundColor: '#f9fafb',
  fontSize: '0.95rem',
  color: '#374151',
};
