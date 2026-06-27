'use client';

import { useState, useEffect, useRef } from 'react';

// Secure URL sanitizer to prevent DOM-based XSS exploits (javascript: or data: protocols)
const sanitizeUrl = (url) => {
  if (!url) return '#';
  const trimmed = url.trim();
  // Allow only standard web protocols: http:// or https://
  if (/^(https?:\/\/)/i.test(trimmed)) {
    return trimmed;
  }
  return '#';
};

// Highly Original OSINT Intelligence Dataset with custom cover images and source links
const INTEL_FEED_DB = [
  {
    id: 1,
    title: "Critical Zero-Day In OpenSSL Library Discovered; Patch Released Immediately",
    source: "Hacker News / SecurityWeek",
    link: "https://www.securityweek.com/emergency-openssl-patch/",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60",
    published_at: "10 mins ago",
    category: "Security & IT",
    content: "A high-severity memory leak vulnerability has been discovered in OpenSSL versions 3.0 to 3.2. If exploited, an attacker can bypass encryption layers. System administrators are urged to apply the 3.2.1 patch immediately.",
    sentiment: "negative",
    severityIndex: "CRITICAL",
    editorialLeanings: { left: 25, center: 50, right: 25 },
    sourceDiversity: { independent: 50, corporate: 30, statePublic: 20 },
    factuality: "High",
    sourceOwnership: "Non-profit / Open Source Trust",
    entities: ["OpenSSL", "CVE-2026-9872", "Cryptography", "Patch 3.2.1"],
    coordinates: { x: 48, y: 26 },
    isPolitical: false,
    virality: { score: 85, views: "1.4M", readers: "680K", shares: "42K", status: "Viral" },
    compareHeadlines: [
      { outlet: "Progressive Focus (MSNBC)", title: "Major Cryptographic Security Flaw Patched in OpenSSL Library" },
      { outlet: "Neutral Outlets (Reuters)", title: "OpenSSL Releases Emergency Security Fix Following Vulnerability Report" },
      { outlet: "Conservative Focus (Fox News)", title: "System Admins Warned: Upgrade OpenSSL Immediately to Avoid Data Leaks" }
    ],
    summaries: {
      exec: "A critical buffer over-read vulnerability exists in OpenSSL. Security patch version 3.2.1 resolves it. Organizations must patch systems immediately.",
      journalist: "Coverage is highly objective and technical across the board. Center-leaning sources focus on structural patching updates, while conservative outlets emphasize potential government and enterprise data leak risks.",
      student: "Excellent case study on cryptographic libraries and the vulnerability disclosure process. Key terms to research: Buffer over-read, memory leakage, OpenSSL, Open-source maintainer burn-out.",
      it: "Vulnerability CVE-2026-9872. Affects OpenSSL 3.0.x-3.2.x. Severity Score (CVSS): 8.8. Action: Upgrade binaries to 3.2.1. Run dependency check."
    }
  },
  {
    id: 2,
    title: "EU Enforces Landmark AI Regulatory Rules: High-Risk Systems Mandate Audit",
    source: "Reuters / TechCrunch",
    link: "https://www.reuters.com/technology/eu-artificial-intelligence-act-enforcement-2026/",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&auto=format&fit=crop&q=60",
    published_at: "1 hr ago",
    category: "Geopolitics",
    content: "The European Union's Artificial Intelligence Act officially enters its compliance phase today. It outlaws public biometric surveillance and requires independent compliance audits for high-impact models.",
    sentiment: "neutral",
    severityIndex: "ELEVATED",
    editorialLeanings: { left: 55, center: 30, right: 15 },
    sourceDiversity: { independent: 20, corporate: 60, statePublic: 20 },
    factuality: "High",
    sourceOwnership: "Corporate Conglomerate / Private Equity",
    entities: ["European Union", "AI Act", "Biometrics", "Compliance Auditing"],
    coordinates: { x: 48, y: 26 },
    isPolitical: true,
    virality: { score: 72, views: "920K", readers: "380K", shares: "18K", status: "Trending" },
    compareHeadlines: [
      { outlet: "Progressive Focus (The Guardian)", title: "EU Takes Historical Leap in Safeguarding Human Rights Against AI Risks" },
      { outlet: "Neutral Outlets (AP News)", title: "EU Artificial Intelligence Act Compliance Phase Begins Today" },
      { outlet: "Conservative Focus (Wall Street Journal)", title: "Burdensome Regulations: EU AI Act Hits Tech Firms with Massive Red Tape" }
    ],
    summaries: {
      exec: "The EU AI Act enters enforcement phase. Restricts biometric identification and imposes rigorous audits on generative models.",
      journalist: "Strong framing differences. Progressive sources highlight human rights protections and ethical AI guardrails, while conservative sources frame the rules as excessive regulation throttling tech startup innovation.",
      student: "Important reference for international policy and tech ethics. Study the concept of 'Risk-based classification' in regulation.",
      it: "Compliance impact: High-impact foundational models must run mandatory safety audits. Generative outputs require visible watermarking. Assess API usage guidelines."
    }
  },
  {
    id: 4,
    title: "Lawrence Livermore Lab Reports Net Energy Gain in Fusion Research",
    source: "MIT Tech Review / Nature",
    link: "https://www.nature.com/articles/d41586-026-fusion-ignition",
    image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=500&auto=format&fit=crop&q=60",
    published_at: "3 hrs ago",
    category: "Science & Research",
    content: "National Ignition Facility researchers successfully achieved scientific energy breakeven (Q > 1.2) for the third time, generating more energy from fusion than the laser energy input.",
    sentiment: "positive",
    severityIndex: "LOW",
    editorialLeanings: { left: 30, center: 60, right: 10 },
    sourceDiversity: { independent: 30, corporate: 10, statePublic: 60 },
    factuality: "High",
    sourceOwnership: "Public / State-funded Lab",
    entities: ["Livermore Lab", "Fusion Energy", "Q-Factor", "Clean Tech"],
    coordinates: { x: 22, y: 24 },
    isPolitical: false,
    virality: { score: 94, views: "3.1M", readers: "1.5M", shares: "120K", status: "Super-Viral" },
    compareHeadlines: [
      { outlet: "Progressive Focus (HuffPost)", title: "Clean Energy Revolution: Scientists Achieve Net Gain in Fusion Spark" },
      { outlet: "Neutral Outlets (AP News)", title: "Livermore Laboratory Reports Net Energy Breakeven in Fusion Test" },
      { outlet: "Conservative Focus (Washington Times)", title: "Government Fusion Project Hits Core Milestones but Commercialization Decades Away" }
    ],
    summaries: {
      exec: "Fusion energy breakeven achieved again with Q-factor exceeding 1.2. Validates inertial confinement fusion theories.",
      journalist: "Media reports are universally positive but show differing timelines. Progressive outlets focus on climate-change solutions, whereas conservative outlets emphasize the massive taxpayer costs and long timeline to commercialization.",
      student: "Key scientific concept: Q-factor (ratio of fusion energy output to laser input). Study Inertial Confinement Fusion vs. Magnetic Confinement (Tokamak).",
      it: "No immediate cybersecurity or hardware risk. High-performance computing clusters used for fusion modeling require massive data arrays."
    }
  },
  {
    id: 5,
    title: "Global Semiconductor Supply Chains Secure Alternate Sources for Critical Neon Gas",
    source: "Axios / Bloomberg",
    link: "https://www.bloomberg.com/news/articles/semiconductor-supply-neon-gas-facilities",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60",
    published_at: "6 hrs ago",
    category: "Market & Finance",
    content: "In response to geopolitical trade restrictions, semiconductor manufacturers have successfully established alternative refining facilities in Japan and South Korea, shielding chip fabrication from supply shocks.",
    sentiment: "positive",
    severityIndex: "LOW",
    editorialLeanings: { left: 20, center: 70, right: 10 },
    sourceDiversity: { independent: 10, corporate: 80, statePublic: 10 },
    factuality: "High",
    sourceOwnership: "Financial News Syndicate",
    entities: ["Semiconductors", "Neon Supply", "Geopolitics", "Lithography"],
    coordinates: { x: 75, y: 28 },
    isPolitical: true,
    virality: { score: 45, views: "310K", readers: "120K", shares: "5K", status: "Stable" },
    compareHeadlines: [
      { outlet: "Progressive Focus (MSNBC)", title: "Collaborative Global Efforts Protect Chip Supply from Geopolitical Crisis" },
      { outlet: "Neutral Outlets (Reuters)", title: "Chipmakers Relocate Neon Refining Hubs to Japan and South Korea" },
      { outlet: "Conservative Focus (Fox Business)", title: "Geopolitical Tensions Force Expensive Chip Supply Chain Redundancy" }
    ],
    summaries: {
      exec: "Semiconductor firms have secured alternate neon gas supply routes, mitigating supply chain risks.",
      journalist: "Objective coverage. Reports focus heavily on logistics and macroeconomics. Progressive outlets highlight international cooperation, while conservative outlets focus on capital expenditures.",
      student: "Case study on global supply chain vulnerabilities and economic geography. Study how gas refinement relates to lithography.",
      it: "Long-term hardware pricing stabilizer. Mitigates hardware procurement lead times for enterprise servers and GPUs."
    }
  }
];
;

