import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'newsradar.db')

def get_db_connection():
    # If the db doesn't exist yet (Rust engine hasn't run), this will create an empty one
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/api/news', methods=['GET'])
def get_news():
    try:
        conn = get_db_connection()
        # Ensure table exists so we don't crash before Rust initializes it
        conn.execute('''
            CREATE TABLE IF NOT EXISTS articles (
                id INTEGER PRIMARY KEY,
                title TEXT NOT NULL,
                link TEXT NOT NULL UNIQUE,
                published_at TEXT,
                source TEXT,
                content TEXT
            )
        ''')
        
        # In a real scenario, we'd add pagination and filtering here
        articles = conn.execute('SELECT * FROM articles ORDER BY published_at DESC LIMIT 100').fetchall()
        conn.close()
        
        # Convert sqlite3.Row to dict
        return jsonify([dict(row) for row in articles])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "engine": "Python Flask (Open Core)"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
