'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // In a real environment, this connects to the local Flask API
    fetch('http://localhost:5000/api/news')
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setArticles(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("API error, falling back to empty state", err);
        setArticles([]);
        setError("Make sure the Rust core has fetched data and the Python Flask API is running on port 5000.");
        setLoading(false);
      });
  }, []);

  const filtered = articles.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) || 
    (a.content && a.content.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <main className="container">
      <header className="header">
        <h1 className="title">NewsRadar</h1>
        <p className="subtitle">Local-first open-source intelligence.</p>
      </header>

      <div className="controls">
        <div className="filter-group">
          <button className="filter-btn active">All Feed</button>
          <button className="filter-btn">Priority</button>
          <button className="filter-btn">Archived</button>
        </div>
        <input 
          type="text" 
          placeholder="Filter intelligence..." 
          className="search-input"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loader-wrapper">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="empty-state">
          <p>{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p>No intelligence gathered yet. Run the Rust core engine.</p>
        </div>
      ) : (
        <div className="grid">
          {filtered.map((article, i) => (
            <a key={i} href={article.link} target="_blank" rel="noreferrer" className="card">
              <div className="card-meta">
                <span>{article.source || 'Unknown Source'}</span>
                <span>{article.published_at ? new Date(article.published_at).toLocaleDateString() : 'Recent'}</span>
              </div>
              <h2 className="card-title">{article.title}</h2>
              <p className="card-snippet">{article.content}</p>
              <div className="card-link">
                Read full brief &rarr;
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}
