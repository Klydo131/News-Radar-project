use anyhow::Result;
use rusqlite::{params, Connection};
use std::time::Duration;

#[tokio::main]
async fn main() -> Result<()> {
    println!("NewsRadar Core Engine Initializing...");
    
    // Connect to local SQLite DB
    let conn = Connection::open("../newsradar.db")?;
    
    // Initialize schema with the 'image' column
    conn.execute(
        "CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            link TEXT NOT NULL UNIQUE,
            published_at TEXT,
            source TEXT,
            content TEXT,
            image TEXT
        )",
        [],
    )?;
    
    println!("Database initialized securely.");
    println!("Ingesting real-time intelligence...");
    
    // Hardcoded feeds for demonstration
    let feeds = vec![
        ("TechCrunch", "https://techcrunch.com/feed/"),
        ("Reuters", "https://feeds.reuters.com/reuters/businessNews"),
    ];

    for (source, url) in feeds {
        if let Err(e) = fetch_and_store(&conn, source, url).await {
            eprintln!("Error fetching {}: {}", source, e);
        }
    }
    
    println!("Initial ingestion complete. You can now use the interface.");
    
    Ok(())
}

async fn fetch_and_store(conn: &Connection, source: &str, url: &str) -> Result<()> {
    let content = reqwest::get(url).await?.bytes().await?;
    let channel = rss::Channel::read_from(&content[..])?;

    for item in channel.items().iter().take(10) {
        let title = item.title().unwrap_or("No Title");
        let link = item.link().unwrap_or("");
        let pub_date = item.pub_date().unwrap_or("");
        let desc = item.description().unwrap_or("");
        
        // Simple HTML strip for description snippet
        let clean_desc = desc.replace("<p>", "").replace("</p>", "").replace("<br>", "").replace("<br/>", "");
        let snippet = if clean_desc.len() > 200 {
            format!("{}...", &clean_desc[0..197])
        } else {
            clean_desc
        };

        // Try to get enclosure image URL
        let mut img_url = String::new();
        if let Some(enclosure) = item.enclosure() {
            img_url = enclosure.url().to_string();
        }

        // Ignore unique constraint errors (duplicate links) silently
        let _ = conn.execute(
            "INSERT INTO articles (title, link, published_at, source, content, image) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            params![title, link, pub_date, source, snippet, img_url],
        );
    }
    println!("Successfully ingested data from {}", source);
    Ok(())
}