export default function Home() {
  const [articles, setArticles] = useState(INTEL_FEED_DB);
  const [selectedArticle, setSelectedArticle] = useState(INTEL_FEED_DB[0]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [highFactualityOnly, setHighFactualityOnly] = useState(false);
  const [blindspotsOnly, setBlindspotsOnly] = useState(false);
  const [preferredCategories, setPreferredCategories] = useState(['Security & IT', 'Geopolitics', 'Science & Research', 'Market & Finance']);
  const [isSyncing, setIsSyncing] = useState(false);
  const [liveFeedBuffer, setLiveFeedBuffer] = useState([]);
  const bufferIndexRef = useRef(0);
  
  // Custom RSS sandbox state
  const [customFeedUrl, setCustomFeedUrl] = useState('');
  const [customFeedLoading, setCustomFeedLoading] = useState(false);
  const [customFeedResults, setCustomFeedResults] = useState(null);
  const [customFeedError, setCustomFeedError] = useState('');

  // AI Summary Switcher
  const [activeSummaryTab, setActiveSummaryTab] = useState('exec');

  // 3D Card Flip States (flipped state keyed by card ID)
  const [flippedCards, setFlippedCards] = useState({});
  const toggleFlip = (e, id) => {
    e.stopPropagation(); // Prevent card selection when flipping
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Diagnostics and System Status
  const [diagnostics, setDiagnostics] = useState({
    mode: 'Vercel Edge Cloud',
    apiHealth: 'Checking...',
    pingTime: 'Calculating...',
    inflowRate: '4.8 items/sec'
  });

  // Settings & Help Modals states
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [themeScheme, setThemeScheme] = useState('space-blue');
  const [layoutDensity, setLayoutDensity] = useState('comfortable');
  const [refreshRate, setRefreshRate] = useState('realtime');
  const [maxStories, setMaxStories] = useState(50);

  // UI styling state
  const [toastMessage, setToastMessage] = useState('');

  // Onboarding Tutorial State
  const [tutorialStep, setTutorialStep] = useState(0);
  const [spotlightStyle, setSpotlightStyle] = useState({ display: 'none' });
  const [tooltipStyle, setTooltipStyle] = useState({});

  // Refs for Tutorial Spotlights
  const biasCardRef = useRef(null);
  const personaTabsRef = useRef(null);
  const sandboxFormRef = useRef(null);
  const actionCenterRef = useRef(null);

  // Overhaul States: feedViewMode and Keyboard Command Palette
  const [feedViewMode, setFeedViewMode] = useState('card');
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [cmdSearch, setCmdSearch] = useState('');
  const [cmdSelectedIndex, setCmdSelectedIndex] = useState(0);

  // Nuclear scroll-lock effect: completely prevents browser window/body viewport auto-scrolling
  useEffect(() => {
    window.scrollTo(0, 0);
    const forceScrollReset = () => {
      if (window.scrollY !== 0 || window.scrollX !== 0) {
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener('scroll', forceScrollReset, { passive: true });
    window.addEventListener('resize', forceScrollReset, { passive: true });
    document.addEventListener('focusin', forceScrollReset, { capture: true, passive: true });
    return () => {
      window.removeEventListener('scroll', forceScrollReset);
      window.removeEventListener('resize', forceScrollReset);
      document.removeEventListener('focusin', forceScrollReset);
    };
  }, [tutorialStep]);

  // Command palette configuration list
  const commandOptions = [
    { label: "Switch Layout: High-Density Stream", action: () => setFeedViewMode('list'), shortcut: "L" },
    { label: "Switch Layout: Visual 3D cards", action: () => setFeedViewMode('card'), shortcut: "C" },
    { label: "Filter Category: Security & IT Intel", action: () => setActiveCategory('Security & IT'), shortcut: "S" },
    { label: "Filter Category: Geopolitics", action: () => setActiveCategory('Geopolitics'), shortcut: "G" },
    { label: "Filter Category: Science & Research", action: () => setActiveCategory('Science & Research'), shortcut: "R" },
    { label: "Filter Category: Market & Finance", action: () => setActiveCategory('Market & Finance'), shortcut: "M" },
    { label: "Open Settings Preferences Console", action: () => { setIsSettingsOpen(true); setIsCmdOpen(false); }, shortcut: "Ctrl+," },
    { label: "Open Help & Documentation Manual", action: () => { setIsHelpOpen(true); setIsCmdOpen(false); }, shortcut: "?" },
    { label: "Guided Onboarding Walkthrough", action: () => { setTutorialStep(1); setIsCmdOpen(false); }, shortcut: "T" },
    { label: "Verify RSS Custom Sandbox", action: () => {
      const sandboxInput = document.querySelector('.sandbox-input');
      if (sandboxInput) sandboxInput.focus();
      setIsCmdOpen(false);
    }, shortcut: "V" },
    { label: "Export Selected Report", action: () => { compileAndCopyReport(); setIsCmdOpen(false); }, shortcut: "E" }
  ];

  const filteredCommands = commandOptions.filter(opt => 
    opt.label.toLowerCase().includes(cmdSearch.toLowerCase())
  );

  const handleCommandSelect = (index) => {
    const cmd = filteredCommands[index];
    if (cmd) {
      cmd.action();
      setIsCmdOpen(false);
    }
  };

  const handleCommandKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCmdSelectedIndex(prev => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCmdSelectedIndex(prev => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleCommandSelect(cmdSelectedIndex);
    }
  };

  // Register keyboard handler for Ctrl+K, Ctrl+,, ?, and layout toggles
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Command palette: Ctrl+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCmdOpen(prev => {
          if (!prev) {
            setCmdSearch('');
            setCmdSelectedIndex(0);
          }
          return !prev;
        });
      }
      
      // Settings: Ctrl+,
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setIsSettingsOpen(prev => !prev);
      }

      // Help: ? (Shift + /)
      if (e.key === '?' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsHelpOpen(prev => !prev);
      }

      // Layout Switch: L for list, C for card
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        if (e.key.toLowerCase() === 'l') {
          setFeedViewMode('list');
        } else if (e.key.toLowerCase() === 'c') {
          setFeedViewMode('card');
        }
      }

      // Escape to close all overlays
      if (e.key === 'Escape') {
        setIsCmdOpen(false);
        setIsSettingsOpen(false);
        setIsHelpOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  const triggerManualSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setTimeout(() => {
      if (liveFeedBuffer.length > 0) {
        const idx = bufferIndexRef.current;
        const toAdd = { ...liveFeedBuffer[idx % liveFeedBuffer.length], id: Date.now() };
        bufferIndexRef.current = idx + 1;
        
        setArticles(prev => {
          if (prev.some(a => a.title === toAdd.title)) {
            setToastMessage("Feed synchronized. No new signals found.");
            setTimeout(() => setToastMessage(''), 2000);
            return prev;
          }
          setToastMessage(`🚨 New signal ingested: "${toAdd.title}"`);
          setTimeout(() => setToastMessage(''), 3000);
          return [toAdd, ...prev];
        });
      } else {
        // Fallback to real working hub URLs if buffer is empty
        const fallbackArticles = [
          {
            id: Date.now() + 10,
            title: "Cyber Security Infrastructure Upgrades Initiated Globally",
            source: "Wired",
            link: "https://www.wired.com/category/security/",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=60",
            published_at: "Just Now",
            category: "Security & IT",
            content: "National security agencies are deploying standard encryption framework updates across critical server infrastructure to protect public sector assets.",
            sentiment: "positive",
            severityIndex: "LOW",
            editorialLeanings: { left: 30, center: 50, right: 20 },
            sourceDiversity: { independent: 30, corporate: 50, statePublic: 20 },
            factuality: "High",
            sourceOwnership: "Corporate Publisher",
            entities: ["Infrastructure", "Encryption", "Cyber Guard"],
            coordinates: { x: 48, y: 26 },
            isPolitical: false,
            virality: { score: 65, views: "12K", readers: "5K", shares: "1.2K", status: "Stable" },
            compareHeadlines: [
              { outlet: "Progressive Focus", title: "Government security infrastructure gets critical safety updates" },
              { outlet: "Neutral Outlets", title: "National cyber agencies issue server hardening guidelines" },
              { outlet: "Conservative Focus", title: "Agencies push infrastructure modernization for threat mitigation" }
            ],
            summaries: {
              exec: "Global cyber defense agencies are initiating standard server hardening and encryption updates across major enterprise networks.",
              journalist: "Standard technology policy reporting focused on administrative details.",
              student: "Study modern server security frameworks and the lifecycle of cryptographic key distribution.",
              it: "Action: Deploy intrusion protection rules and verify standard server access controls."
            }
          },
          {
            id: Date.now() + 11,
            title: "Global Supply Corridors Negotiated Amid Market Volatility",
            source: "Bloomberg",
            link: "https://www.bloomberg.com/technology",
            image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=500&auto=format&fit=crop&q=60",
            published_at: "Just Now",
            category: "Market & Finance",
            content: "International trade ministries have established shipping corridors to guarantee raw material deliveries for microchip manufacturers.",
            sentiment: "neutral",
            severityIndex: "LOW",
            editorialLeanings: { left: 20, center: 60, right: 20 },
            sourceDiversity: { independent: 10, corporate: 80, statePublic: 10 },
            factuality: "High",
            sourceOwnership: "Financial News Network",
            entities: ["Supply Corridor", "Microchip Production", "Trade Ministry"],
            coordinates: { x: 120, y: 35 },
            isPolitical: true,
            virality: { score: 58, views: "8K", readers: "3K", shares: "600", status: "Stable" },
            compareHeadlines: [
              { outlet: "Progressive Focus", title: "International trade agreements protect chip manufacturing materials" },
              { outlet: "Neutral Outlets", title: "Ministries sign transit treaty for silicon supply routes" },
              { outlet: "Conservative Focus", title: "Bilateral trade corridors mitigate silicon material supply risks" }
            ],
            summaries: {
              exec: "Trade treaties have secured shipping lanes for semiconductor raw materials, reducing procurement delays.",
              journalist: "Objective reporting focus on resource economics and trade agreements.",
              student: "Examine key transit corridors and trace the geographical dependencies of microchip raw components.",
              it: "Audit logistics chain data links for secure transmission."
            }
          }
        ];
        
        setArticles(prev => {
          const available = fallbackArticles.filter(item => !prev.some(a => a.title === item.title));
          if (available.length === 0) {
            setToastMessage("Feed synchronized. No new signals found.");
            setTimeout(() => setToastMessage(''), 2000);
            return prev;
          }
          const toAdd = available[0];
          setToastMessage(`🚨 New signal ingested: "${toAdd.title}"`);
          setTimeout(() => setToastMessage(''), 3000);
          return [toAdd, ...prev];
        });
      }
      setIsSyncing(false);
    }, 1200);
  };

  // Fetch real articles from local backend if available (fallback to local high-fidelity list)
  useEffect(() => {
    window.scrollTo(0, 0);
    // Check if tutorial is completed
    const isTutorialDone = localStorage.getItem('nr_osint_tutorial_v1');
    if (!isTutorialDone) {
      setTimeout(() => setTutorialStep(1), 1200);
    }

    const startPing = performance.now();
    const apiUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api/news' : '/api/news';
    
    // Helper to extract real article images from RSS items or generate unique curated fallbacks
    const extractRSSImage = (item) => {
      if (item.image && typeof item.image === 'string' && item.image.startsWith('http')) {
        return item.image;
      }
      if (item.thumbnail && typeof item.thumbnail === 'string' && item.thumbnail.startsWith('http') && !item.thumbnail.includes('reuters.com/resources/r/')) {
        return item.thumbnail;
      }
      if (item.enclosure && item.enclosure.link && item.enclosure.link.startsWith('http')) {
        return item.enclosure.link;
      }
      // Parse img tags from description/content
      const descHtml = item.description || '';
      const descImgMatch = descHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (descImgMatch && descImgMatch[1]) {
        return descImgMatch[1];
      }
      const contentHtml = item.content || '';
      const contentImgMatch = contentHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (contentImgMatch && contentImgMatch[1]) {
        return contentImgMatch[1];
      }
      // Variety of curated high-quality fallbacks based on title hash so they never look identical
      const fallbackImages = [
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=60", // Server nodes
        "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&auto=format&fit=crop&q=60", // Code screen
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&auto=format&fit=crop&q=60", // Cyber lock
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=60", // Geopolitics Globe
        "https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=500&auto=format&fit=crop&q=60", // Polar route
        "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=500&auto=format&fit=crop&q=60", // Tech workspace
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=60", // Hardware servers
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&auto=format&fit=crop&q=60", // Neural networks
        "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=500&auto=format&fit=crop&q=60", // Finance stocks
        "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=500&auto=format&fit=crop&q=60"  // Space orbit
      ];
      const titleStr = item.title || "";
      const hash = titleStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return fallbackImages[hash % fallbackImages.length];
    };

    // Function to parse and format RSS items into rich threat signals
    const formatRSSItem = (item, idx, source, category) => {
      const seed = idx + (source === 'BBC' ? 200 : 100);
      const left = Math.floor(Math.sin(seed) * 30 + 40);
      const right = Math.floor(Math.cos(seed) * 25 + 30);
      const center = 100 - left - right;
      
      const scoreVal = Math.floor(Math.abs(Math.sin(seed)) * 60 + 35);
      const statusVal = scoreVal > 80 ? "Viral" : scoreVal > 55 ? "Trending" : "Stable";
      const viewsVal = (scoreVal * 12.5).toFixed(0) + "K";
      const readersVal = (scoreVal * 5.2).toFixed(0) + "K";
      const sharesVal = (scoreVal * 1.8).toFixed(0) + "K";
      
      const severityIndex = idx % 4 === 0 ? "CRITICAL" : idx % 3 === 0 ? "ELEVATED" : "LOW";
      const isPol = category === 'Geopolitics' || item.title.toLowerCase().match(/(eu|union|policy|rules|court|law|regulat|governm|president|senate|congress|election|treaty|border|naval|military|conflict)/i) ? true : false;

      // Coordinates mapping to real hotspots:
      let coords = { x: 48, y: 26 }; // default Europe
      if (category === 'Security & IT') {
        coords = idx % 3 === 0 ? { x: 30, y: 32 } : idx % 3 === 1 ? { x: 100, y: 22 } : { x: 165, y: 35 };
      } else {
        coords = idx % 3 === 0 ? { x: 118, y: 48 } : idx % 3 === 1 ? { x: 105, y: 28 } : { x: 155, y: 42 };
      }

      return {
        id: seed,
        title: item.title,
        source: source,
        link: item.link,
        image: extractRSSImage(item),
        published_at: item.pubDate ? new Date(item.pubDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + " today" : "Recent",
        category: category,
        content: item.description ? item.description.replace(/<[^>]*>/g, '').substring(0, 180) + '...' : item.content ? item.content.replace(/<[^>]*>/g, '').substring(0, 180) + '...' : "Live intelligence update.",
        sentiment: left > right ? "positive" : "negative",
        severityIndex: severityIndex,
        editorialLeanings: { left, center, right },
        sourceDiversity: { independent: 20, corporate: 70, statePublic: 20 },
        factuality: "High",
        sourceOwnership: source === 'BBC' ? "Publicly Funded Broadcasting" : "Corporate Conglomerate",
        entities: ["Live RSS Ingest", source, category],
        coordinates: coords,
        isPolitical: isPol,
        virality: { score: scoreVal, views: viewsVal, readers: readersVal, shares: sharesVal, status: statusVal },
        compareHeadlines: [
          { outlet: "Progressive Focus", title: item.title },
          { outlet: "Neutral Outlets", title: item.title },
          { outlet: "Conservative Focus", title: item.title }
        ],
        summaries: {
          exec: item.description ? item.description.replace(/<[^>]*>/g, '').substring(0, 300) : "Live feed content.",
          journalist: `Standard reporting by ${source}. Highly objective and sourced directly from regional correspondents.`,
          student: "Examine key structural events, institutional announcements, and their policy impact.",
          it: category === 'Security & IT' ? "Technical disclosure. Audit active system configurations and dependencies immediately." : "Assess logistical security parameters and border telemetry logs."
        }
      };
    };

    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        const endPing = performance.now();
        const latency = `${Math.round(endPing - startPing)}ms`;
        
        if (data && Array.isArray(data) && data.length > 0) {
          const enriched = data.map((item, idx) => formatRSSItem(item, idx, item.source || "RSS Ingest", idx % 2 === 0 ? "Security & IT" : "Geopolitics"));
          setArticles(enriched);
          if (enriched.length > 0) setSelectedArticle(enriched[0]);
          setDiagnostics(prev => ({
            ...prev,
            apiHealth: 'Operational',
            pingTime: latency
          }));
        } else {
          throw new Error("No database articles");
        }
      })
      .catch(err => {
        console.log("Local backend connection skipped or unavailable, loading cloud feeds directly from browser...");
        
        const decodeHtml = (html) => {
          if (!html) return "";
          return html
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&#039;/g, "'")
            .replace(/&#8217;/g, "'")
            .replace(/&#8216;/g, "'")
            .replace(/&#8220;/g, '"')
            .replace(/&#8221;/g, '"')
            .replace(/&#8230;/g, "...")
            .replace(/&#038;/g, "&");
        };

        const tcUrl = "https://techcrunch.com/wp-json/wp/v2/posts?per_page=15&_embed";
        const bbcUrl = "https://api.rss2json.com/v1/api.json?rss_url=https://feeds.bbci.co.uk/news/world/rss.xml";
        
        Promise.all([
          fetch(tcUrl).then(r => r.json()).catch(() => []),
          fetch(bbcUrl).then(r => r.json()).catch(() => ({ status: 'fail' }))
        ]).then(([tcData, bbcData]) => {
          let tcItems = Array.isArray(tcData) ? tcData : [];
          let bbcItems = (bbcData.status === 'ok' && Array.isArray(bbcData.items)) ? bbcData.items : [];
          
          if (tcItems.length === 0 && bbcItems.length === 0) {
            console.log("Both feeds failed, using static database.");
            setDiagnostics(prev => ({
              ...prev,
              apiHealth: 'Offline (Using Edge DB)',
              pingTime: 'N/A'
            }));
            return;
          }

          const tcEnriched = tcItems.map((post, idx) => {
            let imgUrl = "";
            if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
              imgUrl = post._embedded['wp:featuredmedia'][0].source_url;
            }
            
            const rawTitle = post.title?.rendered || "TechCrunch Update";
            const cleanTitle = decodeHtml(rawTitle.replace(/<[^>]*>/g, ''));
            
            const rawDesc = post.excerpt?.rendered || post.content?.rendered || "";
            const cleanDesc = decodeHtml(rawDesc.replace(/<[^>]*>/g, ''));
            
            const dummyItem = {
              title: cleanTitle,
              link: post.link,
              thumbnail: imgUrl,
              pubDate: post.date_gmt || post.date,
              description: cleanDesc,
              content: cleanDesc
            };
            return formatRSSItem(dummyItem, idx, "TechCrunch", "Security & IT");
          });
          
          const bbcEnriched = bbcItems.map((item, idx) => {
            const cleanTitle = decodeHtml(item.title || "");
            const cleanDesc = decodeHtml(item.description || "");
            const cleanedItem = {
              ...item,
              title: cleanTitle,
              description: cleanDesc,
              content: cleanDesc
            };
            return formatRSSItem(cleanedItem, idx, "BBC", "Geopolitics");
          });
          
          const merged = [];
          const maxLen = Math.max(tcEnriched.length, bbcEnriched.length);
          for (let i = 0; i < maxLen; i++) {
            if (i < tcEnriched.length) merged.push(tcEnriched[i]);
            if (i < bbcEnriched.length) merged.push(bbcEnriched[i]);
          }

          const initialFeed = merged.slice(0, 8);
          const buffer = merged.slice(8);
          
          setArticles(initialFeed);
          setLiveFeedBuffer(buffer);
          if (initialFeed.length > 0) {
            setSelectedArticle(initialFeed[0]);
          }

          setDiagnostics(prev => ({
            ...prev,
            apiHealth: 'Operational (Live Cloud Feed)',
            pingTime: '145ms'
          }));
        }).catch(allErr => {
          console.log("Error loading cloud feeds:", allErr);
          setDiagnostics(prev => ({
            ...prev,
            apiHealth: 'Offline (Using Edge DB)',
            pingTime: 'N/A'
          }));
        });
      });
  }, []);

  // Background simulated news ingestion based on refreshRate
  useEffect(() => {
    if (refreshRate === 'none') return;
    
    // Determine interval time based on refreshRate setting: realtime=15s, 5m=45s, 15m=90s
    const intervalTime = refreshRate === 'realtime' ? 15000 : refreshRate === '5m' ? 45000 : 90000;
    
    const interval = setInterval(() => {
      if (liveFeedBuffer.length > 0) {
        const idx = bufferIndexRef.current;
        const newArticle = { ...liveFeedBuffer[idx % liveFeedBuffer.length], id: Date.now() };
        bufferIndexRef.current = idx + 1;
        
        setArticles(prev => {
          if (prev.some(a => a.title === newArticle.title)) return prev;
          const updated = [newArticle, ...prev];
          setToastMessage(`🚨 New signal ingested: "${newArticle.title}"`);
          setTimeout(() => setToastMessage(''), 3000);
          return updated;
        });
      } else {
        // Fallback to real working hub URLs if buffer is empty
        const templates = [
          {
            id: Date.now() + 1,
            title: "Cyber Security Infrastructure Upgrades Initiated Globally",
            source: "Wired",
            link: "https://www.wired.com/category/security/",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=60",
            published_at: "Just Now",
            category: "Security & IT",
            content: "National security agencies are deploying standard encryption framework updates across critical server infrastructure to protect public sector assets.",
            sentiment: "positive",
            severityIndex: "LOW",
            editorialLeanings: { left: 30, center: 50, right: 20 },
            sourceDiversity: { independent: 30, corporate: 50, statePublic: 20 },
            factuality: "High",
            sourceOwnership: "Corporate Publisher",
            entities: ["Infrastructure", "Encryption", "Cyber Guard"],
            coordinates: { x: 48, y: 26 },
            isPolitical: false,
            virality: { score: 65, views: "12K", readers: "5K", shares: "1.2K", status: "Stable" },
            compareHeadlines: [
              { outlet: "Progressive Focus", title: "Government security infrastructure gets critical safety updates" },
              { outlet: "Neutral Outlets", title: "National cyber agencies issue server hardening guidelines" },
              { outlet: "Conservative Focus", title: "Agencies push infrastructure modernization for threat mitigation" }
            ],
            summaries: {
              exec: "Global cyber defense agencies are initiating standard server hardening and encryption updates across major enterprise networks.",
              journalist: "Standard technology policy reporting focused on administrative details.",
              student: "Study modern server security frameworks and the lifecycle of cryptographic key distribution.",
              it: "Action: Deploy intrusion protection rules and verify standard server access controls."
            }
          },
          {
            id: Date.now() + 2,
            title: "Global Supply Corridors Negotiated Amid Market Volatility",
            source: "Bloomberg",
            link: "https://www.bloomberg.com/technology",
            image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=500&auto=format&fit=crop&q=60",
            published_at: "Just Now",
            category: "Market & Finance",
            content: "International trade ministries have established shipping corridors to guarantee raw material deliveries for microchip manufacturers.",
            sentiment: "neutral",
            severityIndex: "LOW",
            editorialLeanings: { left: 20, center: 60, right: 20 },
            sourceDiversity: { independent: 10, corporate: 80, statePublic: 10 },
            factuality: "High",
            sourceOwnership: "Financial News Network",
            entities: ["Supply Corridor", "Microchip Production", "Trade Ministry"],
            coordinates: { x: 120, y: 35 },
            isPolitical: true,
            virality: { score: 58, views: "8K", readers: "3K", shares: "600", status: "Stable" },
            compareHeadlines: [
              { outlet: "Progressive Focus", title: "International trade agreements protect chip manufacturing materials" },
              { outlet: "Neutral Outlets", title: "Ministries sign transit treaty for silicon supply routes" },
              { outlet: "Conservative Focus", title: "Bilateral trade corridors mitigate silicon material supply risks" }
            ],
            summaries: {
              exec: "Trade treaties have secured shipping lanes for semiconductor raw materials, reducing procurement delays.",
              journalist: "Objective reporting focus on resource economics and trade agreements.",
              student: "Examine key transit corridors and trace the geographical dependencies of microchip raw components.",
              it: "Audit logistics chain data links for secure transmission."
            }
          }
        ];
        const newArticle = templates[Math.floor(Math.random() * templates.length)];
        setArticles(prev => {
          if (prev.some(a => a.title === newArticle.title)) return prev;
          const updated = [newArticle, ...prev];
          setToastMessage(`🚨 New signal ingested: "${newArticle.title}"`);
          setTimeout(() => setToastMessage(''), 3000);
          return updated;
        });
      }
    }, intervalTime);
    
    return () => clearInterval(interval);
  }, [refreshRate, liveFeedBuffer]);

  // Apply theme class and layout density class dynamically to body
  useEffect(() => {
    // Remove other theme classes
    document.body.classList.remove('theme-space-blue', 'theme-cyber-amber', 'theme-radar-green', 'theme-polar-light');
    document.body.classList.add(`theme-${themeScheme}`);
    
    // Toggle density class
    document.body.classList.toggle('density-compact', layoutDensity === 'compact');
  }, [themeScheme, layoutDensity]);

  // Dynamic Spotlight Tutorial Positioning
  useEffect(() => {
    if (tutorialStep === 0) {
      setSpotlightStyle({ display: 'none' });
      window.scrollTo(0, 0); // Force scroll position reset when tutorial closes
      return;
    }

    const updateSpotlight = () => {
      let target = null;
      let placement = 'bottom';

      if (tutorialStep === 1) {
        target = biasCardRef.current;
        placement = 'left';
      } else if (tutorialStep === 2) {
        target = personaTabsRef.current;
        placement = 'left';
      } else if (tutorialStep === 3) {
        target = sandboxFormRef.current;
        placement = 'right';
      } else if (tutorialStep === 4) {
        target = actionCenterRef.current;
        placement = 'top';
      }

      if (target) {
        // Scroll target within parent container instead of calling window scrollIntoView
        const parentPanel = target.closest('.analysis-panel') || target.closest('.custom-scroll');
        if (parentPanel) {
          const parentRect = parentPanel.getBoundingClientRect();
          const targetRect = target.getBoundingClientRect();
          parentPanel.scrollTop += (targetRect.top - parentRect.top) - (parentRect.height / 2) + (targetRect.height / 2);
        } else {
          target.scrollIntoView({ behavior: 'auto', block: 'center' });
        }
      }

      // Check if target is visible in the current layout
      const isVisible = target && target.getBoundingClientRect().width > 0;

      if (isVisible) {
        const rect = target.getBoundingClientRect();
        const padding = 8;
        
        setSpotlightStyle({
          top: rect.top - padding + window.scrollY,
          left: rect.left - padding + window.scrollX,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2,
          display: 'block'
        });

        // Calculate responsive tooltip coordinates
        let top = rect.bottom + 15;
        let left = rect.left + (rect.width / 2) - 160;

        if (placement === 'left') {
          if (rect.left > 340) {
            top = rect.top + (rect.height / 2) - 100;
            left = rect.left - 340;
          } else {
            top = rect.bottom + 15;
            left = Math.max(10, rect.left);
          }
        } else if (placement === 'right') {
          if (window.innerWidth - rect.right > 340) {
            top = rect.top;
            left = rect.right + 20;
          } else {
            top = rect.bottom + 15;
            left = Math.max(10, rect.left - 160);
          }
        } else if (placement === 'top') {
          if (rect.top > 220) {
            top = rect.top - 200;
            left = rect.left + (rect.width / 2) - 160;
          } else {
            top = rect.bottom + 15;
            left = rect.left + (rect.width / 2) - 160;
          }
        }

        // Keep inside screen boundaries
        left = Math.max(10, Math.min(window.innerWidth - 330, left));
        top = Math.max(10, Math.min(window.innerHeight - 250, top));

        setTooltipStyle({
          position: 'absolute',
          top: `${top}px`,
          left: `${left}px`,
          transform: 'none',
        });
      } else {
        // Fallback: Hide spotlight and show tooltip centered like a modal
        setSpotlightStyle({ display: 'none' });
        setTooltipStyle({
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          margin: 0,
        });
      }
    };

    updateSpotlight();
    window.addEventListener('resize', updateSpotlight);
    return () => window.removeEventListener('resize', updateSpotlight);
  }, [tutorialStep, selectedArticle]);

  // Handle tutorial nav
  const handleTutorialNext = () => {
    if (tutorialStep >= 4) {
      localStorage.setItem('nr_osint_tutorial_v1', 'completed');
      setTutorialStep(0);
    } else {
      setTutorialStep(prev => prev + 1);
    }
  };

  const tutorialMessages = [
    null,
    { title: "Editorial Spectrum Analytics", desc: "This visualizes the editorial stances of reporting outlets. It maps how progressive vs conservative sources allocate coverage to this specific story." },
    { title: "Multi-Angle AI Summaries", desc: "Pivots the text analysis on-the-fly. Switch tabs to view specific summaries for journalists, students, or IT-centric vulnerability reports." },
    { title: "Ingestion Sandbox & Verification", desc: "Verify new intelligence feeds instantly. Input a public RSS link to verify and test structure client-side without CPU bottlenecks." },
    { title: "OSINT Report Compiler", desc: "Export citations and compile comprehensive markdown reports directly to your local researcher clipboard." }
  ];

  // Run Custom RSS Sandbox test client-side (no performance bottleneck)
  const handleRssTest = (e) => {
    e.preventDefault();
    if (!customFeedUrl) return;

    setCustomFeedLoading(true);
    setCustomFeedError('');
    setCustomFeedResults(null);

    // Using AllOrigins CORS proxy to parse client-side
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(customFeedUrl)}`;

    fetch(proxyUrl)
      .then(res => {
        if (!res.ok) throw new Error("Network response error. Ensure URL is correct.");
        return res.text();
      })
      .then(xmlText => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        
        const parseError = xmlDoc.getElementsByTagName("parsererror");
        if (parseError.length > 0) {
          throw new Error("Invalid RSS XML file structure.");
        }

        const channelTitle = xmlDoc.querySelector("channel > title")?.textContent || "Unknown Channel";
        const items = xmlDoc.getElementsByTagName("item");
        const articlesList = [];

        for (let i = 0; i < Math.min(items.length, 3); i++) {
          const itemTitle = items[i].querySelector("title")?.textContent || "No Title";
          const itemLink = items[i].querySelector("link")?.textContent || "#";
          articlesList.push({ title: itemTitle, link: itemLink });
        }

        setCustomFeedResults({
          channelTitle,
          itemsCount: items.length,
          preview: articlesList
        });
        setCustomFeedLoading(false);
      })
      .catch(err => {
        setCustomFeedError(err.message || "Failed to fetch and parse feed.");
        setCustomFeedLoading(false);
      });
  };

  // Compile and Export Markdown report
  const compileAndCopyReport = () => {
    if (!selectedArticle) return;
    
    const doc = `
# OSINT Intelligence Report: ${selectedArticle.title}
*   **Ingestion Source:** ${selectedArticle.source}
*   **Category:** ${selectedArticle.category}
*   **Factuality Index:** ${selectedArticle.factuality}
*   **Editorial Leanings:** Progressive ${selectedArticle.editorialLeanings.left}%, Neutral ${selectedArticle.editorialLeanings.center}%, Conservative ${selectedArticle.editorialLeanings.right}%
*   **Source Diversity:** Independent ${selectedArticle.sourceDiversity.independent}%, Corporate ${selectedArticle.sourceDiversity.corporate}%, Public/State ${selectedArticle.sourceDiversity.statePublic}%
*   **Ownership Model:** ${selectedArticle.sourceOwnership}

## AI Executive Summary
${selectedArticle.summaries.exec}

## Media Analysis & Framing (Journalist Perspective)
${selectedArticle.summaries.journalist}

## IT & Infrastructure Vulnerability Implications
${selectedArticle.summaries.it}

## Citations
*   APA: ${selectedArticle.source}. (${new Date().getFullYear()}). *${selectedArticle.title}*. Retrieved from ${selectedArticle.content.substring(0, 40)}...
    `;
    
    navigator.clipboard.writeText(doc.trim());
    setToastMessage("Report copied to clipboard!");
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Compile and copy citation
  const compileCitation = () => {
    if (!selectedArticle) return;
    const citation = `"${selectedArticle.title}." ${selectedArticle.source}. Web. ${new Date().toLocaleDateString()}.`;
    navigator.clipboard.writeText(citation);
    setToastMessage("APA/MLA Citation copied!");
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Filter logic
  const filtered = articles.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || 
                          a.content.toLowerCase().includes(search.toLowerCase()) || 
                          a.entities.some(e => e.toLowerCase().includes(search.toLowerCase()));
                          
    const matchesCategory = activeCategory === 'All' ? preferredCategories.includes(a.category) : a.category === activeCategory;
    const matchesFactuality = highFactualityOnly ? a.factuality === 'High' : true;
    
    // Blindspots: e.g. Left blindspot (high right bias coverage, low left) or vice versa
    const matchesBlindspot = blindspotsOnly 
      ? (a.editorialLeanings.left > 50 && a.editorialLeanings.right < 20) || (a.editorialLeanings.right > 50 && a.editorialLeanings.left < 20)
      : true;
      
    return matchesSearch && matchesCategory && matchesFactuality && matchesBlindspot;
  });

  return (
    <>
      <div className="mesh-bg"></div>
      <div className="grid-overlay"></div>

      <div className="app-layout">
        
        {/* Column 1: Control Panel & Status */}
        <aside className="left-panel">
          <div className="brand-section" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div className="logo-container" style={{ position: 'relative', overflow: 'hidden', width: '38px', height: '38px', background: 'transparent', boxShadow: 'none' }}>
              {/* Outer Ring & sweep SVG */}
              <svg width="38" height="38" viewBox="0 0 40 40" style={{ position: 'absolute', inset: 0 }}>
                <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(99, 102, 241, 0.25)" strokeWidth="1" />
                <circle cx="20" cy="20" r="12" fill="none" stroke="rgba(99, 102, 241, 0.15)" strokeWidth="1" />
                <circle cx="20" cy="20" r="6" fill="none" stroke="rgba(99, 102, 241, 0.1)" strokeWidth="1" />
                {/* Scanner sweep line */}
                <line x1="20" y1="20" x2="20" y2="2" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" style={{ transformOrigin: '20px 20px', animation: 'spinSweep 4s linear infinite' }} />
              </svg>
              {/* Blinking center dot */}
              <div style={{ position: 'absolute', top: '17px', left: '17px', width: '6px', height: '6px', background: '#fff', borderRadius: '50%', boxShadow: '0 0 8px #fff' }}></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="brand-title" style={{ fontSize: '1.2rem', lineHeight: 1.1 }}>NewsRadar</span>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Open-Source OSINT</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            <button className="nav-link active">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              <span>Intelligence Center</span>
            </button>
            <button className="nav-link" onClick={() => setThemeScheme(t => t === 'polar-light' ? 'space-blue' : 'polar-light')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {themeScheme === 'polar-light' ? <circle cx="12" cy="12" r="5"></circle> : <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>}
              </svg>
              <span>{themeScheme === 'polar-light' ? 'Dark Theme' : 'Light Theme'}</span>
            </button>
            <button className="nav-link" onClick={() => setIsSettingsOpen(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              <span>System Settings</span>
            </button>
            <button className="nav-link" onClick={() => setIsHelpOpen(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              <span>Help & Manual</span>
            </button>
            <button className="nav-link" onClick={() => setTutorialStep(1)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span>Onboarding Help</span>
            </button>

            {/* Enterprise OSINT metadata tags */}
            <div className="osint-identity-grid">
              <div className="osint-tag-pill">
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 6px var(--accent)' }}></span>
                <span>v2.4.0-OSS</span>
              </div>
              <div className="osint-tag-pill">
                <span>Node: Edge APAC-EAST</span>
              </div>
              <div className="osint-tag-pill">
                <span>Sig Inbound: 4.8 Hz</span>
              </div>
            </div>
          </nav>

          {/* System Monitor Widget */}
          <div className="monitor-widget">
            <div className="monitor-header">
              <span>Edge Status Monitor</span>
              <div className="pulse-dot"></div>
            </div>
            <div className="monitor-item">
              <span>Routing Node:</span>
              <span>{diagnostics.mode}</span>
            </div>
            <div className="monitor-item">
              <span>Local API Stack:</span>
              <span style={{color: diagnostics.apiHealth.includes('Operational') ? 'var(--success)' : 'var(--text-muted)'}}>{diagnostics.apiHealth}</span>
            </div>
            <div className="monitor-item">
              <span>Ping Latency:</span>
              <span>{diagnostics.pingTime}</span>
            </div>
            <div className="monitor-item">
              <span>Signal Inflow:</span>
              <span>{diagnostics.inflowRate}</span>
            </div>
          </div>

          {/* RSS Custom Sandbox (IT/Journalist Custom Feed Tester) */}
          <div className="rss-sandbox" ref={sandboxFormRef}>
            <div className="sandbox-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle></svg>
              <span>RSS Ingestion Sandbox</span>
            </div>
            <form onSubmit={handleRssTest} className="sandbox-form">
              <div className="sandbox-input-wrapper">
                <input 
                  type="text" 
                  className="sandbox-input" 
                  placeholder="Paste public RSS feed url..." 
                  value={customFeedUrl}
                  onChange={e => setCustomFeedUrl(e.target.value)}
                />
                <button type="submit" className="sandbox-btn">
                  {customFeedLoading ? '...' : 'Verify'}
                </button>
              </div>
            </form>

            {customFeedError && (
              <div className="sandbox-result" style={{color: 'var(--danger)'}}>
                Error: {customFeedError}
              </div>
            )}

            {customFeedResults && (
              <div className="sandbox-result">
                <div style={{color: 'var(--success)', fontWeight: 'bold', marginBottom: '0.2rem'}}>✓ Ingestion Verified</div>
                <div style={{color: 'var(--text-main)', fontWeight: 600}}>{customFeedResults.channelTitle}</div>
                <div style={{color: 'var(--text-muted)'}}>{customFeedResults.itemsCount} stories parsed. Previewing:</div>
                <ul style={{marginTop: '0.4rem', listStyle: 'none', paddingLeft: 0}}>
                  {customFeedResults.preview.map((p, idx) => (
                    <li key={idx} style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.65rem'}}>
                      • <a href={sanitizeUrl(p.link)} target="_blank" rel="noopener noreferrer" style={{color: 'var(--accent)'}}>{p.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>

        {/* Column 2: Feed Stream (Center) */}
        <section className="center-feed">
          <header className="feed-header">
            <div className="search-bar-container" onClick={() => setIsCmdOpen(true)} style={{ cursor: 'pointer' }}>
              <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <span className="search-input-field" style={{ color: search ? 'var(--text-main)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>
                {search || "Search signals, tags, or press Ctrl+K to access Command Center..."}
              </span>
              <kbd style={{ fontSize: '0.65rem', background: 'var(--panel-border)', padding: '0.2rem 0.45rem', borderRadius: '4px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginLeft: 'auto', border: '1px solid rgba(255,255,255,0.05)' }}>Ctrl+K</kbd>
            </div>
            
            <div className="filters-row">
              <div className="category-pills">
                {['All', 'Security & IT', 'Geopolitics', 'Science & Research', 'Market & Finance'].map(cat => (
                  <button 
                    key={cat} 
                    className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="switches-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
                <label className="switch-label">
                  <input 
                    type="checkbox" 
                    checked={highFactualityOnly} 
                    onChange={e => setHighFactualityOnly(e.target.checked)}
                  />
                  <span>High Factuality</span>
                </label>
                <label className="switch-label">
                  <input 
                    type="checkbox" 
                    checked={blindspotsOnly} 
                    onChange={e => setBlindspotsOnly(e.target.checked)}
                  />
                  <span>Blindspots</span>
                </label>

                {/* Manual Ingestion Sync Button */}
                <button 
                  type="button"
                  className="category-pill"
                  onClick={triggerManualSync}
                  style={{ 
                    marginRight: '0.25rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.35rem', 
                    height: '28px', 
                    padding: '0 0.6rem',
                    fontSize: '0.75rem',
                    border: '1px solid var(--panel-border)',
                    background: 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    color: 'var(--text-main)'
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={isSyncing ? "spin-animation" : ""}><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                  <span>Sync Ingest</span>
                </button>

                {/* View Layout Switcher */}
                <div className="view-toggle-bar" style={{ marginLeft: '0.5rem' }}>
                  <button 
                    type="button"
                    className={`view-toggle-btn ${feedViewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setFeedViewMode('list')}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                    <span>Stream</span>
                  </button>
                  <button 
                    type="button"
                    className={`view-toggle-btn ${feedViewMode === 'card' ? 'active' : ''}`}
                    onClick={() => setFeedViewMode('card')}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
                    <span>Cards</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Industry Standard News Feed - Toggleable View Mode */}
          {feedViewMode === 'list' ? (
            /* High-Density Analyst Stream (List View) */
            <div className="news-stream custom-scroll analyst-stream" style={{ padding: '1.5rem 2rem' }}>
              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No signals matching your search criteria.
                </div>
              ) : (
                filtered.map(article => {
                  const totalBias = article.editorialLeanings.left + article.editorialLeanings.center + article.editorialLeanings.right;
                  return (
                    <div 
                      key={article.id} 
                      className={`list-item-row severity-${article.severityIndex} ${selectedArticle?.id === article.id ? 'active' : ''}`}
                      onClick={() => setSelectedArticle(article)}
                    >
                      <div className="list-item-content">
                        <div className="list-item-header">
                          <a 
                            href={sanitizeUrl(article.link || '#')} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="source-badge"
                            onClick={(e) => e.stopPropagation()}
                            style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '0.25rem',
                              textDecoration: 'none',
                              color: 'var(--accent)',
                              background: 'rgba(99, 102, 241, 0.1)',
                              border: '1px solid rgba(99, 102, 241, 0.2)',
                              borderRadius: '4px',
                              padding: '0.15rem 0.4rem',
                              fontWeight: 'bold',
                              cursor: 'pointer'
                            }}
                          >
                            <span>{article.source}</span>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                          </a>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{article.published_at}</span>
                        </div>
                        <h3 className="list-item-title">
                          <a 
                            href={sanitizeUrl(article.link || '#')} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{ textDecoration: 'none', color: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                            className="hover-underline"
                          >
                            <span>{article.title}</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.6 }}><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                          </a>
                        </h3>
                        <p className="list-item-desc">{article.content}</p>
                        
                        <div className="list-item-footer">
                          {/* Sparkline bias */}
                          <div className="bias-sparkline-container" style={{ width: '120px', height: '3px', margin: 0 }}>
                            <div className="bias-spark left" style={{width: `${(article.editorialLeanings.left / totalBias) * 100}%`}}></div>
                            <div className="bias-spark center" style={{width: `${(article.editorialLeanings.center / totalBias) * 100}%`}}></div>
                            <div className="bias-spark right" style={{width: `${(article.editorialLeanings.right / totalBias) * 100}%`}}></div>
                          </div>
                          
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>
                              {article.category}
                            </span>
                            <span style={{ 
                              fontSize: '0.65rem', 
                              color: article.severityIndex === 'CRITICAL' ? 'var(--danger)' : article.severityIndex === 'ELEVATED' ? 'var(--warning)' : 'var(--success)', 
                              fontWeight: 'bold' 
                            }}>
                              [{article.severityIndex}]
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            /* Visual Briefing Layout (3D Flash Cards Grid) */
            <div className="news-stream custom-scroll" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem', padding: '1.5rem 2rem' }}>
              {filtered.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No signals matching your search criteria.
                </div>
              ) : (
                filtered.map(article => {
                  const totalBias = article.editorialLeanings.left + article.editorialLeanings.center + article.editorialLeanings.right;
                  const isFlipped = flippedCards[article.id] || false;
                  
                  return (
                    <div key={article.id} className={`flash-card-container ${selectedArticle?.id === article.id ? 'active' : ''}`} style={{ height: '390px', marginBottom: 0 }}>
                      <div className={`flash-card-inner ${isFlipped ? 'flipped' : ''}`}>
                        
                        {/* Front of the Flash Card */}
                        <div 
                          className="flash-card-front"
                          onClick={() => setSelectedArticle(article)}
                        >
                          <img 
                            src={article.image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=60"} 
                            alt={article.title} 
                            className="card-cover-image" 
                            loading="lazy"
                          />
                          
                          <div className="card-body-content">
                            <div className="item-meta">
                              <div className="meta-left">
                                <a 
                                  href={sanitizeUrl(article.link || '#')} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="source-badge"
                                  onClick={(e) => e.stopPropagation()}
                                  style={{ 
                                    display: 'inline-flex', 
                                    alignItems: 'center', 
                                    gap: '0.25rem',
                                    textDecoration: 'none',
                                    color: 'var(--accent)',
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    border: '1px solid rgba(99, 102, 241, 0.2)',
                                    borderRadius: '4px',
                                    padding: '0.15rem 0.4rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <span>{article.source}</span>
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                                </a>
                                <span className="time-stamp">• {article.published_at}</span>
                              </div>
                              <span className={`sentiment-dot-badge ${article.sentiment}`}>
                                {article.sentiment === 'negative' ? 'Threat' : article.sentiment === 'positive' ? 'Opportunity' : 'Neutral'}
                              </span>
                            </div>

                            <h3 className="item-title" style={{ 
                              fontSize: '0.95rem', 
                              margin: '0.2rem 0'
                            }}>
                              <a 
                                href={sanitizeUrl(article.link || '#')} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                style={{ 
                                  textDecoration: 'none', 
                                  color: 'inherit',
                                  display: '-webkit-box', 
                                  lineClamp: 2, 
                                  WebkitLineClamp: 2, 
                                  WebkitBoxOrient: 'vertical', 
                                  overflow: 'hidden'
                                }}
                                className="hover-underline"
                              >
                                {article.title} ↗
                              </a>
                            </h3>
                            
                            <p className="item-snippet" style={{ 
                              fontSize: '0.78rem', 
                              lineClamp: 2, 
                              display: '-webkit-box', 
                              WebkitLineClamp: 2, 
                              WebkitBoxOrient: 'vertical', 
                              overflow: 'hidden',
                              marginBottom: '0.4rem'
                            }}>{article.content}</p>

                            {/* Sparkline bias representation */}
                            <div className="bias-sparkline-container" style={{ margin: 'auto 0 0.5rem 0' }}>
                              <div className="bias-spark left" style={{width: `${(article.editorialLeanings.left / totalBias) * 100}%`}}></div>
                              <div className="bias-spark center" style={{width: `${(article.editorialLeanings.center / totalBias) * 100}%`}}></div>
                              <div className="bias-spark right" style={{width: `${(article.editorialLeanings.right / totalBias) * 100}%`}}></div>
                            </div>
                            
                            <button 
                              className="flip-action-btn"
                              onClick={(e) => toggleFlip(e, article.id)}
                            >
                              Quick Brief ⟳
                            </button>
                          </div>
                        </div>

                        {/* Back of the Flash Card (AI Summary) */}
                        <div className="flash-card-back">
                          <div className="back-header">
                            <span className="back-title">AI Ingestion Briefing</span>
                            <button 
                              onClick={(e) => toggleFlip(e, article.id)}
                              style={{ color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.9rem' }}
                            >
                              ✕
                            </button>
                          </div>
                          
                          <div className="back-content-scroll custom-scroll">
                            <p style={{ fontWeight: 'bold', marginBottom: '0.4rem', fontSize: '0.75rem', color: 'var(--accent)' }}>
                              [{article.category}] • Factuality: {article.factuality}
                            </p>
                            <p style={{ fontStyle: 'italic', marginBottom: '0.75rem', fontSize: '0.75rem', color: 'var(--text-main)', lineHeight: 1.3 }}>
                              {article.title}
                            </p>
                            <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              <li style={{ position: 'relative', paddingLeft: '0.75rem', fontSize: '0.75rem', lineHeight: 1.35 }}>
                                <span style={{ color: 'var(--accent)', position: 'absolute', left: 0 }}>▪</span>
                                <strong>Fact:</strong> {article.summaries.exec}
                              </li>
                              <li style={{ position: 'relative', paddingLeft: '0.75rem', fontSize: '0.75rem', lineHeight: 1.35 }}>
                                <span style={{ color: 'var(--accent)', position: 'absolute', left: 0 }}>▪</span>
                                <strong>Impact:</strong> {article.summaries.it}
                              </li>
                            </ul>
                          </div>
                          
                          <button 
                            className="flip-action-btn"
                            onClick={(e) => toggleFlip(e, article.id)}
                          >
                            Return ⟳
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </section>

        {/* Column 3: Deep Analysis Panel (Right) */}
        <section className="analysis-panel custom-scroll">
          {!selectedArticle ? (
            <div className="analysis-placeholder">
              <div className="placeholder-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              </div>
              <p>Select an intelligence signal from the feed stream to begin multi-source polarization analysis.</p>
            </div>
          ) : (
            <div className="analysis-content">
              <header className="analysis-header">
                <div className="analysis-meta">
                  <span>{selectedArticle.category}</span>
                  <span style={{
                    color: selectedArticle.severityIndex === 'CRITICAL' ? 'var(--danger)' : selectedArticle.severityIndex === 'ELEVATED' ? 'var(--warning)' : 'var(--text-muted)',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase'
                  }}>
                    [Risk: {selectedArticle.severityIndex}]
                  </span>
                </div>
                <h2 className="analysis-title">{selectedArticle.title}</h2>
                <a href={sanitizeUrl(selectedArticle.link || '#')} target="_blank" rel="noopener noreferrer" className="visit-link">
                  <span>Open raw intelligence source</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                </a>
              </header>

              {/* Geopolitical Threat Map Widget */}
              <div className="threat-map-card">
                <div className="bias-card-title">Geopolitical Threat Hotspot Map</div>
                <div className="map-container">
                  {/* Detailed vector world map with high-tech grid overlay */}
                  <svg viewBox="0 0 200 100" className="map-svg" fill="none">
                    {/* Grid Backdrop Lines */}
                    <line x1="0" y1="20" x2="200" y2="20" className="map-grid-line" />
                    <line x1="0" y1="40" x2="200" y2="40" className="map-grid-line" />
                    <line x1="0" y1="60" x2="200" y2="60" className="map-grid-line" />
                    <line x1="0" y1="80" x2="200" y2="80" className="map-grid-line" />
                    <line x1="20" y1="0" x2="20" y2="100" className="map-grid-line" />
                    <line x1="40" y1="0" x2="40" y2="100" className="map-grid-line" />
                    <line x1="60" y1="0" x2="60" y2="100" className="map-grid-line" />
                    <line x1="80" y1="0" x2="80" y2="100" className="map-grid-line" />
                    <line x1="100" y1="0" x2="100" y2="100" className="map-grid-line" />
                    <line x1="120" y1="0" x2="120" y2="100" className="map-grid-line" />
                    <line x1="140" y1="0" x2="140" y2="100" className="map-grid-line" />
                    <line x1="160" y1="0" x2="160" y2="100" className="map-grid-line" />
                    <line x1="180" y1="0" x2="180" y2="100" className="map-grid-line" />


                  {/* Detailed realistic country vector shapes */}
                    <g>
                        <path id="_somaliland" d="M 115.676,55.563 l 0.615,0.419 l 0.182,-0.009 l 1.528,-0.525 l 0.173,0.559 l -0.122,0.472 l -0.330,0.262 l -0.825,-0.053 l -1.181,-0.725 L 115.676,55.563 L 115.676,55.563 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="ae" d="M 118.431,49.517 l 0.131,0.525 l 1.487,0.131 l 0.104,-1.077 l 0.287,-0.156 l 0.078,-0.394 l -0.469,0.131 l -0.522,0.789 L 118.431,49.517 L 118.431,49.517 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="af" d="M 121.463,43.804 l 0.240,1.879 l 0.597,0.131 l 0.056,0.338 l -0.428,0.357 l 0.798,0.644 l 1.550,-0.558 l 0.124,-0.660 l 0.976,-0.609 l 0.374,-1.411 l 0.279,-0.300 l -0.289,-0.504 l 0.944,-0.584 l -0.121,-0.169 l -0.436,0.027 l -0.039,0.401 l -0.585,-0.006 l -0.011,-0.535 l -0.188,-0.225 l -0.317,0.288 l 0.009,0.264 l -0.478,0.181 l -0.882,-0.056 l -1.146,1.200 L 121.463,43.804 L 121.463,43.804 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="al" d="M 104.862,41.197 v 0.695 l 0.199,0.375 l 0.143,-0.017 l 0.246,-0.448 l -0.143,-0.201 l -0.056,-0.496 l -0.190,-0.177 L 104.862,41.197 L 104.862,41.197 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="am" d="M 114.768,41.216 l 0.724,0.944 l -0.212,0.249 l -0.513,-0.089 l -0.636,-0.570 l 0.034,-0.374 L 114.768,41.216 L 114.768,41.216 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <g id="ao">
                            <path className="mainland" d="M 102.540,63.354 l 0.514,1.919 l -0.012,0.607 l -0.752,0.808 l -0.113,1.313 l 2.895,0.026 l 0.941,0.341 l 0.776,-0.101 l -0.452,-0.567 l 0.002,-1.619 l 0.890,-0.038 v -0.632 l -0.723,-0.030 l -0.145,-1.496 l -0.305,0.004 l -0.164,-0.148 l -0.179,0.009 l -0.238,0.462 h -0.917 l -0.213,-0.214 l 0.063,-0.303 l -0.250,-0.366 L 102.540,63.354 L 102.540,63.354 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 102.228,62.829 l 0.262,0.341 l 0.339,-0.321 l -0.100,-0.333 l -0.084,-0.006 L 102.228,62.829 L 102.228,62.829 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <g id="ar">
                            <path className="mainland" d="M 74.924,72.626 l 0.293,0.274 l -1.111,1.651 l -0.391,0.432 l 0.136,1.886 l 0.858,1.042 l -0.721,1.257 l -0.546,0.235 h -0.624 l 0.175,0.982 l -0.976,0.335 l 0.234,0.825 l -0.585,1.867 l 0.722,0.590 l -0.391,0.962 l -0.664,1.042 l 0.351,0.727 l -0.858,0.137 l -0.703,-0.864 l -0.118,-2.692 l -1.092,-4.572 l 0.330,-1.598 l -0.703,-2.043 l 0.467,-2.652 l 0.430,-0.511 l -0.106,-0.388 l 0.552,-0.504 l 1.230,0.084 l 0.688,0.734 l 0.795,0.014 l 0.814,0.498 l -0.240,0.561 l 0.057,0.567 l 1.153,-0.054 L 74.924,72.626 L 74.924,72.626 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 72.429,87.793 l 0.039,0.864 l 0.663,-0.059 l 0.566,-0.374 l -0.956,-0.196 L 72.429,87.793 L 72.429,87.793 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <path id="at" d="M 101.335,38.235 l -0.098,0.204 l 0.084,0.145 l 0.351,-0.072 h 0.298 l 0.324,0.274 l 0.689,-0.125 l 0.507,-0.302 l 0.130,-0.204 l -0.020,-0.262 l -0.455,-0.341 l -0.611,0.006 l -0.051,0.347 l -0.642,0.313 L 101.335,38.235 L 101.335,38.235 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <g id="au">
                            <path className="mainland" d="M 143.636,74.100 l -0.053,3.827 l -0.588,0.431 l -0.053,0.377 l 0.802,0.538 l 1.980,-0.377 h 1.016 l 0.374,-0.540 l 2.247,-0.431 l 1.604,0.486 l -0.107,0.647 l 0.214,0.647 l 1.231,-0.216 l 0.053,0.323 l -0.802,0.592 l 0.267,0.216 l 0.588,-0.216 l -0.160,1.779 l 1.123,0.862 l 0.642,-0.216 l 0.321,0.323 l 1.873,-0.270 l 1.766,-2.857 l 0.642,-0.161 l 1.283,-2.372 l 0.321,-2.048 l -0.802,-1.024 l 0.321,-0.216 l -0.643,-1.995 l -0.695,-0.485 l 0.107,-2.695 l -0.643,-0.485 l -0.160,-1.509 h -0.321 l -1.071,3.557 l -0.588,0.054 l -1.338,-1.348 l 0.750,-1.995 l -1.390,-0.270 l -1.552,0.431 l -0.428,1.239 l -0.695,0.161 l -0.053,-0.862 l -2.835,1.725 l 0.053,0.647 l -0.428,0.593 h -1.071 l -2.301,0.970 L 143.636,74.100 L 143.636,74.100 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 153.372,84.396 l -0.267,1.078 l 0.053,0.754 l 0.802,-0.054 l 0.909,-1.401 L 153.372,84.396 L 153.372,84.396 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <path id="az" d="M 115.023,40.889 l -0.152,0.259 l 0.710,0.932 l 0.247,-0.080 l 0.407,0.427 l 0.176,-0.748 l 0.442,0.071 l -0.018,-0.214 l -0.727,-0.636 l -0.139,0.374 L 115.023,40.889 L 115.023,40.889 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="ba" d="M 103.472,39.565 l -0.056,0.092 l 1.012,1.043 l 0.371,-0.546 l -0.014,-0.215 l -0.324,-0.394 L 103.472,39.565 L 103.472,39.565 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="bd" d="M 133.744,47.733 l -0.198,0.357 l 0.512,0.974 l 0.015,0.760 l 0.093,0.203 l 0.602,0.011 l 0.341,-0.327 l 0.247,0.149 l 0.050,0.463 l 0.198,-0.123 l 0.012,-0.591 l -0.166,-0.020 l -0.104,-0.502 l -0.419,-0.015 l -0.104,-0.279 l 0.256,-0.342 l 0.004,-0.169 h -0.745 L 133.744,47.733 L 133.744,47.733 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="be" d="M 98.467,36.185 l -0.097,0.241 l 1.037,0.685 l 0.070,0.009 l 0.065,-0.191 l 0.146,-0.103 l -0.233,-0.261 h -0.160 l -0.219,-0.249 L 98.467,36.185 L 98.467,36.185 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="bf" d="M 96.806,53.941 l 0.549,-0.044 l 0.900,1.272 l -0.835,0.630 l -0.605,-0.156 l -0.813,0.011 l -0.131,0.476 l -0.682,0.033 l -0.187,-0.255 l 0.242,-0.775 L 96.806,53.941 L 96.806,53.941 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="bg" d="M 105.981,40.086 l 0.024,0.751 l 0.253,0.528 l 0.951,0.017 l 0.428,-0.303 l 0.421,-0.167 l -0.103,-0.480 l 0.095,-0.256 l -0.214,-0.112 l -0.294,0.024 l -0.231,0.232 l -0.968,0.008 L 105.981,40.086 L 105.981,40.086 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="bi" d="M 109.716,61.771 l 0.644,-0.014 l -0.167,0.564 l -0.163,0.142 h -0.199 l -0.142,-0.381 L 109.716,61.771 L 109.716,61.771 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="bj" d="M 98.030,57.742 h 0.320 l 0.018,-0.908 l 0.404,-0.587 l -0.018,-1.021 l -0.367,-0.009 l -0.629,0.491 l 0.262,0.501 L 98.030,57.742 L 98.030,57.742 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="bn" d="M 146.440,57.706 l -0.434,0.526 l 0.356,0.112 l 0.200,-0.280 L 146.440,57.706 L 146.440,57.706 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="bo" d="M 67.874,65.779 l 1.241,-0.541 l 0.410,0.039 l 0.273,1.140 l 1.891,0.629 l 0.312,0.963 l 0.780,0.098 l 0.332,0.825 l -0.234,0.746 l -1.268,0.098 l -0.467,1.199 l -0.995,-0.020 l -0.312,-0.059 l -0.574,0.558 l -0.283,-0.027 l -0.976,-2.260 l 0.270,-0.404 l 0.095,-1.598 l -0.241,-0.952 L 67.874,65.779 L 67.874,65.779 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="br" d="M 76.247,75.739 l 0.942,-1.813 l 0.035,-1.523 l 1.758,-1.134 h 0.985 l 0.774,-1.310 l 0.140,-2.515 l -0.317,-0.672 l 1.864,-1.701 l 0.071,-1.877 l -2.532,-1.239 l -3.058,-0.956 l -1.442,-0.142 l 0.387,-0.814 l -0.105,-1.239 l -0.315,-0.104 l -0.466,0.926 l -0.244,0.306 l -0.627,-0.277 l -2.109,0.743 l -0.703,-0.885 l 0.113,-0.924 l -0.664,0.675 l -0.733,-0.395 l -0.074,0.104 l 0.002,0.321 l 0.632,0.339 l -0.948,1.000 l -0.599,-0.006 l -0.606,-0.617 l -0.686,0.021 l -0.084,0.733 l 0.394,0.478 l -0.465,1.488 l -0.543,0.042 l -0.864,0.546 l -0.211,1.072 l 0.749,0.802 l 0.137,-0.155 l 0.526,-0.142 l 0.449,0.757 l 1.286,-0.552 l 0.499,0.029 l 0.344,1.217 l 1.835,0.582 l 0.317,0.971 l 0.781,0.094 l 0.372,0.927 l -0.252,0.825 l 0.329,0.432 l -0.048,0.642 l 0.881,-0.083 l 0.807,1.019 l -0.063,0.716 l 0.478,0.404 l -1.146,1.736 L 76.247,75.739 L 76.247,75.739 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <g id="bs">
                            <path d="M 64.994,48.641 l -0.190,-0.059 l -0.015,0.366 l 0.234,0.235 l 0.160,-0.235 L 64.994,48.641 L 64.994,48.641 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 65.372,49.214 l -0.262,0.146 l 0.247,0.353 l 0.131,-0.176 L 65.372,49.214 L 65.372,49.214 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 66.218,49.478 l -0.278,-0.015 l 0.029,0.177 l 0.204,0.294 l 0.175,-0.192 L 66.218,49.478 L 66.218,49.478 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 66.087,49.126 l -0.452,-0.192 l -0.087,-0.455 l 0.175,-0.074 l 0.175,0.353 l 0.175,0.133 L 66.087,49.126 L 66.087,49.126 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 65.650,48.201 l -0.234,-0.059 l -0.044,-0.294 l -0.247,-0.087 l 0.160,-0.162 l 0.291,0.103 l 0.219,0.133 L 65.650,48.201 L 65.650,48.201 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <path id="bt" d="M 133.719,46.975 l 0.234,0.320 l 0.790,0.006 l -0.080,-0.437 L 133.719,46.975 L 133.719,46.975 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="bw" d="M 105.539,71.575 l 0.324,0.099 l -0.045,0.927 l 0.333,0.045 l 0.766,-0.691 l 0.920,0.099 l 0.244,-0.618 l 1.164,-1.063 l -1.398,-1.609 l -0.018,-0.264 l -0.154,-0.045 l -0.424,0.391 l -1.101,0.027 l -0.154,1.372 l -0.432,0.099 L 105.539,71.575 L 105.539,71.575 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="by" d="M 105.863,34.642 l 0.226,0.372 l -0.091,0.297 l 0.015,0.235 l 0.083,0.282 l 0.467,-0.265 l 0.581,0.015 l 0.407,0.167 h 1.033 l 0.302,-0.722 l 0.181,-0.273 v -0.182 l -0.648,-0.912 l -0.573,-0.228 l -0.467,-0.053 l -0.407,0.130 l 0.015,0.410 l -0.565,0.715 L 105.863,34.642 L 105.863,34.642 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="bz" d="M 59.709,52.150 l -0.008,0.550 h 0.127 l 0.431,-0.805 h -0.293 L 59.709,52.150 L 59.709,52.150 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <g id="ca">
                            <path className="mainland" d="M 52.722,16.906 l 0.300,0.454 l 0.151,0.606 l 0.751,0.189 l 0.526,-0.567 l 0.451,0.228 l 1.277,0.113 l 0.902,-0.379 l 0.151,1.248 h 0.526 v -0.529 l 0.526,0.038 l 1.315,1.552 l 0.864,0.529 l -0.451,0.719 l 0.189,0.189 l 1.687,0.341 l 0.038,0.757 l 0.451,0.076 l 0.113,-1.136 l 0.713,-0.188 l 0.526,0.795 l 1.126,0.529 l 0.564,0.113 l 0.375,-0.454 l 0.038,-0.719 l 0.676,-0.416 l 0.225,0.606 l -0.602,1.060 l 0.075,0.529 l 0.338,-0.529 l 0.676,-0.606 l 0.038,-0.795 l -0.375,-0.606 l 0.113,-0.491 l 0.902,-0.454 l 0.413,0.303 l 0.075,2.649 l 0.638,-0.567 l 0.375,0.228 l -0.526,0.908 l 0.676,0.151 l 0.977,-1.514 l 0.826,0.870 l -0.338,1.552 l -0.826,0.454 l -0.789,-0.378 l -1.426,0.303 l 0.151,0.492 l -0.375,0.606 l -1.164,0.265 l -1.315,1.022 l -1.164,1.552 l -0.151,0.491 l 0.789,0.303 l 0.300,0.757 l 1.089,1.098 l 1.728,0.757 l -0.375,1.740 l -0.038,0.492 l 0.451,0.303 l 0.602,-0.795 l 0.075,-1.514 l 0.939,-0.038 l 0.451,-0.870 l 0.076,-1.324 l 1.202,-2.346 l 1.502,0.529 l 0.789,1.098 l -0.338,1.098 l 0.602,0.341 l 1.464,-0.985 l 0.413,2.687 l 1.353,1.627 l 0.038,0.832 l -1.502,0.379 l -0.713,0.757 l -1.502,-0.341 l -0.751,-0.038 l -1.315,1.022 l 0.789,-0.189 l 0.977,-0.188 l 0.189,0.228 l -0.262,0.832 l 0.038,0.757 l 0.451,0.303 l 0.451,-0.113 l 0.226,-0.341 h 0.300 l -0.489,0.908 l -0.939,0.038 l -0.413,0.606 h -0.526 l -0.151,-0.454 l 0.751,-0.757 l -0.902,0.303 l -0.041,-1.286 l -0.259,-0.151 l -0.789,0.341 l -0.075,0.644 h -1.803 l -1.541,1.061 l -2.066,0.682 l -0.225,-0.303 l 1.040,-1.553 l -0.591,-0.569 l -0.375,-0.721 l -0.765,-0.584 l -0.820,-0.068 l -1.470,-1.030 l -10.662,-1.752 l -0.176,-0.723 l -0.977,-0.908 v -0.757 l 0.151,-0.682 l -0.076,-0.378 l -0.375,-0.379 l -0.075,-0.606 l 0.977,-0.682 l -0.602,-3.254 l -0.826,-0.038 l -0.751,-0.985 L 52.722,16.906 L 52.722,16.906 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 49.044,28.931 l -0.256,0.492 l 0.089,0.348 l 0.167,0.104 l -0.039,0.142 l -0.179,0.051 l 0.051,0.517 l 0.193,0.194 l 0.154,-0.167 l -0.193,-0.504 l 0.115,-0.401 l 0.282,-0.375 l -0.205,-0.348 L 49.044,28.931 L 49.044,28.931 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 49.891,31.877 l -0.231,0.091 l 0.424,0.492 l 0.103,0.582 l 0.424,0.452 l 0.359,-0.065 v -0.594 l -0.436,-0.272 L 49.891,31.877 L 49.891,31.877 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 73.023,19.462 l -0.267,0.270 l 0.234,0.371 l 1.104,0.134 l -0.703,-0.742 L 73.023,19.462 L 73.023,19.462 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 59.584,14.980 l 0.033,0.606 l -1.203,1.247 l 0.302,1.010 l 0.869,-0.235 l 0.502,-0.742 l 1.270,-0.472 l 1.036,-0.068 l -0.802,-0.876 l -0.401,0.303 l -0.302,-0.101 l -0.167,-0.371 l -0.368,-0.371 L 59.584,14.980 L 59.584,14.980 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 61.155,13.195 l -0.267,0.472 l 1.304,0.472 l 0.467,-0.707 l 0.201,0.472 h 0.335 l 0.635,-0.707 l -0.769,-0.202 l -0.302,-0.235 l -0.401,0.404 L 61.155,13.195 L 61.155,13.195 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 63.429,14.139 l -1.036,0.437 v 0.336 l 1.337,0.505 l -0.302,0.336 l 0.201,0.437 l 0.835,-0.371 h 0.703 l 0.335,0.538 l 0.568,-0.573 l -0.134,-0.540 l -0.467,0.169 l -0.066,-0.674 l 0.234,-0.404 h -0.234 l -0.368,0.235 l -0.167,0.134 l 0.101,0.472 l -0.267,0.202 l -0.401,-0.033 l -0.101,-0.606 L 63.429,14.139 L 63.429,14.139 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 64.799,13.094 l -0.101,0.336 l 0.635,0.303 l 0.467,-0.270 l -0.033,-0.202 L 64.799,13.094 L 64.799,13.094 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 65.300,12.521 l -0.467,0.169 l 0.033,0.235 l 1.036,-0.068 l -0.033,-0.235 L 65.300,12.521 L 65.300,12.521 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 67.540,13.094 l -0.066,0.235 l -0.167,0.235 v 0.336 l 0.635,-0.101 l 0.668,0.573 h 0.234 v -0.573 l -0.668,-0.742 L 67.540,13.094 L 67.540,13.094 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 69.246,13.768 l 0.267,0.303 l -0.234,0.404 l 0.167,0.437 l 0.736,-0.404 v -0.303 l -0.434,-0.505 L 69.246,13.768 L 69.246,13.768 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 70.215,12.993 l 0.033,0.538 h 0.903 l 0.234,0.202 l -0.033,0.235 l -0.802,0.101 l 0.568,0.775 l 0.769,0.134 l 1.069,-0.472 l -1.538,-2.325 l -0.467,0.303 l 0.033,0.404 l -0.535,-0.202 L 70.215,12.993 L 70.215,12.993 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 62.426,16.800 l -1.270,0.336 l -0.736,0.641 l 0.066,0.707 l 1.337,0.404 l -0.302,0.674 l -0.970,-0.607 l -0.267,0.505 l 0.635,0.437 l -0.033,0.707 l 0.970,0.270 l 1.170,-0.068 l 0.200,-0.371 l 0.869,0.977 l 0.602,-0.202 l 0.101,-0.674 l 0.434,0.303 l 0.066,-0.674 l -0.535,-0.336 l 0.033,-2.121 l -0.467,-0.371 l -0.501,0.674 L 62.426,16.800 L 62.426,16.800 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 66.505,18.282 l -0.434,-0.202 l -0.234,0.303 l 0.467,0.742 l 0.033,0.707 l 1.003,-0.606 v -0.876 l 0.368,-0.371 l -0.368,-0.270 h -0.602 L 66.505,18.282 L 66.505,18.282 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 68.644,17.979 l -0.703,0.573 l 0.167,0.707 h 0.434 l 0.200,-0.371 l 0.302,0.303 l 0.302,-0.033 l 0.802,-0.674 L 68.644,17.979 L 68.644,17.979 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 68.576,16.867 l -0.167,0.336 l 0.736,0.270 l 0.201,-0.303 L 68.576,16.867 L 68.576,16.867 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 68.142,15.586 l -0.736,0.101 l -0.434,0.404 l 0.802,0.033 l -0.234,0.606 l 0.167,0.270 l 0.234,-0.033 l 0.568,-0.909 L 68.142,15.586 L 68.142,15.586 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 69.413,15.351 l -0.401,0.134 l 0.066,0.538 l 0.668,0.437 l 0.033,0.336 l -0.200,0.202 l 0.101,0.674 l 2.574,0.841 l 0.703,0.235 l 0.703,-0.606 l -0.835,-0.674 l -0.769,0.202 l -1.069,-0.101 l -0.401,-0.404 l -0.101,-1.111 l -0.668,-0.336 L 69.413,15.351 L 69.413,15.351 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 71.518,18.855 l -0.736,-0.068 l -0.869,0.336 l -0.467,0.639 l 0.134,1.752 l 1.437,0.068 l 1.371,0.674 l 0.970,1.111 l 0.736,-0.033 l -0.201,1.043 l -0.668,1.111 l -0.736,0.336 l -0.535,-0.101 l -0.267,-0.235 l -0.401,0.538 l 0.167,0.538 l 0.568,0.033 l 0.703,-0.336 l 0.602,1.550 l 1.505,0.977 l 1.036,-1.313 l -0.869,-1.414 l 0.502,-0.573 l 0.703,1.179 l 1.270,-1.111 l -0.234,-0.505 l -0.869,0.270 l -0.601,-1.651 l 0.568,-0.942 l -1.137,-1.212 l -0.635,0.437 l -0.602,-1.313 l -1.269,0.169 l -0.335,-1.583 l -1.036,0.707 l -0.101,0.876 h -0.568 l 0.066,-0.775 L 71.518,18.855 L 71.518,18.855 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 71.954,15.654 v 0.303 l -0.736,0.169 l 0.200,0.336 l 0.835,0.336 l 0.936,0.101 l 0.668,0.472 l 0.668,-0.371 l -0.468,-0.472 h 0.602 l 0.368,-0.404 l 0.903,-0.134 v -0.202 l -0.502,-0.336 l 0.066,-0.371 l 1.404,0.235 l 2.073,-0.808 l -0.769,-0.235 l 0.201,-0.270 h 1.604 l 0.267,-0.270 l -3.243,-1.146 l -0.769,-0.270 l -0.835,0.606 l -0.936,-0.775 l -0.502,-0.033 l -0.101,0.641 l -0.635,-0.573 l -0.736,0.235 l 0.134,0.371 l 1.104,0.235 l -0.066,0.538 l 0.602,0.371 l 1.472,-0.371 l 0.033,0.505 l -1.203,0.573 l -0.736,-0.573 l -0.668,0.068 l 0.668,0.944 l -0.335,0.169 l -0.502,-0.437 l -0.368,0.235 l 0.335,0.639 h 0.568 l -0.134,0.606 l -0.467,-0.068 l -0.602,-0.641 L 71.954,15.654 L 71.954,15.654 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 68.974,24.926 l -0.638,0.802 l -0.039,0.884 l 0.558,-0.321 h 0.677 l 0.478,0.442 l 0.439,-0.362 L 68.974,24.926 L 68.974,24.926 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 76.741,35.360 l -1.594,1.526 l 0.160,0.362 l 1.951,0.722 l 0.279,-0.481 l -0.160,-0.802 l -0.638,0.080 l -0.359,-0.401 l 0.597,-0.602 L 76.741,35.360 L 76.741,35.360 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <path id="cd" d="M 102.654,63.203 l 1.555,-0.027 l 0.315,0.448 l -0.012,0.330 l 0.116,0.106 h 0.772 l 0.222,-0.436 h 0.315 l 0.128,0.129 l 0.432,-0.012 l 0.128,1.520 l 0.748,0.024 v 0.118 l 2.010,0.906 l 0.093,0.177 h 0.421 l -0.047,-0.636 l -0.760,-0.365 l 0.047,-0.482 l 0.327,-0.766 l 0.748,-0.024 l -0.642,-2.132 l 0.012,-0.906 l 1.016,-1.589 l 0.012,-0.223 l -0.152,-0.083 l 0.006,-0.431 l -0.185,-0.017 l -0.187,-0.238 l -3.068,-0.139 l -0.563,0.547 l -0.921,-0.606 l -0.324,0.199 l -0.235,1.980 l -0.582,0.449 l -0.175,0.398 l 0.031,0.590 l -1.050,0.858 l -0.279,-0.127 l 0.038,0.164 L 102.654,63.203 L 102.654,63.203 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="cf" d="M 103.601,58.430 l 0.703,0.760 l 0.277,-0.359 l 0.442,0.018 l 0.095,-0.350 l 0.434,-0.271 l 0.902,0.621 l 0.520,-0.516 l 2.019,0.089 l -1.873,-1.933 l 0.252,-0.156 l 0.035,-0.341 l -0.425,-0.200 h -0.624 l -1.006,0.997 l -0.034,0.410 l -0.798,-0.025 l -0.025,0.175 l -0.520,-0.053 l -0.469,0.891 L 103.601,58.430 L 103.601,58.430 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="cg" d="M 102.899,59.707 l -0.009,0.219 l 0.721,0.018 l 0.025,1.871 l -0.659,-0.018 l -0.381,-0.297 l -0.295,0.166 l -0.014,0.083 l 0.152,0.074 l 0.044,0.384 l -0.407,0.350 l 0.087,0.184 l 0.451,-0.350 h 0.217 l 0.069,0.209 l 0.287,0.122 l 0.919,-0.778 l -0.018,-0.568 l 0.192,-0.463 l 0.590,-0.437 l 0.158,-1.479 l -0.419,0.002 l -0.485,0.665 L 102.899,59.707 L 102.899,59.707 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="ch" d="M 100.171,38.124 l -0.658,0.700 l 0.014,0.071 l 0.270,-0.084 l 0.243,0.338 l 0.410,-0.145 l 0.283,0.220 l 0.116,-0.066 l 0.350,-0.549 l -0.089,-0.084 l -0.345,-0.009 l -0.167,-0.342 L 100.171,38.124 L 100.171,38.124 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="ci" d="M 94.013,58.836 l 0.645,-0.456 l 0.802,-0.141 l 0.819,0.177 l -0.418,-0.632 l -0.122,-0.386 l 0.122,-1.141 l -0.731,0.035 l -0.331,-0.316 l -0.697,0.018 l -0.332,0.053 l 0.035,0.772 l -0.175,0.071 l -0.210,0.386 l 0.540,0.631 L 94.013,58.836 L 94.013,58.836 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <g id="cl">
                            <path d="M 71.844,87.086 l -0.644,1.414 l 1.111,0.118 l 0.020,-0.942 L 71.844,87.086 L 71.844,87.086 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 71.625,86.864 l -0.484,0.535 l -0.059,0.629 l -0.936,-0.531 l -0.995,-1.434 l -0.293,-0.511 l 0.410,-0.531 l -0.039,-0.668 l -0.467,-0.196 l -0.371,-0.274 l 0.078,-0.374 l 0.487,-0.137 l 0.098,-2.161 l -0.760,-0.433 l -0.496,-11.247 l 0.128,-0.223 l 0.971,2.239 l 0.311,0.006 l 0.101,0.357 l -0.413,0.500 l -0.475,2.695 l 0.676,2.075 l -0.312,1.571 l 1.101,4.620 l 0.116,2.702 l 0.789,0.912 L 71.625,86.864 L 71.625,86.864 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 68.412,81.211 l -0.194,0.294 l 0.098,0.511 l 0.194,0.020 l 0.098,-0.649 L 68.412,81.211 L 68.412,81.211 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <path id="cm" d="M 100.912,58.464 l 0.485,0.447 l -0.035,0.691 l 2.663,-0.062 l 0.217,-0.244 l -0.763,-0.822 l -0.113,-0.297 l 0.486,-0.909 l -0.330,-0.603 l -0.278,-0.149 v -0.306 l 0.321,-0.210 l 0.018,-0.953 l -0.255,-0.029 l -0.004,0.501 l -1.119,2.088 l -0.685,0.035 l -0.469,0.323 L 100.912,58.464 L 100.912,58.464 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <g id="cn">
                            <path className="mainland" d="M 129.949,35.212 l -0.522,1.312 l -0.719,-0.038 l -0.759,1.660 l 0.644,0.820 l -1.327,1.832 l -0.682,-0.115 l -0.455,0.573 l 0.113,0.344 l 0.531,0.038 l 0.265,0.611 l 0.531,0.115 l 1.630,2.100 v 1.069 l 0.796,0.496 l 0.871,-0.152 l 1.099,0.649 l 1.327,0.381 l 0.644,-0.077 l 0.721,-0.077 l 1.515,-0.992 l 0.493,0.077 l 0.188,0.448 l 0.418,0.125 l 0.569,0.840 l -0.379,0.840 l 0.228,0.573 l 0.644,0.229 l 0.113,0.688 l 0.759,0.077 l 0.113,-0.344 l 1.099,-0.573 l 0.682,0.038 l 0.796,0.877 l 0.531,-0.229 l 0.341,0.038 l 0.152,0.421 l 0.265,0.038 l 0.378,-0.534 l 1.515,-0.573 l 1.365,-1.642 l 0.455,-1.565 l -0.038,-1.031 l -0.568,-0.114 l 0.341,-0.382 l -0.076,-0.611 l -1.440,-1.450 v -0.725 l 0.416,-0.534 l 0.417,-0.192 l 0.038,-0.421 h -1.061 l -0.190,0.573 l -0.493,-0.114 l -0.606,-0.649 l 0.379,-0.992 l 0.531,-0.573 l 0.493,0.038 l -0.076,0.878 l 0.265,0.229 l 0.644,-0.648 l 0.228,-0.038 l -0.076,-0.496 l 0.606,-0.725 l 0.455,0.038 l 0.265,-0.840 l 0.311,-0.164 l 0.032,-0.523 l -0.302,-0.317 l -0.026,-0.826 l 0.581,-0.038 l -0.038,-2.131 l -0.407,0.244 L 147.352,33.620 l -0.680,-0.002 l -1.971,-1.108 l -1.423,-1.716 l -1.444,-0.015 l -0.368,0.320 l 0.467,1.071 l -0.163,1.004 l -0.582,0.241 l -0.327,-0.026 l -0.024,0.994 l 0.341,0.077 l 0.606,-0.267 l 0.796,0.381 v 0.382 l -0.569,0.038 l -0.455,0.992 l -0.416,0.038 l -1.478,1.947 l -1.553,0.687 l -1.062,0.077 l -0.719,-0.496 l -1.024,0.535 l -1.099,-0.344 l -0.265,-0.725 l -1.856,-0.115 l -0.985,-1.603 h -0.416 l -0.335,-0.743 L 129.949,35.212 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 143.433,50.305 l -0.360,0.101 l -0.259,0.320 l 0.216,0.421 l 0.316,0.028 l 0.360,-0.320 l 0.086,-0.421 L 143.433,50.305 L 143.433,50.305 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <path id="co" d="M 67.123,54.770 l -0.311,-0.032 l -2.054,1.693 l -0.217,0.596 l -0.280,0.032 l 0.125,1.316 l -0.716,1.757 l 0.778,0.659 l 0.997,0.063 l 0.684,1.004 l 0.995,0.032 l -0.032,0.752 h 0.372 l 0.404,-1.380 l -0.374,-0.470 l 0.093,-0.878 l 0.778,-0.063 l -0.093,-2.039 l -1.743,-0.564 l -0.404,-1.098 L 67.123,54.770 L 67.123,54.770 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="cr" d="M 61.642,55.554 l 0.210,0.410 l 0.170,0.226 l -0.229,0.680 l -0.437,-0.308 l -0.715,-0.654 v -0.433 L 61.642,55.554 L 61.642,55.554 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="cu" d="M 62.165,49.815 v 0.192 l 0.802,0.015 l 0.378,-0.220 l 0.059,0.162 l 0.787,0.192 l 0.700,0.632 l -0.160,0.220 l 0.029,0.250 l 0.583,0.146 l 0.583,-0.264 l 0.262,-0.264 l -0.378,-0.192 l -1.953,-1.146 l -0.684,-0.074 L 62.165,49.815 L 62.165,49.815 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <g id="cv">
                            <path d="M 87.302,53.377 l -0.286,0.164 l 0.205,0.164 l 0.246,-0.123 L 87.302,53.377 L 87.302,53.377 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 88.006,53.709 l -0.187,0.166 l 0.133,0.246 l 0.320,-0.143 L 88.006,53.709 L 88.006,53.709 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 87.597,54.175 l -0.240,0.143 l 0.258,0.345 l 0.204,-0.107 L 87.597,54.175 L 87.597,54.175 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <path id="cy" d="M 110.771,44.224 l 0.185,0.134 l -0.575,0.544 l -0.274,-0.009 l -0.204,-0.143 l 0.027,-0.267 l 0.416,-0.027 L 110.771,44.224 L 110.771,44.224 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="cz" d="M 102.511,37.444 h 0.448 h 0.220 l 0.357,0.255 l 0.662,-0.550 l -0.642,-0.458 l -0.636,-0.308 l -0.436,0.078 l -0.591,0.380 L 102.511,37.444 L 102.511,37.444 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="de" d="M 99.904,34.882 l 0.538,-0.087 v -0.380 l 0.451,-0.074 l 0.247,0.249 l 0.261,0.029 l 0.407,-0.177 l 0.363,0.103 l 0.320,0.278 l 0.044,1.039 l 0.320,0.425 l -0.421,0.059 l -0.698,0.439 l 0.059,0.146 l 0.624,0.585 l -0.044,0.293 l -0.581,0.293 l -0.538,0.015 l -0.131,0.277 h -0.276 l -0.131,-0.292 l -0.480,-0.118 l -0.015,-0.483 l -0.242,-0.134 l 0.020,-0.325 l -0.071,-0.232 l -0.346,-0.318 l 0.072,-0.498 l 0.377,-0.176 L 99.904,34.882 L 99.904,34.882 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <g id="dk">
                            <path d="M 100.753,32.412 l -0.626,0.692 l -0.023,0.451 l 0.285,0.744 l 0.446,-0.084 l -0.056,-0.608 l 0.308,-0.344 l -0.006,-0.270 l -0.217,-0.562 L 100.753,32.412 L 100.753,32.412 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 101.077,33.682 l -0.185,0.040 v 0.276 l 0.197,0.153 l 0.174,-0.044 l -0.042,-0.262 L 101.077,33.682 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 101.657,33.419 l -0.166,0.040 l -0.184,0.169 l 0.078,0.341 l 0.225,0.088 l -0.233,0.093 l -0.044,0.119 h 0.350 l 0.105,-0.192 l -0.134,-0.066 l 0.044,-0.168 l 0.160,-0.210 l -0.044,-0.182 L 101.657,33.419 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <path id="dj" d="M 115.034,55.035 l -0.086,0.506 l 0.597,-0.009 l 0.009,-0.745 l -0.219,-0.134 L 115.034,55.035 L 115.034,55.035 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="dm" d="M 70.944,52.524 l -0.133,0.282 l 0.160,0.214 l 0.199,-0.173 L 70.944,52.524 L 70.944,52.524 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="do" d="M 68.537,51.854 l -0.798,-0.522 l -0.504,-0.178 l -0.101,0.963 l 0.101,-0.008 l 0.133,0.255 l 0.173,-0.201 l 0.505,-0.134 l 0.439,0.093 L 68.537,51.854 L 68.537,51.854 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="dz" d="M 100.317,43.870 l -0.615,-0.207 l -2.560,0.481 l -0.558,0.424 l 0.341,1.760 l -1.018,0.041 l -0.612,0.985 l -1.458,0.350 l 0.004,0.716 l 4.803,3.671 l 0.818,0.069 l 2.731,-2.134 l -0.273,-0.344 l -0.512,-0.069 l -0.308,-0.515 V 46.964 l -0.205,-0.207 l 0.035,-0.550 l -0.546,-0.550 l -0.068,-0.585 l 0.238,-0.172 l -0.103,-0.620 L 100.317,43.870 L 100.317,43.870 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <g id="ec">
                            <path className="mainland" d="M 63.575,60.209 l -0.713,0.443 l -0.051,0.658 l -0.143,0.215 l 0.449,0.431 l -0.194,0.213 l 0.045,0.543 l 0.804,0.192 l 1.217,-1.440 l -0.003,-0.502 l -0.583,-0.038 L 63.575,60.209 L 63.575,60.209 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 58.263,60.560 l -0.093,0.415 l -0.173,0.175 l 0.119,0.214 l 0.306,-0.120 l 0.146,-0.255 l -0.093,-0.268 L 58.263,60.560 L 58.263,60.560 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <g id="ee">
                            <path className="mainland" d="M 106.935,31.230 l -0.844,-0.030 l -0.535,0.327 l -0.008,0.243 l 0.347,0.327 l 1.078,0.183 L 106.935,31.230 L 106.935,31.230 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 105.134,31.360 l -0.228,0.077 l 0.228,0.039 l 0.104,0.120 l 0.124,-0.149 l -0.124,-0.212 L 105.134,31.360 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 105.231,31.665 l -0.325,0.145 l -0.112,0.194 l 0.112,0.126 l 0.412,-0.153 l 0.198,-0.131 L 105.231,31.665 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <path id="eg" d="M 107.563,46.218 l 0.403,0.011 l 0.784,0.217 l 0.372,0.011 l 0.462,-0.386 h 0.215 l 0.392,0.217 h 0.496 l 0.089,-0.006 l 0.314,0.902 l 0.089,0.291 l 0.083,0.436 l -0.148,0.108 l -0.255,-0.128 l -0.294,-0.959 l -0.265,-0.019 l -0.019,0.326 l 0.177,0.564 l 1.413,1.749 l 0.030,0.751 l -0.411,0.475 l -3.866,-0.044 L 107.563,46.218 L 107.563,46.218 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="er" d="M 112.807,54.004 l -0.038,-0.888 l 0.597,-0.696 l 0.162,0.124 l 0.294,0.983 l 1.411,1.051 l -0.256,0.315 l -1.033,-0.888 L 112.807,54.004 L 112.807,54.004 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <g id="es">
                            <path className="mainland" d="M 96.469,40.479 h -1.921 l -0.388,-0.175 l -0.187,0.014 l -0.226,0.470 l 0.080,0.484 l 0.734,0.068 l 0.093,0.309 l -0.320,1.802 l 0.014,0.323 l 0.520,0.282 l 0.600,0.040 l 1.200,-0.295 l 0.587,-0.738 l 0.013,-0.752 l 1.040,-0.941 l 0.053,-0.416 l -0.947,-0.014 L 96.469,40.479 L 96.469,40.479 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 91.533,47.827 l -0.264,0.152 l 0.122,0.124 L 91.533,47.827 L 91.533,47.827 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 90.616,47.855 l -0.327,0.083 l 0.163,0.247 h 0.245 L 90.616,47.855 L 90.616,47.855 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 89.838,47.608 l -0.205,0.207 l 0.287,0.247 l 0.163,-0.371 L 89.838,47.608 L 89.838,47.608 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 98.390,42.320 l -0.240,0.081 l 0.053,0.215 h 0.347 l 0.146,-0.161 L 98.390,42.320 L 98.390,42.320 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <path id="et" d="M 111.718,56.577 l 1.098,-2.443 l 1.090,0.006 l 0.967,0.840 l -0.068,0.692 h 0.749 l 0.077,0.416 l 1.212,0.725 l 0.748,0.038 l -1.422,1.527 l -1.953,0.602 h -0.484 l -0.862,-0.736 l -0.341,-0.143 l -0.660,-0.973 l -0.436,0.006 l -0.051,-0.446 L 111.718,56.577 L 111.718,56.577 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="fi" d="M 105.280,27.201 l 0.312,0.137 l 0.193,0.362 l -0.193,0.250 l -0.968,1.058 l -0.166,0.558 l 0.222,0.808 l 0.746,0.558 l 0.995,-0.474 l 0.802,-0.112 l 0.746,-1.199 l -0.553,-1.310 l -0.526,-1.255 l 0.083,-0.808 l -0.332,-0.056 l -0.086,-0.590 l -0.446,-0.728 l -0.495,0.342 l -0.194,0.795 l -0.525,-0.315 l -0.730,-0.178 l -0.163,0.190 l 0.280,0.253 l 0.511,-0.009 l 0.411,0.665 L 105.280,27.201 L 105.280,27.201 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <g id="fk">
                            <path d="M 75.298,86.193 l -0.396,-0.044 l -0.395,0.265 l 0.286,0.311 L 75.298,86.193 L 75.298,86.193 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 75.693,85.994 l -0.131,0.421 l -0.374,0.332 l 0.023,0.110 l 0.638,-0.244 l 0.264,-0.332 L 75.693,85.994 L 75.693,85.994 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <g id="fr">
                            <path className="mainland" d="M 98.285,36.513 l -0.333,0.081 l -0.666,0.725 l -0.200,0.014 l -0.267,-0.189 l -0.173,0.041 l -0.133,0.416 l -0.974,0.027 l 0.027,0.216 l 0.666,0.444 l 0.774,0.618 l -0.013,0.739 l -0.413,0.725 l 0.894,0.430 l 0.908,0.027 l 0.280,-0.323 l 0.573,0.014 l 0.160,0.148 l 0.573,-0.041 l 0.294,-0.377 l -0.374,-0.443 l -0.027,-0.282 l 0.080,-0.309 l -0.187,-0.268 l -0.320,0.093 l -0.040,-0.241 l 0.707,-0.780 v -0.470 l -0.410,-0.134 l -0.250,-0.172 L 98.285,36.513 L 98.285,36.513 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 74.421,58.090 l 0.882,0.550 l -0.462,0.917 l -0.167,0.211 l -0.490,-0.282 l 0.014,-0.988 L 74.421,58.090 L 74.421,58.090 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 120.447,70.239 l -0.344,0.023 l -0.023,0.300 l 0.229,0.047 l 0.344,-0.161 L 120.447,70.239 L 120.447,70.239 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 116.406,66.006 l 0.114,0.255 h 0.184 l 0.092,-0.324 L 116.406,66.006 L 116.406,66.006 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 71.396,53.300 l -0.160,0.148 l 0.119,0.241 l 0.226,-0.066 L 71.396,53.300 L 71.396,53.300 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 100.913,40.775 l -0.294,0.296 l -0.027,0.268 l 0.240,0.148 l 0.093,-0.013 l 0.053,-0.391 L 100.913,40.775 L 100.913,40.775 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 70.571,52.296 l -0.226,0.093 l 0.080,0.200 l 0.265,-0.173 l -0.053,-0.054 L 70.571,52.296 L 70.571,52.296 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <path id="ga" d="M 102.204,59.723 l -0.018,0.375 l -0.850,-0.018 l -0.520,1.006 l 1.223,1.337 l 0.303,-0.253 l -0.009,-0.262 l -0.208,-0.097 v -0.184 l 0.469,-0.297 l 0.416,0.315 l 0.460,0.009 l -0.009,-1.582 l -0.728,-0.034 l -0.009,-0.332 L 102.204,59.723 L 102.204,59.723 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <g id="gb">
                            <path className="mainland" d="M 96.132,32.047 l -0.276,0.418 l 0.110,0.167 h 0.636 v 0.279 l -0.166,0.223 l 0.110,0.585 l 0.359,0.697 l 0.276,0.641 l 0.442,0.167 l 0.193,0.335 l -0.027,0.306 l -0.276,0.167 l -0.027,0.139 l 0.193,0.112 l -0.166,0.223 l -0.387,0.167 l -0.746,-0.083 l -1.162,0.529 l -0.387,-0.194 l 1.107,-0.641 l -0.139,-0.083 l -0.581,-0.056 l 0.359,-0.529 l 0.056,-0.447 l 0.470,-0.056 l -0.083,-0.864 l -0.554,-0.027 l -0.166,-0.194 l 0.027,-0.641 l -0.332,0.027 l 0.332,-1.114 l 0.609,-0.447 L 96.132,32.047 L 96.132,32.047 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 94.971,33.915 l -0.498,0.056 l -0.027,0.447 l 0.332,0.223 l 0.359,-0.083 l 0.139,-0.250 L 94.971,33.915 L 94.971,33.915 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <path id="ge" d="M 112.618,40.352 l 0.493,0.644 l 0.615,0.283 l 0.378,-0.002 l 0.650,-0.176 l 0.163,-0.255 l -1.922,-0.719 L 112.618,40.352 L 112.618,40.352 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="gh" d="M 95.863,57.374 l 0.169,0.396 l 0.440,0.691 l 0.244,-0.009 l 0.666,-0.379 l -0.047,-2.155 l -0.516,-0.151 l -0.722,0.020 L 95.863,57.374 L 95.863,57.374 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <g id="gl">
                            <path className="mainland" d="M 77.285,17.118 l -0.205,0.327 l 0.369,0.369 l -0.164,0.369 l 0.534,0.697 l 0.656,-0.205 l 0.861,-0.081 l 0.985,1.066 l 0.656,1.762 l -0.532,1.107 l 0.737,-0.123 l 0.411,0.246 l 0.040,0.534 l -0.901,0.041 l 0.492,0.491 l 0.615,0.124 l -1.353,1.803 l -0.164,1.107 l 0.287,0.902 l -0.205,0.534 l 0.369,1.147 l 0.697,0.780 l 0.205,-0.040 l 0.451,-0.124 l 0.041,0.656 l 0.286,0.410 l 0.532,-0.041 l 0.410,-1.517 l 1.230,-1.517 l 1.846,-0.737 l 1.147,-1.435 l 0.532,0.246 h 1.107 l 0.902,-0.901 l 1.107,-0.451 l 0.123,-0.697 l -0.697,-0.615 l -0.615,-0.205 l -0.329,-0.861 l 0.780,-0.451 l 1.230,0.656 l 0.410,-0.451 l -0.656,-0.369 l 1.395,-1.886 l -0.246,-0.820 l -0.656,-0.040 l 0.246,-0.738 l 0.820,-0.369 l 1.681,-1.476 l -0.491,-0.533 l -1.886,0.164 l -0.985,0.985 l 0.575,-1.271 l -0.656,-0.164 l -0.369,0.656 l -0.532,-0.451 l -1.476,0.164 l 0.410,-0.656 l 2.419,-0.081 l -0.615,-0.820 l -2.623,-0.491 l -1.066,0.164 l 0.041,0.534 l -1.107,-0.369 l 0.040,-0.369 l -0.780,0.164 l -0.164,0.410 l 0.820,0.286 l -0.861,0.615 l -0.615,-0.697 l -0.861,-0.246 l -0.124,0.656 h -0.861 l -0.329,-0.697 l -1.353,-0.205 l -0.738,0.369 l -0.041,0.492 l -0.942,-0.124 l -0.575,0.246 l 0.041,0.574 v 0.287 l -1.066,0.205 l -0.492,-0.327 l -0.329,0.532 l 0.492,0.534 l 1.025,-0.124 l 0.081,0.329 l -0.780,0.369 L 77.285,17.118 L 77.285,17.118 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 80.566,23.514 l 0.246,0.370 l -0.123,0.451 h -0.246 l -0.329,-0.370 l 0.081,-0.287 L 80.566,23.514 L 80.566,23.514 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 90.817,22.489 l 0.697,0.205 l -0.041,0.574 l -0.737,-0.369 l -0.164,-0.205 L 90.817,22.489 L 90.817,22.489 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <path id="gm" d="M 90.217,54.553 l -0.019,0.167 l 1.043,-0.015 l 0.053,-0.155 l -0.023,-0.157 l -0.300,0.122 L 90.217,54.553 L 90.217,54.553 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="gn" d="M 90.749,56.001 l 0.459,0.706 l 0.597,-0.519 l 0.612,-0.027 l 0.510,0.677 l 0.433,0.285 l 0.163,-0.317 l 0.145,-0.081 l -0.011,-0.697 l -0.288,-0.826 l -0.884,0.098 l -1.093,-0.087 l -0.006,0.280 L 90.749,56.001 L 90.749,56.001 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <g id="gq">
                            <path d="M 100.764,58.936 l -0.069,0.297 l 0.208,0.113 l 0.199,-0.149 l -0.069,-0.306 L 100.764,58.936 L 100.764,58.936 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 101.389,59.732 l -0.009,0.210 l 0.684,0.035 l -0.009,-0.237 L 101.389,59.732 L 101.389,59.732 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <g id="gr">
                            <path className="mainland" d="M 105.268,42.379 l -0.017,0.201 l 0.698,0.351 l 0.333,0.128 l -0.175,0.184 l -0.389,0.040 l -0.056,0.176 l 0.134,0.303 l 0.436,0.232 l 0.190,0.017 l 0.024,-0.520 l 0.285,-0.344 l -0.778,-0.920 l 0.103,-0.312 l 0.182,-0.008 l 0.278,0.223 l 0.175,-0.087 l 0.056,-0.312 l 0.651,0.093 l 0.198,-0.565 l -0.341,0.240 l -1.000,-0.024 l -0.650,0.336 L 105.268,42.379 L 105.268,42.379 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 106.783,44.338 l 0.246,0.008 l 0.103,0.152 h 0.358 l 0.238,-0.087 l 0.080,0.096 l -0.158,0.208 l -0.698,0.024 l -0.127,-0.167 l -0.134,-0.080 L 106.783,44.338 L 106.783,44.338 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <path id="gt" d="M 58.249,53.525 l 0.894,0.654 l 0.902,-1.120 l -0.154,-0.232 l -0.308,-0.011 v -0.656 l -0.231,-0.140 l -0.698,0.208 l 0.267,0.615 L 58.249,53.525 L 58.249,53.525 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="gw" d="M 90.474,55.486 l 0.211,0.418 l 0.592,-0.510 l 0.006,-0.157 l -0.698,-0.101 L 90.474,55.486 L 90.474,55.486 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="gy" d="M 71.845,56.934 l 1.089,0.986 l -0.433,0.501 l -0.035,0.297 l 0.568,0.586 l -0.014,0.564 l -0.989,0.377 l -0.593,-0.801 l 0.127,-0.962 l -0.253,-0.716 L 71.845,56.934 L 71.845,56.934 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="hn" d="M 60.160,53.112 l 1.393,-0.053 l 0.413,0.491 l -0.258,-0.059 l -0.496,0.021 l -0.648,0.609 l -0.277,0.617 l -0.182,-0.097 l -0.002,-0.675 l -0.401,-0.268 L 60.160,53.112 L 60.160,53.112 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="hr" d="M 103.595,38.995 l -0.532,0.439 h -0.540 l -0.065,0.380 l 0.247,0.065 l 0.124,-0.184 l 0.194,0.170 l 0.155,0.543 l 1.066,0.498 l 0.106,-0.121 l -1.081,-1.116 l 0.110,-0.203 l 1.027,-0.039 l 0.104,-0.327 l -0.669,0.019 L 103.595,38.995 L 103.595,38.995 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="ht" d="M 66.690,51.091 l 0.519,0.054 l -0.062,0.636 l -0.051,0.335 l -0.605,-0.033 l -0.107,0.162 l -0.185,-0.013 l -0.066,-0.348 l 0.638,-0.053 l -0.039,-0.362 l -0.293,-0.121 L 66.690,51.091 L 66.690,51.091 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="hu" d="M 103.764,38.157 l -0.175,0.274 l 0.014,0.419 l 0.279,0.143 l 0.858,0.026 l 1.196,-1.007 l 0.006,-0.223 l -0.129,-0.065 l -0.864,0.392 L 103.764,38.157 L 103.764,38.157 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <g id="id">
                            <path d="M 137.802,57.453 l -0.042,0.344 l 1.024,1.720 h 0.298 l 2.133,3.569 l 0.854,0.086 l 0.426,-1.247 l -0.683,-0.430 l -0.128,-0.687 L 137.802,57.453 L 137.802,57.453 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 147.912,62.208 l 0.341,0.418 l -0.222,0.627 v 0.119 h 0.504 l 0.178,-1.568 l 0.163,0.045 l 0.295,1.432 l 0.282,0.076 l 0.267,-0.613 l -0.267,-0.926 l -0.222,-0.403 l 0.697,-0.508 l -0.163,-0.225 l -0.666,0.433 h -0.178 l -0.325,-0.478 l 0.104,-0.209 l 0.549,-0.268 l 0.829,0.253 l 0.252,-0.016 l 0.622,-0.582 l -0.252,-0.253 l -0.578,0.447 h -0.371 l -0.562,-0.268 l -0.399,0.015 l -0.445,0.716 l -0.282,1.239 L 147.912,62.208 L 147.912,62.208 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 151.630,59.402 l -0.282,0.686 l 0.445,0.582 h 0.148 l 0.193,-0.388 l 0.104,-0.134 l -0.193,-0.209 l -0.282,-0.104 L 151.630,59.402 L 151.630,59.402 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 152.505,61.657 l -0.607,0.134 l -0.178,0.194 l 0.148,0.253 l 0.400,-0.149 l 0.252,-0.149 l 0.371,0.299 l 0.163,-0.134 l -0.295,-0.359 L 152.505,61.657 L 152.505,61.657 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 142.429,63.597 l -0.415,0.283 l 0.089,0.238 l 1.319,0.299 l 0.666,0.119 l 0.282,0.299 l 0.755,0.060 l 0.356,0.298 l 0.326,-0.075 l 0.297,-0.268 l -0.549,-0.253 l -0.474,-0.403 l -1.230,-0.299 L 142.429,63.597 L 142.429,63.597 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 146.742,64.895 l -0.325,0.179 l 0.193,0.209 l 0.474,-0.179 L 146.742,64.895 L 146.742,64.895 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 147.304,64.761 l 0.059,0.283 l 0.341,0.089 l 0.133,-0.164 l -0.148,-0.225 L 147.304,64.761 L 147.304,64.761 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 148.120,65.507 l -0.415,0.061 l 0.371,0.314 h 0.295 L 148.120,65.507 L 148.120,65.507 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 148.237,65.014 l -0.089,0.179 l 0.667,0.104 l 0.519,-0.298 l -0.295,-0.089 l -0.474,0.134 l -0.178,-0.149 L 148.237,65.014 L 148.237,65.014 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 150.416,65.120 l -0.770,0.642 l 0.074,0.164 l 0.325,-0.060 l 0.385,-0.359 l 0.755,-0.104 l -0.148,-0.253 L 150.416,65.120 L 150.416,65.120 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 154.305,60.735 l -0.629,0.071 l -0.404,0.295 l 0.167,0.338 l 0.685,0.127 v 0.127 l -0.433,0.351 l 0.209,0.731 l 0.209,0.014 l 0.181,-0.718 h 0.335 l 0.141,0.702 l 1.633,1.351 l 0.042,1.056 l 0.558,0.605 l 0.252,-0.013 l 0.056,-3.727 l -0.949,-0.660 l -0.894,0.605 l -0.321,0.197 l -0.531,-0.338 l -0.014,-1.069 L 154.305,60.735 L 154.305,60.735 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 146.728,58.482 l -0.348,1.309 l -1.889,0.638 l -0.565,-0.664 l -0.274,0.076 l 0.513,1.978 l 0.767,0.086 l 1.024,0.388 v 0.388 l 0.469,-0.086 l 0.683,-0.945 v -0.774 l 0.384,-0.774 l 0.426,0.086 l -0.512,-1.075 l -0.078,-0.692 L 146.728,58.482 L 146.728,58.482 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <path id="ie" d="M 95.135,34.681 l -0.137,0.905 l -1.217,0.447 h -0.388 l -0.276,-0.194 v -0.167 l 0.609,-0.390 l -0.166,-0.335 l 0.027,-0.473 l 0.526,0.027 l 0.241,-0.567 l -0.032,0.504 l 0.409,0.324 L 95.135,34.681 L 95.135,34.681 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="il" d="M 111.089,45.464 l -0.238,0.758 l 0.309,0.909 l 0.354,-1.328 v -0.285 L 111.089,45.464 L 111.089,45.464 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="in" d="M 130.037,56.765 l 0.690,-0.338 l 0.410,-1.484 l -0.018,-1.821 l 2.349,-2.536 v -0.601 l 0.484,-0.189 l -0.018,-0.695 l -0.522,-1.015 l 0.299,-0.544 l 0.653,0.602 l 0.839,0.038 v 0.338 l -0.261,0.282 l 0.055,0.151 l 0.448,0.018 l 0.093,0.507 h 0.131 l 0.336,-0.602 l 0.167,-1.577 l 0.559,-0.395 l 0.018,-0.544 l -0.223,-0.433 l -0.354,-0.018 l -1.387,0.917 l 0.087,0.590 l -0.974,-0.003 l -0.344,-0.420 l -0.187,0.024 l 0.063,0.585 l -2.106,-0.151 l -1.306,-0.582 l -0.069,-0.716 l -0.870,-0.540 l -0.010,-1.111 l -0.597,-0.683 l -1.372,0.131 l 0.149,0.597 l 0.672,0.544 l -1.163,2.379 l -0.778,0.059 l -0.128,0.287 l 0.766,0.709 l -0.038,0.716 l -0.783,-0.012 l -0.084,0.356 l 0.650,-0.029 l 0.018,0.282 l -0.466,0.244 l 0.298,0.564 l 0.578,0.188 l 0.354,-0.262 l 0.167,-0.469 l 0.205,-0.093 l 0.243,0.244 l -0.074,0.602 l -0.167,0.282 l 0.038,0.488 L 130.037,56.765 L 130.037,56.765 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="iq" d="M 113.953,43.499 l -0.235,1.162 l -0.974,0.811 l 0.062,0.383 l 0.952,0.065 l 1.515,1.233 l 0.847,-0.024 l 0.023,-0.285 l 0.310,-0.333 l 0.434,0.246 l 0.057,-0.054 l -0.840,-1.117 l -0.398,-0.024 l -0.529,-0.680 l 0.105,-0.500 l 0.162,-0.021 l 0.056,-0.222 l -0.721,-0.758 L 113.953,43.499 L 113.953,43.499 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="ir" d="M 114.758,42.432 l -0.184,0.192 l 0.018,0.303 l 0.229,0.321 l 0.813,0.890 l -0.124,0.356 h -0.142 l -0.071,0.356 l 0.460,0.588 l 0.424,0.036 l 0.849,1.174 l 0.477,0.036 l 0.371,0.267 l 0.018,0.534 l 1.467,0.855 h 0.548 l 0.336,-0.285 l 0.424,-0.018 l 0.247,0.570 l 1.585,0.220 l 0.047,-0.582 l 0.525,-0.190 l 0.024,-0.208 l -0.418,-0.570 l -0.930,-0.748 l 0.489,-0.445 l -0.035,-0.196 l -0.612,-0.095 l -0.259,-2.066 l -0.030,-0.475 l -1.660,-0.635 l -0.736,0.166 l -0.412,0.505 l -0.365,-0.024 l -0.105,0.089 l -0.813,-0.053 l -1.025,-0.748 l -0.382,-0.418 l -0.175,0.042 l -0.315,0.360 L 114.758,42.432 L 114.758,42.432 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="is" d="M 90.137,27.257 l -0.295,-0.167 l -0.398,0.252 l -0.342,0.316 l 0.009,0.177 l 0.443,0.056 l -0.027,0.317 l -0.157,0.158 l 0.038,0.103 l 0.443,0.029 v 0.512 l 0.638,0.112 l 0.379,0.214 l 0.425,0.018 l 0.730,-0.363 l 0.564,-0.745 l 0.009,-0.504 l -0.342,-0.290 l -0.286,-0.243 l -0.130,0.093 l -0.194,0.252 l -0.222,-0.029 l -0.222,-0.243 l -0.286,0.027 l -0.416,0.345 l -0.251,0.270 l -0.139,-0.120 l -0.009,-0.299 l 0.139,-0.093 L 90.137,27.257 L 90.137,27.257 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <g id="it">
                            <path className="mainland" d="M 100.075,39.270 l -0.093,0.237 l 0.025,0.258 l 0.360,0.421 l 0.567,-0.020 l 1.252,1.454 l 0.781,0.226 l 0.462,0.436 l 0.110,0.993 l 0.247,-0.144 l 0.214,-0.541 l -0.053,-0.389 l 0.366,-0.033 l 0.053,-0.220 l -1.033,-0.494 l -0.980,-0.963 l -0.390,-0.576 l -0.095,-0.547 l 0.499,-0.119 l -0.128,-0.360 l -0.306,-0.258 l -0.264,-0.012 l -0.368,0.101 l -0.347,0.485 l -0.209,0.139 l -0.324,-0.199 L 100.075,39.270 L 100.075,39.270 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 103.116,43.196 l -0.219,-0.118 l -0.746,0.118 l 0.025,0.202 l 0.671,0.338 l 0.101,0.110 l 0.177,0.026 L 103.116,43.196 L 103.116,43.196 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 100.872,41.743 l -0.399,0.202 l 0.053,0.780 l 0.320,0.054 l 0.240,-0.229 v -0.739 L 100.872,41.743 L 100.872,41.743 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <path id="jm" d="M 64.891,51.726 l -0.525,0.133 v 0.147 l 0.306,0.176 h 0.321 l 0.204,-0.235 L 64.891,51.726 L 64.891,51.726 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="jo" d="M 111.629,45.874 l -0.371,1.294 l -0.017,0.198 h 0.584 l 0.653,-0.576 l 0.016,-0.219 l -0.267,-0.273 l 0.478,-0.396 l -0.069,-0.368 l -0.131,0.030 l -0.398,0.285 L 111.629,45.874 L 111.629,45.874 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <g id="jp">
                            <path d="M 149.977,42.201 l -0.246,0.247 l 0.101,0.348 l 0.216,0.015 l 0.145,0.756 l 0.173,0.188 l 0.303,-0.276 l 0.026,-0.833 l -0.349,-0.371 L 149.977,42.201 L 149.977,42.201 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 151.263,41.502 l -0.464,0.376 l -0.103,0.474 l 0.316,0.218 l 0.458,-0.480 l 0.065,-0.534 L 151.263,41.502 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 150.727,40.777 l -0.736,0.843 v 0.405 l 0.454,-0.054 l 0.713,-0.627 l 0.476,-0.088 l 0.116,0.136 l 0.003,0.415 l 0.120,0.218 h 0.219 l 0.308,-0.376 l 0.130,-0.495 l 0.620,-0.015 l 0.606,-0.727 l -0.316,-1.206 l -0.145,-0.639 l 0.317,-0.261 l -0.721,-1.089 l -0.165,-0.130 l -0.327,0.130 l -0.084,0.451 v 0.363 l 0.173,0.204 l 0.057,0.959 l -0.447,0.552 l -0.259,-0.160 l -0.202,0.451 l -0.044,0.421 l 0.159,0.247 l -0.101,0.188 l -0.332,-0.276 h -0.231 l -0.202,0.116 L 150.727,40.777 L 150.727,40.777 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 151.968,34.212 l -0.230,0.204 l 0.116,0.436 l 0.202,0.203 l -0.015,0.668 l -0.259,0.101 l -0.202,0.451 l 0.591,0.813 l 0.389,-0.131 l 0.072,-0.204 l -0.418,-0.377 l 0.259,-0.335 l 0.274,0.044 l 0.598,0.402 l 0.065,-0.451 l 0.284,-0.520 l 0.398,-0.403 l -0.431,-0.196 l -0.165,-0.314 l -0.216,0.145 l -0.187,0.232 l -0.404,-0.087 l -0.418,-0.276 L 151.968,34.212 L 151.968,34.212 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 154.144,33.762 l -0.404,0.567 l 0.029,0.276 l 0.202,-0.088 l 0.475,-0.596 L 154.144,33.762 L 154.144,33.762 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 154.677,32.934 l -0.145,0.392 l 0.015,0.261 l 0.246,-0.160 l 0.231,-0.464 v -0.173 L 154.677,32.934 L 154.677,32.934 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <path id="ke" d="M 111.920,58.802 l 0.401,0.782 l -0.481,1.009 l -0.063,0.306 l 2.402,1.485 l 0.745,-1.170 l -0.377,-0.306 l -0.008,-1.541 l 0.472,-0.516 l -0.752,0.250 l -0.568,0.008 l -0.890,-0.751 l -0.280,-0.121 l -0.520,0.048 l -0.092,0.154 L 111.920,58.802 L 111.920,58.802 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="kg" d="M 124.884,39.606 l -0.047,0.382 l 0.038,0.235 l 1.312,0.440 l -1.152,0.464 l -0.131,-0.109 l -0.249,0.160 l 0.012,0.087 l 0.133,0.060 l 0.809,0.021 l 0.410,-0.124 l 0.526,-0.663 l 0.659,0.114 l 0.795,-1.101 l -2.126,-0.290 l -0.294,0.713 l -0.371,-0.398 L 124.884,39.606 L 124.884,39.606 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="kh" d="M 140.516,54.723 l 0.617,0.659 l 1.147,-0.850 l 0.101,-1.342 l -0.592,0.409 l -0.308,-0.172 l -0.418,-0.056 l -0.234,-0.164 l -0.113,0.006 l -0.306,0.502 l 0.050,0.232 l 0.311,0.173 l -0.038,0.472 L 140.516,54.723 L 140.516,54.723 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="km" d="M 115.970,65.544 l 0.069,0.230 l 0.298,0.047 l 0.114,-0.300 L 115.970,65.544 L 115.970,65.544 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="kp" d="M 146.216,38.861 l 0.277,0.116 l 0.084,0.971 l 0.550,0.032 l 0.519,-0.608 l -0.179,-0.160 l 0.021,-0.651 l 0.476,-0.576 l -0.243,-0.437 l 0.158,-0.181 l 0.087,-0.452 l -0.276,-0.125 l -0.235,0.119 l -0.291,0.883 l -0.470,-0.040 l -0.544,0.642 L 146.216,38.861 L 146.216,38.861 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="kr" d="M 147.732,39.454 l 0.932,0.760 l 0.159,0.736 l -0.032,0.395 l -0.455,0.513 l -0.392,0.021 l -0.445,-0.960 l -0.169,-0.459 l 0.179,-0.139 l -0.042,-0.192 l -0.222,-0.099 L 147.732,39.454 L 147.732,39.454 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="kw" d="M 116.814,46.838 l -0.339,-0.184 l -0.235,0.237 l 0.025,0.474 l 0.548,0.209 L 116.814,46.838 L 116.814,46.838 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="kz" d="M 115.819,38.009 l 0.618,-0.264 l 0.691,-0.024 l 0.048,1.056 h -0.404 l -0.309,0.504 l 0.404,0.671 l 0.596,0.336 l 0.054,0.385 l 0.219,-0.073 l 0.202,-0.240 l 0.333,0.073 l 0.167,0.336 h 0.428 v -0.431 l -0.262,-0.768 l -0.119,-0.623 l 0.761,-0.336 l 1.024,0.167 l 0.643,0.647 l 1.452,-0.143 l 0.810,1.151 l 0.952,0.048 l 0.262,-0.431 l 0.333,-0.073 l 0.048,-0.479 l 0.499,-0.024 l 0.262,0.312 l 0.263,-0.623 l 2.260,0.312 l 0.380,-0.504 l -0.642,-0.791 l 0.856,-1.870 l 0.690,0.048 l 0.476,-1.150 l -0.952,-0.097 l -0.547,-0.527 l -1.508,0.175 l -1.942,-1.877 l -0.685,0.607 l -2.076,-0.942 l -2.547,1.247 l -0.071,0.887 l 0.595,0.695 l -1.161,0.656 l -1.506,-0.033 l -0.315,-0.463 l -1.181,-0.065 l -1.119,0.719 l -0.024,0.983 L 115.819,38.009 L 115.819,38.009 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="la" d="M 139.760,49.214 l -0.365,0.185 l -0.303,0.884 l 0.507,0.645 l -0.085,0.713 l 0.085,0.034 l 0.843,-0.409 l 1.131,1.263 l -0.027,0.796 l 0.246,0.133 l 0.607,-0.493 l -0.050,-0.390 l -1.754,-1.666 l 0.017,-0.255 l 0.219,-0.152 l -0.152,-0.425 l -0.725,-0.119 L 139.760,49.214 L 139.760,49.214 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="lb" d="M 111.222,44.616 l 0.009,0.294 l -0.123,0.447 l 0.425,0.036 l 0.027,-0.633 L 111.222,44.616 L 111.222,44.616 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="lc" d="M 71.382,53.903 l -0.107,0.228 l 0.173,0.187 l 0.226,-0.121 L 71.382,53.903 L 71.382,53.903 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="lk" d="M 131.478,56.017 l 0.038,0.410 l 0.038,0.299 l -0.222,0.038 l 0.112,0.671 l 0.333,0.187 l 0.517,-0.298 l -0.148,-0.707 l 0.038,-0.261 l -0.481,-0.446 L 131.478,56.017 L 131.478,56.017 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="lr" d="M 92.219,57.697 l 1.656,1.107 l -0.040,-0.838 l -0.500,-0.590 l -0.489,-0.433 L 92.219,57.697 L 92.219,57.697 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="ls" d="M 108.389,73.710 l 0.460,-0.354 l 0.217,0.009 l 0.262,0.327 l -0.027,0.327 l -0.442,0.163 v 0.127 l -0.487,-0.027 l -0.118,-0.354 L 108.389,73.710 L 108.389,73.710 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="lt" d="M 105.117,33.312 l -0.374,0.063 l 0.030,0.353 l 0.585,0.044 l 0.222,0.182 l 0.058,0.316 l 0.180,0.252 l 0.535,-0.023 l 0.512,-0.653 l -0.030,-0.388 l -0.965,-0.151 L 105.117,33.312 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="lu" d="M 99.585,37.210 l 0.133,0.118 l 0.154,0.014 l 0.034,-0.302 l -0.044,-0.170 l -0.214,0.102 L 99.585,37.210 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="lv" d="M 106.980,32.393 l -1.110,-0.181 l -0.189,0.492 l -0.320,0.096 l -0.167,-0.205 l -0.168,-0.316 l -0.181,0.133 l -0.103,0.546 v 0.298 l 0.391,-0.065 l 0.814,0.014 l 0.980,0.182 l 0.392,-0.115 l -0.023,-0.440 L 106.980,32.393 L 106.980,32.393 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="ly" d="M 101.248,46.967 l 0.235,-0.039 l 0.069,-0.543 h 0.118 l 0.481,-0.790 l 1.187,0.345 l 0.324,0.504 l 1.167,0.534 l 0.607,-0.256 l -0.059,-0.257 l -0.265,-0.256 l 0.030,-0.178 l 0.431,-0.365 h 0.854 l 0.324,0.434 l 0.686,0.099 l 0.089,5.563 l -0.510,-0.020 l -3.079,-1.601 l -0.333,0.189 l -1.265,-0.316 l -0.344,-0.454 l -0.501,-0.069 l -0.254,-0.454 L 101.248,46.967 L 101.248,46.967 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="ma" d="M 96.459,44.592 h -1.741 l -0.341,0.757 l -0.786,0.379 l -0.649,1.755 l -1.263,0.757 l -1.775,2.924 l 1.741,-0.035 l 0.068,-0.859 h 0.443 v -1.170 h 1.537 l 0.034,-1.514 l 1.469,-0.344 l 0.615,-0.998 l 0.956,-0.035 L 96.459,44.592 L 96.459,44.592 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="md" d="M 107.385,37.872 l 0.468,0.719 l -0.039,0.407 l 0.167,0.008 l 0.396,-0.671 l -0.476,-0.591 L 107.630,37.632 L 107.385,37.872 L 107.385,37.872 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="me" d="M 104.688,40.541 l -0.221,0.312 l 0.063,0.192 l 0.262,0.048 l 0.207,-0.280 L 104.688,40.541 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="mg" d="M 118.173,65.798 l -0.321,0.763 l -0.550,0.971 l -0.963,0.069 l -0.413,0.485 l 0.069,1.481 l -0.597,0.694 l 0.069,1.179 l 0.505,0.578 l 0.597,-0.069 l 0.597,-0.440 l -0.137,-0.694 l 1.377,-2.382 l -0.276,-0.300 l 0.276,-0.578 l 0.298,0.092 l 0.092,-0.231 l -0.276,-1.179 l -0.161,-0.486 L 118.173,65.798 L 118.173,65.798 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="mk" d="M 105.902,40.933 l -0.508,0.167 l 0.024,0.431 l 0.119,0.152 l 0.603,-0.280 L 105.902,40.933 L 105.902,40.933 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="ml" d="M 92.112,54.176 l 0.464,-0.318 l 2.581,-0.015 l -0.597,-4.153 l 0.682,-0.020 l 3.297,2.517 l 0.443,0.063 l -0.167,1.399 l -2.073,0.188 l -1.600,1.194 l -0.291,0.817 l -1.111,0.047 l -0.283,-0.816 l -0.852,0.060 l 0.033,-0.267 L 92.112,54.176 L 92.112,54.176 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="mm" d="M 138.851,55.354 l -0.418,-0.669 l 0.303,-0.425 l -0.286,-0.526 l -0.270,-0.051 l -0.051,-0.883 l -0.404,-0.783 l -0.118,0.187 l -0.270,0.458 l -0.338,0.051 l -0.169,-0.222 l -0.084,-0.596 l -0.253,-0.476 l -1.031,-0.973 l 0.253,-0.167 l 0.047,-0.704 l 0.377,-0.633 l 0.163,-1.575 l 0.546,-0.373 l 0.018,-0.574 l 0.327,0.108 l 0.516,0.746 l -0.383,0.820 l 0.258,0.644 l 0.638,0.250 l 0.116,0.701 l 0.856,0.133 l -0.237,0.409 l -1.079,0.425 l -0.118,0.697 l 0.793,1.019 l 0.033,0.544 l -0.185,0.187 l 0.016,0.170 l 0.591,0.867 l 0.017,0.900 L 138.851,55.354 L 138.851,55.354 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="mn" d="M 130.462,35.227 l 0.877,-1.164 l 1.054,0.487 l 0.716,0.192 l 0.877,-0.805 l -0.596,-0.439 l 0.392,-0.553 l 1.170,0.413 l 0.406,0.665 l 0.732,0.020 l 0.383,-0.285 l 0.789,-0.032 l 0.172,0.293 l 1.310,0.066 l 0.829,-0.846 l 1.147,0.120 l -0.066,1.152 l 0.502,0.114 l 0.617,-0.280 l 0.653,0.323 l -0.015,0.163 l -0.473,0.014 l -0.493,1.034 l -0.383,0.038 l -1.490,1.947 l -1.522,0.671 l -0.952,0.074 l -0.790,-0.510 l -1.010,0.540 l -0.995,-0.309 l -0.282,-0.722 l -1.885,-0.133 l -0.965,-1.636 l -0.469,-0.030 L 130.462,35.227 L 130.462,35.227 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="mr" d="M 89.916,51.284 l 0.329,0.430 l -0.068,1.858 l 0.478,-0.344 l 0.340,-0.069 l 0.478,0.172 l 0.546,0.757 l 0.513,-0.344 l 2.492,-0.035 l -0.615,-4.163 l 0.660,-0.003 l -1.230,-0.942 l 0.002,0.612 l -1.558,0.002 l -0.008,1.168 l -0.448,-0.002 l -0.057,0.862 L 89.916,51.284 L 89.916,51.284 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="mt" d="M 103.141,44.320 l -0.252,0.051 l 0.009,0.279 l 0.226,0.076 l 0.101,-0.084 L 103.141,44.320 L 103.141,44.320 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="mu" d="M 121.296,69.729 l -0.229,0.300 l 0.045,0.324 l 0.483,-0.394 L 121.296,69.729 L 121.296,69.729 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <g id="mv">
                            <path d="M 127.838,57.934 l 0.045,0.394 l 0.252,0.092 l 0.045,-0.347 L 127.838,57.934 L 127.838,57.934 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 128.159,58.766 l -0.023,0.486 l 0.184,0.092 l 0.161,-0.324 L 128.159,58.766 L 128.159,58.766 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 128.206,59.714 l -0.161,0.161 l 0.184,0.161 l 0.229,-0.161 L 128.206,59.714 L 128.206,59.714 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <path id="mw" d="M 111.367,66.775 l 0.469,0.490 l -0.009,0.627 l 0.091,0.264 l 0.623,-0.672 l -0.072,-0.855 l -0.334,-0.255 l -0.297,-1.501 l -0.514,-0.018 l 0.234,1.081 L 111.367,66.775 L 111.367,66.775 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="mx" d="M 49.596,43.560 l 0.728,2.293 l -0.339,0.190 l 0.038,0.455 l 0.641,0.493 v 0.912 l 0.792,0.760 l -0.339,-2.241 l -0.452,-1.482 l 0.113,-1.025 l 0.377,0.038 l 0.151,0.342 l -0.151,0.873 l 1.960,3.836 v 1.368 l 1.583,1.861 l 1.734,0.798 l 0.716,-0.418 l 1.018,0.835 l 0.603,-0.608 l -0.264,-0.685 l 0.867,-0.265 l 0.264,0.152 l 0.264,-0.265 h 0.415 l 0.754,-1.330 l -0.377,-0.342 l -1.470,0.342 l -0.339,0.988 L 58.014,51.587 l -1.018,-0.418 l -0.452,-1.443 l 0.342,-1.820 l -0.700,-0.436 l -0.333,-1.748 l -0.279,-0.119 l -0.510,0.517 l -0.585,-0.312 l -0.229,-1.166 l -2.318,-0.243 l -1.197,-0.900 L 49.596,43.560 L 49.596,43.560 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <g id="my">
                            <path className="mainland" d="M 139.344,57.133 l 0.303,0.680 l 0.068,0.883 l 0.405,0.629 l 0.889,0.538 l 0.174,-0.138 l 0.255,-0.050 l -0.037,-0.333 l -0.321,-0.781 l -0.470,-1.000 l -0.040,0.175 l -0.567,-0.025 l -0.407,-0.585 L 139.344,57.133 L 139.344,57.133 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 144.083,59.767 l 0.455,0.526 l 1.746,-0.605 l 0.345,-1.333 l 0.778,-0.056 l 0.712,-0.516 l -0.923,-0.672 l -0.211,-0.370 l -0.455,0.840 l 0.167,0.482 l -0.278,0.403 l -0.523,-0.134 l -1.268,0.930 l 0.033,0.538 L 144.083,59.767 L 144.083,59.767 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <path id="mz" d="M 110.464,71.884 l 0.406,0.336 l 0.956,-0.582 l 0.154,-0.864 v -1.427 l 1.533,-1.254 l 0.263,0.009 l 0.928,-0.891 l -0.144,-1.837 l -2.409,0.304 l 0.091,0.582 l 0.352,0.306 l 0.099,1.000 l -0.830,0.810 l -0.199,-0.454 l 0.036,-0.600 l -0.478,-0.519 l -1.173,0.546 l 1.092,0.555 l 0.036,1.618 l -0.722,1.072 L 110.464,71.884 L 110.464,71.884 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="na" d="M 103.736,73.193 l 0.505,0.036 l 0.297,0.300 l 0.704,0.009 l 0.172,-1.999 v -1.309 l 0.451,-0.091 l 0.172,-1.372 l 1.146,-0.036 l 0.405,-0.336 l -0.686,-0.027 l -0.929,0.127 l -1.001,-0.363 h -2.814 l 0.072,0.799 l 0.938,1.381 l -0.163,0.709 l 0.009,0.373 L 103.736,73.193 L 103.736,73.193 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="nc" d="M 165.570,72.968 l -0.053,0.270 l 0.695,0.970 l 0.374,0.162 l 0.053,-0.377 L 165.570,72.968 L 165.570,72.968 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="ne" d="M 98.359,55.105 l 0.384,-0.009 l 0.347,-0.520 l 0.582,-0.104 l 0.620,0.379 l 1.322,0.038 l 1.022,-0.416 l 0.384,-0.330 l 0.029,-0.434 l 0.713,-0.719 l 0.188,-1.588 l -0.469,-0.983 l -1.200,-0.293 l -2.778,2.165 l -0.394,-0.038 l -0.169,1.503 l -1.417,0.142 L 98.359,55.105 L 98.359,55.105 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="ng" d="M 98.461,57.724 l 0.591,0.029 l 0.713,0.795 l 0.347,0.095 l 0.272,-0.133 l 0.413,-0.057 l 0.140,-0.576 l 0.563,-0.369 l 0.609,-0.028 l 1.116,-2.052 l -0.018,-0.463 l -0.515,-0.396 l -1.031,0.454 l -1.380,-0.019 l -0.658,-0.416 l -0.469,0.104 l -0.244,0.425 l -0.018,1.200 l -0.394,0.558 L 98.461,57.724 L 98.461,57.724 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="ni" d="M 61.696,53.614 l 0.330,0.066 l 0.011,0.677 l -0.384,1.098 l -1.036,-0.103 l -0.231,-0.529 l 0.308,-0.642 l 0.583,-0.543 L 61.696,53.614 L 61.696,53.614 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="nl" d="M 99.746,34.941 l -0.683,0.336 l 0.145,0.131 l 0.015,0.336 l -0.145,-0.029 l -0.160,-0.249 l -0.382,0.605 l 0.587,0.122 l 0.219,0.231 l 0.116,0.003 l 0.077,-0.522 l 0.369,-0.155 L 99.746,34.941 L 99.746,34.941 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <g id="no">
                            <path className="mainland" d="M 106.587,24.970 l 0.305,-0.223 l -0.027,-0.250 l -0.193,-0.112 l 0.027,-0.306 h 0.166 v -0.167 l -0.719,-0.194 l -1.078,0.112 l -0.110,0.473 l -0.249,-0.083 l -0.166,-0.279 l -0.526,0.027 l -0.056,0.529 l -0.249,0.112 l -0.139,-0.279 l -1.107,0.891 l 0.222,0.250 l -0.415,0.194 l -0.941,1.867 l -0.332,0.223 l 0.027,0.167 l 0.331,0.167 l -0.083,0.362 l -0.553,-0.029 l -0.166,-0.194 l -0.359,0.418 l -0.222,0.167 l -0.056,0.391 l -0.193,0.112 l -0.498,0.112 l -0.249,0.781 l 0.166,1.282 l 0.193,0.585 l 0.222,0.223 l 0.498,-0.027 l 0.719,-0.697 l 0.276,-0.473 l 0.083,0.696 l 0.470,-0.835 l 0.027,-2.342 l 0.383,-0.241 l 0.115,-1.292 l 1.161,-1.672 l 0.553,-0.194 l 0.249,-0.306 l 0.829,0.194 l 0.415,0.250 l 0.139,-0.696 l 0.692,-0.418 L 106.587,24.970 L 106.587,24.970 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 102.486,17.705 l -0.249,-0.250 l -0.552,0.268 h -1.013 l -0.160,0.591 l 0.569,0.502 l 0.249,-0.036 l 0.356,-0.609 l 0.302,0.215 l -0.214,0.430 l -0.107,0.627 l 0.249,0.394 l 0.534,-0.896 l 0.694,-0.843 l -0.267,-0.232 L 102.486,17.705 L 102.486,17.705 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 102.787,16.630 l -0.445,0.411 l 0.267,0.411 h 0.480 l 0.196,0.268 l 0.587,0.305 l 0.675,-0.394 l 0.463,-0.394 l -0.160,-0.323 l -0.463,-0.268 l -0.338,0.305 l -0.230,-0.287 l -0.178,0.018 l -0.231,0.502 l -0.338,-0.341 l -0.036,-0.232 L 102.787,16.630 L 102.787,16.630 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 103.800,18.475 l -0.356,0.323 l -0.302,0.232 l 0.142,0.250 l 0.285,0.089 l 0.463,-0.216 l 0.214,-0.268 l -0.196,-0.323 L 103.800,18.475 L 103.800,18.475 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <path id="np" d="M 130.068,46.142 l 0.069,0.644 l 1.218,0.552 l 1.952,0.145 l -0.074,-0.472 l -1.304,-0.359 l -1.107,-0.659 L 130.068,46.142 L 130.068,46.142 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <g id="nz">
                            <path d="M 166.532,82.240 l 0.160,1.779 l -0.214,0.808 l -0.802,0.592 l 0.053,0.701 v 0.754 l 0.214,0.270 l 2.194,-1.886 v -0.431 h -0.535 l -0.750,-2.533 L 166.532,82.240 L 166.532,82.240 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 164.927,86.121 l 0.428,0.808 l -1.178,1.132 l -0.107,0.592 l -0.802,0.107 l -1.337,1.239 l -1.230,-0.592 l -0.107,-0.432 l 2.247,-0.970 L 164.927,86.121 L 164.927,86.121 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <path id="om" d="M 119.090,51.914 l 1.114,-0.642 l 0.198,-0.942 l -0.244,-0.140 l 0.101,-1.010 l 0.213,-0.124 l 0.228,0.357 l 1.356,0.709 v 0.394 l -1.642,2.417 l -0.755,0.026 L 119.090,51.914 L 119.090,51.914 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="pa" d="M 62.126,56.252 l -0.220,0.687 l 0.727,0.188 l 0.451,0.089 l 0.077,-0.532 l 0.484,-0.244 l 0.430,0.222 l 0.169,0.270 l 0.205,-0.024 l 0.161,-0.490 l -0.537,-0.222 l -0.407,-0.222 l -0.407,0.277 l -0.484,0.244 l -0.495,-0.199 L 62.126,56.252 L 62.126,56.252 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="pe" d="M 62.795,62.270 l -0.293,0.296 l 0.020,0.471 l 2.554,4.656 l 2.652,1.710 l 0.410,-0.687 l 0.098,-1.512 l -0.214,-0.942 l -0.722,-1.218 l -0.430,0.137 l -0.194,0.216 l -0.858,-0.983 l 0.214,-1.159 l 0.995,-0.648 l -0.078,-0.609 l -1.013,-0.039 l -0.526,-0.883 l -0.293,-0.098 l 0.020,0.531 l -1.306,1.552 l -0.976,-0.235 L 62.795,62.270 L 62.795,62.270 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <g id="pg">
                            <path className="mainland" d="M 157.446,62.085 l -0.056,3.685 l 0.531,-0.029 l 0.698,-0.816 l 0.586,0.029 l 0.377,0.338 l 0.125,1.040 l 1.200,0.633 l 0.308,-0.113 v -0.380 l -0.963,-0.802 l -0.475,-1.098 l 0.377,-0.183 l -0.279,-0.605 l -0.558,-0.014 l -0.140,-0.647 l -1.479,-0.998 L 157.446,62.085 L 157.446,62.085 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 161.989,63.101 l -0.143,0.033 l -0.087,0.388 l -0.274,0.178 l -0.825,0.145 l 0.033,0.310 l 0.869,-0.043 l 0.550,-0.344 l -0.033,-0.599 L 161.989,63.101 L 161.989,63.101 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 161.625,62.192 l -0.133,0.188 l 0.725,0.642 l 0.099,0.377 l 0.198,-0.023 l 0.023,-0.387 l -0.220,-0.199 L 161.625,62.192 L 161.625,62.192 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <g id="ph">
                            <path d="M 147.888,54.431 l -0.130,0.247 l -0.072,0.305 l -0.721,0.915 l 0.044,0.189 l 0.303,-0.044 l 0.936,-1.046 L 147.888,54.431 L 147.888,54.431 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 149.055,54.083 l -0.015,0.755 l 0.274,0.276 l 0.101,0.537 l 0.275,0.059 l 0.129,-0.335 l -0.216,-0.160 l -0.057,-0.944 L 149.055,54.083 L 149.055,54.083 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 149.834,54.374 l -0.015,0.668 l 0.158,0.261 l 0.274,-0.320 l -0.072,-0.581 L 149.834,54.374 L 149.834,54.374 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 150.006,53.792 l 0.274,0.363 l 0.130,0.348 h 0.246 l -0.044,-0.596 l -0.274,-0.188 L 150.006,53.792 L 150.006,53.792 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 150.540,55.158 l 0.057,0.436 l -0.505,0.407 l -0.418,0.044 l -0.447,0.480 l 0.015,0.218 l 0.418,-0.131 l 0.288,-0.188 l 0.246,0.624 l 0.433,0.305 l 0.173,-0.059 l 0.158,-0.188 l -0.345,-0.348 l 0.202,-0.160 l 0.231,0.188 l 0.158,-0.261 l -0.158,-0.320 l -0.029,-0.712 L 150.540,55.158 L 150.540,55.158 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 148.191,50.728 l -0.389,0.276 l -0.044,0.872 l 0.607,1.176 l 0.202,0.160 l 0.259,-0.175 l 0.447,0.072 l 0.086,0.392 l 0.332,0.029 l 0.158,-0.217 l -0.202,-0.276 l -0.246,-0.232 l -0.519,-0.057 l -0.274,-0.451 l 0.317,-0.480 l 0.028,-0.421 l -0.216,-0.537 L 148.191,50.728 L 148.191,50.728 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 148.393,53.327 l 0.115,0.407 l 0.202,0.131 l 0.145,-0.189 l -0.231,-0.320 L 148.393,53.327 L 148.393,53.327 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <path id="pk" d="M 122.822,47.240 l 0.392,0.582 l -0.038,0.300 l -0.522,0.207 l -0.038,0.489 h 0.597 l 0.205,-0.169 h 1.137 l 1.025,0.902 l 0.131,-0.433 h 0.765 l 0.018,-0.544 l -0.783,-0.751 l 0.167,-0.413 l 0.802,-0.055 l 1.081,-2.254 l -0.597,-0.469 l -0.223,-0.789 l 1.454,-0.131 l -0.858,-1.221 l -0.457,-0.124 l -0.187,0.226 l -0.140,0.011 l -0.858,0.544 l 0.280,0.470 l -0.317,0.338 l -0.392,1.446 l -0.970,0.620 l -0.131,0.677 L 122.822,47.240 L 122.822,47.240 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="pl" d="M 105.984,35.920 l 0.128,0.235 l 0.030,0.250 l -0.105,0.243 l -0.241,0.465 l -0.204,0.092 l -0.264,-0.115 l -0.158,0.008 l -0.384,0.145 l -0.437,-0.129 l -0.709,-0.502 l -0.694,-0.372 l -0.279,-0.425 l -0.053,-1.003 l 0.543,-0.472 l 0.709,-0.235 l 0.232,-0.024 l 0.055,0.176 l 0.301,0.121 l 0.831,0.016 l 0.256,-0.008 l 0.422,0.647 l -0.105,0.265 l 0.045,0.312 L 105.984,35.920 L 105.984,35.920 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="pr" d="M 69.734,51.947 l -0.398,-0.134 l -0.320,0.200 l 0.160,0.187 l 0.544,0.080 L 69.734,51.947 L 69.734,51.947 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <g id="pt">
                            <path className="mainland" d="M 93.841,41.420 l -0.093,1.304 l -0.267,0.241 l 0.027,0.148 l 0.187,0.309 l -0.121,0.377 l 0.200,0.068 l 0.467,-0.054 l -0.027,-0.377 l 0.306,-1.748 l -0.067,-0.241 L 93.841,41.420 L 93.841,41.420 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 90.411,45.216 l -0.163,0.207 l 0.163,0.207 l 0.246,-0.124 L 90.411,45.216 L 90.411,45.216 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 85.052,42.292 l -0.205,0.207 l 0.368,0.207 l 0.041,-0.288 L 85.052,42.292 L 85.052,42.292 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 86.157,42.168 l -0.246,0.164 l 0.205,0.164 l 0.327,-0.083 L 86.157,42.168 L 86.157,42.168 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 86.320,42.745 l -0.122,0.330 l 0.163,0.207 l 0.205,-0.164 L 86.320,42.745 L 86.320,42.745 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 87.302,43.404 l -0.081,0.207 l 0.122,0.124 l 0.327,-0.207 L 87.302,43.404 L 87.302,43.404 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <path id="py" d="M 72.857,69.808 l 0.332,0.362 l -0.039,0.766 l 0.956,-0.059 l 0.722,0.924 l -0.059,0.825 l -0.468,0.707 L 73.346,73.372 l -0.039,-0.394 l 0.273,-0.649 l -0.936,-0.590 h -0.780 l -0.585,-0.629 l 0.425,-1.215 L 72.857,69.808 L 72.857,69.808 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="qa" d="M 118.223,48.624 l -0.078,0.605 l 0.232,0.177 l 0.211,-0.020 l 0.078,-0.761 l -0.183,-0.131 L 118.223,48.624 L 118.223,48.624 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="ro" d="M 106.092,37.855 l -0.039,0.223 l -0.873,0.727 l 0.730,1.071 l 0.468,0.327 h 0.841 l 0.278,-0.232 l 0.372,-0.048 l 0.278,0.167 l 0.492,-0.559 l -0.095,-0.280 l -0.499,-0.128 l -0.341,-0.017 l 0.016,-0.480 l -0.452,-0.712 L 106.092,37.855 L 106.092,37.855 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="rs" d="M 105.093,38.902 l -0.309,0.232 h -0.151 l -0.103,0.320 l 0.365,0.424 l 0.024,0.336 l -0.154,0.217 l 0.535,0.558 l 0.579,-0.177 l -0.048,-0.824 L 105.093,38.902 L 105.093,38.902 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <g id="ru">
                            <path className="mainland" d="M 152.200,20.565 l 0.265,0.917 l 0.531,0.152 l 0.531,-0.840 l -0.303,-0.573 l 0.113,-0.496 h 0.796 l -0.190,0.382 l 0.076,1.375 l -1.137,2.826 l 0.113,0.611 l -0.038,1.031 l 2.121,3.093 l 0.416,0.115 l 0.038,-2.519 l 0.416,-0.382 l -0.455,-0.992 l 0.379,-0.421 l -0.834,-1.107 l -0.455,0.038 l -0.151,-1.832 l 1.175,-0.306 l 0.075,-0.535 l 0.607,-0.152 l 0.341,0.306 l 0.416,-1.680 l 0.719,-1.221 l 0.568,-0.306 l 0.493,0.038 v -0.573 l -0.796,-0.152 l -1.099,-0.917 l 0.531,-0.611 l -0.455,-1.031 l 0.378,-0.381 l 0.455,0.611 l 1.137,0.421 l 1.250,0.115 l 0.152,-0.534 l -0.644,-0.648 l 0.719,-0.992 l -1.630,-0.573 l -0.416,0.840 l -0.531,-0.687 l -2.993,-1.031 l -2.842,0.496 l -0.416,0.229 v 0.229 l 0.606,0.306 l -0.076,0.725 l -1.099,-0.458 l -2.424,0.955 l -0.417,-0.878 h -1.668 l -0.759,0.802 l -2.690,-0.611 l -2.462,0.496 l -0.303,0.763 l 0.379,0.114 l -0.038,0.573 l -2.387,0.267 l 0.152,0.763 l -2.199,-0.382 l 0.531,-0.992 l -2.236,-0.115 l 0.190,1.031 l -0.719,0.344 l -0.606,-0.573 l -2.462,0.421 l -0.947,0.878 l -0.038,0.534 l -0.606,0.038 l -0.076,-0.611 l 1.933,-1.680 v -1.146 l -1.250,-0.344 l -1.630,0.534 l -0.682,-0.688 h -0.303 l -0.379,0.763 l 0.303,0.344 l -2.161,1.184 l -1.856,1.413 l -1.137,1.565 v 0.648 l 1.212,0.496 l -0.606,0.458 l -1.288,-0.458 l -0.531,0.458 l -0.796,-0.917 l -0.152,0.344 l 0.871,2.749 l 0.228,0.077 l 0.607,-0.306 l 0.303,0.229 v 0.496 l -0.568,-0.229 l -0.341,0.267 l 0.228,0.496 l -0.190,1.298 l -1.175,0.115 l -0.075,-0.421 l 0.682,-0.421 l 0.152,-1.146 l -0.759,-0.992 l -0.265,-1.717 l -1.212,-0.192 l -0.113,0.611 l 0.228,0.306 l -0.493,0.421 l 0.190,1.146 l 0.719,0.306 l 0.152,0.840 l -0.721,-0.458 l -1.856,-0.344 l -0.228,0.611 l -1.478,0.534 l -0.228,-0.381 l -1.933,1.069 l -0.038,0.725 l -0.758,0.115 l 0.228,-0.534 v -0.534 l -0.759,-0.267 l -0.493,0.192 l 0.416,0.802 l 0.303,0.534 v 0.421 l -0.569,-0.114 l -0.113,-0.115 l -0.569,0.611 l 0.303,0.534 l -1.288,-0.038 l 0.416,0.535 l -0.113,0.229 h -0.682 l -0.493,-0.344 l -0.113,-0.955 l -0.796,-0.306 v -0.381 l 1.668,0.344 l 0.909,0.077 l 0.379,-0.573 l -0.341,-0.611 l -2.424,-0.955 l -0.837,0.208 l -0.286,0.246 l 0.089,0.565 l 0.356,0.062 l -0.083,0.890 l 1.098,2.578 l -0.793,1.257 l -0.054,0.283 l 0.403,0.283 l -0.364,0.240 l -0.241,0.005 l 0.045,1.108 l 0.333,0.472 l 0.005,0.458 l 0.427,0.039 l 0.653,0.249 l 0.691,0.950 l 0.008,0.250 l -0.225,0.385 l 0.516,-0.029 l 0.502,0.145 l 0.679,0.960 l 1.671,0.152 l -0.072,1.143 l -0.576,0.493 l 0.119,0.193 l -0.569,0.611 l -0.151,0.573 l 0.341,0.496 l 1.099,0.381 l 0.455,-0.267 l 2.918,1.107 l 0.113,-0.306 l -0.606,-0.573 v -0.725 l -0.379,-0.115 l 0.076,-0.611 l 0.606,-0.725 l -1.087,-0.814 l 0.075,-1.132 l 1.163,-0.765 l 1.364,0.077 l 0.228,0.421 l 1.402,0.077 l 1.024,-0.573 l -0.531,-0.573 l 0.113,-1.069 l 2.652,-1.298 l 2.040,0.920 l 0.682,-0.611 l 2.008,1.909 l 1.515,-0.152 l 0.531,0.534 l 1.440,0.152 l 0.947,-1.298 l 1.212,0.535 l 0.644,0.115 l 0.644,-0.573 l -0.569,-0.382 l 0.493,-0.763 l 1.402,0.458 l 0.303,0.611 l 0.607,0.038 l 0.379,-0.267 l 1.024,-0.038 l 0.113,0.267 l 1.174,0.077 l 0.796,-0.840 l 1.630,0.192 l 0.493,-0.192 l 0.151,-0.917 l -0.493,-1.107 l 0.493,-0.421 h 1.553 l 1.478,1.756 l 1.894,1.069 h 0.569 l 0.075,-0.458 l 0.682,-0.421 l 0.076,2.482 l -0.606,0.038 v 0.611 l 0.341,0.421 l -0.063,0.546 l 0.252,0.104 l 0.152,-0.382 l 0.228,0.077 l 0.151,0.152 l 0.682,-0.152 l 0.681,-1.986 l 0.076,-2.482 l -0.871,-1.986 l -1.099,-1.336 l -0.531,0.077 v 0.421 l -1.288,-0.496 l 0.493,-1.069 l 0.416,-2.826 l 1.743,-0.534 l 0.834,-0.534 h 0.909 l -0.229,0.306 l 0.228,0.382 l 0.796,-0.840 l 0.455,0.038 l -0.075,-0.496 l -0.721,-0.152 l 0.493,-1.794 L 152.200,20.565 L 152.200,20.565 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 104.762,33.845 l -0.226,0.418 l 0.814,0.008 h 0.166 l -0.031,-0.236 l -0.127,-0.149 L 104.762,33.845 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 155.528,29.476 l -0.187,0.232 l 0.015,0.363 l 0.173,-0.015 l 0.288,-0.508 L 155.528,29.476 L 155.528,29.476 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 161.747,15.357 l -0.356,0.232 l -0.084,0.295 l 0.167,0.190 l 0.377,-0.127 l 0.377,0.127 l 0.209,0.063 l -0.021,-0.697 L 161.747,15.357 L 161.747,15.357 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 111.466,15.417 l 0.259,0.104 l -0.182,0.314 v 0.445 l -0.389,0.235 h -0.415 l -0.234,-0.288 l 0.025,-0.314 l 0.182,-0.235 h 0.364 L 111.466,15.417 L 111.466,15.417 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 112.452,15.130 v 0.314 l 0.259,0.210 l 0.363,-0.025 l 0.312,-0.288 v -0.210 h -0.285 l -0.234,0.078 l -0.182,-0.209 L 112.452,15.130 L 112.452,15.130 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 113.933,15.156 l 0.182,0.392 l 0.364,0.026 l 0.259,-0.104 l -0.129,-0.366 l -0.338,-0.079 L 113.933,15.156 L 113.933,15.156 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 115.412,14.633 l -0.285,-0.053 l -0.259,0.262 l 0.130,0.235 l 0.078,0.366 l 0.338,-0.261 l 0.078,-0.288 L 115.412,14.633 L 115.412,14.633 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 116.995,17.406 l -0.078,0.366 l -0.597,0.523 l -1.272,0.288 l -1.039,1.726 l -0.182,0.498 l 1.039,0.263 l 0.155,-0.627 l 0.312,-0.968 l 0.805,-0.419 l 0.675,-0.523 l 0.493,-0.209 h 0.259 v -0.706 L 116.995,17.406 L 116.995,17.406 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 113.647,21.226 l 0.701,0.078 l 0.234,0.811 l 0.597,0.627 l -0.208,0.419 h -0.363 l -0.338,-0.392 l -0.752,-0.025 l -0.312,-0.419 v -0.288 l 0.468,-0.131 L 113.647,21.226 L 113.647,21.226 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 124.604,12.306 l -0.338,-0.210 h -0.389 l -0.078,0.235 l -0.415,0.235 l -0.312,0.104 l -0.051,0.314 l 0.727,0.053 L 124.604,12.306 L 124.604,12.306 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 125.408,12.384 l -0.183,0.392 l -0.363,-0.025 l -0.571,0.419 l -0.155,0.523 h 0.363 l 0.208,-0.341 l 0.493,0.366 l 0.468,-0.210 l 0.338,-0.288 l -0.130,-0.445 l -0.182,-0.314 L 125.408,12.384 L 125.408,12.384 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 126.161,12.672 l 0.182,0.733 l 0.285,0.680 l 0.312,-0.549 l 0.597,-0.131 v -0.392 l -0.389,-0.288 L 126.161,12.672 L 126.161,12.672 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 140.407,11.499 l 0.406,0.341 l 0.288,-0.119 l 0.084,-0.478 l -0.591,-0.409 l -0.389,0.256 l -0.947,0.086 v 0.426 l -0.998,0.017 v 0.698 l 1.167,0.869 l 0.305,-0.222 l -0.068,-0.614 l 0.745,-0.187 l -0.152,-0.290 l -0.270,-0.273 L 140.407,11.499 L 140.407,11.499 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 141.490,11.090 l 0.270,0.511 l 1.050,-0.119 l 0.288,-0.375 l -0.068,-0.324 l -0.288,-0.119 l -0.270,0.205 l -0.778,0.171 L 141.490,11.090 L 141.490,11.090 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 141.422,13.083 l -0.525,-0.136 l -0.303,0.324 l -0.136,0.443 l 0.710,-0.068 l 0.541,-0.273 L 141.422,13.083 L 141.422,13.083 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 155.021,10.136 l -0.440,-0.136 l -0.507,0.187 l -0.253,0.375 l 0.321,0.427 l 0.846,-0.375 l 0.169,-0.187 L 155.021,10.136 L 155.021,10.136 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 155.182,30.363 v 0.639 l 0.202,0.072 l 0.144,-0.232 v -0.493 L 155.182,30.363 L 155.182,30.363 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 149.285,28.053 l -0.013,0.930 l 1.167,1.802 l 0.418,1.568 l 0.736,1.395 l 0.288,0.101 l 0.246,-0.204 l 0.115,-0.335 l -1.052,-1.147 l 0.029,-0.596 l 0.231,-0.101 l 0.057,-0.348 l -2.061,-2.919 L 149.285,28.053 L 149.285,28.053 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 157.417,25.163 l -0.288,0.029 l 0.173,0.247 l 0.360,0.247 l 0.101,-0.116 L 157.417,25.163 L 157.417,25.163 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 157.978,25.338 l 0.044,0.247 l 0.447,0.131 l 0.044,-0.175 L 157.978,25.338 L 157.978,25.338 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 160.428,26.286 l 0.188,0.338 l 0.314,-0.021 l 0.063,-0.232 L 160.428,26.286 L 160.428,26.286 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 163.590,26.814 l 0.252,0.464 l 0.188,-0.211 v -0.317 L 163.590,26.814 L 163.590,26.814 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <path id="rw" d="M 109.959,60.820 l 0.424,0.390 l -0.018,0.418 l -0.657,0.013 v -0.462 L 109.959,60.820 L 109.959,60.820 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="sa" d="M 116.921,47.753 l 1.057,1.473 l 0.341,0.272 l 0.152,0.660 l 1.627,0.128 l 0.184,0.097 l -0.182,0.814 l -1.069,0.630 l -1.564,0.474 l -0.834,0.814 l -0.991,-0.578 l -0.600,0.525 l -0.836,-1.365 l -0.573,-0.262 l -0.208,-0.315 v -0.683 l -2.085,-2.521 l -0.079,-0.447 h 0.600 l 0.730,-0.630 l 0.025,-0.315 l -0.208,-0.209 l 0.418,-0.341 l 0.887,0.053 l 1.512,1.260 l 0.893,-0.040 l 0.057,0.220 L 116.921,47.753 L 116.921,47.753 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <g id="sb">
                            <path d="M 162.967,63.776 l 0.187,0.520 l 0.330,0.321 l 0.099,-0.089 l -0.033,-0.344 l -0.374,-0.454 L 162.967,63.776 L 162.967,63.776 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 163.880,64.551 l 0.023,0.344 l 0.209,0.199 l 0.198,-0.122 l -0.177,-0.367 L 163.880,64.551 L 163.880,64.551 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 164.143,65.405 l -0.177,0.189 l 0.187,0.344 l 0.220,0.066 l -0.010,-0.232 L 164.143,65.405 L 164.143,65.405 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 164.573,65.206 l 0.154,0.377 l 0.297,0.354 l 0.164,-0.265 l -0.220,-0.377 L 164.573,65.206 L 164.573,65.206 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 165.344,65.771 l 0.087,0.466 l 0.210,0.288 l 0.176,-0.365 L 165.344,65.771 L 165.344,65.771 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 165.585,66.813 l -0.077,0.133 l 0.253,0.333 l 0.177,0.011 l -0.110,-0.433 L 165.585,66.813 L 165.585,66.813 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 165.024,67.477 l -0.264,0.122 l 0.231,0.321 l 0.198,-0.112 L 165.024,67.477 L 165.024,67.477 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <g id="sc">
                            <path d="M 119.688,63.600 l -0.092,0.185 l 0.252,0.208 l 0.184,-0.208 L 119.688,63.600 L 119.688,63.600 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 120.975,62.213 l -0.276,0.185 l 0.207,0.324 h 0.276 L 120.975,62.213 L 120.975,62.213 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 121.089,63.023 l -0.184,0.208 l 0.137,0.208 l 0.252,0.047 l 0.023,-0.440 L 121.089,63.023 L 121.089,63.023 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <path id="sd" d="M 107.560,55.954 l -0.445,-0.262 l -0.406,-0.801 l 0.023,-0.745 l 0.562,-0.484 l 0.000,0.000 l 0.027,-1.784 l 0.371,0.011 l -0.042,-0.991 l 3.890,0.035 l 0.556,-0.561 l 1.200,1.919 l -0.658,0.775 v 1.184 l -0.802,1.725 l -0.181,0.401 l -0.647,-0.927 l -0.472,0.600 l -0.534,0.145 l -1.734,-0.174 l -0.756,0.269 L 107.560,55.954 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <g id="se">
                            <path className="mainland" d="M 103.912,25.338 l 0.295,0.273 h 0.553 l 0.305,0.585 l 0.083,1.003 l -0.746,0.529 v 0.529 l -0.526,0.725 l -0.305,0.027 l -0.415,0.697 l 0.027,0.669 l 0.719,0.529 l -0.056,0.306 l -0.276,0.418 l -0.415,0.362 l 0.027,1.199 l -0.636,0.223 l -0.222,0.473 h -0.305 l -0.166,-0.835 l -0.692,-1.061 l 0.569,-0.952 l 0.039,-2.351 l 0.392,-0.216 l 0.095,-1.345 l 1.117,-1.600 L 103.912,25.338 L 103.912,25.338 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 104.028,32.212 l -0.318,0.252 l 0.160,0.369 l 0.282,-0.274 L 104.028,32.212 L 104.028,32.212 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <path id="sg" d="M 141.081,59.908 l 0.120,0.068 l 0.270,-0.022 l -0.023,-0.204 L 141.228,59.785 L 141.081,59.908 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="si" d="M 103.472,38.517 l -0.383,0.229 l -0.715,0.157 l 0.143,0.413 l 0.501,0.006 l 0.462,-0.386 L 103.472,38.517 L 103.472,38.517 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="sk" d="M 103.628,37.785 l 0.104,0.092 l 0.013,0.157 l 1.151,-0.025 l 0.850,-0.367 l -0.013,-0.372 l -0.163,0.072 l -0.234,-0.125 l -0.143,-0.006 l -0.377,0.151 l -0.512,-0.124 L 103.628,37.785 L 103.628,37.785 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="sl" d="M 91.278,56.783 l 0.852,0.823 l 0.608,-0.737 l -0.380,-0.596 l -0.523,0.053 L 91.278,56.783 L 91.278,56.783 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="sn" d="M 91.212,54.861 l -1.010,-0.025 l 0.000,0.000 l 0.187,0.454 l 0.104,-0.280 l 1.268,0.133 l 0.141,-0.005 l 0.594,0.021 l 0.021,-0.262 l -0.543,-0.651 l -0.605,-0.819 l -0.375,-0.157 l -0.290,0.074 l 0.000,0.000 l -0.594,0.431 l -0.135,0.241 l -0.042,0.241 l 0.219,0.157 l 0.730,-0.011 l 0.469,-0.127 l 0.053,0.231 l -0.042,0.305 L 91.212,54.861 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="so" d="M 118.123,55.414 l 0.659,-0.253 l 0.234,0.140 l -0.026,0.585 l -0.607,1.731 l -3.289,3.522 l -0.381,-0.262 l -0.026,-1.486 l 0.495,-0.569 l 1.050,-0.324 l 1.539,-1.625 l 0.403,-0.359 l 0.113,-0.525 L 118.123,55.414 L 118.123,55.414 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="sr" d="M 73.064,57.991 l 0.308,0.282 l 0.476,-0.295 l 0.434,0.014 l -0.056,0.169 l -0.182,0.380 l -0.029,0.946 l -0.867,0.353 l 0.042,-0.606 l -0.559,-0.522 l 0.029,-0.268 L 73.064,57.991 L 73.064,57.991 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="ss" d="M 111.605,56.474 l -0.356,0.157 l 0.113,0.620 h 0.443 l 0.601,0.873 l -0.483,0.062 l -0.124,0.225 l -0.012,0.324 l -1.447,-0.025 l -0.148,-0.225 l -1.012,-0.057 l -1.858,-1.912 l 0.185,-0.112 l 0.788,-0.238 l 1.726,0.132 l 0.587,-0.132 l 0.390,-0.523 L 111.605,56.474 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <g id="st">
                            <path d="M 99.844,60.405 l 0.173,-0.088 l 0.130,0.105 l -0.130,0.200 l -0.157,-0.062 L 99.844,60.405 L 99.844,60.405 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 100.192,59.854 l 0.261,-0.044 l 0.087,0.166 l -0.130,0.140 l -0.130,-0.018 L 100.192,59.854 L 100.192,59.854 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <path id="sv" d="M 59.270,54.241 l 0.709,0.353 l -0.011,-0.559 l -0.363,-0.222 L 59.270,54.241 L 59.270,54.241 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="sy" d="M 111.293,44.117 l -0.053,0.383 l 0.425,0.178 l -0.018,1.062 l 0.425,-0.009 l 0.425,-0.321 l 0.160,-0.027 l 0.965,-0.767 l 0.194,-1.115 l -1.929,0.196 l -0.204,0.446 L 111.293,44.117 L 111.293,44.117 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="sz" d="M 110.418,71.992 l -0.378,0.063 l -0.163,0.445 l 0.289,0.264 h 0.351 l 0.297,-0.427 L 110.418,71.992 L 110.418,71.992 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="td" d="M 103.169,54.200 l 0.020,-0.445 l 0.715,-0.695 l 0.192,-1.707 l -0.476,-0.911 l 0.333,-0.171 l 3.227,1.681 l -0.020,1.649 l -0.568,0.484 v 0.850 l 0.373,0.721 h -0.658 l -1.088,1.077 l -0.029,0.326 l -0.803,-0.011 l -0.011,0.148 l -0.458,-0.060 l -0.314,-0.593 l -0.236,-0.116 l 0.030,-0.181 l 0.295,-0.226 v -1.058 l -0.409,-0.063 l -0.493,-0.367 L 103.169,54.200 L 103.169,54.200 L 103.169,54.200 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="tg" d="M 97.504,58.008 l 0.404,-0.237 l -0.009,-1.560 l -0.262,-0.425 l -0.169,0.142 L 97.504,58.008 L 97.504,58.008 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="th" d="M 138.940,50.351 l 0.488,0.629 v 0.765 l 0.169,0.084 l 0.777,-0.374 l 0.152,0.051 l 0.927,1.071 l -0.033,0.731 l -0.303,-0.051 l -0.270,-0.171 l -0.202,0.017 l -0.354,0.594 l 0.068,0.323 l 0.286,0.152 l -0.017,0.357 l -0.202,0.103 l -0.693,-0.476 v -0.425 l -0.286,-0.017 l -0.118,0.187 l -0.061,1.903 l 0.448,0.817 l 0.793,0.765 l -0.033,0.222 l -0.423,-0.016 l -0.387,-0.578 h -0.406 l -0.506,-0.409 l -0.152,-0.425 l 0.219,-0.357 l 0.075,-0.323 l 0.238,-0.422 l -0.011,-0.971 l -0.582,-0.841 l -0.024,-0.103 l 0.189,-0.190 l -0.044,-0.668 l -0.775,-0.982 l 0.091,-0.565 L 138.940,50.351 L 138.940,50.351 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="tj" d="M 123.886,41.510 l 0.620,-0.769 h 0.234 l 0.081,0.172 l -0.286,0.208 v 0.172 l 0.189,0.136 l 0.906,0.054 l 0.295,-0.127 l 0.134,0.027 l 0.091,0.290 l 0.538,0.054 l 0.270,0.570 l -0.081,0.172 l -0.107,0.009 l -0.107,-0.217 l -0.234,-0.018 l -0.404,0.054 l -0.027,0.380 l -0.404,-0.027 l 0.018,-0.480 l -0.295,-0.289 l -0.449,0.371 l 0.009,0.244 l -0.395,0.136 h -0.234 l 0.018,-0.841 L 123.886,41.510 L 123.886,41.510 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="tm" d="M 118.407,40.870 l -0.093,0.396 h -0.626 v 0.537 l 0.672,0.443 l -0.208,0.607 v 0.280 l 0.279,0.047 l 0.371,-0.490 l 0.835,-0.187 l 1.785,0.677 l 0.023,0.490 l 0.997,0.093 l 1.113,-1.168 l -0.139,-0.374 l -0.742,-0.163 l -2.087,-1.356 l -0.093,-0.490 h -0.789 l -0.348,0.655 h -0.348 L 118.407,40.870 L 118.407,40.870 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="tn" d="M 100.473,43.846 l 0.834,-0.336 l 0.274,0.178 l 0.011,0.217 l -0.128,0.167 l 0.019,0.297 l 0.128,0.069 v 0.534 l -0.148,0.247 l 0.019,0.158 l 0.559,0.197 l -0.451,0.701 l -0.177,-0.011 l -0.030,0.564 l -0.196,0.030 l -0.167,-0.148 l 0.039,-0.573 l -0.549,-0.534 l -0.069,-0.464 l 0.265,-0.208 L 100.473,43.846 L 100.473,43.846 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="tr" d="M 108.723,41.453 l -0.402,-0.249 l -0.222,-0.177 l -0.373,0.160 l 0.000,0.000 l -0.258,0.652 l 0.387,-0.087 l 0.272,-0.207 l 0.600,0.164 l -0.339,0.327 L 107.486,41.993 l -0.333,0.365 v 0.178 l 0.213,0.178 v 0.196 l -0.089,0.232 l 0.089,0.196 l 0.283,-0.142 l 0.283,0.303 l -0.071,0.214 l -0.105,0.143 l 0.158,0.178 l 0.778,0.160 l 0.548,-0.232 v -0.338 l 0.265,0.053 l 0.636,0.374 l 0.689,-0.107 l 0.300,-0.285 l 0.194,0.071 v 0.321 h 0.265 l 0.229,-0.445 l 2.015,-0.214 l 0.879,-0.107 l -0.232,-0.305 l -0.004,-0.411 l 0.176,-0.211 l -0.642,-0.516 l 0.034,-0.445 h -0.353 l -0.585,-0.287 l 0.000,0.000 l -0.336,0.356 l -1.236,-0.036 l -0.742,-0.445 l -0.712,0.064 l -0.793,0.476 L 108.723,41.453 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="tt" d="M 71.422,55.524 l -0.160,0.148 l -0.173,0.027 v 0.214 l 0.320,0.294 l 0.133,-0.214 l 0.080,-0.241 l -0.027,-0.200 L 71.422,55.524 L 71.422,55.524 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="tw" d="M 147.600,47.010 l -0.534,0.407 l -0.028,0.784 l 0.462,0.537 l 0.114,-0.101 L 147.600,47.010 L 147.600,47.010 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="tz" d="M 112.108,65.544 l 2.407,-0.295 l -0.592,-1.146 l -0.032,-1.098 l 0.192,-0.525 l -2.506,-1.574 l -0.785,0.130 l -0.273,0.202 l -0.024,0.460 l -0.177,0.638 l -0.184,0.219 l -0.264,0.025 l 0.490,1.643 l 0.840,0.495 l 0.732,0.017 L 112.108,65.544 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="ua" d="M 106.603,35.677 l -0.437,0.246 l 0.108,0.465 l -0.404,0.852 l 0.003,0.375 l 0.190,0.121 l 1.218,0.060 l 0.341,-0.282 l 0.365,0.122 l 0.523,0.698 l -0.383,0.688 l 0.455,0.133 l 0.596,-0.686 l 0.341,0.062 l 0.317,0.220 l -0.279,0.368 l 0.377,0.588 h 0.401 l 0.207,-0.392 l 0.425,-0.086 l 0.012,-0.318 l -0.790,-0.122 l 0.024,-0.342 h 0.766 l 0.826,-0.662 l 0.365,-0.318 l 0.060,-1.004 l -1.629,-0.146 l -0.668,-0.942 l -0.462,-0.158 l -0.559,0.024 l -0.252,0.623 l -1.146,0.015 l -0.372,-0.172 L 106.603,35.677 L 106.603,35.677 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="ug" d="M 110.031,60.697 l 0.457,0.428 l 0.287,-0.182 l 0.775,-0.127 l 0.133,0.014 l 0.050,-0.294 l 0.437,-0.920 l -0.368,-0.766 l -1.193,0.008 l -0.008,0.315 l 0.160,0.154 l -0.024,0.315 L 110.031,60.697 L 110.031,60.697 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <g id="us">
                            <path className="mainland" d="M 51.295,33.444 l -0.151,0.606 l -0.526,-0.341 h -0.262 l -0.151,0.644 l -1.841,4.125 l 0.489,3.594 l 0.602,0.303 l 0.113,0.985 h 1.239 l 1.202,0.908 l 2.366,0.228 l 0.262,1.211 l 0.375,0.265 l 0.526,-0.529 l 0.413,0.188 l 0.375,1.740 l 0.638,0.416 l 0.526,-0.985 l 1.615,-1.173 l 1.051,0.491 l 0.902,0.076 l 0.038,-0.567 l 1.877,0.038 l 0.375,0.416 l 0.075,0.945 l -0.225,0.529 l 0.262,0.908 h 0.564 l 0.564,-0.870 l -0.225,-0.416 l -0.225,-0.908 l 0.338,-1.022 l 1.540,-1.324 l 1.164,-0.341 l -0.151,-1.098 l 1.615,-1.741 l 1.615,-0.265 l -0.262,-0.906 l 1.577,-0.908 v -1.211 l -0.151,-0.076 l -0.564,0.189 l -0.075,0.742 l -1.874,0.023 l -1.469,0.976 l -2.305,0.754 l -0.368,-0.451 l 1.046,-1.583 l -0.517,-0.493 l -0.351,-0.669 l -0.728,-0.585 l -0.792,-0.066 l -1.496,-1.021 L 51.295,33.444 L 51.295,33.444 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 39.294,17.613 l 0.522,0.976 l 0.335,-0.075 v -0.338 L 39.294,17.613 L 39.294,17.613 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 36.353,26.194 l -0.026,0.454 l 0.326,-0.075 v -0.202 L 36.353,26.194 L 36.353,26.194 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 35.852,26.396 l -0.651,0.329 l 0.101,0.353 l 0.250,-0.202 l 0.501,-0.228 L 35.852,26.396 L 35.852,26.396 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 33.146,26.824 l -0.451,-0.101 l -0.075,0.202 l 0.050,0.378 L 33.146,26.824 L 33.146,26.824 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 32.193,26.800 l -0.427,-0.176 l -0.151,0.277 l 0.276,0.278 L 32.193,26.800 L 32.193,26.800 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 42.904,16.337 l -1.265,0.300 l 0.261,1.425 l 1.377,0.375 l 0.074,0.300 l -2.046,0.638 l -1.154,1.912 l 0.409,2.025 l 0.669,0.449 l 0.522,-0.487 l 0.149,0.300 l -0.633,0.749 l -2.456,1.125 l -1.564,0.375 l -0.038,0.563 l 3.610,-1.049 l 1.488,-0.413 l 1.377,-1.687 l 1.526,-1.012 l -0.781,1.312 l 0.856,0.113 l 1.452,-0.638 l 0.261,1.050 l 1.004,0.225 l 1.042,1.012 l 0.074,0.749 l -0.149,0.187 l 0.185,0.712 h 0.261 l 0.038,-1.200 h 0.297 l 0.074,2.961 l 0.745,-0.638 l -0.522,-3.074 h -0.781 l -0.856,-1.087 l 4.205,-7.125 l -4.168,-3.261 l -4.652,0.900 l -0.185,1.425 l 1.004,0.600 l -0.372,0.976 L 42.904,16.337 L 42.904,16.337 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <path id="uy" d="M 74.154,74.696 l -0.309,0.330 l 0.128,1.776 l 0.971,0.282 l 1.235,-1.238 L 74.154,74.696 L 74.154,74.696 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="uz" d="M 123.695,42.599 l 0.464,0.024 v -0.795 l -0.440,-0.256 l 0.742,-0.935 h 0.302 l 0.302,0.351 l 0.789,-0.303 l -1.090,-0.374 l -0.042,-0.226 l -0.259,0.063 l -0.255,0.443 l -1.099,-0.036 l -0.807,-1.141 l -1.417,0.140 l -0.675,-0.669 l -0.935,-0.158 l -0.679,0.276 l 0.394,1.309 l 0.004,0.440 l 0.287,0.006 l 0.351,-0.670 l 0.935,0.012 l 0.139,0.514 l 2.004,1.330 l 0.775,0.178 L 123.695,42.599 L 123.695,42.599 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <g id="vc">
                            <path d="M 71.396,54.479 l -0.185,0.134 l 0.146,0.268 l 0.240,-0.134 L 71.396,54.479 L 71.396,54.479 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 71.170,55.001 l -0.173,0.173 l 0.066,0.107 h 0.213 l 0.066,-0.175 L 71.170,55.001 L 71.170,55.001 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <path id="ve" d="M 66.630,55.696 l 0.066,0.391 l 0.490,0.156 l 0.112,-0.719 l 0.517,-0.535 l 0.517,0.606 l 1.190,0.324 l 1.007,-0.211 l 0.686,0.846 l 0.517,0.324 l -0.567,0.864 l 0.190,0.654 l -0.324,0.401 l -0.336,0.282 l -0.728,-0.367 l -0.167,0.169 v 0.522 l 0.532,0.253 l -0.392,0.424 l -0.392,0.424 l -0.517,-0.042 l -0.520,-0.571 l -0.110,-2.150 l -1.776,-0.606 l -0.323,-0.945 L 66.630,55.696 L 66.630,55.696 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="vn" d="M 141.206,55.474 l 0.179,0.282 l 0.033,0.323 l 0.472,0.051 l 0.573,-0.765 l 0.540,-0.152 l 0.287,-0.781 l -0.134,-1.257 l -0.556,-0.765 l -0.586,-0.469 l -0.746,-1.282 l 0.535,-0.896 l -0.766,-0.879 l -0.613,-0.027 l -0.552,0.297 l 0.164,0.710 l 0.736,0.130 l 0.198,0.547 l -0.259,0.169 l 0.017,0.136 l 1.726,1.689 l 0.068,0.496 l -0.104,1.568 L 141.206,55.474 L 141.206,55.474 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <g id="vu">
                            <path d="M 167.715,69.462 l -0.187,0.250 l 0.078,0.282 l 0.093,0.063 l 0.171,-0.220 L 167.715,69.462 L 167.715,69.462 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 167.809,70.230 l 0.015,0.204 l 0.202,0.063 l 0.140,-0.078 l -0.140,-0.220 L 167.809,70.230 L 167.809,70.230 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 168.104,72.048 l -0.093,0.142 l 0.140,0.156 l 0.234,-0.078 L 168.104,72.048 L 168.104,72.048 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <g id="ye">
                            <path className="mainland" d="M 115.111,53.179 l 0.217,0.645 v 0.630 l 0.522,0.473 l 3.676,-1.497 l 0.035,-0.411 l -0.590,-1.058 l -1.479,0.472 l -0.849,0.835 l -0.985,-0.582 L 115.111,53.179 L 115.111,53.179 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                            <path d="M 119.277,54.751 l 0.321,0.359 l 0.434,-0.262 l 0.156,-0.053 l -0.199,-0.193 l -0.382,0.113 L 119.277,54.751 L 119.277,54.751 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        </g>
                        <path id="za" d="M 109.406,70.429 l -1.191,1.101 l -0.283,0.680 l -0.944,-0.118 l -0.785,0.698 l -0.522,-0.051 l 0.042,-0.965 l -0.185,-0.065 l -0.130,1.974 l -0.926,-0.009 l -0.279,-0.329 l -0.409,-0.004 l 0.373,1.069 l 0.665,0.629 l -0.475,0.553 l 0.308,0.694 l 0.712,0.272 l 0.567,-0.483 l 1.624,0.009 l 0.116,-0.145 l 0.721,-0.127 l 2.438,-2.428 l -0.009,-0.764 l -0.261,0.338 h -0.390 l -0.475,-0.398 l 0.241,-0.600 l 0.415,-0.084 l -0.038,-1.233 L 109.406,70.429 L 109.406,70.429 z M 108.835,73.218 l 0.228,-0.009 l 0.369,0.401 l -0.011,0.464 l -0.433,0.219 l -0.027,0.154 l -0.660,0.008 l -0.207,-0.498 l 0.189,-0.365 L 108.835,73.218 L 108.835,73.218 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="zm" d="M 106.450,67.575 l 0.478,0.663 l 0.740,0.046 l 0.262,0.145 l 0.775,0.009 l 0.668,-0.936 l 1.867,-0.835 l 0.163,-0.736 l -0.217,-1.054 l -0.974,-0.555 l -0.650,0.045 l -0.324,0.718 l 0.009,0.327 l 0.766,0.373 l 0.045,0.810 l -0.658,0.036 l -0.163,-0.273 l -1.831,-0.781 l -0.054,0.600 l -0.866,0.027 L 106.450,67.575 L 106.450,67.575 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                        <path id="zw" d="M 107.974,68.721 l 1.353,1.528 l 1.037,0.264 l 0.695,-1.090 l -0.054,-1.444 l -1.128,-0.582 l -0.424,0.192 l -0.631,0.964 l -0.875,-0.009 L 107.974,68.721 L 107.974,68.721 z" fill="rgba(99, 102, 241, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.35" />
                    </g>
</svg>
                  {/* Interactive Hotspot Dots for all filtered articles */}
                  {filtered.map(article => {
                    if (!article.coordinates) return null;
                    const isSelected = selectedArticle?.id === article.id;
                    const severityColor = article.severityIndex === 'CRITICAL' 
                      ? 'var(--danger)' 
                      : article.severityIndex === 'ELEVATED' 
                      ? 'var(--warning)' 
                      : 'var(--accent)';
                    
                    return (
                      <div 
                        key={`hotspot-${article.id}`}
                        className={`map-hotspot-marker ${isSelected ? 'active' : ''}`}
                        style={{
                          position: 'absolute',
                          left: `${article.coordinates.x / 2}%`,
                          top: `${article.coordinates.y}%`,
                          transform: 'translate(-50%, -50%)',
                          cursor: 'pointer',
                          zIndex: isSelected ? 15 : 10
                        }}
                        onClick={() => setSelectedArticle(article)}
                      >
                        <div 
                          className="hotspot-dot"
                          style={{
                            width: isSelected ? '12px' : '7px',
                            height: isSelected ? '12px' : '7px',
                            borderRadius: '50%',
                            background: severityColor,
                            boxShadow: `0 0 8px ${severityColor}`,
                            border: '1.5px solid rgba(255, 255, 255, 0.85)',
                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                        ></div>
                        {isSelected && (
                          <div 
                            className="map-pulse-ring" 
                            style={{ 
                              borderColor: severityColor,
                              position: 'absolute',
                              inset: '-8px',
                              borderWidth: '2px',
                              borderStyle: 'solid',
                              borderRadius: '50%',
                              animation: 'mapPulse 2s infinite'
                            }}
                          ></div>
                        )}
                        
                        {/* Hover/Active Tooltip */}
                        <div className="hotspot-tooltip">
                          <div className="tooltip-category">[{article.category}] • {article.source}</div>
                          <div className="tooltip-title">{article.title}</div>
                          <div className="tooltip-footer">
                            <span className="tooltip-severity" style={{ color: severityColor }}>[{article.severityIndex}]</span>
                            <a 
                              href={sanitizeUrl(article.link || '#')} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="tooltip-link"
                              onClick={(e) => e.stopPropagation()}
                              style={{ 
                                color: 'var(--accent)', 
                                textDecoration: 'none', 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '0.15rem',
                                fontWeight: 'bold'
                              }}
                            >
                              <span>Read Source</span>
                              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Media Bias Profile Card with Circular Gauge */}
              <div className="bias-analysis-card" ref={biasCardRef}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div className="bias-card-title">Editorial Leanings Spectrum</div>
                  <span style={{ 
                    fontSize: '0.65rem', 
                    padding: '0.15rem 0.45rem', 
                    borderRadius: '4px', 
                    background: selectedArticle.isPolitical ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                    color: selectedArticle.isPolitical ? 'var(--danger)' : 'var(--accent)',
                    fontWeight: 'bold',
                    border: `1px solid ${selectedArticle.isPolitical ? 'rgba(239, 68, 68, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`
                  }}>
                    {selectedArticle.isPolitical ? 'POLITICAL TOPIC' : 'NON-POLITICAL'}
                  </span>
                </div>
                
                {(() => {
                  const leftPct = selectedArticle.editorialLeanings.left || 0;
                  const centerPct = selectedArticle.editorialLeanings.center || 0;
                  const rightPct = selectedArticle.editorialLeanings.right || 0;
                  const weightedScore = (leftPct * 0) + (centerPct * 50) + (rightPct * 100);
                  const biasIndex = Math.round(weightedScore / 100);
                  const needleRotation = (biasIndex / 100) * 180 - 90;

                  const factualityPct = selectedArticle.factuality === 'High' ? 95 : selectedArticle.factuality === 'Mixed' ? 60 : 30;
                  const radialCircumference = 2 * Math.PI * 22;
                  const radialOffset = radialCircumference * (1 - factualityPct / 100);
                  const credibilityColor = selectedArticle.factuality === 'High' ? 'var(--success)' : selectedArticle.factuality === 'Mixed' ? 'var(--warning)' : 'var(--danger)';

                  return (
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0.5rem 0 1rem 0' }}>
                        {/* Semi-circular dial gauge */}
                        <svg width="200" height="110" viewBox="0 0 200 110" className="gauge-svg">
                          <defs>
                            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="var(--bias-left)" />
                              <stop offset="50%" stopColor="var(--bias-center)" />
                              <stop offset="100%" stopColor="var(--bias-right)" />
                            </linearGradient>
                          </defs>
                          {/* Outer Gauge Track Arc */}
                          <path 
                            d="M 20 100 A 80 80 0 0 1 180 100" 
                            fill="none" 
                            stroke="rgba(255,255,255,0.05)" 
                            strokeWidth="12" 
                            strokeLinecap="round"
                          />
                          {/* Colored gradient arc */}
                          <path 
                            d="M 20 100 A 80 80 0 0 1 180 100" 
                            fill="none" 
                            stroke="url(#gaugeGradient)" 
                            strokeWidth="12" 
                            strokeLinecap="round"
                            strokeDasharray="251.2"
                            strokeDashoffset="0"
                          />
                          {/* Pointer Needle */}
                          <g className="gauge-needle" style={{ transform: `rotate(${needleRotation}deg)`, transformOrigin: '100px 100px' }}>
                            <line x1="100" y1="100" x2="100" y2="35" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                            <circle cx="100" cy="100" r="6" fill="#ffffff" />
                          </g>
                          {/* Score tag in center */}
                          <text x="100" y="95" textAnchor="middle" fill="var(--text-main)" fontSize="10" fontWeight="bold" fontFamily="var(--font-mono)">
                            {biasIndex < 40 ? "Left-Leaning" : biasIndex > 60 ? "Right-Leaning" : "Balanced"}
                          </text>
                        </svg>
                      </div>

                      <div className="bias-bar-labels" style={{ marginTop: '0.2rem', fontSize: '0.75rem' }}>
                        <span style={{color: 'var(--bias-left)'}}>Left ({leftPct}%)</span>
                        <span style={{color: 'var(--bias-center)'}}>Center ({centerPct}%)</span>
                        <span style={{color: 'var(--bias-right)'}}>Right ({rightPct}%)</span>
                      </div>

                      {/* Highly Original Feature: Source Diversity Stacked Bar */}
                      <div className="bias-card-title" style={{ marginTop: '1.25rem', marginBottom: '0.5rem' }}>Source Diversity Index</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                        <span style={{ color: '#60a5fa' }}>Independent ({selectedArticle.sourceDiversity.independent}%)</span>
                        <span style={{ color: '#fb7185' }}>Corporate ({selectedArticle.sourceDiversity.corporate}%)</span>
                        <span style={{ color: '#34d399' }}>Public/State ({selectedArticle.sourceDiversity.statePublic}%)</span>
                      </div>
                      <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.75rem', background: 'rgba(0,0,0,0.1)' }}>
                        <div style={{ height: '100%', background: '#60a5fa', width: `${selectedArticle.sourceDiversity.independent}%` }}></div>
                        <div style={{ height: '100%', background: '#fb7185', width: `${selectedArticle.sourceDiversity.corporate}%` }}></div>
                        <div style={{ height: '100%', background: '#34d399', width: `${selectedArticle.sourceDiversity.statePublic}%` }}></div>
                      </div>

                      {/* Radial Credibility Meter */}
                      <div className="radial-meter-container" style={{ marginTop: '1rem' }}>
                        <div style={{ position: 'relative', width: '54px', height: '54px' }}>
                          <svg className="radial-progress-svg" viewBox="0 0 50 50">
                            <circle className="radial-circle-bg" cx="25" cy="25" r="22" />
                            <circle 
                              className="radial-circle-val" 
                              cx="25" 
                              cy="25" 
                              r="22" 
                              style={{ 
                                strokeDasharray: radialCircumference, 
                                strokeDashoffset: radialOffset,
                                stroke: credibilityColor 
                              }} 
                            />
                          </svg>
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>
                            {factualityPct}%
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Factuality Integrity</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: credibilityColor }}>{selectedArticle.factuality} Quality</span>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Source Ownership: {selectedArticle.sourceOwnership}</span>
                        </div>
                      </div>

                      <div className="credibility-badges" style={{ marginTop: '0.75rem' }}>
                        <div className="cred-badge">
                          <span className="label">Verification Code</span>
                          <span className="value" style={{ fontSize: '0.7rem' }}>OSINT-{(selectedArticle.editorialLeanings.left * 17) % 1000}</span>
                        </div>
                        <div className="cred-badge">
                          <span className="label">Source Type</span>
                          <span className="value" style={{ fontSize: '0.7rem' }}>Multi-Node Ingest</span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Virality & Engagement Analytics Card with Circular Gauge */}
              <div className="bias-analysis-card" style={{ marginTop: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div className="bias-card-title">Virality & Engagement Spectrum</div>
                  <span style={{ 
                    fontSize: '0.65rem', 
                    padding: '0.15rem 0.40rem', 
                    borderRadius: '4px', 
                    background: (selectedArticle.virality?.score || 50) > 70 ? 'rgba(236, 72, 153, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                    color: (selectedArticle.virality?.score || 50) > 70 ? '#ec4899' : '#06b6d4',
                    fontWeight: 'bold',
                    border: `1px solid ${(selectedArticle.virality?.score || 50) > 70 ? 'rgba(236, 72, 153, 0.3)' : 'rgba(6, 182, 212, 0.3)'}`
                  }}>
                    {(selectedArticle.virality?.status || 'Stable').toUpperCase()}
                  </span>
                </div>

                {(() => {
                  const score = selectedArticle.virality?.score || 50;
                  const needleRotation = (score / 100) * 180 - 90;

                  return (
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0.5rem 0 1rem 0' }}>
                        {/* Semi-circular dial gauge */}
                        <svg width="200" height="110" viewBox="0 0 200 110" className="gauge-svg">
                          <defs>
                            <linearGradient id="viralityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#06b6d4" />
                              <stop offset="50%" stopColor="#a855f7" />
                              <stop offset="100%" stopColor="#ec4899" />
                            </linearGradient>
                          </defs>
                          {/* Outer Gauge Track Arc */}
                          <path 
                            d="M 20 100 A 80 80 0 0 1 180 100" 
                            fill="none" 
                            stroke="rgba(255,255,255,0.05)" 
                            strokeWidth="12" 
                            strokeLinecap="round"
                          />
                          {/* Colored gradient arc */}
                          <path 
                            d="M 20 100 A 80 80 0 0 1 180 100" 
                            fill="none" 
                            stroke="url(#viralityGradient)" 
                            strokeWidth="12" 
                            strokeLinecap="round"
                            strokeDasharray="251.2"
                            strokeDashoffset="0"
                          />
                          {/* Pointer Needle */}
                          <g className="gauge-needle" style={{ transform: `rotate(${needleRotation}deg)`, transformOrigin: '100px 100px' }}>
                            <line x1="100" y1="100" x2="100" y2="35" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                            <circle cx="100" cy="100" r="6" fill="#ffffff" />
                          </g>
                          {/* Score tag in center */}
                          <text x="100" y="95" textAnchor="middle" fill="var(--text-main)" fontSize="10" fontWeight="bold" fontFamily="var(--font-mono)">
                            Engagement: {score}%
                          </text>
                        </svg>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', textAlign: 'center', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.15)', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--panel-border)' }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>VIEWS</span>
                          <strong style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>{selectedArticle.virality?.views || 'N/A'}</strong>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.15)', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--panel-border)' }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>READERS</span>
                          <strong style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>{selectedArticle.virality?.readers || 'N/A'}</strong>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.15)', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--panel-border)' }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>SHARES</span>
                          <strong style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>{selectedArticle.virality?.shares || 'N/A'}</strong>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Persona summaries tab switcher */}
              <div className="summary-container" ref={personaTabsRef}>
                <div className="summary-tabs">
                  <button 
                    className={`summary-tab-btn ${activeSummaryTab === 'exec' ? 'active' : ''}`}
                    onClick={() => setActiveSummaryTab('exec')}
                  >
                    Executive
                  </button>
                  <button 
                    className={`summary-tab-btn ${activeSummaryTab === 'journalist' ? 'active' : ''}`}
                    onClick={() => setActiveSummaryTab('journalist')}
                  >
                    Journalist
                  </button>
                  <button 
                    className={`summary-tab-btn ${activeSummaryTab === 'student' ? 'active' : ''}`}
                    onClick={() => setActiveSummaryTab('student')}
                  >
                    Student
                  </button>
                  <button 
                    className={`summary-tab-btn ${activeSummaryTab === 'it' ? 'active' : ''}`}
                    onClick={() => setActiveSummaryTab('it')}
                  >
                    IT & Security
                  </button>
                </div>

                <div className="summary-textbox">
                  {activeSummaryTab === 'exec' && (
                    <p style={{fontSize: '0.85rem', lineHeight: 1.5}}>{selectedArticle.summaries.exec}</p>
                  )}
                  {activeSummaryTab === 'journalist' && (
                    <p style={{fontSize: '0.85rem', lineHeight: 1.5}}>{selectedArticle.summaries.journalist}</p>
                  )}
                  {activeSummaryTab === 'student' && (
                    <p style={{fontSize: '0.85rem', lineHeight: 1.5}}>{selectedArticle.summaries.student}</p>
                  )}
                  {activeSummaryTab === 'it' && (
                    <p style={{fontSize: '0.85rem', lineHeight: 1.5, fontFamily: 'var(--font-mono)'}}>{selectedArticle.summaries.it}</p>
                  )}
                </div>
              </div>

              {/* Highly Original Feature: Extracted Entity Tags */}
              <div className="compare-card">
                <div className="bias-card-title">Extracted Intelligence Entities</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
                  {selectedArticle.entities.map((ent, idx) => (
                    <span 
                      key={idx} 
                      onClick={() => setSearch(ent)}
                      style={{
                        fontSize: '0.75rem',
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: 'var(--accent)',
                        border: '1px solid rgba(99, 102, 241, 0.25)',
                        borderRadius: '6px',
                        padding: '0.2rem 0.5rem',
                        cursor: 'pointer',
                        fontWeight: '500',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'var(--accent)';
                        e.target.style.color = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(99, 102, 241, 0.1)';
                        e.target.style.color = 'var(--accent)';
                      }}
                    >
                      {ent}
                    </span>
                  ))}
                </div>
              </div>

              {/* Compare coverage headlines grid */}
              <div className="compare-card">
                <div className="bias-card-title">Compare Outlets Headlines</div>
                {selectedArticle.compareHeadlines.map((h, idx) => {
                  let colorClass = 'center';
                  if (h.outlet.includes('Progressive')) colorClass = 'left';
                  if (h.outlet.includes('Conservative')) colorClass = 'right';

                  return (
                    <div className="compare-row" key={idx}>
                      <span className={`compare-outlet ${colorClass}`}>{h.outlet}</span>
                      <span className="compare-headline">"{h.title}"</span>
                    </div>
                  );
                })}
              </div>

              {/* OSINT Action center */}
              <div className="action-center" ref={actionCenterRef}>
                <button className="action-btn secondary" onClick={compileCitation}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                  <span>Cite Source</span>
                </button>
                <button className="action-btn primary" onClick={compileAndCopyReport}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  <span>Export Report</span>
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Copy notification toast */}
      {toastMessage && (
        <div className="toast-msg">
          {toastMessage}
        </div>
      )}

      {/* Dynamic Guided Onboarding Tutorial */}
      {tutorialStep > 0 && (
        <div className="tutorial-overlay">
          <div className="tutorial-backdrop"></div>
          <div className="tutorial-spotlight" style={spotlightStyle}></div>
          <div className="tutorial-tooltip" style={tooltipStyle}>
            {spotlightStyle.display !== 'none' && tutorialStep === 1 && <div className="tutorial-pointer pointer-right"></div>}
            {spotlightStyle.display !== 'none' && tutorialStep === 2 && <div className="tutorial-pointer pointer-right"></div>}
            {spotlightStyle.display !== 'none' && tutorialStep === 3 && <div className="tutorial-pointer pointer-left"></div>}
            {spotlightStyle.display !== 'none' && tutorialStep === 4 && <div className="tutorial-pointer pointer-bottom"></div>}

            <h3 className="tutorial-header">{tutorialMessages[tutorialStep]?.title}</h3>
            <p className="tutorial-desc">{tutorialMessages[tutorialStep]?.desc}</p>
            
            <div className="tutorial-nav">
              <div className="tutorial-dots">
                {[1,2,3,4].map(n => (
                  <div key={n} className={`tutorial-dot ${tutorialStep === n ? 'active' : ''}`}></div>
                ))}
              </div>
              <button className="tutorial-btn" onClick={handleTutorialNext}>
                {tutorialStep === 4 ? 'Complete' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings modal */}
      {isSettingsOpen && (
        <div className="modal-overlay" onClick={() => setIsSettingsOpen(false)}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">System Settings Console</span>
              <button className="modal-close-btn" onClick={() => setIsSettingsOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="modal-sidebar">
                <button className="modal-tab-btn active">Preferences</button>
              </div>
              <div className="modal-content-area">
                <div className="settings-section-title">Ingestion Preferences</div>
                <div className="settings-row">
                  <label className="settings-label">Signal Refresh Rate</label>
                  <select 
                    className="settings-select" 
                    value={refreshRate} 
                    onChange={e => setRefreshRate(e.target.value)}
                  >
                    <option value="realtime">Real-time Stream</option>
                    <option value="5m">5 Minute Ingest Poll</option>
                    <option value="15m">15 Minute Ingest Poll</option>
                  </select>
                </div>
                <div className="settings-row">
                  <label className="settings-label">Max Inbound Stories</label>
                  <select 
                    className="settings-select" 
                    value={maxStories} 
                    onChange={e => setMaxStories(Number(e.target.value))}
                  >
                    <option value={20}>20 Signals</option>
                    <option value={50}>50 Signals</option>
                    <option value={100}>100 Signals</option>
                  </select>
                </div>

                <div className="settings-section-title" style={{ marginTop: '0.75rem' }}>Content Preferences</div>
                <div className="settings-row" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Preferred topics on home feed:</span>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.25rem', width: '100%' }}>
                    {['Security & IT', 'Geopolitics', 'Science & Research', 'Market & Finance'].map(cat => (
                      <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                        <input 
                          type="checkbox"
                          checked={preferredCategories.includes(cat)}
                          onChange={e => {
                            if (e.target.checked) {
                              setPreferredCategories(prev => [...prev, cat]);
                            } else {
                              setPreferredCategories(prev => prev.filter(c => c !== cat));
                            }
                          }}
                          style={{ accentColor: 'var(--accent)', cursor: 'pointer' }}
                        />
                        <span>{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="settings-section-title" style={{ marginTop: '0.75rem' }}>Interface Configurations</div>
                <div className="settings-row">
                  <label className="settings-label">Layout Density</label>
                  <select 
                    className="settings-select" 
                    value={layoutDensity} 
                    onChange={e => setLayoutDensity(e.target.value)}
                  >
                    <option value="comfortable">Comfortable (Standard)</option>
                    <option value="compact">Compact Analyst Grid</option>
                  </select>
                </div>

                <div className="settings-section-title" style={{ marginTop: '0.75rem' }}>Theme Console Schema</div>
                <div className="theme-swatches-grid">
                  <div 
                    className={`theme-swatch-card ${themeScheme === 'space-blue' ? 'active' : ''}`}
                    onClick={() => setThemeScheme('space-blue')}
                  >
                    <span className="theme-swatch-title" style={{ color: '#6366f1' }}>Space Blue</span>
                    <div className="theme-swatch-preview">
                      <div className="theme-color-pill" style={{ background: '#0b0f19' }}></div>
                      <div className="theme-color-pill" style={{ background: '#6366f1' }}></div>
                    </div>
                  </div>
                  <div 
                    className={`theme-swatch-card ${themeScheme === 'cyber-amber' ? 'active' : ''}`}
                    onClick={() => setThemeScheme('cyber-amber')}
                  >
                    <span className="theme-swatch-title" style={{ color: '#f59e0b' }}>Cyber Amber</span>
                    <div className="theme-swatch-preview">
                      <div className="theme-color-pill" style={{ background: '#060400' }}></div>
                      <div className="theme-color-pill" style={{ background: '#f59e0b' }}></div>
                    </div>
                  </div>
                  <div 
                    className={`theme-swatch-card ${themeScheme === 'radar-green' ? 'active' : ''}`}
                    onClick={() => setThemeScheme('radar-green')}
                  >
                    <span className="theme-swatch-title" style={{ color: '#10b981' }}>Radar Green</span>
                    <div className="theme-swatch-preview">
                      <div className="theme-color-pill" style={{ background: '#000802' }}></div>
                      <div className="theme-color-pill" style={{ background: '#10b981' }}></div>
                    </div>
                  </div>
                  <div 
                    className={`theme-swatch-card ${themeScheme === 'polar-light' ? 'active' : ''}`}
                    onClick={() => setThemeScheme('polar-light')}
                  >
                    <span className="theme-swatch-title" style={{ color: '#4f46e5' }}>Polar Light</span>
                    <div className="theme-swatch-preview">
                      <div className="theme-color-pill" style={{ background: '#f8fafc' }}></div>
                      <div className="theme-color-pill" style={{ background: '#4f46e5' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help modal */}
      {isHelpOpen && (
        <div className="modal-overlay" onClick={() => setIsHelpOpen(false)}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Help & Documentation</span>
              <button className="modal-close-btn" onClick={() => setIsHelpOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="modal-sidebar">
                <button className="modal-tab-btn active">OSINT Cheatsheet</button>
              </div>
              <div className="modal-content-area">
                <div className="settings-section-title">Keyboard Shortcuts</div>
                <div className="help-keybind-list">
                  <div className="help-keybind-row">
                    <span>Command Center Console</span>
                    <kbd>Ctrl + K</kbd>
                  </div>
                  <div className="help-keybind-row">
                    <span>Open Preferences Settings</span>
                    <kbd>Ctrl + ,</kbd>
                  </div>
                  <div className="help-keybind-row">
                    <span>Toggle Help & Manual</span>
                    <kbd>?</kbd>
                  </div>
                  <div className="help-keybind-row">
                    <span>Switch Layout: Stream Feed</span>
                    <kbd>L</kbd>
                  </div>
                  <div className="help-keybind-row">
                    <span>Switch Layout: 3D Cards</span>
                    <kbd>C</kbd>
                  </div>
                  <div className="help-keybind-row">
                    <span>Close Active Overlay/Modal</span>
                    <kbd>Esc</kbd>
                  </div>
                </div>

                <div className="settings-section-title" style={{ marginTop: '0.75rem' }}>OSINT Terminology Manual</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <div>
                    <strong style={{ color: 'var(--text-main)' }}>Editorial Stance Analytics:</strong> Maps left/right political framing of active media coverage.
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-main)' }}>Source Diversity Index:</strong> Tracks ownership patterns (Independent, Corporate, or State-controlled).
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-main)' }}>Factuality Integrity:</strong> Semi-automated verification metrics scoring source reliability.
                  </div>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--panel-border)', display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    className="action-btn primary" 
                    onClick={() => {
                      setTutorialStep(1);
                      setIsHelpOpen(false);
                    }}
                  >
                    Relaunch Guided Tutorial
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Command Palette Overlay Modal */}
      {isCmdOpen && (
        <div className="cmd-palette-overlay" onClick={() => setIsCmdOpen(false)}>
          <div className="cmd-palette-container" onClick={e => e.stopPropagation()}>
            <div className="cmd-palette-input-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input 
                type="text" 
                className="cmd-palette-search" 
                placeholder="Type command name or news keywords..." 
                value={cmdSearch}
                onChange={e => {
                  setCmdSearch(e.target.value);
                  setCmdSelectedIndex(0);
                }}
                onKeyDown={handleCommandKeyDown}
                autoFocus
              />
              <span className="cmd-palette-shortcut" style={{ fontSize: '0.6rem' }}>ESC</span>
            </div>
            
            <div className="cmd-palette-list custom-scroll">
              {filteredCommands.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  No matching actions or queries found.
                </div>
              ) : (
                filteredCommands.map((cmd, idx) => (
                  <div 
                    key={idx}
                    className={`cmd-palette-item ${cmdSelectedIndex === idx ? 'active' : ''}`}
                    onClick={() => handleCommandSelect(idx)}
                    onMouseEnter={() => setCmdSelectedIndex(idx)}
                  >
                    <span>{cmd.label}</span>
                    {cmd.shortcut && (
                      <kbd className="cmd-palette-shortcut">{cmd.shortcut}</kbd>
                    )}
                  </div>
                ))
              )}
            </div>
            
            <div className="cmd-palette-footer">
              <span>Use ↑↓ to navigate, Enter to select</span>
              <span>NewsRadar OSS Command Console</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
