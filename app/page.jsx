'use client';

import { useState, useEffect } from 'react';

// Mock sentiment analysis for demo purposes to add "useful information"
const enrichWithAI = (article) => {
  const keywords = ['AI', 'OpenAI', 'Security', 'Threat', 'Funding', 'Model'];
  const hasKeyword = keywords.find(k => article.title.includes(k) || (article.content && article.content.includes(k)));
  
  let sentiment = 'neutral';
  if (article.title.toLowerCase().includes('safety') || article.title.toLowerCase().includes('threat') || article.title.toLowerCase().includes('slow')) sentiment = 'negative';
  else if (article.title.toLowerCase().includes('funding') || article.title.toLowerCase().includes('lands') || article.title.toLowerCase().includes('release')) sentiment = 'positive';
  
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
  const [search, setSearch] = useState('');
  const [activeArticle, setActiveArticle] = useState(null);

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        const enriched = data.map(enrichWithAI);
        setArticles(enriched);
        setLoading(false);
      })
      .catch(err => {
        console.error("API error", err);
        setArticles([]);
        setError("System offline or synchronizing. Please check engine status.");
        setLoading(false);
      });
  }, []);

  const filtered = articles.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) || 
    (a.content && a.content.toLowerCase().includes(search.toLowerCase()))
  );

  const stats = {
    total: articles.length,
    critical: articles.filter(a => a.sentiment === 'negative').length,
    positive: articles.filter(a => a.sentiment === 'positive').length,
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
          <button className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
            <span>Analytics</span>
          </button>
          <button className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <span>Saved Intel</span>
          </button>
        </nav>
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
          <div style={{display: 'flex', gap: '1rem'}}>
            <div className="badge badge-source" style={{padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <div style={{width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)'}}></div>
              Engine Online
            </div>
          </div>
        </header>

        {/* Dashboard Widgets */}
        <section className="widgets-grid">
          <div className="widget-card">
            <span className="widget-title">Total Signals Ingested</span>
            <span className="widget-value">{loading ? '-' : stats.total}</span>
            <div className="widget-sparkline"></div>
          </div>
          <div className="widget-card">
            <span className="widget-title">Critical Alerts (AI)</span>
            <span className="widget-value" style={{color: 'var(--danger)'}}>{loading ? '-' : stats.critical}</span>
            <div className="widget-sparkline" style={{background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)'}}></div>
          </div>
          <div className="widget-card">
            <span className="widget-title">Positive Developments</span>
            <span className="widget-value" style={{color: 'var(--success)'}}>{loading ? '-' : stats.positive}</span>
            <div className="widget-sparkline" style={{background: 'linear-gradient(90deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)'}}></div>
          </div>
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
              <div key={i} className="article-card" onClick={() => setActiveArticle(article)} style={{animationDelay: `${i * 0.05}s`}}>
                <div className="card-tags">
                  <span className="badge badge-source">{article.source || 'Unknown'}</span>
                  <span className={`badge badge-sentiment ${article.sentiment}`}>
                    {article.sentiment === 'negative' ? 'High Risk' : article.sentiment === 'positive' ? 'Opportunity' : 'Neutral'}
                  </span>
                </div>
                <h3 className="card-title">{article.title}</h3>
                <p className="card-snippet">{article.content}</p>
                <div className="card-footer">
                  <span>{article.ai_tags.join(' • ')}</span>
                  <span>{article.published_at ? new Date(article.published_at).toLocaleDateString() : 'Just now'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Article Detail Modal */}
      {activeArticle && (
        <div className="modal-overlay" onClick={() => setActiveArticle(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveArticle(null)}>×</button>
            <div className="modal-meta">
              <span className="badge badge-source">{activeArticle.source}</span>
              <span className={`badge badge-sentiment ${activeArticle.sentiment}`}>{activeArticle.sentiment.toUpperCase()}</span>
            </div>
            <h2 className="modal-title">{activeArticle.title}</h2>
            <div className="modal-body">
              {activeArticle.content}
            </div>
            <a href={activeArticle.link} target="_blank" rel="noreferrer" className="modal-link">
              Read Full Intelligence Report
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
