'use client';

import { useState, useEffect, useRef } from 'react';

const enrichWithAI = (article) => {
  const keywords = ['AI', 'OpenAI', 'Security', 'Threat', 'Funding', 'Model', 'Google', 'Meta', 'Data'];
  const hasKeyword = keywords.find(k => article.title.includes(k) || (article.content && article.content.includes(k)));
  
  let sentiment = 'neutral';
  const t = article.title.toLowerCase();
  if (t.includes('safety') || t.includes('threat') || t.includes('slow') || t.includes('risk') || t.includes('fail')) sentiment = 'negative';
  else if (t.includes('funding') || t.includes('lands') || t.includes('release') || t.includes('launch') || t.includes('growth')) sentiment = 'positive';
  
  return {
    ...article,
    sentiment,
    ai_tags: hasKeyword ? [hasKeyword, 'Tech'] : ['General']
  };
};

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Feature states
  const [search, setSearch] = useState('');
  const [badgeFilter, setBadgeFilter] = useState(null); // 'positive', 'negative', etc.
  const [theme, setTheme] = useState('dark');
  const [logs, setLogs] = useState([]);
  const [tutorialStep, setTutorialStep] = useState(0); // 0 = hidden, 1+ = steps

  const terminalRef = useRef(null);

  // Initialization & Data fetching
  useEffect(() => {
    // Check if tutorial was already done
    const isDone = localStorage.getItem('nr_tutorial');
    if (!isDone) setTutorialStep(1);

    // Initial log
    setLogs([{ type: 'log-info', text: 'Initializing Rust Core connection...' }]);

    // Use absolute URL in development to bypass need for rewrites
    const apiUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api/news' : '/api/news';

    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        const enriched = data.map(enrichWithAI);
        setArticles(enriched);
        setLoading(false);
        setLogs(prev => [...prev, { type: 'log-success', text: `Ingested ${enriched.length} signals successfully.` }]);
      })
      .catch(err => {
        console.error("API error", err);
        setArticles([]);
        setError("System offline or synchronizing. Please check engine status.");
        setLoading(false);
        setLogs(prev => [...prev, { type: 'log-err', text: `Connection failed: ${err.message}` }]);
      });
  }, []);

  // Theme effect
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [theme]);

  // Terminal Simulator
  useEffect(() => {
    const mockLogs = [
      "[INFO] Scanning RSS feed: TechCrunch",
      "[WARN] Rate limit approaching for ycombinator",
      "[INFO] Parsing new unstructured data block",
      "[SUCCESS] Data sanitized and indexed in SQLite",
      "[INFO] AI Sentiment pipeline executing...",
    ];
    
    const interval = setInterval(() => {
      const randomLog = mockLogs[Math.floor(Math.random() * mockLogs.length)];
      let type = 'log-info';
      if (randomLog.includes('[WARN]')) type = 'log-warn';
      if (randomLog.includes('[SUCCESS]')) type = 'log-success';
      
      setLogs(prev => {
        const newLogs = [...prev, { type, text: randomLog }];
        if (newLogs.length > 20) newLogs.shift();
        return newLogs;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  // Derived state
  const filtered = articles.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || 
                          (a.content && a.content.toLowerCase().includes(search.toLowerCase()));
    const matchesBadge = badgeFilter ? (a.sentiment === badgeFilter || a.source === badgeFilter) : true;
    return matchesSearch && matchesBadge;
  });

  const stats = {
    total: articles.length,
    critical: articles.filter(a => a.sentiment === 'negative').length,
    positive: articles.filter(a => a.sentiment === 'positive').length,
    neutral: articles.filter(a => a.sentiment === 'neutral').length,
  };

  const chartTotal = stats.critical + stats.positive + stats.neutral || 1; // avoid /0

  // Handlers
  const handleTutorialNext = () => {
    if (tutorialStep === 3) {
      localStorage.setItem('nr_tutorial', 'done');
      setTutorialStep(0);
    } else {
      setTutorialStep(prev => prev + 1);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="app-container">
      
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
          </div>
          <span className="brand-text">NewsRadar</span>
        </div>
        
        <nav className="nav-menu">
          <button className="nav-item active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            <span>Dashboard</span>
          </button>
          
          <button className="nav-item" onClick={toggleTheme}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {theme === 'dark' ? (
                <circle cx="12" cy="12" r="5"></circle>
              ) : (
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              )}
            </svg>
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <button className="nav-item" onClick={() => setTutorialStep(1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            <span>Tutorial</span>
          </button>
        </nav>

        {/* Live Terminal */}
        <div className="terminal-container">
          <div className="terminal-header">
            <div className="terminal-dot dot-r"></div>
            <div className="terminal-dot dot-y"></div>
            <div className="terminal-dot dot-g"></div>
            <span style={{marginLeft: '0.5rem', color: '#666'}}>rust-core-engine</span>
          </div>
          <div className="terminal-body" ref={terminalRef}>
            {logs.map((log, i) => (
              <div key={i} className={`log-line ${log.type}`}>
                <span style={{color: '#666'}}>[{new Date().toLocaleTimeString()}]</span> {log.text}
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Interface */}
      <main className="main-content">
        
        {/* Topbar */}
        <header className="topbar">
          <div className="search-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Query intelligence database..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </header>

        {/* Dashboard Widgets */}
        <section className="widgets-grid">
          <div className="widget-card">
            <span className="widget-title">Sentiment Velocity Chart</span>
            <span className="widget-value">{loading ? '-' : stats.total}</span>
            <div className="chart-container">
              <div className="chart-bar chart-positive" style={{ width: `${(stats.positive / chartTotal) * 100}%` }}>
                {stats.positive > 0 && stats.positive}
              </div>
              <div className="chart-bar chart-neutral" style={{ width: `${(stats.neutral / chartTotal) * 100}%` }}>
                {stats.neutral > 0 && stats.neutral}
              </div>
              <div className="chart-bar chart-negative" style={{ width: `${(stats.critical / chartTotal) * 100}%` }}>
                {stats.critical > 0 && stats.critical}
              </div>
            </div>
            <div style={{display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem'}}>
              <span><span style={{color: 'var(--success)'}}>■</span> Pos</span>
              <span><span style={{color: 'var(--text-muted)'}}>■</span> Neu</span>
              <span><span style={{color: 'var(--danger)'}}>■</span> Crit</span>
            </div>
          </div>
          
          <div className="widget-card">
            <span className="widget-title">Critical Alerts</span>
            <span className="widget-value" style={{color: 'var(--danger)'}}>{loading ? '-' : stats.critical}</span>
            <div style={{marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem'}}>
              Signals flagged as high-risk threats.
            </div>
          </div>

          {badgeFilter ? (
            <div className="widget-card" style={{background: 'var(--accent-glow)', borderColor: 'var(--accent)'}}>
              <span className="widget-title" style={{color: 'var(--text-main)'}}>Active Filter</span>
              <span className="widget-value" style={{fontSize: '1.5rem', marginTop: '0.5rem'}}>{badgeFilter.toUpperCase()}</span>
              <button 
                onClick={() => setBadgeFilter(null)}
                style={{marginTop: 'auto', background: 'var(--accent)', color: '#fff', padding: '0.5rem', borderRadius: '8px', fontWeight: 'bold'}}
              >
                Clear Filter
              </button>
            </div>
          ) : (
            <div className="widget-card">
              <span className="widget-title">Global Feed</span>
              <span className="widget-value" style={{fontSize: '1.5rem', marginTop: '0.5rem'}}>Unfiltered</span>
              <div style={{marginTop: 'auto', color: 'var(--text-muted)', fontSize: '0.85rem'}}>
                Click any badge on a card to pivot data.
              </div>
            </div>
          )}
        </section>

        {/* Intelligence Grid */}
        <div className="section-header">
          <h2>Live Feed</h2>
          <div style={{fontSize: '1rem', color: 'var(--text-muted)'}}>
            {filtered.length} results found
          </div>
        </div>

        {loading ? (
          <div className="loader-wrapper">
            <div className="spinner"></div>
            <div style={{color: 'var(--text-muted)'}}>Syncing with Rust Core...</div>
          </div>
        ) : error ? (
          <div className="loader-wrapper">
            <div style={{color: 'var(--danger)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {error}
            </div>
          </div>
        ) : (
          <div className="articles-grid">
            {filtered.map((article, i) => (
              <div key={i} className="article-card" style={{animationDelay: `${i * 0.05}s`}}>
                <div className="card-tags">
                  <span className="badge badge-source" onClick={(e) => { e.stopPropagation(); setBadgeFilter(article.source); }}>
                    {article.source || 'Unknown'}
                  </span>
                  <span className={`badge badge-sentiment ${article.sentiment}`} onClick={(e) => { e.stopPropagation(); setBadgeFilter(article.sentiment); }}>
                    {article.sentiment === 'negative' ? 'High Risk' : article.sentiment === 'positive' ? 'Opportunity' : 'Neutral'}
                  </span>
                </div>
                <h3 className="card-title" style={{marginTop: '1rem'}}>{article.title}</h3>
                <p className="card-snippet">{article.content}</p>
                <div className="card-footer">
                  <span>{article.ai_tags.join(' • ')}</span>
                  <a href={article.link} target="_blank" rel="noreferrer" style={{color: 'var(--accent)', textDecoration: 'none', fontWeight: 'bold'}}>
                    Read Report →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Dynamic Tutorial Overlay */}
      {tutorialStep > 0 && (
        <div className="tutorial-overlay">
          <div className="tutorial-box">
            {tutorialStep === 1 && (
              <>
                <h2 className="tutorial-title">Welcome to NewsRadar</h2>
                <p className="tutorial-text">
                  This isn&apos;t a basic news app. This is a local-first, open-source intelligence dashboard. Let&apos;s show you the engine.
                </p>
                <button className="tutorial-btn" onClick={handleTutorialNext}>Next: Analytics</button>
              </>
            )}
            {tutorialStep === 2 && (
              <>
                <h2 className="tutorial-title">Interactive Sentiment Chart</h2>
                <p className="tutorial-text">
                  Notice the Sentiment Velocity Chart at the top? It dynamically analyzes all ingested signals and categorizes them into Threat, Opportunity, and Neutral intelligence streams based on keywords.
                </p>
                <button className="tutorial-btn" onClick={handleTutorialNext}>Next: Interactive Badges</button>
              </>
            )}
            {tutorialStep === 3 && (
              <>
                <h2 className="tutorial-title">Deep Filtering</h2>
                <p className="tutorial-text">
                  Every card has AI-generated badges. Click any badge (like "High Risk" or a specific source) to instantly pivot the entire dashboard to that filter.
                  Also check out the Live Terminal Console in the bottom left, streaming simulated Rust ingestion logs!
                </p>
                <button className="tutorial-btn" onClick={handleTutorialNext}>Start Scanning</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
