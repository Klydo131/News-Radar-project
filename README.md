# NewsRadar

**NewsRadar** is a powerful, local-first intelligence aggregator engineered for journalists, analysts, and anyone who demands total control over their information flow. 

Built on a robust open-core philosophy, it seamlessly merges the performance of Rust, the extensibility of Python, and the elegance of Next.js into a unified, secure system.

## The Architecture

### 1. Core Engine (`/core`)
Written in **Rust**, the core engine is responsible for the heavy lifting. It securely and concurrently ingests RSS feeds from across the globe, processing and storing them in a local SQLite database (`newsradar.db`). Rust ensures memory safety, preventing a massive class of exploits, and delivers unparalleled speed.

### 2. Open API Layer (`/api`)
Written in **Python (Flask)**, the API serves as the flexible bridge between your local data and the interface. Python was chosen specifically to empower the open-source community to easily plug in machine learning models, sentiment analysis, and NLP pipelines right into the core data stream.

### 3. Interface (`/web`)
Written in **Next.js**, the web interface provides a meticulously crafted, distraction-free reading experience. It uses deep minimalist aesthetics—refined typography, subtle depth, and smooth states—bringing clarity to complex data.

## Getting Started

Because NewsRadar is a true local-first system, your data never leaves your machine. 

### Prerequisites
- [Rust & Cargo](https://rustup.rs/) (For the Core Engine)
- [Python 3.8+](https://www.python.org/) (For the API)
- [Node.js & npm](https://nodejs.org/) (For the Web Interface)

### 1. Start the Core Engine
```bash
cd core
cargo run
```
*This will create the SQLite database and begin the secure ingestion loop.*

### 2. Start the API
```bash
cd api
pip install -r requirements.txt
python app.py
```
*The API will expose the ingested data on `http://localhost:5000`.*

### 3. Launch the Interface
```bash
cd web
npm install
npm run dev
```
*Open `http://localhost:3000` in your browser to experience NewsRadar.*

## Open Source Integrity

This project is structured to be instantly accessible to the open-source community. No complex startup scripts, no hidden build steps. Just clean, safe code that respects your machine and your privacy.

License: MIT
