import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { summarizeService } from '../services/summarizeService';

const MAX_CHARS = 5000;

export default function Home() {
  const { user, restoring } = useAuth();
  const { addToast } = useToast();
  const [text, setText] = useState('');
  const [summary, setSummary] = useState<string | null>(null);
  const [summarizing, setSummarizing] = useState(false);

  const handleSummarize = async () => {
    if (!text.trim()) return;
    setSummarizing(true);
    setSummary(null);
    try {
      const result = await summarizeService.summarize(text);
      setSummary(result);
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? (err.response?.data as { error?: string })?.error ?? 'Failed to summarize'
        : 'Something went wrong. Please try again.';
      addToast(msg, 'error');
    } finally {
      setSummarizing(false);
    }
  };

  if (restoring) {
    return (
      <div style={pageWrap}>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={pageWrap}>
        <div className="card" style={{ maxWidth: 480, width: '100%', padding: '3rem 2.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✦</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            AI Text Summarizer
          </h1>
          <p style={{ color: '#64748b', marginBottom: '2rem', lineHeight: 1.6 }}>
            Paste any text and get a concise summary powered by Gemini AI.
            Log in to get started.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Link to="/login" className="btn btn-outline">Login</Link>
            <Link to="/register" className="btn btn-primary">Create account</Link>
          </div>
        </div>
      </div>
    );
  }

  const pct = text.length / MAX_CHARS;

  return (
    <div style={{ maxWidth: 760, margin: '2.5rem auto', padding: '0 1.5rem' }}>
      <h1 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
        Summarize text
      </h1>

      <textarea
        className="input"
        value={text}
        onChange={e => setText(e.target.value)}
        maxLength={MAX_CHARS}
        placeholder="Paste your text here..."
        style={{ height: 280, fontFamily: 'inherit' }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
        <div style={{
          height: 3,
          flex: 1,
          borderRadius: 4,
          backgroundColor: '#e2e8f0',
          overflow: 'hidden',
          marginRight: '1rem',
        }}>
          <div style={{
            height: '100%',
            width: `${pct * 100}%`,
            borderRadius: 4,
            backgroundColor: pct > 0.9 ? '#ef4444' : '#6366f1',
            transition: 'width 0.1s, background-color 0.2s',
          }} />
        </div>
        <span style={{ fontSize: '0.8rem', color: pct > 0.9 ? '#ef4444' : '#94a3b8', whiteSpace: 'nowrap' }}>
          {text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
        </span>
      </div>

      <button
        onClick={handleSummarize}
        disabled={summarizing || !text.trim()}
        className="btn btn-primary btn-primary-lg"
        style={{ marginTop: '1.25rem' }}
      >
        {summarizing ? 'Summarizing…' : '✦ Summarize'}
      </button>

      {summary !== null && (
        <div className="card" style={{ marginTop: '2rem', padding: '1.5rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
            color: '#6366f1',
            fontWeight: 600,
            fontSize: '0.875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            <span>✦</span> Summary
          </div>
          <p style={{ margin: 0, lineHeight: 1.75, color: '#1e293b', whiteSpace: 'pre-wrap' }}>
            {summary}
          </p>
        </div>
      )}
    </div>
  );
}

const pageWrap: React.CSSProperties = {
  minHeight: 'calc(100vh - 60px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem 1.5rem',
};
