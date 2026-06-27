import os
import sqlite3
import json
import urllib.request
import re
from flask import Flask, jsonify
from flask_cors import CORS
import feedparser

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}})

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'newsradar.db')

def upgrade_db_schema():
    """Ensure the SQLite articles table has the 'image' column to store real news thumbnails."""
    if os.path.exists(DB_PATH):
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            cursor.execute("PRAGMA table_info(articles)")
            cols = [row[1] for row in cursor.fetchall()]
            if 'image' not in cols:
                cursor.execute("ALTER TABLE articles ADD COLUMN image TEXT")
                conn.commit()
            conn.close()
        except Exception as e:
            print("Database schema upgrade error:", e)

def fetch_live_rss():
    """Fetch live data directly from WordPress REST API (TechCrunch) and RSS feeds (BBC & Reuters) with real image URLs."""
    articles = []
    
    # 1. Fetch TechCrunch via WordPress REST API to get authentic featured images
    try:
        req = urllib.request.Request(
            "https://techcrunch.com/wp-json/wp/v2/posts?per_page=10&_embed",
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        with urllib.request.urlopen(req, timeout=5) as response:
            posts = json.loads(response.read().decode('utf-8'))
            for post in posts:
                img_url = ""
                embedded = post.get("_embedded", {})
                featured_media = embedded.get("wp:featuredmedia", [])
                if featured_media and featured_media[0]:
                    img_url = featured_media[0].get("source_url", "")
                
                title = post.get("title", {}).get("rendered", "TechCrunch Update")
                # Clean HTML entity escapes
                clean_title = title.replace("&#8217;", "'").replace("&#8216;", "'").replace("&amp;", "&").replace("&#038;", "&").replace("&#8220;", '"').replace("&#8221;", '"').replace("&#8230;", "...")
                clean_title = re.sub(r'<[^>]*>', '', clean_title)
                
                desc = post.get("excerpt", {}).get("rendered", "") or post.get("content", {}).get("rendered", "")
                clean_desc = desc.replace("<p>", "").replace("</p>", "").replace("<br>", "").replace("<br/>", "")
                clean_desc = re.sub(r'<[^>]*>', '', clean_desc)
                clean_desc = clean_desc.replace("&#8217;", "'").replace("&#8216;", "'").replace("&amp;", "&").replace("&#038;", "&").replace("&#8220;", '"').replace("&#8221;", '"').replace("&#8230;", "...")
                if len(clean_desc) > 200:
                    clean_desc = clean_desc[:197] + '...'
                
                articles.append({
                    "title": clean_title,
                    "link": post.get("link", ""),
                    "published_at": post.get("date_gmt", "") or post.get("date", ""),
                    "source": "TechCrunch",
                    "content": clean_desc,
                    "image": img_url
                })
    except Exception as e:
        print("Error fetching TechCrunch WP posts in Python backend:", e)
        
    # 2. Fetch BBC News or Reuters via feedparser and extract thumbnails
    feeds = [
        ("BBC", "https://feeds.bbci.co.uk/news/world/rss.xml"),
        ("Reuters", "https://feeds.reuters.com/reuters/businessNews"),
    ]
    for source, url in feeds:
        try:
            parsed = feedparser.parse(url)
            for entry in parsed.entries[:5]:
                desc = entry.get('description', '')
                clean_desc = desc.replace('<p>', '').replace('</p>', '').replace('<br>', '').replace('<br/>', '')
                clean_desc = re.sub(r'<[^>]*>', '', clean_desc)
                if len(clean_desc) > 200:
                    clean_desc = clean_desc[:197] + '...'
                
                # Extract media thumbnail from feed parser
                img_url = ""
                thumb = entry.get('media_thumbnail')
                if thumb and isinstance(thumb, list) and len(thumb) > 0:
                    img_url = thumb[0].get('url', '')
                elif entry.get('enclosure'):
                    img_url = entry.get('enclosure', {}).get('href', '')
                
                articles.append({
                    "title": entry.get('title', 'No Title'),
                    "link": entry.get('link', ''),
                    "published_at": entry.get('published', ''),
                    "source": source,
                    "content": clean_desc,
                    "image": img_url
                })
        except Exception as e:
            print(f"Error fetching feed {source} in Python backend: {e}")
            
    return articles

@app.route('/api/news', methods=['GET'])
def get_news():
    upgrade_db_schema()
    
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
            pass

    # Fallback to direct live fetch
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
