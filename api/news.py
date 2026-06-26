import os
import sqlite3
from flask import Flask, jsonify
from flask_cors import CORS
import feedparser

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}})

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'newsradar.db')

def fetch_live_rss():
    """Fallback scraper for Vercel Serverless environment where SQLite is not populated."""
    feeds = [
        ("TechCrunch", "https://techcrunch.com/feed/"),
        ("Reuters", "https://feeds.reuters.com/reuters/businessNews"),
    ]
    articles = []
    for source, url in feeds:
        parsed = feedparser.parse(url)
        for entry in parsed.entries[:5]: # take top 5 from each
            desc = entry.get('description', '')
            clean_desc = desc.replace('<p>', '').replace('</p>', '').replace('<br>', '').replace('<br/>', '')
            if len(clean_desc) > 200:
                clean_desc = clean_desc[:197] + '...'
            
            articles.append({
                "title": entry.get('title', 'No Title'),
                "link": entry.get('link', ''),
                "published_at": entry.get('published', ''),
                "source": source,
                "content": clean_desc
            })
    return articles

@app.route('/api/news', methods=['GET'])
def get_news():
    # Attempt to use local open-core SQLite database first
    if os.path.exists(DB_PATH):
        try:
            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
            articles = conn.execute('SELECT * FROM articles ORDER BY id DESC LIMIT 100').fetchall()
            conn.close()
            if len(articles) > 0:
                return jsonify([dict(row) for row in articles])
        except Exception as e:
            print("SQLite read error:", e)
            pass # Fall back to live RSS if DB fails

    # If DB doesn't exist (e.g. running on Vercel), fetch live data directly
    try:
        live_articles = fetch_live_rss()
        return jsonify(live_articles)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    mode = "Local Open Core" if os.path.exists(DB_PATH) else "Vercel Cloud Serverless"
    return jsonify({"status": "healthy", "mode": mode})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
