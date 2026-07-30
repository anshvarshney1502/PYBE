import React, { useState, useEffect } from 'react';
import { C } from './utils.jsx';
import CaseStudyEngine from './CaseStudyEngine.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

async function apiGet(path) {
  const res = await fetch(`${API_URL}${path}`, { headers: { 'Content-Type': 'application/json' } });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ─── React Error Boundary for Learning Engine ──────────────────────────────
class LearningErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("LearningErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ maxWidth: 860, margin: '2rem auto', padding: '2rem', textAlign: 'center', background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 16 }}>
          <h2 style={{ color: C.error, marginBottom: '0.5rem' }}>Something went wrong</h2>
          <p style={{ color: C.body, marginBottom: '1.5rem' }}>We encountered an error while running the learning engine.</p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              if (this.props.onReset) this.props.onReset();
            }}
            style={{ background: C.darkBg, color: C.darkText, border: 'none', borderRadius: 10, padding: '0.75rem 1.5rem', fontWeight: 600, cursor: 'pointer' }}
          >
            🔄 Return to Levels
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Level card ───────────────────────────────────────────────────────────────
function LevelCard({ level, unlocked, completed, onClick }) {
  const lvl = level.levelId;
  return (
    <div
      onClick={() => unlocked && onClick(lvl)}
      style={{
        background: completed ? C.accentBg : unlocked ? C.cardBg : '#f4f1ea',
        border: completed
          ? `1px solid ${C.accentBorder}`
          : unlocked
          ? `1px solid ${C.border}`
          : '1px solid transparent',
        borderRadius: 14, padding: '1.25rem',
        display: 'flex', flexDirection: 'column', gap: '0.6rem',
        cursor: unlocked ? 'pointer' : 'not-allowed',
        opacity: unlocked ? 1 : 0.45,
        transition: 'all .22s ease', position: 'relative', overflow: 'hidden',
      }}
      onMouseEnter={(e) => { if (unlocked) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(119,159,39,.18)'; } }}
      onMouseLeave={(e) => { if (unlocked) { e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = 'none'; } }}
    >
      {!unlocked  && <span style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>🔒</span>}
      {completed  && <span style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>✅</span>}

      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#7b9f27', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        Level {lvl}
      </span>
      <span style={{ fontSize: '0.95rem', fontWeight: 600, color: unlocked ? C.text : C.muted }}>
        {level.title.replace(/^Level \d+: /, '')}
      </span>
      <span style={{ fontSize: '0.78rem', color: C.muted }}>
        {completed
          ? 'Completed'
          : unlocked
          ? `${level.caseStudies?.length ?? 0} exercise`
          : `Unlock after Level ${lvl - 1}`}
      </span>
    </div>
  );
}

// ─── Learning Page top-level view ──────────────────────────────────────────
export default function LearningPage() {
  const [topics, setTopics]               = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [fullTopic, setFullTopic]         = useState(null);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [topicLoading, setTopicLoading]   = useState(false);

  // 'levels' view or 'engine' view
  const [view, setView]                   = useState('levels');
  const [selectedLevelId, setSelectedLevelId] = useState(null);

  // Per-topic completion tracking: { topicId: Set([levelId, ...]) }
  const [topicProgress, setTopicProgress] = useState({});

  const completedLevels = topicProgress[selectedTopicId] ?? new Set();

  const markLevelDone = (topicId, lvlId) =>
    setTopicProgress((prev) => ({
      ...prev,
      [topicId]: new Set([...(prev[topicId] ?? []), Number(lvlId)]),
    }));

  const levels = fullTopic?.levels ?? [];

  // Fetch topic list and auto-select first topic if none selected
  useEffect(() => {
    apiGet('/topics')
      .then((data) => {
        setTopics(data);
        setTopicsLoading(false);
        if (data && data.length > 0) {
          setSelectedTopicId(data[0].topicId);
        }
      })
      .catch(() => setTopicsLoading(false));
  }, []);

  // Fetch full topic when selection changes
  useEffect(() => {
    if (!selectedTopicId) { setFullTopic(null); return; }
    setTopicLoading(true);
    apiGet(`/topics/${selectedTopicId}`)
      .then((data) => { setFullTopic(data); setTopicLoading(false); })
      .catch(() => setTopicLoading(false));
  }, [selectedTopicId]);

  const isUnlocked  = (lvl) => Number(lvl) === 1 || completedLevels.has(Number(lvl) - 1);
  const isCompleted = (lvl) => completedLevels.has(Number(lvl));

  // ── Engine view ─────────────────────────────────────────────────────────────
  if (view === 'engine' && selectedLevelId && fullTopic) {
    const levelIdNum = Number(selectedLevelId);
    const levelData = levels.find((l) => Number(l.levelId) === levelIdNum);

    if (!levelData) {
      return (
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: C.muted, fontSize: '1rem', marginBottom: '1rem' }}>Level not found.</p>
          <button
            onClick={() => setView('levels')}
            style={{ background: C.darkBg, color: C.darkText, border: 'none', borderRadius: 10, padding: '0.7rem 1.5rem', fontWeight: 600, cursor: 'pointer' }}
          >
            ← Back to levels
          </button>
        </div>
      );
    }

    return (
      <LearningErrorBoundary onReset={() => setView('levels')}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem' }}>
          {/* Back link */}
          <button
            onClick={() => {
              markLevelDone(selectedTopicId, levelIdNum);
              setView('levels');
            }}
            style={{ background: 'none', border: 'none', color: C.body, fontSize: '0.9rem', cursor: 'pointer', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: 0, fontWeight: 500 }}
          >
            ← Back to levels
          </button>

          {/* Level header */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: C.label, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 0.3rem' }}>
              {fullTopic.topicName}
            </p>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: C.text, margin: 0 }}>
              {levelData.title}
            </h2>
          </div>

          <CaseStudyEngine
            key={`${selectedTopicId}-${levelIdNum}`}
            levelData={levelData}
            topicLevelCount={levels.length}
            levelId={levelIdNum}
            onBack={() => {
              markLevelDone(selectedTopicId, levelIdNum);
              setView('levels');
            }}
            onGoToLevel={(nextId) => {
              const nextNum = Number(nextId);
              markLevelDone(selectedTopicId, levelIdNum);
              setSelectedLevelId(nextNum);
              setView('engine');
            }}
          />
        </div>
      </LearningErrorBoundary>
    );
  }

  // ── Levels view ─────────────────────────────────────────────────────────────
  return (
    <LearningErrorBoundary onReset={() => setView('levels')}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem' }}>
        {/* Heading */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 700, color: C.text, marginBottom: '0.5rem' }}>
            Learning
          </h1>
          <p style={{ color: C.body, fontSize: '0.95rem', margin: 0 }}>
            Pick a topic and dive into the scenario engine.
          </p>
        </div>

        {/* Topic selector */}
        <div style={{ marginBottom: '2rem' }}>
          <label htmlFor="cs-topic-select" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: C.label, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Select Topic
          </label>

          {topicsLoading ? (
            <p style={{ color: C.muted }}>Loading topics…</p>
          ) : (
            <select
              id="cs-topic-select"
              value={selectedTopicId}
              onChange={(e) => {
                setSelectedTopicId(e.target.value);
                setView('levels');
              }}
              style={{
                background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 10,
                padding: '0.75rem 1rem',
                color: selectedTopicId ? C.text : C.muted,
                fontSize: '0.95rem', maxWidth: 380, cursor: 'pointer', outline: 'none',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#7b9f27')}
              onBlur={(e)  => (e.target.style.borderColor = C.border)}
            >
              <option value="" disabled> Choose a topic</option>
              {topics.map((t) => (
                <option key={t.topicId} value={t.topicId}>{t.topicName}</option>
              ))}
            </select>
          )}
        </div>

        {/* Level grid */}
        {selectedTopicId && (
          <div>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: C.label, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Levels
            </p>
            {topicLoading ? (
              <p style={{ color: C.muted }}>Loading levels…</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                {levels.map((level) => (
                  <LevelCard
                    key={level.levelId}
                    level={level}
                    unlocked={isUnlocked(level.levelId)}
                    completed={isCompleted(level.levelId)}
                    onClick={(lvl) => { setSelectedLevelId(Number(lvl)); setView('engine'); }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!selectedTopicId && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '4rem 2rem', border: `1px dashed ${C.border}`, borderRadius: 18, color: C.muted, textAlign: 'center' }}>
            <span style={{ fontSize: '2.5rem' }}>🐍</span>
            <p style={{ fontSize: '0.95rem', margin: 0, color: C.body }}>Select a topic above to see your levels</p>
          </div>
        )}
      </div>
    </LearningErrorBoundary>
  );
}
